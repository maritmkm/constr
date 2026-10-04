# Company & Workforce Management System

A production-ready, monolithic **Company & Workforce Management System** built with **React**, **Vite**, **TypeScript**, **Node.js**, **Express**, and **MongoDB**.

Designed with a modern SaaS admin dashboard interface using the primary **Cloudy Sky (`#CBDDE9`)** & **Ocean Blue (`#2872A1`)** color system.

---

## 🌟 Key Features

- **Authentication & Security**:
  - Secure JWT authentication with HTTP-only cookies and Bearer tokens.
  - Pre-seeded system administrator credentials.
  - Protected routes and authorization middleware.
- **Master Data Management**:
  - **Location Master**: Centralized city/location management used across companies, employees, and works with duplicate name prevention.
  - **Job Type Master**: Manage skilled trades (Electrician, Mechanic, Plumber, Welder, Carpenter, Painter, Technician).
- **Client Company Management**:
  - Complete CRUD for client companies with location mapping.
  - Profile image uploads via Multer.
  - Dedicated **Company Details Page** featuring work summary statistics and complete project work history.
- **Workforce / Employee Management**:
  - Centralized employee database with trade and location tags.
  - Status badges (`ACTIVE`, `INACTIVE`, `ON_LEAVE`).
  - Tracks current active work assignment for each employee.
- **Guided Work Assignment Wizard**:
  - 4-Step guided project assignment flow (Company → Employee Multi-select → Timeline Dates → Review & Confirm).
  - Overall project start/end dates + individual employee start/end dates.
  - **Strict Employee Conflict Validation**: Prevents double-booking an employee on overlapping project dates with detailed conflict error reporting.
- **Ongoing & Completed Works Management**:
  - Filterable by Status (`ONGOING`, `UPCOMING`, `COMPLETED`, `ALL`), Location, and Job Type.
  - Search by Company name or Employee name.
  - Detailed popup dialog showing overall timeline and individual calendar working days.
- **Interactive Dashboard**:
  - Quick operational metrics (Total Companies, Total Employees, Active Employees, Ongoing Works, Completed Works, Available Employees).
  - Active work summary and quick action shortcuts.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, React Router v6, Tailwind CSS, TanStack Query v5, React Hook Form, Zod, Lucide Icons, Sonner.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose, JWT, bcryptjs, Multer, Zod, Helmet, Morgan, CORS.
- **Database**: MongoDB.

---

## 📂 Folder Structure

```text
company-workforce-management/
│
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/         # UI Primitives, Layouts, Common Components & Modals
│   │   ├── hooks/              # Custom React Hooks (useAuth, useDebounce)
│   │   ├── lib/                # Utility functions & date calculation helpers
│   │   ├── pages/              # Admin pages (Dashboard, Companies, Employees, Works, Masters)
│   │   ├── routes/             # App routing definition
│   │   ├── services/           # Axios API services
│   │   └── types/              # TypeScript interfaces
│   ├── index.html
│   ├── vite.config.ts          # Configured with Express API proxy (/api & /uploads)
│   └── package.json
│
├── server/                     # Node.js Express Backend
│   ├── src/
│   │   ├── config/             # Environment & MongoDB connection
│   │   ├── controllers/        # Express request handlers
│   │   ├── middleware/         # Auth, Error, Multer Upload, Zod validation
│   │   ├── models/             # Mongoose schemas (Admin, Company, Employee, JobType, Location, OngoingWork)
│   │   ├── routes/             # REST API routers
│   │   ├── services/           # Business logic & overlap validation
│   │   ├── validators/         # Zod schemas
│   │   ├── app.ts              # Express entrypoint
│   │   └── seed.ts             # Database seeder
│   └── package.json
│
├── uploads/                    # File uploads directory
│   └── company-profiles/
│
├── .env                        # Root environment variables
├── .env.example
├── package.json                # Root package for running client & server concurrently
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18+` or `v20+`
- **npm**: `v9+`
- **MongoDB**: Installed locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI.

### 1. Environment Configuration

Create a `.env` file in the root directory (or use default `.env` provided):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/company_workforce_management
JWT_SECRET=company_workforce_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 2. Install Dependencies

Install all dependencies across root, server, and client:

```bash
npm run install:all
```

### 3. Seed Database

Run the seeder to populate sample locations, job types, companies, employees, and admin account:

```bash
npm run seed
```

Default Admin Login:
- **Email**: `admin@example.com`
- **Password**: `admin123`

### 4. Development Mode

Start both Vite frontend and Express server concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📦 Production Deployment

To build the application as a single deployable monolithic service:

```bash
npm run build
npm run start
```

The Express server will automatically serve the static production build of the Vite React frontend from `client/dist` and static company profile uploads from `/uploads`.

---

## 🔒 License

Commercial SaaS Monolith Application Template.
