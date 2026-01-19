from __future__ import annotations
from sqlalchemy.orm import Session
from .models import ProductDB, BrandDB, OrderDB, OrderItemDB
from .data import products, brands


def init_db(db: Session):
  """Seed database with initial data if empty."""
  if db.query(ProductDB).first() is not None:
    return

  for product in products:
    db_product = ProductDB(
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
    db.add(db_product)

  for brand in brands:
    db_brand = BrandDB(
      id=brand.id,
      name=brand.name,
      logoUrl=brand.logoUrl,
      logoHint=brand.logoHint,
    )
    db.add(db_brand)

  db.commit()


def get_product_by_id(db: Session, product_id: str) -> ProductDB | None:
  return db.query(ProductDB).filter(ProductDB.id == product_id).first()


def list_products(
  db: Session,
  q: str | None = None,
  brand: str | None = None,
  category: str | None = None,
  min_price: float | None = None,
  max_price: float | None = None,
) -> list[ProductDB]:
  query = db.query(ProductDB)

  if q:
    term = f"%{q.lower()}%"
    query = query.filter(
      (ProductDB.name.ilike(term)) |
      (ProductDB.description.ilike(term)) |
      (ProductDB.brand.ilike(term))
    )

  if brand:
    query = query.filter(ProductDB.brand.ilike(f"%{brand}%"))

  if category:
    query = query.filter(ProductDB.category.ilike(f"%{category}%"))

  if min_price is not None:
    query = query.filter(ProductDB.price >= min_price)

  if max_price is not None:
    query = query.filter(ProductDB.price <= max_price)

  return query.all()


def get_categories(db: Session) -> list[str]:
  categories = db.query(ProductDB.category).distinct().all()
  return sorted([cat[0] for cat in categories if cat[0]])


def get_brands(db: Session) -> list[BrandDB]:
  return db.query(BrandDB).all()


def create_order(db: Session, order_id: str, date: str, total: float, product_ids: list[tuple[str, int]]) -> OrderDB:
  """Create an order with products and quantities."""
  order = OrderDB(id=order_id, date=date, status="Processing", total=total)
  db.add(order)
  db.flush()  # Flush to ensure order is created before adding items

  for product_id, quantity in product_ids:
    product = get_product_by_id(db, product_id)
    if product:
      order_item = OrderItemDB(order_id=order_id, product_id=product_id, quantity=quantity)
      db.add(order_item)

  db.commit()
  db.refresh(order)
  return order


def list_orders(db: Session) -> list[OrderDB]:
  return db.query(OrderDB).all()
