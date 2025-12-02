/**
 * License-related constants
 */

import type { LicenseType, LicenseInfo } from "@workspace/types/license";

/**
 * License information
 */
export const LICENSE_INFO: Record<LicenseType, LicenseInfo> = {
  MIT: {
    type: "MIT",
    name: "MIT License",
    spdxId: "MIT",
    description: "A permissive license that is short and to the point",
    url: "https://opensource.org/licenses/MIT",
  },
  "Apache-2.0": {
    type: "Apache-2.0",
    name: "Apache License 2.0",
    spdxId: "Apache-2.0",
    description:
      "A permissive license whose main conditions require preservation of copyright and license notices",
    url: "https://opensource.org/licenses/Apache-2.0",
  },
  "GPL-3.0": {
    type: "GPL-3.0",
    name: "GNU General Public License v3.0",
    spdxId: "GPL-3.0",
    description:
      "A copyleft license that requires anyone who distributes your code or a derivative work to make the source available",
    url: "https://www.gnu.org/licenses/gpl-3.0.html",
  },
  "BSD-3-Clause": {
    type: "BSD-3-Clause",
    name: "BSD 3-Clause License",
    spdxId: "BSD-3-Clause",
    description:
      "A permissive license similar to the BSD 2-Clause License, but with a 3rd clause",
    url: "https://opensource.org/licenses/BSD-3-Clause",
  },
  "BSD-2-Clause": {
    type: "BSD-2-Clause",
    name: "BSD 2-Clause License",
    spdxId: "BSD-2-Clause",
    description:
      "A permissive license that comes in two variants, the BSD 2-Clause and BSD 3-Clause",
    url: "https://opensource.org/licenses/BSD-2-Clause",
  },
  ISC: {
    type: "ISC",
    name: "ISC License",
    spdxId: "ISC",
    description:
      "A permissive license lets people do anything with your code with proper attribution",
    url: "https://opensource.org/licenses/ISC",
  },
  Unlicense: {
    type: "Unlicense",
    name: "The Unlicense",
    spdxId: "Unlicense",
    description: "A license with no conditions whatsoever",
    url: "https://unlicense.org/",
  },
  "MPL-2.0": {
    type: "MPL-2.0",
    name: "Mozilla Public License 2.0",
    spdxId: "MPL-2.0",
    description: "A weak copyleft license that is easy to comply with",
    url: "https://opensource.org/licenses/MPL-2.0",
  },
};

