import { Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";
import type { ReactNode } from "react";

export function BrandHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-graphite text-primary-foreground">
            <BookMarked className="h-4 w-4" />
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[13px] font-semibold tracking-tight text-foreground">
              Central de Normativas &amp; POPs
            </span>
            <span className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              RedeCompras
            </span>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
