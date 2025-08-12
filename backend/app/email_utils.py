from flask_mail import Message
from flask import current_app
from .extensions import mail


def send_order_confirmation_email(to_email: str, order_id: int, total_amount: str) -> None:
    subject = f"SmartShop Order #{order_id} Confirmation"
    body = f"Thank you for your order! Your order #{order_id} totaling ${total_amount} has been confirmed."
    msg = Message(subject=subject, recipients=[to_email], body=body)
    mail.send(msg)