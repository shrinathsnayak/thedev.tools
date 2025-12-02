# @workspace/types

Shared TypeScript type definitions for the thedev.tools monorepo. Provides type safety across all packages and applications.

## Installation

This package is part of the monorepo workspace and is automatically available to other packages via workspace protocol.

```bash
# If using outside the monorepo
pnpm add @workspace/types
```

## Usage

```typescript
import type { Tool, ToolCategory } from "@workspace/types/tools";
import type { HttpStatus, HttpMethod, HttpHeader } from "@workspace/types/http";
import type { TimezoneInfo } from "@workspace/types/timezone";
import type {
  AspectRatio,
  AspectRatioPreset,
} from "@workspace/types/aspect-ratio";
import type {
  CommitType,
  CommitMessage,
  CommitTemplate,
} from "@workspace/types/git";
import type { EnvVariable, EnvTemplate } from "@workspace/types/env";
import type {
  LicenseType,
  LicenseInfo,
  LicenseOptions,
} from "@workspace/types/license";
import type {
  CronField,
  CronExpression,
  CronInfo,
} from "@workspace/types/cron";
import type { FontPair } from "@workspace/types/font";
import type { AriaRole } from "@workspace/types/aria";
import type {
  PackageJsonConfig,
  PackageJsonTemplate,
} from "@workspace/types/package";
import type { JSONPathExpression } from "@workspace/types/jsonpath";
```

## Exports

### `@workspace/types/tools`

Core tool types for the application.

```typescript
import type { Tool, ToolCategory } from "@workspace/types/tools";

const tool: Tool = {
  slug: "json-formatter",
  name: "JSON Formatter",
  description: "Format and validate JSON",
  category: "formatters",
  path: "/tools/formatters/json",
  tags: ["json", "format"],
  action: "format",
  packages: [],
};
```

### `@workspace/types/http`

HTTP-related types including status codes, methods, and headers.

```typescript
import type {
  HttpStatus,
  HttpMethod,
  HttpHeader,
  HttpRequest,
  CommonHeader,
} from "@workspace/types/http";
```

### `@workspace/types/timezone`

Timezone information types.

```typescript
import type { TimezoneInfo } from "@workspace/types/timezone";

const timezone: TimezoneInfo = {
  name: "Eastern Time (US & Canada)",
  offset: -300,
  abbreviation: "EST/EDT",
  utc: ["UTC-5", "UTC-4"],
};
```

### `@workspace/types/aspect-ratio`

Aspect ratio calculation types.

```typescript
import type {
  AspectRatio,
  AspectRatioPreset,
} from "@workspace/types/aspect-ratio";
```

### `@workspace/types/git`

Git commit message types following Conventional Commits specification.

```typescript
import type {
  CommitType,
  CommitMessage,
  CommitTemplate,
} from "@workspace/types/git";

const commit: CommitMessage = {
  type: "feat",
  subject: "add new feature",
  body: "Detailed description",
  breaking: false,
};
```

### `@workspace/types/env`

Environment variable types.

```typescript
import type { EnvVariable, EnvTemplate } from "@workspace/types/env";
```

### `@workspace/types/license`

License-related types.

```typescript
import type {
  LicenseType,
  LicenseInfo,
  LicenseOptions,
} from "@workspace/types/license";
```

### `@workspace/types/cron`

Cron expression types.

```typescript
import type {
  CronField,
  CronExpression,
  CronInfo,
} from "@workspace/types/cron";
```

### `@workspace/types/font`

Font pairing types.

```typescript
import type { FontPair } from "@workspace/types/font";
```

### `@workspace/types/aria`

ARIA accessibility types.

```typescript
import type { AriaRole } from "@workspace/types/aria";
```

### `@workspace/types/package`

Package.json types.

```typescript
import type {
  PackageJsonConfig,
  PackageJsonTemplate,
} from "@workspace/types/package";
```

### `@workspace/types/jsonpath`

JSONPath expression types.

```typescript
import type { JSONPathExpression } from "@workspace/types/jsonpath";
```

## Type Safety

All types are exported and can be used with constants from `@workspace/constants`:

```typescript
import type { HttpStatus } from "@workspace/types/http";
import { HTTP_STATUS_CODES } from "@workspace/constants/http";

function getStatus(code: number): HttpStatus | null {
  return HTTP_STATUS_CODES[code] || null;
}
```

## Contributing

When adding new types:

1. Create a new file in `src/` if needed
2. Export from `src/index.ts`
3. Add to `package.json` exports
4. Create corresponding constants in `@workspace/constants`
5. Update this README

## License

MIT
