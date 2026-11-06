# Azure PR Review Keys

Atalhos de teclado para rever PRs no separador **Files** do Azure DevOps.

| Atalho | Ação |
| --- | --- |
| ⌘ + ↓ | Alteração seguinte (no fim do ficheiro, passa ao seguinte) |
| ⌘ + ↑ | Alteração anterior |
| ⌘ + Enter | Marca / desmarca o ficheiro atual como revisto |

No Windows/Linux é Ctrl em vez de ⌘. Os atalhos não atuam enquanto escreves num comentário.

## Instalar

1. Abre `chrome://extensions`
2. Liga o **Developer mode** (canto superior direito)
3. **Load unpacked** → escolhe esta pasta
4. Recarrega a página do PR

## Como funciona

- **Com um ficheiro aberto**, usa os botões "Previous/Next difference" do próprio Azure, e o visto "Mark as reviewed" da linha selecionada na árvore.
- **Com uma pasta ou a raiz aberta** (todos os ficheiros em cartões), salta entre blocos alterados; quando acaba o que está carregado, faz scroll para o Azure carregar mais. O ficheiro atual é o cartão no topo do ecrã; para o marcar, a linha dele tem de estar visível na árvore à esquerda.
