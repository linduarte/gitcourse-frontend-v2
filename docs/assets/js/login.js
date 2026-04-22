// login.js 2026-04-22 (FINAL - ES MODULE)

import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const resultEl = document.getElementById("result");
    const btn = document.getElementById("btn-login");

    // 🔒 validação de DOM
    if (!form || !emailInput || !passwordInput || !btn || !resultEl) {
    console.warn("⚠️ login.js carregado fora da página de login");
    return;
    }

    // 💾 UX — preenche email salvo
    const savedEmail = localStorage.getItem("user_email");
    if (emailInput && savedEmail) {
    emailInput.value = savedEmail;
  }

    emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Preencha email e senha.";
            return;
        }

        btn.disabled = true;
        btn.textContent = "Entrando...";

        resultEl.style.color = "#9ca3af";
        resultEl.textContent = "Autenticando...";

        try {
            const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.access_token) {

                // 💾 salva sessão
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user_email", email);

                resultEl.style.color = "#4ade80";
                resultEl.textContent = "Login realizado com sucesso!";

                // 🚀 REDIRECIONAMENTO INTELIGENTE
                setTimeout(() => {

                    const lastLesson = data.last_lesson || "1a-prefacio.html";

                    window.location.href =
                        `${CONFIG.REPO_BASE}${lastLesson}`;

                }, 800);

            } else {
                resultEl.style.color = "#f87171";
                resultEl.textContent =
                    data.detail || "Email ou senha inválidos.";

                btn.disabled = false;
                btn.textContent = "Entrar";
            }

        } catch (err) {
            console.error("💥 Erro de rede:", err);

            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar ao servidor.";

            btn.disabled = false;
            btn.textContent = "Entrar";
        }
    });
});