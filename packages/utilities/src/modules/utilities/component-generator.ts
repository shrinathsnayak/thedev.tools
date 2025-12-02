/**
 * Component generator utilities
 */

export type Framework = "react" | "vue" | "svelte" | "angular" | "html";

export interface ComponentOptions {
  name: string;
  framework: Framework;
  props?: string[];
  withState?: boolean;
  withStyles?: boolean;
  withTypes?: boolean;
  exportDefault?: boolean;
}

/**
 * Generates React component code
 * @param options - Component generation options
 * @returns React component code string
 */
function _generateReactComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    withState = false,
    withStyles = false,
    withTypes = false,
    exportDefault = true,
  } = options;

  const imports: string[] = [];
  if (withState) {
    imports.push("import { useState } from 'react';");
  }
  if (withStyles) {
    imports.push(`import styles from './${name}.module.css';`);
  }

  const propsType = withTypes
    ? props.length > 0
      ? `interface ${name}Props {\n${props.map((p) => `  ${p}: string;`).join("\n")}\n}`
      : `interface ${name}Props {}`
    : "";

  const propsDeclaration =
    props.length > 0
      ? withTypes
        ? `{ ${props.join(", ")} }: ${name}Props`
        : `{ ${props.join(", ")} }`
      : "{}";

  const stateCode = withState
    ? `  const [state, setState] = useState<string>('');\n\n`
    : "";

  const className = withStyles ? ` className={styles.container}` : "";

  const component = `${propsType ? propsType + "\n\n" : ""}${exportDefault ? "export default " : "export "}function ${name}(${propsDeclaration}) {
${stateCode}  return (
    <div${className}>
      <h1>${name}</h1>
    </div>
  );
}`;

  return imports.join("\n") + (imports.length > 0 ? "\n\n" : "") + component;
}

/**
 * Generates Vue component code
 * @param options - Component generation options
 * @returns Vue component code string
 */
function _generateVueComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    withState = false,
    withStyles = false,
    withTypes = false,
  } = options;

  const scriptSetup = withTypes
    ? `<script setup lang="ts">
${props.length > 0 ? `interface Props {\n${props.map((p) => `  ${p}: string;\n`).join("")}}\n\nconst props = defineProps<Props>();` : ""}
${withState ? "const state = ref<string>('');" : ""}
</script>`
    : `<script setup>
${props.length > 0 ? `const props = defineProps([${props.map((p) => `'${p}'`).join(", ")}]);` : ""}
${withState ? "const state = ref('');" : ""}
</script>`;

  const template = `<template>
  <div${withStyles ? ' class="container"' : ""}>
    <h1>${name}</h1>
  </div>
</template>`;

  const styles = withStyles
    ? `<style scoped>
.container {
  /* Styles */
}
</style>`
    : "";

  return `${scriptSetup}\n\n${template}${styles ? "\n\n" + styles : ""}`;
}

/**
 * Generates HTML component code
 * @param options - Component generation options
 * @returns HTML component code string
 */
function _generateHTMLComponent(options: ComponentOptions): string {
  const { name, withStyles = false } = options;

  const styles = withStyles
    ? `<style>
.${name.toLowerCase()} {
  /* Styles */
}
</style>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  ${styles ? styles : ""}
</head>
<body>
  <div class="${name.toLowerCase()}">
    <h1>${name}</h1>
  </div>
</body>
</html>`;
}

/**
 * Generates component code for specified framework
 * @param options - Component generation options (name, framework, props, etc.)
 * @returns Component code string for the specified framework
 * @throws Error if framework is unsupported
 */
export function generateComponent(options: ComponentOptions): string {
  switch (options.framework) {
    case "react":
      return _generateReactComponent(options);
    case "vue":
      return _generateVueComponent(options);
    case "html":
      return _generateHTMLComponent(options);
    case "svelte":
      return _generateSvelteComponent(options);
    case "angular":
      return _generateAngularComponent(options);
    default:
      throw new Error(`Unsupported framework: ${options.framework}`);
  }
}

/**
 * Generates Svelte component code
 * @param options - Component generation options
 * @returns Svelte component code string
 */
function _generateSvelteComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    withState = false,
    withStyles = false,
    withTypes = false,
  } = options;

  const script = `<script${withTypes ? ' lang="ts"' : ""}>
${props.length > 0 ? `export let ${props.join(", ")}: string;` : ""}
${withState ? "let state = '';" : ""}
</script>`;

  const template = `<div${withStyles ? ' class="container"' : ""}>
  <h1>${name}</h1>
</div>`;

  const styles = withStyles
    ? `<style>
.container {
  /* Styles */
}
</style>`
    : "";

  return `${script}\n\n${template}${styles ? "\n\n" + styles : ""}`;
}

/**
 * Generates Angular component code
 * @param options - Component generation options
 * @returns Angular component code string with TypeScript, HTML, and CSS
 */
function _generateAngularComponent(options: ComponentOptions): string {
  const { name, props = [], withStyles = false, withTypes = false } = options;

  const component = `import { Component${withTypes ? ", Input" : ""} } from '@angular/core';

@Component({
  selector: 'app-${name.toLowerCase()}',
  templateUrl: './${name.toLowerCase()}.component.html',
  ${withStyles ? `styleUrls: ['./${name.toLowerCase()}.component.css'],` : ""}
})
export class ${name}Component {
${props.map((p) => `  ${withTypes ? "@Input() " : ""}${p}: string = '';`).join("\n")}
}`;

  const template = `<div>
  <h1>${name}</h1>
</div>`;

  const styles = withStyles
    ? `div {
  /* Styles */
}`
    : "";

  return `// ${name.toLowerCase()}.component.ts\n${component}\n\n// ${name.toLowerCase()}.component.html\n${template}${styles ? `\n\n// ${name.toLowerCase()}.component.css\n${styles}` : ""}`;
}

/**
 * Gets list of available component frameworks
 * @returns Array of supported framework names
 */
export function getAvailableFrameworks(): Framework[] {
  return ["react", "vue", "svelte", "angular", "html"];
}
