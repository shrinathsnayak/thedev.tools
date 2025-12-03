# thedev.tools

> 100+ developer tools that respect your privacy. Everything runs in your browser - your data never leaves your device.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black.svg)](https://nextjs.org/)
[![Turbo](https://img.shields.io/badge/Turbo-2.5-blue.svg)](https://turbo.build/)

## 🚀 Overview

thedev.tools is a modern, open-source platform providing 100+ developer tools and utilities built for developers. Built with Next.js, TypeScript, and a monorepo architecture, it offers everything from code formatters to SEO generators. All tools run entirely in your browser - your data never leaves your device, ensuring complete privacy and security.

## ✨ Features

### 🧩 Code Utilities

- **HTML Tools**: Minify, beautify, validate, extract links/images/meta tags
- **CSS Tools**: Minify, beautify, validate, extract colors, calculate specificity
- **JavaScript Tools**: Minify, beautify, validate, obfuscate, format
- **Code Snippet Formatter**: Format code for GitHub, Gist, Pastebin

### 📝 Formatters

- **JSON**: Format, validate, beautify, minify, compare, merge
- **XML**: Format, validate, beautify, minify
- **YAML**: Format, validate, convert to/from JSON
- **CSV**: Format, validate, convert to/from JSON
- **SQL**: Format, validate, beautify
- **GraphQL**: Format, validate queries
- **TOML/INI**: Format and validate

### 🎨 Frontend Tools

- **Color Tools**: Picker, converter (HEX/RGB/HSL), palette generator, contrast checker
- **CSS Generators**: Gradients, box shadows, text shadows, border radius, transforms, animations
- **Font Tools**: Pairing generator, font preview
- **Aspect Ratio Calculator**: Calculate and convert aspect ratios

### 🔧 Backend Utilities

- **JWT Decoder**: Decode and inspect JWT tokens
- **Hash Generator**: SHA-1, SHA-256, SHA-384, SHA-512
- **UUID Generator**: Generate UUID v1 and v4
- **Base64 Converter**: Encode/decode Base64
- **URL Encoder/Decoder**: Encode and decode URLs

### 📄 Content Tools

- **Markdown**: Preview, table generator, to HTML converter
- **Lorem Ipsum**: Generate placeholder text
- **Slug Generator**: Convert text to URL-friendly slugs
- **Mock Data Generator**: Generate fake data for testing

### 🔍 SEO Tools

- **Meta Tag Generator**: Generate HTML meta tags for SEO and social media
- **Robots.txt Generator**: Generate robots.txt files
- **Sitemap Generator**: Generate XML sitemaps

### 🛠️ Developer Utilities

- **Git Commit Generator**: Generate conventional commit messages
- **Environment Variable Generator**: Generate .env files with templates
- **License Generator**: Generate license files (MIT, Apache, GPL, etc.)
- **Package.json Generator**: Generate package.json with templates
- **HTTP Status Codes**: Reference and lookup HTTP status codes
- **HTTP Header Builder**: Build and validate HTTP headers
- **Cron Expression Builder**: Build and validate cron expressions
- **Timezone Converter**: Convert between timezones
- **Subnet Calculator**: Calculate subnet information
- **JSONPath Playground**: Test and build JSONPath expressions

### 🎯 Accessibility

- **ARIA Generator**: Generate ARIA attributes for accessibility
- **Semantic HTML Checker**: Validate semantic HTML structure

### 📦 Document Tools

- **PDF Tools**: Convert HTML to PDF, extract text from PDF
- **DOCX Tools**: Convert DOCX to PDF, extract text

### 🖼️ Multimedia

- **Image Tools**: Converter, optimizer, resizer, favicon generator
- **Video/Audio Converter**: Convert between formats

## 🏗️ Architecture

This project is built as a **monorepo** using:

- **Turborepo** for build orchestration
- **pnpm** for package management
- **Next.js 15** for the web application
- **TypeScript** for type safety

### Package Structure

```
thedev.tools/
├── apps/
│   └── web/              # Next.js web application
├── packages/
│   ├── ui/               # shadcn/ui component library
│   ├── utilities/        # Core utility functions
│   ├── constants/        # Shared constants
│   ├── types/            # Shared TypeScript types
│   ├── typescript-config/ # Shared TypeScript configs
│   └── eslint-config/    # Shared ESLint configs
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10.4.1

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/thedev.tools.git
cd thedev.tools

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
# Build all packages and apps
pnpm build

# Build specific package
pnpm --filter @workspace/formatters build
```

### Lint

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm --filter @workspace/formatters lint
```

## 📦 Packages

### `@workspace/ui`

shadcn/ui component library with all components pre-configured.

**Key Features:**

- 54+ shadcn/ui components
- Pre-configured Tailwind CSS setup
- TypeScript support
- Dark mode support
- Accessible components built on Radix UI

### `@workspace/utilities`

Core utility functions for all developer tools. All functions are pure and run client-side.

**Key Features:**

- 100+ utility functions
- Zero dependencies on Node.js APIs
- Fully typed with TypeScript
- Tree-shakeable exports

[📖 Read the Utilities README](./packages/utilities/README.md)

### `@workspace/constants`

Shared constants used across the monorepo.

**Exports:**

- Tool categories and configurations
- HTTP status codes and headers
- Timezone data
- Aspect ratio presets
- Git commit types
- Environment variable templates
- License information
- Cron expressions
- Font pairings
- ARIA roles
- Package.json templates
- JSONPath expressions
- Subnet masks
- Supported programming languages

[📖 Read the Constants README](./packages/constants/README.md)

### `@workspace/types`

Shared TypeScript type definitions.

**Exports:**

- Tool and ToolCategory types
- HTTP-related types
- Timezone types
- Aspect ratio types
- Git commit types
- Environment variable types
- License types
- Cron types
- Font types
- ARIA types
- Package.json types
- JSONPath types

[📖 Read the Types README](./packages/types/README.md)

### `@workspace/typescript-config`

Shared TypeScript configurations for consistent type checking across packages.

[📖 Read the TypeScript Config README](./packages/typescript-config/README.md)

### `@workspace/eslint-config`

Shared ESLint configurations for code quality and consistency.

[📖 Read the ESLint Config README](./packages/eslint-config/README.md)

## 🛠️ Development

### Adding a New Tool

1. Add the tool definition to `apps/web/lib/tools/tools.ts`
2. Create the tool implementation in `packages/utilities/src/`
3. Create the UI page in `apps/web/app/tools/`
4. Update relevant constants/types if needed

### Project Structure

```
apps/web/
├── app/                  # Next.js app directory
│   └── tools/            # Tool pages
├── components/           # React components
├── lib/                  # Library code
│   └── tools/            # Tool definitions and utilities
└── constants/            # App-specific constants

packages/utilities/
├── src/
│   ├── accessibility/    # Accessibility tools
│   ├── backend/          # Backend utilities
│   ├── code/             # Code minifiers
│   ├── content/          # Content generators
│   ├── document/         # Document converters
│   ├── formatters/       # Data formatters
│   ├── frontend/         # Frontend tools
│   ├── multimedia/      # Media tools
│   ├── security/         # Security tools
│   ├── seo/              # SEO tools
│   └── utilities/        # General utilities

packages/ui/
├── src/
│   ├── components/       # shadcn/ui components
│   ├── lib/              # Utility functions
│   └── styles.css        # Base shadcn styles
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for all functions
- Write clear commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Update documentation as needed
- Ensure all tests pass (if applicable)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Turborepo](https://turbo.build/)
- Icons from [Lucide](https://lucide.dev)

## 📧 Contact

For questions, suggestions, or support, please open an issue on GitHub.

---

Made with ❤️ by the developer community
