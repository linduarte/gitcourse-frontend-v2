
// Last update: May 03, 2026 – 10:55
// Navegação SPA + resolução de aulas + integração com HomeView

import { HomeView } from './views/home-view.js';
import { CONFIG } from "./config.js";

// 📚 Lista oficial de aulas
export const LESSONS = [
    "1a-prefacio.html",
    "2a-introduction.html",
    "3-git-config.html",
    "4-hosting.html",
    "5-connect.html",
    "6-git-clone.html",
    "7-git-status.html",
    "8-git-add.html",
    "9-git-commit.html",
    "10-feature_req.html",
    "11-branch.html",
    "12-branch-merge.html",
    "13-git-diff.html",
    "14-undo-changes.html",
    "15-git-init.html",
    "16-git-workflows.html",
    "2-terminal-customization.html"
];

// 🌐 Base das aulas (GitHub Pages)
const BASE_URL = CONFIG.COURSE_BASE;

// 🧠 Rotas SPA (somente dashboard)
const routes = {
    home: async () => new HomeView(),

    progresso: async () => ({
        async render() {
            const el = document.getElementById('spa-content');
            if (!el) return;

            el.innerHTML = `
                <div class="fade-in">
                    <h2>📊 Progresso</h2>
                    <p>Em construção...</p>
                </div>
            `;
        }
    })
};

// 🔍 Resolver aula com segurança
function resolverAula(id) {
    const idStr = String(id).toLowerCase();

    // Caso especial
    if (idStr === "1" || idStr === "1a") {
        return "1a-prefacio.html";
    }

    // Busca por prefixo exato
    return LESSONS.find(aula => aula.startsWith(idStr + "-")) || null;
}

/**
 * 🚀 Navegação principal
 */
export async function navegar(rota, atualizarURL = false) {
    const container = document.getElementById('spa-content');

    if (!container) {
        console.error("❌ Container #spa-content não encontrado");
        return;
    }

    // 🔒 Proteção de rota
    const token = localStorage.getItem("access_token");
    if (!token && rota !== "login") {
        console.warn("⚠️ Usuário não autenticado → login");
        window.location.href = `${CONFIG.REPO_BASE}auth/login.html`;
        return;
    }

    // 🔄 Atualiza URL (somente dashboard)
    if (atualizarURL) {
        history.pushState({ rota }, "", `?page=${rota}`);
    }

    try {
        // 🎓 ROTA DE AULA → REDIRECT (MPA)
        if (rota.startsWith("lesson:")) {
            const id = rota.split(":")[1];

            console.log("➡️ ID recebido:", id);

            const arquivo = resolverAula(id);

            console.log("➡️ Arquivo resolvido:", arquivo);

            if (!arquivo) {
                container.innerHTML = "<h2>Aula não encontrada</h2>";
                return;
            }

            window.location.href = BASE_URL + arquivo;
            return;
        }

        // 🧠 ROTAS DO DASHBOARD (SPA)
        const factory = routes[rota];

        if (!factory) {
            container.innerHTML = "<h2>Rota não encontrada</h2>";
            return;
        }

        const view = await factory();

        container.innerHTML = "";
        await view.render();

    } catch (err) {
        console.error("💥 Erro na navegação:", err);

        container.innerHTML = `
            <div class="error-container fade-in">
                <h2>Erro ao carregar</h2>
                <p>${err.message || "Algo inesperado aconteceu"}</p>
            </div>
        `;
    }
}
