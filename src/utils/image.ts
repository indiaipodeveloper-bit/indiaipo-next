export const getImgSrc = (src: any) => {
  if (!src || src === "0" || src === 0 || src === "" || src === "null" || src === "undefined") return null;
  const s = String(src).trim();
  if (s.toLowerCase() === 'null') return null;

  if (s.startsWith('http') || s.startsWith('https') || s.startsWith('data:')) {
    return s;
  }

  if (s.startsWith('/static') || s.startsWith('/src/assets') || s.startsWith('/assets')) {
    return s;
  }
  
  let cleanPath = s;
  if (cleanPath.startsWith('/uploads')) {
    // Keep it as is
  } else if (cleanPath.startsWith('uploads/')) {
    cleanPath = `/${cleanPath}`;
  } else {
    cleanPath = `/uploads/${cleanPath}`;
  }
  
  return cleanPath;
};
