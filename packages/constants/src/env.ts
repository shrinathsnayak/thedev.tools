/**
 * Environment variable-related constants
 */

import type { EnvTemplate } from "@workspace/types/env";

/**
 * Common environment variable templates
 */
export const ENV_TEMPLATES: Record<string, EnvTemplate> = {
  nodejs: {
    name: "Node.js",
    description: "Standard Node.js application template",
    variables: [
      {
        key: "NODE_ENV",
        value: "development",
        comment: "Environment (development, production)",
      },
      { key: "PORT", value: "3000", comment: "Server port" },
      {
        key: "DATABASE_URL",
        value: "",
        comment: "Database connection string",
        required: true,
      },
      {
        key: "JWT_SECRET",
        value: "",
        comment: "JWT signing secret",
        required: true,
      },
      {
        key: "SESSION_SECRET",
        value: "",
        comment: "Session secret",
        required: true,
      },
    ],
  },
  nextjs: {
    name: "Next.js",
    description: "Next.js application template",
    variables: [
      { key: "NODE_ENV", value: "development", comment: "Environment" },
      {
        key: "NEXT_PUBLIC_APP_URL",
        value: "http://localhost:3000",
        comment: "Public app URL",
      },
      {
        key: "DATABASE_URL",
        value: "",
        comment: "Database URL",
        required: true,
      },
      {
        key: "NEXTAUTH_URL",
        value: "http://localhost:3000",
        comment: "NextAuth URL",
      },
      {
        key: "NEXTAUTH_SECRET",
        value: "",
        comment: "NextAuth secret",
        required: true,
      },
    ],
  },
  react: {
    name: "React",
    description: "React application template",
    variables: [
      {
        key: "REACT_APP_API_URL",
        value: "http://localhost:3000/api",
        comment: "API endpoint",
      },
      { key: "REACT_APP_ENV", value: "development", comment: "Environment" },
    ],
  },
  express: {
    name: "Express.js",
    description: "Express.js server template",
    variables: [
      { key: "NODE_ENV", value: "development", comment: "Environment" },
      { key: "PORT", value: "3000", comment: "Server port" },
      {
        key: "DATABASE_URL",
        value: "",
        comment: "Database URL",
        required: true,
      },
      { key: "JWT_SECRET", value: "", comment: "JWT secret", required: true },
      {
        key: "CORS_ORIGIN",
        value: "http://localhost:3000",
        comment: "CORS allowed origin",
      },
    ],
  },
  postgres: {
    name: "PostgreSQL",
    description: "PostgreSQL database configuration",
    variables: [
      { key: "DB_HOST", value: "localhost", comment: "Database host" },
      { key: "DB_PORT", value: "5432", comment: "Database port" },
      {
        key: "DB_NAME",
        value: "mydb",
        comment: "Database name",
        required: true,
      },
      {
        key: "DB_USER",
        value: "postgres",
        comment: "Database user",
        required: true,
      },
      {
        key: "DB_PASSWORD",
        value: "",
        comment: "Database password",
        required: true,
      },
    ],
  },
  mongodb: {
    name: "MongoDB",
    description: "MongoDB database configuration",
    variables: [
      {
        key: "MONGODB_URI",
        value: "mongodb://localhost:27017/mydb",
        comment: "MongoDB connection URI",
        required: true,
      },
      { key: "MONGODB_DB_NAME", value: "mydb", comment: "Database name" },
    ],
  },
  redis: {
    name: "Redis",
    description: "Redis cache configuration",
    variables: [
      { key: "REDIS_HOST", value: "localhost", comment: "Redis host" },
      { key: "REDIS_PORT", value: "6379", comment: "Redis port" },
      {
        key: "REDIS_PASSWORD",
        value: "",
        comment: "Redis password (optional)",
      },
    ],
  },
  aws: {
    name: "AWS",
    description: "AWS services configuration",
    variables: [
      {
        key: "AWS_ACCESS_KEY_ID",
        value: "",
        comment: "AWS access key",
        required: true,
      },
      {
        key: "AWS_SECRET_ACCESS_KEY",
        value: "",
        comment: "AWS secret key",
        required: true,
      },
      { key: "AWS_REGION", value: "us-east-1", comment: "AWS region" },
      {
        key: "AWS_S3_BUCKET",
        value: "",
        comment: "S3 bucket name",
        required: true,
      },
    ],
  },
};

