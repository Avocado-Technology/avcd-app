# Web Application Documentation Knowledge Graph

This directory contains all documentation for the AVCD web application, organized as a knowledge graph for easy navigation and discovery.

## 📁 Documentation Structure

### 🏗️ [Implementations](./implementations/)
Completed implementation summaries and documentation:
- [Org Chart Refactoring](./implementations/ORG_CHART_REFACTORING_COMPLETE.md) - Complete refactoring with TDD (116 tests)
- [Sidebar & Org Chart](./implementations/SIDEBAR_ORG_CHART_IMPLEMENTATION.md) - Sidebar and org chart features
- [Animation System](./implementations/ANIMATION_FIX_COMPLETED.md) - Animation fixes and improvements
- [Dark Mode](./implementations/DARK_MODE_IMPLEMENTATION_COMPLETE.md) - Dark mode implementation
- [Docker Setup](./implementations/DOCKER_IMPLEMENTATION_SUMMARY.md) - Docker configuration
- [ShadCN UI](./implementations/SHADCN_SETUP_COMPLETE.md) - Component library setup
- [Skills System](./implementations/SKILLS_IMPLEMENTATION_COMPLETE.md) - Cursor skills implementation
- [Auth Fixes](./implementations/LOGIN_FIX_COMPLETE.md) - Authentication fixes
- [OAuth Integration](./implementations/OAUTH_FIX_SUMMARY.md) - OAuth implementation
- [Animation Upgrade](./implementations/ANIMATION_SYSTEM_UPGRADE.md) - Animation system upgrade

### 📐 [Architecture](./architecture/)
Architectural decisions, audits, and comparisons:
- [Dark Mode Audit](./architecture/DARK_MODE_AUDIT.md) - Dark mode system audit
- [Docker Setup Audit](./architecture/DOCKER_SETUP_AUDIT.md) - Docker configuration audit
- [Docker Comparison](./architecture/DOCKER_SETUPS_COMPARISON.md) - Different Docker setups compared
- [Token Flow](./architecture/TOKEN_FLOW.md) - Authentication token flow

### 🛠️ [Setup Guides](./setup-guides/)
Step-by-step setup instructions:
- [Get Client Secret](./setup-guides/GET_CLIENT_SECRET.md) - OAuth client secret setup
- [Dark Mode Guide](./DARK_MODE_GUIDE.md) - Dark mode implementation guide
- [Dark Mode TDD Template](./DARK_MODE_TDD_TEMPLATE.md) - TDD template for dark mode
- [Docker Development](./DOCKER_DEVELOPMENT.md) - Docker development environment
- [Auth0 Localhost](./setup-guides/AUTH0_LOCALHOST_SETUP.md) - `.env` + `.env.local` and Auth0 v4 variables for local dev

### 🔧 [Fixes](./fixes/)
Bug fixes and troubleshooting:
- [Animation Fixes](./fixes/ANIMATION_FIXES.md) - Animation bug fixes
- [OAuth Error Fix](./fixes/OAUTH_ERROR_FIX.md) - OAuth error resolution
- [Quick OAuth Fix](./fixes/QUICK_FIX_OAUTH.md) - Quick OAuth fixes
- [OAuth Debug Tests](./fixes/TEST_OAUTH_WITH_DEBUG.md) - OAuth debugging
- [Web Login Diagnosis](./fixes/WEB_LOGIN_DIAGNOSIS.md) - Login issues diagnosis
- [Spacing Changes](./fixes/SPACING_CHANGES.md) - UI spacing fixes

### 📋 [Planning](./planning/)
TDD plans and implementation planning:
- [ShadCN TDD Plan](./planning/SHADCN_SETUP_TDD_PLAN.md) - ShadCN setup with TDD
- [Spacing TDD Plan](./planning/SPACING_PADDING_TDD_PLAN.md) - Spacing changes with TDD

### 🚀 [Deployment](./deploy-droplet.md)
Deployment documentation:
- [DigitalOcean Droplet Deployment](./deploy-droplet.md)
- [Vercel Deployment](./deploy-vercel.md)

### 📚 [Quick Reference](./QUICK_REFERENCE.md)
Quick reference guide for common tasks and patterns.

## 🔗 Related Documentation

### Skills
Skills documentation is located in `.cursor/skills/`:
- Motion animation skills
- React Flow skills
- ShadCN UI skills
- Avocado design system

### Testing
Test documentation and examples are located in `__tests__/`:
- Unit tests
- Integration tests
- E2E tests
- Test utilities

## 📊 Key Metrics

### Code Quality Achievements
- **Test Coverage:** 116 new tests for org chart refactoring
- **Code Duplication Reduced:** 75% reduction in node components
- **Memory Leaks:** 0 (all fixed with proper cleanup)
- **TypeScript Errors:** 0 in refactored code
- **Bundle Size Impact:** ~3.5KB (well under 5KB target)

### Architecture Improvements
- Centralized configuration and constants
- Shared TypeScript types for type safety
- Component-level error boundaries
- Comprehensive test coverage
- Proper memoization and performance optimization

## 🤝 Contributing

When adding new documentation:
1. Place it in the appropriate category folder
2. Update this README with a link
3. Follow the established naming conventions
4. Include clear titles and summaries
5. Link to related documents

## 📝 Documentation Standards

- Use Markdown format (`.md`)
- Include a clear title and summary
- Add implementation date
- Link to related code/files
- Include examples where applicable
- Document test results and metrics
- Add troubleshooting sections where relevant

---

*Last Updated: April 18, 2026*
*Maintained by: AVCD Development Team*
