// dashboard-app.js - refatorado para UX premium com SPA
import { navegar } from './dashboard-router.js';
import { inicializarMenuLateral } from './sidebar-logic.js';
import { getProgress } from './git-course-functions.js';

// Recupera a rota atual do URL
function getRotaAtual() {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
}

// Valida sessão do usuário
function validarSessao() {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    if (!token || !email) {
        console.warn("⚠️ Sessão inválida. Redirecionando para login.");
        window.location.href = "/gitcourse-frontend-v2/auth/login.html";
        return false;
    }
    return true;
}

// Exibe mensagem de status no dashboard
function atualizarMensagemStatus(mensagem, cor = "#333") {
    const mensagemBox = document.getElementById("mensagem-status");
    if (mensagemBox) {
        mensagemBox.textContent = mensagem;
        mensagemBox.style.color = cor;
    }
}

// Inicializa o boot do dashboard
async function boot() {
    if (!validarSessao()) return;

    inicializarMenuLateral();

    const rota = getRotaAtual();

    try {
        // 🔥 Carrega progresso do aluno
        const progresso = await getProgress();

        // Mostra mensagem de boas-vindas
        const userEmail = localStorage.getItem("user_email") || "aluno";
        atualizarMensagemStatus(`Bem-vindo, ${userEmail}! Iniciando sua jornada técnica...`, "#1f2937");

        // Exibe lacunas de aulas, se houver
        const lacunasBox = document.getElementById("lacunas-box");
        if (lacunasBox && progresso.pending_topics.length > 0) {
            const aulasPuladas = progresso.pending_topics.join(" • ");
            lacunasBox.innerHTML = `
                <p class="lacunas-text">⚠️ Você pulou algumas etapas importantes: ${aulasPuladas}</p>
            `;
        }

        // Direciona o novo usuário para o prefácio se ainda não iniciou
        if (progresso.actual_count === 0) {
            await navegar("lesson:1a", true);
            return;
        }

    } catch (err) {
        console.error("❌ Erro ao carregar progresso:", err);
        atualizarMensagemStatus("Erro ao carregar seu progresso. Recarregue a página.", "#d32f2f");
    }

    // Renderiza a view inicial (SPA)
    await navegar(rota);
}

// Event listener para SPA - back/forward
window.addEventListener("popstate", () => {
    navegar(getRotaAtual());
});

// Inicialização do dashboard
document.addEventListener("DOMContentLoaded", boot);