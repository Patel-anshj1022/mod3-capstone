from flask_restful import Resource
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models import User
from ..schemas import UserSchema
from . import admin_required


users_schema = UserSchema(many=True)


class UserListResource(Resource):
    @jwt_required()
    def get(self):
        admin_required()
        users = User.query.order_by(User.created_at.desc()).all()
        return {"items": users_schema.dump(users)}


def register_user_resources(api):
    api.add_resource(UserListResource, "/users")