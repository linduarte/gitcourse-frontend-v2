import { navegar } from './dashboard-router.js';
import { inicializarMenuLateral } from './sidebar-logic.js';

function getRotaAtual() {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
}

function validarSessao() {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    if (!token || !email) {
        window.location.href = "auth/login.html";
        return false;
    }
    return true;
}

async function boot() {
    if (!validarSessao()) return;

    inicializarMenuLateral();

    const rota = getRotaAtual();
    await navegar(rota);
}

window.addEventListener("popstate", () => {
    navegar(getRotaAtual());
});

document.addEventListener("DOMContentLoaded", boot);