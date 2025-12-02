/**
 * Mock data generator using faker.js
 * Provides dynamic and flexible mock data generation capabilities
 */

import { faker } from "@faker-js/faker";

export type FakerLocale =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "ja"
  | "ko"
  | "pt"
  | "ru"
  | "zh_CN"
  | "zh_TW"
  | "ar";

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "email"
  | "url"
  | "phone"
  | "uuid"
  | "firstName"
  | "lastName"
  | "fullName"
  | "jobTitle"
  | "company"
  | "address"
  | "city"
  | "country"
  | "zipCode"
  | "image"
  | "lorem"
  | "word"
  | "sentence"
  | "paragraph"
  | "price"
  | "color"
  | "ip"
  | "macAddress"
  | "userAgent"
  | "creditCard"
  | "password"
  | "avatar"
  | "username"
  | "product"
  | "productName"
  | "productDescription"
  | "category"
  | "website"
  | "domain"
  | "emoji"
  | "hexColor"
  | "rgbColor"
  | "hslColor"
  | "iban"
  | "bic"
  | "bitcoin"
  | "ethereum"
  | "json"
  | "array"
  | "object";

export interface FieldConfig {
  type: FieldType | FieldType[];
  name: string;
  optional?: boolean;
  min?: number;
  max?: number;
  count?: number;
  format?: string;
  options?: string[];
  locale?: FakerLocale;
  schema?: Record<string, FieldConfig | FieldType>;
  [key: string]: unknown;
}

export interface MockDataOptions {
  locale?: FakerLocale;
  seed?: number;
  count?: number;
}

/**
 * Sets the locale for faker (no-op in v8, kept for API compatibility)
 * @param _locale - Locale to set (unused, locale is set during faker initialization in v8)
 */
export function setFakerLocale(_locale: FakerLocale): void {
}

/**
 * Sets seed for deterministic faker data generation
 * @param seed - Seed number for random number generator
 */
export function setFakerSeed(seed: number): void {
  faker.seed(seed);
}

/**
 * Generates a single field value based on field configuration type
 * @param fieldConfig - Field configuration object
 * @param locale - Optional locale for faker
 * @returns Generated field value
 */
function _generateFieldValue(
  fieldConfig: FieldConfig,
  locale?: FakerLocale,
): unknown {
  const type = Array.isArray(fieldConfig.type)
    ? faker.helpers.arrayElement(fieldConfig.type)
    : fieldConfig.type;

  const min = fieldConfig.min ?? 0;
  const max = fieldConfig.max ?? 100;
  const count = fieldConfig.count ?? 1;

  switch (type) {
    case "string":
      return faker.lorem.word();
    case "number":
      return faker.number.int({ min, max });
    case "boolean":
      return faker.datatype.boolean();
    case "date":
      return faker.date.past({ years: max }).toISOString();
    case "email":
      return faker.internet.email();
    case "url":
      return faker.internet.url();
    case "phone":
      return faker.phone.number();
    case "uuid":
      return faker.string.uuid();
    case "firstName":
      return faker.person.firstName();
    case "lastName":
      return faker.person.lastName();
    case "fullName":
      return faker.person.fullName();
    case "jobTitle":
      return faker.person.jobTitle();
    case "company":
      return faker.company.name();
    case "address":
      return faker.location.streetAddress();
    case "city":
      return faker.location.city();
    case "country":
      return faker.location.country();
    case "zipCode":
      return faker.location.zipCode();
    case "image":
      return faker.image.url();
    case "lorem":
      return faker.lorem.text();
    case "word":
      return faker.lorem.word();
    case "sentence":
      return faker.lorem.sentence({ min: count, max: count + 3 });
    case "paragraph":
      return faker.lorem.paragraph({ min: count, max: count + 1 });
    case "price":
      return faker.commerce.price({ min, max });
    case "color":
      return faker.color.human();
    case "ip":
      return faker.internet.ip();
    case "macAddress":
      return faker.internet.mac();
    case "userAgent":
      return faker.internet.userAgent();
    case "creditCard":
      return faker.finance.creditCardNumber();
    case "password":
      return faker.internet.password({ length: min || 8, memorable: false });
    case "avatar":
      return faker.image.avatar();
    case "username":
      return faker.internet.username();
    case "product":
      return faker.commerce.product();
    case "productName":
      return faker.commerce.productName();
    case "productDescription":
      return faker.commerce.productDescription();
    case "category":
      return faker.commerce.department();
    case "website":
      return faker.internet.domainName();
    case "domain":
      return faker.internet.domainName();
    case "emoji":
      return faker.internet.emoji();
    case "hexColor":
      return faker.color.rgb();
    case "rgbColor":
      return faker.color.rgb();
    case "hslColor":
      return faker.color.hsl();
    case "iban":
      return faker.finance.iban();
    case "bic":
      return faker.finance.bic();
    case "bitcoin":
      return faker.finance.bitcoinAddress();
    case "ethereum":
      return faker.finance.ethereumAddress();
    case "json":
      return JSON.stringify({ data: faker.lorem.word() });
    case "array":
      if (fieldConfig.schema) {
        const schema = fieldConfig.schema;
        return Array.from({ length: count }, () => {
          const obj: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(schema)) {
            const fieldSchema: FieldConfig =
              typeof value === "string"
                ? { type: value as FieldType, name: key }
                : { ...value, name: key };
            obj[key] = _generateFieldValue(fieldSchema, locale);
          }
          return obj;
        });
      }
      return Array.from({ length: count }, () => faker.lorem.word());
    default:
      return null;
  }
}

/**
 * Generates a single mock object based on schema configuration
 * @param schema - Schema object mapping field names to field configs or types
 * @param options - Generation options (locale, seed)
 * @returns Generated mock object
 */
export function generateMockObject(
  schema: Record<string, FieldConfig | FieldType>,
  options: MockDataOptions = {},
): Record<string, unknown> {
  if (options.locale) {
    setFakerLocale(options.locale);
  }

  if (options.seed !== undefined) {
    setFakerSeed(options.seed);
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema)) {
    const fieldConfig: FieldConfig =
      typeof value === "string"
        ? { type: value as FieldType, name: key }
        : { ...value, name: key };

    if (fieldConfig.optional && Math.random() > 0.5) {
      continue;
    }

    if (fieldConfig.schema) {
      result[key] = generateMockObject(fieldConfig.schema, options);
    } else {
      result[key] = _generateFieldValue(fieldConfig, options.locale);
    }
  }

  return result;
}

/**
 * Generates an array of mock objects based on schema
 * @param schema - Schema object mapping field names to field configs or types
 * @param count - Number of objects to generate
 * @param options - Generation options (locale, seed)
 * @returns Array of generated mock objects
 */
export function generateMockArray(
  schema: Record<string, FieldConfig | FieldType>,
  count: number,
  options: MockDataOptions = {},
): Array<Record<string, unknown>> {
  return Array.from({ length: count }, () =>
    generateMockObject(schema, options),
  );
}

/**
 * Generates a mock user object with common user fields
 * @param options - Generation options (locale, seed)
 * @returns Generated user object
 */
export function generateUser(
  options: MockDataOptions = {},
): Record<string, unknown> {
  return generateMockObject(
    {
      id: "uuid",
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      username: "username",
      avatar: "avatar",
      address: {
        type: "object",
        name: "address",
        schema: {
          street: "address",
          city: "city",
          zipCode: "zipCode",
          country: "country",
        },
      },
      jobTitle: "jobTitle",
      company: "company",
      website: "website",
      bio: { type: "paragraph", name: "bio", count: 3 },
    },
    options,
  );
}

/**
 * Generates an array of mock user objects
 * @param count - Number of users to generate
 * @param options - Generation options (locale, seed)
 * @returns Array of generated user objects
 */
export function generateUsers(
  count: number,
  options: MockDataOptions = {},
): Array<Record<string, unknown>> {
  return generateMockArray(
    {
      id: "uuid",
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      username: "username",
      avatar: "avatar",
      address: {
        type: "object",
        name: "address",
        schema: {
          street: "address",
          city: "city",
          zipCode: "zipCode",
          country: "country",
        },
      },
      jobTitle: "jobTitle",
      company: "company",
      website: "website",
      bio: { type: "paragraph", name: "bio", count: 3 },
    },
    count,
    options,
  );
}

/**
 * Generates a mock product object with common product fields
 * @param options - Generation options (locale, seed)
 * @returns Generated product object
 */
export function generateProduct(
  options: MockDataOptions = {},
): Record<string, unknown> {
  return generateMockObject(
    {
      id: "uuid",
      name: "productName",
      description: "productDescription",
      price: { type: "price", name: "price", min: 10, max: 1000 },
      category: "category",
      image: "image",
      inStock: "boolean",
      rating: { type: "number", name: "rating", min: 1, max: 5 },
      reviews: { type: "number", name: "reviews", min: 0, max: 1000 },
      sku: { type: "string", name: "sku" },
      brand: "company",
      color: "color",
      tags: { type: "array", name: "tags", count: 5 },
    },
    options,
  );
}

/**
 * Generates an array of mock product objects
 * @param count - Number of products to generate
 * @param options - Generation options (locale, seed)
 * @returns Array of generated product objects
 */
export function generateProducts(
  count: number,
  options: MockDataOptions = {},
): Array<Record<string, unknown>> {
  return generateMockArray(
    {
      id: "uuid",
      name: "productName",
      description: "productDescription",
      price: { type: "price", name: "price", min: 10, max: 1000 },
      category: "category",
      image: "image",
      inStock: "boolean",
      rating: { type: "number", name: "rating", min: 1, max: 5 },
      reviews: { type: "number", name: "reviews", min: 0, max: 1000 },
      sku: { type: "string", name: "sku" },
      brand: "company",
      color: "color",
      tags: { type: "array", name: "tags", count: 5 },
    },
    count,
    options,
  );
}

/**
 * Generates a mock blog post object with common blog post fields
 * @param options - Generation options (locale, seed)
 * @returns Generated blog post object
 */
export function generateBlogPost(
  options: MockDataOptions = {},
): Record<string, unknown> {
  return generateMockObject(
    {
      id: "uuid",
      title: { type: "sentence", name: "title", count: 1 },
      slug: { type: "word", name: "slug" },
      content: { type: "paragraph", name: "content", count: 5 },
      excerpt: { type: "sentence", name: "excerpt", count: 3 },
      author: {
        type: "object",
        name: "author",
        schema: {
          name: "fullName",
          email: "email",
          avatar: "avatar",
        },
      },
      publishedAt: "date",
      category: "category",
      tags: { type: "array", name: "tags", count: 5 },
      views: { type: "number", name: "views", min: 0, max: 10000 },
      likes: { type: "number", name: "likes", min: 0, max: 500 },
      featured: "boolean",
      image: "image",
    },
    options,
  );
}

/**
 * Generates an array of mock blog post objects
 * @param count - Number of blog posts to generate
 * @param options - Generation options (locale, seed)
 * @returns Array of generated blog post objects
 */
export function generateBlogPosts(
  count: number,
  options: MockDataOptions = {},
): Array<Record<string, unknown>> {
  return generateMockArray(
    {
      id: "uuid",
      title: { type: "sentence", name: "title", count: 1 },
      slug: { type: "word", name: "slug" },
      content: { type: "paragraph", name: "content", count: 5 },
      excerpt: { type: "sentence", name: "excerpt", count: 3 },
      author: {
        type: "object",
        name: "author",
        schema: {
          name: "fullName",
          email: "email",
          avatar: "avatar",
        },
      },
      publishedAt: "date",
      category: "category",
      tags: { type: "array", name: "tags", count: 5 },
      views: { type: "number", name: "views", min: 0, max: 10000 },
      likes: { type: "number", name: "likes", min: 0, max: 500 },
      featured: "boolean",
      image: "image",
    },
    count,
    options,
  );
}

/**
 * Generates a mock address object with location fields
 * @param options - Generation options (locale, seed)
 * @returns Generated address object
 */
export function generateAddress(
  options: MockDataOptions = {},
): Record<string, unknown> {
  return generateMockObject(
    {
      street: "address",
      city: "city",
      state: "city",
      zipCode: "zipCode",
      country: "country",
      coordinates: {
        type: "object",
        name: "coordinates",
        schema: {
          lat: { type: "number", name: "lat", min: -90, max: 90 },
          lng: { type: "number", name: "lng", min: -180, max: 180 },
        },
      },
    },
    options,
  );
}

/**
 * Generates a mock financial transaction object
 * @param options - Generation options (locale, seed)
 * @returns Generated transaction object
 */
export function generateTransaction(
  options: MockDataOptions = {},
): Record<string, unknown> {
  return generateMockObject(
    {
      id: "uuid",
      amount: { type: "price", name: "amount", min: 1, max: 10000 },
      currency: {
        type: "string",
        name: "currency",
        options: ["USD", "EUR", "GBP", "JPY"],
      },
      type: {
        type: "string",
        name: "type",
        options: ["debit", "credit", "transfer"],
      },
      description: "sentence",
      date: "date",
      merchant: "company",
      accountNumber: {
        type: "string",
        name: "accountNumber",
        min: 10,
        max: 16,
      },
      status: {
        type: "string",
        name: "status",
        options: ["pending", "completed", "failed", "cancelled"],
      },
    },
    options,
  );
}

/**
 * Generates a mock order object with order details
 * @param options - Generation options (locale, seed)
 * @returns Generated order object
 */
export function generateOrder(
  options: MockDataOptions = {},
): Record<string, unknown> {
  return generateMockObject(
    {
      id: "uuid",
      orderNumber: { type: "string", name: "orderNumber", min: 6, max: 10 },
      customer: {
        type: "object",
        name: "customer",
        schema: {
          name: "fullName",
          email: "email",
          phone: "phone",
        },
      },
      items: {
        type: "array",
        name: "items",
        count: 3,
        schema: {
          productName: "productName",
          quantity: { type: "number", name: "quantity", min: 1, max: 10 },
          price: { type: "price", name: "price", min: 10, max: 500 },
        },
      },
      total: { type: "price", name: "total", min: 50, max: 2000 },
      status: {
        type: "string",
        name: "status",
        options: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
      shippingAddress: {
        type: "object",
        name: "shippingAddress",
        schema: {
          street: "address",
          city: "city",
          zipCode: "zipCode",
          country: "country",
        },
      },
      orderDate: "date",
      deliveryDate: "date",
    },
    options,
  );
}

/**
 * Generates JSON string from schema (single object or array)
 * @param schema - Schema object mapping field names to field configs or types
 * @param options - Generation options (locale, seed, count for array)
 * @returns JSON string with generated data
 */
export function generateMockJson(
  schema: Record<string, FieldConfig | FieldType>,
  options: MockDataOptions = {},
): string {
  const data = options.count
    ? generateMockArray(schema, options.count, options)
    : generateMockObject(schema, options);
  return JSON.stringify(data, null, 2);
}

/**
 * Generates CSV string from schema
 * @param schema - Schema object mapping field names to field configs or types
 * @param count - Number of rows to generate
 * @param options - Generation options (locale, seed)
 * @returns CSV string with headers and data rows
 */
export function generateMockCsv(
  schema: Record<string, FieldConfig | FieldType>,
  count: number,
  options: MockDataOptions = {},
): string {
  const data = generateMockArray(schema, count, options);
  const headers = Object.keys(schema);
  const rows = [
    headers.join(","),
    ...data.map((item) =>
      headers
        .map((header) => {
          const value = item[header];
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
          }
          return String(value).replace(/,/g, ";");
        })
        .join(","),
    ),
  ];
  return rows.join("\n");
}

/**
 * Generates SQL INSERT statements from schema
 * @param schema - Schema object mapping field names to field configs or types
 * @param tableName - Database table name
 * @param count - Number of INSERT statements to generate
 * @param options - Generation options (locale, seed)
 * @returns SQL INSERT statements string
 */
export function generateMockSql(
  schema: Record<string, FieldConfig | FieldType>,
  tableName: string,
  count: number,
  options: MockDataOptions = {},
): string {
  const data = generateMockArray(schema, count, options);
  const columns = Object.keys(schema);

  return data
    .map((row) => {
      const values = columns
        .map((col) => {
          const value = row[col];
          if (value === null || value === undefined) {
            return "NULL";
          }
          if (typeof value === "string") {
            return `'${value.replace(/'/g, "''")}'`;
          }
          if (typeof value === "object") {
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          return String(value);
        })
        .join(", ");
      return `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values});`;
    })
    .join("\n");
}
