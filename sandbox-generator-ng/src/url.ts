/**
 * Keeps an app-internal URL relative so the browser resolves it against the
 * page's <base href>. With a leading slash the URL points at the domain root,
 * so the app would only work when it is served from the root; GitHub Pages
 * serves it from /sandbox-generator/ instead.
 */
function baseRelative(url: string): string {
  return url.replace(/^\//, '');
}

export { baseRelative };
