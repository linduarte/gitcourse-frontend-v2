// Last update: May 04, 2026 – 17:47
// home-view.js — Revisado por Copilot — 2026-05-04

import { navegar, LESSONS } from '../../dashboard-router.js';
import { getProgress } from '../../git-course-functions.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
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
            this.atualizarUI(progresso);

        } catch (err) {
            console.error("Erro API:", err);

            if (this.container) {
                this.container.innerHTML = `
                    <h2>Erro ao conectar com servidor</h2>
                    <p>Tente novamente mais tarde.</p>
                `;
            }
        }
    }

    atualizarUI(progresso) {
        const btn = document.getElementById("btn-continuar");
        const welcome = document.getElementById("welcome-user");
        const progressText = document.getElementById("progress-text");
        const progressFill = document.getElementById("progress-fill");
        const lacunasBox = document.getElementById("lacunas-box");
        const mensagemBox = document.getElementById("mensagem-status");

        // 👤 Nome via email
        const email = localStorage.getItem("user_email") || "usuário";
        const nome = email.split("@")[0];

        if (welcome) {
            welcome.textContent = `Bem-vindo, ${nome}!`;
        }

        // 📊 Dados do backend
        const pendingIds = (progresso?.pending_topics || []).map(n => Number(n));
        const total = progresso?.total || 16;
        const completed = progresso?.actual_count || 0;
        const percent = progresso?.percentage || 0;

        // 🧠 Mensagem de status
        let mensagem = "";

        if (percent === 100) {
            mensagem = "🏆 Parabéns! Você concluiu o curso!";
        } else if (percent >= 80) {
            mensagem = "🔥 Você está muito perto de concluir!";
        } else if (percent >= 50) {
            mensagem = "🚀 Excelente progresso, continue assim!";
        } else if (percent > 0) {
            mensagem = "💡 Continue avançando, você está no caminho certo!";
        } else {
            mensagem = "👋 Bem-vindo! Vamos começar sua jornada!";
        }

        if (mensagemBox) {
            mensagemBox.textContent = mensagem;
            mensagemBox.className = "mensagem-status";

            if (percent === 100) {
                mensagemBox.classList.add("sucesso");
            } else if (percent >= 80) {
                mensagemBox.classList.add("alerta");
            } else if (percent >= 50) {
                mensagemBox.classList.add("progresso");
            } else {
                mensagemBox.classList.add("inicio");
            }
        }

        // 📊 UI progresso
        if (progressText) {
            progressText.textContent = `Progresso: ${completed} / ${total} aulas (${percent}%)`;
        }

        if (progressFill) {
            progressFill.style.width = "0%";
            setTimeout(() => {
                progressFill.style.width = `${percent}%`;
            }, 150);
        }

        if (!btn) return;

        // 🎯 BOTÃO PRINCIPAL (Continuar de onde parei)
        if (pendingIds.length === 0) {
            btn.textContent = "Curso Concluído 🎉";
            btn.onclick = () => navegar("progresso", true);
        } else {
            const nextId = pendingIds[0];

            if (nextId >= 1 && nextId <= 16) {
                btn.textContent = `Retomar Aula ${nextId}`;
                btn.onclick = () => navegar(`lesson:${nextId}`, true);
            } else {
                btn.textContent = "Continuar Jornada";
                btn.onclick = () => navegar("home", true);
            }
        }

        // =========================
        // 🎨 LACUNAS VISUAIS
        // =========================

        function getLessonFileByTopicId(topicId) {
            return LESSONS[Number(topicId)] || null;
        }

        function getLessonNameByTopicId(topicId) {
            const file = getLessonFileByTopicId(topicId);
            if (!file) return `Aula ${topicId}`;

            return file
                .replace('.html', '')
                .replace(/^\d+[a-zA-Z]?[-_]?/, '')
                .replace(/[-_]/g, ' ');
        }

        function formatLessonName(name) {
            return name
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
        }

        if (lacunasBox && pendingIds.length > 0) {
            lacunasBox.innerHTML = `
                <div class="lacunas-card">
                    <h3>⚠️ Continue sua jornada</h3>
                    <p>Você pulou algumas etapas importantes:</p>

                    <div class="lacunas-list">
                        ${pendingIds.map(id => {
                            const nomeBruto = getLessonNameByTopicId(id);
                            const nomeFmt = formatLessonName(nomeBruto);
                            return `
                                <button class="lacuna-btn" data-topic="${id}">
                                    Aula ${id} — ${nomeFmt}
                                </button>
                            `;
                        }).join("")}
                    </div>
                </div>
            `;

            lacunasBox.querySelectorAll(".lacuna-btn").forEach(botao => {
                botao.addEventListener("click", () => {
                    const topicId = botao.getAttribute("data-topic");
                    navegar(`lesson:${topicId}`, true);
                });
            });

        } else if (lacunasBox) {
            lacunasBox.innerHTML = "";
        }
    }
}
