// dashboard-app.js - versão estável e sem race condition
// Last update: April 27, 2026 – 05:30
import { navegar } from './dashboard-router.js';
import { inicializarMenuLateral } from './sidebar-logic.js';
import { getProgress } from './git-course-functions.js';
import { CONFIG } from './config.js';

document.addEventListener("DOMContentLoaded", () => {

    // 🔒 Garante execução única REAL
    if (window.__dashboardBooted) return;
    window.__dashboardBooted = true;

    // 🔹 Só roda no dashboard
    if (!window.location.pathname.includes("dashboard.html")) {
        console.log("⛔ Fora do dashboard");
        return;
    }

    const getRotaAtual = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("page") || "home";
    };

    const validarSessao = () => {
        const token = localStorage.getItem("access_token");
        console.log("🔐 Token:", token);
        return !!token;
    };

    const atualizarMensagemStatus = (msg, cor = "#333") => {
        const el = document.getElementById("mensagem-status");
        if (el) {
            el.textContent = msg;
            el.style.color = cor;
        }
    };

    const boot = async () => {

        // 🔒 Sessão inválida → login
        if (!validarSessao()) {
            console.warn("❌ Sem token → login");
            window.location.href = "/gitcourse-frontend-v2/auth/login.html";
            return;
        }

        inicializarMenuLateral();

        try {
            console.log("📡 Buscando progresso...");
            const progresso = await getProgress(CONFIG.API_URL);
            console.log("📊 Progresso:", progresso);

            const email = localStorage.getItem("user_email") || "aluno";
            atualizarMensagemStatus(`Bem-vindo, ${email}!`);

            // 🔹 Novo aluno → prefácio
            if (progresso.actual_count === 0) {
                console.log("🚀 Novo aluno → Prefácio");
                window.location.replace(CONFIG.REPO_BASE + "1a-prefacio.html");
                return;
            }

            // 🔹 Render SPA
            const rota = getRotaAtual();
            console.log("➡️ Navegando para:", rota);
            await navegar(rota);

        } catch (err) {
            console.error("❌ Erro no dashboard:", err);

            // ⚠️ Só redireciona se for realmente sessão inválida
            if (err.message.includes("401")) {
                console.warn("🔐 Token inválido → login");
                window.location.href = "/gitcourse-frontend-v2/auth/login.html";
            } else {
                atualizarMensagemStatus("Erro ao carregar dados.", "#d32f2f");
            }
        }
    };

    window.addEventListener("popstate", () => {
        navegar(getRotaAtual());
    });

    boot();
});