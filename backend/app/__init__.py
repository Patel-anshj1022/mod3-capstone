import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from .extensions import db, migrate, jwt, mail, login_manager, api
from .config import Config
from .models import User, Category, Product


def create_app(config_object: type[Config] | None = None) -> Flask:
    load_dotenv()
    app = Flask(__name__)

    # Load configuration
    config_class = config_object or Config
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app, supports_credentials=True, origins=app.config.get("CORS_ORIGINS", ["*"]))
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    login_manager.init_app(app)

    # Flask-Login configuration
    @login_manager.user_loader
    def load_user(user_id: str):
        return db.session.get(User, int(user_id))

    # Register API resources
    from .resources.auth import register_auth_resources
    from .resources.products import register_product_resources
    from .resources.orders import register_order_resources
    from .resources.cart import register_cart_resources
    from .resources.users import register_user_resources

    register_auth_resources(api)
    register_product_resources(api)
    register_order_resources(api)
    register_cart_resources(api)
    register_user_resources(api)

    api.init_app(app)

    # Create tables and seed minimal data if empty
    with app.app_context():
        db.create_all()
        # Ensure an admin user exists
        admin_email = app.config.get("ADMIN_EMAIL")
        admin_password = app.config.get("ADMIN_PASSWORD")
        admin = User.query.filter_by(email=admin_email).first()
        if not admin:
            admin = User(email=admin_email, name="Admin", role="admin")
            admin.set_password(admin_password)
            db.session.add(admin)
            db.session.commit()
        # Seed sample categories/products if none
        if Category.query.count() == 0:
            electronics = Category(name="Electronics")
            fashion = Category(name="Fashion")
            db.session.add_all([electronics, fashion])
            db.session.flush()
            db.session.add_all([
                Product(title="Smartphone X", description="Latest smartphone", price=699.99, image_url="", inventory=50, category=electronics),
                Product(title="Wireless Headphones", description="Noise cancelling", price=199.99, image_url="", inventory=100, category=electronics),
                Product(title="Sneakers", description="Comfortable running shoes", price=89.99, image_url="", inventory=80, category=fashion),
            ])
            db.session.commit()

    return app