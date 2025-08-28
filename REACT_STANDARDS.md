# React Development Standards - Four Speed Motorcycle Shop

## Overview
This document outlines the React best practices and standards enforced in this project through ESLint, Prettier, and TypeScript configuration.

## 🚀 Core Principles

### 1. Function Components & Hooks
- **Always use function components** over class components
- Leverage React hooks for state management and side effects
- Create custom hooks for reusable stateful logic

```typescript
// ✅ Good
function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCartStore()
  // ...
}

// ❌ Avoid
class ProductCard extends React.Component {
  // class-based components
}
```

### 2. TypeScript Best Practices
- Use strict TypeScript configuration
- Define proper interfaces for props and state
- Avoid `any` type (ESLint will warn)
- Use meaningful variable names

```typescript
// ✅ Good
interface ProductCardProps {
  product: WPSItem
  onAddToCart?: (product: WPSItem) => void
}

// ❌ Avoid
interface Props {
  data: any
}
```

### 3. Performance Optimization
- Use `React.memo()` for components that receive the same props frequently
- Implement `useMemo()` and `useCallback()` for expensive computations
- Measure before optimizing

```typescript
// ✅ Good - memoized component
const ProductCard = memo(({ product, viewMode }: ProductCardProps) => {
  const expensiveValue = useMemo(() => calculatePrice(product), [product])
  // ...
})
```

## 🔧 Code Organization

### Import Order (Enforced by ESLint)
1. React and React-related imports
2. Third-party libraries
3. Internal utilities and stores
4. Components
5. Types and interfaces

```typescript
// ✅ Enforced by simple-import-sort plugin
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

import { useCartStore } from '@/lib/store/cart'
import { WPSItem } from '@/lib/api/wps-client'

import ProductCard from '@/components/products/ProductCard'
```

### File Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   └── [feature]/      # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utilities, API clients, stores
└── app/                # Next.js App Router pages
```

## ✅ Enforced Rules

### React-Specific Rules
- `react/jsx-key`: Require keys in lists
- `react/no-deprecated`: Prevent deprecated React features
- `react-hooks/rules-of-hooks`: Enforce hooks rules
- `react-hooks/exhaustive-deps`: Warn about missing dependencies

### Accessibility Rules
- `jsx-a11y/alt-text`: Images must have alt text
- `jsx-a11y/anchor-is-valid`: Links must be valid
- `jsx-a11y/label-has-associated-control`: Form labels must be associated

### Code Quality
- `prefer-const`: Use const for variables that aren't reassigned
- `no-var`: Prohibit var declarations
- `no-console`: Only allow console.warn and console.error
- `unused-imports/no-unused-imports`: Remove unused imports automatically

## 🎨 Code Formatting (Prettier)

### Configuration
- Single quotes for strings
- No semicolons
- 2-space indentation
- 100 character line width
- Trailing commas in ES5-compatible locations

### Example
```typescript
// ✅ Formatted by Prettier
const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = useCallback(() => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }, [product, onAddToCart])

  return (
    <div className='product-card'>
      <h3>{product.name}</h3>
      <button onClick={handleClick}>Add to Cart</button>
    </div>
  )
}
```

## 🔄 Development Workflow

### Pre-commit Hooks
Every commit automatically runs:
1. ESLint with auto-fix
2. Prettier formatting
3. TypeScript type checking

### Available Scripts
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format code with Prettier
npm run format:check  # Check if code is formatted
npm run type-check    # Run TypeScript compiler
```

### Git Workflow
1. Write code following these standards
2. Commit changes (pre-commit hooks run automatically)
3. If hooks fail, fix issues and commit again

## 🏗️ Architecture Patterns

### Custom Hooks Pattern
Extract stateful logic into reusable custom hooks:

```typescript
// ✅ Good - Custom hook
function useItemImage(item: WPSItem, size: 'card' | 'detail') {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // fetch image logic
  }, [item.id, size])
  
  return { imageUrl, loading }
}
```

### Zustand Store Pattern
Use Zustand for global state management:

```typescript
// ✅ Store pattern
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity) => {
    // state update logic
  },
  removeItem: (id) => {
    // state update logic
  },
}))
```

### Component Composition
Prefer composition over complex prop drilling:

```typescript
// ✅ Good - Composition
<ProductCard product={product}>
  <ProductImage src={product.image} />
  <ProductDetails 
    name={product.name}
    price={product.price}
  />
  <ProductActions onAddToCart={handleAddToCart} />
</ProductCard>
```

## 🚨 Common Anti-patterns to Avoid

1. **Large components**: Break down components into smaller, focused pieces
2. **Prop drilling**: Use context or state management for deeply nested data
3. **Missing error boundaries**: Wrap components that might throw errors
4. **Inline functions in JSX**: Use useCallback for event handlers
5. **Missing keys in lists**: Always provide unique keys for array items

## 📚 Additional Resources

- [React Best Practices 2025](https://react.dev/learn)
- [Next.js Best Practices](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint React Rules](https://github.com/jsx-eslint/eslint-plugin-react)
- [Accessibility Guidelines](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)

---

These standards are automatically enforced through our development tools and should be followed by all team members working on this project.