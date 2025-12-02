/**
 * API route generator utilities
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Framework = "nextjs" | "express" | "fastify" | "koa" | "hapi";
export type ResponseType = "json" | "text" | "html";

export interface ApiRouteOptions {
  method: HttpMethod;
  path: string;
  framework: Framework;
  withAuth?: boolean;
  withValidation?: boolean;
  withErrorHandling?: boolean;
  responseType?: ResponseType;
}

interface NormalizedOptions {
  method: HttpMethod;
  path: string;
  withAuth: boolean;
  withValidation: boolean;
  withErrorHandling: boolean;
  responseType: ResponseType;
}

/**
 * Normalizes API route options with default values
 * @param options - API route options
 * @returns Normalized options with all defaults applied
 */
function _normalizeOptions(options: ApiRouteOptions): NormalizedOptions {
  return {
    method: options.method,
    path: options.path,
    withAuth: options.withAuth ?? false,
    withValidation: options.withValidation ?? false,
    withErrorHandling: options.withErrorHandling ?? true,
    responseType: options.responseType ?? "json",
  };
}

/**
 * Checks if HTTP method requires a request body
 * @param method - HTTP method
 * @returns True if method requires body (POST, PUT, PATCH)
 */
function _requiresBody(method: HttpMethod): boolean {
  return method === "POST" || method === "PUT" || method === "PATCH";
}

/**
 * Gets the response method name based on response type and framework
 * @param responseType - Response type (json, text, html)
 * @param framework - Framework name
 * @returns Response method name string
 */
function _getResponseMethod(
  responseType: ResponseType,
  framework: Framework,
): string {
  if (framework === "nextjs") {
    return responseType === "json" ? "json" : "send";
  }
  if (framework === "express") {
    return responseType === "json" ? "json" : "send";
  }
  return "send";
}

/**
 * Generates validation schema code template
 * @param method - HTTP method
 * @returns Validation schema code string
 */
function _generateValidationSchema(method: HttpMethod): string {
  return `const ${method}Schema = z.object({
  // Add validation schema
});`;
}

/**
 * Generates Next.js API route handler code
 * @param options - Normalized route options
 * @returns Next.js API route code string
 */
function _generateNextJSRoute(options: NormalizedOptions): string {
  const { method, withAuth, withValidation, withErrorHandling, responseType } =
    options;

  const imports: string[] = [
    "import { NextApiRequest, NextApiResponse } from 'next';",
  ];
  if (withAuth) {
    imports.push("import { getServerSession } from 'next-auth';");
  }
  if (withValidation) {
    imports.push("import { z } from 'zod';");
  }

  const validationSchema = withValidation
    ? `\n${_generateValidationSchema(method)}\n`
    : "";

  const authCheck = withAuth
    ? `  const session = await getServerSession(req, res);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

`
    : "";

  const validationCheck = withValidation
    ? `  try {
    ${method}Schema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Validation failed' });
  }

`
    : "";

  const responseMethod = _getResponseMethod(responseType, "nextjs");
  const successResponse = `res.status(200).${responseMethod}({ message: 'Success' })`;

  const handlerBody = `${authCheck}${validationCheck}    // Your logic here
    return ${successResponse};`;

  if (withErrorHandling) {
    return `${imports.join("\n")}${validationSchema}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== '${method}') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
${handlerBody}
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}`;
  }

  return `${imports.join("\n")}${validationSchema}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== '${method}') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
${handlerBody.replace(/^    /, "  ")}
}`;
}

/**
 * Generates Express.js route handler code
 * @param options - Normalized route options
 * @returns Express route code string
 */
function _generateExpressRoute(options: NormalizedOptions): string {
  const {
    method,
    path,
    withAuth,
    withValidation,
    withErrorHandling,
    responseType,
  } = options;

  const imports: string[] = ["const express = require('express');"];
  if (withAuth) {
    imports.push("const { authenticateToken } = require('./middleware/auth');");
  }
  if (withValidation) {
    imports.push(
      "const { validateRequest } = require('./middleware/validation');",
    );
  }

  const middleware: string[] = [];
  if (withAuth) {
    middleware.push("authenticateToken");
  }
  if (withValidation) {
    middleware.push("validateRequest");
  }

  const middlewareStr =
    middleware.length > 0 ? `, ${middleware.join(", ")}` : "";
  const responseMethod = _getResponseMethod(responseType, "express");
  const successResponse = `res.status(200).${responseMethod}({ message: 'Success' })`;

  const routeHandler = withErrorHandling
    ? `router.${method.toLowerCase()}('${path}'${middlewareStr}, async (req, res) => {
  try {
    // Your logic here
    ${successResponse};
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});`
    : `router.${method.toLowerCase()}('${path}'${middlewareStr}, (req, res) => {
  // Your logic here
  ${successResponse};
});`;

  return `${imports.join("\n")}

const router = express.Router();

${routeHandler}

module.exports = router;`;
}

/**
 * Generates Fastify route handler code
 * @param options - Normalized route options
 * @returns Fastify route code string
 */
function _generateFastifyRoute(options: NormalizedOptions): string {
  const {
    method,
    path,
    withAuth,
    withValidation,
    withErrorHandling,
    responseType,
  } = options;

  const imports: string[] = [];
  if (withAuth) {
    imports.push("const { authenticateToken } = require('./middleware/auth');");
  }

  const schemaParts: string[] = [];
  if (withValidation && _requiresBody(method)) {
    schemaParts.push("    body: { /* validation schema */ },");
  }
  if (withValidation) {
    schemaParts.push(`    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }`);
  }

  const schema =
    schemaParts.length > 0
      ? `  schema: {
${schemaParts.join("\n")}
  },`
      : "";

  const preHandler = withAuth ? "\n  preHandler: [authenticateToken]," : "";

  const handlerBody = withErrorHandling
    ? `  handler: async (request, reply) => {
    try {
      // Your logic here
      return reply.send({ message: 'Success' });
    } catch (error) {
      console.error('Error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }`
    : `  handler: async (request, reply) => {
    // Your logic here
    return reply.send({ message: 'Success' });
  }`;

  const importsStr = imports.length > 0 ? `${imports.join("\n")}\n\n` : "";

  return `${importsStr}fastify.${method.toLowerCase()}({
  url: '${path}',
${schema}${preHandler}${handlerBody}
});`;
}

/**
 * Generates Koa route handler code
 * @param options - Normalized route options
 * @returns Koa route code string
 */
function _generateKoaRoute(options: NormalizedOptions): string {
  const {
    method,
    path,
    withAuth,
    withValidation,
    withErrorHandling,
    responseType,
  } = options;

  const imports: string[] = ["const Router = require('koa-router');"];
  if (withAuth) {
    imports.push("const { authenticate } = require('./middleware/auth');");
  }
  if (withValidation) {
    imports.push("const { validate } = require('./middleware/validation');");
  }

  const middleware: string[] = [];
  if (withAuth) {
    middleware.push("authenticate");
  }
  if (withValidation) {
    middleware.push("validate");
  }

  const middlewareStr =
    middleware.length > 0 ? `, ${middleware.join(", ")}` : "";

  const handlerBody = withErrorHandling
    ? `router.${method.toLowerCase()}('${path}'${middlewareStr}, async (ctx) => {
  try {
    // Your logic here
    ctx.body = { message: 'Success' };
    ctx.status = 200;
  } catch (error) {
    console.error('Error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});`
    : `router.${method.toLowerCase()}('${path}'${middlewareStr}, async (ctx) => {
  // Your logic here
  ctx.body = { message: 'Success' };
  ctx.status = 200;
});`;

  return `${imports.join("\n")}

const router = new Router();

${handlerBody}

module.exports = router;`;
}

/**
 * Generates Hapi route handler code
 * @param options - Normalized route options
 * @returns Hapi route code string
 */
function _generateHapiRoute(options: NormalizedOptions): string {
  const { method, path, withAuth, withValidation, withErrorHandling } = options;

  const auth = withAuth ? "\n    auth: 'jwt'," : "";

  const validate = withValidation
    ? `
    validate: {
      payload: {
        // Add validation schema
      }
    },`
    : "";

  const handlerBody = withErrorHandling
    ? `  handler: async (request, h) => {
    try {
      // Your logic here
      return h.response({ message: 'Success' }).code(200);
    } catch (error) {
      console.error('Error:', error);
      return h.response({ error: 'Internal server error' }).code(500);
    }
  }`
    : `  handler: async (request, h) => {
    // Your logic here
    return h.response({ message: 'Success' }).code(200);
  }`;

  return `{
  method: '${method}',
  path: '${path}',${auth}${validate}${handlerBody}
}`;
}

const _frameworkGenerators: Record<
  Framework,
  (options: NormalizedOptions) => string
> = {
  nextjs: _generateNextJSRoute,
  express: _generateExpressRoute,
  fastify: _generateFastifyRoute,
  koa: _generateKoaRoute,
  hapi: _generateHapiRoute,
};

/**
 * Generates API route code for specified framework
 * @param options - API route options (method, path, framework, withAuth, etc.)
 * @returns Complete API route code string
 * @throws Error if framework is unsupported
 */
export function generateApiRoute(options: ApiRouteOptions): string {
  const normalizedOptions = _normalizeOptions(options);
  const generator = _frameworkGenerators[options.framework];

  if (!generator) {
    throw new Error(`Unsupported framework: ${options.framework}`);
  }

  return generator(normalizedOptions);
}

/**
 * Gets list of available API route frameworks
 * @returns Array of supported framework names
 */
export function getAvailableFrameworks(): Framework[] {
  return Object.keys(_frameworkGenerators) as Framework[];
}
