// Last update: May 19, 2026 – 15:42
// // progresso-view.js — Versão Consolidada 2026-05-15
import { LESSONS } from '../dashboard-router.js?v=2026-05-19-v9';
import { getProgress } from '../git-course-functions.js?v=2026-05-19-v9';

export class ProgressoView {
    constructor() {
        this.container = document.getElementById('spa-content');
    }

    async render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="fade-in">
                <h2 class="view-title">📊 Detalhamento da sua Jornada</h2>
                
                <div class="stats-container">
                    <p id="progresso-resumo" class="resumo-text">Sincronizando dados com o servidor...</p>
                    <div class="progress-bar mini">
                        <div id="progress-fill-view" class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>

                <div class="lista-wrapper">
                    <ul id="lista-aulas" class="lista-aulas"></ul>
                </div>
            </div>
        `;

        await this.carregarDados();
    }

    async carregarDados() {
        const resumoEl = document.getElementById("progresso-resumo");
        const listaEl = document.getElementById("lista-aulas");
        const fillEl = document.getElementById("progress-fill-view");

        try {
            const progresso = await getProgress();

            // Transformamos em Set para busca rápida (O(1))
            const pendingIds = new Set((progresso?.pending_topics || []).map(n => Number(n)));
            const total = progresso?.total || 16;
            const completed = progresso?.actual_count || 0;
            const percent = progresso?.percentage || 0;

            if (resumoEl) {
                resumoEl.textContent = `Você completou ${completed} de ${total} etapas (${percent}%).`;
            }
            
            if (fillEl) {
                setTimeout(() => { fillEl.style.width = `${percent}%`; }, 100);
            }

            if (!listaEl) return;
            listaEl.innerHTML = "";

            // Percorre o mapa oficial de aulas (LESSONS)
            LESSONS.forEach((file, index) => {
                const topicId = index + 1; // Aula 1 é o índice 0
                
                const nomeFormatado = file
                    .replace('.html', '')
                    .replace(/^\d+[a-zA-Z]?[-_]?/, '')
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());

                const isPendente = pendingIds.has(topicId);

                const li = document.createElement("li");
                li.className = `aula-item ${isPendente ? "pendente" : "concluida"}`;
                
                li.innerHTML = `
                    <div class="aula-status-icon">
                        ${isPendente ? '⭕' : '✅'}
                    </div>
                    <div class="aula-info">
                        <span class="aula-numero">Aula ${topicId}</span>
                        <span class="aula-nome">${nomeFormatado}</span>
                    </div>
                    <div class="aula-tag">
                        ${isPendente ? 'Pendente' : 'Concluída'}
                    </div>
                `;

                listaEl.appendChild(li);
            });

        } catch (err) {
            console.error("❌ Falha ao carregar visão de progresso:", err);
            if (resumoEl) {
                resumoEl.innerHTML = `<span class="error">Não foi possível carregar os dados.</span>`;
            }
        }
    }
}