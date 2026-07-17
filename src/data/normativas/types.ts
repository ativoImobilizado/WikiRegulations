export type StepImageType = "pc" | "coletor";

export interface Step {
  numero: number;
  titulo: string;
  descricao: string;
  imagemUrl?: string;
  imagemTipo?: StepImageType;
  videoUrl?: string;
}

export interface Pop {
  codigo: string; // Ex.: "POP-LOG-001"
  titulo: string;
  objetivo: string;
  passos: Step[];
}

export interface Normativa {
  codigo: string; 
  titulo: string;
  descricao: string;
  categoria: string;
  
  // NOVO: Define como o React vai renderizar essa página
  tipo: "POP" | "DIRETRIZ"; 
  
  // Ambos passam a ser opcionais. 
  // Se for POP, usa 'pops'. Se for DIRETRIZ, usa 'secoes'.
  pops?: Pop[];
  secoes?: Secao[]; 
}
// NOVO: Estrutura para Normativas de Texto Livre (Diretrizes/Políticas)
export interface Secao {
  titulo: string;
  // Usar um array de strings permite que cada item seja um parágrafo (<p>) na tela, 
  // mantendo a formatação e as quebras de linha perfeitas.
  paragrafos: string[]; 
}