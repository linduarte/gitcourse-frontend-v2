// dashboard-router. - ver.3.1 - 2026-04-19

import { HomeView } from './views/home-view.js';

// 📚 Lista oficial de aulas
export const LESSONS = [
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
// 🌐 Base das aulas (GitHub Pages)
const BASE_URL = "https://linduarte.github.io/gitcourse-frontend-v2/curso/git-course/";

// 🧠 Rotas SPA (somente dashboard)
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

// 🔍 Resolver aula com segurança (evita conflito 1 vs 1a)
function resolverAula(id) {
    const idStr = String(id);

    // 🔥 caso especial: aula 1 → 1a-prefacio
    if (idStr === "1") {
        return "1a-prefacio.html";
    }

    if (idStr === "1a") {
        return "1a-prefacio.html";
    }

    // 🔎 busca padrão
    return LESSONS.find(aula => aula.startsWith(idStr + "-"));
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
                console.error("❌ Aula não encontrada:", id);
                container.innerHTML = "<h2>Aula não encontrada</h2>";
                return;
            }

            // 👉 REDIRECIONA PARA A AULA REAL
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
            <div class="error-container">
                <h2>Erro ao carregar</h2>
                <p>${err.message}</p>
            </div>
        `;
    }
}