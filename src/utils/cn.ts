/**
 * Utility function to combine class names
 * @param classes - Array of class names (strings, undefined, null, or false)
 * @returns Combined class names as a string
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  };