import Image from "next/image";

/** Fenêtre de navigateur : chrome sobre, l'écran reste la vedette. */
export function BrowserFrame({
  src,
  alt,
  host,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  host?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-line-strong bg-surface shadow-[0_30px_80px_-40px_var(--color-violet)] ${className}`}
    >
      {host ? (
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
          </div>
          <span className="truncate rounded-full border border-line bg-canvas px-3 py-1 text-[11px] text-ink-muted">
            {host}
          </span>
        </div>
      ) : null}
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        priority={priority}
        unoptimized
        sizes="(max-width: 1024px) 100vw, 720px"
        className="block h-auto w-full"
      />
    </div>
  );
}

/** Cadre téléphone, avec l'encoche. */
export function PhoneFrame({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[2rem] border border-line-strong bg-surface p-2 shadow-[0_24px_70px_-30px_var(--color-magenta)] ${className}`}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] bg-canvas">
        <span className="absolute left-1/2 top-2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-line-strong" />
        <Image
          src={src}
          alt={alt}
          width={390}
          height={844}
          unoptimized
          sizes="(max-width: 640px) 45vw, 220px"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

/** Desktop + mobile superposés, comme sur la direction artistique de référence. */
export function DeviceDuo({
  desktop,
  mobile,
  alt,
  host,
  priority = false,
}: {
  desktop: string;
  mobile: string;
  alt: { desktop: string; mobile: string };
  host?: string;
  priority?: boolean;
}) {
  return (
    <div className="relative pb-12 pr-8 sm:pb-0 sm:pr-16">
      <BrowserFrame
        src={desktop}
        alt={alt.desktop}
        host={host}
        priority={priority}
      />
      <PhoneFrame
        src={mobile}
        alt={alt.mobile}
        className="absolute -bottom-4 right-0 w-28 sm:-bottom-10 sm:w-36 lg:w-40"
      />
    </div>
  );
}
