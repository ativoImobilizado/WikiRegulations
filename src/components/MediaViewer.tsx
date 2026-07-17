import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageOff, ZoomIn } from "lucide-react";
import type { StepImageType } from "@/data/normativas";

interface MediaViewerProps {
  url?: string;
  tipo?: StepImageType;
  alt: string;
}

export function MediaViewer({ url, tipo = "pc", alt }: MediaViewerProps) {
  const [open, setOpen] = useState(false);
  const isColetor = tipo === "coletor";

  const containerClass = isColetor
    ? "relative aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-xl border border-border bg-graphite/95 shadow-lg"
    : "relative aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-muted shadow-sm";

  if (!url) {
    return (
      <div
        className={`${containerClass} flex items-center justify-center text-muted-foreground/60`}
      >
        <div className="flex flex-col items-center gap-2 text-xs">
          <ImageOff className="h-6 w-6" />
          <span>Sem print cadastrado</span>
          <span className="opacity-70">
            {isColetor ? "Coletor · 9:16" : "PC · 16:9"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${containerClass} group cursor-zoom-in`}
        aria-label={`Ampliar imagem: ${alt}`}
      >
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="inline-flex items-center gap-1 rounded-md bg-graphite/85 px-2 py-1 text-[11px] font-medium text-white">
            <ZoomIn className="h-3 w-3" /> Ampliar
          </span>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl border-0 bg-transparent p-0 shadow-none">
          <img
            src={url}
            alt={alt}
            className="mx-auto max-h-[85vh] w-auto rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function VideoEmbed({ url }: { url?: string }) {
  if (!url) return null;

  // Normaliza URL do YouTube para embed
  let src = url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      src = `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    } else if (u.hostname === "youtu.be") {
      src = `https://www.youtube.com/embed${u.pathname}`;
    }
  } catch {
    /* usa url como está */
  }

  const isFile = /\.(mp4|webm|ogg)$/i.test(src);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-graphite shadow-sm">
      <div className="aspect-video w-full">
        {isFile ? (
          <video src={src} controls className="h-full w-full" />
        ) : (
          <iframe
            src={src}
            title="Vídeo do POP"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
