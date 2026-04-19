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

            <!-- 📊 PROGRESSO -->
            <div id="progress-box" class="progress-box">
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

    const progressText = document.getElementById("progress-text");
    const progressFill = document.getElementById("progress-fill");

    const nome = localStorage.getItem("user_name") || "Engenheiro";

    if (welcome) {
        welcome.textContent = `Bem-vindo, ${nome}!`;
    }

    // 📊 Cálculo de progresso (com ajuste da aula 1)
    const total = 16;

    let pending = progresso?.pending_topics || [];

    // 🔥 REMOVE aula 1 da lógica (não tem "Concluído")
    pending = pending.filter(a => String(a) !== "1");

    const completed = total - pending.length;
    const percent = Math.floor((completed / total) * 100);

    if (progressText) {
        progressText.textContent = `Progresso: ${completed} / ${total} aulas (${percent}%)`;
    }

    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }

    if (!btn) return;

    // 🎯 Lógica de navegação (agora consistente)
    if (completed === 0) {
        btn.textContent = "Iniciar Jornada Git";
        btn.onclick = () => navegar("lesson:1a", true);

    } else if (pending.length === 0) {
        btn.textContent = "Curso Concluído 🎉";
        btn.onclick = () => navegar("progresso", true);

    } else {
        const aula = pending[0];

        btn.textContent = `Retomar Aula ${aula}`;
        btn.onclick = () => navegar(`lesson:${aula}`, true);
    }
}
}