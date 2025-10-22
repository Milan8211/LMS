# Leave Management System (LMS)

A complete, modern Leave Management System built with **Vue 3 + TypeScript** frontend and **Node.js + Express + MongoDB** backend.

## 🎯 Features

### Employee Features
- ✅ Register and login with JWT authentication
- ✅ Apply for leave (sick, casual, annual, unpaid)
- ✅ View leave history with filtering
- ✅ Track leave balance
- ✅ Delete pending leave requests
- ✅ View detailed leave request status

### Admin Features
- ✅ View all leave requests from all employees
- ✅ Approve or reject leave requests
- ✅ Add review comments
- ✅ Filter requests by status
- ✅ View employee leave balances
- ✅ Dashboard with statistics

## 🛠️ Tech Stack

### Frontend
- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript
- **UI Library:** Ant Design Vue
- **Styling:** vue-styled-components
- **State Management:** Pinia
- **Routing:** Vue Router 4
- **HTTP Client:** Axios
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (local)
- **ODM:** Mongoose
- **Authentication:** JWT (HTTP-only cookies)
- **Password Hashing:** bcrypt
- **Validation:** Zod
- **Language:** TypeScript

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone or navigate to the project directory

```bash
cd /Users/milanthapa/Desktop/Projects/LMS
```

### 2. Install all dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project
- Backend (server)
- Frontend (client)

### 3. Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/your/data/directory
```

### 4. Seed the database (Optional but recommended)

Create sample users and leave requests:

```bash
npm run seed
```

This will create:
- **Admin User:** admin@lms.com / admin123
- **Employee Users:**
  - john@lms.com / john123
  - jane@lms.com / jane123
  - bob@lms.com / bob123

### 5. Start the application

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

### 6. Access the application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📁 Project Structure

```
LMS/
├── client/                 # Vue 3 Frontend
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── router/        # Vue Router configuration
│   │   ├── store/         # Pinia stores
│   │   ├── styles/        # Styled components
│   │   ├── types/         # TypeScript interfaces
│   │   ├── App.vue        # Root component
│   │   └── main.ts        # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Auth & error handling
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── scripts/       # Seed scripts
│   │   ├── utils/         # Helper functions
│   │   └── app.ts         # Express app
│   ├── .env               # Environment variables
│   ├── tsconfig.json
│   └── package.json
│
├── package.json           # Root package.json
└── README.md
```

## 🔐 Authentication

The system uses **JWT-based authentication** with HTTP-only cookies for security:

- Access tokens expire in 1 day
- Refresh tokens expire in 7 days
- Passwords are hashed using bcrypt
- Protected routes require authentication
- Role-based access control (RBAC)

## 🎨 UI Components

Built with **Ant Design Vue** for a professional, polished interface:

- Responsive layout with sidebar navigation
- Data tables with sorting and filtering
- Form validation
- Modal dialogs
- Notifications and messages
- Statistics cards
- Date pickers
- Dropdowns and selects

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Leave Management
- `POST /api/leaves` - Create leave request (Employee)
- `GET /api/leaves/my-leaves` - Get user's leaves (Employee)
- `GET /api/leaves` - Get all leaves (Admin)
- `GET /api/leaves/:id` - Get leave by ID
- `PATCH /api/leaves/:id/review` - Approve/reject leave (Admin)
- `DELETE /api/leaves/:id` - Delete leave (Employee, pending only)
- `GET /api/leaves/stats` - Get leave statistics

## 🧪 Testing the Application

### As Employee:
1. Login with: `john@lms.com` / `john123`
2. View dashboard with leave balance and stats
3. Apply for leave
4. View leave history
5. Delete pending requests

### As Admin:
1. Login with: `admin@lms.com` / `admin123`
2. View all leave requests
3. Filter by status
4. Approve or reject requests
5. Add review comments

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leave-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (vite.config.ts)
- Proxy configured to forward `/api` requests to backend
- Port: 5173

## 🎯 Key Features Implementation

### Leave Balance Management
- Each user starts with 20 days leave balance
- Approved leaves automatically deduct from balance
- Balance displayed in dashboard and admin view

### Leave Days Calculation
- Automatically calculates weekdays between dates
- Excludes weekends (Saturday & Sunday)
- Validates date ranges

### Role-Based Access Control
- Employees can only view/manage their own leaves
- Admins can view/manage all leaves
- Protected routes with navigation guards

### Form Validation
- Client-side validation with Ant Design Vue
- Server-side validation with Zod
- Comprehensive error messages

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
brew services start mongodb-community

# Or check if mongod process is running
ps aux | grep mongod
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

## 📝 Notes

- This is a **local development setup** - no deployment configuration included
- MongoDB runs locally - no cloud database
- All data is stored locally on your machine
- For production use, update JWT secrets and add proper security measures

## 🎓 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Ant Design Vue](https://antdv.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)

## 📄 License

ISC

---

**Built with ❤️ using Vue 3, TypeScript, Node.js, and MongoDB**
