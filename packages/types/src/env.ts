/**
 * Environment variable-related type definitions
 */

export interface EnvVariable {
  key: string;
  value: string;
  comment?: string;
  required?: boolean;
}

export interface EnvTemplate {
  name: string;
  description: string;
  variables: EnvVariable[];
}

