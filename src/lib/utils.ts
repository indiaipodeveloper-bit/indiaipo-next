import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';

  const s = String(path).trim();



  if (s.startsWith('http') || s.startsWith('data:') || s.startsWith('/src/assets') || s.startsWith('/static')) {
    return s;
  }


  let cleanPath = s;
  if (!s.startsWith('/uploads') && !s.startsWith('uploads/')) {
    cleanPath = `/uploads/${s.startsWith('/') ? s.slice(1) : s}`;
  } else if (s.startsWith('uploads/')) {
    cleanPath = `/${s}`;
  }

  const isDev = process.env.NODE_ENV === "development";
  const apiBase = isDev ? "http://localhost:5000" : "https://www.indiaipo.in";

  if (cleanPath.startsWith('/uploads')) {
    return `${apiBase}${cleanPath}`;
  }

  return cleanPath;
}

export function formatIndianNumber(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';

  let str = String(value).trim();

  // Handle brackets (common in financial reports for negative numbers)
  let isBracketed = false;
  if (str.startsWith('(') && str.endsWith(')')) {
    isBracketed = true;
    str = str.slice(1, -1).trim();
  }

  // Handle signs
  let sign = '';
  if (str.startsWith('-')) {
    sign = '-';
    str = str.slice(1).trim();
  } else if (str.startsWith('+')) {
    sign = '+';
    str = str.slice(1).trim();
  }

  if (str.toLowerCase().endsWith('rs')) {
    const withoutRs = str.slice(0, -2).trim();
    if (!withoutRs.startsWith('₹')) {
      str = '₹' + withoutRs;
    } else {
      str = withoutRs;
    }
  }

  if (str.toLowerCase().endsWith('cr') && !str.toLowerCase().endsWith(' cr')) {
    str = str.slice(0, -2).trim() + ' Cr';
  }

  if (str.includes(' to ') || str.includes(' - ')) {
    const separator = str.includes(' to ') ? ' to ' : ' - ';
    const formattedRange = str.split(separator).map(s => formatIndianNumber(s.trim())).join(separator);
    let result = sign + formattedRange;
    if (isBracketed) {
      result = `(${result})`;
    }
    return result;
  }

  const match = str.match(/^([₹$]?)\s*([\d,]+\.?\d*)\s*(.*)/);

  if (match) {
    const symbol = match[1] || '';
    const numericPart = match[2].replace(/,/g, '');
    const suffix = match[3] || '';

    const num = parseFloat(numericPart);
    if (!isNaN(num)) {
      const formattedNum = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 4,
        minimumFractionDigits: 0
      }).format(num);

      let formattedResult = `${symbol}${symbol ? ' ' : ''}${formattedNum}${suffix ? (suffix.startsWith(' ') ? suffix : ' ' + suffix) : ''}`.trim();

      formattedResult = sign + formattedResult;
      if (isBracketed) {
        formattedResult = `(${formattedResult})`;
      }
      return formattedResult;
    }
  }

  let fallbackResult = sign + str;
  if (isBracketed) {
    fallbackResult = `(${fallbackResult})`;
  }
  return fallbackResult;
}

export function getLatestGmpValue(data: any): string {
  if (data === null || data === undefined || data === '' || data === 0 || data === '0') return '—';

  let s = String(data).trim();

  // Handle JSON array format for historical updates
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Take the latest (last) entry in the array
        const latest = parsed[parsed.length - 1];
        s = latest !== null && latest !== undefined ? String(latest).trim() : '—';
      }
    } catch (e) {
      // If parsing fails, fall back to the original string
    }
  }

  if (s === '—') return '—';

  // If it's a numeric value without any symbol, add ₹
  const isPureNumeric = /^-?\d+(\.\d+)?$/.test(s);
  if (isPureNumeric) {
    const num = parseFloat(s);
    return num >= 0 ? `₹${s}` : `-₹${Math.abs(num)}`;
  }

  return s;
}
