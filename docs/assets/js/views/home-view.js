// Last update: May 02, 2026 – 17:54
// home-view.js - SPA Dashboard Home (Refatorado)
// Maio 2026 – compatível com dashboard-app.js
// 🔹 USE_MOCK = false → API real
// 🔹 USE_MOCK = true → dados simulados

import { navegar } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';
import { CONFIG } from '../config.js';

const USE_MOCK = false; // 🔥 true → mock, false → API real

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
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
        if (USE_MOCK) {
            console.log("🔥 MODO MOCK: carregando progresso simulado");

            const progressoMock = {
                actual_count: 5,
                total: 15,
                percentage: 33,
                pending_topics: ["6", "7", "8"]
            };

            this.atualizarUI(progressoMock);
            return;
        }

        try {
            const progresso = await getProgress(CONFIG.API_URL);
            console.log("🔥 BACKEND:", progresso);

            this.atualizarUI(progresso);

        } catch (err) {
            console.error("Erro API:", err);

            const mensagemBox = document.getElementById("mensagem-status");
            if (mensagemBox) mensagemBox.textContent = "⚠️ Sem conexão com servidor";

            if (this.container)
                this.container.innerHTML = `<h2>Erro ao conectar com servidor</h2>`;
        }
    }

    atualizarUI(progresso) {
        if (!this.container) return;

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
        const lacunasBox = document.getElementById("lacunas-box");
        const mensagem = document.getElementById("mensagem-status");

        // 🎯 Mensagem de status
        if (percent === 100) {
            mensagem.textContent = "🏆 Curso concluído!";
        } else if (percent >= 50) {
            mensagem.textContent = "🚀 Excelente progresso!";
        } else {
            mensagem.textContent = "💡 Continue avançando!";
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

            btn.textContent = `Retomar Aula ${aula}`;
            btn.onclick = () => navegar(destino, true);
        }

        // ⚠️ Lacunas
        if (pending.length > 1) {
            lacunasBox.innerHTML = `
                <p>⚠️ Você pulou algumas etapas importantes:</p>
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