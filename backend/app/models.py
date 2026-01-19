from __future__ import annotations
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from .database import Base


class ProductDB(Base):
  __tablename__ = "products"

  id = Column(String, primary_key=True, index=True)
  name = Column(String, index=True, nullable=False)
  description = Column(Text, nullable=False)
  price = Column(Float, nullable=False)
  brand = Column(String, index=True, nullable=False)
  category = Column(String, index=True, nullable=False)
  imageUrl = Column(String, nullable=False)
  imageHint = Column(String, nullable=False)
  rating = Column(Float, nullable=False)
  reviewCount = Column(Integer, default=0)
  discount = Column(Integer, nullable=True)

  order_items = relationship("OrderItemDB", back_populates="product")


class BrandDB(Base):
  __tablename__ = "brands"

  id = Column(String, primary_key=True, index=True)
  name = Column(String, unique=True, index=True, nullable=False)
  logoUrl = Column(String, nullable=False)
  logoHint = Column(String, nullable=False)


class OrderItemDB(Base):
  __tablename__ = "order_items"

  order_id = Column(String, ForeignKey("orders.id"), primary_key=True)
  product_id = Column(String, ForeignKey("products.id"), primary_key=True)
  quantity = Column(Integer, nullable=False, default=1)

  order = relationship("OrderDB", back_populates="order_items")
  product = relationship("ProductDB", back_populates="order_items")


class OrderDB(Base):
  __tablename__ = "orders"

  id = Column(String, primary_key=True, index=True)
  date = Column(String, nullable=False)
  status = Column(String, nullable=False)
  total = Column(Float, nullable=False)
  payment_status = Column(String, default="pending")  # pending, paid, failed
  razorpay_order_id = Column(String, nullable=True)
  razorpay_payment_id = Column(String, nullable=True)
  razorpay_signature = Column(String, nullable=True)
  
  # Shipping details
  customer_name = Column(String, nullable=True)
  customer_email = Column(String, nullable=True)
  customer_phone = Column(String, nullable=True)
  shipping_address = Column(String, nullable=True)
  shipping_city = Column(String, nullable=True)
  shipping_state = Column(String, nullable=True)
  shipping_zip = Column(String, nullable=True)

  order_items = relationship("OrderItemDB", back_populates="order")
