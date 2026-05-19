// Last update: May 19, 2026 – 15:43
// login.js — Versão Consolidada 2026-05-15
// Foco: Direcionamento inteligente e persistência de sessão

import { CONFIG } from "../config.js?v=2026-05-9-v9";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const btnSubmit = e.target.querySelector('button[type="submit"]');

    // Feedback visual de carregamento
    if (btnSubmit) btnSubmit.disabled = true;

    try {
        // 1. Autenticação
        const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.detail || "Credenciais inválidas. Verifique seu email e senha.");
            if (btnSubmit) btnSubmit.disabled = false;
            return;
        }

        // 2. Persistência de Dados
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_email", email);

        // 3. Verificação de Perfil (Novo vs Ativo)
        // Usamos o sumário para ser mais rápido e consistente
        const progRes = await fetch(`${CONFIG.API_URL}/progress/summary`, {
            headers: { "Authorization": `Bearer ${data.access_token}` }
        });

        if (progRes.ok) {
            const progresso = await progRes.json();

            // 🟢 Lógica de Direcionamento Assertivo
            if (!progresso || progresso.actual_count === 0) {
                // Novo usuário ou sem aulas concluídas -> Onboarding no Prefácio
                console.log("🚀 Bem-vindo! Iniciando jornada pelo prefácio.");
                window.location.href = `${CONFIG.COURSE_BASE}1a-prefacio.html`;
            } else {
                // Usuário com histórico -> Cockpit direto
                console.log("🛸 Bem-vindo de volta! Acessando Dashboard.");
                window.location.href = `${CONFIG.REPO_BASE}dashboard.html`;
            }
        } else {
            // Se falhar a busca do progresso, mandamos para o dashboard por segurança
            window.location.href = `${CONFIG.REPO_BASE}dashboard.html`;
        }

    } catch (err) {
        console.error("💥 Falha crítica no login:", err);
        alert("Erro ao conectar com o servidor. Verifique sua internet.");
        if (btnSubmit) btnSubmit.disabled = false;
    }
});