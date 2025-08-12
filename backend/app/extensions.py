from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_login import LoginManager
from flask_restful import Api


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()
login_manager = LoginManager()
api = Api(prefix="/api")