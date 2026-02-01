


from __future__ import annotations
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .crud import init_db, list_products, get_product_by_id, get_categories, get_brands, get_manufacturers, create_order, list_orders
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
from .schemas import BrandCreateRequest, ProductCreateRequest
from .schemas import ManufacturerCreateRequest
from .models import ProductDB, BrandDB, OrderDB, ManufacturerDB
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
  manufacturer: Optional[str] = Query(default=None),
  category: Optional[str] = Query(default=None),
  minPrice: Optional[float] = Query(default=None, ge=0),
  maxPrice: Optional[float] = Query(default=None, ge=0),
  sort: Optional[str] = Query(default=None, description="price-asc|price-desc|rating-desc"),
  db: Session = Depends(get_db),
):
  result = list_products(db, q=q, brand=brand, manufacturer=manufacturer, category=category, min_price=minPrice, max_price=maxPrice)

  products_list: List[Product] = [
    Product(
      id=p.id,
      name=p.name,
      description=p.description,
      price=p.price,
      brand=p.brand,
      manufacturer=p.manufacturer if hasattr(p, 'manufacturer') else None,
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


@app.post("/brand", response_model=Brand, status_code=201)
def create_brand_endpoint(payload: BrandCreateRequest, db: Session = Depends(get_db)):
    """Create a new brand."""
    # Check if brand with same name already exists
    existing_brand = db.query(BrandDB).filter(BrandDB.name == payload.name).first()
    if existing_brand:
        raise HTTPException(status_code=400, detail="Brand with this name already exists")
    
    # Generate brand ID
    brand_count = db.query(BrandDB).count()
    brand_id = f"brand_{brand_count + 1}"
    
    # Create new brand
    new_brand = BrandDB(
        id=brand_id,
        name=payload.name,
        logoUrl=payload.logoUrl,
        logoHint=payload.logoHint
    )
    
    db.add(new_brand)
    db.commit()
    db.refresh(new_brand)
    
    return Brand(
        id=new_brand.id,
        name=new_brand.name,
        logoUrl=new_brand.logoUrl,
        logoHint=new_brand.logoHint
    )


@app.get("/manufacturers", response_model=List[dict])
def list_manufacturers(db: Session = Depends(get_db)):
    mans = get_manufacturers(db)
    result = []
    for m in mans:
      result.append({"id": m.id, "name": m.name, "imageBase64": m.imageBase64, "models": m.models.split(',') if m.models else []})
    return result


@app.get("/manufacturers/{manu_id}")
def get_manufacturer(manu_id: str, db: Session = Depends(get_db)):
    m = db.query(ManufacturerDB).filter(ManufacturerDB.id == manu_id).first()
    if not m:
      raise HTTPException(status_code=404, detail="Manufacturer not found")
    return {"id": m.id, "name": m.name, "imageBase64": m.imageBase64, "models": m.models.split(',') if m.models else []}


@app.post("/manufacturers", status_code=201)
def create_manufacturer(payload: ManufacturerCreateRequest, db: Session = Depends(get_db)):
    existing = db.query(ManufacturerDB).filter(ManufacturerDB.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Manufacturer with this name already exists")
    count = db.query(ManufacturerDB).count()
    manu_id = f"manu_{count + 1}"
    m = ManufacturerDB(id=manu_id, name=payload.name, imageBase64=payload.imageBase64, models=','.join(payload.models) if payload.models else None)
    db.add(m)
    db.commit()
    db.refresh(m)
    return {"id": m.id, "name": m.name, "imageBase64": m.imageBase64, "models": m.models.split(',') if m.models else []}


@app.put("/manufacturers/{manu_id}")
def update_manufacturer(manu_id: str, payload: ManufacturerCreateRequest, db: Session = Depends(get_db)):
    m = db.query(ManufacturerDB).filter(ManufacturerDB.id == manu_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    other = db.query(ManufacturerDB).filter(ManufacturerDB.name == payload.name, ManufacturerDB.id != manu_id).first()
    if other:
        raise HTTPException(status_code=400, detail="Another manufacturer with this name already exists")
    old_name = m.name
    m.name = payload.name
    m.imageBase64 = payload.imageBase64
    m.models = ','.join(payload.models) if payload.models else None
    db.commit()
    db.refresh(m)
    # update products manufacturer name if changed
    if old_name != m.name:
        prods = db.query(ProductDB).filter(ProductDB.manufacturer == old_name).all()
        for p in prods:
            p.manufacturer = m.name
        db.commit()
    return {"id": m.id, "name": m.name, "imageBase64": m.imageBase64, "models": m.models.split(',') if m.models else []}


@app.delete("/manufacturers/{manu_id}", status_code=204)
def delete_manufacturer(manu_id: str, db: Session = Depends(get_db)):
    m = db.query(ManufacturerDB).filter(ManufacturerDB.id == manu_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    linked = db.query(ProductDB).filter(ProductDB.manufacturer == m.name).first()
    if linked:
        raise HTTPException(status_code=400, detail="Cannot delete manufacturer with existing products")
    db.delete(m)
    db.commit()
    return {}


@app.post("/product", response_model=Product, status_code=201)
def create_product_endpoint(payload: ProductCreateRequest, db: Session = Depends(get_db)):
    """Create a new product."""
    # Verify brand exists
    brand = db.query(BrandDB).filter(BrandDB.name == payload.brand).first()
    if not brand:
        raise HTTPException(status_code=400, detail="Brand not found")
    
    # Generate product ID
    product_count = db.query(ProductDB).count()
    product_id = f"prod_{product_count + 1}"
    
    # Create new product
    new_product = ProductDB(
        id=product_id,
        name=payload.name,
        description=payload.description,
        price=payload.price,
        brand=payload.brand,
        category=payload.category,
        imageUrl=payload.imageUrl,
        imageHint=payload.imageHint,
        rating=payload.rating if payload.rating else 0.0,
        reviewCount=payload.reviewCount if payload.reviewCount else 0,
        discount=payload.discount
    )
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
      
    return Product(
          id=new_product.id,
          name=new_product.name,
          description=new_product.description,
          price=new_product.price,
          brand=new_product.brand,
          category=new_product.category,
          imageUrl=new_product.imageUrl,
          imageHint=new_product.imageHint,
          rating=new_product.rating,
          reviewCount=new_product.reviewCount,
          discount=new_product.discount
      )
  
  
@app.put("/brand/{brand_id}", response_model=Brand)
def update_brand(brand_id: str, payload: BrandCreateRequest, db: Session = Depends(get_db)):
    """Update an existing brand. Also update product.brand references if name changes."""
    brand = db.query(BrandDB).filter(BrandDB.id == brand_id).first()
    if not brand:
      raise HTTPException(status_code=404, detail="Brand not found")

    old_name = brand.name
    # Check for name collision with another brand
    other = db.query(BrandDB).filter(BrandDB.name == payload.name, BrandDB.id != brand_id).first()
    if other:
      raise HTTPException(status_code=400, detail="Another brand with this name already exists")

    brand.name = payload.name
    brand.logoUrl = payload.logoUrl
    brand.logoHint = payload.logoHint
    db.commit()
    db.refresh(brand)

    # If name changed, update products referencing old name
    if old_name != payload.name:
      products = db.query(ProductDB).filter(ProductDB.brand == old_name).all()
      for p in products:
        p.brand = payload.name
      db.commit()

    return Brand(id=brand.id, name=brand.name, logoUrl=brand.logoUrl, logoHint=brand.logoHint)


@app.delete("/brand/{brand_id}", status_code=204)
def delete_brand(brand_id: str, db: Session = Depends(get_db)):
      """Delete a brand. Prevent deletion if any products reference the brand."""
      brand = db.query(BrandDB).filter(BrandDB.id == brand_id).first()
      if not brand:
          raise HTTPException(status_code=404, detail="Brand not found")
  
      # Prevent deletion if products exist for this brand
      linked = db.query(ProductDB).filter(ProductDB.brand == brand.name).first()
      if linked:
          raise HTTPException(status_code=400, detail="Cannot delete brand with existing products")
  
      db.delete(brand)
      db.commit()
      return {}
  
  
@app.put("/product/{product_id}", response_model=Product)
def update_product(product_id: str, payload: ProductCreateRequest, db: Session = Depends(get_db)):
    """Update an existing product."""
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
      raise HTTPException(status_code=404, detail="Product not found")

    # Verify brand exists
    brand = db.query(BrandDB).filter(BrandDB.name == payload.brand).first()
    if not brand:
      raise HTTPException(status_code=400, detail="Brand not found")

    product.name = payload.name
    product.description = payload.description
    product.price = payload.price
    product.brand = payload.brand
    product.category = payload.category
    product.imageUrl = payload.imageUrl
    product.imageHint = payload.imageHint
    product.rating = payload.rating if payload.rating else 0.0
    product.reviewCount = payload.reviewCount if payload.reviewCount else 0
    product.discount = payload.discount

    db.commit()
    db.refresh(product)

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


@app.delete("/product/{product_id}", status_code=204)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    """Delete a product by ID."""
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
      raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {}


@app.get("/brands/{brand_id}", response_model=Brand)
def get_brand_by_id(brand_id: str, db: Session = Depends(get_db)):
    """Get a brand by ID."""
    brand = db.query(BrandDB).filter(BrandDB.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    return Brand(
        id=brand.id,
        name=brand.name,
        logoUrl=brand.logoUrl,
        logoHint=brand.logoHint
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
  # Map old product IDs to new prod_X format
  product_id_map = {
    'turbocharger': 'prod_1',
    'brake-kit': 'prod_2',
    'suspension': 'prod_3',
    'exhaust': 'prod_4',
    'racing-seat': 'prod_5',
    'carbon-hood': 'prod_6',
    'intercooler': 'prod_7',
    'racing-wheel': 'prod_8',
  }
  
  product_ids = []
  total = 0.0

  for item in payload.items:
    # Convert old ID to new ID if needed
    product_id = product_id_map.get(item.productId, item.productId)
    
    product = get_product_by_id(db, product_id)
    if not product:
      raise HTTPException(status_code=400, detail=f"Unknown product: {item.productId}")
    product_ids.append((product_id, item.quantity))
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




