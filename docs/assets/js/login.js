// Last update: May 04, 2026 – 17:52
// login.js — Revisado por Copilot — 2026-05-04

import { CONFIG } from "./config.js";

const USE_MOCK = false;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Preencha email e senha.");
            return;
        }

        // Validação simples de email
        if (!email.includes("@") || !email.includes(".")) {
            alert("Digite um email válido.");
            return;
        }

        const btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        btn.textContent = "Entrando...";

        try {
            // ---------------------------------------------------------
            // 🔹 MODO MOCK
            // ---------------------------------------------------------
            if (USE_MOCK) {
                console.log("🔥 MODO MOCK: login simulado");

                localStorage.setItem("access_token", "mock_token_123");
                localStorage.setItem("user_email", email);

                window.location.href = `${CONFIG.REPO_BASE}dashboard.html`;
                return;
            }

            // ---------------------------------------------------------
            // 🔹 LOGIN REAL (FastAPI)
            // ---------------------------------------------------------
            const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            let data = null;
            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (response.ok && data.access_token) {
                console.log("✅ Login efetuado:", email);

                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user_email", email);

                window.location.href = `${CONFIG.REPO_BASE}dashboard.html`;
                return;
            }

            // ---------------------------------------------------------
            // 🔹 Falha no login
            // ---------------------------------------------------------
            const msg =
                typeof data?.detail === "string"
                    ? data.detail
                    : "Credenciais inválidas.";

            alert(msg);

            btn.disabled = false;
            btn.textContent = "Entrar";

        } catch (err) {
            console.error("❌ Erro no login:", err);
            alert("Não foi possível conectar ao servidor.");
            btn.disabled = false;
            btn.textContent = "Entrar";
        }
    });
});
