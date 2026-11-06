<p align="center">
  <img src="docs/icon.svg" width="128" height="128" alt="Ícone da Azure PR Review Keys">
</p>

<h1 align="center">Azure PR Review Keys</h1>

<p align="center">
  Revê pull requests no Azure DevOps sem largar o teclado.<br>
  <kbd>⌘</kbd><kbd>↓</kbd> para a próxima alteração, <kbd>⌘</kbd><kbd>Enter</kbd> para o próximo ficheiro. Pronto.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white" alt="Chrome, Manifest V3">
  <img src="https://img.shields.io/badge/Azure%20DevOps-Repos-0078D4?logo=azuredevops&logoColor=white" alt="Azure DevOps Repos">
  <img src="https://img.shields.io/badge/permiss%C3%B5es-nenhuma-2FB57A" alt="Sem permissões">
  <a href="LICENSE"><img src="https://img.shields.io/badge/licen%C3%A7a-MIT-blue" alt="Licença MIT"></a>
</p>

<p align="center">
  <img src="docs/hero.svg" alt="O separador Files de um PR no Azure DevOps, com um bloco alterado realçado, as teclas ⌘ e ↓ e o aviso «Marcado. A seguir: routes.ts»" width="840">
</p>

A Azure PR Review Keys é uma extensão do Chrome para quem passa o dia a rever PRs no Azure DevOps. Em vez de andar com o rato à procura da próxima alteração e do visto de cada ficheiro, saltas de bloco em bloco com as setas e fechas cada ficheiro com um <kbd>⌘</kbd><kbd>Enter</kbd>, que te leva logo ao seguinte por rever. É um único script, sem permissões, sem dependências e sem pedidos de rede.

## Funcionalidades

- **Alteração seguinte e anterior.** Salta entre os blocos alterados; no fim de um ficheiro, passa ao seguinte.
- **Marcar e seguir.** <kbd>⌘</kbd><kbd>Enter</kbd> marca o ficheiro como revisto e abre o próximo que ainda não reviste, saltando os que já estão marcados.
- **Desmarcar.** Num ficheiro já revisto, o mesmo atalho tira-lhe o visto.
- **Os dois modos do separador Files:** um ficheiro de cada vez ou todos os ficheiros seguidos.
- **Não atrapalha.** Enquanto escreves um comentário, os atalhos ficam desligados e o <kbd>⌘</kbd><kbd>Enter</kbd> continua a publicar o comentário.
- **Mostra o que fez:** o bloco atual fica marcado com uma barra azul, e um aviso discreto confirma cada ficheiro marcado.

## Atalhos

| macOS | Windows / Linux | O que faz |
| --- | --- | --- |
| <kbd>⌘</kbd><kbd>↓</kbd> | <kbd>Ctrl</kbd><kbd>↓</kbd> | Alteração seguinte; no fim do ficheiro, passa ao seguinte |
| <kbd>⌘</kbd><kbd>↑</kbd> | <kbd>Ctrl</kbd><kbd>↑</kbd> | Alteração anterior |
| <kbd>⌘</kbd><kbd>Enter</kbd> | <kbd>Ctrl</kbd><kbd>Enter</kbd> | Marca como revisto e abre o próximo ficheiro por rever (ou desmarca, se já estava) |

Funcionam no separador **Files** de qualquer PR em `dev.azure.com` e `*.visualstudio.com`.

## Instalar

A extensão não está na Chrome Web Store; instala-se a partir do código.

```bash
git clone https://github.com/gustavos00/azure-pr-review-keys.git
```

1. Abre `chrome://extensions`.
2. Liga o **Developer mode**, no canto superior direito.
3. Clica em **Load unpacked** e escolhe a pasta `azure-pr-review-keys`.
4. Recarrega a página do PR.

Para atualizar, faz `git pull` na pasta e carrega no ↻ da extensão em `chrome://extensions`.

Funciona também no Edge, no Brave, no Arc e noutros browsers baseados em Chromium.

## Usar

1. Abre um PR e vai ao separador **Files**.
2. Clica no primeiro ficheiro da árvore à esquerda.
3. <kbd>⌘</kbd><kbd>↓</kbd> até ao fim das alterações do ficheiro.
4. <kbd>⌘</kbd><kbd>Enter</kbd>: o ficheiro fica revisto e abre-se o próximo por rever.
5. Repete até o aviso dizer *Não há mais ficheiros por rever*.

> Também funciona com a raiz ou uma pasta selecionada (todos os ficheiros seguidos), mas aí o <kbd>⌘</kbd><kbd>Enter</kbd> só consegue marcar um ficheiro cujo nome esteja visível na árvore. Com um ficheiro de cada vez isso não acontece.

## Como funciona

| Peça | Como |
| --- | --- |
| Um ficheiro aberto | Usa os botões *Previous / Next difference* do próprio Azure, que já atravessam ficheiros |
| Todos os ficheiros | Encontra os blocos alterados nos cartões de diff; quando acaba o que está carregado, desce a página para o Azure carregar mais |
| Marcar como revisto | Carrega no visto *Mark as reviewed* da linha do ficheiro na árvore |
| Próximo por rever | Percorre a árvore a partir do ficheiro atual, descendo o scroll porque o Azure só desenha as linhas visíveis |
| Teclado | Um `keydown` em captura na janela, que ignora campos de texto |

Tudo isto depende da estrutura da página do Azure DevOps. Se a Microsoft a mudar, os atalhos podem deixar de funcionar até serem ajustados.

## Privacidade

A extensão não pede permissões, não guarda nada e não faz pedidos de rede. O `content.js` só corre nas páginas do Azure DevOps e só reage às três teclas acima.

## Estrutura

```
manifest.json   declaração da extensão (Manifest V3)
content.js      atalhos e navegação
docs/           ícone e imagem do README
```

## Licença

[MIT](LICENSE) © Gustavo Santos
