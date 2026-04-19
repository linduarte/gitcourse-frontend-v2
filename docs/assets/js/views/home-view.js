import { navegar } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
    }

    async render() {
        if (!this.container) return;

        // Render inicial
        this.container.innerHTML = `
            <div class="fade-in">
                <h2 id="welcome-user">Carregando...</h2>

                <div id="progress-box" class="progress-box">
                    <p id="progress-text">Calculando progresso...</p>
                    <div class="progress-bar">
                        <div id="progress-fill" class="progress-fill"></div>
                    </div>
                </div>

                <div class="card">
                    <button id="btn-continuar">
                        ⏳ Carregando progresso...
                    </button>
                </div>
            </div>
        `;

        await new Promise(r => requestAnimationFrame(r));

        await this.carregarDados();
    }

    async carregarDados() {
        try {
            const progresso = await getProgress();

            console.log("🔥 DADOS RECEBIDOS DO BACKEND:", progresso);

            this.atualizarUI(progresso);

        } catch (err) {
            console.error("Erro API:", err);

            this.container.innerHTML = `
                <h2>Erro ao conectar com servidor</h2>
            `;
        }
    }

    atualizarUI(progresso) {
        const btn = document.getElementById("btn-continuar");
        const welcome = document.getElementById("welcome-user");
        const progressText = document.getElementById("progress-text");
        const progressFill = document.getElementById("progress-fill");

        const nome = localStorage.getItem("user_name") || "Engenheiro";

        if (welcome) {
            welcome.textContent = `Bem-vindo, ${nome}!`;
        }

        // =========================
        // 🔥 NORMALIZAÇÃO DE DADOS
        // =========================

        let pending = progresso?.pending_topics || [];

        console.log("📊 progresso bruto:", progresso);

        // 🔥 Novo usuário (fallback)
        if (!pending || pending.length === 0) {
            console.warn("⚠️ Novo usuário detectado");
            pending = ["1a"];
        }

        // 🔥 Remove aula 1 e 17 da lógica de progresso
        pending = pending.filter(a => {
            const n = Number(a);
            return n >= 2 && n <= 16;
        });

        console.log("📊 pending após filtro:", pending);

        // =========================
        // 📊 CÁLCULO DE PROGRESSO
        // =========================

        const TOTAL_AULAS = 15; // aulas 2 → 16

        const completed = TOTAL_AULAS - pending.length;
        const percent = Math.floor((completed / TOTAL_AULAS) * 100);

        if (progressText) {
            progressText.textContent = `Progresso: ${completed} / ${TOTAL_AULAS} aulas (${percent}%)`;
        }

        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }

        if (!btn) return;

        // =========================
        // 🎯 LÓGICA DE NAVEGAÇÃO
        // =========================

        // 🔥 Novo usuário → sempre prefácio
        if (pending[0] === "1a") {
            btn.textContent = "Iniciar Jornada Git";
            btn.onclick = () => navegar("lesson:1a", true);
            return;
        }

        // 🔥 Curso concluído
        if (pending.length === 0) {
            btn.textContent = "Curso Concluído 🎉";
            btn.onclick = () => navegar("progresso", true);
            return;
        }

        // 🔥 Fluxo normal
        const aula = pending[0];

        console.log("🎯 Próxima aula:", aula);

        btn.textContent = `Retomar Aula ${aula}`;
        btn.onclick = () => navegar(`lesson:${aula}`, true);
    }
}