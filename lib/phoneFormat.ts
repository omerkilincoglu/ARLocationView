export function formatPhone(phone?: string): string {
  if (!phone) return "";

  // sadece rakamları al
  const digits = phone.replace(/\D/g, "");

  // cep telefonu mu kontrol et (05xx → +905…)
  if (digits.startsWith("90") && digits.length === 12 && digits[2] === "5") {
    return `+90 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(
      8,
      10
    )} ${digits.slice(10)}`;
  }

  // sabit hat: +90264xxxxxxx
  if (digits.startsWith("90") && digits.length >= 12) {
    const area = digits.slice(2, 5); // alan kodu
    const part1 = digits.slice(5, 8);
    const part2 = digits.slice(8, 10);
    const part3 = digits.slice(10);
    return `(${area}) ${part1} ${part2} ${part3}`;
  }

  // fallback
  return phone;
}
