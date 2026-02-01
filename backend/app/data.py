from pydantic import BaseModel


class ProductData(BaseModel):
    id: str
    name: str
    description: str
    price: float
    brand: str
    manufacturer: str | None = None
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


class ManufacturerData(BaseModel):
    id: str
    name: str
    imageBase64: str | None = None
    models: list[str] | None = []


products = [
    ProductData(
        id="prod_1",
        name="V8 Turbocharger Kit",
        description="Boost your engine's performance with this state-of-the-art turbocharger kit. Designed for V8 engines, it provides a significant increase in horsepower and torque.",
        price=1999.99,
        brand="Apex Performance",
        manufacturer="BMW",
        category="Engine",
        imageUrl="https://images.unsplash.com/photo-1598859159221-1fffc50b4932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y2FyJTIwcGFydHxlbnwwfHx8fDE3NjYzNTE0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint="car part",
        rating=4.8,
        reviewCount=125,
        discount=15
    ),
    ProductData(
        id="prod_2",
        name="Performance Brake Kit",
        description="Upgrade your stopping power with this complete performance brake kit. Includes 6-piston calipers, drilled and slotted rotors, and high-performance pads.",
        price=1299.00,
        brand="GridLock",
        manufacturer="Audi",
        category="Brakes",
        imageUrl="https://images.unsplash.com/photo-1707406766955-c99768ee2fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y2FyJTIwYnJha2VzfGVufDB8fHx8MTc2NjM1MTQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint="car brakes",
        rating=4.9,
        reviewCount=98,
        discount=10
    ),
    ProductData(
        id="prod_3",
        name="Adjustable Coilover Suspension",
        description="Dial in your ride height and damping with this fully adjustable coilover kit. Perfect for both street and track use.",
        price=1450.50,
        brand="Velocity Works",
        manufacturer="BMW",
        category="Suspension",
        imageUrl="https://images.unsplash.com/photo-1590342855348-4dc7f6141fdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y2FyJTIwc3VzcGVuc2lvbnxlbnwwfHx8fDE3NjYzNTE0NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint="car suspension",
        rating=4.7,
        reviewCount=76,
        discount=25
    ),
    ProductData(
        id="prod_4",
        name="Titanium Cat-Back Exhaust",
        description="A full titanium exhaust system that not only reduces weight but also gives your car an aggressive, throaty sound.",
        price=2500.00,
        brand="Nitro Drive",
        manufacturer="Lamborghini",
        category="Exhaust",
        imageUrl="https://images.unsplash.com/photo-1619255566224-fca5ef4ca1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjYXIlMjBleGhhdXN0fGVufDB8fHx8MTc2NjM1MTQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint="car exhaust",
        rating=4.5,
        reviewCount=45,
        discount=5
    ),
    ProductData(
        id="prod_5",
        name="Carbon Fiber Racing Seat",
        description="Shed weight and stay planted in the corners with this ultra-lightweight carbon fiber racing seat. FIA approved.",
        price=1800.00,
        brand="Quantum Racing",
        manufacturer="BMW",
        category="Interior",
        imageUrl="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBzZWF0fGVufDB8fHx8fDE3NjYzNTE0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint="racing seat",
        rating=4.6,
        reviewCount=62,
        discount=12
    ),
    ProductData(
        id="prod_6",
        name="Racing Steering Wheel",
        description="Alcantara-wrapped steering wheel for maximum grip and a premium feel. Features a red centering stripe.",
        price=450.00,
        brand="Apex Performance",
        manufacturer="Audi",
        category="Interior",
        imageUrl="https://images.unsplash.com/photo-1512206818698-0038a42885fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c3RlZXJpbmclMjB3aGVlbHxlbnwwfHx8fDE3NjYzNTE0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint="steering wheel",
        rating=4.6,
        reviewCount=88,
        discount=8
    ),
    ProductData(
        id="prod_7",
        name="19\" Forged Alloy Wheels",
        description="A set of 4 lightweight forged alloy wheels in matte black. Stronger and lighter than cast wheels for improved performance.",
        price=3200.00,
        brand="ForgeLine",
        manufacturer="Lamborghini",
        category="Exterior",
        imageUrl="https://images.unsplash.com/photo-1604505024097-892b108c0974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhbGxveSUyMHdoZWVsc3xlbnwwfHx8fDE3NjYzNTE0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint="alloy wheels",
        rating=4.8,
        reviewCount=62,
        discount=10
    ),
    ProductData(
        id="prod_8",
        name="Cold Air Intake System",
        description="Increase airflow to your engine for better throttle response and more horsepower. Includes a high-flow reusable air filter.",
        price=399.99,
        brand="Velocity Works",
        manufacturer="BMW",
        category="Engine",
        imageUrl="https://images.unsplash.com/photo-1436473849883-bb3464c23e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxhaXIlMjBmaWx0ZXJ8ZW58MHx8fHwxNzY2Mjc5NDgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint="air filter",
        rating=4.5,
        reviewCount=210,
        discount=5
    ),
]

manufacturers = [
    ManufacturerData(
        id="manu_1",
        name="BMW",
        imageBase64="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL...", 
        models=["M3","M5","X5"]
    ),
    ManufacturerData(
        id="manu_2",
        name="Audi",
        imageBase64="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL...",
        models=["A4","A6","Q5"]
    ),
    ManufacturerData(
        id="manu_3",
        name="Lamborghini",
        imageBase64="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL...",
        models=["Huracan","Aventador"]
    ),
]

brands = [
    BrandData(
        id="brand_1",
        name="Apex Performance",
        logoUrl="https://images.unsplash.com/photo-1765978856539-b9247f2e0d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_2",
        name="Nitro Drive",
        logoUrl="https://images.unsplash.com/photo-1659123739225-ebc34dbdab0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_3",
        name="ForgeLine",
        logoUrl="https://images.unsplash.com/photo-1634729020084-106e70838c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_4",
        name="Velocity Works",
        logoUrl="https://images.unsplash.com/photo-1621986191859-a88d73c6ed0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_5",
        name="Quantum Racing",
        logoUrl="https://images.unsplash.com/photo-1634729020084-106e70838c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_6",
        name="GridLock",
        logoUrl="https://images.unsplash.com/photo-1506079782370-e0a067a44a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_7",
        name="Turbo Tech",
        logoUrl="https://images.unsplash.com/photo-1506079782370-e0a067a44a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_8",
        name="Iron Horse",
        logoUrl="https://images.unsplash.com/photo-1506079782370-e0a067a44a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_9",
        name="Stealth Ops",
        logoUrl="https://images.unsplash.com/photo-1506079782370-e0a067a44a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
    BrandData(
        id="brand_10",
        name="Power Shift",
        logoUrl="https://images.unsplash.com/photo-1506079782370-e0a067a44a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxsb2dvJTIwdHlwb2dyYXBoeXxlbnwwfHx8fDE3NjYzMDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        logoHint="brand logo"
    ),
]
