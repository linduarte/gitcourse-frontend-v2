// dashboard-router.js
// Last update: April 24, 2026 – 15:13
import { HomeView } from './views/home-view.js';

export const LESSON_TO_TOPIC = {
    "2-terminal-customization.html": 17,
    "2a-introduction.html": 2,

    "3-git-config.html": 3,
    "4-hosting.html": 4,
    "5-connect.html": 5,
    "6-git-clone.html": 6,
    "7-git-status.html": 7,
    "8-git-add.html": 8,
    "9-git-commit.html": 9,
    "10-feature_req.html": 10,
    "11-branch.html": 11,
    "12-branch-merge.html": 12,
    "13-git-diff.html": 13,
    "14-undo-changes.html": 14,
    "15-git-init.html": 15,
    "16-git-workflows.html": 16
};

const BASE_URL = "https://linduarte.github.io/gitcourse-frontend-v2/curso/git-course/";

const routes = {
    home: () => new HomeView(),
    progresso: async () => ({
        async render() {
            const el = document.getElementById('spa-content');
            if (!el) return;
            el.innerHTML = `<div class="fade-in"><h2>📊 Progresso</h2><p>Em construção...</p></div>`;
        }
    })
};

// 🔐 AUTENTICAÇÃO
async function validarUsuario() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "auth/login.html";
        return false;
    }
    try {
        const response = await fetch(`${window.CONFIG.API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Token inválido");
        return true;
    } catch (err) {
        localStorage.removeItem("access_token");
        window.location.href = "auth/login.html";
        return false;
    }
}

function resolverAula(id) {
    const idStr = String(id);
    if (idStr === "1" || idStr === "1a") return "1a-prefacio.html";
    return LESSONS.find(aula => aula.startsWith(idStr + "-"));
}

export async function navegar(rota, atualizarURL = false) {
    const container = document.getElementById('spa-content');
    if (!container) return;

    // 🔒 valida antes de tudo
    if (!(await validarUsuario())) return;

    if (atualizarURL) history.pushState({ rota }, "", `?page=${rota}`);

    try {
        if (rota.startsWith("lesson:")) {
            const id = rota.split(":")[1];
            const arquivo = resolverAula(id);
            if (!arquivo) { container.innerHTML = "<h2>Aula não encontrada</h2>"; return; }
            window.location.href = BASE_URL + arquivo;
            return;
        }

        const factory = routes[rota];
        if (!factory) { container.innerHTML = "<h2>Rota não encontrada</h2>"; return; }

        const view = await factory();
        container.innerHTML = "";
        await view.render();

    } catch (err) {
        console.error("Erro na navegação:", err);
        container.innerHTML = `<div class="error-container"><h2>Erro ao carregar</h2><p>${err.message}</p></div>`;
    }
}

// 🚪 LOGOUT GLOBAL
export function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    window.location.href = "auth/login.html";
}

// 🔥 START
document.addEventListener("DOMContentLoaded", () => {
    navegar("home");
});