/**
 * HomeView.js - v4.0 (Edição Especial Charles Duarte)
 * Lógica: Navegação por Estado (Pendência > Sequência > Conclusão)
 */
import { navegar, LESSONS_LIST } from '../dashboard-router.js';

export class HomeView {
    constructor() {
        this.apiUrl = "https://charles-gitcourse.duckdns.org";
        this.repoBase = "/gitcourse-frontend-v2/curso/git-course/";
    }

    render() {
        const userEmail = localStorage.getItem('user_email') || "";
        const userName = localStorage.getItem('user_name') || userEmail.split('@')[0] || "Aluno";

        return `
            <div class="dashboard-header">
                <h2>Bem-vindo, ${userName}!</h2>
            </div>

            <div class="card mb-4 shadow-sm border-0">
                <div class="card-body">
                    <h5 class="card-title text-muted">Progresso do Curso</h5>
                    <div id="progressCardContent" class="h2 fw-bold text-primary mb-3">Sincronizando...</div>
                    
                    <div id="statusNotificationArea"></div>
                </div>
            </div>

            <div class="d-grid gap-2">
                <a id="mainActionButton" class="btn-footer-primary" href="#" style="transition: all 0.3s ease;">
                    Aguardando Telemetria...
                </a>
            </div>
        `;
    }

    async carregarSumario() {
        const email = localStorage.getItem('user_email');
        const token = localStorage.getItem("access_token");
        if (!email) return;

        try {
            const response = await fetch(`${this.apiUrl}/progress/summary?email=${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const dados = await response.json();
                this.processarEstadoDashboard(dados);
            }
        } catch (error) {
            console.error("💥 Falha de comunicação:", error);
            this.mostrarErro("Servidor Indisponível");
        }
    }

    processarEstadoDashboard(dados) {
        const btn = document.getElementById('mainActionButton');
        const progressText = document.getElementById('progressCardContent');
        const notificationArea = document.getElementById('statusNotificationArea');
        
        if (!btn || !progressText) return;

        // 1. Atualiza o contador global
        progressText.innerText = `${dados.percentage}% (${dados.completed}/${dados.total})`;

        // 2. Análise de Estados
        const pending = dados.pending_topics || [];
        const hasPending = pending.length > 0;
        const isFullyComplete = dados.completed === dados.total && !hasPending;

        // ESTADO 1: Existem "buracos" (ex: Aula 10 faltante)
        if (hasPending) {
            const idFaltante = pending[0];
            const destino = LESSONS_LIST[idFaltante - 1]; // Ajuste de índice

            btn.textContent = `Aula Faltante: ID ${idFaltante} - Completar ⚠️`;
            btn.style.backgroundColor = "#ffc107"; // Amarelo Alerta
            btn.style.color = "#212529";
            btn.style.borderColor = "#e0a800";
            btn.href = `https://linduarte.github.io${this.repoBase}${destino}`;

            notificationArea.innerHTML = `
                <div class="alert alert-warning">
                    <strong>Integridade:</strong> Lições [ ${pending.join(", ")} ] pendentes.
                </div>`;
            return;
        }

        // ESTADO 2: Curso totalmente concluído
        if (isFullyComplete) {
            btn.textContent = "Curso Concluído! Rever Material ✓";
            btn.style.backgroundColor = "#198754"; // Verde Sucesso
            btn.style.color = "white";
            btn.href = `https://linduarte.github.io${this.repoBase}${LESSONS_LIST[1]}`;

            notificationArea.innerHTML = `
                <div class="alert alert-success">
                    🎉 Parabéns! Você concluiu todas as etapas da engenharia Git.
                </div>`;
            return;
        }

        // ESTADO 3: Fluxo sequencial normal
        const indiceAlvo = parseInt(dados.completed || 0);
        const destinoSeq = LESSONS_LIST[indiceAlvo] || LESSONS_LIST[0];

        btn.textContent = "Continuar de onde parei ✓";
        btn.style.backgroundColor = ""; // Cor padrão
        btn.href = `https://linduarte.github.io${this.repoBase}${destinoSeq}`;
        notificationArea.innerHTML = "";
    }

    mostrarErro(msg) {
        const content = document.getElementById('progressCardContent');
        if (content) content.innerText = msg;
    }
}