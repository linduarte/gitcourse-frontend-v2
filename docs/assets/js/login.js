// login.js - suporte a MOCK
// Abril 2026 – versão SPA + mock
// 🔹 USE_MOCK = true → simula login
// 🔹 USE_MOCK = false → faz login real via API
// Last update: May 02, 2026 – 17:07

import { CONFIG } from "./config.js"; // caminho relativo conforme sua estrutura
import { login as loginAPI } from "./git-course-functions.js";

const USE_MOCK = true; // 🔥 controle central

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
            if (USE_MOCK) {
                // 🔹 Login simulado
                console.log("🔥 MODO MOCK: login simulado");
                localStorage.setItem("access_token", "mock_token_123");
                localStorage.setItem("user_email", email);

                setTimeout(() => {
                    window.location.href = CONFIG.REPO_BASE + "dashboard.html";
                }, 500);
                return;
            }

            // 🔹 Login real via API
            const success = await loginAPI(email, password, CONFIG.API_URL);

            if (success) {
                console.log("✅ Login efetuado:", email);
                localStorage.setItem("user_email", email);
                window.location.href = CONFIG.REPO_BASE + "dashboard.html";
            } else {
                alert("Login falhou. Verifique suas credenciais.");
                btn.disabled = false;
                btn.textContent = "Entrar";
            }

        } catch (err) {
            console.error("❌ Erro no login:", err);
            alert("Erro ao tentar logar. Veja o console.");
            btn.disabled = false;
            btn.textContent = "Entrar";
        }
    });
});