// register.js 2026-04-22 (FINAL - fluxo exclusivo para prefácio)

import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const resultEl = document.getElementById("result");
    const btn = document.getElementById("btn-register");

    // 🔒 validação DOM
    if (!form || !emailInput || !passwordInput || !resultEl || !btn) {
        console.error("❌ Elementos do registro não encontrados");
        return;
    }

    emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // =========================
        // 🔐 Validação simples
        // =========================
        if (password.length < 6 || !/[a-zA-Z]/.test(password)) {
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Senha inválida (mín. 6 caracteres e 1 letra).";
            return;
        }

        // =========================
        // ⏳ Feedback UI
        // =========================
        btn.disabled = true;
        btn.textContent = "Criando conta...";
        resultEl.style.color = "#9ca3af";
        resultEl.textContent = "Registrando...";

        try {
            // =========================
            // 🧾 REGISTRO
            // =========================
            const regRes = await fetch(`${CONFIG.API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!regRes.ok) {
                const err = await regRes.json();
                resultEl.style.color = "#f87171";
                resultEl.textContent = err.detail || "Erro ao registrar.";
                resetBtn();
                return;
            }

            // 💾 salva email
            localStorage.setItem("user_email", email);

            resultEl.style.color = "#4ade80";
            resultEl.textContent = "Conta criada! Entrando...";

            // =========================
            // 🔐 LOGIN AUTOMÁTICO
            // =========================
            const loginRes = await fetch(`${CONFIG.API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!loginRes.ok) {
                console.warn("⚠️ Login falhou após registro");
                window.location.href = "login.html";
                return;
            }

            const loginData = await loginRes.json();

            if (!loginData.access_token) {
                console.warn("⚠️ Token não recebido");
                window.location.href = "login.html";
                return;
            }

            // 💾 salva sessão
            localStorage.setItem("access_token", loginData.access_token);

            // =========================
            // 🚀 REDIRECIONAMENTO FIXO
            // =========================
            window.location.href =
                `${CONFIG.REPO_BASE}1a-prefacio.html`;

        } catch (err) {
            console.error("💥 Erro de rede:", err);
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar ao servidor.";
            resetBtn();
        }

        function resetBtn() {
            btn.disabled = false;
            btn.textContent = "Registrar";
        }
    });
});