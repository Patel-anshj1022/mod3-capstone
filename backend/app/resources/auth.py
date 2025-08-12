from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from flask_login import login_user, logout_user, current_user
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models import User
from ..schemas import UserSchema


user_schema = UserSchema()


class SignupResource(Resource):
    def post(self):
        data = request.get_json() or {}
        email = data.get("email")
        name = data.get("name")
        password = data.get("password")
        if not email or not name or not password:
            return {"message": "email, name, and password are required"}, 400
        user = User(email=email, name=name)
        user.set_password(password)
        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"message": "Email already registered"}, 400
        return {"user": user_schema.dump(user)}, 201


class LoginResource(Resource):
    def post(self):
        data = request.get_json() or {}
        email = data.get("email")
        password = data.get("password")
        use_session = bool(data.get("useSession"))
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"message": "Invalid email or password"}, 401
        additional_claims = {"role": user.role}
        access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
        response = {"accessToken": access_token, "user": user_schema.dump(user)}
        if use_session:
            # Set JWT as HttpOnly cookie for session-like auth
            from flask import make_response
            resp = make_response(response)
            set_access_cookies(resp, access_token)
            login_user(user)
            return resp, 200
        return response, 200


class LogoutResource(Resource):
    def post(self):
        # Clear session cookie if any
        from flask import make_response
        resp = make_response({"message": "Logged out"})
        unset_jwt_cookies(resp)
        try:
            logout_user()
        except Exception:
            pass
        return resp, 200


class MeResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = db.session.get(User, int(user_id))
        return {"user": user_schema.dump(user)}


def register_auth_resources(api):
    api.add_resource(SignupResource, "/auth/signup")
    api.add_resource(LoginResource, "/auth/login")
    api.add_resource(LogoutResource, "/auth/logout")
    api.add_resource(MeResource, "/auth/me")