// home-view.js - SPA Dashboard Home (Refatorada)
// Last update: April 24, 2026 – Refactor 2a/2 handling
// Last update: April 24, 2026 – 15:21

import { navegar, LESSONS, LESSON_TO_TOPIC } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';
import { CONFIG } from '../config.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
        this.redirecting = false;
    }

    async render() {
        if (!this.container) return;

        // Render inicial (loading)
        this.container.innerHTML = `
            <div class="fade-in">
                <p class="loading-text">Carregando sua jornada técnica...</p>
            </div>
        `;

        await new Promise(r => requestAnimationFrame(r));
        await this.carregarDados();
    }

    async carregarDados() {
        try {
            const progresso = await getProgress(CONFIG.API_URL);
            console.log("🔥 BACKEND:", progresso);

            const completedCount = progresso?.actual_count || 0;

            // 🔥 NOVO ALUNO → Prefácio
            if (completedCount === 0 && !this.redirecting) {
                this.redirecting = true;
                console.log("🚀 Novo aluno → Prefácio");
                window.location.replace(CONFIG.REPO_BASE + "1a-prefacio.html");
                return;
            }

            // Renderiza dashboard
            this.renderDashboard(progresso);

        } catch (err) {
            console.error("❌ Erro API:", err);
            this.container.innerHTML = `<h2>Erro ao carregar dados</h2>`;
        }
    }

    renderDashboard(progresso) {
        const pendingRaw = progresso?.pending_topics || [];

        // ✅ Map 2a e 2 corretamente
        const pending = pendingRaw.map(id => {
            if (id === 17) return "2";    // antiga 17 agora é 2
            if (id === 2) return "2a";    // antiga 2 agora é 2a
            return id;
        });

        const total = 16; // total de aulas considerado
        const completed = progresso?.actual_count || 0;
        const percent = progresso?.percentage || Math.round((completed / total) * 100);

        const email = localStorage.getItem("user_email") || "usuário";
        const nome = email.split("@")[0];

        this.container.innerHTML = `
            <div class="fade-in">
                <h2>Bem-vindo, ${nome}!</h2>

                <p id="mensagem-status"></p>

                <div class="progress-box">
                    <p>Progresso: ${completed} / ${total} (${percent}%)</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${percent}%"></div>
                    </div>
                </div>

                <div class="card">
                    <button id="btn-continuar"></button>
                </div>

                <div id="lacunas-box"></div>
            </div>
        `;

        const btn = document.getElementById("btn-continuar");
        const mensagem = document.getElementById("mensagem-status");
        const lacunasBox = document.getElementById("lacunas-box");

        // Mensagem de status
        if (percent === 100) {
            mensagem.textContent = "🏆 Curso concluído!";
        } else if (percent >= 50) {
            mensagem.textContent = "🚀 Excelente progresso!";
        } else {
            mensagem.textContent = "💡 Continue sua jornada!";
        }

        // Botão principal
        if (pending.length === 0) {
            btn.textContent = "Ver progresso";
            btn.onclick = () => navegar("progresso", true);
        } else {
            const aula = pending[0];
            const destino = (aula === "1" || aula === "1a") ? "lesson:1a" : `lesson:${aula}`;
            btn.textContent = `Continuar aula ${aula}`;
            btn.onclick = () => navegar(destino, true);
        }

        // Lacunas
        if (pending.length > 1) {
            lacunasBox.innerHTML = `
                <p>⚠️ Você pulou etapas:</p>
                ${pending.map(a => `
                    <button class="lacuna-btn" data-aula="${a}">
                        Aula ${a}
                    </button>
                `).join("")}
            `;

            lacunasBox.querySelectorAll(".lacuna-btn").forEach(btn => {
                btn.onclick = () => {
                    const aula = btn.dataset.aula;
                    const destino = (aula === "1" || aula === "1a") ? "lesson:1a" : `lesson:${aula}`;
                    navegar(destino, true);
                };
            });
        }
    }
}