import { navegar, LESSONS } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
        this.redirecting = false; // 🔒 evita múltiplos redirects
    }

    async render() {
        if (!this.container) return;

        this.container.innerHTML = `
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

        await new Promise(r => requestAnimationFrame(r));
        await this.carregarDados();
    }

    async carregarDados() {
        try {
            const progresso = await getProgress();
            console.log("🔥 BACKEND:", progresso);
            this.atualizarUI(progresso);

        } catch (err) {
            console.error("Erro API:", err);
            this.container.innerHTML = `<h2>Erro ao conectar com servidor</h2>`;
        }
    }

    atualizarUI(progresso) {
        const btn = document.getElementById("btn-continuar");
        const welcome = document.getElementById("welcome-user");
        const progressText = document.getElementById("progress-text");
        const progressFill = document.getElementById("progress-fill");
        const lacunasBox = document.getElementById("lacunas-box");
        const mensagemBox = document.getElementById("mensagem-status");

        // =========================
        // 👤 NOME DO USUÁRIO
        // =========================
        const email = localStorage.getItem("user_email") || "usuário";
        const nomeBase = email.split("@")[0];
        const nomeLimpo = nomeBase.replace(/[._]/g, " ");
        const nome = nomeLimpo.charAt(0).toUpperCase() + nomeLimpo.slice(1);

        if (welcome) {
            welcome.textContent = `Bem-vindo, ${nome}!`;
        }

        // =========================
        // 📊 DADOS BACKEND
        // =========================
        const pending = progresso?.pending_topics || [];
        const total = progresso?.total || 15;
        const completed = progresso?.actual_count || 0;
        const percent = progresso?.percentage || 0;

        // =========================
        // 🚀 NOVO USUÁRIO → PREFÁCIO
        // =========================
        if (!pending.length && !this.redirecting) {
            this.redirecting = true;

            setTimeout(() => {
                alert("Bem-vindo ao Git Course! Vamos começar pelo Prefácio 🚀");
                window.location.href = "curso/git-course/1a-prefacio.html";
            }, 300);

            return;
        }

        // =========================
        // 💬 MENSAGEM DINÂMICA
        // =========================
        let mensagem = "👋 Bem-vindo! Vamos começar sua jornada!";

        if (percent === 100) {
            mensagem = "🏆 Parabéns! Você concluiu o curso!";
        } else if (percent >= 80) {
            mensagem = "🔥 Você está muito perto de concluir!";
        } else if (percent >= 50) {
            mensagem = "🚀 Excelente progresso, continue assim!";
        } else if (percent > 0) {
            mensagem = "💡 Continue avançando, você está no caminho certo!";
        }

        if (mensagemBox) {
            mensagemBox.textContent = mensagem;
            mensagemBox.className = "mensagem-status";

            if (percent === 100) mensagemBox.classList.add("sucesso");
            else if (percent >= 80) mensagemBox.classList.add("alerta");
            else if (percent >= 50) mensagemBox.classList.add("progresso");
            else mensagemBox.classList.add("inicio");
        }

        // =========================
        // 📊 PROGRESSO VISUAL
        // =========================
        if (progressText) {
            progressText.textContent = `Progresso: ${completed} / ${total} aulas (${percent}%)`;
        }

        if (progressFill) {
            progressFill.style.width = "0%";
            setTimeout(() => {
                progressFill.style.width = `${percent}%`;
            }, 150);
        }

        // =========================
        // 🎯 BOTÃO PRINCIPAL
        // =========================
        if (!btn) return;

        if (pending.length === 0) {
            btn.textContent = "Curso Concluído 🎉";
            btn.onclick = () => navegar("progresso", true);
        } else {
            const aula = pending[0];

            btn.textContent = aula === "1a"
                ? "Iniciar Jornada Git"
                : `Retomar Aula ${aula}`;

            btn.onclick = () => navegar(`lesson:${aula}`, true);
        }

        // =========================
        // 🎨 LACUNAS VISUAIS
        // =========================
        const getLessonName = (id) => {
            const file = LESSONS.find(f => f.startsWith(`${id}-`));
            return file
                ?.replace('.html', '')
                ?.replace(/^\d+-?/, '')
                ?.replace(/-/g, ' ') || `Aula ${id}`;
        };

        const formatName = (name) =>
            name.replace(/\b\w/g, c => c.toUpperCase());

        if (lacunasBox && pending.length > 0) {
            lacunasBox.innerHTML = `
                <div class="lacunas-card">
                    <h3>⚠️ Continue sua jornada</h3>
                    <p>Você pulou algumas etapas importantes:</p>
                    <div class="lacunas-list">
                        ${pending.map(a => `
                            <button class="lacuna-btn" data-aula="${a}">
                                Aula ${a} - ${formatName(getLessonName(a))}
                            </button>
                        `).join("")}
                    </div>
                </div>
            `;

            lacunasBox.querySelectorAll(".lacuna-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    navegar(`lesson:${btn.dataset.aula}`, true);
                });
            });

        } else if (lacunasBox) {
            lacunasBox.innerHTML = "";
        }
    }
}