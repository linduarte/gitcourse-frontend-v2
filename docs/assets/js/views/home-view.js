// Last update: April 29, 2026 – 15:14
import { navegar, LESSONS } from '../dashboard-router.js';
import { getProgress } from '../git-course-functions.js';
import { CONFIG } from '../config.js';

export class HomeView {
    constructor() {
        this.container = document.getElementById('spa-content');
    }

    async render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="fade-in">
                <h2 id="welcome-user">Carregando...</h2>

                <p id="mensagem-status" class="mensagem-status"></p>

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

    const USE_MOCK = true; // 🔥 mude para false depois

    if (USE_MOCK) {
        console.log("🔥 MODO MOCK ATIVO");

        const progresso = {
            actual_count: 5,
            total: 15,
            percentage: 33,
            pending_topics: ["6", "7", "8"]
        };

        this.atualizarUI(progresso);
        return;
    }

    // 🔽 código original preservado
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


        let mensagem = "";

        if (percent === 100) {
            mensagem = "🏆 Parabéns! Você concluiu o curso!";
        } else if (percent >= 80) {
            mensagem = "🔥 Você está muito perto de concluir!";
        } else if (percent >= 50) {
            mensagem = "🚀 Excelente progresso, continue assim!";
        } else if (percent > 0) {
            mensagem = "💡 Continue avançando, você está no caminho certo!";
        } else {
            mensagem = "👋 Bem-vindo! Vamos começar sua jornada!";
        }

        // 👇 👉 AQUI entra o seu código
        const mensagemBox = document.getElementById("mensagem-status");

        if (mensagemBox) {
            mensagemBox.textContent = mensagem;
        
            // 🔥 limpa classes antigas
            mensagemBox.className = "mensagem-status";
        
            // 🎯 aplica estilo dinâmico
            if (percent === 100) {
                mensagemBox.classList.add("sucesso");
            } else if (percent >= 80) {
                mensagemBox.classList.add("alerta");
            } else if (percent >= 50) {
                mensagemBox.classList.add("progresso");
            } else {
                mensagemBox.classList.add("inicio");
            }
        }

        // 📊 UI progresso
        if (progressText) {
            progressText.textContent = `Progresso: ${completed} / ${total} aulas (${percent}%)`;
        }

        if (progressFill) {
            progressFill.style.width = "0%";

            setTimeout(() => {
                progressFill.style.width = `${percent}%`;
            }, 150);
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
