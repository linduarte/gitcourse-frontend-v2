/**
 * home-view.js - v3.0 Refatorada
 * Gerenciamento do Painel Principal (Dashboard)
 * Charles Duarte - Foco em Sincronia de Portas e SSL
 */
import { CONFIG } from '../config.js';

export class HomeView {
    constructor() {
        // Puxa a URL centralizada (Garante que seja https://...:8000)
        this.apiUrl = CONFIG.API_URL;
        this.container = document.getElementById('view-content');
    }

    /**
     * Ponto de entrada da View
     */
    async render() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="p-4 text-center">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2">Sincronizando telemetria com a VPS...</p>
                </div>`;
        }
        await this.carregarSumario();
    }

    /**
     * MÓDULO DE DADOS: Busca o progresso real na VPS
     */
    async carregarSumario() {
        const token = localStorage.getItem("access_token");
        const email = localStorage.getItem("user_email");

        if (!token || !email) {
            console.error("❌ Sessão ausente na HomeView.");
            return;
        }

        try {
            // Chamada unificada para a porta 8000 (Via CONFIG)
            const res = await fetch(`${this.apiUrl}/progress/summary?email=${email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error(`Erro na API: ${res.status}`);

            const progresso = await res.json();
            console.log("📊 Telemetria recebida:", progresso);

            this.atualizarInterface(progresso);

        } catch (error) {
            console.error("💥 Falha na comunicação com a VPS:", error);
            if (this.container) {
                this.container.innerHTML = `
                    <div class="alert alert-danger">
                        <h4>Erro de Conexão</h4>
                        <p>O Dashboard não conseguiu falar com a porta 8000 da VPS.</p>
                        <small>${error.message}</small>
                    </div>`;
            }
        }
    }

    /**
     * MÓDULO DE INTERFACE: A lógica do Botão Amarelo ⚠️
     */
    atualizarInterface(progresso) {
        const btnAcao = document.getElementById("btn-continuar");
        if (!btnAcao) return;

        // 1. REGRA: RECUPERAÇÃO (BOTÃO AMARELO)
        if (progresso.pending_topics && progresso.pending_topics.length > 0) {
            const aulaId = progresso.pending_topics[0];
            btnAcao.textContent = `Retomar: Aula ${aulaId} ⚠️`;
            btnAcao.className = "btn btn-warning btn-lg w-100 fw-bold text-dark border-3 shadow";
            btnAcao.onclick = () => window.location.href = `auth/${aulaId}-aula.html`;
            console.log(`⚠️ Status: Aula ${aulaId} pendente.`);
        } 
        // 2. REGRA: NOVATO OU CONCLUÍDO (AZUL/VERDE)
        else if (progresso.completed === 0) {
            btnAcao.textContent = "Começar do Início 🚀";
            btnAcao.className = "btn btn-primary btn-lg w-100 fw-bold";
            btnAcao.onclick = () => window.location.href = "auth/1a-prefacio.html";
        } else {
            btnAcao.textContent = `Continuar (${progresso.percentage || 0}%)`;
            btnAcao.className = "btn btn-success btn-lg w-100 fw-bold";
            btnAcao.onclick = () => window.location.href = progresso.last_lesson_url || "auth/2-introduction.html";
        }
    }
}