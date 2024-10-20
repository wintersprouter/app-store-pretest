function debounce<F extends (...args: unknown[]) => unknown>(
  fn: F,
  delay: number = 500,
): (...args: Parameters<F>) => void {
  let timeoutId: NodeJS.Timeout | undefined;
  return function (...args: Parameters<F>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export default debounce;
