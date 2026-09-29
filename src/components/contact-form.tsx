"use client";

import { useState, useTransition } from "react";
import { sendContact } from "@/app/[lang]/contact/actions";
import {
  EMPTY_ANSWERS,
  canSubmit,
  recapRows,
  type ContactAnswers,
  type ContactError,
  type ContactFormDict,
} from "@/lib/contact";
import { Turnstile } from "./turnstile";
import { Icon } from "./ui";

const FIELD_BASE =
  "w-full rounded-md border border-line bg-surface-2 px-4 py-3 text-sm text-ink outline-none transition-colors duration-200 ease-brand placeholder:text-ink-muted/60 focus:border-violet";

function Choice({
  label,
  selected,
  onSelect,
  multiple = false,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  multiple?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2.5 text-sm transition-colors duration-200 ease-brand ${
        selected
          ? "border-violet bg-violet/15 text-ink"
          : "border-line text-ink-muted hover:border-line-strong hover:text-ink"
      }`}
    >
      {multiple && selected ? "✓ " : ""}
      {label}
    </button>
  );
}

function Field({
  label,
  children,
  id,
}: {
  label: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-ink-muted">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function ContactForm({
  form,
  locale,
  turnstileSiteKey,
}: {
  form: ContactFormDict;
  locale: string;
  turnstileSiteKey?: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ContactAnswers>(EMPTY_ANSWERS);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<ContactError | null>(null);
  const [token, setToken] = useState("");
  const [captchaRound, setCaptchaRound] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [pending, startTransition] = useTransition();

  const total = form.steps.length;
  const current = form.steps[step];
  const progress = Math.round(((step + 1) / total) * 100);

  function set<K extends keyof ContactAnswers>(
    key: K,
    value: ContactAnswers[K],
  ) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFeature(feature: string) {
    setAnswers((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((item) => item !== feature)
        : [...prev.features, feature],
    }));
  }

  const ready =
    canSubmit(answers) && (!turnstileSiteKey || Boolean(token)) && !pending;

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await sendContact({ locale, answers, token, honeypot });
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error);
        // Le jeton Turnstile est consommé : il en faut un nouveau.
        setCaptchaRound((round) => round + 1);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-lg border border-line bg-surface/60 p-8">
        <h2 className="text-2xl">{form.summary.title}</h2>
        <p className="mt-3 text-ink-muted">{form.summary.lead}</p>

        <dl className="mt-8 divide-y divide-line border-y border-line">
          {recapRows(form, answers).map(([label, value]) => (
              <div key={label} className="grid gap-1 py-3 sm:grid-cols-[1fr_2fr]">
                <dt className="text-sm text-ink-muted">{label}</dt>
                <dd className="text-sm">{value}</dd>
              </div>
            ))}
        </dl>

        <button
          type="button"
          onClick={() => {
            setAnswers(EMPTY_ANSWERS);
            setStep(0);
            setDone(false);
            setCaptchaRound((round) => round + 1);
          }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm transition-colors duration-200 ease-brand hover:border-violet"
        >
          {form.summary.restart}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-surface/60 p-8">
      <div className="flex items-center justify-between text-sm text-ink-muted">
        <span>
          {form.stepLabel} {step + 1} {form.of} {total}
        </span>
        <span>{progress} %</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-linear-to-r from-violet to-magenta transition-[width] duration-300 ease-brand"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="mt-8 text-2xl">{current.title}</h2>
      <p className="mt-2 text-ink-muted">{current.lead}</p>

      <div className="mt-8">
        {current.field === "projectType" ? (
          <div className="flex flex-wrap gap-2.5">
            {current.options.map((option) => (
              <Choice
                key={option}
                label={option}
                selected={answers.projectType === option}
                onSelect={() => set("projectType", option)}
              />
            ))}
          </div>
        ) : null}

        {current.field === "features" ? (
          <div className="flex flex-wrap gap-2.5">
            {current.options.map((option) => (
              <Choice
                key={option}
                label={option}
                multiple
                selected={answers.features.includes(option)}
                onSelect={() => toggleFeature(option)}
              />
            ))}
          </div>
        ) : null}

        {current.field === "context" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={form.fields.company} id="company">
              <input
                id="company"
                className={FIELD_BASE}
                value={answers.company}
                onChange={(event) => set("company", event.target.value)}
              />
            </Field>
            <Field label={form.fields.activity} id="activity">
              <input
                id="activity"
                className={FIELD_BASE}
                value={answers.activity}
                onChange={(event) => set("activity", event.target.value)}
              />
            </Field>
            <Field label={form.fields.existing} id="existing">
              <select
                id="existing"
                className={FIELD_BASE}
                value={answers.existing}
                onChange={(event) => set("existing", event.target.value)}
              >
                <option value="">—</option>
                {form.fields.existingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : null}

        {current.field === "budget" ? (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2.5">
              {current.options.map((option) => (
                <Choice
                  key={option}
                  label={option}
                  selected={answers.budget === option}
                  onSelect={() => set("budget", option)}
                />
              ))}
            </div>
            <Field label={form.fields.deadline} id="deadline">
              <select
                id="deadline"
                className={`${FIELD_BASE} sm:max-w-xs`}
                value={answers.deadline}
                onChange={(event) => set("deadline", event.target.value)}
              >
                <option value="">—</option>
                {form.fields.deadlineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : null}

        {current.field === "contact" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={form.fields.name} id="name">
              <input
                id="name"
                required
                autoComplete="name"
                className={FIELD_BASE}
                value={answers.name}
                onChange={(event) => set("name", event.target.value)}
              />
            </Field>
            <Field label={form.fields.email} id="email">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className={FIELD_BASE}
                value={answers.email}
                onChange={(event) => set("email", event.target.value)}
              />
            </Field>
            <Field label={form.fields.phone} id="phone">
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className={FIELD_BASE}
                value={answers.phone}
                onChange={(event) => set("phone", event.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label={form.fields.message} id="message">
                <textarea
                  id="message"
                  rows={4}
                  className={FIELD_BASE}
                  value={answers.message}
                  onChange={(event) => set("message", event.target.value)}
                />
              </Field>
            </div>
            <p className="text-xs leading-relaxed text-ink-muted sm:col-span-2">
              {form.consent}
            </p>
            {/* Invisible pour un humain, rempli par les robots. */}
            <div aria-hidden="true" className="absolute -left-[9999px]">
              <label htmlFor="website">{form.honeypot}</label>
              <input
                id="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>
            {turnstileSiteKey ? (
              <div className="sm:col-span-2">
                <Turnstile
                  siteKey={turnstileSiteKey}
                  locale={locale}
                  onToken={setToken}
                  resetKey={captchaRound}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-6 text-sm text-magenta">
          {form.errors[error]}
        </p>
      ) : null}

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
          className="text-sm text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
        >
          {form.back}
        </button>

        {step < total - 1 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet to-magenta px-6 py-3 text-sm font-medium shadow-[0_0_24px_-6px_var(--color-magenta)]"
          >
            {form.next}
            <Icon name="arrow" className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!ready}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet to-magenta px-6 py-3 text-sm font-medium shadow-[0_0_24px_-6px_var(--color-magenta)] disabled:opacity-50"
          >
            {pending ? form.sending : form.submit}
            <Icon name="arrow" className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
