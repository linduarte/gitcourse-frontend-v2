import { navegar, LESSONS } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
    }

    async render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="fade-in">
                <h2 id="welcome-user">Carregando...</h2>

                <div class="progress-box">
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

                <div id="lacunas-box"></div>
            </div>
        `;

        await new Promise(r => requestAnimationFrame(r));
        await this.carregarDados();
    }

    async carregarDados() {
        try {
            const progresso = await getProgress();

            console.log("🔥 BACKEND:", progresso);

            this.atualizarUI(progresso);

        } catch (err) {
            console.error("Erro API:", err);

            this.container.innerHTML = `
                <h2>Erro ao conectar com servidor</h2>
            `;
        }
    }

    atualizarUI(progresso) {
        const btn = document.getElementById("btn-continuar");
        const welcome = document.getElementById("welcome-user");
        const progressText = document.getElementById("progress-text");
        const progressFill = document.getElementById("progress-fill");
        const lacunasBox = document.getElementById("lacunas-box");

        // 👤 Nome via email
        const email = localStorage.getItem("user_email") || "usuário";
        const nome = email.split("@")[0];

        if (welcome) {
            welcome.textContent = `Bem-vindo, ${nome}!`;
        }

        // 📊 Dados do backend
        const pending = progresso?.pending_topics || [];
        const total = progresso?.total || 15;
        const completed = progresso?.actual_count || 0;
        const percent = progresso?.percentage || 0;

        // 📊 UI progresso
        if (progressText) {
            progressText.textContent = `Progresso: ${completed} / ${total} aulas (${percent}%)`;
        }

        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }

        if (!btn) return;

        // 🎯 BOTÃO PRINCIPAL
        if (pending.length === 0) {
            btn.textContent = "Curso Concluído 🎉";
            btn.onclick = () => navegar("progresso", true);
        } else {
            const aula = pending[0];
        
            if (aula === "1a") {
                btn.textContent = "Iniciar Jornada Git";
                btn.onclick = () => navegar("lesson:1a", true);
            } else {
                btn.textContent = `Retomar Aula ${aula}`;
                btn.onclick = () => navegar(`lesson:${aula}`, true);
            }
        }

            // =========================
    // 🎨 LACUNAS VISUAIS
    // =========================
        
    function getLessonName(aulaId) {
        const file = LESSONS.find(f => f.startsWith(`${aulaId}-`));
        return file
            ?.replace('.html', '')
            ?.replace(/^\d+-?/, '')
            ?.replace(/-/g, ' ') || `Aula ${aulaId}`;
    }
    
    function formatLessonName(name) {
        return name
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }
    
    if (lacunasBox && pending.length > 0) {
    
        lacunasBox.innerHTML = `
            <div class="lacunas-card">
                <h3>⚠️ Continue sua jornada</h3>
                <p>Você pulou algumas etapas importantes:</p>
    
                <div class="lacunas-list">
                    ${pending.map(a => `
                        <button class="lacuna-btn" data-aula="${a}">
                            Aula ${a} - ${formatLessonName(getLessonName(a))}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;
                    
        // eventos
        lacunasBox.querySelectorAll(".lacuna-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const aula = btn.dataset.aula;
                navegar(`lesson:${aula}`, true);
            });
        });
    
    } else if (lacunasBox) {
        lacunasBox.innerHTML = "";
    }
    }
}