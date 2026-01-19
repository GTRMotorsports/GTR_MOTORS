import os
import razorpay
import hmac
import hashlib
from dotenv import load_dotenv

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    print("Warning: Razorpay credentials not found in environment variables")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


def create_razorpay_order(amount: float, currency: str = "INR", receipt: str = None):
    """
    Create a Razorpay order.
    Amount should be in rupees (will be converted to paise internally).
    """
    amount_in_paise = int(amount * 100)
    
    order_data = {
        "amount": amount_in_paise,
        "currency": currency,
        "receipt": receipt or f"order_{int(os.times().elapsed * 1000)}",
        "payment_capture": 1  # Auto capture payment
    }
    
    order = razorpay_client.order.create(data=order_data)
    return order


def verify_payment_signature(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
    """
    Verify Razorpay payment signature to ensure payment authenticity.
    """
    try:
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(generated_signature, razorpay_signature)
    except Exception as e:
        print(f"Signature verification failed: {e}")
        return False


def get_payment_details(payment_id: str):
    """Fetch payment details from Razorpay."""
    try:
        return razorpay_client.payment.fetch(payment_id)
    except Exception as e:
        print(f"Failed to fetch payment: {e}")
        return None
