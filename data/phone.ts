export const cambodiaPhonePattern = "(?:0[1-9][0-9]{7,8}|\\+?855[1-9][0-9]{7,8})";

export const cambodiaPhoneTitle =
  "Enter a Cambodia phone number like 015796200, 092394843, 0964637600, or +85592394843.";

function normalizePhoneNumber(phone: string) {
  return phone.trim().replace(/[\s-]/g, "");
}

export function isCambodiaPhoneNumber(phone: string) {
  return new RegExp(`^${cambodiaPhonePattern}$`).test(normalizePhoneNumber(phone));
}

export function sanitizeCambodiaPhoneInput(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  const digits = cleaned.replace(/\+/g, "");

  return cleaned.startsWith("+") ? `+${digits}` : digits;
}
