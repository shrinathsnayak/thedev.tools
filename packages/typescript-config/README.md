# @workspace/typescript-config

Shared TypeScript configurations for the thedev.tools monorepo. Ensures consistent type checking and compilation settings across all packages.

## Installation

This package is part of the monorepo workspace and is automatically available to other packages.

```bash
# If using outside the monorepo
pnpm add -D @workspace/typescript-config
```

## Usage

### Base Configuration

Extend the base configuration in your `tsconfig.json`:

```json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### Next.js Configuration

For Next.js applications:

```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### React Library Configuration

For React component libraries:

```json
{
  "extends": "@workspace/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Available Configurations

### `base.json`

Base TypeScript configuration with:

- Strict type checking enabled
- Modern ES2022 target
- ESNext modules
- Bundler module resolution
- Common compiler options

### `nextjs.json`

Next.js-specific configuration extending base.json with:

- Next.js type definitions
- JSX support
- Path aliases support

### `react-library.json`

React library configuration with:

- React JSX support
- Declaration file generation
- Library-optimized settings

## Customization

You can override any settings in your local `tsconfig.json`:

```json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    "strict": false, // Override strict mode
    "target": "ES2020" // Override target
  }
}
```

## License

MIT
