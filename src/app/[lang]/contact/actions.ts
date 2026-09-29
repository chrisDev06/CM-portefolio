"use server";

import { headers } from "next/headers";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import {
  parseAnswers,
  recapRows,
  type ContactAnswers,
  type ContactResult,
} from "@/lib/contact";

/**
 * Envoie la demande par email à l'agence (Resend). Le back-office relève
 * cette boîte en IMAP et reconnaît la demande à l'en-tête X-CM-Lead et à la
 * pièce jointe lead.json : le mail est à la fois la notification et la trace.
 * Réglages : docs/SETUP-CONTACT.md.
 */
export async function sendContact(input: {
  locale: string;
  answers: ContactAnswers;
  token: string;
  honeypot: string;
}): Promise<ContactResult> {
  // Un robot a rempli le champ invisible : on fait comme si tout allait bien.
  if (input.honeypot) return { ok: true };

  const answers = parseAnswers(input.answers);
  if (!answers) return { ok: false, error: "invalid" };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!(await verifyTurnstile(input.token, ip))) {
    return { ok: false, error: "captcha" };
  }

  const locale = isLocale(input.locale) ? input.locale : "fr";
  const sent = await sendLeadMail(answers, locale);
  return sent ? { ok: true } : { ok: false, error: "send" };
}

/** Sans clé secrète configurée, Turnstile est désactivé (voir SETUP-CONTACT). */
async function verifyTurnstile(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("[contact] Turnstile injoignable", error);
    return false;
  }
}

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function sendLeadMail(answers: ContactAnswers, locale: string) {
  // Le mail est lu par l'agence : toujours en français, quelle que soit
  // la langue du visiteur.
  const form = (await getDictionary("fr")).pages.contact.form;
  const rows: [string, string][] = [
    ...recapRows(form, answers),
    [form.mail.locale, locale.toUpperCase()],
  ];

  const subject = [
    `${form.mail.subject} — ${answers.name}`,
    answers.company,
    answers.projectType,
  ]
    .filter(Boolean)
    .join(" · ");

  const text = [
    form.mail.intro,
    "",
    ...rows.map(([label, value]) => `${label} : ${value}`),
    "",
    form.mail.reply,
  ].join("\n");

  const html = `<p>${escape(form.mail.intro)}</p>
<table cellpadding="6" style="border-collapse:collapse">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="color:#666;vertical-align:top">${escape(label)}</td><td style="white-space:pre-wrap">${escape(value)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="color:#666">${escape(form.mail.reply)}</p>`;

  // Données structurées pour le back-office (ne pas changer sans lui).
  const lead = {
    version: 1,
    source: "site",
    locale,
    submittedAt: new Date().toISOString(),
    answers,
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY ou CONTACT_TO absent, mail non envoyé :\n" + text);
      return true;
    }
    console.error("[contact] RESEND_API_KEY ou CONTACT_TO manquant");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "C&M Agency <onboarding@resend.dev>",
        to: [to],
        reply_to: answers.email,
        subject,
        text,
        html,
        headers: { "X-CM-Lead": "1" },
        attachments: [
          {
            filename: "lead.json",
            content: Buffer.from(JSON.stringify(lead, null, 2)).toString("base64"),
          },
        ],
      }),
    });
    if (!response.ok) {
      console.error("[contact] Resend", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contact] Resend injoignable", error);
    return false;
  }
}
