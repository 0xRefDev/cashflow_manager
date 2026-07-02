/**
 * Precise, decimal-safe mathematical operations to avoid floating-point inaccuracies
 * in financial calculations.
 */

export function safeAdd(a: number, b: number): number {
  const aStr = a.toString();
  const bStr = b.toString();
  const aDec = aStr.indexOf('.') >= 0 ? aStr.split('.')[1].length : 0;
  const bDec = bStr.indexOf('.') >= 0 ? bStr.split('.')[1].length : 0;
  const maxDec = Math.max(aDec, bDec);
  if (maxDec === 0) return a + b;
  const factor = Math.pow(10, maxDec);
  return (Math.round(a * factor) + Math.round(b * factor)) / factor;
}

export function safeSubtract(a: number, b: number): number {
  const aStr = a.toString();
  const bStr = b.toString();
  const aDec = aStr.indexOf('.') >= 0 ? aStr.split('.')[1].length : 0;
  const bDec = bStr.indexOf('.') >= 0 ? bStr.split('.')[1].length : 0;
  const maxDec = Math.max(aDec, bDec);
  if (maxDec === 0) return a - b;
  const factor = Math.pow(10, maxDec);
  return (Math.round(a * factor) - Math.round(b * factor)) / factor;
}
