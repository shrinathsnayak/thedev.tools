/**
 * Semantic HTML Checker
 * Validates HTML for semantic correctness
 */

export interface SemanticIssue {
  type: "error" | "warning" | "info";
  element: string;
  message: string;
  recommendation?: string;
}

/**
 * Semantic HTML elements (HTML5)
 */
const SEMANTIC_ELEMENTS = new Set([
  "article",
  "aside",
  "details",
  "figcaption",
  "figure",
  "footer",
  "header",
  "main",
  "mark",
  "nav",
  "section",
  "summary",
  "time",
]);

/**
 * Checks HTML for semantic correctness and accessibility issues
 * @param html - HTML string to check
 * @returns Array of semantic issues with type, element, message, and optional recommendation
 */
export function checkSemanticHTML(html: string): SemanticIssue[] {
  const issues: SemanticIssue[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const divs = doc.querySelectorAll("div");
  const spans = doc.querySelectorAll("span");
  const totalElements = doc.querySelectorAll("*").length;

  const divRatio = divs.length / (totalElements || 1);
  const spanRatio = spans.length / (totalElements || 1);

  if (divRatio > 0.3) {
    issues.push({
      type: "warning",
      element: "div",
      message:
        "High usage of <div> elements detected. Consider using semantic elements.",
      recommendation:
        "Replace divs with semantic elements like <section>, <article>, <nav>, <header>, <footer>, etc.",
    });
  }

  if (spanRatio > 0.2) {
    issues.push({
      type: "warning",
      element: "span",
      message:
        "High usage of <span> elements detected. Consider using semantic elements.",
      recommendation:
        "Use semantic elements like <mark>, <time>, or appropriate heading tags instead of spans.",
    });
  }

  if (!doc.querySelector("header")) {
    issues.push({
      type: "info",
      element: "header",
      message: "Consider adding a <header> element for page header content.",
    });
  }

  if (!doc.querySelector("main")) {
    issues.push({
      type: "warning",
      element: "main",
      message:
        "Consider adding a <main> element to identify the main content area.",
      recommendation: "Only one <main> element should exist per page.",
    });
  }

  if (!doc.querySelector("footer")) {
    issues.push({
      type: "info",
      element: "footer",
      message: "Consider adding a <footer> element for footer content.",
    });
  }

  const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  if (headings.length > 0) {
    const firstHeading = headings[0];
    if (firstHeading) {
      const firstLevel = Number.parseInt(firstHeading.tagName[1] || "1", 10);

      if (firstLevel !== 1) {
        issues.push({
          type: "warning",
          element: firstHeading.tagName.toLowerCase(),
          message:
            "First heading should be <h1> for proper document structure.",
        });
      }
    }

    for (let i = 1; i < headings.length; i++) {
      const prevHeading = headings[i - 1];
      const currHeading = headings[i];
      if (!prevHeading || !currHeading) continue;

      const prevLevel = Number.parseInt(prevHeading.tagName[1] || "1", 10);
      const currLevel = Number.parseInt(currHeading.tagName[1] || "1", 10);

      if (currLevel > prevLevel + 1) {
        issues.push({
          type: "warning",
          element: currHeading.tagName.toLowerCase(),
          message: `Heading level skipped from h${prevLevel} to h${currLevel}. Maintain proper hierarchy.`,
        });
      }
    }
  }

  const images = doc.querySelectorAll("img");
  for (const img of Array.from(images)) {
    if (!img.getAttribute("alt")) {
      issues.push({
        type: "error",
        element: "img",
        message: "Image missing alt attribute for accessibility.",
        recommendation:
          "Add descriptive alt text or use empty alt='' for decorative images.",
      });
    }
  }

  const inputs = doc.querySelectorAll("input, textarea, select");
  for (const input of Array.from(inputs)) {
    const id = input.getAttribute("id");
    const label = id ? doc.querySelector(`label[for="${id}"]`) : null;
    const ariaLabel = input.getAttribute("aria-label");
    const ariaLabelledBy = input.getAttribute("aria-labelledby");

    if (!label && !ariaLabel && !ariaLabelledBy) {
      const inputType = input.getAttribute("type") || "input";
      issues.push({
        type: "error",
        element: input.tagName.toLowerCase(),
        message: `${inputType} element missing associated label.`,
        recommendation:
          "Add a <label> element or use aria-label/aria-labelledby attribute.",
      });
    }
  }

  const landmarks = {
    header: doc.querySelectorAll("header").length,
    nav: doc.querySelectorAll("nav").length,
    main: doc.querySelectorAll("main").length,
    aside: doc.querySelectorAll("aside").length,
    footer: doc.querySelectorAll("footer").length,
  };

  if (landmarks.main === 0) {
    issues.push({
      type: "warning",
      element: "main",
      message: "Missing <main> landmark for main content.",
    });
  }

  return issues;
}

/**
 * Generates semantic HTML structure template with proper landmarks
 * @returns Complete HTML template string with semantic elements
 */
export function generateSemanticStructure(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <header>
    <nav>
      <!-- Navigation content -->
    </nav>
  </header>
  
  <main>
    <article>
      <header>
        <h1>Article Title</h1>
      </header>
      <section>
        <!-- Article content -->
      </section>
      <footer>
        <!-- Article footer -->
      </footer>
    </article>
    
    <aside>
      <!-- Sidebar content -->
    </aside>
  </main>
  
  <footer>
    <!-- Page footer -->
  </footer>
</body>
</html>`;
}
