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
          title: "សំណើកក់ពេលសាក់ថ្មី",
          fullName: "ឈ្មោះពេញ",
          phone: "លេខទូរស័ព្ទ",
          email: "អ៊ីមែល",
          style: "រចនាប័ទ្មសាក់",
          placement: "ទីតាំងសាក់",
          date: "ថ្ងៃ/ខែ/ឆ្នាំ",
          message: "សារ / គំនិតសាក់",
        }
      : {
          title: "New Tattoo Booking Request",
          fullName: "Full Name",
          phone: "Phone",
          email: "Email",
          style: "Tattoo Style",
          placement: "Placement",
          date: "Preferred Date",
          message: "Message / Idea",
        };

  return [
    labels.title,
    "",
    `${labels.fullName}: ${getValue(formData, "fullName")}`,
    `${labels.phone}: ${getValue(formData, "phone")}`,
    `${labels.email}: ${getValue(formData, "email")}`,
    `${labels.style}: ${getValue(formData, "tattooStyle")}`,
    `${labels.placement}: ${getValue(formData, "placement")}`,
    `${labels.date}: ${getValue(formData, "preferredDate")}`,
    "",
    `${labels.message}:`,
    getValue(formData, "message"),
  ].join("\n");
}

async function sendTelegramRequest(path: string, body: FormData | URLSearchParams) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return "Missing TELEGRAM_BOT_TOKEN in .env.local.";
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/${path}`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    return `Telegram request failed: ${errorText}`;
  }

  return null;
}

export async function POST(request: Request) {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    return Response.json({ error: "Missing TELEGRAM_CHAT_ID in .env.local." }, { status: 500 });
  }

  const formData = await request.formData();
  const message = formatTelegramMessage(formData);
  const referenceImage = formData.get("referenceImage");

  const messageForm = new URLSearchParams();
  messageForm.set("chat_id", chatId);
  messageForm.set("text", message);

  const messageError = await sendTelegramRequest("sendMessage", messageForm);
  if (messageError) {
    return Response.json({ error: messageError }, { status: 502 });
  }

  if (referenceImage instanceof File && referenceImage.size > 0) {
    const telegramForm = new FormData();
    telegramForm.set("chat_id", chatId);
    telegramForm.set("caption", "Reference image");
    telegramForm.set("photo", referenceImage, referenceImage.name || "reference-image.jpg");
    const photoError = await sendTelegramRequest("sendPhoto", telegramForm);
    if (photoError) {
      return Response.json({ error: photoError }, { status: 502 });
    }
  }

  return Response.json({ ok: true });
}
