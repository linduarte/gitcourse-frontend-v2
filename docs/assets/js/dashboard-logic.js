/**
 * dashboard-logic.js
 * Motor de busca de dados (Perfil e Progresso) na VPS.
 * Charles Duarte - v2.0 Modular
 */
import { API_URL } from "./config.js";

// Variável de estado interna para o Token
let token = null;

/**
 * FUNÇÃO PRINCIPAL: Inicializa os dados globais do Dashboard
 */
export async function inicializarDashboard() {
    const emailDisplay = document.getElementById("userEmailDisplay");
    const welcomeMsg = document.getElementById("welcomeMessage");

    token = localStorage.getItem("access_token");

    if (!token) {
        console.warn("⚠️ Sessão não encontrada. Redirecionando...");
        window.location.href = "auth/login.html";
        return;
    }

    try {
        // 1. Busca Identidade do Usuário (E-mail da Ana)
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            if (emailDisplay) emailDisplay.textContent = user.email;
            if (welcomeMsg) welcomeMsg.textContent = "Sincronizado com a VPS.";
            localStorage.setItem("user_email", user.email);
        } else {
            throw new Error("Sessão expirada");
        }
    } catch (error) {
        console.error("❌ Erro na inicialização de dados:", error);
        localStorage.clear();
        window.location.href = "auth/login.html";
    }
}

/**
 * FUNÇÃO DE APOIO: Busca o resumo de progresso do aluno
 * Esta função será chamada pelas Views conforme necessário.
 */
export async function buscarProgressoAPI() {
    try {
        const response = await fetch(`${API_URL}/progress/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error("Erro ao buscar progresso:", error);
    }
    return { completed: 0, total: 17, percentage: 0 };
}