import { CONFIG } from './config.js';

let token = null;
let userEmail = null;

function validarSessao() {
    token = localStorage.getItem("access_token");
    userEmail = localStorage.getItem("user_email"); // Precisamos do e-mail salvo no login
    
    if (!token || !userEmail) {
        console.warn("⚠️ Sessão incompleta. Redirecionando...");
        window.location.href = "auth/login.html";
        return false;
    }
    return true;
}

async function buscarDadosGlobais() {
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
        // Agora incluímos o e-mail na URL do sumário!
        const [resMe, resProg] = await Promise.all([
            fetch(`${CONFIG.API_URL}/auth/me`, { headers }),
            fetch(`${CONFIG.API_URL}/progress/summary?email=${userEmail}`, { headers })
        ]);

        if (!resMe.ok) throw new Error("Falha no Perfil");

        const user = await resMe.json();
        const progresso = resProg.ok ? await resProg.json() : null;

        return { user, progresso };
    } catch (error) {
        console.error("❌ Erro na VPS:", error);
        return null;
    }
}

function atualizarInterface(dados) {
    if (!dados) return;
    const { progresso } = dados;
    const btnAcao = document.getElementById("btn-continuar");
    if (!btnAcao) return;

    // 1. CASO: RECUPERAÇÃO (BOTÃO AMARELO)
    if (progresso && progresso.pending_topics && progresso.pending_topics.length > 0) {
        const aulaId = progresso.pending_topics[0];
        btnAcao.textContent = `Retomar: Aula ${aulaId} ⚠️`;
        btnAcao.className = "btn btn-warning btn-lg w-100 fw-bold text-dark"; // Amarelo
        btnAcao.onclick = () => window.location.href = `auth/${aulaId}-aula.html`;
        return;
    }

    // 2. CASO: NOVATO (BOTÃO AZUL)
    if (!progresso || progresso.completed === 0) {
        btnAcao.textContent = "Começar do Início 🚀";
        btnAcao.className = "btn btn-primary btn-lg w-100 fw-bold";
        btnAcao.onclick = () => window.location.href = "auth/1a-prefacio.html";
    } 
    // 3. CASO: VETERANO (BOTÃO VERDE)
    else {
        btnAcao.textContent = `Continuar (${progresso.percentage}%)`;
        btnAcao.className = "btn btn-success btn-lg w-100 fw-bold";
        btnAcao.onclick = () => window.location.href = progresso.last_lesson_url || "auth/2-introduction.html";
    }
}

export async function inicializarDashboard() {
    if (!validarSessao()) return;
    const dados = await buscarDadosGlobais();
    if (dados) {
        atualizarInterface(dados);
        // Atualiza o nome do Engenheiro na tela
        const nomeElemento = document.getElementById("user-name");
        if (nomeElemento) nomeElemento.textContent = dados.user.full_name || "Engenheiro";
    }
}