/**
 * Subnet calculation utilities
 */

export interface SubnetInfo {
  networkAddress: string;
  subnetMask: string;
  subnetMaskBits: number;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  broadcastAddress: string;
  totalHosts: number;
  usableHosts: number;
  networkClass: string;
  cidr: string;
}

/**
 * Converts IP address to number
 */
function ipToNumber(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;

  const nums = parts.map((p) => parseInt(p, 10));
  if (nums.some((n) => isNaN(n) || n < 0 || n > 255)) return null;
  if (
    nums.length !== 4 ||
    nums[0] === undefined ||
    nums[1] === undefined ||
    nums[2] === undefined ||
    nums[3] === undefined
  )
    return null;

  return nums[0] * 256 ** 3 + nums[1] * 256 ** 2 + nums[2] * 256 + nums[3];
}

/**
 * Converts number to IP address
 */
function numberToIP(num: number): string {
  const part1 = Math.floor(num / 256 ** 3) % 256;
  const part2 = Math.floor(num / 256 ** 2) % 256;
  const part3 = Math.floor(num / 256) % 256;
  const part4 = num % 256;
  return `${part1}.${part2}.${part3}.${part4}`;
}

/**
 * Calculates subnet information
 * @param ipAddress - IP address
 * @param subnetMask - Subnet mask or CIDR notation (e.g., "255.255.255.0" or "/24")
 * @returns Subnet information
 */
export function calculateSubnet(
  ipAddress: string,
  subnetMask: string | number,
): SubnetInfo {
  const ipNum = ipToNumber(ipAddress);
  if (ipNum === null) {
    throw new Error("Invalid IP address");
  }

  let subnetMaskNum: number;
  let subnetMaskBits: number;

  // Handle CIDR notation
  if (
    typeof subnetMask === "number" ||
    (typeof subnetMask === "string" && subnetMask.startsWith("/"))
  ) {
    subnetMaskBits =
      typeof subnetMask === "number"
        ? subnetMask
        : parseInt(subnetMask.substring(1), 10);

    if (isNaN(subnetMaskBits) || subnetMaskBits < 0 || subnetMaskBits > 32) {
      throw new Error("Invalid CIDR notation");
    }

    subnetMaskNum = (0xffffffff << (32 - subnetMaskBits)) >>> 0;
  } else {
    // Handle subnet mask IP
    const maskNum = ipToNumber(subnetMask);
    if (maskNum === null) {
      throw new Error("Invalid subnet mask");
    }
    subnetMaskNum = maskNum;

    // Calculate bits from mask
    subnetMaskBits = (subnetMaskNum.toString(2).match(/1/g) || []).length;
  }

  // Calculate network address
  const networkNum = (ipNum & subnetMaskNum) >>> 0;
  const networkAddress = numberToIP(networkNum);

  // Calculate broadcast address
  const wildcardMask = ~subnetMaskNum >>> 0;
  const broadcastNum = (networkNum | wildcardMask) >>> 0;
  const broadcastAddress = numberToIP(broadcastNum);

  // Calculate host range
  const firstHostNum = networkNum + 1;
  const lastHostNum = broadcastNum - 1;
  const firstHost = numberToIP(firstHostNum);
  const lastHost = numberToIP(lastHostNum);

  // Calculate host counts
  const totalHosts = Math.pow(2, 32 - subnetMaskBits);
  const usableHosts = Math.max(0, totalHosts - 2); // Subtract network and broadcast

  // Determine network class
  const firstOctetStr = ipAddress.split(".")[0];
  if (!firstOctetStr) {
    throw new Error("Invalid IP address format");
  }
  const firstOctet = parseInt(firstOctetStr, 10);
  let networkClass = "Unknown";
  if (firstOctet >= 1 && firstOctet <= 126) {
    networkClass = "A";
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    networkClass = "B";
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    networkClass = "C";
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    networkClass = "D (Multicast)";
  } else if (firstOctet >= 240 && firstOctet <= 255) {
    networkClass = "E (Reserved)";
  }

  // Convert subnet mask to IP
  const subnetMaskIP = numberToIP(subnetMaskNum);
  const wildcardMaskIP = numberToIP(wildcardMask);

  return {
    networkAddress,
    subnetMask: subnetMaskIP,
    subnetMaskBits,
    wildcardMask: wildcardMaskIP,
    firstHost,
    lastHost,
    broadcastAddress,
    totalHosts,
    usableHosts,
    networkClass,
    cidr: `${networkAddress}/${subnetMaskBits}`,
  };
}

/**
 * Splits a network into smaller subnets
 * @param networkAddress - Network address
 * @param originalCIDR - Original CIDR notation (e.g., "/24")
 * @param newCIDR - New CIDR notation for subnets (e.g., "/26")
 * @returns Array of subnet information
 */
export function splitSubnet(
  networkAddress: string,
  originalCIDR: number,
  newCIDR: number,
): SubnetInfo[] {
  if (newCIDR <= originalCIDR) {
    throw new Error("New CIDR must be greater than original CIDR");
  }

  const originalSubnet = calculateSubnet(networkAddress, originalCIDR);
  const subnetCount = Math.pow(2, newCIDR - originalCIDR);
  const subnetSize = Math.pow(2, 32 - newCIDR);

  const subnets: SubnetInfo[] = [];
  const networkNum = ipToNumber(networkAddress);

  if (networkNum === null) {
    throw new Error("Invalid network address");
  }

  for (let i = 0; i < subnetCount; i++) {
    const subnetNetworkNum = networkNum + i * subnetSize;
    const subnetNetwork = numberToIP(subnetNetworkNum);
    subnets.push(calculateSubnet(subnetNetwork, newCIDR));
  }

  return subnets;
}

/**
 * Gets common subnet masks by CIDR
 */
import { COMMON_SUBNET_MASKS } from "@workspace/constants/subnet";

// Re-export for backward compatibility
export { COMMON_SUBNET_MASKS } from "@workspace/constants/subnet";

/**
 * Gets subnet mask by CIDR bits
 * @param bits - CIDR bits (0-32)
 * @returns Subnet mask IP address
 */
export function getSubnetMaskByCIDR(bits: number): string {
  if (bits < 0 || bits > 32) {
    throw new Error("CIDR bits must be between 0 and 32");
  }

  if (COMMON_SUBNET_MASKS[bits]) {
    return COMMON_SUBNET_MASKS[bits];
  }

  // Calculate if not in common list
  const maskNum = (0xffffffff << (32 - bits)) >>> 0;
  return numberToIP(maskNum);
}

/**
 * Checks if an IP is in a subnet
 * @param ip - IP address to check
 * @param networkAddress - Network address
 * @param cidr - CIDR notation
 * @returns True if IP is in subnet
 */
export function isIPInSubnet(
  ip: string,
  networkAddress: string,
  cidr: number,
): boolean {
  const ipNum = ipToNumber(ip);
  const networkNum = ipToNumber(networkAddress);

  if (ipNum === null || networkNum === null) {
    return false;
  }

  const subnetMaskNum = (0xffffffff << (32 - cidr)) >>> 0;
  const ipNetwork = (ipNum & subnetMaskNum) >>> 0;

  return ipNetwork === networkNum;
}
