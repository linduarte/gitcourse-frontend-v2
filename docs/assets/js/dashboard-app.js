// dashboard-app.js - versão blindada e refatorada para SPA e HomeView
// Last update: April 27, 2026 – 05:52

import { navegar } from './dashboard-router.js';
import { inicializarMenuLateral } from './sidebar-logic.js';
import { getProgress } from './git-course-functions.js?v=1777361682432';
import { CONFIG } from './config.js';

document.addEventListener("DOMContentLoaded", async () => {

    // 🔹 Garante que estamos no dashboard
    if (!window.location.pathname.includes("dashboard.html")) {
        console.log("⛔ Ignorando script fora do dashboard");
        return;
    }

    let redirecting = false;

    // Recupera a rota atual da URL
    const getRotaAtual = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("page") || "home";
    };

    // Valida sessão do usuário
    const validarSessao = () => {
        const token = localStorage.getItem("access_token");
        const email = localStorage.getItem("user_email");

        console.log("🔐 Validando sessão...", { token, email });
        return !!token && !!email;
    };

    // Atualiza mensagem de status
    const atualizarMensagemStatus = (mensagem, cor = "#333") => {
        const mensagemBox = document.getElementById("mensagem-status");
        if (mensagemBox) {
            mensagemBox.textContent = mensagem;
            mensagemBox.style.color = cor;
        }
    };

    // ========================
    // Boot do dashboard
    // ========================
    const boot = async () => {
        if (redirecting) return;
        redirecting = true;

        // 🔒 Sessão inválida → login
        if (!validarSessao()) {
            console.warn("⚠️ Usuário não autenticado → login");
            window.location.href = "/gitcourse-frontend-v2/auth/login.html";
            return;
        }

        // Inicializa menu lateral SPA
        inicializarMenuLateral();

        const rota = getRotaAtual();

        try {
            console.log("🔹 Antes de getProgress");
            const progresso = await getProgress(CONFIG.API_URL);
            console.log("🔹 Progresso carregado:", progresso);

            const userEmail = localStorage.getItem("user_email") || "aluno";
            atualizarMensagemStatus(`Bem-vindo, ${userEmail}! Iniciando sua jornada técnica...`, "#1f2937");

            // Mostra lacunas, se houver
            const lacunasBox = document.getElementById("lacunas-box");
            if (lacunasBox && progresso.pending_topics.length > 0) {
                const aulasPuladas = progresso.pending_topics.join(" • ");
                lacunasBox.innerHTML = `<p class="lacunas-text">⚠️ Você pulou algumas etapas importantes: ${aulasPuladas}</p>`;
            }

            // 🔹 Novo aluno → REDIRECT PREFÁCIO
            if (progresso.actual_count === 0) {
                console.log("🚀 Novo aluno → Prefácio");
                window.location.replace(CONFIG.REPO_BASE + "1a-prefacio.html");
                return;
            }

            // ✔ versão correta (igual ao modelo que funcionava)
            await navegar(rota);

        } catch (err) {
            console.error("❌ Erro ao carregar progresso:", err);
            atualizarMensagemStatus("Erro ao carregar seu progresso. Recarregue a página.", "#d32f2f");
        }
    };

    // SPA back/forward
    window.addEventListener("popstate", () => navegar(getRotaAtual()));

    // Inicializa dashboard
    boot();
});