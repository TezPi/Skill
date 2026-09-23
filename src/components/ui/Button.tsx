import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { BorderRunner } from "./BorderRunner";
import { ArrowRight, ArrowUpRight } from "./icons";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium tracking-tight " +
  "transition-[transform,background-color,border-color,color] duration-300 ease-expo active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Weight, not hue, ranks buttons. Blue solid = the one action to take.
  primary:
    "bg-signal text-on-signal hover:bg-[color-mix(in_srgb,var(--color-signal)_88%,white)] focus-visible:outline-fg",
  secondary: "border border-line-strong text-fg hover:border-fg hover:bg-fg/5",
  ghost: "text-fg hover:text-fg px-0",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-[0.9375rem]",
  lg: "h-13 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], variant !== "ghost" && sizes[size], variant === "ghost" && "h-11", className);
}

/** Trailing arrow that nudges forward on hover — feedback that this goes somewhere. */
function Trail({ external }: { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      size={16}
      className={cn(
        "transition-transform duration-500 ease-expo",
        external ? "group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" : "group-hover/btn:translate-x-1",
      )}
    />
  );
}

type LinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  runner?: boolean;
  download?: boolean;
  "aria-label"?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  arrow = true,
  runner = false,
  download,
  ...rest
}: LinkProps) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const opensTab = href.startsWith("http");
  const inner = (
    <>
      <span className={cn(variant === "ghost" && "link-draw")}>{children}</span>
      {arrow && <Trail external={opensTab} />}
      {opensTab && <span className="sr-only">(opens in a new tab)</span>}
    </>
  );
  const cls = buttonClasses(variant, size, className);
  const el = external ? (
    <a
      href={href}
      className={cls}
      {...(opensTab ? { target: "_blank", rel: "noreferrer" } : {})}
      download={download}
      {...rest}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
  return runner ? <BorderRunner>{el}</BorderRunner> : el;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />;
});
