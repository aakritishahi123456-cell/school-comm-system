# Contributing to WhatsApp School Communication System

Thank you for your interest in contributing to this project! This guide will help you get started.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/school-comm-system.git
   cd school-comm-system
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```
5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```
6. **Start development server**
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(parser): add support for multi-line homework descriptions
fix(webhook): handle undefined message body gracefully
docs(api): update message format examples
```

## 📋 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build
   npm run test  # When tests are available
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide clear description of changes
   - Link related issues
   - Request review from maintainers

## 🎯 Areas for Contribution

### High Priority
- [ ] Unit and integration tests
- [ ] Error handling improvements
- [ ] Performance optimizations
- [ ] Security enhancements
- [ ] Documentation improvements

### Features
- [ ] Admin web dashboard
- [ ] Two-way parent communication
- [ ] Photo/document sharing
- [ ] Multi-school management
- [ ] Advanced analytics
- [ ] AI-powered features

### Bug Fixes
- [ ] Edge cases in message parsing
- [ ] Database connection handling
- [ ] WhatsApp API error handling
- [ ] Timezone handling improvements

### Documentation
- [ ] API documentation
- [ ] Deployment guides
- [ ] Troubleshooting guides
- [ ] Video tutorials
- [ ] Translation guides

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Prefer `type` imports for type-only imports
- Use proper type annotations
- Avoid `any` types when possible

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Use meaningful variable names
- Add JSDoc comments for functions

### File Organization
```
src/
├── services/          # Business logic
├── routes/           # API routes
├── utils/            # Utility functions
├── types/            # Type definitions
└── index.ts          # Main application
```

### Database
- Use Prisma for database operations
- Create migrations for schema changes
- Use proper foreign key relationships
- Add database indexes for performance

### Error Handling
- Use try-catch blocks appropriately
- Log errors with context
- Return meaningful error messages
- Handle edge cases gracefully

## 🧪 Testing Guidelines

### Test Structure
```
tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
├── fixtures/         # Test data
└── helpers/          # Test utilities
```

### Writing Tests
- Test both success and error cases
- Use descriptive test names
- Mock external dependencies
- Test edge cases and boundary conditions

### Running Tests
```bash
npm test                 # Run all tests
npm run test:unit       # Run unit tests only
npm run test:integration # Run integration tests
npm run test:watch      # Run tests in watch mode
```

## 🌍 Internationalization

### Adding New Languages
1. Add language code to `Language` type in `src/utils/translations.ts`
2. Add translations object for the new language
3. Test message formatting
4. Update documentation

### Translation Guidelines
- Keep messages concise for WhatsApp
- Use appropriate emojis for visual appeal
- Consider cultural context
- Test with native speakers

## 🔒 Security Guidelines

### Sensitive Data
- Never commit API keys or passwords
- Use environment variables for secrets
- Validate all user inputs
- Sanitize data before database operations

### WhatsApp Integration
- Verify webhook signatures
- Validate message sources
- Rate limit API calls
- Handle API errors gracefully

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for public functions
- Document complex algorithms
- Explain business logic
- Include usage examples

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify error codes
- Update OpenAPI spec if available

### User Documentation
- Keep README up to date
- Update deployment guides
- Add troubleshooting tips
- Include screenshots where helpful

## 🐛 Bug Reports

### Before Reporting
- Check existing issues
- Test with latest version
- Gather reproduction steps
- Check logs for errors

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Ubuntu 20.04]
- Node.js: [e.g., 18.17.0]
- Database: [e.g., PostgreSQL 15]

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Any other relevant information
```

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check existing docs first
- **Code Review**: Ask for feedback on complex changes

## 📋 Checklist for Contributors

Before submitting a PR, ensure:
- [ ] Code follows project standards
- [ ] Tests pass (when available)
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No sensitive data in commits
- [ ] PR description is clear and complete

## 🎉 Thank You!

Your contributions help make this project better for schools in Nepal and beyond. Every contribution, no matter how small, is valuable and appreciated!

---

**Happy Contributing! 🚀**