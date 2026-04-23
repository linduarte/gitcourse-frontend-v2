// home-view.js - versão final alinhada com arquitetura SPA
// Last update: April 23, 2026 – 17:26
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

        // 🔹 Render inicial (evita flicker)
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
            const progresso = await getProgress(); // ✅ NÃO usa mais CONFIG.API_URL
            console.log("🔥 BACKEND:", progresso);

            const completed = progresso?.actual_count || 0;

            // 🔥 NOVO ALUNO → PREFÁCIO
            if (completed === 0 && !this.redirecting) {
                this.redirecting = true;

                console.log("🚀 Novo aluno → Prefácio");

                window.location.replace(
                    CONFIG.REPO_BASE + "1a-prefacio.html"
                );
                return;
            }

            // 👉 Aluno com progresso → Dashboard
            this.renderDashboard(progresso);

        } catch (err) {
            console.error("❌ Erro API:", err);
            this.container.innerHTML = `<h2>Erro ao carregar dados</h2>`;
        }
    }

    renderDashboard(progresso) {
        // 🔥 IMPORTANTE: remove sub-aula 17 das lacunas
        const pendingRaw = progresso?.pending_topics || [];
        const pending = pendingRaw.filter(t => t !== 17);

        const total = progresso?.total || LESSONS.length;
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

            // 🔥 tratamento especial aula 1
            const destino = (aula === 1)
                ? "lesson:1a"
                : `lesson:${aula}`;

            btn.textContent = `Continuar aula ${aula}`;
            btn.onclick = () => navegar(destino, true);
        }

        // ⚠️ Lacunas (ignorando sub-aula 17)
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

                    const destino = (aula === "1")
                        ? "lesson:1a"
                        : `lesson:${aula}`;

                    navegar(destino, true);
                };
            });
        }
    }
}