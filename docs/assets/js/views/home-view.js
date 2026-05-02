// home-view.js (refatorado)
// Last update: May 02, 2026 – 10:46

import { navegar, LESSONS } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';

const USE_MOCK = false; // 🔥 controle central

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
    }

    async render() {
        if (!this.container) return;

        this.container.innerHTML = this.template();

        await new Promise(r => requestAnimationFrame(r));
        await this.carregarDados();
    }

    template() {
        return `
            <div class="fade-in">
                <h2 id="welcome-user">Carregando...</h2>
                <p id="mensagem-status" class="mensagem-status"></p>

                <div class="progress-box">
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

                <div id="lacunas-box"></div>
            </div>
        `;
    }

    async carregarDados() {
        try {
            let progresso;

            if (USE_MOCK) {
                console.log("🔥 MODO MOCK ATIVO");

                progresso = {
                    actual_count: 5,
                    total: 15,
                    percentage: 33,
                    pending_topics: ["6", "7", "8"]
                };
            } else {
                progresso = await getProgress();
                console.log("🔥 BACKEND:", progresso);
            }

            this.atualizarUI(progresso);

        } catch (err) {
            console.error("Erro API:", err);
            this.mostrarErro();
        }
    }

    atualizarUI(progresso) {
        const email = localStorage.getItem("user_email") || "usuário";
        const nome = email.split("@")[0];

        this.setText("welcome-user", `Bem-vindo, ${nome}!`);
        this.atualizarMensagem(progresso.percentage);
        this.atualizarBarra(progresso);
        this.configurarBotao(progresso.pending_topics);
        this.renderLacunas(progresso.pending_topics);
    }

    atualizarMensagem(percent = 0) {
        let mensagem = "";

        if (percent === 100) mensagem = "🏆 Parabéns! Você concluiu o curso!";
        else if (percent >= 80) mensagem = "🔥 Você está muito perto de concluir!";
        else if (percent >= 50) mensagem = "🚀 Excelente progresso!";
        else if (percent > 0) mensagem = "💡 Continue avançando!";
        else mensagem = "👋 Vamos começar sua jornada!";

        const box = document.getElementById("mensagem-status");
        if (!box) return;

        box.textContent = mensagem;
        box.className = "mensagem-status";

        if (percent === 100) box.classList.add("sucesso");
        else if (percent >= 80) box.classList.add("alerta");
        else if (percent >= 50) box.classList.add("progresso");
        else box.classList.add("inicio");
    }

    atualizarBarra({ actual_count = 0, total = 15, percentage = 0 }) {
        this.setText("progress-text", `Progresso: ${actual_count} / ${total} aulas (${percentage}%)`);

        const fill = document.getElementById("progress-fill");
        if (!fill) return;

        fill.style.width = "0%";
        setTimeout(() => {
            fill.style.width = `${percentage}%`;
        }, 150);
    }

    configurarBotao(pending = []) {
        const btn = document.getElementById("btn-continuar");
        if (!btn) return;

        if (pending.length === 0) {
            btn.textContent = "Curso Concluído 🎉";
            btn.onclick = () => navegar("progresso", true);
            return;
        }

        const aula = pending[0];

        if (aula === "1a") {
            btn.textContent = "Iniciar Jornada Git";
            btn.onclick = () => navegar("lesson:1a", true);
        } else {
            btn.textContent = `Retomar Aula ${aula}`;
            btn.onclick = () => navegar(`lesson:${aula}`, true);
        }
    }

    renderLacunas(pending = []) {
        const box = document.getElementById("lacunas-box");
        if (!box) return;

        if (pending.length === 0) {
            box.innerHTML = "";
            return;
        }

        box.innerHTML = `
            <div class="lacunas-card">
                <h3>⚠️ Continue sua jornada</h3>
                <p>Você pulou algumas etapas importantes:</p>

                <div class="lacunas-list">
                    ${pending.map(a => `
                        <button class="lacuna-btn" data-aula="${a}">
                            Aula ${a} - ${this.formatLessonName(this.getLessonName(a))}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;

        box.querySelectorAll(".lacuna-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                navegar(`lesson:${btn.dataset.aula}`, true);
            });
        });
    }

    getLessonName(aulaId) {
        const file = LESSONS.find(f => f.startsWith(`${aulaId}-`));
        return file?.replace('.html', '').replace(/^\d+-?/, '').replace(/-/g, ' ') || `Aula ${aulaId}`;
    }

    formatLessonName(name) {
        return name
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    mostrarErro() {
        const box = document.getElementById("mensagem-status");
        if (box) {
            box.textContent = "⚠️ Sem conexão com servidor";
        }
    }

    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
}