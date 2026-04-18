import { CONFIG } from '../config.js';
import { navegar } from '../dashboard-router.js';

export class HomeView {
    constructor() {
        this.apiUrl = CONFIG.API_URL;
        this.container = document.getElementById('spa-content');
    }

    async render() {
        if (!this.container) return;

        // 1. Render inicial imediato
        this.container.innerHTML = `
            <div class="fade-in">
                <h2 id="welcome-user">Carregando...</h2>

                <div class="card">
                    <button id="btn-continuar">
                        ⏳ Carregando progresso...
                    </button>
                </div>
            </div>
        `;

        // 2. Espera DOM existir
        await new Promise(r => requestAnimationFrame(r));

        // 3. Carrega dados
        await this.carregarDados();
    }

    async carregarDados() {
        const token = localStorage.getItem("access_token");
        const email = localStorage.getItem("user_email");

        if (!token || !email) {
            console.warn("Sessão inválida");
            return;
        }

        try {
            const res = await fetch(`${this.apiUrl}/progress/summary?email=${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            this.atualizarUI(data);

        } catch (err) {
            console.error("Erro API:", err);
            this.container.innerHTML = `
                <div style="color:red">
                    Erro ao conectar com servidor
                </div>
            `;
        }
    }

    atualizarUI(progresso) {
        const btn = document.getElementById("btn-continuar");
        const welcome = document.getElementById("welcome-user");

        const nome = localStorage.getItem("user_name") || "Engenheiro";

        if (welcome) {
            welcome.textContent = `Bem-vindo, ${nome}!`;
        }

        if (!btn) return;

        // 🔥 Lógica simples e robusta
        if (progresso?.pending_topics?.length > 0) {
            const aula = progresso.pending_topics[0];

            btn.textContent = `Retomar Aula ${aula}`;
            btn.onclick = () => navegar(`lesson:${aula}`, true);

        } else {
            btn.textContent = "Continuar Jornada";
            btn.onclick = () => navegar("lesson:2", true);
        }
    }
}