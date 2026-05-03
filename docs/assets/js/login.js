
// login.js – SPA + modo mock + compatível com FastAPI (JSON)
// Last update: May 03, 2026 – 09:24

import { CONFIG } from "./config.js";
import { login as loginAPI } from "./git-course-functions.js"; // usado apenas no modo mock

const USE_MOCK = false; // 🔥 alterna entre mock e backend real

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Preencha email e senha");
            return;
        }

        const btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        btn.textContent = "Entrando...";

        try {
            // ---------------------------------------------------------
            // 🔹 MODO MOCK (simulação local, sem backend)
            // ---------------------------------------------------------
            if (USE_MOCK) {
                console.log("🔥 MODO MOCK: login simulado");

                const mock = await loginAPI(email, password); // função mock
                if (!mock?.access_token) {
                    throw new Error("Mock falhou");
                }

                localStorage.setItem("access_token", mock.access_token);
                localStorage.setItem("user_email", email);

                window.location.href = CONFIG.REPO_BASE + "dashboard.html";
                return;
            }

            // ---------------------------------------------------------
            // 🔹 LOGIN REAL (FastAPI exige JSON)
            // ---------------------------------------------------------
            const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.access_token) {
                console.log("✅ Login efetuado:", email);

                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user_email", email);

                window.location.href = CONFIG.REPO_BASE + "dashboard.html";
                return;
            }

            // ---------------------------------------------------------
            // 🔹 Falha no login
            // ---------------------------------------------------------
            console.warn("⚠️ Login falhou:", data);
            alert(data?.detail || "Credenciais inválidas.");
            btn.disabled = false;
            btn.textContent = "Entrar";

        } catch (err) {
            console.error("❌ Erro no login:", err);
            alert("Erro ao tentar logar. Veja o console.");
            btn.disabled = false;
            btn.textContent = "Entrar";
        }
    });
});
