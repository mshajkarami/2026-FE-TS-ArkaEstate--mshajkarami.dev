const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

export function formatBillionToman(amount: number): string {
  const rounded = Math.round(amount * 10) / 10;
  const formatted = rounded.toLocaleString('en-US');
  return `${toPersianDigits(formatted)} میلیارد تومان`;
}

export function formatMillionToman(amount: number): string {
  const formatted = Math.round(amount).toLocaleString('en-US');
  return `${toPersianDigits(formatted)} میلیون تومان`;
}

export function formatPercent(value: number): string {
  return `${toPersianDigits(Math.round(value))}٪`;
}

export function formatTimeMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  return toPersianDigits(`${mm}:${ss}`);
}
