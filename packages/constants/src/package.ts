/**
 * Package.json-related constants
 */

import type { PackageJsonTemplate } from "@workspace/types/package";

/**
 * Common package.json templates
 */
export const PACKAGE_TEMPLATES: Record<string, PackageJsonTemplate> = {
  nextjs: {
    name: "Next.js",
    description: "Next.js application template",
    config: {
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "^15.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        typescript: "^5.0.0",
        eslint: "^8.0.0",
        "eslint-config-next": "^15.0.0",
      },
    },
  },
  react: {
    name: "React",
    description: "React application template",
    config: {
      scripts: {
        start: "react-scripts start",
        build: "react-scripts build",
        test: "react-scripts test",
        eject: "react-scripts eject",
      },
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "react-scripts": "5.0.1",
      },
    },
  },
  nodejs: {
    name: "Node.js",
    description: "Node.js application template",
    config: {
      type: "module",
      main: "index.js",
      scripts: {
        start: "node index.js",
        dev: "node --watch index.js",
      },
      dependencies: {},
    },
  },
  express: {
    name: "Express.js",
    description: "Express.js server template",
    config: {
      type: "commonjs",
      main: "server.js",
      scripts: {
        start: "node server.js",
        dev: "nodemon server.js",
      },
      dependencies: {
        express: "^4.18.0",
        cors: "^2.8.5",
        dotenv: "^16.0.0",
      },
      devDependencies: {
        nodemon: "^3.0.0",
        "@types/express": "^4.17.0",
        "@types/node": "^20.0.0",
      },
    },
  },
  typescript: {
    name: "TypeScript",
    description: "TypeScript project template",
    config: {
      type: "module",
      main: "dist/index.js",
      scripts: {
        build: "tsc",
        start: "node dist/index.js",
        dev: "tsx watch src/index.ts",
      },
      devDependencies: {
        typescript: "^5.0.0",
        "@types/node": "^20.0.0",
        tsx: "^4.0.0",
      },
    },
  },
  library: {
    name: "Library",
    description: "JavaScript/TypeScript library template",
    config: {
      main: "dist/index.js",
      types: "dist/index.d.ts",
      scripts: {
        build: "tsc",
        prepublishOnly: "npm run build",
      },
      devDependencies: {
        typescript: "^5.0.0",
        "@types/node": "^20.0.0",
      },
    },
  },
};

