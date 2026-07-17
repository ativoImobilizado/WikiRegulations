import { Normativa } from '../normativas/types';

// 1. Reexporta tipos para manter compatibilidade com componentes que usem as interfaces
export * from '../normativas/types';

// 2. Mágica do Vite: Varre a pasta 'arquivos' coletando os módulos
const modulosArquivos = import.meta.glob<{ [key: string]: Normativa }>('./arquivos/*.ts', { eager: true });

// 3. Extrai as constantes internas de cada arquivo e monta o array unificado
export const NORMATIVAS: Normativa[] = Object.values(modulosArquivos).flatMap((modulo) => {
  return Object.values(modulo).filter(
    (item): item is Normativa => typeof item === 'object' && item !== null && 'codigo' in item
  );
});

/* --------------------------------------------------------------------------
 *   HELPERS ORIGINAIS (Inalterados, operando sobre a nova base dinâmica)
 * ------------------------------------------------------------------------ */

export function getCategorias(): string[] {
  return Array.from(new Set(NORMATIVAS.map((n) => n.categoria)));
}

export function findNormativa(codigo: string): Normativa | undefined {
  return NORMATIVAS.find((n) => n.codigo.toLowerCase() === codigo.toLowerCase());
}


export function searchNormativas(query: string): Normativa[] {
  const q = query.trim().toLowerCase();
  if (!q) return NORMATIVAS;
  
  return NORMATIVAS.filter((n) => {
    // 1. Extrai os textos dos POPs de forma segura (se não existir, usa array vazio [])
    const popsText = (n.pops || []).flatMap((p) => [
      p.codigo,
      p.titulo,
      p.objetivo,
      ...p.passos.flatMap((s) => [s.titulo, s.descricao]),
    ]);

    // 2. Extrai os textos das Seções de forma segura (se não existir, usa array vazio [])
    const secoesText = (n.secoes || []).flatMap((s) => [
      s.titulo,
      ...s.paragrafos
    ]);

    // 3. Junta tudo no haystack sem chamar n.pops diretamente aqui dentro
    const haystack = [
      n.codigo,
      n.titulo,
      n.descricao,
      n.categoria,
      ...secoesText,
      ...popsText,
    ]
      .join(" ")
      .toLowerCase();
      
    return haystack.includes(q);
  });
}
// export function searchNormativas(query: string): Normativa[] {
//   const q = query.trim().toLowerCase();
//   if (!q) return NORMATIVAS;
//   return NORMATIVAS.filter((n) => {
//    const popsText = (n.pops || []).flatMap((p) => [
//       p.codigo,
//       p.titulo,
//       p.objetivo,
//       ...p.passos.flatMap((s) => [s.titulo, s.descricao]),
//     ]);
//    const secoesText = (n.secoes || []).flatMap((s) => [
//       s.titulo,
//       ...s.paragrafos
//     ]);
   
   
   
//     const haystack = [
//       n.codigo,
//       n.titulo,
//       n.descricao,
//       n.categoria,
//       ...secoesText,
//       ...popsText,
//       ...n.pops.flatMap((p) => [
//         p.codigo,
//         p.titulo,
//         p.objetivo,
//         ...p.passos.flatMap((s) => [s.titulo, s.descricao]),
//       ]),
//     ]
//       .join(" ")
//       .toLowerCase();
//     return haystack.includes(q);
//   });
// }
