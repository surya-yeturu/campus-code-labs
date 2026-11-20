const isFileEndpoint = (pathname) => pathname.startsWith('/api/files/') || pathname.startsWith('/uploads/');

export const resolveFileUrl = (value) => {
  if (!value) return '';

  let pathname = value;
  let search = '';
  try {
    const parsed = new URL(value, window.location.origin);
    if (/^https?:$/.test(parsed.protocol) && !isFileEndpoint(parsed.pathname)) return value;
    pathname = parsed.pathname;
    search = parsed.search;
  } catch {
    return value;
  }

  if (!isFileEndpoint(pathname)) return value;

  const apiBase = import.meta.env.VITE_API_URL || '/api';
  if (/^https?:\/\//i.test(apiBase)) {
    return `${new URL(apiBase).origin}${pathname}${search}`;
  }
  return `${pathname}${search}`;
};
