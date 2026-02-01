# GTR Motors API Documentation

**Base URL:** `http://localhost:4000`

**Version:** 0.1.0

---

## Table of Contents

1. [Health Check](#health-check)
2. [Products](#products)
3. [Brands](#brands)
4. [Categories](#categories)
5. [Orders](#orders)
6. [Payments](#payments)
7. [Error Handling](#error-handling)

---

## Health Check

### GET `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "uptimeSeconds": 1234.5
}
```

**Status Code:** `200 OK`

---

## Products

### GET `/products`

Retrieve all products with optional filtering, searching, and sorting.

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Full-text search in product name/description/brand | `turbocharger` |
| `brand` | string | Filter by brand name | `Apex Performance` |
| `category` | string | Filter by category | `Engine` |
| `minPrice` | float | Minimum price filter (inclusive) | `500.00` |
| `maxPrice` | float | Maximum price filter (inclusive) | `2000.00` |
| `sort` | string | Sort results: `price-asc`, `price-desc`, `rating-desc` | `price-asc` |

**Response:**
```json
{
  "items": [
    {
      "id": "prod_1",
      "name": "V8 Turbocharger Kit",
      "description": "High-performance turbocharger kit...",
      "price": 1999.99,
      "brand": "Apex Performance",
      "category": "Engine",
      "imageUrl": "https://images.unsplash.com/...",
      "imageHint": "High-performance turbocharger kit",
      "rating": 4.8,
      "reviewCount": 156,
      "discount": 10
    }
  ],
  "total": 1
}
```

**Status Code:** `200 OK`

**Example Requests:**
```bash
# Get all products
curl http://localhost:4000/products

# Search for turbocharger
curl "http://localhost:4000/products?q=turbocharger"

# Filter by brand and price range
curl "http://localhost:4000/products?brand=Apex%20Performance&minPrice=1000&maxPrice=3000"

# Sort by price ascending
curl "http://localhost:4000/products?sort=price-asc"

# Combined filters
curl "http://localhost:4000/products?category=Engine&brand=FilterMax&sort=rating-desc"
```

---

### GET `/products/{product_id}`

Retrieve a single product by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `product_id` | string | Product ID (e.g., `prod_1`) |

**Response:**
```json
{
  "id": "prod_1",
  "name": "V8 Turbocharger Kit",
  "description": "High-performance turbocharger kit...",
  "price": 1999.99,
  "brand": "Apex Performance",
  "category": "Engine",
  "imageUrl": "https://images.unsplash.com/...",
  "imageHint": "High-performance turbocharger kit",
  "rating": 4.8,
  "reviewCount": 156,
  "discount": 10
}
```

**Status Code:** `200 OK`

**Error Responses:**
- `404 Not Found` - Product does not exist

**Example:**
```bash
curl http://localhost:4000/products/prod_1
```

---

### POST `/product`

Create a new product.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Turbo Kit",
  "description": "A powerful turbocharger for engines",
  "price": 1599.99,
  "brand": "Apex Performance",
  "category": "Engine",
  "imageUrl": "https://images.unsplash.com/photo-xxx",
  "imageHint": "Turbo kit image",
  "rating": 4.5,
  "reviewCount": 50,
  "discount": 5
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | - |
| `description` | string | Yes | - |
| `price` | float | Yes | Must be > 0 |
| `brand` | string | Yes | Must exist in database |
| `category` | string | Yes | - |
| `imageUrl` | string | Yes | - |
| `imageHint` | string | Yes | - |
| `rating` | float | No | 0-5 (default: 0) |
| `reviewCount` | integer | No | >= 0 (default: 0) |
| `discount` | integer | No | 0-100 (default: 0) |

**Response:**
```json
{
  "id": "prod_9",
  "name": "New Turbo Kit",
  "description": "A powerful turbocharger for engines",
  "price": 1599.99,
  "brand": "Apex Performance",
  "category": "Engine",
  "imageUrl": "https://images.unsplash.com/photo-xxx",
  "imageHint": "Turbo kit image",
  "rating": 4.5,
  "reviewCount": 50,
  "discount": 5
}
```

**Status Code:** `201 Created`

**Error Responses:**
- `400 Bad Request` - Brand not found or validation error

**Example:**
```bash
curl -X POST http://localhost:4000/product \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nitrous Kit",
    "description": "Nitrous oxide system",
    "price": 2499.99,
    "brand": "Apex Performance",
    "category": "Engine",
    "imageUrl": "https://...",
    "imageHint": "Nitrous kit",
    "rating": 4.9,
    "reviewCount": 89
  }'
```

---

### PUT `/product/{product_id}`

Update an existing product.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `product_id` | string | Product ID (e.g., `prod_1`) |

**Request Body:** Same as POST `/product`

**Response:** Updated product object (same schema as POST)

**Status Code:** `200 OK`

**Error Responses:**
- `404 Not Found` - Product does not exist
- `400 Bad Request` - Brand not found or validation error

**Example:**
```bash
curl -X PUT http://localhost:4000/product/prod_1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Turbo Kit",
    "description": "Enhanced version",
    "price": 2199.99,
    "brand": "Apex Performance",
    "category": "Engine",
    "imageUrl": "https://...",
    "imageHint": "Updated turbo kit",
    "rating": 4.9,
    "reviewCount": 200,
    "discount": 15
  }'
```

---

### DELETE `/product/{product_id}`

Delete a product by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `product_id` | string | Product ID (e.g., `prod_1`) |

**Response:** Empty (204 No Content)

**Status Code:** `204 No Content`

**Error Responses:**
- `404 Not Found` - Product does not exist

**Example:**
```bash
curl -X DELETE http://localhost:4000/product/prod_1
```

---

## Brands

### GET `/brands`

Retrieve all brands.

**Response:**
```json
[
  {
    "id": "brand_1",
    "name": "Apex Performance",
    "logoUrl": "https://via.placeholder.com/...",
    "logoHint": "Apex Performance logo"
  }
]
```

**Status Code:** `200 OK`

**Example:**
```bash
curl http://localhost:4000/brands
```

---

### GET `/brands/{brand_id}`

Retrieve a single brand by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `brand_id` | string | Brand ID (e.g., `brand_1`) |

**Response:**
```json
{
  "id": "brand_1",
  "name": "Apex Performance",
  "logoUrl": "https://via.placeholder.com/...",
  "logoHint": "Apex Performance logo"
}
```

**Status Code:** `200 OK`

**Error Responses:**
- `404 Not Found` - Brand does not exist

**Example:**
```bash
curl http://localhost:4000/brands/brand_1
```

---

### POST `/brand`

Create a new brand.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Brand",
  "logoUrl": "https://example.com/logo.png",
  "logoHint": "Brand logo description"
}
```

**Field Validation:**
| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |
| `logoUrl` | string | Yes |
| `logoHint` | string | Yes |

**Response:**
```json
{
  "id": "brand_11",
  "name": "New Brand",
  "logoUrl": "https://example.com/logo.png",
  "logoHint": "Brand logo description"
}
```

**Status Code:** `201 Created`

**Error Responses:**
- `400 Bad Request` - Brand with this name already exists

**Example:**
```bash
curl -X POST http://localhost:4000/brand \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TurboTech",
    "logoUrl": "https://example.com/turbotech.png",
    "logoHint": "TurboTech brand logo"
  }'
```

---

### PUT `/brand/{brand_id}`

Update an existing brand. Automatically updates product references if brand name changes.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `brand_id` | string | Brand ID (e.g., `brand_1`) |

**Request Body:**
```json
{
  "name": "Updated Brand Name",
  "logoUrl": "https://example.com/new-logo.png",
  "logoHint": "Updated logo description"
}
```

**Response:** Updated brand object

**Status Code:** `200 OK`

**Error Responses:**
- `404 Not Found` - Brand does not exist
- `400 Bad Request` - Another brand with this name already exists

**Example:**
```bash
curl -X PUT http://localhost:4000/brand/brand_1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apex Elite",
    "logoUrl": "https://example.com/apex-elite.png",
    "logoHint": "Apex Elite brand logo"
  }'
```

---

### DELETE `/brand/{brand_id}`

Delete a brand by ID. Deletion is prevented if products reference this brand.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `brand_id` | string | Brand ID (e.g., `brand_1`) |

**Response:** Empty (204 No Content)

**Status Code:** `204 No Content`

**Error Responses:**
- `404 Not Found` - Brand does not exist
- `400 Bad Request` - Cannot delete brand with existing products

**Example:**
```bash
curl -X DELETE http://localhost:4000/brand/brand_1
```

---

## Manufacturers

### GET `/manufacturers`

Retrieve all manufacturers. Each manufacturer contains an `id`, `name`, a `imageBase64` data URL for a logo (optional), and an array of `models` (strings).

**Response:**
```json
[
  {
    "id": "manu_1",
    "name": "GTR Motors",
    "imageBase64": "data:image/png;base64,iVBORw0KG...",
    "models": ["Model A", "Model B"]
  }
]
```

**Status Code:** `200 OK`

**Example:**
```bash
curl http://localhost:4000/manufacturers
```

---

### GET `/manufacturers/{manu_id}`

Retrieve a single manufacturer by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `manu_id` | string | Manufacturer ID (e.g., `manu_1`) |

**Response:**
```json
{
  "id": "manu_1",
  "name": "GTR Motors",
  "imageBase64": "data:image/png;base64,iVBORw0KG...",
  "models": ["Model A", "Model B"]
}
```

**Status Code:** `200 OK`

**Error Responses:**
- `404 Not Found` - Manufacturer does not exist

**Example:**
```bash
curl http://localhost:4000/manufacturers/manu_1
```

---

### POST `/manufacturers`

Create a new manufacturer.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Manufacturer",
  "imageBase64": "data:image/png;base64,iVBORw0KG...",
  "models": ["Model X", "Model Y"]
}
```

**Field Validation:**
| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |
| `imageBase64` | string | No |
| `models` | array[string] | No |

**Response:**
```json
{
  "id": "manu_2",
  "name": "New Manufacturer",
  "imageBase64": "data:image/png;base64,iVBORw0KG...",
  "models": ["Model X", "Model Y"]
}
```

**Status Code:** `201 Created`

**Error Responses:**
- `400 Bad Request` - Manufacturer with this name already exists

**Example:**
```bash
curl -X POST http://localhost:4000/manufacturers \
  -H "Content-Type: application/json" \
  -d '{"name":"New Manufacturer","imageBase64":"data:image/png;base64,iVBORw0KG...","models":["M1","M2"]}'
```

---

### PUT `/manufacturers/{manu_id}`

Update an existing manufacturer. If the `name` changes, products referencing the old manufacturer name will be updated.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `manu_id` | string | Manufacturer ID (e.g., `manu_1`) |

**Request Body:** Same schema as POST `/manufacturers`.

**Response:** Updated manufacturer object

**Status Code:** `200 OK`

**Error Responses:**
- `404 Not Found` - Manufacturer does not exist
- `400 Bad Request` - Another manufacturer with this name already exists

**Example:**
```bash
curl -X PUT http://localhost:4000/manufacturers/manu_1 \
  -H "Content-Type: application/json" \
  -d '{"name":"GTR Motors Updated","imageBase64":"data:image/png;base64,iVBORw0KG...","models":["Model A","Model C"]}'
```

---

### DELETE `/manufacturers/{manu_id}`

Delete a manufacturer by ID. Deletion is prevented if products reference this manufacturer.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `manu_id` | string | Manufacturer ID (e.g., `manu_1`) |

**Response:** Empty (204 No Content)

**Status Code:** `204 No Content`

**Error Responses:**
- `404 Not Found` - Manufacturer does not exist
- `400 Bad Request` - Cannot delete manufacturer with existing products

**Example:**
```bash
curl -X DELETE http://localhost:4000/manufacturers/manu_1
```


## Categories

### GET `/categories`

Retrieve all available product categories.

**Response:**
```json
[
  "Engine",
  "Brakes",
  "Suspension",
  "Exhaust",
  "Interior",
  "Exterior",
  "Lighting",
  "Cooling"
]
```

**Status Code:** `200 OK`

**Example:**
```bash
curl http://localhost:4000/categories
```

---

## Orders

### GET `/orders`

Retrieve all orders with their items and product details.

**Response:**
```json
[
  {
    "id": "ORD-1706840523000",
    "date": "2024-02-01",
    "status": "Processing",
    "total": 3299.98,
    "items": [
      {
        "product": {
          "id": "prod_1",
          "name": "V8 Turbocharger Kit",
          "description": "...",
          "price": 1999.99,
          "brand": "Apex Performance",
          "category": "Engine",
          "imageUrl": "https://...",
          "imageHint": "...",
          "rating": 4.8,
          "reviewCount": 156,
          "discount": 10
        },
        "quantity": 1
      }
    ]
  }
]
```

**Status Code:** `200 OK`

**Example:**
```bash
curl http://localhost:4000/orders
```

---

### POST `/orders`

Create a new order.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod_1",
      "quantity": 1
    },
    {
      "productId": "prod_2",
      "quantity": 2
    }
  ]
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `items` | array | Yes | Non-empty array |
| `items[].productId` | string | Yes | Must exist in database |
| `items[].quantity` | integer | Yes | > 0 |

**Response:**
```json
{
  "order": {
    "id": "ORD-1706840523000",
    "date": "2024-02-01",
    "status": "Processing",
    "total": 3299.98,
    "items": [
      {
        "product": { ... },
        "quantity": 1
      }
    ]
  }
}
```

**Status Code:** `201 Created`

**Error Responses:**
- `400 Bad Request` - Unknown product or invalid data

**Example:**
```bash
curl -X POST http://localhost:4000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod_1",
        "quantity": 1
      },
      {
        "productId": "prod_3",
        "quantity": 2
      }
    ]
  }'
```

---

## Payments

### POST `/payments/create-order`

Create a Razorpay order for payment processing.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "INR",
  "receipt": "order_rcpt_001"
}
```

**Field Validation:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | integer | Yes | Amount in rupees (smallest currency unit) |
| `currency` | string | Yes | Currency code (e.g., "INR") |
| `receipt` | string | Yes | Receipt/reference ID |

**Response:**
```json
{
  "id": "order_DBJOWzybf0sJ2P",
  "amount": 5000,
  "currency": "INR",
  "key_id": "rzp_test_xxxxx"
}
```

**Status Code:** `200 OK`

**Error Responses:**
- `500 Internal Server Error` - Failed to create Razorpay order

**Example:**
```bash
curl -X POST http://localhost:4000/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2499,
    "currency": "INR",
    "receipt": "ORD-1706840523000"
  }'
```

---

### POST `/payments/verify`

Verify Razorpay payment signature and update order status.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_DBJOWzybf0sJ2P",
  "razorpay_payment_id": "pay_DBJOWzybf0sJ2P",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a...",
  "order_id": "ORD-1706840523000",
  "shipping_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zip": "400001"
  }
}
```

**Field Validation:**
| Field | Type | Required |
|-------|------|----------|
| `razorpay_order_id` | string | Yes |
| `razorpay_payment_id` | string | Yes |
| `razorpay_signature` | string | Yes |
| `order_id` | string | Yes |
| `shipping_details` | object | No |

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "order_id": "ORD-1706840523000",
  "payment_status": "paid"
}
```

**Status Code:** `200 OK`

**Error Responses:**
- `400 Bad Request` - Invalid payment signature
- `404 Not Found` - Order does not exist
- `500 Internal Server Error` - Verification failed

**Example:**
```bash
curl -X POST http://localhost:4000/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_DBJOWzybf0sJ2P",
    "razorpay_payment_id": "pay_DBJOWzybf0sJ2P",
    "razorpay_signature": "9ef4dffbfd84f...",
    "order_id": "ORD-1706840523000",
    "shipping_details": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zip": "400001"
    }
  }'
```

---

## Error Handling

### Standard Error Response Format

All errors follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `204` | No Content | Request successful (no response body) |
| `400` | Bad Request | Invalid request parameters or validation error |
| `404` | Not Found | Resource not found |
| `500` | Internal Server Error | Server error during processing |

### Common Error Scenarios

**Brand Not Found (Creating Product)**
```json
{
  "detail": "Brand not found"
}
```
Status: `400 Bad Request`

**Product Not Found**
```json
{
  "detail": "Product not found"
}
```
Status: `404 Not Found`

**Duplicate Brand Name**
```json
{
  "detail": "Brand with this name already exists"
}
```
Status: `400 Bad Request`

**Cannot Delete Brand with Products**
```json
{
  "detail": "Cannot delete brand with existing products"
}
```
Status: `400 Bad Request`

**Invalid Payment Signature**
```json
{
  "detail": "Invalid payment signature"
}
```
Status: `400 Bad Request`

---

## CORS Configuration

The API is configured with CORS enabled for all origins:
- `Allow-Origin: *`
- `Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Allow-Headers: Content-Type`

---

## Database

### Models

#### Product
- `id`: Unique identifier (prod_N)
- `name`: Product name
- `description`: Product description
- `price`: Product price (INR)
- `brand`: Brand name (foreign key reference)
- `category`: Product category
- `imageUrl`: Product image URL
- `imageHint`: Image description for AI
- `rating`: Product rating (0-5)
- `reviewCount`: Number of reviews
- `discount`: Discount percentage (0-100)

#### Brand
- `id`: Unique identifier (brand_N)
- `name`: Brand name
- `logoUrl`: Brand logo URL
- `logoHint`: Logo description

#### Order
- `id`: Unique order identifier (ORD-timestamp)
- `date`: Order date
- `status`: Order status (Processing, Confirmed, Shipped, etc.)
- `total`: Total order amount
- `products`: Associated products through order items

---

## Getting Started

1. **Start the backend server:**
```bash
cd backend
uvicorn app.main:app --reload --port 4000
```

2. **Test the API:**
```bash
# Check health
curl http://localhost:4000/health

# Get all products
curl http://localhost:4000/products

# Get all brands
curl http://localhost:4000/brands

# Get all categories
curl http://localhost:4000/categories
```

---

## Notes

- All timestamps are in UTC
- Prices are in Indian Rupees (INR)
- Product IDs follow format: `prod_N` where N is a sequential number
- Brand IDs follow format: `brand_N` where N is a sequential number
- Order IDs follow format: `ORD-TIMESTAMP` where TIMESTAMP is Unix timestamp in milliseconds
- Ratings are on a scale of 0-5 with decimal precision
- Discount is percentage (0-100)

---

**Last Updated:** February 1, 2026
**API Version:** 0.1.0
