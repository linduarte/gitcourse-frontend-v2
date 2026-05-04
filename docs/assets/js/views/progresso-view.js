
// progresso-view.js — versão base — 2026-05-04
// Last update: May 04, 2026 – 08:56

import { LESSONS } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';

export class ProgressoView {
    constructor() {
        this.container = document.getElementById('spa-content');
    }

    async render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="fade-in">
                <h2>📊 Seu Progresso no Curso</h2>
                <p id="progresso-resumo">Carregando...</p>
                <ul id="lista-aulas" class="lista-aulas"></ul>
            </div>
        `;

        await this.carregarDados();
    }

    async carregarDados() {
        const resumoEl = document.getElementById("progresso-resumo");
        const listaEl = document.getElementById("lista-aulas");

        try {
            const progresso = await getProgress();

            const pendingIds = progresso?.pending_topics || [];
            const total = progresso?.total || 16;
            const completed = progresso?.actual_count || 0;
            const percent = progresso?.percentage || 0;

            if (resumoEl) {
                resumoEl.textContent = `Você concluiu ${completed} de ${total} aulas (${percent}%).`;
            }

            if (!listaEl) return;

            listaEl.innerHTML = "";

            // topic_id 1..16 → LESSONS[1..16]
            for (let topicId = 1; topicId <= 16; topicId++) {
                const file = LESSONS[topicId];
                if (!file) continue;

                const nome = file
                    .replace('.html', '')
                    .replace(/^\d+[a-zA-Z]?[-_]?/, '')
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());

                const pendente = pendingIds.includes(topicId) || pendingIds.includes(String(topicId));

                const li = document.createElement("li");
                li.className = pendente ? "aula-pendente" : "aula-concluida";
                li.textContent = `Aula ${topicId} — ${nome} ${pendente ? "(pendente)" : "(concluída)"}`;

                listaEl.appendChild(li);
            }

        } catch (err) {
            console.error("Erro ao carregar progresso:", err);
            if (resumoEl) {
                resumoEl.textContent = "Erro ao carregar progresso. Tente novamente mais tarde.";
            }
        }
    }
}
