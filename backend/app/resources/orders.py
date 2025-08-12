from decimal import Decimal
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Order, OrderItem, Product, User
from ..schemas import OrderSchema
from ..email_utils import send_order_confirmation_email
from . import admin_required


order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)


class OrderListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        show_all = request.args.get("all") == "true"
        query = Order.query
        if not show_all:
            query = query.filter_by(user_id=user_id)
        orders = query.order_by(Order.created_at.desc()).all()
        return {"items": orders_schema.dump(orders)}

    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        items = data.get("items", [])
        if not items:
            return {"message": "No items provided"}, 400
        order = Order(user_id=user_id, status="pending")
        total = Decimal("0.00")
        for item in items:
            product_id = int(item.get("productId"))
            quantity = int(item.get("quantity", 1))
            product = db.session.get(Product, product_id)
            if not product or product.inventory < quantity:
                return {"message": f"Product {product_id} unavailable"}, 400
            line_price = Decimal(product.price) * quantity
            total += line_price
            order_item = OrderItem(order=order, product=product, quantity=quantity, unit_price=product.price)
            db.session.add(order_item)
            product.inventory -= quantity
        order.total_amount = total
        db.session.add(order)
        db.session.commit()
        return {"order": order_schema.dump(order)}, 201


class OrderResource(Resource):
    @jwt_required()
    def get(self, order_id: int):
        user_id = int(get_jwt_identity())
        order = db.session.get(Order, order_id)
        if not order:
            return {"message": "Order not found"}, 404
        # Only owner or admin can view
        requester: User | None = db.session.get(User, user_id)
        if requester is None:
            return {"message": "Unauthorized"}, 401
        if not requester.is_admin and order.user_id != user_id:
            return {"message": "Forbidden"}, 403
        return {"order": order_schema.dump(order)}


class OrderStatusResource(Resource):
    @jwt_required()
    def put(self, order_id: int):
        admin_required()
        order = db.session.get(Order, order_id)
        if not order:
            return {"message": "Order not found"}, 404
        data = request.get_json() or {}
        status = data.get("status")
        if status not in {"pending", "paid", "shipped", "delivered", "cancelled"}:
            return {"message": "Invalid status"}, 400
        order.status = status
        db.session.commit()
        return {"order": order_schema.dump(order)}


class CheckoutResource(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        order_id = data.get("orderId")
        if not order_id:
            return {"message": "orderId required"}, 400
        order = db.session.get(Order, int(order_id))
        if not order or order.user_id != user_id:
            return {"message": "Order not found"}, 404
        if order.status != "pending":
            return {"message": "Order is not pending"}, 400
        # Simulate payment approved
        order.status = "paid"
        db.session.commit()
        # Send confirmation email
        user = db.session.get(User, user_id)
        try:
            send_order_confirmation_email(user.email, order.id, str(order.total_amount))
        except Exception:
            # Do not fail checkout on email issues
            pass
        return {"order": order_schema.dump(order), "message": "Payment successful"}


def register_order_resources(api):
    api.add_resource(OrderListResource, "/orders")
    api.add_resource(OrderResource, "/orders/<int:order_id>")
    api.add_resource(CheckoutResource, "/checkout")
    api.add_resource(OrderStatusResource, "/orders/<int:order_id>/status")