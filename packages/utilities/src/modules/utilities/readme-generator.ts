/**
 * README generator utilities
 */

export type ProjectType =
  | "nodejs"
  | "nextjs"
  | "react"
  | "vue"
  | "angular"
  | "typescript"
  | "python"
  | "go"
  | "rust"
  | "docker"
  | "library"
  | "api"
  | "cli";

export interface ReadmeOptions {
  projectName: string;
  description?: string;
  author?: string;
  license?: string;
  repository?: string;
  homepage?: string;
  npmPackage?: string;
  installation?: string;
  usage?: string;
  features?: string[];
  technologies?: string[];
  badges?: string[];
  screenshots?: string[];
  contributing?: boolean;
  licenseText?: string;
  type?: ProjectType;
}

/**
 * Generates README.md content from provided options
 * @param options - README generation options (project name, description, installation, etc.)
 * @returns Complete README.md content as a string
 */
export function generateReadme(options: ReadmeOptions): string {
  const {
    projectName,
    description = "",
    author = "",
    license = "MIT",
    repository = "",
    homepage = "",
    npmPackage = "",
    installation = "",
    usage = "",
    features = [],
    technologies = [],
    badges = [],
    screenshots = [],
    contributing = true,
    type = "nodejs",
  } = options;

  const sections: string[] = [];

  sections.push(`# ${projectName}`);
  sections.push("");

  if (badges.length > 0) {
    sections.push(badges.join(" "));
    sections.push("");
  } else {
    const autoBadges: string[] = [];
    if (license) {
      autoBadges.push(
        `![License](https://img.shields.io/badge/license-${license}-blue.svg)`,
      );
    }
    if (npmPackage) {
      autoBadges.push(`![npm](https://img.shields.io/npm/v/${npmPackage}.svg)`);
    }
    if (repository) {
      const repoName = repository.split("/").pop() || "";
      const user = repository.split("/").slice(-2)[0] || "";
      autoBadges.push(
        `![GitHub stars](https://img.shields.io/github/stars/${user}/${repoName}.svg?style=social)`,
      );
    }
    if (autoBadges.length > 0) {
      sections.push(autoBadges.join(" "));
      sections.push("");
    }
  }

  if (description) {
    sections.push(description);
    sections.push("");
  }

  sections.push("## Table of Contents");
  sections.push("");
  sections.push("- [Installation](#installation)");
  if (usage) sections.push("- [Usage](#usage)");
  if (features.length > 0) sections.push("- [Features](#features)");
  if (technologies.length > 0) sections.push("- [Technologies](#technologies)");
  if (contributing) sections.push("- [Contributing](#contributing)");
  sections.push("- [License](#license)");
  sections.push("");

  sections.push("## Installation");
  sections.push("");
  if (installation) {
    sections.push(installation);
  } else {
    if (npmPackage) {
      sections.push(`\`\`\`bash`);
      sections.push(`npm install ${npmPackage}`);
      sections.push(`\`\`\``);
    } else if (repository) {
      sections.push(`\`\`\`bash`);
      sections.push(`git clone ${repository}`);
      sections.push(`cd ${projectName}`);
      if (type === "nodejs" || type === "nextjs" || type === "react") {
        sections.push(`npm install`);
      }
      sections.push(`\`\`\``);
    } else {
      sections.push(`\`\`\`bash`);
      sections.push(`git clone ${repository || "<repository-url>"}`);
      sections.push(`cd ${projectName}`);
      sections.push(`\`\`\``);
    }
  }
  sections.push("");

  if (usage) {
    sections.push("## Usage");
    sections.push("");
    sections.push(usage);
    sections.push("");
  }

  if (features.length > 0) {
    sections.push("## Features");
    sections.push("");
    features.forEach((feature) => {
      sections.push(`- ${feature}`);
    });
    sections.push("");
  }

  if (technologies.length > 0) {
    sections.push("## Technologies");
    sections.push("");
    technologies.forEach((tech) => {
      sections.push(`- ${tech}`);
    });
    sections.push("");
  }

  if (screenshots.length > 0) {
    sections.push("## Screenshots");
    sections.push("");
    screenshots.forEach((screenshot, index) => {
      sections.push(`![Screenshot ${index + 1}](${screenshot})`);
      sections.push("");
    });
  }

  if (contributing) {
    sections.push("## Contributing");
    sections.push("");
    sections.push(
      "Contributions are welcome! Please feel free to submit a Pull Request.",
    );
    sections.push("");
    sections.push("1. Fork the project");
    sections.push(
      "2. Create your feature branch (`git checkout -b feature/AmazingFeature`)",
    );
    sections.push(
      "3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)",
    );
    sections.push(
      "4. Push to the branch (`git push origin feature/AmazingFeature`)",
    );
    sections.push("5. Open a Pull Request");
    sections.push("");
  }

  sections.push("## License");
  sections.push("");
  if (options.licenseText) {
    sections.push(options.licenseText);
  } else {
    sections.push(`This project is licensed under the ${license} License.`);
    if (author) {
      sections.push("");
      sections.push(`Copyright (c) ${new Date().getFullYear()} ${author}`);
    }
  }
  sections.push("");

  if (repository || homepage) {
    sections.push("## Links");
    sections.push("");
    if (repository) {
      sections.push(`- [Repository](${repository})`);
    }
    if (homepage) {
      sections.push(`- [Homepage](${homepage})`);
    }
    sections.push("");
  }

  return sections.join("\n");
}

/**
 * Gets README template options for a specific project type
 * @param type - Project type (nodejs, react, python, etc.)
 * @returns Partial ReadmeOptions with pre-filled values for the project type
 */
export function getReadmeTemplate(type: ProjectType): Partial<ReadmeOptions> {
  const templates: Record<ProjectType, Partial<ReadmeOptions>> = {
    nodejs: {
      type: "nodejs",
      technologies: ["Node.js", "JavaScript"],
      installation: "```bash\nnpm install\n```",
    },
    nextjs: {
      type: "nextjs",
      technologies: ["Next.js", "React", "TypeScript"],
      installation: "```bash\nnpm install\nnpm run dev\n```",
    },
    react: {
      type: "react",
      technologies: ["React", "JavaScript"],
      installation: "```bash\nnpm install\nnpm start\n```",
    },
    vue: {
      type: "vue",
      technologies: ["Vue.js", "JavaScript"],
      installation: "```bash\nnpm install\nnpm run serve\n```",
    },
    angular: {
      type: "angular",
      technologies: ["Angular", "TypeScript"],
      installation: "```bash\nnpm install\nng serve\n```",
    },
    typescript: {
      type: "typescript",
      technologies: ["TypeScript", "Node.js"],
      installation: "```bash\nnpm install\nnpm run build\n```",
    },
    python: {
      type: "python",
      technologies: ["Python"],
      installation: "```bash\npip install -r requirements.txt\n```",
    },
    go: {
      type: "go",
      technologies: ["Go"],
      installation: "```bash\ngo mod download\ngo run main.go\n```",
    },
    rust: {
      type: "rust",
      technologies: ["Rust"],
      installation: "```bash\ncargo build\ncargo run\n```",
    },
    docker: {
      type: "docker",
      technologies: ["Docker"],
      installation: "```bash\ndocker build -t myapp .\ndocker run myapp\n```",
    },
    library: {
      type: "library",
      technologies: ["JavaScript"],
      installation: "```bash\nnpm install\n```",
    },
    api: {
      type: "api",
      technologies: ["REST API", "Node.js"],
      installation: "```bash\nnpm install\nnpm start\n```",
    },
    cli: {
      type: "cli",
      technologies: ["CLI", "Node.js"],
      installation: "```bash\nnpm install -g my-cli\n```",
    },
  };

  return templates[type] || {};
}
