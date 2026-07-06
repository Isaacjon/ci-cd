const pagesBasePath = '/ci-cd';

function usesPagesBasePath(pathname = window.location.pathname): boolean {
  return pathname === pagesBasePath || pathname.startsWith(`${pagesBasePath}/`);
}

function getAppPathname(pathname = window.location.pathname): string {
  if (pathname === pagesBasePath) return '/';
  if (pathname.startsWith(`${pagesBasePath}/`)) {
    return pathname.slice(pagesBasePath.length) || '/';
  }
  return pathname;
}

function getPublicPathname(pathname: string): string {
  const appPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!usesPagesBasePath()) return appPathname;
  if (appPathname === '/catalog') return `${pagesBasePath}/`;
  return `${pagesBasePath}${appPathname}`;
}

export { getAppPathname, getPublicPathname };
