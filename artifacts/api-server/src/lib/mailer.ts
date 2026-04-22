import nodemailer from "nodemailer";
import { logger } from "./logger";

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) {
    return null;
  }
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    logger.warn(
      { to: opts.to, subject: opts.subject },
      "SMTP не настроен — письмо не отправлено (заявка сохранена в БД)",
    );
    return { ok: false, reason: "smtp_not_configured" };
  }
  if (!opts.to) {
    return { ok: false, reason: "no_recipient" };
  }
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  try {
    await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    logger.info({ to: opts.to, subject: opts.subject }, "Письмо отправлено");
    return { ok: true };
  } catch (err) {
    logger.error({ err }, "Не удалось отправить письмо");
    return { ok: false, reason: "send_failed" };
  }
}
