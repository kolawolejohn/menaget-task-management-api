export function enumToArray<T extends Record<string, string | number>>(
  enumValues: T,
): string[] {
  return Object.values(enumValues).filter(
    (value): value is string => typeof value === 'string',
  );
}
