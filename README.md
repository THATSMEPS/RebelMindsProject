# Restaurant POS Backend API

## Project Overview
This is a backend API for a Restaurant Point of Sale (POS) system built with Node.js (Express) and MongoDB. It allows creating and fetching restaurant orders with validation and price calculation.

## Tech Stack
- Node.js with Express
- MongoDB with Mongoose
- dotenv for environment variables

## Folder Structure
- `models/` - Mongoose models for Restaurant, MenuItem, and Order
- `controllers/` - Business logic for API endpoints
- `routes/` - Express route definitions
- `config/` - Database connection setup
- `seed/` - Sample seed data script

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account or local MongoDB instance

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Seed the database with sample data:
   ```
   npm run seed
   ```
5. Start the server:
   ```
   npm run dev
   ```
6. The API will be running at `http://localhost:5000`

## API Endpoints

### Create a New Order
- **URL:** `POST /orders`
- **Request Body:**
  ```json
  {
    "restaurant_id": "643a9a1f2f1234567890abcd",
    "customer_name": "Alice",
    "order_type": "DINE_IN",
    "items": [
      { "menu_item_id": "643a9b2f1d1234567890efgh", "quantity": 2 },
      { "menu_item_id": "643a9b2f1d1234567890ijkl", "quantity": 1 }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "customer_name": "Alice",
    "order_type": "DINE_IN",
    "created_at": "2023-04-01T12:00:00.000Z",
    "items": [
      { "name": "Margherita Pizza", "quantity": 2, "total": 600 },
      { "name": "Garlic Bread", "quantity": 1, "total": 150 }
    ],
    "total_price": 750
  }
  ```

### Get Order Details
- **URL:** `GET /orders/:id`
- **Response:**
  ```json
  {
    "customer_name": "Alice",
    "order_type": "DINE_IN",
    "created_at": "2023-04-01T12:00:00.000Z",
    "items": [
      { "name": "Margherita Pizza", "quantity": 2, "total": 600 },
      { "name": "Garlic Bread", "quantity": 1, "total": 150 }
    ],
    "total_price": 750
  }
  ```

## Testing with cURL

Create order:
```bash
curl -X POST http://localhost:5000/orders \
-H "Content-Type: application/json" \
-d '{"restaurant_id":"<restaurant_id>", "customer_name":"Alice", "order_type":"DINE_IN", "items":[{"menu_item_id":"<menu_item_id1>", "quantity":2},{"menu_item_id":"<menu_item_id2>", "quantity":1}]}'
```

Get order:
```bash
curl http://localhost:5000/orders/<order_id>
```

## Deployment
- Use platforms like Render, Railway, or Vercel to deploy the backend.
- Use MongoDB Atlas for remote database access.
- Set environment variables accordingly in the deployment platform.

## License
MIT
