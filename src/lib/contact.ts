/**
 * Demande de contact : forme des réponses et validation.
 * Partagé entre le formulaire (client) et la Server Action (serveur).
 */

import type { Dictionary } from "@/i18n/dictionaries";

export type ContactFormDict = Dictionary["pages"]["contact"]["form"];

export type ContactAnswers = {
  projectType: string;
  features: string[];
  company: string;
  activity: string;
  existing: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactError = "invalid" | "captcha" | "send";

export type ContactResult = { ok: true } | { ok: false; error: ContactError };

export const EMPTY_ANSWERS: ContactAnswers = {
  projectType: "",
  features: [],
  company: "",
  activity: "",
  existing: "",
  budget: "",
  deadline: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

const SHORT = 200;
const LONG = 5000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return value.length <= SHORT && EMAIL.test(value);
}

/** Vrai quand la dernière étape peut être envoyée. */
export function canSubmit(answers: ContactAnswers) {
  return answers.name.trim().length >= 2 && isValidEmail(answers.email.trim());
}

/** Libellé → valeur, dans l'ordre du formulaire, sans les champs vides. */
export function recapRows(
  form: ContactFormDict,
  answers: ContactAnswers,
): [string, string][] {
  const rows: [string, string][] = [
    [form.steps[0].title, answers.projectType],
    [form.steps[1].title, answers.features.join(", ")],
    [form.fields.company, answers.company],
    [form.fields.activity, answers.activity],
    [form.fields.existing, answers.existing],
    [form.steps[3].title, answers.budget],
    [form.fields.deadline, answers.deadline],
    [form.fields.name, answers.name],
    [form.fields.email, answers.email],
    [form.fields.phone, answers.phone],
    [form.fields.message, answers.message],
  ];
  return rows.filter(([, value]) => value);
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Nettoie une saisie venue du client : rien ne passe sans être une chaîne
 * bornée. Renvoie null si les champs obligatoires manquent.
 */
export function parseAnswers(input: unknown): ContactAnswers | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;

  const answers: ContactAnswers = {
    projectType: text(raw.projectType, SHORT),
    features: Array.isArray(raw.features)
      ? raw.features
          .slice(0, 20)
          .map((item) => text(item, SHORT))
          .filter(Boolean)
      : [],
    company: text(raw.company, SHORT),
    activity: text(raw.activity, SHORT),
    existing: text(raw.existing, SHORT),
    budget: text(raw.budget, SHORT),
    deadline: text(raw.deadline, SHORT),
    name: text(raw.name, SHORT),
    email: text(raw.email, SHORT),
    phone: text(raw.phone, 40),
    message: text(raw.message, LONG),
  };

  return canSubmit(answers) ? answers : null;
}
