/**
 * HomeView.js - v4.0 (Edição Consolidada)
 * Arquitetura: Mapeamento de Estados (Study Strategy Mapping)
 * Engenheiro responsável: Charles Duarte
 */
import { navegar, LESSONS_LIST } from '../dashboard-router.js';

/**
 * MAPA DE ESTADOS DE ESTUDO
 * Define o comportamento do botão principal e notificações baseadas no progresso.
 */
const STUDY_MAP = {
    // ESTADO 1: Identificada quebra de sequência (ex: aula 10 faltante)
    "PENDENTE": (dados, urlBase) => {
        const idFaltante = dados.pending_topics[0];
        const destino = LESSONS_LIST[idFaltante - 1]; // Ajuste de índice (ID 10 está na pos 9)
        return {
            texto: `Aula Faltante: ID ${idFaltante} - Completar ⚠️`,
            cor: "#ffc107", // Amarelo Alerta
            textoCor: "#212529",
            link: `${urlBase}${destino}`,
            msg: `<strong>Protocolo de Integridade:</strong> Identificamos que a lição <b>ID ${idFaltante}</b> não foi registrada. Finalize-a para validar seu progresso.`
        };
    },

    // ESTADO 2: Curso 100% concluído sem pendências
    "CONCLUIDO": (dados, urlBase) => ({
        texto: "Curso Concluído! Rever Material ✓",
        cor: "#198754", // Verde Sucesso
        textoCor: "#ffffff",
        link: `${urlBase}${LESSONS_LIST[1]}`, // Sugere rever a partir do Prefácio
        msg: "🌟 <strong>Parabéns!</strong> Você concluiu todas as etapas da engenharia Git com sucesso."
    }),

    // ESTADO 3: Fluxo normal de aprendizado
    "SEQUENCIAL": (dados, urlBase) => {
        const proximoIndice = parseInt(dados.completed || 0);
        const destino = LESSONS_LIST[proximoIndice] || LESSONS_LIST[0];
        return {
            texto: "Continuar de onde parei ✓",
            cor: "#0d6efd", // Azul Padrão
            textoCor: "#ffffff",
            link: `${urlBase}${destino}`,
            msg: ""
        };
    }
};

export class HomeView {
    constructor() {
        this.apiUrl = "https://charles-gitcourse.duckdns.org";
        this.repoBase = "/gitcourse-frontend-v2/curso/git-course/";
        console.log("🏠 HomeView: Sistema de Gestão de Estados Energizado.");
    }

    render() {
        const userEmail = localStorage.getItem('user_email') || "";
        const userName = localStorage.getItem('user_name') || userEmail.split('@')[0] || "Aluno";

        return `
            <div class="dashboard-header text-center mb-4">
                <h2 class="fw-bold">Bem-vindo ao Centro de Comando, ${userName}!</h2>
                <p class="text-muted">Engenharia de Software & Versionamento</p>
            </div>

            <div class="card shadow-sm border-0 mb-4">
                <div class="card-body p-4 text-center">
                    <h5 class="text-muted mb-2">Seu Progresso Atual</h5>
                    <div id="progressCardContent" class="display-5 fw-bold text-primary mb-3">0% (0/17)</div>
                    
                    <div id="statusNotificationArea"></div>
                </div>
            </div>

            <div class="d-grid gap-2 mb-5">
                <a id="mainActionButton" class="btn btn-lg shadow-sm" href="#" 
                   style="padding: 15px; font-weight: bold; border-radius: 8px; transition: all 0.3s ease;">
                   Sincronizando Telemetria...
                </a>
            </div>
        `;
    }

    async carregarSumario() {
        const email = localStorage.getItem('user_email');
        const token = localStorage.getItem("access_token");

        if (!email) {
            console.error("❌ Erro de Identidade: Email não encontrado.");
            this.mostrarErro("Sessão expirada. Faça login novamente.");
            return;
        }

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
                console.log("📡 Telemetria VPS Recebida:", dados);
                this.processarEstadoDashboard(dados);
            } else {
                throw new Error("Resposta negativa da VPS");
            }
        } catch (error) {
            console.error("💥 Falha Crítica de Conexão:", error);
            this.mostrarErro("Erro ao conectar com a VPS.");
        }
    }

    processarEstadoDashboard(dados) {
        const btn = document.getElementById('mainActionButton');
        const progressText = document.getElementById('progressCardContent');
        const notificationArea = document.getElementById('statusNotificationArea');
        const urlBaseCompleta = `https://linduarte.github.io${this.repoBase}`;

        if (!btn || !progressText) return;

        // 1. Atualização do Contador
        progressText.innerText = `${dados.percentage}% (${dados.completed}/${dados.total})`;

        // 2. Determinação do Estado (Bússola Logística)
        let estado = "SEQUENCIAL";
        if (dados.pending_topics && dados.pending_topics.length > 0) {
            estado = "PENDENTE";
        } else if (dados.completed === dados.total) {
            estado = "CONCLUIDO";
        }

        console.log(`🧠 Estado do Aluno identificado: ${estado}`);

        // 3. Obtenção da Estratégia do Mapa
        const acao = STUDY_MAP[estado](dados, urlBaseCompleta);

        // 4. Aplicação Visual e Funcional
        btn.innerText = acao.texto;
        btn.style.backgroundColor = acao.cor;
        btn.style.color = acao.textoCor;
        btn.style.borderColor = acao.cor;
        btn.href = acao.link;

        if (notificationArea && acao.msg) {
            notificationArea.innerHTML = `
                <div class="alert mt-3" style="background-color: ${acao.cor}22; border: 1px solid ${acao.cor}; color: #444; font-size: 0.95em;">
                    ${acao.msg}
                </div>`;
        } else if (notificationArea) {
            notificationArea.innerHTML = "";
        }
    }

    mostrarErro(msg) {
        const content = document.getElementById('progressCardContent');
        if (content) content.innerText = msg;
    }
}