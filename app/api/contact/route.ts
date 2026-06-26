import { cambodiaPhoneTitle, isCambodiaPhoneNumber } from "@/data/phone";

export const runtime = "nodejs";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formatTelegramMessage(formData: FormData) {
  const language = getValue(formData, "language") || "en";
  const labels =
    language === "km"
      ? {
          title: "សារទំនាក់ទំនងថ្មី",
          name: "ឈ្មោះ",
          phone: "លេខទូរស័ព្ទ",
          email: "អ៊ីមែល",
          message: "សារ",
        }
      : {
          title: "New Contact Message",
          name: "Name",
          phone: "Phone",
          email: "Email",
          message: "Message",
        };

  return [
    labels.title,
    "",
    `${labels.name}: ${getValue(formData, "name")}`,
    `${labels.phone}: ${getValue(formData, "phone")}`,
    `${labels.email}: ${getValue(formData, "email")}`,
    "",
    `${labels.message}:`,
    getValue(formData, "message"),
  ].join("\n");
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token) {
    return Response.json({ error: "Missing TELEGRAM_BOT_TOKEN in .env.local." }, { status: 500 });
  }

  if (!chatId) {
    return Response.json({ error: "Missing TELEGRAM_CHAT_ID in .env.local." }, { status: 500 });
  }

  const formData = await request.formData();
  if (!isCambodiaPhoneNumber(getValue(formData, "phone"))) {
    return Response.json({ error: cambodiaPhoneTitle }, { status: 400 });
  }

  const telegramForm = new URLSearchParams();
  telegramForm.set("chat_id", chatId);
  telegramForm.set("text", formatTelegramMessage(formData));

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    body: telegramForm,
  });

  if (!response.ok) {
    const errorText = await response.text();
    return Response.json({ error: `Telegram request failed: ${errorText}` }, { status: 502 });
  }

  return Response.json({ ok: true });
}
