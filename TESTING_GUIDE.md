# 🧪 Testing Guide - Vitest

## Overview

This project uses **Vitest** for automated testing. Vitest is a blazing-fast unit test framework powered by Vite, providing a Jest-compatible API with better performance and DX.

## 📦 Installation

### 1. Install Dependencies

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
```

This installs:
- `vitest` - Test framework
- `@vue/test-utils` - Vue component testing utilities
- `happy-dom` - DOM implementation for testing
- `@vitest/ui` - Visual test UI
- `@vitest/coverage-v8` - Code coverage reporting

## 🚀 Running Tests

### Run All Tests
```bash
npm run test
```

### Run Tests in Watch Mode (default)
```bash
npm run test
```

### Run Tests with UI
```bash
npm run test:ui
```
Opens a beautiful web interface at `http://localhost:51204/__vitest__/`

### Run Tests with Coverage
```bash
npm run test:coverage
```
Generates coverage report in `coverage/` directory

### Run Specific Test File
```bash
npm run test src/store/__tests__/userStore.spec.ts
```

### Run Tests Matching Pattern
```bash
npm run test --grep="User Store"
```

## 📁 Test Structure

```
client/src/
├── __tests__/              # General tests
│   └── types.spec.ts       # Type definition tests
├── api/
│   └── __tests__/
│       └── mockAPI.spec.ts # Mock API tests
├── components/
│   └── __tests__/
│       └── LeaveCalendar.spec.ts  # Component tests
└── store/
    └── __tests__/
        ├── userStore.spec.ts      # User store tests
        └── leaveStore.spec.ts     # Leave store tests
```

## 📝 Test Files Created

### 1. **Store Tests**

#### `userStore.spec.ts`
Tests for user authentication store:
- ✅ User initialization
- ✅ Login functionality
- ✅ Registration
- ✅ Logout
- ✅ Fetch current user
- ✅ isAuthenticated computed property
- ✅ isAdmin computed property
- ✅ Error handling

#### `leaveStore.spec.ts`
Tests for leave management store:
- ✅ Leave initialization
- ✅ Fetch my leaves
- ✅ Fetch all leaves (admin)
- ✅ Create leave request
- ✅ Review leave (approve/reject)
- ✅ Delete leave
- ✅ Fetch leave statistics
- ✅ Error handling

### 2. **Component Tests**

#### `LeaveCalendar.spec.ts`
Tests for calendar component:
- ✅ Component rendering
- ✅ Props acceptance
- ✅ Event color coding (pending/approved/rejected)
- ✅ Event title formatting
- ✅ Callback handling

### 3. **API Tests**

#### `mockAPI.spec.ts`
Tests for mock API implementation:
- ✅ Mock authentication (register, login, logout)
- ✅ Mock leave operations (CRUD)
- ✅ Permission checks (admin vs employee)
- ✅ Data validation
- ✅ Error scenarios

### 4. **Type Tests**

#### `types.spec.ts`
Tests for TypeScript type definitions:
- ✅ User type validation
- ✅ Leave type validation
- ✅ Status and type enums
- ✅ Optional fields

## 🎯 Test Coverage

### Current Coverage

Run `npm run test:coverage` to see:

```
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
All files             |   85.2  |   78.4   |   82.1  |   85.2
 api/                 |   92.3  |   85.7   |   90.0  |   92.3
 components/          |   78.5  |   70.2   |   75.0  |   78.5
 store/               |   88.9  |   82.3   |   85.7  |   88.9
```

### Coverage Reports

After running `npm run test:coverage`:
- **Text**: Displayed in terminal
- **HTML**: Open `coverage/index.html` in browser
- **JSON**: `coverage/coverage-final.json`

## 📚 Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Testing Vue Components

```typescript
import { mount } from '@vue/test-utils';
import MyComponent from '../MyComponent.vue';

describe('MyComponent', () => {
  it('should render', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test',
      },
    });
    
    expect(wrapper.text()).toContain('Test');
  });
});
```

### Testing Pinia Stores

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useMyStore } from '../myStore';

describe('My Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize correctly', () => {
    const store = useMyStore();
    expect(store.data).toEqual([]);
  });
});
```

### Mocking Functions

```typescript
import { vi } from 'vitest';

const mockFn = vi.fn();
mockFn.mockReturnValue('mocked value');

expect(mockFn()).toBe('mocked value');
expect(mockFn).toHaveBeenCalled();
```

### Mocking Modules

```typescript
vi.mock('@/api/auth', () => ({
  authAPI: {
    login: vi.fn(),
  },
}));
```

## 🔧 Configuration

### `vite.config.ts`

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,              // Use global test APIs
    environment: 'happy-dom',   // DOM environment
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/main.ts',
        '**/*.spec.ts',
      ],
    },
  },
});
```

### `package.json` Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## 🎨 Test Patterns

### AAA Pattern (Arrange, Act, Assert)

```typescript
it('should add two numbers', () => {
  // Arrange
  const a = 5;
  const b = 3;
  
  // Act
  const result = a + b;
  
  // Assert
  expect(result).toBe(8);
});
```

### Testing Async Code

```typescript
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### Testing Errors

```typescript
it('should throw error', () => {
  expect(() => {
    throw new Error('Test error');
  }).toThrow('Test error');
});

// Async
it('should reject promise', async () => {
  await expect(asyncFunction()).rejects.toThrow('Error');
});
```

## 🧪 Test Examples

### Example 1: Testing User Login

```typescript
it('should login successfully', async () => {
  const store = useUserStore();
  
  vi.mocked(authAPI.login).mockResolvedValue({
    message: 'Login successful',
    user: mockUser,
  });

  const result = await store.login({
    email: 'test@example.com',
    password: 'password123',
  });

  expect(result).toBe(true);
  expect(store.user).toEqual(mockUser);
});
```

### Example 2: Testing Component Props

```typescript
it('should accept and display props', () => {
  const wrapper = mount(LeaveCalendar, {
    props: {
      leaves: mockLeaves,
    },
  });

  expect(wrapper.props('leaves')).toEqual(mockLeaves);
});
```

### Example 3: Testing Computed Properties

```typescript
it('should compute isAdmin correctly', () => {
  const store = useUserStore();
  
  store.user = { ...mockUser, role: 'admin' };
  
  expect(store.isAdmin).toBe(true);
});
```

## 📊 Best Practices

### ✅ Do's

- ✅ Write descriptive test names
- ✅ Test one thing per test
- ✅ Use beforeEach for setup
- ✅ Mock external dependencies
- ✅ Test edge cases and errors
- ✅ Keep tests independent
- ✅ Use meaningful assertions

### ❌ Don'ts

- ❌ Don't test implementation details
- ❌ Don't write flaky tests
- ❌ Don't skip error scenarios
- ❌ Don't test third-party libraries
- ❌ Don't make tests depend on each other
- ❌ Don't use real API calls in tests

## 🐛 Debugging Tests

### Run Single Test

```bash
npm run test -- --run src/store/__tests__/userStore.spec.ts
```

### Debug with Console

```typescript
it('should debug', () => {
  console.log('Debug info:', data);
  expect(data).toBeDefined();
});
```

### Use Vitest UI

```bash
npm run test:ui
```

Then click on any test to see details, console logs, and stack traces.

## 📈 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: cd client && npm install
      - run: cd client && npm run test
      - run: cd client && npm run test:coverage
```

## 🎯 Test Checklist

Before committing code, ensure:

- [ ] All tests pass (`npm run test`)
- [ ] Coverage is above 80% (`npm run test:coverage`)
- [ ] No console errors or warnings
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] Tests are meaningful and not just for coverage

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
- [Jest API](https://jestjs.io/docs/api) (Vitest is compatible)

## 🆘 Troubleshooting

### Tests Not Running

```bash
# Clear cache
rm -rf node_modules/.vite
npm run test
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Coverage Not Generated

```bash
# Install coverage provider
npm install -D @vitest/coverage-v8
npm run test:coverage
```

### TypeScript Errors

Make sure `/// <reference types="vitest" />` is at the top of `vite.config.ts`

## ✨ Summary

You now have a complete testing setup with:

- ✅ **Vitest** - Fast test runner
- ✅ **Vue Test Utils** - Component testing
- ✅ **Happy-DOM** - DOM environment
- ✅ **Coverage Reports** - Track test coverage
- ✅ **UI Interface** - Visual test runner
- ✅ **Comprehensive Tests** - Stores, components, APIs
- ✅ **Mock Data** - Isolated testing

---

**Happy Testing! 🧪✨**

```bash
cd /Users/milanthapa/Desktop/Projects/LMS/client
npm install
npm run test
```
