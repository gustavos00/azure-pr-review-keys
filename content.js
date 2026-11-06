// Atalhos para rever PRs no Azure DevOps (separador "Files").
//   Cmd/Ctrl + ↓      alteração seguinte
//   Cmd/Ctrl + ↑      alteração anterior
//   Cmd/Ctrl + Enter  marca o ficheiro como revisto e abre o próximo por rever
//                     (num ficheiro já revisto, desmarca-o)
//
// O separador "Files" tem dois modos:
//   - um ficheiro aberto: o Azure já tem os botões "Previous/Next difference"
//     (que saltam para o ficheiro seguinte no fim), por isso usamo-los;
//   - uma pasta (ou a raiz) aberta: um cartão por ficheiro, carregados à medida
//     que se faz scroll; aqui a navegação entre blocos alterados é nossa.

(() => {
  const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform);
  const TOP_OFFSET = 120;
  const LOAD_ATTEMPTS = 6;
  const LOAD_WAIT_MS = 500;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function isPullRequestFilesPage() {
    return /\/pullrequest\/\d+/.test(location.pathname);
  }

  function isTypingTarget(element) {
    if (!(element instanceof Element)) {
      return false;
    }

    // O diff de ficheiro único é um Monaco só de leitura, com uma textarea escondida.
    if (element.closest(".monaco-editor")) {
      return false;
    }

    return element.isContentEditable || element.matches("input, textarea, select");
  }

  function showToast(message) {
    let toast = document.getElementById("azprk-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "azprk-toast";
      Object.assign(toast.style, {
        position: "fixed",
        left: "50%",
        bottom: "24px",
        transform: "translateX(-50%)",
        background: "rgba(32, 31, 30, 0.92)",
        color: "#fff",
        font: "13px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "8px 14px",
        borderRadius: "6px",
        zIndex: "2147483647",
        pointerEvents: "none",
        transition: "opacity 200ms",
      });
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(() => {
      toast.style.opacity = "0";
    }, 1400);
  }

  function flashElement(element) {
    const previous = element.style.boxShadow;

    element.style.transition = "box-shadow 150ms";
    element.style.boxShadow = "inset 4px 0 0 #0078d4";
    setTimeout(() => {
      element.style.boxShadow = previous;
    }, 900);
  }

  // ---------- modo de ficheiro único ----------

  function getDiffButton(direction) {
    return document.getElementById(direction === "next" ? "__bolt-next-diff" : "__bolt-prev-diff");
  }

  function clickDiffButton(direction) {
    const button = getDiffButton(direction);

    if (button.getAttribute("aria-disabled") === "true" || button.disabled) {
      showToast(direction === "next" ? "Não há mais alterações" : "Já estás na primeira alteração");

      return;
    }

    button.click();
  }

  // ---------- modo de pasta (cartões) ----------

  function getViewer() {
    return document.querySelector(".repos-changes-viewer");
  }

  function isChangedRow(row) {
    return Boolean(row?.querySelector(".repos-line-content.added, .repos-line-content.removed"));
  }

  function getHunkStarts() {
    const rows = [...document.querySelectorAll(".repos-changes-viewer .repos-diff-contents-row")];

    return rows.filter((row, index) => {
      if (!isChangedRow(row)) {
        return false;
      }

      const previous = rows[index - 1];

      return !previous || previous.parentElement !== row.parentElement || !isChangedRow(previous);
    });
  }

  function getAnchorY(viewer) {
    return viewer.getBoundingClientRect().top + TOP_OFFSET;
  }

  function scrollToHunk(viewer, hunk) {
    viewer.scrollTop += hunk.getBoundingClientRect().top - getAnchorY(viewer);
    flashElement(hunk);
  }

  function findNextHunk(viewer, after) {
    const hunks = getHunkStarts();

    if (after && after.isConnected) {
      return hunks[hunks.indexOf(after) + 1];
    }

    const anchor = getAnchorY(viewer);

    return hunks.find((hunk) => hunk.getBoundingClientRect().top > anchor + 4);
  }

  async function goToNextHunk(viewer) {
    const next = findNextHunk(viewer);

    if (next) {
      scrollToHunk(viewer, next);

      return;
    }

    // Os cartões seguintes só carregam com scroll: descemos até ao fim e esperamos.
    const lastKnown = getHunkStarts().at(-1);

    for (let attempt = 0; attempt < LOAD_ATTEMPTS; attempt += 1) {
      const previousHeight = viewer.scrollHeight;

      viewer.scrollTop = viewer.scrollHeight;
      await sleep(LOAD_WAIT_MS);

      const loaded = findNextHunk(viewer, lastKnown);

      if (loaded) {
        scrollToHunk(viewer, loaded);

        return;
      }

      if (viewer.scrollHeight === previousHeight) {
        break;
      }
    }

    showToast("Não há mais alterações");
  }

  function goToPreviousHunk(viewer) {
    const anchor = getAnchorY(viewer);
    const previous = getHunkStarts()
      .filter((hunk) => hunk.getBoundingClientRect().top < anchor - 4)
      .at(-1);

    if (!previous) {
      showToast("Já estás na primeira alteração");

      return;
    }

    scrollToHunk(viewer, previous);
  }

  function getCurrentCardPath(viewer) {
    const anchor = getAnchorY(viewer);
    const cards = [...viewer.querySelectorAll(".repos-summary-header")];
    const current =
      cards.filter((card) => card.getBoundingClientRect().top <= anchor + 10).at(-1) ?? cards[0];

    return current?.querySelector(".bolt-card-expand-button")?.getAttribute("aria-label") ?? null;
  }

  // ---------- marcar como revisto ----------

  function getTreeRowName(row) {
    const leaf = [...row.querySelectorAll("span, div")].find(
      (element) =>
        element.children.length === 0 &&
        element.textContent.trim() !== "" &&
        !element.closest(".bolt-pill"),
    );

    return leaf?.textContent.trim() ?? "";
  }

  // A árvore só tem no DOM as linhas visíveis; o caminho de cada uma sai dos níveis.
  function findTreeRowByPath(path) {
    const stack = [];

    for (const row of document.querySelectorAll("tr.bolt-tree-row")) {
      const level = Number(row.getAttribute("aria-level"));

      stack.length = Math.max(level - 1, 0);
      stack[level - 1] = getTreeRowName(row);

      if ("/" + stack.join("/") === path) {
        return row;
      }
    }

    return null;
  }

  function getReviewedCheckbox(row) {
    return row?.querySelector('.bolt-checkbox[role="checkbox"]') ?? null;
  }

  function isReviewed(row) {
    return getReviewedCheckbox(row)?.getAttribute("aria-checked") === "true";
  }

  function isFileRow(row) {
    return !row.hasAttribute("aria-expanded");
  }

  /** Marca ou desmarca; devolve "marked", "unmarked" ou null se a linha não tem visto. */
  function toggleReviewed(row) {
    const checkbox = getReviewedCheckbox(row);

    if (!checkbox) {
      return null;
    }

    const wasChecked = checkbox.getAttribute("aria-checked") === "true";

    checkbox.click();

    return wasChecked ? "unmarked" : "marked";
  }

  function getTreeScroller() {
    return document.querySelector(".repos-changes-explorer-tree-root")?.closest(".v-scroll-auto") ?? null;
  }

  // A árvore só desenha as linhas visíveis: percorre-a descendo o scroll até achar
  // um ficheiro por rever depois de `from`.
  async function findNextUnreviewedRow(from) {
    const scroller = getTreeScroller();
    let last = from;

    for (let attempt = 0; attempt < 40; attempt += 1) {
      const rows = [...document.querySelectorAll("tr.bolt-tree-row")];
      const start = last?.isConnected ? rows.indexOf(last) + 1 : 0;
      const candidates = rows.slice(start);
      const next = candidates.find((row) => isFileRow(row) && !isReviewed(row));

      if (next) {
        return next;
      }

      last = rows.at(-1) ?? last;

      if (!scroller || scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
        return null;
      }

      scroller.scrollTop += scroller.clientHeight * 0.8;
      await sleep(250);
    }

    return null;
  }

  async function openNextUnreviewedFile(from) {
    const next = await findNextUnreviewedRow(from);

    if (!next) {
      showToast("✓ Marcado. Não há mais ficheiros por rever");

      return;
    }

    next.scrollIntoView({ block: "nearest" });
    next.click();
    showToast(`✓ Marcado. A seguir: ${getTreeRowName(next)}`);
  }

  async function goToNextUnreviewedCard(viewer, currentPath) {
    const cards = [...viewer.querySelectorAll(".repos-summary-header")];
    const start = cards.findIndex(
      (card) => card.querySelector(".bolt-card-expand-button")?.getAttribute("aria-label") === currentPath,
    );
    const next = cards.slice(start + 1).find((card) => {
      const path = card.querySelector(".bolt-card-expand-button")?.getAttribute("aria-label");

      return !isReviewed(findTreeRowByPath(path));
    });

    if (!next) {
      showToast("✓ Marcado. Não há mais ficheiros por rever");

      return;
    }

    viewer.scrollTop += next.getBoundingClientRect().top - viewer.getBoundingClientRect().top - 8;
    showToast("✓ Marcado. Próximo ficheiro");
  }

  async function markCurrentFileReviewed() {
    const viewer = getViewer();

    if (viewer?.classList.contains("is-folder")) {
      const path = getCurrentCardPath(viewer);

      if (!path) {
        showToast("Não encontrei o ficheiro atual");

        return;
      }

      const result = toggleReviewed(findTreeRowByPath(path));

      if (result === null) {
        showToast("Mostra o ficheiro na árvore à esquerda para o marcar");
      } else if (result === "unmarked") {
        showToast("Ficheiro desmarcado");
      } else {
        await goToNextUnreviewedCard(viewer, path);
      }

      return;
    }

    const selected = document.querySelector("tr.bolt-tree-row.selected");
    const result = toggleReviewed(selected);

    if (result === null) {
      showToast("Abre um ficheiro primeiro");
    } else if (result === "unmarked") {
      showToast("Ficheiro desmarcado");
    } else {
      await sleep(150);
      await openNextUnreviewedFile(selected);
    }
  }

  // ---------- teclado ----------

  function navigate(direction) {
    if (getDiffButton(direction)) {
      clickDiffButton(direction);

      return;
    }

    const viewer = getViewer();

    if (!viewer) {
      showToast("Abre o separador Files do PR");

      return;
    }

    if (direction === "next") {
      goToNextHunk(viewer);
    } else {
      goToPreviousHunk(viewer);
    }
  }

  window.addEventListener(
    "keydown",
    (event) => {
      const modifier = IS_MAC ? event.metaKey : event.ctrlKey;

      if (!modifier || event.altKey || event.shiftKey || !isPullRequestFilesPage()) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      const actions = {
        ArrowDown: () => navigate("next"),
        ArrowUp: () => navigate("prev"),
        Enter: markCurrentFileReviewed,
      };
      const action = actions[event.key];

      if (!action) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      action();
    },
    true,
  );
})();
