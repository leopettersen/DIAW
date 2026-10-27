# Pokédex — React TypeScript

Pokédex interativa desenvolvida com React, TypeScript e Vite.

## Funcionalidades

- **Lista de Pokémon** com ID, nome, tipos, HP, Ataque, Defesa, Atq. Esp., Def. Esp. e Velocidade
- **Pesquisa** por nome ou ID, atualizada enquanto o usuário digita
- **Filtro por tipo** (com opção "Typeless")
- **Ordenação** na aba Pokémon por ID, Nome, HP, Attack, Defense, Special Attack, Special Defense ou Speed (padrão: ID)
- **Botão Aleatório**: abre o modal com um Pokémon sorteado da lista completa
- **Detalhes do Pokémon** em modal, com barras de atributos e total
- **Favoritos**: botão de coração nos cards para adicionar/remover dos favoritos. A aba **Favoritos** exibe apenas os Pokémon marcados. Os favoritos são mantidos em estado durante a sessão (gerenciados pelo `App.tsx`).
- **Comparação**: aba **Comparar** com seleção de até 4 Pokémon via busca. Exibe gráfico radar com Chart.js (react-chartjs-2), sem valores numéricos nas linhas, com tooltip ao passar o mouse. Os cards selecionados aparecem com botão "X" para remoção.
- **Aba de Treinadores** com nome, quantidade de insígnias e Pokémon de cada um (clique no Pokémon para ver os detalhes). Exibe avatar do treinador (sprites do Pokémon Showdown) com estilo "visor", com fallback para monograma.
- **Tema claro/escuro** com alternância, persistido no `localStorage` (`tema`)
- **Background com imagem holográfica** (`src/assets/images/holo-fundo.webp`), adaptado para ambos os temas
- **Cards com estilo "visor"** para imagens de Pokémon (baseado no estilo dos avatares de treinadores)
- **Layout responsivo** e cores associadas aos tipos

## Como executar

Pré-requisito: Node.js instalado.

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

Na primeira carga a aplicação busca os Pokémon na API, então a lista pode levar alguns segundos para aparecer.

## Decisões de projeto

- **Separação por páginas**: `src/pages/Pokedex.tsx`, `src/pages/Treinadores.tsx`, `src/pages/Favoritos.tsx` e `src/pages/Comparar.tsx`. O `App.tsx` gerencia a aba ativa e compartilha estados/funções via props.
- **Gerenciamento de favoritos**: `App.tsx` mantém array `pokemons` com campo `favorito: boolean` (inicializado como `false` no hook). A função `alternarFavorito(id)` atualiza o estado. Não há persistência em `localStorage` para favoritos (apenas tema é persistido).
- **Carregamento de dados**: `useCarregarPokemons()` busca todos os Pokémon da PokéAPI (`limit=1351`) em lotes de 50 com `Promise.all`, normaliza para o tipo `Pokemon`, extrai tipos únicos e carrega treinadores do JSON local.
- **Componentização**: `CardPokemon` centraliza exibição do card com suporte a modo comparação (`emComparacao`) e ação de favorito/remover. `BotaoAleatorio` sorteia e abre modal via callback.
- **Gráfico de comparação**: Chart.js com escala radial. `ticks.display: false` e `showLabelBackdrop: false` para ocultar valores numéricos; dados mostrados via tooltip.
- **Avatares estilizados**: CSS com `radial-gradient` + `linear-gradient` e `box-shadow` inset para simular "visor", aplicado a treinadores e Pokémon.

## Dados

- **Pokémon:** buscados na [PokéAPI](https://pokeapi.co/). O hook `src/hooks/carregarPokemons.ts` consulta `https://pokeapi.co/api/v2/pokemon?limit=1351&offset=0` e, em seguida, os detalhes de cada Pokémon em lotes de 50 requisições (`Promise.all`).
- **Imagens:** `sprites.other["official-artwork"].front_default`, com fallback para `sprites.front_default`.
- **Treinadores:** lidos do arquivo `src/data/pokedex-data.json` via `import()` dinâmico (acessando `json.default.trainers`).
- **Tipos:** extraídos dos Pokémon carregados via `extrairTipos()` (ordenados por id). Mapa de cores em `src/types/index.ts`.
- **Avatares de treinadores:** buscados em `https://play.pokemonshowdown.com/sprites/trainers/` com mapeamento por nome e fallback para monograma.

## Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm run preview  # preview do build
```

## Organização

```text
src/
├── assets/
│   └── images/
│       └── holo-fundo.webp
├── components/
│   ├── BarraBusca.tsx
│   ├── BotaoAleatorio.tsx
│   ├── Cabecalho.tsx
│   ├── CardPokemon.tsx
│   ├── DetalhesPokemon.tsx
│   ├── FiltroTipos.tsx
│   ├── ImagemPokemon.tsx
│   ├── ListaFavoritos.tsx
│   ├── ListaPokemons.tsx
│   └── ListaTreinadores.tsx
├── css/
│   ├── App.css
│   ├── CardPokemon.css
│   ├── DetalhesPokemon.css
│   ├── ListaFavoritos.css
│   ├── ListaPokemons.css
│   ├── ListaTreinadores.css
│   └── index.css
├── data/
│   └── pokedex-data.json
├── hooks/
│   └── carregarPokemons.ts
├── pages/
│   ├── Comparar.tsx
│   ├── Favoritos.tsx
│   ├── Pokedex.tsx
│   └── Treinadores.tsx
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

- `App.tsx`: controla abas, tema (persistido no `localStorage`), busca, filtro por tipo, ordenação, Pokémon selecionado e estado global de favoritos
- `pages/`: páginas por aba com props compartilhadas
- `components/CardPokemon.tsx`: card com visor de imagem, stats, botão de favorito/X para comparação
- `pages/Comparar.tsx`: seleção e gráfico radar com Chart.js
- `hooks/carregarPokemons.ts`: carregamento da PokéAPI e JSON local
- `types/index.ts`: interfaces, paleta de cores, helpers e tipos
- `css/`: estilos com variáveis CSS para temas claro/escuro