// Last update: May 19, 2026 – 15:42
// home-view.js — Versão Consolidada 
import { navegar, LESSONS } from '../dashboard-router.js?v=2026-05-19-v9';
import { getProgress } from '../git-course-functions.js?v=2026-05-19-v9';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
    }

    async render() {
        if (!this.container) return;

        // Limpeza e Placeholder inicial
        this.container.innerHTML = `
            <div class="fade-in">
                <h2 id="welcome-user">Carregando sua jornada técnica...</h2>
                <p id="mensagem-status" class="mensagem-status"></p>

                <div class="progress-box">
                    <p id="progress-text">Sincronizando com o cockpit...</p>
                    <div class="progress-bar">
                        <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>

                <div class="card">
                    <button id="btn-continuar" class="btn-main">
                        ⏳ Verificando próxima etapa...
                    </button>
                </div>

                <div id="lacunas-box"></div>
            </div>
        `;

        // Pequena pausa para garantir a renderização do esqueleto antes dos dados
        await new Promise(r => requestAnimationFrame(r));
        await this.carregarDados();
    }

    async carregarDados() {
        try {
            const progresso = await getProgress();
            this.atualizarUI(progresso);
        } catch (err) {
            console.error("❌ Erro ao conectar com o cockpit:", err);
            this.container.innerHTML = `
                <div class="error-box">
                    <h2>Erro de Conexão</h2>
                    <p>Não foi possível recuperar seu progresso. Verifique sua conexão.</p>
                </div>
            `;
        }
    }

    atualizarUI(progresso) {
        const btn = document.getElementById("btn-continuar");
        const welcome = document.getElementById("welcome-user");
        const progressText = document.getElementById("progress-text");
        const progressFill = document.getElementById("progress-fill");
        const lacunasBox = document.getElementById("lacunas-box");
        const mensagemBox = document.getElementById("mensagem-status");

        // 👤 Identificação do Usuário
        const email = localStorage.getItem("user_email") || "Engenheiro";
        const nome = email.split("@")[0];
        if (welcome) welcome.textContent = `Bem-vindo, ${nome}!`;

        // 📊 Cálculos de Progresso
        const pendingIds = (progresso?.pending_topics || []).map(n => Number(n));
        const total = progresso?.total || 16;
        const completed = progresso?.actual_count || 0;
        const percent = progresso?.percentage || 0;

        // 🧠 Lógica de Mensagem e Estilo
        const statusMap = [
            { limit: 100, msg: "🏆 Parabéns! Você concluiu o curso!", class: "sucesso" },
            { limit: 80,  msg: "🔥 Você está muito perto de concluir!", class: "alerta" },
            { limit: 50,  msg: "🚀 Excelente progresso, continue assim!", class: "progresso" },
            { limit: 1,   msg: "💡 Continue avançando, você está no caminho!", class: "inicio" },
            { limit: 0,   msg: "👋 Vamos começar sua jornada técnica!", class: "inicio" }
        ];

        const status = statusMap.find(s => percent >= s.limit);
        if (mensagemBox) {
            mensagemBox.textContent = status.msg;
            mensagemBox.className = `mensagem-status ${status.class}`;
        }

        // 📊 Atualização Visual da Barra
        if (progressText) progressText.textContent = `Progresso: ${completed} / ${total} aulas (${percent}%)`;
        if (progressFill) {
            setTimeout(() => { progressFill.style.width = `${percent}%`; }, 100);
        }

        // 🎯 Configuração do Botão Principal (Ação SPA)
        if (btn) {
            if (percent === 100) {
                btn.textContent = "Revisar Conteúdo 🎉";
                btn.onclick = () => navegar("progresso", true);
            } else {
                const nextId = pendingIds.length > 0 ? pendingIds[0] : (completed + 1);
                btn.textContent = `Retomar Aula ${nextId}`;
                btn.onclick = () => navegar(`lesson:${nextId}`, true);
            }
        }

        // 🎨 Lógica de Lacunas (Aulas pendentes no meio do caminho)
        if (lacunasBox && pendingIds.length > 1) { // Só mostra se houver mais de uma aula pendente
            lacunasBox.innerHTML = `
                <div class="lacunas-card">
                    <h3>⚠️ Etapas pendentes</h3>
                    <p>Complete estas aulas para consolidar seu conhecimento:</p>
                    <div class="lacunas-list"></div>
                </div>
            `;
            
            const list = lacunasBox.querySelector(".lacunas-list");
            pendingIds.slice(0, 3).forEach(id => { // Mostra no máximo 3 lacunas para não poluir
                const nomeFmt = this.obterNomeFormatado(id);
                const item = document.createElement("button");
                item.className = "lacuna-btn";
                item.innerHTML = `<span>Aula ${id}</span> — ${nomeFmt}`;
                item.onclick = () => navegar(`lesson:${id}`, true);
                list.appendChild(item);
            });
        }
    }

    // Funções auxiliares de formatação dentro da classe
    obterNomeFormatado(topicId) {
        // Busca no LESSONS do roteador (ajuste de índice: topicId 1 = LESSONS[0])
        const file = LESSONS[topicId - 1] || `Aula ${topicId}`;
        return file
            .replace('.html', '')
            .replace(/^\d+[a-zA-Z]?[-_]?/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }
}