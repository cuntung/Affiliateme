# Contributing to Affiliateme

Thank you for your interest in contributing to Affiliateme! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

### Our Standards

- **Be respectful**: Treat everyone with respect and consideration
- **Be collaborative**: Work together and help each other
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different experience levels

## How to Contribute

### Reporting Bugs

Before reporting a bug, please:
1. Check if the bug has already been reported in [Issues](https://github.com/cuntung/Affiliateme/issues)
2. Use the latest version of the code
3. Provide clear steps to reproduce the issue

**Bug Report Template:**
```markdown
**Description**
A clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g., macOS 13.0]
- Node version: [e.g., 18.0.0]
- Browser: [e.g., Chrome 120]

**Additional Context**
Screenshots, error messages, logs, etc.
```

### Suggesting Features

We welcome feature suggestions! Before submitting:
1. Check if the feature has already been suggested
2. Clearly explain the problem the feature would solve
3. Describe your proposed solution

**Feature Request Template:**
```markdown
**Problem Statement**
Describe the problem or need

**Proposed Solution**
Your suggested solution

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, references, etc.
```

### Pull Requests

#### Before You Start

1. **Check existing issues**: Look for related issues or create one
2. **Discuss large changes**: For significant changes, discuss with maintainers first
3. **One feature per PR**: Keep pull requests focused and manageable

#### Pull Request Process

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/Affiliateme.git
   cd Affiliateme
   git remote add upstream https://github.com/cuntung/Affiliateme.git
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the code style guide
   - Add tests for new features
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   Follow the [commit message conventions](#commit-message-format)

6. **Keep your fork updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Link related issues

#### Pull Request Guidelines

**Title Format:**
```
<type>(<scope>): <short description>
```

Examples:
- `feat(links): add bulk import functionality`
- `fix(auth): resolve token expiration issue`
- `docs: update API documentation`

**Description Template:**
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Fixes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test the changes:
1. Step 1
2. Step 2

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

## Development Guidelines

### Code Style

#### JavaScript/Node.js

```javascript
// ✅ Good
async function getUserLinks(userId, options = {}) {
  const { page = 1, limit = 20 } = options;
  
  try {
    const links = await Link.findAll({
      where: { userId },
      limit,
      offset: (page - 1) * limit,
    });
    return links;
  } catch (error) {
    logger.error('Error fetching user links:', error);
    throw error;
  }
}

// ❌ Bad
function getUserLinks(userId, page, limit) {
  return new Promise((resolve, reject) => {
    Link.findAll({
      where: { user_id: userId },
      limit: limit || 20,
      offset: (page - 1) * limit
    }).then(links => {
      resolve(links);
    }).catch(err => {
      reject(err);
    });
  });
}
```

**Key Points:**
- Use `async/await` over callbacks
- Use descriptive variable names
- Use const/let, never var
- Add error handling
- Add JSDoc comments for public functions

#### React Components

```jsx
// ✅ Good
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * LinkCard component displays an affiliate link with actions
 */
function LinkCard({ link, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link.shortUrl);
  };

  return (
    <div className="link-card">
      <h3>{link.title}</h3>
      {isExpanded && <p>{link.description}</p>}
      <div className="actions">
        <button onClick={handleCopy}>Copy</button>
        <button onClick={() => onEdit(link)}>Edit</button>
        <button onClick={() => onDelete(link.id)}>Delete</button>
      </div>
    </div>
  );
}

LinkCard.propTypes = {
  link: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    shortUrl: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default LinkCard;

// ❌ Bad
import React from 'react';

class LinkCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }
  
  render() {
    return (
      <div>
        <h3>{this.props.link.title}</h3>
        <button onClick={() => this.props.onEdit(this.props.link)}>Edit</button>
      </div>
    );
  }
}
```

**Key Points:**
- Use functional components with hooks
- Add PropTypes validation
- Extract event handlers
- Use semantic HTML
- Keep components focused and small

### Testing Guidelines

#### Unit Tests

```javascript
// Example: Testing a service function
describe('LinkService', () => {
  describe('createLink', () => {
    it('should create a link with valid data', async () => {
      const linkData = {
        url: 'https://example.com/product',
        title: 'Test Product',
        userId: 'user-123',
      };

      const link = await LinkService.createLink(linkData);

      expect(link).toHaveProperty('id');
      expect(link.title).toBe('Test Product');
      expect(link.shortCode).toBeDefined();
    });

    it('should throw error with invalid URL', async () => {
      const linkData = {
        url: 'invalid-url',
        title: 'Test Product',
        userId: 'user-123',
      };

      await expect(LinkService.createLink(linkData))
        .rejects
        .toThrow('Invalid URL');
    });
  });
});
```

#### Integration Tests

```javascript
// Example: Testing API endpoints
describe('POST /api/links', () => {
  let authToken;

  beforeAll(async () => {
    // Setup: Create user and get auth token
    const user = await createTestUser();
    authToken = await getAuthToken(user);
  });

  afterAll(async () => {
    // Cleanup
    await cleanupTestData();
  });

  it('should create a new link', async () => {
    const response = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        originalUrl: 'https://example.com/product',
        title: 'Test Product',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.link).toHaveProperty('shortCode');
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .post('/api/links')
      .send({
        originalUrl: 'https://example.com/product',
        title: 'Test Product',
      });

    expect(response.status).toBe(401);
  });
});
```

### Documentation

#### Code Comments

```javascript
/**
 * Calculate conversion rate for a link
 * 
 * @param {string} linkId - The link ID
 * @param {Object} options - Calculation options
 * @param {Date} options.startDate - Start date for calculation
 * @param {Date} options.endDate - End date for calculation
 * @returns {Promise<number>} Conversion rate as percentage
 * @throws {Error} If link not found
 */
async function calculateConversionRate(linkId, options = {}) {
  // Implementation
}
```

#### README Updates

When adding a new feature, update relevant documentation:
- Update main README.md if it affects user-facing features
- Update API documentation for new endpoints
- Update GETTING_STARTED.md if setup changes
- Add examples and usage instructions

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**
```bash
feat(links): add bulk import functionality

fix(auth): resolve token expiration issue

docs: update API documentation for analytics endpoints

refactor(db): optimize link queries for better performance

test(links): add tests for link validation
```

## Review Process

### For Contributors

After submitting a PR:
1. Automated tests will run
2. A maintainer will review your code
3. Address any feedback or requested changes
4. Once approved, a maintainer will merge

### Review Checklist

Reviewers will check:
- [ ] Code follows style guidelines
- [ ] Tests pass and cover new code
- [ ] Documentation is updated
- [ ] No security vulnerabilities introduced
- [ ] Performance is acceptable
- [ ] Changes are minimal and focused

## Getting Help

### Questions?

- **General questions**: Open a [Discussion](https://github.com/cuntung/Affiliateme/discussions)
- **Bug reports**: Open an [Issue](https://github.com/cuntung/Affiliateme/issues)
- **Security issues**: See [SECURITY.md](./SECURITY.md)

### Resources

- [Getting Started Guide](./GETTING_STARTED.md)
- [Project Analysis](./PROJECT_ANALYSIS.md)
- [Technical Specifications](./TECHNICAL_SPECS.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes
- Project documentation

Thank you for contributing to Affiliateme! 🎉
