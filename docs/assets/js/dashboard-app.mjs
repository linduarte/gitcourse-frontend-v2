// dashboard-app.mjs

console.log("🔥 dashboard-app carregado");

import { getProgress } from "./git-course-functions.mjs";

export async function bootDashboard() {
    console.log("🚀 bootDashboard iniciado");

    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    console.log("🔐 token:", token);
    console.log("👤 email:", email);

    if (!token) {
        console.warn("⚠️ Sem token → redirecionar login");
        return;
    }

    // mostra usuário
    document.getElementById("userEmailDisplay").textContent = email || "aluno";

    try {
        console.log("📡 chamando getProgress...");
        const progresso = await getProgress();

        console.log("✅ progresso:", progresso);

        renderDashboard(progresso);

    } catch (err) {
        console.error("❌ erro ao carregar progresso:", err);
        document.getElementById("spa-content").innerHTML =
            "<h2>Erro ao carregar dados</h2>";
    }
}

function renderDashboard(progresso) {
    const container = document.getElementById("spa-content");

    const completed = progresso?.actual_count || 0;

    container.innerHTML = `
        <h2>Seu progresso</h2>
        <p>Aulas concluídas: ${completed}</p>
    `;

    console.log("🎯 dashboard renderizado");
}