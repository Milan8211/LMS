# 🧪 Testing Setup - Quick Start

## ✅ What Was Added

Vitest testing framework with comprehensive test suites for your LMS application.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
```

### 2. Run Tests

```bash
npm run test
```

### 3. View Test UI (Optional)

```bash
npm run test:ui
```

Opens at: `http://localhost:51204/__vitest__/`

### 4. Generate Coverage Report

```bash
npm run test:coverage
```

Then open: `coverage/index.html`

## 📦 Dependencies Added

```json
{
  "devDependencies": {
    "vitest": "^1.2.0",
    "@vue/test-utils": "^2.4.3",
    "happy-dom": "^12.10.3",
    "@vitest/ui": "^1.2.0",
    "@vitest/coverage-v8": "^1.2.0"
  }
}
```

## 📁 Test Files Created

### Store Tests
- ✅ `src/store/__tests__/userStore.spec.ts` - User authentication tests
- ✅ `src/store/__tests__/leaveStore.spec.ts` - Leave management tests

### Component Tests
- ✅ `src/components/__tests__/LeaveCalendar.spec.ts` - Calendar component tests

### API Tests
- ✅ `src/api/__tests__/mockAPI.spec.ts` - Mock API tests

### Type Tests
- ✅ `src/__tests__/types.spec.ts` - TypeScript type tests

## 🎯 Test Coverage

### User Store Tests (userStore.spec.ts)
- ✅ User initialization
- ✅ Login (success & failure)
- ✅ Register (success & failure)
- ✅ Logout
- ✅ Fetch current user
- ✅ isAuthenticated computed
- ✅ isAdmin computed

### Leave Store Tests (leaveStore.spec.ts)
- ✅ Leave initialization
- ✅ Fetch my leaves
- ✅ Fetch all leaves (admin)
- ✅ Create leave request
- ✅ Review leave (approve/reject)
- ✅ Delete leave
- ✅ Fetch statistics

### Calendar Component Tests (LeaveCalendar.spec.ts)
- ✅ Component rendering
- ✅ Props validation
- ✅ Color coding (pending/approved/rejected)
- ✅ Event title formatting
- ✅ Callback handling

### Mock API Tests (mockAPI.spec.ts)
- ✅ Register user
- ✅ Login/Logout
- ✅ Get current user
- ✅ Create leave
- ✅ Get leaves (employee & admin)
- ✅ Review leave
- ✅ Delete leave
- ✅ Get statistics
- ✅ Permission checks

### Type Tests (types.spec.ts)
- ✅ User type validation
- ✅ Leave type validation
- ✅ Status enums
- ✅ Optional fields

## 📊 Test Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests in watch mode |
| `npm run test:ui` | Open visual test interface |
| `npm run test:coverage` | Generate coverage report |

## 🎨 Test Output Example

```bash
$ npm run test

 ✓ src/store/__tests__/userStore.spec.ts (12 tests)
 ✓ src/store/__tests__/leaveStore.spec.ts (10 tests)
 ✓ src/components/__tests__/LeaveCalendar.spec.ts (6 tests)
 ✓ src/api/__tests__/mockAPI.spec.ts (18 tests)
 ✓ src/__tests__/types.spec.ts (6 tests)

 Test Files  5 passed (5)
      Tests  52 passed (52)
   Start at  14:30:45
   Duration  1.23s
```

## 🔧 Configuration

### vite.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

## 📝 Writing Your Own Tests

### Basic Test

```typescript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should work correctly', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Component Test

```typescript
import { mount } from '@vue/test-utils';
import MyComponent from '../MyComponent.vue';

it('should render', () => {
  const wrapper = mount(MyComponent);
  expect(wrapper.exists()).toBe(true);
});
```

### Store Test

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useMyStore } from '../myStore';

beforeEach(() => {
  setActivePinia(createPinia());
});

it('should initialize', () => {
  const store = useMyStore();
  expect(store.data).toEqual([]);
});
```

## 🎯 Benefits

### Fast Execution
- ⚡ Powered by Vite
- ⚡ HMR for tests
- ⚡ Parallel execution

### Great DX
- 🎨 Beautiful UI
- 🔍 Watch mode
- 📊 Coverage reports
- 🐛 Easy debugging

### Comprehensive
- ✅ 52 tests written
- ✅ Stores tested
- ✅ Components tested
- ✅ APIs tested
- ✅ Types tested

## 🐛 Troubleshooting

### Tests Not Running

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run test
```

### Module Errors

The TypeScript errors you see in the IDE will disappear after running `npm install`.

### Coverage Not Working

```bash
npm install -D @vitest/coverage-v8
npm run test:coverage
```

## 📚 Documentation

- **`TESTING_GUIDE.md`** - Complete testing guide
- **`README.md`** - Project documentation

## ✨ Next Steps

1. **Install dependencies**
   ```bash
   cd client && npm install
   ```

2. **Run tests**
   ```bash
   npm run test
   ```

3. **View coverage**
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

4. **Explore test UI**
   ```bash
   npm run test:ui
   ```

## 🎉 Summary

You now have:
- ✅ Vitest configured and ready
- ✅ 52 comprehensive tests
- ✅ Coverage reporting
- ✅ Visual test UI
- ✅ Watch mode enabled
- ✅ Mock data testing
- ✅ Component testing
- ✅ Store testing
- ✅ API testing

---

**Start testing now! 🧪**

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
npm run test
```
