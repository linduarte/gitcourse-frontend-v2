/**
 * dashboard-logic.js - v2.1 Refatorado
 * Motor de busca e controle de navegação (Perfil e Progresso)
 * Charles Duarte - Foco em Confiabilidade
 */
import { CONFIG } from './config.js';

// E onde no código estiver escrito API_URL, você muda para:
// CONFIG.API_URL

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
    if (!dados) return; // Segurança contra dados nulos

    const { progresso } = dados;
    const btnAcao = document.getElementById("btn-continuar");

    if (btnAcao) {
        // CONDIÇÃO PARA USUÁRIO NOVATO (Zero progresso)
        if (!progresso || progresso.completed === 0) {
            console.log("🆕 Usuário novato detectado. Configurando início...");
            
            btnAcao.textContent = "Começar do Início (Prefácio) 🚀";
            btnAcao.className = "btn btn-primary btn-lg w-100 fw-bold"; // Cor de destaque (Azul)
            
            // O caminho precisa subir um nível se a dashboard estiver em /auth/
            btnAcao.onclick = () => {
                window.location.href = "auth/1a-prefacio.html";
            };
        } 
        // CONDIÇÃO PARA USUÁRIO VETERANO (Já tem progresso)
        else {
            console.log(`📈 Usuário com ${progresso.completed} aulas concluídas.`);
            
            btnAcao.textContent = `Continuar de onde parei (${progresso.percentage}%)`;
            btnAcao.className = "btn btn-success btn-lg w-100 fw-bold"; // Cor de progresso (Verde)
            
            // Usa a URL salva pela VPS ou volta para a introdução por segurança
            btnAcao.onclick = () => {
                window.location.href = progresso.last_lesson_url || "auth/2-introduction.html";
            };
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