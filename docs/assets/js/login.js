// login.js FINAL
import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const resultEl = document.getElementById("result");
    const btn = document.getElementById("btn-login");

    if (!form || !emailInput || !passwordInput || !resultEl || !btn) {
        console.error("❌ Elementos do login não encontrados");
        return;
    }

    // 💾 UX
    const savedEmail = localStorage.getItem("user_email");
    if (savedEmail) emailInput.value = savedEmail;

    emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        btn.disabled = true;
        btn.textContent = "Entrando...";
        resultEl.style.color = "#9ca3af";
        resultEl.textContent = "Autenticando...";

        try {
            // 🔐 LOGIN
            const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.access_token) {
                throw new Error(data.detail || "Login inválido");
            }

            // 💾 salva sessão
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user_email", email);

            resultEl.style.color = "#4ade80";
            resultEl.textContent = "Login realizado!";

            // =========================
            // 🔥 DECISÃO BASEADA EM PROGRESSO
            // =========================
            const progressRes = await fetch(`${CONFIG.API_URL}/progress/summary`, {
                headers: {
                    "Authorization": `Bearer ${data.access_token}`
                }
            });

            const progress = await progressRes.json();

            if (!progressRes.ok || !progress || progress.actual_count === 0) {

                // 🚀 NOVO ALUNO → PREFÁCIO
                window.location.href =
                    `${CONFIG.REPO_BASE}1a-prefacio.html`;

            } else {

                // 📊 ALUNO COM PROGRESSO → DASHBOARD
                window.location.href = "../dashboard.html";
            }

        } catch (err) {
            console.error("💥 Erro login:", err);

            resultEl.style.color = "#f87171";
            resultEl.textContent = err.message || "Erro ao conectar.";

            btn.disabled = false;
            btn.textContent = "Entrar";
        }
    });
});