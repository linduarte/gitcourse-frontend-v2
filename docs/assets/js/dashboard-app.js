// dashboard-app.js - versão blindada
// Last update: April 24, 2026 – 13:37
import { navegar } from './dashboard-router.js';
import { inicializarMenuLateral } from './sidebar-logic.js';
import { getProgress } from './git-course-functions.js';

document.addEventListener("DOMContentLoaded", async () => {

    // 🔹 Garante que estamos na dashboard
    if (!window.location.pathname.includes("dashboard.html")) {
        console.log("⛔ Ignorando script fora do dashboard");
        return;
    }

    // Recupera rota atual do URL
    const getRotaAtual = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("page") || "home";
    };

    // Valida sessão e retorna booleano
    const validarSessao = () => {
        const token = localStorage.getItem("access_token");
        const email = localStorage.getItem("user_email");

        console.log("🔐 Validando sessão...", { token, email });
        return !!token && !!email;
    };

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
        if (!validarSessao()) {
            console.warn("⚠️ Usuário não autenticado → redirect para login");
            window.location.href = "/gitcourse-frontend-v2/login.html";
            return;
        }

        inicializarMenuLateral();
        const rota = getRotaAtual();

        try {
            const progresso = await getProgress();

            const userEmail = localStorage.getItem("user_email") || "aluno";
            atualizarMensagemStatus(`Bem-vindo, ${userEmail}! Iniciando sua jornada técnica...`, "#1f2937");

            // 🔹 Mostra lacunas, se houver
            const lacunasBox = document.getElementById("lacunas-box");
            if (lacunasBox && progresso.pending_topics.length > 0) {
                const aulasPuladas = progresso.pending_topics.join(" • ");
                lacunasBox.innerHTML = `<p class="lacunas-text">⚠️ Você pulou algumas etapas importantes: ${aulasPuladas}</p>`;
            }

            // 🔹 Novo aluno → prefácio
            if (progresso.actual_count === 0) {
                console.log("🚀 Novo aluno → indo para prefácio");
                await navegar("lesson:1a", true);
                return;
            }

        } catch (err) {
            console.error("❌ Erro ao carregar progresso:", err);
            atualizarMensagemStatus("Erro ao carregar seu progresso. Recarregue a página.", "#d32f2f");
        }

        // SPA: renderiza rota
        await navegar(rota);
    };

    // SPA back/forward
    window.addEventListener("popstate", () => navegar(getRotaAtual()));

    boot();
});