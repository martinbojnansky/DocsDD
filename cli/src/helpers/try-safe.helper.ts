export function trySafe<T, E = any>(
  fn: () => T,
  handleException: (ex: E) => T = () => null
): T {
  try {
    const result = fn();
    return result ? result : null;
  } catch (ex) {
    return handleException(ex);
  }
}
