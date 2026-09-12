# ERP Management System

A complete **Enterprise Resource Planning (ERP)** system built with modern technologies.

## Tech Stack

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| **Backend**        | Node.js + Express.js + MongoDB      |
| **Python Service** | FastAPI (Analytics & Reports)       |
| **Frontend**       | React 18 + Vite + Tailwind CSS      |
| **Auth**           | JWT + bcrypt                        |
| **Charts**         | Recharts                            |

## Features

- Authentication (Login / JWT)
- Role-based access (Admin, Manager, Employee)
- Employee Management (CRUD)
- Product Management (CRUD + Stock)
- Customer Management
- Order Management (with stock deduction)
- Inventory Overview + Low Stock Alerts
- Dashboard with stats & charts
- Python Analytics microservice (Sales summary, ABC analysis, predictions)

## Project Structure

```
erp-system/
├── backend/                 # Node.js + Express + MongoDB
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/seed.js
│   ├── server.js
│   └── package.json
├── python-service/          # FastAPI microservice
│   ├── main.py
│   └── requirements.txt
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.10+
- npm / pip

## Setup Instructions

### 1. Start MongoDB
Make sure MongoDB is running on `mongodb://127.0.0.1:27017`

### 2. Backend (Node.js)

```bash
cd backend
npm install
npm run seed          # Creates admin + sample data
npm run dev           # Runs on http://localhost:5000
```

**Default Login Credentials:**
- Admin   → `admin@erp.com` / `admin123`
- Manager → `manager@erp.com` / `manager123`

### 3. Python Analytics Service

```bash
cd python-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Service runs on → http://localhost:8000  
Docs → http://localhost:8000/docs

### 4. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev           # Runs on http://localhost:3000
```

Open browser → http://localhost:3000

## API Endpoints (Backend)

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/auth/login             | Login                    |
| POST   | /api/auth/register          | Register                 |
| GET    | /api/dashboard/stats        | Dashboard statistics     |
| CRUD   | /api/employees              | Employee management      |
| CRUD   | /api/products               | Product management       |
| CRUD   | /api/customers              | Customer management      |
| CRUD   | /api/orders                 | Order management         |
| GET    | /api/inventory              | Inventory overview       |

## Python Service Endpoints

| Method | Endpoint                          | Description               |
|--------|-----------------------------------|---------------------------|
| GET    | /reports/sales-summary            | Sales analytics           |
| GET    | /reports/inventory-analysis       | Inventory ABC analysis    |
| POST   | /predict/sales                    | Simple sales prediction   |

## Notes

- Frontend proxies `/api` to backend during development.
- Change `JWT_SECRET` and MongoDB URI in `backend/.env` for production.
- Python service currently returns rich mock + analytical data (can be connected to live Node API with auth token).

---

Built with ❤️ using Node.js, Express, MongoDB, Python FastAPI & React Vite
# erp_management_system
