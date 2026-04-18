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
    if (!this.container) return;

    // 1. Injeção imediata do esqueleto
    this.container.innerHTML = `
        <div id="home-content" class="fade-in">
            <h2 id="welcome-user" class="mb-4">Sincronizando...</h2>
            <div class="card p-4 shadow-sm border-0 bg-light">
                <button id="btn-continuar" class="btn btn-secondary btn-lg w-100 py-3">
                    <span class="spinner-border spinner-border-sm"></span> Iniciando sistema...
                </button>
            </div>
        </div>`;

    // 2. A PAUSA DE ENGENHARIA: Espera o navegador registrar os IDs no DOM
    await new Promise(resolve => requestAnimationFrame(resolve));

    // 3. Agora sim, busca os dados da VPS
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
    // 1. Localiza os componentes no painel (DOM)
    const btnAcao = document.getElementById("btn-continuar");
    const welcomeEl = document.getElementById("welcome-user");
    
    // 2. Recupera a informação da memória
    const nome = localStorage.getItem("user_name") || "Charles";

    // 3. Atribui o valor ao visor (Nome)
    if (welcomeEl) {
        welcomeEl.textContent = `Bem-vindo, ${nome}!`;
    }

    // 4. Lógica do Atuador (Botão Amarelo ⚠️)
    if (btnAcao) {
        if (progresso.pending_topics && progresso.pending_topics.length > 0) {
            const aulaId = progresso.pending_topics[0]; // Aqui virá o '10'
            btnAcao.textContent = `Retomar: Aula ${aulaId} ⚠️`;
            btnAcao.className = "btn btn-warning btn-lg w-100 fw-bold text-dark border-3 shadow";
            
            // Navegação correta para o SPA:
            btnAcao.onclick = () => navegar(`${aulaId}-feature_req.html`); 
        } else {
            btnAcao.textContent = "Continuar Jornada 🚀";
        }
    } else {
        console.warn("⚠️ Botão 'btn-continuar' não encontrado no DOM.");
    }
}
}