from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float
    brand: str
    manufacturer: Optional[str] = None
    category: str
    imageUrl: str
    imageHint: str
    rating: float
    reviewCount: int
    discount: Optional[int] = None


class Brand(BaseModel):
    id: str
    name: str
    logoUrl: str
    logoHint: str


class Manufacturer(BaseModel):
    id: str
    name: str
    imageBase64: Optional[str] = None
    models: Optional[List[str]] = None


class CartItem(BaseModel):
    product: Product
    quantity: int


class Order(BaseModel):
    id: str
    date: str
    status: str
    total: float
    items: List[CartItem]
    payment_status: Optional[str] = "pending"
    razorpay_order_id: Optional[str] = None


class OrderItemInput(BaseModel):
    productId: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)


class ShippingAddress(BaseModel):
    line1: str
    city: str
    country: str
    postalCode: str


class OrderCreateRequest(BaseModel):
    items: List[OrderItemInput]
    customerEmail: Optional[EmailStr] = None
    shippingAddress: Optional[ShippingAddress] = None


class ProductsResponse(BaseModel):
    items: List[Product]
    total: int


class OrderCreateResponse(BaseModel):
    order: Order


class RazorpayOrderRequest(BaseModel):
    amount: float
    currency: str = "INR"
    receipt: Optional[str] = None


class RazorpayOrderResponse(BaseModel):
    id: str
    amount: int
    currency: str
    key_id: str


class ShippingDetails(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    zip: str


class PaymentVerificationRequest(BaseModel):
  razorpay_order_id: str
  razorpay_payment_id: str
  razorpay_signature: str
  order_id: str
  shipping_details: Optional[ShippingDetails] = None


class BrandCreateRequest(BaseModel):
  name: str = Field(..., min_length=1)
  logoUrl: str = Field(..., min_length=1)
  logoHint: str = Field(..., min_length=1)




class ManufacturerCreateRequest(BaseModel):
    name: str = Field(..., min_length=1)
    imageBase64: Optional[str] = Field(None)
    models: Optional[List[str]] = None


class ProductCreateRequest(BaseModel):
    name: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    brand: str = Field(..., min_length=1)
    manufacturer: Optional[str] = Field(None)
    category: str = Field(..., min_length=1)
    imageUrl: str = Field(..., min_length=1)
    imageHint: str = Field(..., min_length=1)
    rating: Optional[float] = Field(default=0.0, ge=0, le=5)
    reviewCount: Optional[int] = Field(default=0, ge=0)
    discount: Optional[int] = Field(default=None, ge=0, le=100)

