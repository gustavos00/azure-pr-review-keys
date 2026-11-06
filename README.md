# Azure PR Review Keys

Extensão do Chrome que permite rever pull requests no **Azure DevOps** sem largar o teclado: saltar de alteração em alteração e marcar cada ficheiro como revisto.

## Atalhos

| Atalho (macOS) | Atalho (Windows / Linux) | Ação |
| --- | --- | --- |
| `⌘` `↓` | `Ctrl` `↓` | Vai para a alteração seguinte; no fim do ficheiro, passa ao seguinte |
| `⌘` `↑` | `Ctrl` `↑` | Volta à alteração anterior |
| `⌘` `Enter` | `Ctrl` `Enter` | Marca o ficheiro atual como revisto (ou desmarca, se já estiver) |

Funcionam no separador **Files** de qualquer PR em `dev.azure.com` ou `*.visualstudio.com`.

Enquanto escreves um comentário, os atalhos ficam desligados: o `⌘ Enter` continua a publicar o comentário, como no Azure.

## Instalação

A extensão não está na Chrome Web Store; instala-se a partir do código:

1. Descarrega o repositório:
   ```bash
   git clone https://github.com/gustavos00/azure-pr-review-keys.git
   ```
2. Abre `chrome://extensions` no Chrome.
3. Liga o **Developer mode** (canto superior direito).
4. Clica em **Load unpacked** e escolhe a pasta `azure-pr-review-keys`.
5. Recarrega a página do PR.

Para atualizar: `git pull` na pasta e clica no botão ↻ da extensão em `chrome://extensions`.

Também funciona em browsers baseados em Chromium (Edge, Brave, Arc).

## Como funciona

O separador **Files** do Azure tem dois modos, e a extensão adapta-se a cada um:

- **Um ficheiro aberto** (clicaste num ficheiro na árvore): usa os botões *Previous / Next difference* do próprio Azure, que percorrem as alterações e passam para o ficheiro seguinte quando acabam. O `⌘ Enter` marca o ficheiro selecionado na árvore.
- **Todos os ficheiros** (a raiz ou uma pasta selecionada): salta entre os blocos alterados de cada cartão. Quando chega ao fim do que já está carregado, desce a página para o Azure carregar mais ficheiros. O ficheiro atual é o cartão no topo do ecrã.

Cada salto destaca o bloco com uma barra azul à esquerda, e uma pequena mensagem confirma quando um ficheiro é marcado ou quando não há mais alterações.

## Limitações

- Na vista de todos os ficheiros, o `⌘ Enter` só consegue marcar o ficheiro se o nome dele estiver visível na árvore à esquerda (o Azure só desenha as linhas que se veem). Se não estiver, aparece um aviso; com um ficheiro aberto isto não acontece.
- A extensão depende da estrutura da página do Azure DevOps. Se a Microsoft mudar essa página, os atalhos podem deixar de funcionar até serem ajustados.

## Privacidade

A extensão não pede permissões, não guarda dados e não faz pedidos de rede. É um único script (`content.js`) que só corre nas páginas do Azure DevOps e só reage às três teclas acima.

## Estrutura

```
manifest.json   # declaração da extensão (Manifest V3)
content.js      # atalhos e navegação
```
