# Central de Normativas e POPs — RedeCompras

Portal corporativo interno para consulta de **Normativas** e **Procedimentos Operacionais Padrão (POPs)** utilizados no CD da RedeCompras (ERP Consinco + Harpia WMS).

Este documento é o **manual do administrador**. Todo o conteúdo do portal é lido dinamicamente de um único arquivo de dados — nada é escrito dentro dos componentes visuais. Ou seja: para incluir uma nova normativa, um novo POP ou um novo passo, **basta editar um arquivo TypeScript**. Você não precisa saber React.

---

## 📁 Onde fica o conteúdo?

```
src/data/normativas.ts
```

Esse é o **único** arquivo que você precisa editar para publicar novos procedimentos.
A estrutura é hierárquica:

```
Categoria
  └── Normativa (NGL-XXX)
        └── POP (POP-XXX)
              └── Passo (1, 2, 3…)
                    ├── Print/imagem (PC ou Coletor)
                    └── Vídeo (opcional)
```

---

## 🧱 Estrutura do arquivo `normativas.ts`

Cada normativa é um objeto dentro do array `NORMATIVAS`. O molde é sempre este:

```ts
{
  codigo: "NGL-001",             // Código único da normativa
  categoria: "Recebimento",       // Categoria (agrupa cards na home)
  titulo: "Recebimento de Mercadorias no CD",
  descricao: "Resumo curto que aparece no card e no topo da doc.",
  pops: [
    {
      codigo: "POP-001",
      titulo: "Conferência Cega de Notas Fiscais",
      objetivo: "Frase única que descreve o objetivo do POP.",
      passos: [
        {
          numero: 1,
          titulo: "Título curto do passo",
          descricao: "Texto explicativo do que o operador deve fazer.",
          imagemUrl: "/prints/pop-001-passo-1.png",
          imagemTipo: "pc",       // "pc" (16:9) ou "coletor" (9:16)
          videoUrl: "",           // Opcional. Se vazio, o player não aparece.
        },
      ],
    },
  ],
}
```

---

## A) ➕ Adicionar uma **nova categoria de processos**

Categorias **não** são cadastradas separadamente — elas surgem automaticamente a partir do campo `categoria` das normativas.

**Como criar uma nova categoria:**

1. Abra `src/data/normativas.ts`.
2. Em qualquer normativa nova (ou existente), preencha `categoria` com o nome da nova categoria, exatamente como quer que apareça na tela:
   ```ts
   categoria: "Devoluções",
   ```
3. Salve. A home passará a exibir automaticamente a seção **DEVOLUÇÕES** agrupando todas as normativas com essa categoria.

> ⚠️ Cuidado com maiúsculas/minúsculas e acentos. `"Devoluções"` e `"devolucoes"` viram **duas** categorias diferentes.

---

## B) ➕ Inserir uma **nova Normativa do zero**

1. Abra `src/data/normativas.ts`.
2. Vá até o array `NORMATIVAS = [ ... ]`.
3. Adicione um novo objeto **antes do `]` final**, seguindo este molde e sem esquecer da vírgula:

```ts
{
  codigo: "NGL-010",
  categoria: "Devoluções",
  titulo: "Devolução de Mercadoria ao Fornecedor",
  descricao: "Fluxo completo de tratativa de itens devolvidos ao fornecedor.",
  pops: [], // Pode começar vazio e ir preenchendo depois.
},
```

4. Salve o arquivo. O card já aparecerá na home, na categoria "Devoluções", com contador **"0 POPs"**.

> 🧠 Regras rápidas:
> - `codigo` deve ser **único** em todo o arquivo (`NGL-010` só pode existir uma vez).
> - `titulo` e `descricao` são obrigatórios.
> - `pops: []` é obrigatório mesmo que ainda esteja vazio.

---

## C) ➕ Adicionar um **novo POP dentro de uma normativa existente**

1. Localize a normativa desejada no arquivo (`Ctrl+F` pelo código, ex.: `NGL-001`).
2. Dentro do array `pops: [ ... ]` daquela normativa, adicione um novo objeto:

```ts
{
  codigo: "POP-003",
  titulo: "Bloqueio de mercadoria avariada",
  objetivo: "Isolar fisicamente e sistemicamente itens com avaria detectada no recebimento.",
  passos: [
    {
      numero: 1,
      titulo: "Sinalizar avaria no coletor",
      descricao: "No Harpia, dentro da tarefa de conferência, aponte o item como avariado.",
      imagemUrl: "/prints/pop-003-passo-1.png",
      imagemTipo: "coletor",
    },
    {
      numero: 2,
      titulo: "Registrar bloqueio no Consinco",
      descricao: "Acesse Estoque → Bloqueios e vincule o motivo 'Avaria de transporte'.",
      imagemUrl: "/prints/pop-003-passo-2.png",
      imagemTipo: "pc",
      videoUrl: "https://www.youtube.com/watch?v=EXEMPLO",
    },
  ],
},
```

3. Salve. O POP aparecerá automaticamente:
   - no **contador de POPs** do card da normativa;
   - no **índice lateral** da página de documentação;
   - na **coluna central** de leitura, com scrollspy funcionando.

> 🧠 Regras:
> - Os `numero` dos passos devem ser **sequenciais** (1, 2, 3…) dentro do mesmo POP.
> - `imagemTipo` só aceita dois valores: `"pc"` ou `"coletor"`. Qualquer outro valor é ignorado e cai no padrão PC.

---

## D) 🖼️ Atualizar links de **imagens (prints)** e 🎬 **vídeos**

### Imagens

Existem duas formas de servir imagens:

**1. Arquivo local (recomendado)**
- Salve o print em `public/prints/` (crie a pasta se não existir).
- Referencie com caminho iniciado por `/`:
  ```ts
  imagemUrl: "/prints/pop-001-passo-1.png",
  ```

**2. URL externa**
- Cole o link direto (S3, CDN corporativa, etc.):
  ```ts
  imagemUrl: "https://cdn.redecompras.com/prints/pop-001-passo-1.png",
  ```

Regra crítica: **sempre defina o `imagemTipo` correto.**

| Tipo         | Origem do print               | Proporção forçada | Uso                                    |
| ------------ | ----------------------------- | ----------------- | -------------------------------------- |
| `"pc"`       | ERP Consinco (tela do PC)     | `16:9`            | Larguras totais da tela do computador. |
| `"coletor"`  | Harpia WMS (coletor Android)  | `9:16`            | Simula a tela vertical do coletor.     |

O portal cuida automaticamente do enquadramento, do zoom por clique (lightbox) e do fallback quando `imagemUrl` está vazio.

### Vídeos

- Deixe `videoUrl: ""` para **não exibir** player naquele passo.
- Formatos aceitos:
  - **YouTube**: `https://www.youtube.com/watch?v=ID` ou `https://youtu.be/ID` → o player é embutido automaticamente.
  - **Arquivo direto**: `.mp4`, `.webm`, `.ogg` → renderizado com `<video>` nativo.
  - **Vimeo/outros embeds**: cole a URL de `embed` direta.

---

## E) 📐 Padrão recomendado de mídias

Para manter o portal leve mesmo com 80+ normativas, siga estes limites:

### Imagens

| Tipo        | Formato preferido      | Resolução máxima | Peso máximo por imagem |
| ----------- | ---------------------- | ---------------- | ---------------------- |
| `"pc"`      | **WebP** (fallback PNG) | 1600 × 900 px    | **≤ 250 KB**           |
| `"coletor"` | **WebP** (fallback PNG) | 720 × 1280 px    | **≤ 180 KB**           |

Recomendações:
- Comprima com [Squoosh](https://squoosh.app) (qualidade WebP 75–82).
- **Nunca** use PNG bruto direto do "Print Screen" (chegam a 3–5 MB).
- Recorte apenas a área útil da tela — não capture a barra de tarefas do Windows.
- Nomeie de forma previsível: `pop-001-passo-1.webp`.

### Vídeos

- **Prefira YouTube "não listado"** hospedado numa conta corporativa. Isso mantém o portal leve (o streaming é feito pelo YouTube).
- Se precisar hospedar arquivo direto: **MP4 H.264**, até **10 MB**, resolução **720p**, duração **≤ 60s**.
- Sempre grave em orientação horizontal (16:9), mesmo quando o procedimento é feito no coletor — o player é 16:9.

### Boas práticas gerais

- Faça **um passo = uma ideia**. Se um passo precisa de 3 prints, provavelmente são 3 passos.
- Mantenha `descricao` em **1–3 frases**. Textos longos matam a escaneabilidade.
- Revise `codigo` de normativas e POPs antes de publicar — o sistema **não** avisa se houver duplicados.

---

## 🧪 Como testar depois de editar

1. Salve o arquivo `src/data/normativas.ts`.
2. O preview recarrega automaticamente.
3. Verifique:
   - a home lista o novo card na categoria correta;
   - o contador de POPs bate;
   - clicando no card, o índice lateral mostra o novo POP e seus passos;
   - o print aparece com a proporção correta e amplia ao clicar;
   - o vídeo, se houver, carrega ao final do passo.

Se algo não aparecer, quase sempre é uma vírgula esquecida ou um `imagemTipo` escrito errado. O console do navegador (`F12`) mostra o erro exato de sintaxe.

---

## 🎨 Identidade visual

O tema segue a paleta corporativa **cinza grafite + off-white + azul marinho/ardósia**, definida em `src/styles.css` via tokens semânticos (`--graphite`, `--brand`, `--background`, etc.). Não altere cores diretamente nos componentes — se precisar ajustar a paleta, edite apenas os tokens.
#   W i k i R e g u l a t i o n s  
 