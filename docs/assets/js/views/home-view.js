// home-view.js - SPA Dashboard Home (FINAL ESTÁVEL)
// Last update: April 28, 2026 – 07:44

import { navegar } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.mjs?v=1777361682432';
import { CONFIG } from '../config.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
        this.redirecting = false;
    }

    async render() {
        if (!this.container) return;

        // 🔹 Loading inicial
        this.container.innerHTML = `
            <div class="fade-in">
                <p class="loading-text">Carregando sua jornada técnica...</p>
            </div>
        `;

        await new Promise(r => requestAnimationFrame(r));
        await this.carregarDados(); // 🔥 ESSENCIAL
    }

    async carregarDados() {
        try {
            const progresso = await getProgress();
            console.log("🔥 BACKEND:", progresso);

            const completed = progresso?.actual_count || 0;

            // 🔹 Novo aluno → Prefácio
            if (completed === 0 && !this.redirecting) {
                this.redirecting = true;
                console.log("🚀 Novo aluno → Prefácio");
                window.location.replace(CONFIG.REPO_BASE + "1a-prefacio.html");
                return;
            }

            this.renderDashboard(progresso);

        } catch (err) {
            console.error("❌ Erro ao carregar progresso:", err);
            this.container.innerHTML = `<h2>Erro ao carregar dados</h2>`;
        }
    }

    renderDashboard(progresso) {
        const pendingRaw = progresso?.pending_topics || [];

        // 🔥 Mapeamento backend → frontend
        const pending = pendingRaw.map(id => {
            if (id === 17) return "2";   // ex-17 → aula 2
            if (id === 2) return "2a";   // ex-2 → aula 2a
            return id;
        });

        const TOTAL_AULAS = 16;
        const completed = progresso?.actual_count || 0;
        const percent = Math.round((completed / TOTAL_AULAS) * 100);

        const email = localStorage.getItem("user_email") || "usuário";
        const nome = email.split("@")[0];

        this.container.innerHTML = `
            <div class="fade-in">
                <h2>Bem-vindo, ${nome}!</h2>

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
        const lacunasBox = document.getElementById("lacunas-box");

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