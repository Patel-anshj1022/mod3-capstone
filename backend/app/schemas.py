from marshmallow import Schema, fields


class UserSchema(Schema):
    id = fields.Int()
    email = fields.Email()
    name = fields.Str()
    role = fields.Str()
    created_at = fields.DateTime()


class CategorySchema(Schema):
    id = fields.Int()
    name = fields.Str()


class ProductSchema(Schema):
    id = fields.Int()
    title = fields.Str()
    description = fields.Str()
    price = fields.Decimal(as_string=True)
    image_url = fields.Str(allow_none=True)
    inventory = fields.Int()
    category = fields.Nested(CategorySchema, allow_none=True)


class OrderItemSchema(Schema):
    id = fields.Int()
    quantity = fields.Int()
    unit_price = fields.Decimal(as_string=True)
    product = fields.Nested(ProductSchema)


class OrderSchema(Schema):
    id = fields.Int()
    status = fields.Str()
    total_amount = fields.Decimal(as_string=True)
    created_at = fields.DateTime()
    items = fields.List(fields.Nested(OrderItemSchema))


class CartItemSchema(Schema):
    id = fields.Int()
    quantity = fields.Int()
    product = fields.Nested(ProductSchema)