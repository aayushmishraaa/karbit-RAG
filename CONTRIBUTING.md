# Contributing to Karbit RAG Chat Interface

Thank you for your interest in contributing to the Karbit RAG Chat Interface! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Browser and version
   - Node.js version
   - Steps to reproduce
   - Expected vs actual behavior
   - Console errors (if any)

### Suggesting Features
1. **Open an issue** with the "enhancement" label
2. **Describe the feature** in detail
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### Code Contributions

#### Setup Development Environment
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/karbit-RAG.git
   cd karbit-RAG
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm start
   ```

#### Making Changes
1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following the coding standards
3. **Test thoroughly** in different browsers
4. **Commit with clear messages**:
   ```bash
   git commit -m "Add: Brief description of your changes"
   ```

#### Pull Request Process
1. **Update documentation** if needed
2. **Test your changes** thoroughly
3. **Submit pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (if UI changes)
   - Testing information

## 📝 Coding Standards

### JavaScript
- Use ES6+ features where appropriate
- Follow consistent naming conventions (camelCase)
- Add comments for complex logic
- Handle errors gracefully
- Use async/await for asynchronous operations

### CSS
- Use meaningful class names
- Maintain consistent indentation (2 spaces)
- Group related properties together
- Use CSS variables for repeated values
- Follow mobile-first responsive design

### HTML
- Use semantic HTML elements
- Ensure accessibility compliance
- Maintain proper indentation
- Include alt text for images

## 🏗️ Project Structure

```
karbit-RAG/
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── script.js           # Client-side functionality
├── server.js           # Express server and webhook proxy
├── package.json        # Dependencies and metadata
└── docs/              # Documentation files
```

## 🧪 Testing Guidelines

### Manual Testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Verify mobile responsiveness
- Test webhook connectivity
- Validate error handling
- Check accessibility features

### Areas to Test
1. **Chat Functionality**
   - Message sending/receiving
   - Typing indicators
   - Error handling
   - Connection testing

2. **UI/UX**
   - Responsive design
   - Animations and transitions
   - Keyboard shortcuts
   - Visual feedback

3. **Server Integration**
   - Webhook communication
   - CORS handling
   - Fallback mechanisms
   - Error responses

## 🔧 Common Development Tasks

### Adding New Features
1. **Client-side features**: Modify `script.js` and `styles.css`
2. **Server-side features**: Update `server.js`
3. **UI changes**: Edit `index.html` and `styles.css`

### Debugging
- Use browser DevTools for client-side debugging
- Check server console for backend issues
- Enable detailed logging in development mode

### Performance Optimization
- Minimize HTTP requests
- Optimize animations for smooth performance
- Reduce bundle size where possible
- Test on slower devices

## 📋 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `priority-high`: Critical issues
- `priority-medium`: Important issues
- `priority-low`: Nice to have

## 🎯 Focus Areas

We welcome contributions in these areas:
- **UI/UX improvements**: Better design and user experience
- **Performance optimization**: Faster loading and smoother animations
- **Accessibility**: Better support for screen readers and keyboard navigation
- **Mobile experience**: Enhanced mobile responsiveness
- **Error handling**: More robust error management
- **Documentation**: Clearer guides and examples
- **Testing**: Automated testing capabilities

## 📞 Getting Help

- **Discord/Slack**: Join our community chat (if available)
- **GitHub Issues**: Ask questions using the "question" label
- **Email**: Contact maintainers directly for complex issues

## 🔒 Security

- **Report security issues** privately via email
- **Don't include** sensitive information in public issues
- **Use environment variables** for sensitive configuration

## 📜 Code of Conduct

- Be respectful and inclusive
- Help newcomers learn and contribute
- Focus on constructive feedback
- Maintain a professional tone

Thank you for contributing to make this project better! 🚀