# Quick Setup Guide

Follow these steps to get the Leave Management System running on your local machine.

## Step 1: Install Dependencies

```bash
cd /Users/milanthapa/Desktop/Projects/LMS
npm run install:all
```

This will install all dependencies for the root project, backend, and frontend.

## Step 2: Start MongoDB

Ensure MongoDB is running on your system:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod --dbpath /usr/local/var/mongodb
```

To verify MongoDB is running:
```bash
mongosh
# You should see MongoDB shell if it's running
```

## Step 3: Seed the Database

Create sample users and data:

```bash
npm run seed
```

**Login Credentials Created:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | admin123 |
| Employee | john@lms.com | john123 |
| Employee | jane@lms.com | jane123 |
| Employee | bob@lms.com | bob123 |

## Step 4: Start the Application

```bash
npm run dev
```

This will start both:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

## Step 5: Access the Application

Open your browser and go to: **http://localhost:5173**

### Test as Employee:
1. Login with `john@lms.com` / `john123`
2. View dashboard with leave balance
3. Apply for leave
4. View leave history

### Test as Admin:
1. Login with `admin@lms.com` / `admin123`
2. View all leave requests
3. Approve or reject requests
4. Add review comments

## Common Commands

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Start backend only
npm run dev:server

# Start frontend only
npm run dev:client

# Seed database with sample data
npm run seed
```

## Troubleshooting

### MongoDB not running?
```bash
# Start MongoDB
brew services start mongodb-community

# Check status
brew services list | grep mongodb
```

### Port already in use?
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies issues?
```bash
# Clean install
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

## Project Structure

```
LMS/
├── client/          # Vue 3 Frontend (Port 5173)
├── server/          # Express Backend (Port 5000)
├── package.json     # Root scripts
└── README.md        # Full documentation
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the codebase
- Customize for your needs
- Add more features!

---

**Need help?** Check the main README.md file for more detailed information.
