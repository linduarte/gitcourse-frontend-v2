// Last update: May 04, 2026 – 17:44
// git-course-functions.js — versão revisada por Copilot — 2026-05-04

import { CONFIG } from './config.js';

const API_URL = CONFIG.API_URL;

/**
 * Registra o progresso de uma aula e avança para a próxima.
 * @param {number} topicId - ID da aula atual (1..16)
 * @param {string|null} proximaAula - Caminho relativo da próxima aula
 */
export async function registrarEAvancar(topicId, proximaAula) {

    const token = localStorage.getItem("access_token");

    // Visitante → apenas navega
    if (!token) {
        console.warn("⚠️ Visitante: progresso não será registrado.");
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

        if (response.ok) {
            console.log(`✅ Progresso registrado (topic_id=${topicId})`);

            if (proximaAula) {
                setTimeout(() => {
                    window.location.href = proximaAula;
                }, 600);
            }
            return;
        }

        if (response.status === 401) {
            console.error("❌ Sessão expirada.");
            alert("Sua sessão expirou. Faça login novamente.");
            window.location.href = `${CONFIG.REPO_BASE}auth/login.html`;
            return;
        }

        console.error(`❌ Erro ao registrar progresso: ${response.status}`);
        if (proximaAula) window.location.href = proximaAula;

    } catch (error) {
        console.error("💥 Erro de rede:", error);
        if (proximaAula) window.location.href = proximaAula;
    }
}

/**
 * Logout universal
 */
export function logout() {
    console.log("🔐 Encerrando sessão...");

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");

    window.location.href = `${CONFIG.REPO_BASE}index.html`;
}

window.logout = logout;

/**
 * Obtém o resumo do progresso do backend
 */
export async function getProgress() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("Token não encontrado");
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
            console.error("❌ Sessão expirada ao buscar progresso.");
            window.location.href = `${CONFIG.REPO_BASE}auth/login.html`;
            return;
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Erro ao buscar progresso:", error);
        throw error;
    }
}
