from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import CartItem, Product
from ..schemas import CartItemSchema


cart_item_schema = CartItemSchema()
cart_items_schema = CartItemSchema(many=True)


class CartResource(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        items = CartItem.query.filter_by(user_id=user_id).all()
        return {"items": cart_items_schema.dump(items)}

    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        items = data.get("items", [])
        # Replace cart
        CartItem.query.filter_by(user_id=user_id).delete()
        for item in items:
            product_id = int(item.get("productId"))
            quantity = int(item.get("quantity", 1))
            product = db.session.get(Product, product_id)
            if not product:
                continue
            db.session.add(CartItem(user_id=user_id, product_id=product_id, quantity=quantity))
        db.session.commit()
        return {"message": "Cart updated"}, 200

    @jwt_required()
    def delete(self):
        user_id = int(get_jwt_identity())
        CartItem.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return {"message": "Cart cleared"}


def register_cart_resources(api):
    api.add_resource(CartResource, "/cart")