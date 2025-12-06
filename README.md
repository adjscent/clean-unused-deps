# clean-unused-deps

Clean unused dependencies npm package

## Installation

```bash
npm install clean-unused-deps
```

## Publishing

This package uses GitHub Actions for automated publishing to npm when a release is created.

### Setup NPM_TOKEN Secret

To enable automated publishing, you need to configure the `NPM_TOKEN` secret in your GitHub repository:

1. **Generate an npm Access Token**:
   - Log in to [npmjs.com](https://www.npmjs.com/)
   - Go to your profile settings → Access Tokens
   - Click "Generate New Token" → Select "Automation" type
   - Copy the generated token

2. **Add the Secret to GitHub**:
   - Go to your repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm access token
   - Click "Add secret"

3. **Create a Release**:
   - Go to your repository → Releases → Create a new release
   - The workflow will automatically publish the package to npm

## License

MIT
