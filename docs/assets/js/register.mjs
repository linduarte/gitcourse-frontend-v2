// register.js
import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const resultEl = document.getElementById("result");
    const btn = form.querySelector("button[type=submit]");

    if (!form || !emailInput || !passwordInput || !resultEl || !btn) {
        console.error("❌ Elementos do registro não encontrados");
        return;
    }

    emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validação simples de senha
        if (password.length < 6 || !/[a-zA-Z]/.test(password)) {
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Senha inválida (mínimo 6 caracteres e 1 letra).";
            return;
        }

        btn.disabled = true;
        btn.textContent = "Registrando...";
        resultEl.style.color = "#9ca3af";
        resultEl.textContent = "Criando conta...";

        try {
            // 🧾 Registro
            const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                resultEl.style.color = "#f87171";
                resultEl.textContent = data.detail || "Erro ao registrar.";
                btn.disabled = false;
                btn.textContent = "Registrar";
                return;
            }

            // 💾 Salva email (UX)
            localStorage.setItem("user_email", email);

            resultEl.style.color = "#4ade80";
            resultEl.textContent = "Conta criada! Redirecionando para o Prefácio...";

            // 🔐 Redireciona **fixo** para o prefácio
            setTimeout(() => {
                window.location.href = `${CONFIG.REPO_BASE}1a-prefacio.html`;
            }, 800);

        } catch (err) {
            console.error("💥 Erro de rede:", err);
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar ao servidor.";
            btn.disabled = false;
            btn.textContent = "Registrar";
        }
    });
});