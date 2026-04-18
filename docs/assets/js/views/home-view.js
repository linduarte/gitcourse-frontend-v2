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
        // 1. Injeta o HTML (O esqueleto)
        this.container.innerHTML = `
            <div id="home-content" class="fade-in">
                <h2 id="welcome-user" class="mb-4">Sincronizando...</h2>
                <div class="card p-4 shadow-sm border-0 bg-light">
                    <p class="text-muted">Status da sua jornada:</p>
                    <button id="btn-continuar" class="btn btn-secondary btn-lg w-100 py-3">
                        <span class="spinner-border spinner-border-sm"></span> Iniciando sistema...
                    </button>
                </div>
            </div>`;

        // 2. A MANOBRA DE SINCRONIA: 
        // Esperamos um pequeno ciclo (macro-task) para o navegador registrar os IDs
        await new Promise(resolve => setTimeout(resolve, 0));

        // 3. Agora sim, com o botão garantido no DOM, buscamos os dados
        await this.carregarSumario();
    }
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
            const res = await fetch(`${this.apiUrl}/progress/summary?email=${email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const progresso = await res.json();
            
            // A CHAVE DO SUCESSO: Forçar a atualização da interface com os dados novos
            this.atualizarInterface(progresso);
            
            // E atualizar o nome no cabeçalho se ele estiver lá
            const nome = localStorage.getItem("user_name") || "Charles";
            const welcomeEl = document.querySelector(".welcome-message"); // ou o seu ID
            if (welcomeEl) welcomeEl.textContent = `Bem-vindo, ${nome}!`;

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
    // Tenta encontrar o botão e a mensagem de boas-vindas
    const btnAcao = document.getElementById("btn-continuar");
    const welcomeEl = document.getElementById("welcome-user") || document.querySelector(".welcome-message");
    
    // Recupera o nome que salvamos no login
    const nome = localStorage.getItem("user_name") || "Charles";

    // 1. Atualiza o Nome (Se o elemento existir)
    if (welcomeEl) {
        welcomeEl.textContent = `Bem-vindo, ${nome}!`;
    }

    // 2. Atualiza o Botão (Lógica da Aula 10)
    if (btnAcao) {
        if (progresso.pending_topics && progresso.pending_topics.length > 0) {
            const aulaId = progresso.pending_topics[0];
            btnAcao.textContent = `Retomar: Aula ${aulaId} ⚠️`;
            btnAcao.className = "btn btn-warning btn-lg w-100 fw-bold text-dark border-3 shadow";
            btnAcao.onclick = () => window.location.href = `auth/${aulaId}-aula.html`;
        } else {
            // ... lógica para novato/concluído ...
            btnAcao.textContent = "Continuar Jornada 🚀";
        }
    } else {
        console.warn("⚠️ Botão 'btn-continuar' não encontrado no DOM ainda.");
    }
}
}