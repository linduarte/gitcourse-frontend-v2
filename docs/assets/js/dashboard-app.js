// Last update: May 02, 2026 – 17:50
// dashboard-app.js - SPA Dashboard (Refatorado com MOCK)
// Maio 2026 – Alinhado com home-view.js e login.js

import { getProgress } from "./git-course-functions.js";
import { CONFIG } from "./config.js";
import { HomeView } from "./views/home-view.js";

const USE_MOCK = false; // 🔥 true → usa dados simulados, false → API real

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔥 dashboard-app carregado");

    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    console.log("🔐 token:", token);
    console.log("👤 email:", email);

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

    // 🔹 Carrega progresso real
    try {
        console.log("📡 chamando getProgress...");
        const progresso = await getProgress(CONFIG.API_URL);
        console.log("✅ progresso carregado:", progresso);

        homeView.atualizarUI(progresso);

    } catch (err) {
        console.error("❌ erro ao carregar progresso:", err);
        const container = document.getElementById("spa-content");
        if (container) {
            container.innerHTML = `<h2>Erro ao carregar dados</h2>`;
        }
        const msgBox = document.getElementById("mensagem-status");
        if (msgBox) msgBox.textContent = "⚠️ Sem conexão com servidor";
    }
});