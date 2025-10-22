# Quick Start Guide

## 🎯 Choose Your Mode

### Option 1: Frontend Only (No Backend Needed) ⚡

**Perfect for UI/UX development, prototyping, or demos**

```bash
# 1. Install frontend dependencies
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install

# 2. Start frontend (mock mode is enabled by default)
npm run dev
```

✅ **Access:** http://localhost:5173  
✅ **Login:** john@lms.com (any password)  
✅ **Admin:** admin@lms.com (any password)

**📖 Full Guide:** See `FRONTEND_ONLY_GUIDE.md`

---

### Option 2: Full Stack (Frontend + Backend + MongoDB) 🚀

**For complete application testing with real API**

```bash
# 1. Install all dependencies
cd /Users/milanthapa/Desktop/Projects/LMS
npm run install:all

# 2. Start MongoDB
brew services start mongodb-community

# 3. Seed database
npm run seed

# 4. Disable mock mode
# Edit: client/src/config/app.config.ts
# Set: USE_MOCK_API: false

# 5. Start both frontend and backend
npm run dev
```

✅ **Frontend:** http://localhost:5173  
✅ **Backend:** http://localhost:5000  
✅ **Login:** admin@lms.com / admin123

**📖 Full Guide:** See `SETUP_GUIDE.md`

---

## 🔄 Toggle Between Modes

**File:** `client/src/config/app.config.ts`

```typescript
export const APP_CONFIG = {
  USE_MOCK_API: true,   // Frontend only (no backend)
  // USE_MOCK_API: false,  // Full stack (with backend)
};
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `FRONTEND_ONLY_GUIDE.md` | Frontend-only development guide |
| `SETUP_GUIDE.md` | Full stack setup instructions |
| `README.md` | Complete project documentation |
| `PROJECT_SUMMARY.md` | Project overview and features |

---

## 🆘 Need Help?

- **Frontend not starting?** Run `cd client && npm install`
- **Backend errors?** Make sure MongoDB is running
- **Want mock data?** Set `USE_MOCK_API: true`
- **Want real API?** Set `USE_MOCK_API: false`

---

**Choose your mode and start coding! 🎉**
