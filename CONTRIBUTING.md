# 🤝 Contributing to VigorLog

Thank you for your interest in contributing to VigorLog! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Design System Contributions](#design-system-contributions)

## 📜 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git
- VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/vigorlog.git
   cd vigorlog
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Create a branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## 💻 Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

Examples:
- `feature/athlete-export-data`
- `fix/check-in-validation`
- `docs/api-documentation`

### Design System Development

We're currently evaluating two design approaches:

#### Option 1: Figma + shadcn/ui (Recommended)
```bash
git checkout feature/figma-design-integration
# Work on Figma-based components
```

#### Option 2: Metronic Framework
```bash
git checkout feature/metronic-integration
# Work on Metronic-based components
```

## 📐 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface UserData {
  id: string;
  name: string;
  age: number;
}

// ❌ Bad
interface UserData {
  id: any;
  name: any;
  age: any;
}
```

### Components

```tsx
// ✅ Good - Typed props with interface
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button
      className={cn('button', variant)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### File Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form-specific components
│   └── layouts/      # Layout components
├── app/              # Next.js app routes
├── lib/              # Utilities and helpers
├── stores/           # Zustand stores
└── types/            # TypeScript types
```

### Styling Guidelines

- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing (8px grid)
- Ensure WCAG 2.2 compliance (44pt touch targets)
- Use semantic color names from theme

```tsx
// ✅ Good
<button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg min-h-[44px]">
  Click me
</button>

// ❌ Bad
<button style={{ backgroundColor: '#39FF14', padding: '10px' }}>
  Click me
</button>
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

### Examples
```bash
feat(athlete): add export data functionality
fix(check-in): resolve validation error for pain scale
docs(api): update authentication documentation
refactor(dashboard): optimize performance for large datasets
```

## 🔄 Pull Request Process

1. **Before submitting:**
   - Run tests: `pnpm test`
   - Run linter: `pnpm lint`
   - Run formatter: `pnpm format`
   - Update documentation if needed
   - Add tests for new features

2. **PR Description Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   Add screenshots for UI changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   ```

3. **Review Process:**
   - At least one maintainer approval required
   - All CI checks must pass
   - Resolve all review comments
   - Keep PR focused and small

## 🎨 Design System Contributions

### Adding New Components

1. Check if component exists in shadcn/ui
2. If not, create in `src/components/ui/`
3. Follow existing patterns:

```tsx
// src/components/ui/health-card.tsx
import { cn } from '@/lib/utils';

interface HealthCardProps {
  title: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  className?: string;
}

export function HealthCard({ title, value, status, className }: HealthCardProps) {
  return (
    <div className={cn(
      'rounded-lg p-4 border',
      {
        'border-green-500': status === 'good',
        'border-yellow-500': status === 'warning',
        'border-red-500': status === 'critical',
      },
      className
    )}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
```

### Icon Guidelines

- Use Font Awesome icons via the Icon component
- Add new icons to `src/components/ui/icon.tsx`
- No emojis in UI components

## 🧪 Testing

### Unit Tests
```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### E2E Tests
```typescript
// e2e/checkin.spec.ts
import { test, expect } from '@playwright/test';

test('athlete can complete check-in', async ({ page }) => {
  await page.goto('/athlete');
  await page.click('text=Jetzt starten');
  // ... test steps
});
```

## 📚 Documentation

- Update README.md for significant changes
- Add JSDoc comments for utilities
- Document complex logic with inline comments
- Update knowledge base at `/docs/Wissen/`

## 🐛 Reporting Issues

Use GitHub Issues with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## 💬 Getting Help

- Check existing documentation
- Search closed issues
- Ask in discussions
- Join our Discord community

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website

Thank you for contributing to VigorLog! 🎉