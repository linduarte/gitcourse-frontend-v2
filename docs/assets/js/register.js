// Last update: May 19, 2026 – 15:43
// register.js — Versão Consolidada 2026-05-15
// Foco: Registro de usuário e redirecionamento para login

import { CONFIG } from "../config.js?v=2026-05-19-v9";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const msgBox = document.getElementById("registerMessage");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!form) {
        console.error("❌ Erro: Formulário #registerForm não encontrado!");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const submitBtn = form.querySelector("button[type='submit']");

        if (!msgBox) return;

        // Reset de estado e feedback inicial
        msgBox.textContent = "Processando seu cadastro...";
        msgBox.style.color = "#3b82f6"; // Azul padrão do curso
        if (submitBtn) submitBtn.disabled = true;

        try {
            const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                msgBox.textContent = data.detail || "Erro ao criar conta. Tente outro e-mail.";
                msgBox.style.color = "#ef4444"; // Vermelho erro
                if (submitBtn) submitBtn.disabled = false;
                return;
            }

            // Sucesso
            msgBox.textContent = "Conta criada com sucesso! Redirecionando...";
            msgBox.style.color = "#10b981"; // Verde sucesso

            // Redireciona para o login após breve confirmação visual
            setTimeout(() => {
                window.location.href = `${CONFIG.REPO_BASE}auth/login.html`;
            }, 1500);

        } catch (err) {
            console.error("💥 Falha na comunicação com o servidor:", err);
            msgBox.textContent = "Erro de conexão. Verifique se o backend está online.";
            msgBox.style.color = "#ef4444";
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});