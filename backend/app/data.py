from pydantic import BaseModel


class ProductData(BaseModel):
    id: str
    name: str
    description: str
    price: float
    brand: str
    category: str
    imageUrl: str
    imageHint: str
    rating: float
    reviewCount: int
    discount: int = None


class BrandData(BaseModel):
    id: str
    name: str
    logoUrl: str
    logoHint: str


products = [
    ProductData(
        id="prod_1",
        name="V8 Turbocharger Kit",
        description="High-performance turbocharger kit for enhanced engine power and acceleration",
        price=1999.99,
        brand="Apex Performance",
        category="Engine",
        imageUrl="https://images.unsplash.com/photo-1494976866556-6b0ee5d2cfae?w=400&h=300&fit=crop",
        imageHint="High-performance turbocharger kit",
        rating=4.8,
        reviewCount=156,
        discount=10
    ),
    ProductData(
        id="prod_2",
        name="Racing Suspension Kit",
        description="Complete lowering suspension system for improved handling and appearance",
        price=1299.99,
        brand="StanceCo",
        category="Suspension",
        imageUrl="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop",
        imageHint="Racing suspension kit",
        rating=4.6,
        reviewCount=98,
        discount=15
    ),
    ProductData(
        id="prod_3",
        name="Premium Air Filter Kit",
        description="Reusable high-flow air filter for better engine breathing and performance",
        price=299.99,
        brand="FilterMax",
        category="Engine",
        imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageHint="Premium air filter kit",
        rating=4.4,
        reviewCount=267,
        discount=5
    ),
    ProductData(
        id="prod_4",
        name="Ceramic Brake Pads",
        description="Low dust ceramic brake pads for smooth braking and reduced brake fade",
        price=149.99,
        brand="BrakeMax",
        category="Braking",
        imageUrl="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop",
        imageHint="Ceramic brake pads",
        rating=4.7,
        reviewCount=445,
        discount=8
    ),
    ProductData(
        id="prod_5",
        name="Stainless Steel Exhaust System",
        description="Performance exhaust system with enhanced sound and improved airflow",
        price=799.99,
        brand="ExhaustElite",
        category="Exhaust",
        imageUrl="https://images.unsplash.com/photo-1609708536965-8128bbb20e13?w=400&h=300&fit=crop",
        imageHint="Stainless steel exhaust system",
        rating=4.5,
        reviewCount=189,
        discount=12
    ),
    ProductData(
        id="prod_6",
        name="LED Headlight Conversion Kit",
        description="Modern LED headlight conversion for enhanced visibility and style",
        price=499.99,
        brand="LightGear",
        category="Lighting",
        imageUrl="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop",
        imageHint="LED headlight conversion kit",
        rating=4.9,
        reviewCount=312,
        discount=0
    ),
    ProductData(
        id="prod_7",
        name="Carbon Fiber Body Kit",
        description="Lightweight carbon fiber exterior parts for weight reduction and style",
        price=2499.99,
        brand="CarbonMax",
        category="Exterior",
        imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        imageHint="Carbon fiber body kit",
        rating=4.3,
        reviewCount=67,
        discount=20
    ),
    ProductData(
        id="prod_8",
        name="Performance Cooling System",
        description="Advanced radiator and cooling fan system for optimal engine temperature",
        price=899.99,
        brand="CoolTech",
        category="Cooling",
        imageUrl="https://images.unsplash.com/photo-1494976866556-6b0ee5d2cfae?w=400&h=300&fit=crop",
        imageHint="Performance cooling system",
        rating=4.6,
        reviewCount=134,
        discount=10
    ),
]

brands = [
    BrandData(
        id="brand_1",
        name="Apex Performance",
        logoUrl="https://via.placeholder.com/200x100?text=Apex",
        logoHint="Apex Performance Logo"
    ),
    BrandData(
        id="brand_2",
        name="StanceCo",
        logoUrl="https://via.placeholder.com/200x100?text=StanceCo",
        logoHint="StanceCo Logo"
    ),
    BrandData(
        id="brand_3",
        name="FilterMax",
        logoUrl="https://via.placeholder.com/200x100?text=FilterMax",
        logoHint="FilterMax Logo"
    ),
    BrandData(
        id="brand_4",
        name="ExhaustElite",
        logoUrl="https://via.placeholder.com/200x100?text=ExhaustElite",
        logoHint="ExhaustElite Logo"
    ),
]
