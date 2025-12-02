# @workspace/constants

Shared constants package for the thedev.tools monorepo. Contains all reusable constants used across packages and applications.

## Installation

This package is part of the monorepo workspace and is automatically available to other packages via workspace protocol.

```bash
# If using outside the monorepo
pnpm add @workspace/constants
```

## Usage

```typescript
import { TOOL_CATEGORIES } from "@workspace/constants/tools";
import { HTTP_STATUS_CODES } from "@workspace/constants/http";
import { COMMON_TIMEZONES } from "@workspace/constants/timezone";
import { ASPECT_RATIO_PRESETS } from "@workspace/constants/aspect-ratio";
import { COMMIT_TYPES } from "@workspace/constants/git";
import { ENV_TEMPLATES } from "@workspace/constants/env";
import { LICENSE_INFO } from "@workspace/constants/license";
import {
  CRON_FIELDS,
  COMMON_CRON_EXPRESSIONS,
} from "@workspace/constants/cron";
import { FONT_PAIRINGS } from "@workspace/constants/font";
import { ARIA_ROLES } from "@workspace/constants/aria";
import { PACKAGE_TEMPLATES } from "@workspace/constants/package";
import { COMMON_JSONPATH_EXPRESSIONS } from "@workspace/constants/jsonpath";
import { COMMON_SUBNET_MASKS } from "@workspace/constants/subnet";
import { SUPPORTED_LANGUAGES } from "@workspace/constants/code";
```

## Exports

### `@workspace/constants/tools`

Tool-related constants including categories, search configuration, and path constants.

```typescript
import {
  TOOL_CATEGORIES,
  TOOL_CATEGORY_CODE,
  TOOL_CATEGORY_FRONTEND,
  TOOL_CATEGORY_BACKEND,
  TOOL_CATEGORY_CONTENT,
  TOOL_CATEGORY_SEO,
  TOOL_CATEGORY_UTILITIES,
  TOOL_CATEGORY_FORMATTERS,
  TOOL_CATEGORY_MULTIMEDIA,
  TOOL_CATEGORY_SECURITY,
  TOOL_CATEGORY_WORKFLOW,
  TOOL_CATEGORY_DATABASE,
  TOOL_CATEGORY_INFRASTRUCTURE,
  TOOL_CATEGORY_API,
  FUSE_SEARCH_CONFIG,
  MIN_SEARCH_QUERY_LENGTH,
  PATH_CONSTANTS,
} from "@workspace/constants/tools";
```

**Individual Category Constants:**

You can import individual category constants for type-safe usage:

```typescript
import { TOOL_CATEGORY_CODE, TOOL_CATEGORY_FRONTEND } from "@workspace/constants/tools";

const tool = {
  category: TOOL_CATEGORY_CODE, // Type-safe category
  // ...
};
```

**Available Category Constants:**
- `TOOL_CATEGORY_CODE` - Code utilities (HTML, CSS, JS)
- `TOOL_CATEGORY_FRONTEND` - Frontend tools (colors, gradients, CSS generators)
- `TOOL_CATEGORY_BACKEND` - Backend utilities (JWT, hashing, UUID)
- `TOOL_CATEGORY_CONTENT` - Content tools (Markdown, Lorem Ipsum, slugs)
- `TOOL_CATEGORY_SEO` - SEO tools (meta tags, robots.txt, sitemap)
- `TOOL_CATEGORY_UTILITIES` - General utilities (timestamps, QR codes, parsers)
- `TOOL_CATEGORY_FORMATTERS` - Data formatters (JSON, XML, YAML, SQL)
- `TOOL_CATEGORY_MULTIMEDIA` - Multimedia tools (image, video, audio converters)
- `TOOL_CATEGORY_SECURITY` - Security tools (JWT decoder, hash generator, CSP)
- `TOOL_CATEGORY_WORKFLOW` - Workflow tools (git commits, licenses, changelogs)
- `TOOL_CATEGORY_DATABASE` - Database tools (SQL builders, connection parsers)
- `TOOL_CATEGORY_INFRASTRUCTURE` - Infrastructure tools (Docker, Kubernetes, subnet)
- `TOOL_CATEGORY_API` - API tools (OpenAPI validator, REST client generator)

### `@workspace/constants/http`

HTTP-related constants including status codes and common headers.

```typescript
import { HTTP_STATUS_CODES, COMMON_HEADERS } from "@workspace/constants/http";
```

### `@workspace/constants/timezone`

Common timezones with UTC offsets and abbreviations.

```typescript
import { COMMON_TIMEZONES } from "@workspace/constants/timezone";
```

### `@workspace/constants/aspect-ratio`

Common aspect ratio presets (1:1, 16:9, 4:3, etc.).

```typescript
import { ASPECT_RATIO_PRESETS } from "@workspace/constants/aspect-ratio";
```

### `@workspace/constants/git`

Conventional commit types and templates.

```typescript
import { COMMIT_TYPES } from "@workspace/constants/git";
```

### `@workspace/constants/env`

Environment variable templates for various frameworks and services.

```typescript
import { ENV_TEMPLATES } from "@workspace/constants/env";
```

**Available templates:**

- Node.js
- Next.js
- React
- Express.js
- PostgreSQL
- MongoDB
- Redis
- AWS

### `@workspace/constants/license`

License information for common open-source licenses.

```typescript
import { LICENSE_INFO } from "@workspace/constants/license";
```

**Supported licenses:**

- MIT
- Apache-2.0
- GPL-3.0
- BSD-3-Clause
- BSD-2-Clause
- ISC
- Unlicense
- MPL-2.0

### `@workspace/constants/cron`

Cron field definitions and common cron expressions.

```typescript
import {
  CRON_FIELDS,
  COMMON_CRON_EXPRESSIONS,
} from "@workspace/constants/cron";
```

### `@workspace/constants/font`

Predefined font pairings for web design.

```typescript
import { FONT_PAIRINGS } from "@workspace/constants/font";
```

### `@workspace/constants/aria`

Common ARIA roles with their supported attributes.

```typescript
import { ARIA_ROLES } from "@workspace/constants/aria";
```

### `@workspace/constants/package`

Package.json templates for various project types.

```typescript
import { PACKAGE_TEMPLATES } from "@workspace/constants/package";
```

**Available templates:**

- Next.js
- React
- Node.js
- Express.js
- TypeScript
- Library

### `@workspace/constants/jsonpath`

Common JSONPath expressions for testing and reference.

```typescript
import { COMMON_JSONPATH_EXPRESSIONS } from "@workspace/constants/jsonpath";
```

### `@workspace/constants/subnet`

Common subnet masks by CIDR notation.

```typescript
import { COMMON_SUBNET_MASKS } from "@workspace/constants/subnet";
```

### `@workspace/constants/code`

Supported programming languages for code snippets.

```typescript
import { SUPPORTED_LANGUAGES } from "@workspace/constants/code";
```

## Type Safety

All constants are fully typed. Import types from `@workspace/types`:

```typescript
import type { HttpStatus } from "@workspace/types/http";
import { HTTP_STATUS_CODES } from "@workspace/constants/http";

const status: HttpStatus = HTTP_STATUS_CODES[200];
```

## Contributing

When adding new constants:

1. Create a new file in `src/` if needed
2. Export from `src/index.ts`
3. Add to `package.json` exports
4. Create corresponding types in `@workspace/types`
5. Update this README

## License

MIT
