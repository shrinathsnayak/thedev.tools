# @workspace/eslint-config

Shared ESLint configurations for the thedev.tools monorepo. Ensures consistent code quality and style across all packages.

## Installation

This package is part of the monorepo workspace and is automatically available to other packages.

```bash
# If using outside the monorepo
pnpm add -D @workspace/eslint-config
```

## Usage

### Base Configuration

For general TypeScript/JavaScript projects:

```javascript
// eslint.config.js
import baseConfig from "@workspace/eslint-config/base";

export default baseConfig;
```

### Next.js Configuration

For Next.js applications:

```javascript
// eslint.config.js
import nextConfig from "@workspace/eslint-config/next-js";

export default nextConfig;
```

### React Internal Configuration

For React components and hooks:

```javascript
// eslint.config.js
import reactConfig from "@workspace/eslint-config/react-internal";

export default reactConfig;
```

## Available Configurations

### `base`

Base ESLint configuration with:

- TypeScript support
- Modern ES2022+ rules
- Prettier integration
- Import sorting
- Common best practices

### `next-js`

Next.js-specific configuration extending base with:

- Next.js plugin rules
- React hooks rules
- Next.js-specific optimizations

### `react-internal`

React-specific configuration with:

- React plugin rules
- React hooks rules
- JSX-specific linting

## Features

- **TypeScript Support** - Full TypeScript linting with type-aware rules
- **Prettier Integration** - Works seamlessly with Prettier
- **Import Sorting** - Automatically sorts imports
- **Modern JavaScript** - ES2022+ features supported
- **Zero Conflicts** - All rules are carefully configured to work together

## Customization

You can extend and customize configurations:

```javascript
import baseConfig from "@workspace/eslint-config/base";

export default [
  ...baseConfig,
  {
    rules: {
      // Your custom rules
      "no-console": "warn",
    },
  },
];
```

## License

MIT
