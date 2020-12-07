export function isValidString(val: any): val is string {
  return typeof val === 'string' && !!val.length;
}
