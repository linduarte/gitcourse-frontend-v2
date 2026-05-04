// Last update: May 04, 2026 – 17:49
// dashboard-router.js — Revisado por Copilot — 2026-05-04

import { CONFIG } from './config.js';
import { HomeView } from './views/home-view.js';

/**
 * 📚 Mapa oficial das aulas
 * Observação:
 * - 1a-prefacio.html NÃO é concluível
 * - topic_id = 1 corresponde à aula 2-terminal-customization.html
 */
export const LESSONS = [
    "1a-prefacio.html",               // Aula 0 (não concluível)
    "2-terminal-customization.html",  // Aula 1 (topic_id = 1)
    "2a-introduction.html",           // Aula 2
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
    "16-git-workflows.html"
];

// Base das aulas
const BASE_URL = CONFIG.REPO_BASE;

/**
 * 🧠 Rotas SPA (somente dashboard)
 */
const routes = {
    home: () => new HomeView(),

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

/**
 * 🔍 Resolver aula com segurança
 */
function resolverAula(id) {
    const idStr = String(id).trim().toLowerCase();

    // Caso especial: prefácio
    if (idStr === "1" || idStr === "1a") {
        return "1a-prefacio.html";
    }

    // Busca por prefixo exato (ex.: "2-", "2a-")
    const arquivo = LESSONS.find(aula =>
        aula.toLowerCase().startsWith(`${idStr}-`)
    );

    if (!arquivo) {
        console.warn(`⚠️ Aula não encontrada para ID: ${idStr}`);
    }

    return arquivo;
}

/**
 * 🚀 Navegação principal
 * - SPA → dashboard
 * - MPA → aulas HTML reais
 */
export async function navegar(rota, atualizarURL = false) {
    const container = document.getElementById('spa-content');

    // Se for aula → redireciona direto (MPA)
    if (rota.startsWith("lesson:")) {
        const id = rota.split(":")[1];
        const arquivo = resolverAula(id);

        if (!arquivo) {
            if (container) container.innerHTML = "<h2>Aula não encontrada</h2>";
            return;
        }

        window.location.href = BASE_URL + arquivo;
        return;
    }

    // SPA: precisa do container
    if (!container) {
        console.error("❌ Container #spa-content não encontrado");
        return;
    }

    // Atualiza URL somente se rota existir
    if (atualizarURL && routes[rota]) {
        history.pushState({ rota }, "", `?page=${rota}`);
    }

    try {
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
            <div class="error-container">
                <h2>Erro ao carregar</h2>
                <p>${err.message}</p>
            </div>
        `;
    }
}
