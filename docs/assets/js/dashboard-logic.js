/**
 * dashboard-logic.js - v2.1 Refatorado
 * Motor de busca e controle de navegação (Perfil e Progresso)
 * Charles Duarte - Foco em Confiabilidade
 */
import { API_URL } from "./config.js";

// Estado Interno
let token = null;

/**
 * 1. MÓDULO DE SEGURANÇA: Validação de Token
 */
function validarSessao() {
    token = localStorage.getItem("access_token");
    if (!token) {
        console.warn("⚠️ Sessão não encontrada. Redirecionando...");
        window.location.href = "auth/login.html";
        return false;
    }
    return true;
}

/**
 * 2. MÓDULO DE DADOS: Busca Identidade e Progresso via API
 */
async function buscarDadosGlobais() {
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
        // Busca Perfil e Resumo de Progresso em paralelo (Otimização de tempo)
        const [resMe, resProg] = await Promise.all([
            fetch(`${API_URL}/auth/me`, { headers }),
            fetch(`${API_URL}/progress/summary`, { headers })
        ]);

        if (!resMe.ok) throw new Error("Falha na autenticação do Perfil");

        const user = await resMe.json();
        const progresso = resProg.ok ? await resProg.json() : { completed: 0, total: 17 };

        return { user, progresso };
    } catch (error) {
        console.error("❌ Erro de comunicação com a VPS:", error);
        return null;
    }
}

/**
 * 3. MÓDULO DE INTERFACE: Atualiza o painel e os botões
 */
function atualizarInterface(dados) {
    if (!dados) {
        localStorage.clear();
        window.location.href = "auth/login.html";
        return;
    }

    const { user, progresso } = dados;

    // Atualiza Displays de Texto
    const emailDisplay = document.getElementById("userEmailDisplay");
    const welcomeMsg = document.getElementById("welcomeMessage");
    if (emailDisplay) emailDisplay.textContent = user.email;
    if (welcomeMsg) welcomeMsg.textContent = "Sistema Sincronizado.";

    // Lógica do Botão de Navegação Principal
    const btnAcao = document.getElementById("btn-continuar");
    if (btnAcao) {
        // Se não concluiu nenhuma aula, é o primeiro acesso real
        if (!progresso || progresso.completed === 0) {
            btnAcao.textContent = "Começar do Início (Prefácio)";
            btnAcao.className = "btn btn-primary btn-lg w-100 fw-bold"; // Garante estilo de destaque
            btnAcao.onclick = () => window.location.href = "auth/1a-prefacio.html";
        } else {
            btnAcao.textContent = `Continuar (${progresso.percentage}% concluído)`;
            btnAcao.className = "btn btn-success btn-lg w-100 fw-bold";
            // Direciona para a última aula ou para a Dashboard interna
            btnAcao.onclick = () => window.location.href = progresso.last_lesson_url || "auth/1a-prefacio.html";
        }
    }
}

/**
 * FUNÇÃO MESTRA (EXPORTADA): Orquestra a inicialização
 */
export async function inicializarDashboard() {
    if (!validarSessao()) return;
    
    const dados = await buscarDadosGlobais();
    atualizarInterface(dados);
}