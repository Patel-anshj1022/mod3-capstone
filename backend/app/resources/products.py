from decimal import Decimal
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from sqlalchemy import or_, and_
from ..extensions import db
from ..models import Product, Category
from ..schemas import ProductSchema, CategorySchema
from . import admin_required


product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


class ProductListResource(Resource):
    def get(self):
        q = (request.args.get("q") or "").strip()
        category = (request.args.get("category") or "").strip()
        min_price = request.args.get("minPrice")
        max_price = request.args.get("maxPrice")
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("perPage", 20))

        query = Product.query
        if q:
            like = f"%{q}%"
            query = query.filter(or_(Product.title.ilike(like), Product.description.ilike(like)))
        if category:
            query = query.join(Category).filter(Category.name == category)
        if min_price:
            query = query.filter(Product.price >= Decimal(min_price))
        if max_price:
            query = query.filter(Product.price <= Decimal(max_price))

        pagination = query.order_by(Product.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
        return {
            "items": products_schema.dump(pagination.items),
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }

    @jwt_required()
    def post(self):
        admin_required()
        data = request.get_json() or {}
        title = data.get("title")
        price = data.get("price")
        if title is None or price is None:
            return {"message": "title and price are required"}, 400
        cat_name = data.get("category")
        category = None
        if cat_name:
            category = Category.query.filter_by(name=cat_name).first()
            if not category:
                category = Category(name=cat_name)
                db.session.add(category)
                db.session.flush()
        product = Product(
            title=title,
            description=data.get("description"),
            price=Decimal(str(price)),
            image_url=data.get("image_url"),
            inventory=int(data.get("inventory", 0)),
            category=category,
        )
        db.session.add(product)
        db.session.commit()
        return {"product": product_schema.dump(product)}, 201


class ProductResource(Resource):
    def get(self, product_id: int):
        product = db.session.get(Product, product_id)
        if not product:
            return {"message": "Product not found"}, 404
        return {"product": product_schema.dump(product)}

    @jwt_required()
    def put(self, product_id: int):
        admin_required()
        product = db.session.get(Product, product_id)
        if not product:
            return {"message": "Product not found"}, 404
        data = request.get_json() or {}
        if "title" in data:
            product.title = data["title"]
        if "description" in data:
            product.description = data["description"]
        if "price" in data:
            product.price = Decimal(str(data["price"]))
        if "image_url" in data:
            product.image_url = data["image_url"]
        if "inventory" in data:
            product.inventory = int(data["inventory"])
        if "category" in data:
            cat_name = data.get("category")
            if cat_name:
                category = Category.query.filter_by(name=cat_name).first()
                if not category:
                    category = Category(name=cat_name)
                    db.session.add(category)
                    db.session.flush()
                product.category = category
            else:
                product.category = None
        db.session.commit()
        return {"product": product_schema.dump(product)}

    @jwt_required()
    def delete(self, product_id: int):
        admin_required()
        product = db.session.get(Product, product_id)
        if not product:
            return {"message": "Product not found"}, 404
        db.session.delete(product)
        db.session.commit()
        return {"message": "Deleted"}, 200


class CategoryListResource(Resource):
    def get(self):
        categories = Category.query.order_by(Category.name.asc()).all()
        return {"items": categories_schema.dump(categories)}


def register_product_resources(api):
    api.add_resource(ProductListResource, "/products")
    api.add_resource(ProductResource, "/products/<int:product_id>")
    api.add_resource(CategoryListResource, "/categories")