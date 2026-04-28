// dashboard-router.js - versão robusta
// Last update: April 28, 2026 – 08:31

import { validarUsuario } from './git-course-functions.mjs';
import { CONFIG } from './config.js';

const BASE_URL = CONFIG.REPO_BASE;

// ============================
// 📚 Mapa de aulas (alinhado)
// ============================
const mapaAulas = {
    1: "1a-prefacio.html",
    2: "2a-introduction.html",
    3: "3-git-config.html",
    4: "4-hosting.html",
    5: "5-connect.html",
    6: "6-git-clone.html",
    7: "7-git-status.html",
    8: "8-git-add.html",
    9: "9-git-commit.html",
    10: "10-feature_req.html",
    11: "11-branch.html",
    12: "12-branch-merge.html",
    13: "13-git-diff.html",
    14: "14-undo-changes.html",
    15: "15-git-init.html",
    16: "16-git-workflows.html",
    17: "2-terminal-customization.html" // 🔥 corrigido
};

function resolverAula(id) {
    return mapaAulas[id];
}

// ============================
// 🧭 ROTAS SPA
// ============================

const routes = {
    home: async () => {
        console.log("🔥 carregando HomeView");

        const module = await import('./views/home-view.js');
        return new module.HomeView();
    },

    progresso: async () => {
        console.log("🔥 carregando ProgressView");

        const module = await import('./views/progress-view.js');
        return new module.ProgressView();
    }
};

// ============================
// 🚀 NAVEGAÇÃO PRINCIPAL
// ============================
export async function navegar(rota = "home", atualizarURL = false) {
    const container = document.getElementById('spa-content');

    if (!container) {
        console.error("❌ Container #spa-content não encontrado");
        return;
    }

    console.log("🧭 Navegando para:", rota);

    // 🔒 valida sessão antes de tudo
    if (!(await validarUsuario())) {
        console.warn("⚠️ Usuário não autenticado");
        return;
    }

    // 🔗 atualiza URL (SPA)
    if (atualizarURL) {
        history.pushState({ rota }, "", `?page=${rota}`);
    }

    try {
        // ============================
        // 📘 Navegação para aulas
        // ============================
        if (rota.startsWith("lesson:")) {
            const id = rota.split(":")[1];
            const arquivo = resolverAula(id);

            if (!arquivo) {
                container.innerHTML = "<h2>Aula não encontrada</h2>";
                return;
            }

            console.log("📘 Redirecionando para aula:", arquivo);
            window.location.href = BASE_URL + arquivo;
            return;
        }

        // ============================
        // 🧭 Rotas SPA
        // ============================
        const factory = routes[rota];

        if (!factory) {
            console.warn("⚠️ Rota inválida:", rota);
            container.innerHTML = "<h2>Rota não encontrada</h2>";
            return;
        }

        // 🔄 loading visual
        container.innerHTML = `
            <div class="fade-in">
                <p class="loading-text">Carregando sua jornada técnica...</p>
            </div>
        `;

        const view = await factory();

        if (!view || typeof view.render !== "function") {
            throw new Error("View inválida");
        }

        // limpa e renderiza
        container.innerHTML = "";
        await view.render();

    } catch (err) {
        console.error("❌ Erro na navegação:", err);

        container.innerHTML = `
            <div class="error-container">
                <h2>Erro ao carregar</h2>
                <p>${err.message}</p>
            </div>
        `;
    }
}