export function calc(a: string, b: number) {
  return ((parseInt(a) * 100) / b).toFixed(2);
}
export function sum(b: Array<any>, key: string) {
  let total = 0;
  b.forEach(i => {
    total += parseInt(i[key]);
  });
  return total;
}
