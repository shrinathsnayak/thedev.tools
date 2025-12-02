/**
 * IP address analysis and validation utilities
 */

export interface IPInfo {
  ip: string;
  isValid: boolean;
  version: 4 | 6 | null;
  isPrivate: boolean;
  isPublic: boolean;
  isReserved: boolean;
  isLoopback: boolean;
  isMulticast: boolean;
  isLinkLocal: boolean;
  binary?: string;
  hex?: string;
  integer?: number;
}

/**
 * IPv4 private address ranges (RFC 1918)
 */
const IPV4_PRIVATE_RANGES = [
  { start: "10.0.0.0", end: "10.255.255.255" },
  { start: "172.16.0.0", end: "172.31.255.255" },
  { start: "192.168.0.0", end: "192.168.255.255" },
];

/**
 * IPv4 reserved address ranges
 */
const IPV4_RESERVED_RANGES = [
  { start: "0.0.0.0", end: "0.255.255.255" },
  { start: "127.0.0.0", end: "127.255.255.255" }, // Loopback
  { start: "224.0.0.0", end: "239.255.255.255" }, // Multicast
  { start: "240.0.0.0", end: "255.255.255.255" }, // Reserved
];

/**
 * Validates IPv4 address
 * @param ip - IP address string
 * @returns True if valid IPv4
 */
export function isValidIPv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

/**
 * Validates IPv6 address (simplified)
 * @param ip - IP address string
 * @returns True if valid IPv6 format
 */
export function isValidIPv6(ip: string): boolean {
  if (ip.includes("::")) {
    const parts = ip.split("::");
    if (parts.length > 2) return false;

    const leftParts = parts[0] ? parts[0].split(":").filter(Boolean) : [];
    const rightParts = parts[1] ? parts[1].split(":").filter(Boolean) : [];

    if (leftParts.length + rightParts.length > 8) return false;
  } else {
    const parts = ip.split(":");
    if (parts.length !== 8) return false;
  }

  const hexPattern = /^[0-9a-fA-F]{1,4}$/;
  const allParts = ip.split(":").filter((p) => p !== "");

  return allParts.every((part) => {
    if (part.includes(".")) {
      return isValidIPv4(part);
    }
    return hexPattern.test(part) || part === "";
  });
}

/**
 * Detects IP version
 * @param ip - IP address string
 * @returns 4, 6, or null
 */
export function getIPVersion(ip: string): 4 | 6 | null {
  if (isValidIPv4(ip)) return 4;
  if (isValidIPv6(ip)) return 6;
  return null;
}

/**
 * Checks if IPv4 is private (RFC 1918)
 * @param ip - IPv4 address string
 * @returns True if private
 */
export function isPrivateIPv4(ip: string): boolean {
  if (!isValidIPv4(ip)) return false;

  return IPV4_PRIVATE_RANGES.some((range) => {
    return _isIPInRange(ip, range.start, range.end);
  });
}

/**
 * Checks if an IPv4 address is within a specified range
 * @param ip - IPv4 address to check
 * @param start - Start of IP range
 * @param end - End of IP range
 * @returns True if IP is within the range
 */
function _isIPInRange(ip: string, start: string, end: string): boolean {
  const ipNum = _ipToNumber(ip);
  const startNum = _ipToNumber(start);
  const endNum = _ipToNumber(end);

  if (ipNum === null || startNum === null || endNum === null) return false;

  return ipNum >= startNum && ipNum <= endNum;
}

/**
 * Converts IPv4 address to a numeric value
 * @param ip - IPv4 address string
 * @returns Numeric representation of the IP or null if invalid
 */
function _ipToNumber(ip: string): number | null {
  if (!isValidIPv4(ip)) return null;

  const parts = ip.split(".").map(Number);
  if (
    parts.length !== 4 ||
    parts[0] === undefined ||
    parts[1] === undefined ||
    parts[2] === undefined ||
    parts[3] === undefined
  ) {
    return null;
  }
  return parts[0] * 256 ** 3 + parts[1] * 256 ** 2 + parts[2] * 256 + parts[3];
}

/**
 * Converts numeric value to IPv4 address string
 * @param num - Numeric representation of IPv4 address
 * @returns IPv4 address string
 */
export function numberToIP(num: number): string {
  const part1 = Math.floor(num / 256 ** 3) % 256;
  const part2 = Math.floor(num / 256 ** 2) % 256;
  const part3 = Math.floor(num / 256) % 256;
  const part4 = num % 256;

  return `${part1}.${part2}.${part3}.${part4}`;
}

/**
 * Checks if an IPv4 address is a loopback address (127.x.x.x)
 * @param ip - IPv4 address string to check
 * @returns True if the address is a loopback address
 */
export function isLoopbackIPv4(ip: string): boolean {
  return ip.startsWith("127.");
}

/**
 * Checks if an IPv4 address is a multicast address (224-239.x.x.x)
 * @param ip - IPv4 address string to check
 * @returns True if the address is a multicast address
 */
export function isMulticastIPv4(ip: string): boolean {
  if (!isValidIPv4(ip)) return false;
  const firstOctetStr = ip.split(".")[0];
  if (!firstOctetStr) return false;
  const firstOctet = parseInt(firstOctetStr, 10);
  return firstOctet >= 224 && firstOctet <= 239;
}

/**
 * Checks if an IPv4 address is in a reserved range
 * @param ip - IPv4 address string to check
 * @returns True if the address is reserved
 */
export function isReservedIPv4(ip: string): boolean {
  if (!isValidIPv4(ip)) return false;

  return IPV4_RESERVED_RANGES.some((range) => {
    return _isIPInRange(ip, range.start, range.end);
  });
}

/**
 * Converts IPv4 address to binary string representation
 * @param ip - IPv4 address string
 * @returns Binary string representation (e.g., "11000000.10101000.00000001.00000001") or null if invalid
 */
export function ipToBinary(ip: string): string | null {
  if (!isValidIPv4(ip)) return null;

  return ip
    .split(".")
    .map((part) => parseInt(part, 10).toString(2).padStart(8, "0"))
    .join(".");
}

/**
 * Converts IPv4 address to hexadecimal representation
 * @param ip - IPv4 address string
 * @returns Hexadecimal string representation (e.g., "c0:a8:01:01") or null if invalid
 */
export function ipToHex(ip: string): string | null {
  if (!isValidIPv4(ip)) return null;

  return ip
    .split(".")
    .map((part) => parseInt(part, 10).toString(16).padStart(2, "0"))
    .join(":");
}

/**
 * Gets comprehensive IP address information
 * @param ip - IP address string
 * @returns IP information object
 */
export function analyzeIP(ip: string): IPInfo {
  const version = getIPVersion(ip);
  const isValid = version !== null;

  if (!isValid) {
    return {
      ip,
      isValid: false,
      version: null,
      isPrivate: false,
      isPublic: false,
      isReserved: false,
      isLoopback: false,
      isMulticast: false,
      isLinkLocal: false,
    };
  }

  if (version === 4) {
    const isPrivate = isPrivateIPv4(ip);
    const isLoopback = isLoopbackIPv4(ip);
    const isMulticast = isMulticastIPv4(ip);
    const isReserved = isReservedIPv4(ip);
    const isPublic = !isPrivate && !isReserved && !isLoopback;
    const integer = _ipToNumber(ip) || undefined;

    return {
      ip,
      isValid: true,
      version: 4,
      isPrivate,
      isPublic,
      isReserved,
      isLoopback,
      isMulticast,
      isLinkLocal: false,
      binary: ipToBinary(ip) || undefined,
      hex: ipToHex(ip) || undefined,
      integer,
    };
  } else {
    const isLinkLocal = ip.startsWith("fe80:");
    const isLoopback = ip === "::1" || ip.toLowerCase() === "0:0:0:0:0:0:0:1";
    const isMulticast = ip.startsWith("ff");
    const isPrivate =
      isLinkLocal || ip.startsWith("fc00:") || ip.startsWith("fd00:");
    const isPublic = !isPrivate && !isLoopback && !isMulticast;

    return {
      ip,
      isValid: true,
      version: 6,
      isPrivate,
      isPublic,
      isReserved: false,
      isLoopback,
      isMulticast,
      isLinkLocal,
      hex: ip.replace(/:/g, ""),
    };
  }
}

/**
 * Parses CIDR notation (e.g., "192.168.1.0/24")
 * @param cidr - CIDR notation string
 * @returns Network address, subnet mask, and range info
 */
export function parseCIDR(cidr: string): {
  network: string;
  subnetMask: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  hostCount: number;
  isValid: boolean;
  error?: string;
} {
  const parts = cidr.split("/");
  if (parts.length !== 2) {
    return {
      network: "",
      subnetMask: "",
      firstHost: "",
      lastHost: "",
      broadcast: "",
      hostCount: 0,
      isValid: false,
      error: "Invalid CIDR format",
    };
  }

  const [ip, prefix] = parts;
  if (!ip || !prefix) {
    return {
      network: "",
      subnetMask: "",
      firstHost: "",
      lastHost: "",
      broadcast: "",
      hostCount: 0,
      isValid: false,
      error: "Invalid CIDR format: missing IP or prefix",
    };
  }
  const prefixLength = parseInt(prefix, 10);

  if (
    !isValidIPv4(ip) ||
    isNaN(prefixLength) ||
    prefixLength < 0 ||
    prefixLength > 32
  ) {
    return {
      network: "",
      subnetMask: "",
      firstHost: "",
      lastHost: "",
      broadcast: "",
      hostCount: 0,
      isValid: false,
      error: "Invalid IP address or prefix length",
    };
  }

  const ipNum = _ipToNumber(ip);
  if (ipNum === null) {
    return {
      network: "",
      subnetMask: "",
      firstHost: "",
      lastHost: "",
      broadcast: "",
      hostCount: 0,
      isValid: false,
      error: "Invalid IP address",
    };
  }

  const maskBits = (0xffffffff << (32 - prefixLength)) >>> 0;
  const subnetMask = numberToIP(maskBits);

  const networkNum = (ipNum & maskBits) >>> 0;
  const network = numberToIP(networkNum);

  const broadcastNum = (networkNum | (~maskBits >>> 0)) >>> 0;
  const broadcast = numberToIP(broadcastNum);

  const firstHostNum = networkNum + 1;
  const lastHostNum = broadcastNum - 1;
  const firstHost = numberToIP(firstHostNum);
  const lastHost = numberToIP(lastHostNum);

  const hostCount = Math.max(0, lastHostNum - firstHostNum + 1);

  return {
    network,
    subnetMask,
    firstHost,
    lastHost,
    broadcast,
    hostCount,
    isValid: true,
  };
}
