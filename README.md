# 🏃‍♂️ VigorLog - Youth Athlete Health Monitoring PWA

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![GDPR Compliant](https://img.shields.io/badge/GDPR-Compliant-green)](https://gdpr.eu/)

VigorLog is a Progressive Web App designed to prevent injuries in young athletes (14-18 years) through continuous health monitoring. Built with a Gen Z-first approach, it features a modern UI with cyber-lime aesthetics and comprehensive GDPR compliance.

## 🚀 Features

### Core Functionality
- **📊 Daily Health Check-ins**: 6 key metrics (sleep, fatigue, muscle soreness, mood, pain, stress)
- **⚡ Quick Check-in Mode**: Sub-30-second optimized flow for Gen Z attention spans
- **🎯 Check-in Selection Modal**: Choose between Quick (30s) or Detail check-in modes
- **📍 Smart Alerts**: Rule-based system for critical health values
- **📱 PWA Capabilities**: Works offline, installable on mobile devices
- **🔒 GDPR Compliant**: Dual-consent system for minors under 16

### User Roles
- **🏃 Athletes**: Daily health tracking, streak monitoring, achievement system
- **🏋️ Coaches**: Team overview, athlete monitoring, performance analytics
- **👪 Parents**: Child health overview, alert notifications, consent management
- **👤 Admins**: User management, system configuration, analytics dashboard

### Gen Z Optimizations
- **🎨 Cyber-Lime Design**: Modern gradients with #39FF14 primary color
- **⚡ Speed-First**: Optimized for quick interactions
- **🎮 Gamification**: Streaks, badges, and achievements
- **📱 Mobile-First**: Touch-optimized with 44pt minimum targets

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling and validation

### UI Components
- **shadcn/ui** - Modern component library
- **Font Awesome** - Icon system
- **Custom Icon Components** - Type-safe icon wrappers

### Development
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm 8+

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vigorlog.git
cd vigorlog
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

The app includes demo accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Athlete | max.mustermann@demo.com | demo123 |
| Coach | coach.demo@vigorlog.com | demo123 |
| Parent | parent.demo@vigorlog.com | demo123 |
| Admin | admin.demo@vigorlog.com | demo123 |

## 🏗️ Project Structure

```
vigorlog/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── athlete/      # Athlete dashboard & check-in
│   │   ├── coach/        # Coach team overview
│   │   ├── parent/       # Parent monitoring
│   │   ├── admin/        # Admin panel
│   │   └── dual-consent-demo/  # GDPR consent flow
│   ├── components/       
│   │   ├── ui/          # Reusable UI components
│   │   └── forms/       # Form components
│   ├── lib/             # Utilities and helpers
│   │   ├── storage.ts   # LocalStorage manager
│   │   ├── logger.ts    # Debug logging system
│   │   └── utils.ts     # Common utilities
│   ├── stores/          # Zustand state stores
│   └── types/           # TypeScript definitions
├── public/              # Static assets
└── docs/               # Documentation
```

## 🎯 Key Features Implementation

### 1. Health Tracking System
- **Metrics**: Sleep quality, fatigue, muscle soreness, mood, pain level, stress
- **Visualization**: Progress bars, trend analysis, weekly averages
- **Alerts**: Automatic notifications for concerning values

### 2. GDPR Compliance
- **Dual-Consent**: Parent + child consent for users under 16
- **Data Encryption**: Client-side encryption for sensitive data
- **Consent Management**: Trackable consent records
- **Data Portability**: Export functionality

### 3. Accessibility (WCAG 2.2)
- **Touch Targets**: Minimum 44x44pt for all interactive elements
- **Color Contrast**: High contrast mode support
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and live regions

### 4. Performance Optimizations
- **Quick Check-in**: Streamlined flow under 30 seconds
- **Modal Selection**: Intuitive check-in mode selection with mobile-optimized touch targets
- **Lazy Loading**: Components loaded on demand
- **Offline Support**: PWA with service worker
- **Optimistic Updates**: Instant UI feedback

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=VigorLog
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# API Configuration (for future)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Customization

#### Theme Colors
Edit `src/app/globals.css` to customize the color scheme:

```css
:root {
  --primary: oklch(0.85 0.25 130); /* Cyber-lime */
  --accent: oklch(0.65 0.25 240);  /* Electric-blue */
}
```

#### Health Metrics
Modify `src/components/forms/daily-checkin-form.tsx` to adjust metrics.

## 🧪 Development

### Running Tests
```bash
pnpm test          # Run unit tests
pnpm test:e2e      # Run E2E tests
pnpm test:coverage # Generate coverage report
```

### Linting & Formatting
```bash
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix linting issues
pnpm format        # Run Prettier
```

### Building for Production
```bash
pnpm build         # Create production build
pnpm start         # Start production server
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Deploy with zero configuration

### Docker
```bash
docker build -t vigorlog .
docker run -p 3000:3000 vigorlog
```

### Self-Hosting
1. Build the application: `pnpm build`
2. Copy `.next`, `public`, and `package.json`
3. Install production dependencies: `pnpm install --prod`
4. Start with: `pnpm start`

## 📊 Monitoring & Analytics

### Debug Console
Access the debug console at `/debug` to:
- View application logs
- Monitor performance metrics
- Export debug data
- Track user interactions

### Error Tracking
The app includes a comprehensive logging system:
```javascript
logger.info('Component', 'Action performed', { data });
logger.error('Component', 'Error occurred', { error });
```

## 🔒 Security Considerations

### Current Implementation
- Client-side encryption (basic XOR - for demo only)
- LocalStorage for data persistence
- Demo authentication system

### Production Requirements
- [ ] Implement proper server-side encryption
- [ ] Add OAuth/JWT authentication
- [ ] Set up HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Set security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain WCAG 2.2 compliance
- Write tests for new features
- Update documentation
- Use conventional commits

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Font Awesome](https://fontawesome.com/) - Icon library

## 📞 Support

- **Documentation**: [/docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/vigorlog/issues)
- **Discord**: [Join our community](https://discord.gg/vigorlog)

---

Built with ❤️ for young athletes by the VigorLog team