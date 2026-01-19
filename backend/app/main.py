from __future__ import annotations
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .crud import init_db, list_products, get_product_by_id, get_categories, get_brands, create_order, list_orders
from .schemas import (
  Product,
  Brand,
  Order,
  OrderCreateRequest,
  OrderCreateResponse,
  ProductsResponse,
  RazorpayOrderRequest,
  RazorpayOrderResponse,
  PaymentVerificationRequest,
)
from .models import ProductDB, BrandDB, OrderDB
from .razorpay_utils import create_razorpay_order, verify_payment_signature, RAZORPAY_KEY_ID

app = FastAPI(title="GTR Motors API", version="0.1.0")

# Create tables on startup
Base.metadata.create_all(bind=engine)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
  """Initialize database with seed data on startup."""
  db = next(get_db())
  try:
    init_db(db)
  finally:
    db.close()


@app.get("/health")
def health() -> dict:
  return {"status": "ok", "uptimeSeconds": round(datetime.now().timestamp())}


@app.get("/products", response_model=ProductsResponse)
def list_products_endpoint(
  q: Optional[str] = Query(default=None, description="Full-text search"),
  brand: Optional[str] = Query(default=None),
  category: Optional[str] = Query(default=None),
  minPrice: Optional[float] = Query(default=None, ge=0),
  maxPrice: Optional[float] = Query(default=None, ge=0),
  sort: Optional[str] = Query(default=None, description="price-asc|price-desc|rating-desc"),
  db: Session = Depends(get_db),
):
  result = list_products(db, q=q, brand=brand, category=category, min_price=minPrice, max_price=maxPrice)

  products_list: List[Product] = [
    Product(
      id=p.id,
      name=p.name,
      description=p.description,
      price=p.price,
      brand=p.brand,
      category=p.category,
      imageUrl=p.imageUrl,
      imageHint=p.imageHint,
      rating=p.rating,
      reviewCount=p.reviewCount,
      discount=p.discount,
    )
    for p in result
  ]

  if sort == "price-asc":
    products_list.sort(key=lambda p: p.price)
  elif sort == "price-desc":
    products_list.sort(key=lambda p: p.price, reverse=True)
  elif sort == "rating-desc":
    products_list.sort(key=lambda p: p.rating, reverse=True)

  return {"items": products_list, "total": len(products_list)}


@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: str, db: Session = Depends(get_db)):
  product = get_product_by_id(db, product_id)
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")
  return Product(
    id=product.id,
    name=product.name,
    description=product.description,
    price=product.price,
    brand=product.brand,
    category=product.category,
    imageUrl=product.imageUrl,
    imageHint=product.imageHint,
    rating=product.rating,
    reviewCount=product.reviewCount,
    discount=product.discount,
  )


@app.get("/brands", response_model=List[Brand])
def list_brands(db: Session = Depends(get_db)):
  brands_db = get_brands(db)
  return [
    Brand(id=b.id, name=b.name, logoUrl=b.logoUrl, logoHint=b.logoHint)
    for b in brands_db
  ]


@app.get("/categories", response_model=List[str])
def list_categories(db: Session = Depends(get_db)):
  return get_categories(db)


@app.get("/orders", response_model=List[Order])
def list_orders_endpoint(db: Session = Depends(get_db)):
  """This returns order metadata. For full order details with items, use POST."""
  orders_db = list_orders(db)
  result = []
  for order in orders_db:
    items = []
    for product in order.products:
      items.append({
        "product": Product(
          id=product.id,
          name=product.name,
          description=product.description,
          price=product.price,
          brand=product.brand,
          category=product.category,
          imageUrl=product.imageUrl,
          imageHint=product.imageHint,
          rating=product.rating,
          reviewCount=product.reviewCount,
          discount=product.discount,
        ),
        "quantity": 1  # Note: schema association_table stores quantity; adjust if needed
      })
    result.append(Order(
      id=order.id,
      date=order.date,
      status=order.status,
      total=order.total,
      items=items,
    ))
  return result


@app.post("/orders", response_model=OrderCreateResponse, status_code=201)
def create_order_endpoint(payload: OrderCreateRequest, db: Session = Depends(get_db)):
  product_ids = []
  total = 0.0

  for item in payload.items:
    product = get_product_by_id(db, item.productId)
    if not product:
      raise HTTPException(status_code=400, detail=f"Unknown product: {item.productId}")
    product_ids.append((item.productId, item.quantity))
    total += product.price * item.quantity

  order_id = f"ORD-{int(datetime.utcnow().timestamp() * 1000)}"
  order_db = create_order(db, order_id, datetime.utcnow().strftime("%Y-%m-%d"), round(total, 2), product_ids)

  items = []
  for product_id, qty in product_ids:
    product = get_product_by_id(db, product_id)
    items.append({
      "product": Product(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        brand=product.brand,
        category=product.category,
        imageUrl=product.imageUrl,
        imageHint=product.imageHint,
        rating=product.rating,
        reviewCount=product.reviewCount,
        discount=product.discount,
      ),
      "quantity": qty,
    })

  new_order = Order(
    id=order_db.id,
    date=order_db.date,
    status=order_db.status,
    total=order_db.total,
    items=items,
  )

  return {"order": new_order}


# ===== Payment Routes =====

@app.post("/payments/create-order", response_model=RazorpayOrderResponse)
async def create_payment_order(
    request: RazorpayOrderRequest,
    db: Session = Depends(get_db)
):
    """
    Create a Razorpay order for payment processing.
    Amount should be in rupees.
    """
    try:
        razorpay_order = create_razorpay_order(
            amount=request.amount,
            currency=request.currency,
            receipt=request.receipt
        )
        
        return RazorpayOrderResponse(
            id=razorpay_order["id"],
            amount=razorpay_order["amount"],
            currency=razorpay_order["currency"],
            key_id=RAZORPAY_KEY_ID
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Razorpay order: {str(e)}")


@app.post("/payments/verify")
async def verify_payment(
    verification: PaymentVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Verify Razorpay payment signature and update order status.
    """
    # Verify signature
    is_valid = verify_payment_signature(
        razorpay_order_id=verification.razorpay_order_id,
        razorpay_payment_id=verification.razorpay_payment_id,
        razorpay_signature=verification.razorpay_signature
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Update order with payment details
    order = db.query(OrderDB).filter(OrderDB.id == verification.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.payment_status = "paid"
    order.razorpay_order_id = verification.razorpay_order_id
    order.razorpay_payment_id = verification.razorpay_payment_id
    order.razorpay_signature = verification.razorpay_signature
    order.status = "confirmed"
    
    # Save shipping details if provided
    if verification.shipping_details:
        order.customer_name = verification.shipping_details.name
        order.customer_email = verification.shipping_details.email
        order.customer_phone = verification.shipping_details.phone
        order.shipping_address = verification.shipping_details.address
        order.shipping_city = verification.shipping_details.city
        order.shipping_state = verification.shipping_details.state
        order.shipping_zip = verification.shipping_details.zip
    
    db.commit()
    db.refresh(order)
    
    return {
        "success": True,
        "message": "Payment verified successfully",
        "order_id": order.id,
        "payment_status": order.payment_status
    }


