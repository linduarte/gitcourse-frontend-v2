// home-view.js - SPA Dashboard Home (Refatorada FINAL)
// Abril 2026 – alinhada com LESSON_TO_TOPIC
// Last update: April 24, 2026 – 17:03

import { navegar, LESSON_TO_TOPIC } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';
import { CONFIG } from '../config.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
        this.redirecting = false;
    }

    async render() {
        if (!this.container) return;

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

            this.renderDashboard(progresso);

        } catch (err) {
            console.error("❌ Erro API:", err);
            this.container.innerHTML = `<h2>Erro ao carregar dados</h2>`;
        }
    }

    renderDashboard(progresso) {
        const pendingRaw = progresso?.pending_topics || [];

        // 🔥 Mapeamento definitivo (backend → frontend)
        const pending = pendingRaw.map(id => {
            if (id === 17) return "2";   // ex-17 → aula 2
            if (id === 2) return "2a";   // ex-2 → aula 2a
            return id;
        });

        // 🔥 TOTAL FIXO (regra de negócio)
        const TOTAL_AULAS = 16;

        const completed = progresso?.actual_count || 0;
        const percent = Math.round((completed / TOTAL_AULAS) * 100);

        const email = localStorage.getItem("user_email") || "usuário";
        const nome = email.split("@")[0];

        this.container.innerHTML = `
            <div class="fade-in">
                <h2>Bem-vindo, ${nome}!</h2>

                <p id="mensagem-status"></p>

                <div class="progress-box">
                    <p>Progresso: ${completed} / ${TOTAL_AULAS} (${percent}%)</p>
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

        // 🎯 Mensagem
        if (percent === 100) {
            mensagem.textContent = "🏆 Curso concluído!";
        } else if (percent >= 50) {
            mensagem.textContent = "🚀 Excelente progresso!";
        } else {
            mensagem.textContent = "💡 Continue sua jornada!";
        }

        // 🎯 Botão principal
        if (pending.length === 0) {
            btn.textContent = "Ver progresso";
            btn.onclick = () => navegar("progresso", true);
        } else {
            const aula = pending[0];

            const destino =
                (aula === "1" || aula === "1a")
                    ? "lesson:1a"
                    : `lesson:${aula}`;

            btn.textContent = `Continuar aula ${aula}`;
            btn.onclick = () => navegar(destino, true);
        }

        // ⚠️ Lacunas
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

                    const destino =
                        (aula === "1" || aula === "1a")
                            ? "lesson:1a"
                            : `lesson:${aula}`;

                    navegar(destino, true);
                };
            });
        }
    }
}