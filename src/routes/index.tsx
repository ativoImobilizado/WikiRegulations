import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, FileText, ArrowRight, Layers } from "lucide-react";
import { NORMATIVAS, searchNormativas, type Normativa } from "@/data/normativas";
import { BrandHeader } from "@/components/BrandHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Central de Normativas e POPs · RedeCompras" },
      {
        name: "description",
        content:
          "Portal corporativo com todas as normativas, POPs e procedimentos operacionais da RedeCompras.",
      },
      { property: "og:title", content: "Central de Normativas e POPs · RedeCompras" },
      {
        property: "og:description",
        content: "Consulta centralizada de normativas e POPs operacionais.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchNormativas(query), [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Normativa[]>();
    for (const n of results) {
      const arr = map.get(n.categoria) ?? [];
      arr.push(n);
      map.set(n.categoria, arr);
    }
    return Array.from(map.entries());
  }, [results]);

  // CORREÇÃO 1: Adicionado o ?. para proteger o código caso não existam pops
  const totalPops = NORMATIVAS.reduce((acc, n) => acc + (n.pops?.length || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />

      <section className="border-b border-border/70 bg-gradient-to-b from-secondary/60 to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <Layers className="h-3.5 w-3.5" />
            <span>Documentação Operacional Interna</span>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Normativas e POPs Grupo RedeCompras.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Busque, consulte e execute os procedimentos padrão do CD com clareza —
            desde o recebimento no Consinco até a separação pelo coletor Harpia.
          </p>

          <div className="mt-8 flex max-w-2xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm ring-1 ring-transparent transition focus-within:border-ring focus-within:ring-ring/30">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código (NGL-001), título, POP ou palavra-chave…"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <span className="hidden shrink-0 rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline">
              {results.length} resultado{results.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">{NORMATIVAS.length}</strong> normativas
            </span>
            <span>
              <strong className="text-foreground">{totalPops}</strong> POPs ativos
            </span>
            <span>
              <strong className="text-foreground">{new Set(NORMATIVAS.map(n => n.categoria)).size}</strong> categorias
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {grouped.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma normativa encontrada para "<span className="text-foreground">{query}</span>".
            </p>
          </div>
        ) : (
          grouped.map(([categoria, items]) => (
            <section key={categoria} className="mb-12 last:mb-0">
              <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">
                  {categoria}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {items.length} normativa{items.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((n) => (
                  <NormativaCard key={n.codigo} n={n} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <footer className="border-t border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} RedeCompras · Central de Normativas &amp; POPs — uso interno.
        </div>
      </footer>
    </div>
  );
}

function NormativaCard({ n }: { n: Normativa }) {
  // CORREÇÃO 2: Inteligência para exibir "POPs" ou "Seções" dependendo do tipo do documento
  const isPop = n.tipo === "POP" || !n.tipo;
  const count = isPop ? (n.pops?.length || 0) : (n.secoes?.length || 0);
  const label = isPop ? (count === 1 ? "POP" : "POPs") : (count === 1 ? "Seção" : "Seções");

  return (
    <Link
      to="/n/$codigo"
      params={{ codigo: n.codigo }}
      className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-graphite/40 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-graphite px-2 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground">
          {n.codigo}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <FileText className="h-3 w-3" />
          {count} {label}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground">
        {n.titulo}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.descricao}</p>
      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-graphite transition-colors group-hover:text-foreground">
        Abrir documentação
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}