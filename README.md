# 🌾 Kisaan Mitra

<p align="center">
  <strong>A Smart Digital Procurement & Slot Management Platform for Farmers</strong>
  <br />
  Connecting farmers, procurement centres, mandi owners, and operators through digital bookings, QR-based verification, queue management, and operational insights.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white" />
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white" />
</p>

---

## 📖 Overview

Kisaan Mitra is a digital procurement and slot management platform designed to make agricultural procurement at mandis and procurement centres more organised, transparent, and convenient.

Traditional procurement centres can experience overcrowding, uncertain waiting times, and manual coordination of farmer arrivals. Kisaan Mitra addresses these operational challenges by bringing booking, scheduling, queue handling, and procurement workflows into one platform.

Farmers can book procurement slots and track their bookings, while mandi owners and operators can manage daily operations. Super administrators can oversee procurement centres, users, and platform-level activity.

## 🎯 Problem We Aim to Solve

- Long and uncertain waiting times at procurement centres.
- Overcrowding caused by uncoordinated farmer arrivals.
- Manual booking and queue-management processes.
- Limited visibility into booking and procurement status.
- Operational difficulty in managing multiple centres and their activities.

## 💡 Our Approach

Kisaan Mitra provides a role-based digital workflow:

1. Farmers access the platform and select a procurement centre.
2. They choose an available slot and submit crop and vehicle details.
3. The platform creates a booking with a QR/token-based confirmation.
4. Farmers can view their booking information and track its progress.
5. Mandi owners and operators manage bookings, queues, arrivals, and procurement.
6. Super administrators monitor centres, owners, audit activity, and platform analytics.

---

## ✨ Key Features

### 👨‍🌾 Farmer Portal

- Farmer registration and login.
- OTP-related authentication flow support in the platform.
- Browse and select procurement centres (mandis).
- Book procurement slots.
- Submit crop, quantity, and vehicle details.
- QR/token-based booking confirmation.
- View booking history and booking details.
- Track booking and queue status.
- Manage registered vehicles.
- Receive booking-related notifications.
- Multilingual interface with English and Hindi support.

### 🏢 Mandi Owner Portal

- Mandi-owner dashboard with operational statistics.
- View and manage bookings for the centre.
- Manage procurement slots.
- Monitor and manage queues.
- View booking and procurement information.
- Access reports and operational analytics.

### 🧑‍💼 Mandi Operator Portal

- Create assisted bookings for farmers.
- Register walk-in bookings.
- Manage the operational queue.
- Verify booking QR codes.
- Handle procurement workflows.
- Work with bookings associated with the operator's assigned mandi.

### 🛡️ Super Admin Portal

- Platform-level dashboard.
- Manage procurement centres.
- Manage mandi owners.
- Review and approve centre-owner registrations.
- Platform-wide and state-wise analytics.
- View audit logs.
- Manage system settings.

### ⚙️ Platform Capabilities

- Role-based access control.
- JWT-based API authentication.
- QR-based booking verification.
- Booking and queue lifecycle management.
- Assisted and walk-in booking workflows.
- Notifications.
- Audit logging for operational traceability.
- REST API architecture.
- English and Hindi localisation.

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript | Type safety |
| Vite | Development server and build tooling |
| Tailwind CSS 4 | Styling |
| React Router | Client-side routing |
| Zustand | State management |
| i18next / react-i18next | Internationalisation |
| qrcode.react | QR code rendering |
| npm | Package management |

### Backend

| Technology | Purpose |
|---|---|
| Python | Backend language |
| FastAPI | REST API framework |
| SQLAlchemy | Database ORM |
| MySQL | Relational database |
| PyMySQL | MySQL database driver |
| Pydantic | Request and response validation |
| JWT (python-jose) | Token-based authentication |
| Passlib / bcrypt | Password hashing |
| Alembic | Database migrations |
| Uvicorn | ASGI application server |

---

## 🏗️ Architecture

Kisaan Mitra follows a frontend–backend architecture:

```text
┌─────────────────────────────────────────────┐
│               React Frontend                │
│                                             │
│  Farmer │ Mandi Owner │ Operator │ Admin    │
│                                             │
│  React Router · Zustand · i18next           │
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTP / REST API
                       │ JWT Bearer Token
                       ▼
┌─────────────────────────────────────────────┐
│                FastAPI Backend              │
│                                             │
│  Authentication · Role Access · Routes      │
│  Bookings · Slots · Mandis · Procurement     │
│  QR Verification · Notifications             │
│  Analytics · Audit Logs · Settings           │
└──────────────────────┬──────────────────────┘
                       │
                       │ SQLAlchemy
                       ▼
┌─────────────────────────────────────────────┐
│                  MySQL                      │
│                                             │
│       Application and operational data      │
└─────────────────────────────────────────────┘
```

The frontend communicates with the backend through REST endpoints. Protected API operations use bearer-token authentication, and backend role checks restrict access to authorised user roles.

---

## 📂 Project Structure

The repository is organised into frontend and backend modules.

```text
Kisaan_Mitra/
│
├── backend/
│   ├── alembic/              # Database migration scripts
│   ├── auth/                 # Authentication and role checks
│   ├── crud/                 # Database operations
│   ├── database/             # Database connection
│   ├── models/               # SQLAlchemy models
│   ├── routes/               # FastAPI route modules
│   ├── schemas/              # Pydantic schemas
│   ├── main.py               # FastAPI application entry point
│   ├── config.py             # Backend configuration
│   └── requirements.txt      # Python dependencies
│
├── public/
│   └── locales/              # Translation resources
│
├── src/
│   ├── api/                  # API communication
│   ├── components/
│   │   ├── farmer/
│   │   ├── mandiOwner/
│   │   ├── mandiOperator/
│   │   ├── superAdmin/
│   │   ├── shared/
│   │   └── ui/
│   ├── config/               # Frontend configuration
│   ├── hooks/                # Custom React hooks
│   ├── pages/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── farmer/
│   │   ├── mandiOwner/
│   │   ├── mandiOperator/
│   │   └── superAdmin/
│   ├── store/                # Application state
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Application routes
│   ├── main.tsx              # Frontend entry point
│   └── i18n.ts               # Internationalisation setup
│
├── .env.example              # Frontend environment example
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run Kisaan Mitra locally.

### 1. Prerequisites

Install the following:

- Node.js (a version compatible with the Vite version in `package.json`).
- npm.
- Python 3.10 or later.
- MySQL Server.
- Git.

### 2. Clone the Repository

```bash
git clone https://github.com/ZeeshanAhmad2901/Kisaan_Mitra.git
cd Kisaan_Mitra
```

### 3. Configure the Database

Create a MySQL database for the application.

```sql
CREATE DATABASE kisaan_mitra;
```

Use the database name and credentials you configure in the backend environment.

### 4. Set Up the Backend

Open a terminal in the repository root:

```bash
cd backend
```

Create and activate a virtual environment.

**Windows (PowerShell):**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux / macOS:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` directory and configure the required values:

```env
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kisaan_mitra

JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

ALLOWED_ORIGINS=http://localhost:5173
```

**Important:** Use a strong, private JWT secret. Do not commit `.env` files or production credentials to Git.

Apply the database migrations:

```bash
alembic upgrade head
```

Start the backend:

```bash
uvicorn main:app --reload
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

Health-check endpoint:

```text
http://127.0.0.1:8000/health
```

The health endpoint checks database connectivity.

### 5. Set Up the Frontend

Open a second terminal in the repository root.

Install dependencies:

```bash
npm install
```

Create a `.env` file in the repository root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend development server:

```bash
npm run dev
```

Vite will print the local development URL in the terminal. The default is:

```text
http://localhost:5173
```

### 6. Available Frontend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript project builds and create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

---

## 🔐 Authentication & Access Control

Kisaan Mitra uses token-based authentication for protected backend endpoints.

- The backend issues JWT access tokens after successful authentication.
- The frontend stores the access token for authenticated API requests.
- API requests include the token in the `Authorization: Bearer` header.
- Backend role dependencies enforce access restrictions.
- Inactive accounts and repeated failed login attempts are handled by backend authentication logic.

The application contains separate workflows for farmers, mandi owners, mandi operators, and super administrators.

---

## 🌐 Language Support

The frontend uses **i18next** and **react-i18next** for localisation.

Currently configured languages:

- English (`en`)
- Hindi (`hi`)

Translation resources are loaded from:

```text
public/locales/
```

English is configured as the fallback language.

---

## 🩺 API Health Check

The backend exposes a health-check endpoint:

```http
GET /health
```

A successful database connection returns a healthy status. If the database is unavailable, the endpoint reports an unhealthy status.

For the complete interactive endpoint reference while the backend is running, visit `/docs`.

---

## 🔒 Environment Variables

### Frontend — Root `.env`

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend |

### Backend — `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `DB_USER` | Yes | MySQL username |
| `DB_PASSWORD` | Yes | MySQL password |
| `DB_HOST` | Yes | MySQL host |
| `DB_NAME` | Yes | Database name |
| `DB_PORT` | No | MySQL port; defaults to `3306` |
| `JWT_SECRET_KEY` | Yes | Secret used for signing JWTs |
| `JWT_ALGORITHM` | No | JWT algorithm; defaults to `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | Token lifetime in minutes; defaults to `60` |
| `ALLOWED_ORIGINS` | No | Comma-separated frontend origins allowed by CORS |

Never expose secrets in frontend variables, source control, screenshots, or public documentation.

---

## 🛣️ Application Routes

The frontend includes route groups for the following workflows:

| Area | Example routes |
|---|---|
| Public | `/`, `/about`, `/services`, `/contact` |
| Authentication | `/login`, `/register`, `/super-admin/login` |
| Farmer | `/farmer/dashboard`, `/farmer/book-slot`, `/farmer/bookings`, `/farmer/vehicles` |
| Mandi Owner | `/mandi-owner/dashboard`, `/mandi-owner/slots`, `/mandi-owner/queue`, `/mandi-owner/bookings`, `/mandi-owner/reports` |
| Mandi Operator | `/mandi-operator/dashboard`, `/mandi-operator/assisted-booking`, `/mandi-operator/walk-in-booking`, `/mandi-operator/queue-management`, `/mandi-operator/qr-verification`, `/mandi-operator/procurement` |
| Super Admin | `/super-admin/dashboard`, `/super-admin/mandis`, `/super-admin/owners`, `/super-admin/analytics`, `/super-admin/audit-logs`, `/super-admin/settings` |

---

## 🔮 Future Scope

Potential areas for future enhancement include:

- SMS and WhatsApp notifications for booking updates.
- More regional language support.
- Advanced demand and arrival forecasting.
- Enhanced procurement-centre performance insights.
- Mobile-first farmer experience and assisted digital access.
- Additional integrations with agricultural and government data services.

These are possible future enhancements, not claims that they are already implemented.

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run the relevant lint/build checks.
5. Commit your changes with a clear message.
6. Open a pull request describing the changes.

```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

---

## 📌 Project Information

| Detail | Information |
|---|---|
| Project | Kisaan Mitra |
| Category | Smart Agriculture / Digital Procurement |
| Platform | Web Application |
| Frontend | React + TypeScript |
| Backend | FastAPI |
| Database | MySQL |
| Repository | [ZeeshanAhmad2901/Kisaan_Mitra](https://github.com/ZeeshanAhmad2901/Kisaan_Mitra) |

---

## 📄 License

No license information has been specified here. Please check the repository for an applicable license before reusing or distributing the project.

---

<p align="center">
  <strong>🌾 Kisaan Mitra — Making Agricultural Procurement Smarter, More Transparent, and More Accessible.</strong>
</p>
