// Last update: May 03, 2026 – 09:37
// dashboard-app.js - SPA Dashboard (Refatorado + integração real com FastAPI)

import { getProgress, logout } from "./git-course-functions.js";
import { CONFIG } from "./config.js";
import { HomeView } from "./views/home-view.js";

const USE_MOCK = false; // 🔥 true → usa dados simulados

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔥 dashboard-app carregado");

    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    // 🔒 Usuário não autenticado → redirect login
    if (!token || !email) {
        console.warn("⚠️ Usuário não autenticado → login");
        window.location.href = CONFIG.REPO_BASE + "auth/login.html";
        return;
    }

    // Mostra e-mail no header
    const userSpan = document.getElementById("userEmailDisplay");
    if (userSpan) userSpan.textContent = email;

    const homeView = new HomeView();

    // ---------------------------------------------------------
    // 🔹 MODO MOCK
    // ---------------------------------------------------------
    if (USE_MOCK) {
        console.log("🔥 MODO MOCK: carregando progresso simulado");

        const progressoMock = {
            actual_count: 5,
            total: 15,
            percentage: 33,
            pending_topics: ["6", "7", "8"]
        };

        homeView.atualizarUI(progressoMock);
        return;
    }

    // ---------------------------------------------------------
    // 🔹 PROGRESSO REAL VIA API
    // ---------------------------------------------------------
    try {
        console.log("📡 chamando getProgress...");
        const progresso = await getProgress(); // não precisa passar API_URL
        console.log("✅ progresso carregado:", progresso);

        homeView.atualizarUI(progresso);

    } catch (err) {
        console.error("❌ erro ao carregar progresso:", err);

        // Se o erro for 401 → sessão expirada
        if (String(err).includes("401")) {
            console.warn("⚠️ Sessão expirada → logout");
            logout(CONFIG.REPO_BASE + "auth/login.html");
            return;
        }

        // Fallback visual
        const container = document.getElementById("spa-content");
        if (container) {
            container.innerHTML = `
                <h2 style="color:#c00;">Erro ao carregar dados</h2>
                <p>Tente novamente mais tarde.</p>
            `;
        }

        const msgBox = document.getElementById("mensagem-status");
        if (msgBox) msgBox.textContent = "⚠️ Sem conexão com servidor";
    }
});
