# 🚀 START HERE

## Frontend-Only Development (Recommended for UI/UX Work)

### Step 1: Install Dependencies
```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
```

### Step 2: Start Frontend
```bash
npm run dev
```

### Step 3: Open Browser
Visit: **http://localhost:5173**

### Step 4: Login
- **Employee:** john@lms.com (any password)
- **Admin:** admin@lms.com (any password)

**✅ That's it! No backend or MongoDB needed!**

---

## 📖 Documentation

- **`QUICK_START.md`** - Choose between frontend-only or full stack
- **`FRONTEND_ONLY_GUIDE.md`** - Complete guide for frontend development
- **`CHANGES_SUMMARY.md`** - What was changed to enable frontend-only mode
- **`SETUP_GUIDE.md`** - Full stack setup (if you need backend later)

---

## 🔄 Toggle Between Modes

**File:** `client/src/config/app.config.ts`

```typescript
// Current mode (Frontend Only)
export const APP_CONFIG = {
  USE_MOCK_API: true,  // ← Change to false for real backend
};
```

---

## 🎯 What You Can Do Now

✅ Design and test UI/UX changes
✅ Work on components and pages
✅ Test user flows (employee & admin)
✅ Apply for leaves, approve/reject
✅ View dashboards and statistics
✅ All without backend or database!

---

**Happy Coding! 🎨**
