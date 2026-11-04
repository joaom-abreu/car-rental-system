export function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim().toUpperCase();
}
