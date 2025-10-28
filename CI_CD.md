# CI/CD Pipeline Documentation

This document provides comprehensive information about the Continuous Integration and Continuous Deployment (CI/CD) pipelines configured for the Anonymous Art Authentication project.

---

## 📋 Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Code Quality Tools](#code-quality-tools)
- [Secrets Configuration](#secrets-configuration)
- [Workflow Triggers](#workflow-triggers)
- [Coverage Reporting](#coverage-reporting)
- [Best Practices](#best-practices)

---

## Overview

The project uses **GitHub Actions** for automated testing, code quality checks, and deployment processes. All workflows are located in `.github/workflows/` directory.

### CI/CD Features

✅ **Automated Testing** - Runs on every push and PR
✅ **Multi-Platform** - Tests on Ubuntu and Windows
✅ **Multi-Version** - Node.js 18.x and 20.x
✅ **Code Quality** - Solhint linting and Prettier formatting
✅ **Coverage Reports** - Codecov integration
✅ **Gas Analysis** - Gas usage reporting
✅ **Security Scanning** - npm audit checks
✅ **Automated Deployment** - Manual workflow dispatch

---

## GitHub Actions Workflows

### 1. Test Suite (`.github/workflows/test.yml`)

Main testing workflow that runs comprehensive test suite.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### a) Test Job
- **Matrix Strategy:** Tests across multiple environments
  - OS: Ubuntu Latest, Windows Latest
  - Node.js: 18.x, 20.x
- **Steps:**
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies (`npm ci`)
  4. Compile contracts
  5. Run tests
  6. Display results

#### b) Lint Job
- **Purpose:** Code quality verification
- **Steps:**
  1. Checkout code
  2. Setup Node.js 20.x
  3. Install dependencies
  4. Run Solhint (`npm run lint`)
  5. Check formatting (`npm run format -- --check`)

#### c) Coverage Job
- **Purpose:** Generate and upload test coverage
- **Steps:**
  1. Checkout code
  2. Setup Node.js 20.x
  3. Install dependencies
  4. Generate coverage report
  5. Upload to Codecov
  6. Archive coverage artifacts (30 days retention)

#### d) Build Job
- **Purpose:** Verify contract compilation
- **Steps:**
  1. Clean previous builds
  2. Compile contracts
  3. Check contract sizes (24 KB limit)

#### e) Security Job
- **Purpose:** Security vulnerability scanning
- **Steps:**
  1. Run npm audit
  2. Check for outdated packages
  3. Report security issues

**Example Output:**
```
✓ Test Job (ubuntu-latest, 18.x)
✓ Test Job (ubuntu-latest, 20.x)
✓ Test Job (windows-latest, 18.x)
✓ Test Job (windows-latest, 20.x)
✓ Lint Job
✓ Coverage Job
✓ Build Job
✓ Security Job
```

---

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

Manual deployment workflow for deploying contracts to networks.

**Trigger:** Manual workflow dispatch

**Inputs:**
- `network`: Choice of `sepolia` or `localhost`

**Jobs:**

#### a) Deploy Job
- Deploy contract to specified network
- Save deployment information
- Generate deployment summary

#### b) Verify Job (Sepolia only)
- Verify contract on Etherscan
- Only runs for Sepolia deployments

**Usage:**
1. Go to GitHub Actions tab
2. Select "Deploy to Sepolia" workflow
3. Click "Run workflow"
4. Select network
5. Click "Run workflow" button

---

### 3. Code Quality Workflow (`.github/workflows/code-quality.yml`)

Comprehensive code quality checks.

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Jobs:**

#### a) Solhint Job
- Lint all Solidity files
- Generate lint report
- Display issues in PR

#### b) Prettier Job
- Check Solidity formatting
- Check JavaScript formatting
- Fail if formatting issues found

#### c) Complexity Job
- Analyze contract complexity
- Check for overly complex functions

#### d) Gas Report Job
- Generate gas usage report
- Upload as artifact
- Display summary

#### e) Dependencies Job
- Check for outdated packages
- Run security audit
- Report vulnerabilities

---

## Code Quality Tools

### Solhint Configuration (`.solhint.json`)

Solidity linting with recommended rules plus custom configurations.

**Key Rules:**
```json
{
  "code-complexity": ["error", 10],
  "compiler-version": ["error", "^0.8.0"],
  "max-line-length": ["error", 120],
  "gas-custom-errors": "warn",
  "no-global-import": "warn"
}
```

**Run Locally:**
```bash
npm run lint              # Run Solhint
npm run lint:fix          # Auto-fix issues
```

### Solhint Ignore (`.solhintignore`)

Excluded from linting:
- `node_modules/`
- `artifacts/`
- `cache/`
- `coverage/`
- `test/`
- `scripts/`

### Prettier Formatting

Code formatting for consistency.

**Run Locally:**
```bash
npm run format            # Format all files
npm run format -- --check # Check formatting
```

---

## Secrets Configuration

### Required GitHub Secrets

Configure these in: `Settings` → `Secrets and variables` → `Actions`

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `SEPOLIA_RPC_URL` | Infura/Alchemy Sepolia RPC endpoint | Deployment |
| `PRIVATE_KEY` | Deployer wallet private key (no 0x) | Deployment |
| `ETHERSCAN_API_KEY` | Etherscan API key for verification | Verification |
| `CODECOV_TOKEN` | Codecov upload token | Coverage |

### Setting Up Secrets

1. **Generate Sepolia RPC URL:**
   - Sign up at [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/)
   - Create new project
   - Copy Sepolia endpoint URL

2. **Get Private Key:**
   - Use testnet-only wallet
   - Export private key from MetaMask
   - **Never use mainnet wallet!**

3. **Get Etherscan API Key:**
   - Register at [Etherscan](https://etherscan.io/)
   - Go to [API Keys](https://etherscan.io/myapikey)
   - Create new API key

4. **Get Codecov Token:**
   - Sign up at [Codecov](https://codecov.io/)
   - Add repository
   - Copy upload token

---

## Workflow Triggers

### Automatic Triggers

**On Push:**
```yaml
on:
  push:
    branches:
      - main
      - develop
```

**On Pull Request:**
```yaml
on:
  pull_request:
    branches:
      - main
      - develop
```

### Manual Triggers

**Workflow Dispatch:**
```yaml
on:
  workflow_dispatch:
    inputs:
      network:
        description: 'Network to deploy to'
        required: true
        default: 'sepolia'
```

### Branch Protection Rules

Recommended settings for `main` branch:

- ✅ Require pull request reviews
- ✅ Require status checks to pass:
  - Test (ubuntu-latest, 18.x)
  - Test (ubuntu-latest, 20.x)
  - Lint
  - Build
- ✅ Require branches to be up to date
- ✅ Require linear history

---

## Coverage Reporting

### Codecov Integration

**Setup:**
1. Sign up at [codecov.io](https://codecov.io/)
2. Connect GitHub repository
3. Copy upload token
4. Add as `CODECOV_TOKEN` secret

**Coverage Badge:**
```markdown
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
```

**View Reports:**
- Visit: `https://codecov.io/gh/USERNAME/REPO`
- View coverage trends
- See file-by-file coverage
- Compare between commits

### Local Coverage

Generate coverage locally:
```bash
npm run test:coverage
```

View HTML report:
```bash
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

---

## Best Practices

### 1. Pull Request Workflow

**Before Creating PR:**
```bash
# Ensure code is formatted
npm run format

# Run linter
npm run lint

# Run tests locally
npm test

# Check coverage
npm run test:coverage
```

**During PR Review:**
- All CI checks must pass
- Coverage should not decrease
- No new linting errors
- Gas usage within acceptable limits

### 2. Commit Messages

Follow conventional commits:
```
feat: add expert reputation system
fix: resolve authentication counting issue
docs: update deployment guide
test: add boundary condition tests
chore: update dependencies
```

### 3. Testing Requirements

- All new features must include tests
- Maintain >90% code coverage
- Test edge cases and error conditions
- Verify gas efficiency

### 4. Code Quality Standards

**Solidity:**
- Follow Solidity style guide
- Use descriptive variable names
- Add NatSpec comments
- Keep functions small and focused
- Maximum complexity: 10

**JavaScript:**
- Use ES6+ features
- Add JSDoc comments
- Handle errors properly
- Use async/await

### 5. Security Practices

- Never commit private keys
- Use environment variables for secrets
- Run security audits regularly
- Keep dependencies updated
- Follow OpenZeppelin patterns

---

## Workflow Status Badges

Add these badges to README.md:

```markdown
[![Test Suite](https://github.com/USERNAME/REPO/workflows/Test%20Suite/badge.svg)](https://github.com/USERNAME/REPO/actions)
[![Code Quality](https://github.com/USERNAME/REPO/workflows/Code%20Quality/badge.svg)](https://github.com/USERNAME/REPO/actions)
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
```

---

## Troubleshooting

### Common Issues

#### 1. Test Failures

**Problem:** Tests pass locally but fail in CI

**Solutions:**
- Check Node.js version matches
- Ensure `npm ci` is used (not `npm install`)
- Verify environment variables
- Check for timing-dependent tests

#### 2. Linting Errors

**Problem:** Solhint reports errors

**Solutions:**
```bash
# View errors
npm run lint

# Auto-fix when possible
npm run lint:fix

# Check specific file
npx solhint contracts/YourContract.sol
```

#### 3. Coverage Upload Fails

**Problem:** Codecov upload fails

**Solutions:**
- Verify `CODECOV_TOKEN` secret is set
- Check Codecov service status
- Ensure coverage files are generated
- Review Codecov documentation

#### 4. Deployment Fails

**Problem:** Manual deployment workflow fails

**Solutions:**
- Verify all secrets are configured
- Check wallet has sufficient ETH
- Ensure RPC URL is correct
- Review deployment logs

#### 5. Secret Not Found

**Problem:** Workflow can't access secret

**Solutions:**
- Verify secret name matches exactly
- Check secret is set in repository settings
- Ensure workflow has correct permissions
- For forks, secrets need to be reconfigured

---

## Performance Optimization

### Speed Up CI/CD

**1. Use npm ci instead of npm install:**
```yaml
- run: npm ci  # Faster, more reliable
```

**2. Enable caching:**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm'
```

**3. Run jobs in parallel:**
- Test, Lint, and Build run concurrently
- Only deploy after tests pass

**4. Skip unnecessary steps:**
```yaml
- name: Skip if documentation only
  if: "!contains(github.event.head_commit.message, '[skip ci]')"
```

---

## Monitoring and Notifications

### GitHub Actions Dashboard

View workflow runs:
1. Go to repository
2. Click "Actions" tab
3. See all workflow runs
4. Filter by status, branch, workflow

### Email Notifications

Configure in GitHub settings:
- `Settings` → `Notifications`
- Enable "Actions" notifications
- Choose notification frequency

### Slack Integration

Add Slack notifications:
```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Build failed: ${{ github.repository }}"
      }
```

---

## Continuous Improvement

### Regular Maintenance

**Weekly:**
- Review failed workflows
- Check for outdated dependencies
- Monitor gas usage trends

**Monthly:**
- Update GitHub Actions versions
- Review and update Solhint rules
- Check security advisories
- Update documentation

**Quarterly:**
- Audit secret management
- Review branch protection rules
- Optimize workflow performance
- Conduct security review

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Solhint Documentation](https://github.com/protofire/solhint)
- [Codecov Documentation](https://docs.codecov.com/)
- [Hardhat CI Documentation](https://hardhat.org/hardhat-runner/docs/advanced/ci)

---

## Support

For CI/CD issues:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Consult [GitHub Actions community](https://github.community/)
4. Open issue in repository

---

**Last Updated:** December 2024
**CI/CD Version:** 1.0
**Workflows:** 3 (Test, Deploy, Code Quality)
