// Last update: May 19, 2026 – 15:38
// git-course-functions.js — Versão Consolidada 2026-05-15
// Foco: Estabilidade de Sessão e Comunicação DuckDNS

import { CONFIG } from '../config.js?v=2026-05-19-v9';

const API_URL = CONFIG.API_URL;

/**
 * Registra o progresso de uma aula e avança para a próxima.
 */
export async function registrarEAvancar(topicId, proximaAula) {
    const token = localStorage.getItem("access_token");

    // Visitante → apenas navega sem registrar
    if (!token) {
        console.warn("⚠️ Visitante detectado: progresso não será registrado.");
        if (proximaAula) window.location.href = proximaAula;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/progress/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                topic_id: Number(topicId)
            })
        });

        // 401: Token expirado ou inválido
        if (response.status === 401) {
            tratarSessaoExpirada();
            return;
        }

        if (response.ok) {
            console.log(`✅ Sucesso: Aula ${topicId} registrada.`);
        } else {
            console.error(`❌ Falha no registro (Status: ${response.status})`);
        }

        // Navega para a próxima aula independente do sucesso do registro (melhor UX)
        if (proximaAula) {
            setTimeout(() => { window.location.href = proximaAula; }, 500);
        }

    } catch (error) {
        console.error("💥 Falha crítica de comunicação:", error);
        if (proximaAula) window.location.href = proximaAula;
    }
}

/**
 * Obtém o resumo do progresso do backend
 */
export async function getProgress() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("Não autenticado");
    }

    try {
        const response = await fetch(`${API_URL}/progress/summary`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            tratarSessaoExpirada();
            return null;
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        return await response.json();

    } catch (error) {
        console.error("❌ Erro ao buscar progresso:", error);
        // Retorna um objeto básico para não quebrar a UI
        return { actual_count: 0, percentage: 0, pending_topics: [] };
    }
}

/**
 * Logout Universal
 */
export function logout() {
    console.log("🔐 Encerrando sessão e limpando storage...");
    localStorage.clear(); // Limpa TUDO para segurança máxima
    window.location.href = `${CONFIG.REPO_BASE}index.html`;
}

/**
 * Auxiliar para Sessão Expirada
 */
function tratarSessaoExpirada() {
    console.error("❌ Sessão expirada.");
    localStorage.removeItem("access_token");
    alert("Sua sessão expirou. Por favor, faça login novamente.");
    window.location.href = `${CONFIG.REPO_BASE}auth/login.html`;
}

// Expõe logout globalmente para botões státicos (onclick)
window.logout = logout;

// Expõe suporte globalmente para botões estáticos (onclick)
export function openSuporte() {
    if (CONFIG.FORUM_SUPORTE) {
        window.open(CONFIG.FORUM_SUPORTE, '_blank');
    } else {
        console.error("Link de suporte não configurado no CONFIG.");
    }
}

/**
 * Apelido de compatibilidade (Alias) para manter suporte às páginas 
 * que ainda importam e chamam o termo "marcarConcluido".
 */
export async function marcarConcluido(topicId) {
    // Repassa os dados internamente para a função nova
    return await registrarEAvancar(topicId, null);
}