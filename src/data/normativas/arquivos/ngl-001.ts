import { Normativa } from '../types';

export const ngl001: Normativa = {
  codigo: "NGL-001",
  categoria: "Logística e Supply Chain",
  titulo: "Normativa Geral de Operações Logísticas e Supply Chain",
  tipo: "POP", // Sinaliza para o frontend que isso é um passo a passo
  descricao: "Diretrizes mestre e procedimentos padronizados que regem o fluxo de mercadorias no CD, desde o check-in de docas até o ressuprimento automático.",
  pops: [
    {
      codigo: "POP-LOG-001",
      titulo: "Check-in de Docas e Conferência Cega de Entrada",
      objetivo: "Padronizar o recebimento físico de cargas utilizando regras de conferência cega (Blind Receiving) para prevenção de fraudes e rupturas.",
      passos: [
        {
          numero: 1,
          titulo: "Check-in de Pátio e Destinação de Doca",
          descricao: "O Supervisor de Docas recepciona o veículo liberado pelo setor de RM e define em qual canal físico o motorista realizará o encosto. É proibido compartilhar dados fiscais com a pista.",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 2,
          titulo: "Abertura da Carga no Coletor de Dados",
          descricao: "O conferente escalado abre o terminal portátil, efetua login no módulo Harpia WMS, acessa a ferramenta 'Buscar Carga' e dá início à coleta.",
          imagemUrl: "",
          imagemTipo: "coletor"
        },
        {
          numero: 3,
          titulo: "Execução da Conferência Cega e Unitização",
          descricao: "Bipe o código EAN de cada volume retirado do veículo. Os operadores devem organizar e aplicar o filme stretch nos paletes seguindo estritamente a Norma Pallet.",
          imagemUrl: "",
          imagemTipo: "coletor"
        },
        {
          numero: 4,
          titulo: "Tratamento de Divergências Sistêmicas",
          descricao: "Caso o Harpia WMS acuse divergência de quantidades, o conferente não saberá o item divergente. Ele deve reiniciar obrigatoriamente a Segunda Conferência Cega.",
          imagemUrl: "",
          imagemTipo: "coletor"
        }
      ]
    },
    {
      codigo: "POP-LOG-005",
      titulo: "Parametrização de Lotes de Abastecimento Automático",
      objetivo: "Padronizar a criação e parametrização dos lotes de abastecimento automático no ERP Consinco, garantindo que as regras de ressuprimento reflitam com exatidão as definições estratégicas acordadas entre os setores Operacional, Logístico e Comercial.",
      passos: [
        {
          numero: 1,
          titulo: "Acesso ao Módulo de Compras",
          descricao: "Abra o ERP Consinco e, no painel principal, localize o Módulo Comercial. Dentro dele, clique para acessar as ferramentas do Módulo Compras.",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 2,
          titulo: "Troca de Empresa Expedidora",
          descricao: "No menu superior, vá em Arquivo → Trocar Empresa (ou utilize o atalho de teclado Ctrl + Shift + T). Selecione a filial/empresa que atuará como a expedidora (a que enviará as mercadorias).",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 3,
          titulo: "Navegação até a Tela de Abastecimento",
          descricao: "Após validar que a empresa ativa no topo do sistema está correta, navegue no menu principal seguindo o caminho: Administração → Abastecimento Automático.",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 4,
          titulo: "Identificação e Tipo do Lote",
          descricao: "Com a tela de parametrização aberta, localize o campo Descritivo e insira o nome padrão de identificação do lote. No campo Tipo do Lote, selecione obrigatoriamente a opção Modelo.",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 5,
          titulo: "Definição de Validade do Lote",
          descricao: "Determine o período de vigência no campo Validade do Lote. Insira a data exata que foi definida e aprovada previamente em consenso entre as lideranças de Operações, Logística e Comercial.",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 6,
          titulo: "Definição de Divisões e Lojas Destino",
          descricao: "No campo Divisões, marque as caixas Atacado, Varejo ou ambas, conforme a estratégia. No painel inferior de filiais, selecione as lojas que receberão o estoque na coluna da esquerda e transfira-as para a direita.",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 7,
          titulo: "Configuração dos Parâmetros de Cálculo",
          descricao: "No campo 'Abastecimento Até', mantenha o padrão 'Conforme classificação de abastecimento' (ou altere o horizonte de cobertura se acordado em reunião). No campo 'Tipo de Média', mantenha a opção 'Normal' (ou 'Exceto Promoções' para itens sensíveis a picos).",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 8,
          titulo: "Parametrização das Regras de Estoque (Checkboxes)",
          descricao: "Marque obrigatoriamente as opções: 'Considerar estoque min e máximo' e 'Utiliza arredondamento de Qtde Transf por Emb.Compra'. Mantenha DESMARCADAS as caixas de estoque negativo, apenas estoque suficiente, sugestão promocional e produto substituto.",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 9,
          titulo: "Configuração da Agenda de Geração",
          descricao: "Acesse a aba 'Agenda de Geração' para marcar os dias da semana e o horário em que o lote rodará. Atenção Crítica: Garanta total coerência entre os dias marcados na agenda e o período de cobertura escolhido no passo 7 para evitar rupturas nas lojas.",
          imagemUrl: "",
          imagemTipo: "pc"
        },
        {
          numero: 10,
          titulo: "Seleção de Filtros e Salvamento do Lote",
          descricao: "Clique no ícone de Filtros e selecione todas as categorias de forma padrão. Vá até a aba Opções, valide se as redundâncias sistêmicas estão desativadas por padrão e clique em Concluir para salvar definitivamente o lote no ERP.",
          imagemUrl: "",
          imagemTipo: "pc"
        }
      ]
    }
  ]
};