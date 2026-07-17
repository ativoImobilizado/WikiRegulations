import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, Menu, X } from "lucide-react";
import { findNormativa, type Normativa, type Pop, type Step, type Secao } from "@/data/normativas";
import { BrandHeader } from "@/components/BrandHeader";
import { MediaViewer, VideoEmbed } from "@/components/MediaViewer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/n/$codigo")({
  loader: ({ params }) => {
    const normativa = findNormativa(params.codigo);
    if (!normativa) throw notFound();
    return { normativa };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Normativa não encontrada · RedeCompras" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { normativa } = loaderData;
    const title = `${normativa.codigo} — ${normativa.titulo} · RedeCompras`;
    return {
      meta: [
        { title },
        { name: "description", content: normativa.descricao },
        { property: "og:title", content: title },
        { property: "og:description", content: normativa.descricao },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className="mt-2 text-xl font-semibold text-foreground">Normativa não encontrada</h1>
        <Link to="/" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-graphite hover:underline">
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </Link>
      </div>
    </div>
  ),
  component: NormativaPage,
});

function NormativaPage() {
  const { normativa } = Route.useLoaderData() as { normativa: Normativa };
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    const nodes = contentRef.current?.querySelectorAll<HTMLElement>("[data-anchor]");
    nodes?.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [normativa.codigo]);

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader
        right={
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Abrir índice</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Índice
                  </span>
                  <button onClick={() => setMobileOpen(false)} aria-label="Fechar">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <TableOfContents
                    normativa={normativa}
                    activeId={activeId}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,25%)_minmax(0,75%)] md:gap-10">
        {/* Sidebar desktop */}
        <aside className="hidden md:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Todas as normativas
            </Link>
            <TableOfContents normativa={normativa} activeId={activeId} />
          </div>
        </aside>

        {/* Conteúdo */}
        <article ref={contentRef} className="min-w-0 pb-24">
          <div className="mb-8 border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
              <span className="rounded-md bg-graphite px-2 py-1 uppercase tracking-widest text-primary-foreground">
                {normativa.codigo}
              </span>
              <span className="text-muted-foreground uppercase tracking-widest">
                {normativa.categoria}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {normativa.titulo}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground">
              {normativa.descricao}
            </p>
          </div>

          {/* Renderização Condicional: DIRETRIZ ou POP */}
          {normativa.tipo === "DIRETRIZ" ? (
            normativa.secoes?.map((secao, index) => (
              <SecaoSection key={index} secao={secao} index={index} />
            ))
          ) : (
            normativa.pops?.map((pop) => (
              <PopSection key={pop.codigo} pop={pop} />
            ))
          )}
        </article>
      </div>
    </div>
  );
}

function TableOfContents({
  normativa,
  activeId,
  onNavigate,
}: {
  normativa: Normativa;
  activeId: string;
  onNavigate?: () => void;
}) {
  // Índice para formato DIRETRIZ (exibe os Capítulos/Seções)
  if (normativa.tipo === "DIRETRIZ") {
    return (
      <nav className="space-y-4 px-4 py-4 md:px-0 md:py-0">
        {normativa.secoes?.map((secao, index) => {
          const id = secaoId(index);
          const active = activeId === id;
          return (
            <div key={id}>
              <a
                href={`#${id}`}
                onClick={onNavigate}
                className={`block text-[13px] font-medium transition-colors ${
                  active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {secao.titulo}
              </a>
            </div>
          );
        })}
      </nav>
    );
  }

  // Índice para formato POP (exibe Títulos e Passos)
  return (
    <nav className="space-y-6 px-4 py-4 md:px-0 md:py-0">
      {normativa.pops?.map((pop) => (
        <div key={pop.codigo}>
          <a
            href={`#${popId(pop)}`}
            onClick={onNavigate}
            className={`block text-[11px] font-semibold uppercase tracking-widest transition-colors ${
              activeId === popId(pop) ? "text-graphite" : "text-muted-foreground"
            } hover:text-foreground`}
          >
            {pop.codigo}
          </a>
          <a
            href={`#${popId(pop)}`}
            onClick={onNavigate}
            className={`mt-0.5 block text-sm font-medium transition-colors ${
              activeId === popId(pop) ? "text-foreground" : "text-foreground/80"
            } hover:text-foreground`}
          >
            {pop.titulo}
          </a>
          <ul className="mt-2 space-y-1 border-l border-border pl-3">
            {pop.passos.map((step) => {
              const id = stepId(pop, step);
              const active = activeId === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={onNavigate}
                    className={`-ml-[13px] flex items-center gap-1.5 border-l-2 pl-3 py-1 text-[13px] transition-colors ${
                      active
                        ? "border-graphite text-foreground font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ChevronRight className="h-3 w-3 opacity-60" />
                    <span className="truncate">
                      {step.numero}. {step.titulo}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// -------------------------------------------
// COMPONENTE NOVO: RENDERIZADOR DE DIRETRIZES
// -------------------------------------------
function SecaoSection({ secao, index }: { secao: Secao; index: number }) {
  return (
    <section
      id={secaoId(index)}
      data-anchor
      className="mb-12 scroll-mt-24 [content-visibility:auto]"
    >
      <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {secao.titulo}
      </h2>
      <div className="space-y-4">
        {secao.paragrafos.map((paragrafo, i) => (
          <p
            key={i}
            className="text-[15px] leading-relaxed text-muted-foreground"
          >
            {paragrafo}
          </p>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------
// COMPONENTES EXISTENTES: RENDERIZADOR DE POPS
// -------------------------------------------
function PopSection({ pop }: { pop: Pop }) {
  return (
    <section id={popId(pop)} data-anchor className="mb-16 scroll-mt-24 [content-visibility:auto] [contain-intrinsic-size:1px_800px]">
      <div className="mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {pop.codigo}
        </span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {pop.titulo}
        </h2>
        <div className="mt-3 rounded-lg border border-border bg-secondary/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-graphite">
            Objetivo
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">{pop.objetivo}</p>
        </div>
      </div>

      <ol className="space-y-10">
        {pop.passos.map((step) => (
          <StepBlock key={step.numero} step={step} anchor={stepId(pop, step)} />
        ))}
      </ol>

      {pop.passos.some((s) => s.videoUrl) && null}
    </section>
  );
}

function StepBlock({ step, anchor }: { step: Step; anchor: string }) {
  return (
    <li id={anchor} data-anchor className="scroll-mt-24">
      <div className="flex gap-4 sm:gap-5">
        <div
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-graphite text-sm font-semibold text-primary-foreground shadow-sm"
        >
          {step.numero}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {step.titulo}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {step.descricao}
          </p>

          {(step.imagemUrl || step.imagemTipo) && (
            <div className="mt-5">
              <MediaViewer url={step.imagemUrl} tipo={step.imagemTipo} alt={step.titulo} />
            </div>
          )}

          <VideoEmbed url={step.videoUrl} />
        </div>
      </div>
    </li>
  );
}

// -------------------------------------------
// FUNÇÕES UTILITÁRIAS (IDs PARA O ÍNDICE)
// -------------------------------------------
function popId(pop: Pop) {
  return `pop-${pop.codigo.toLowerCase()}`;
}
function stepId(pop: Pop, step: Step) {
  return `pop-${pop.codigo.toLowerCase()}-passo-${step.numero}`;
}
function secaoId(index: number) {
  return `secao-${index}`;
}