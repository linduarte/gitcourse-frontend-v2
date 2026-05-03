// Last update: May 03, 2026 – 09:43
// register.js – Registro real via FastAPI (JSON)

import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const msg = document.getElementById("registerMessage");
    const btn = form?.querySelector("button[type=submit]");

    if (!form || !emailInput || !passwordInput || !msg || !btn) {
        console.error("❌ Elementos do registro não encontrados");
        return;
    }

    emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // 🔐 Validação simples de senha
        if (password.length < 6 || !/[a-zA-Z]/.test(password)) {
            msg.style.color = "#f87171";
            msg.textContent = "Senha inválida (mínimo 6 caracteres e 1 letra).";
            return;
        }

        btn.disabled = true;
        btn.textContent = "Registrando...";
        msg.style.color = "#9ca3af";
        msg.textContent = "Criando conta...";

        try {
            const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    is_active: true
                })
            });

            const data = await response.json();

            if (!response.ok) {
                msg.style.color = "#f87171";
                msg.textContent = data.detail || "Erro ao registrar.";
                btn.disabled = false;
                btn.textContent = "Registrar";
                return;
            }

            // 💾 Salva email (UX)
            localStorage.setItem("user_email", email);

            msg.style.color = "#4ade80";
            msg.textContent = "Conta criada! Redirecionando...";

            // 🔐 Redireciona para o prefácio usando COURSE_BASE
            setTimeout(() => {
                window.location.href = `${CONFIG.COURSE_BASE}1a-prefacio.html`;
            }, 800);

        } catch (err) {
            console.error("💥 Erro de rede:", err);
            msg.style.color = "#f87171";
            msg.textContent = "Erro ao conectar ao servidor.";
            btn.disabled = false;
            btn.textContent = "Registrar";
        }
    });
});
