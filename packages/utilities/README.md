# @workspace/utilities

Client-side utility functions for web development tools. All functions are pure, run in the browser, and require no backend support.

## Installation

This package is part of the monorepo workspace and is automatically available to other packages.

```bash
# If using outside the monorepo
pnpm add @workspace/utilities
```

## Features

### 🧩 Code Utilities

- **HTML Minifier** - Compress and minify HTML files
- **HTML Beautifier** - Format HTML with proper indentation
- **CSS Minifier** - Minify and optimize CSS code
- **CSS Beautifier** - Format CSS with proper indentation
- **JavaScript Minifier** - Minify JavaScript code
- **JavaScript Beautifier** - Format JavaScript code

### 📝 Formatters

- **JSON Formatter** - Format, validate, and beautify JSON
- **XML Formatter** - Beautify and format XML
- **YAML Formatter** - Format and validate YAML
- **CSV Formatter** - Format and convert CSV
- **SQL Formatter** - Format and beautify SQL queries
- **GraphQL Formatter** - Format GraphQL queries
- **TOML/INI Formatter** - Format configuration files
- **Code Snippet Formatter** - Format code for various platforms

### 🎨 Frontend Tools

- **Color Picker** - Convert colors between HEX, RGB, HSL, HSV
- **Color Palette Generator** - Generate color palettes
- **Color Contrast Checker** - Check WCAG contrast ratios
- **Gradient Generator** - Generate CSS gradients (linear, radial, conic)
- **Box Shadow Generator** - Generate CSS box-shadow properties
- **Text Shadow Generator** - Generate CSS text-shadow properties
- **Border Radius Generator** - Generate CSS border-radius
- **Transform Generator** - Generate CSS transform properties
- **CSS Animation Generator** - Generate CSS animations
- **CSS Specificity Calculator** - Calculate CSS selector specificity
- **Aspect Ratio Calculator** - Calculate and convert aspect ratios
- **Font Pairing Generator** - Suggest complementary font combinations

### 🔧 Backend Utilities

- **JWT Decoder** - Decode JWT tokens (payload only, no verification)
- **Hash Generator** - Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes
- **UUID Generator** - Generate UUID v1 and v4
- **Base64 Converter** - Convert text to/from Base64
- **URL Encoder/Decoder** - Encode and decode URLs
- **Query String Parser** - Parse and stringify query strings

### 📄 Content Tools

- **Markdown Preview** - Convert Markdown to HTML
- **Markdown Table Generator** - Generate Markdown tables
- **HTML to Markdown** - Convert HTML to Markdown
- **Lorem Ipsum Generator** - Generate placeholder text
- **Slug Generator** - Convert text to URL-friendly slugs
- **Mock Data Generator** - Generate fake data for testing

### 🔍 SEO Tools

- **Meta Tag Generator** - Generate HTML meta tags for SEO and social media
- **Robots.txt Generator** - Generate robots.txt files
- **Sitemap Generator** - Generate XML sitemaps

### 🛠️ Developer Utilities

- **Git Commit Generator** - Generate conventional commit messages
- **Environment Variable Generator** - Generate .env files with templates
- **License Generator** - Generate license files (MIT, Apache, GPL, etc.)
- **Package.json Generator** - Generate package.json with templates
- **HTTP Status Codes** - Reference and lookup HTTP status codes
- **HTTP Header Builder** - Build and validate HTTP headers
- **Cron Expression Builder** - Build and validate cron expressions
- **Timezone Converter** - Convert between timezones
- **Subnet Calculator** - Calculate subnet information
- **JSONPath Playground** - Test and build JSONPath expressions
- **Timestamp Converter** - Convert UNIX timestamps to dates
- **QR Code Generator** - Generate QR codes
- **User Agent Parser** - Parse user agent strings

### 🎯 Accessibility

- **ARIA Generator** - Generate ARIA attributes for accessibility
- **Semantic HTML Checker** - Validate semantic HTML structure

### 📦 Document Tools

- **PDF Tools** - Convert HTML to PDF, extract text from PDF
- **DOCX Tools** - Convert DOCX to PDF, extract text

### 🖼️ Multimedia

- **Image Tools** - Converter, optimizer, resizer, favicon generator
- **Video/Audio Converter** - Convert between formats

## Usage

### Basic Example

```typescript
import { formatJson, minifyHtml, generateUuid } from "@workspace/utilities";

// Format JSON
const formatted = formatJson('{"name":"John","age":30}');

// Minify HTML
const minified = await minifyHtml("<div>Hello</div>");

// Generate UUID
const uuid = generateUuid(); // v4 by default
```

### Advanced Examples

```typescript
import {
  formatJson,
  validateJson,
  minifyCss,
  generateGradient,
  generateCommitMessage,
  generateLicense,
} from "@workspace/utilities";

// JSON operations
const json = '{"name":"John"}';
const formatted = formatJson(json);
const isValid = validateJson(json);

// CSS operations
const css = "body { color: red; }";
const minified = await minifyCss(css);

// Generate gradient
const gradient = generateGradient({
  type: "linear",
  angle: 45,
  colors: ["#ff0000", "#0000ff"]
});

// Generate commit message
const commit = generateCommitMessage({
  type: "feat",
  subject: "add new feature",
  body: "Detailed description"
});

// Generate license
const license = generateLicense("MIT", {
  year: 2024,
  copyrightHolder: "Your Name"
});
```

## API Reference

### Formatters

All formatters follow a consistent API pattern:

```typescript
// Format/Beautify
formatJson(input: string): string
formatXml(input: string): string
formatYaml(input: string): string

// Minify
minifyHtml(input: string): Promise<string>
minifyCss(input: string): Promise<string>
minifyJs(input: string): Promise<string>

// Validate
validateJson(input: string): { valid: boolean; error?: string }
```

### Generators

Generators create new content:

```typescript
// UUID
generateUuid(version?: "v1" | "v4"): string

// Hash
generateHash(input: string, algorithm: "sha1" | "sha256" | "sha384" | "sha512"): string

// QR Code
generateQrCode(data: string, options?: QrCodeOptions): Promise<string>
```

## Tree Shaking

All exports are tree-shakeable. Import only what you need:

```typescript
// ✅ Good - only imports what you need
import { formatJson } from "@workspace/utilities/formatters/json-formatter";

// ❌ Avoid - imports entire package
import * as formatters from "@workspace/utilities";
```

## Type Safety

All functions are fully typed with TypeScript:

```typescript
import type { CommitMessage } from "@workspace/types/git";
import { generateCommitMessage } from "@workspace/utilities";

const commit: CommitMessage = {
  type: "feat",
  subject: "add feature"
};

const message = generateCommitMessage(commit);
```

## Browser Support

All functions work in modern browsers that support:
- ES2022 features
- Async/await
- Fetch API (for some functions)

## Contributing

When adding new utilities:

1. Create the function in the appropriate directory
2. Export from the directory's index file
3. Add to the main `src/index.ts` export
4. Add TypeScript types
5. Update this README

## License

MIT
