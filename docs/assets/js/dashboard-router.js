// dashboard-router.js

import { HomeView } from './views/home-view.js';

// 📚 Lista oficial de aulas (único ponto de verdade)
const LESSONS = [
    '1a-prefacio.html',
    '2-introduction.html',
    '3-git-config.html',
    '4-hosting.html',
    '5-connect.html',
    '6-git-clone.html',
    '7-git-status.html',
    '8-git-add.html',
    '9-git-commit.html',
    '10-feature_req.html',
    '11-branch.html',
    '12-branch-merge.html',
    '13-git-diff.html',
    '14-undo-changes.html',
    '15-git-init.html',
    '16-git-workflows.html',
    '17-terminal-customization.html'
];

// 🌐 Base URL das aulas
const BASE_URL = "https://linduarte.github.io/gitcourse-frontend-v2/curso/git-course/";

// 🧠 Cache
const viewCache = new Map();

// 🗺️ Rotas principais
const routes = {
    home: () => new HomeView(),

    progresso: async () => ({
        async render() {
            const el = document.getElementById('spa-content');
            el.innerHTML = "<h2>📊 Progresso (em construção)</h2>";
        }
    })
};

// 🔍 Resolve ID → arquivo real
function resolverAula(id) {
    const idStr = String(id);

    // 👇 caso especial (prefácio)
    if (idStr === "1a") {
        return "1a-prefacio.html";
    }

    // 👇 busca exata (evita confundir 1 com 1a)
    return LESSONS.find(aula => aula.startsWith(idStr + "-"));
}

// 📥 Carrega HTML da aula
async function carregarConteudoAula(arquivo) {
    const container = document.getElementById('spa-content');

    const response = await fetch(BASE_URL + arquivo);

    if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
    }

    const html = await response.text();

    container.innerHTML = html;

    window.scrollTo(0, 0);
}

// ⏳ Loader
function showLoader() {
    document.getElementById("global-loader")?.classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("global-loader")?.classList.add("hidden");
}

// 🎯 Menu ativo
function setActiveMenu(rota) {
    document.querySelectorAll(".sidebar a").forEach(a => {
        a.classList.remove("active");
    });

    if (rota.startsWith("lesson:")) {
        document.getElementById("menuContinue")?.classList.add("active");
        return;
    }

    const map = {
        home: "menuDashboard",
        progresso: "menuProgresso"
    };

    const id = map[rota];
    if (id) {
        document.getElementById(id)?.classList.add("active");
    }
}

/**
 * 🚀 Navegação SPA completa
 */
export async function navegar(rota, atualizarURL = false) {
    const container = document.getElementById('spa-content');
    if (!container) return;

    console.log("➡️ ID recebido:", id);
    console.log("➡️ Arquivo resolvido:", arquivo);

    // 🔄 URL
    if (atualizarURL) {
        history.pushState({ rota }, "", `?page=${rota}`);
    }

    setActiveMenu(rota);
    showLoader();

    try {
        // 🎓 ROTA DE AULA (NOVO!)
        if (rota.startsWith("lesson:")) {
            const id = rota.split(":")[1];
            const arquivo = resolverAula(id);

            if (!arquivo) {
                container.innerHTML = "<h2>Aula não encontrada</h2>";
                return;
            }

            // ⚡ Cache da aula
            if (viewCache.has(arquivo)) {
                console.log("⚡ Aula cache:", arquivo);
                container.innerHTML = viewCache.get(arquivo);
            } else {
                await carregarConteudoAula(arquivo);
                viewCache.set(arquivo, container.innerHTML);
                console.log("🆕 Aula carregada:", arquivo);
            }

            return;
        }

        // 🧠 Rotas normais (home, progresso)
        let view;

        if (viewCache.has(rota)) {
            view = viewCache.get(rota);
            console.log("⚡ Cache view:", rota);
        } else {
            const factory = routes[rota];

            if (!factory) {
                container.innerHTML = "<h2>Rota não encontrada</h2>";
                return;
            }

            view = await factory();
            viewCache.set(rota, view);
            console.log("🆕 View criada:", rota);
        }

        container.innerHTML = "";
        await view.render();

    } catch (err) {
        console.error("💥 Erro:", err);
        container.innerHTML = "<h2>Erro ao carregar conteúdo</h2>";
    } finally {
        hideLoader();
    }
}