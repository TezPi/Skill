import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "sun" | "ghost" | "outline";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control font-display leading-none select-none " +
  "transition-[transform,box-shadow,background-color,color] duration-150 ease-snap " +
  "disabled:pointer-events-none disabled:opacity-50";

/* Hard-shadow buttons physically "press": lift on hover, sink on active */
const pressable =
  "shadow-hard hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

const variants: Record<Variant, string> = {
  primary: cn("bg-cobalt text-snow", pressable),
  sun: cn("bg-sun text-cobalt-deep", pressable),
  ghost: "text-snow ring-1 ring-inset ring-snow/40 hover:bg-snow/10 hover:ring-snow/70 active:bg-snow/15",
  outline: "text-fg ring-1 ring-inset ring-line hover:ring-fg/40 hover:bg-fg/5 active:bg-fg/10",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-[1.25rem]",
  lg: "h-12 px-5 text-[1.5rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

type ButtonLinkProps = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">;

export function ButtonLink({
  href,
  external,
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      <span>{children}</span>
      {icon ? (
        <span aria-hidden className="transition-transform duration-200 ease-out-expo group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

export function Button({ variant = "primary", size = "md", icon, children, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <span>{children}</span>
      {icon ? <span aria-hidden>{icon}</span> : null}
    </button>
  );
}
