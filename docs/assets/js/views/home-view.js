// home-view.js

import { navegar, LESSONS } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';
import { CONFIG } from '../config.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
        this.redirecting = false;
    }

    async render() {
        if (!this.container) return;

        // Render mínimo (evita flicker)
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

            // 🔥 DECISÃO CRÍTICA → NOVO ALUNO
            const completed = progresso?.actual_count || 0;

            if (completed === 0 && !this.redirecting) {
                this.redirecting = true;

                console.log("🚀 Novo aluno → indo direto para Prefácio");

                // 🔥 REDIRECT IMEDIATO (SEM DASHBOARD)
                window.location.replace(
                    CONFIG.REPO_BASE + "1a-prefacio.html"
                );
                return;
            }

            // 👉 Se NÃO for novo aluno → render normal
            this.renderDashboard(progresso);

        } catch (err) {
            console.error("❌ Erro API:", err);
            this.container.innerHTML = `<h2>Erro ao carregar dados</h2>`;
        }
    }

    renderDashboard(progresso) {
        const pending = progresso?.pending_topics || [];
        const total = progresso?.total || 15;
        const completed = progresso?.actual_count || 0;
        const percent = progresso?.percentage || 0;

        // 👤 Nome amigável
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

        // 🎯 Mensagem inteligente
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
            btn.textContent = `Continuar aula ${aula}`;
            btn.onclick = () => navegar(`lesson:${aula}`, true);
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
                btn.onclick = () => navegar(`lesson:${btn.dataset.aula}`, true);
            });
        }
    }
}