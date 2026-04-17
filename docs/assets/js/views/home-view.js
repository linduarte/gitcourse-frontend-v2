/**
 * HomeView.js - v4.1 (Versão Refatorada)
 * Engenheiro: Charles Duarte
 * Foco: Integridade de Estados e Legibilidade (UX)
 */
import { navegar, LESSONS_LIST } from '../dashboard-router.js';

/**
 * 🛠️ UTILITÁRIOS DE FORMATAÇÃO
 */
const formatarNomeAula = (nomeArquivo) => {
    if (!nomeArquivo) return "Aula Desconhecida";
    let nomeLimpo = nomeArquivo.replace('.html', '').replace(/[-_]/g, ' ');
    return nomeLimpo.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

/**
 * 🧠 MAPA DE ESTRATÉGIAS DE ESTUDO
 */
const STUDY_MAP = {
    "PENDENTE": (dados, urlBase) => {
        const idFaltante = dados.pending_topics[0];
        const arquivo = LESSONS_LIST[idFaltante - 1];
        const titulo = formatarNomeAula(arquivo);
        return {
            texto: `Retomar: ${titulo} ⚠️`,
            cor: "#ffc107",
            textoCor: "#212529",
            link: `${urlBase}${arquivo}`,
            msg: `<strong>Integridade:</strong> A lição <b>${titulo}</b> foi pulada. Complete-a para validar seu progresso.`
        };
    },

    "CONCLUIDO": (dados, urlBase) => ({
        texto: "Curso Concluído! Rever Material ✓",
        cor: "#198754",
        textoCor: "#ffffff",
        link: `${urlBase}${LESSONS_LIST[0]}`,
        msg: "🌟 <strong>Parabéns!</strong> Você concluiu todas as etapas da engenharia Git."
    }),

    "SEQUENCIAL": (dados, urlBase) => {
        const proximoIdx = parseInt(dados.completed || 0);
        const arquivo = LESSONS_LIST[proximoIdx] || LESSONS_LIST[0];
        const titulo = formatarNomeAula(arquivo);
        return {
            texto: `Continuar: ${titulo} ✓`,
            cor: "#0d6efd",
            textoCor: "#ffffff",
            link: `${urlBase}${arquivo}`,
            msg: ""
        };
    }
};

export class HomeView {
    constructor() {
        // Agora centralizado para facilitar manutenção (Porta 8080 conforme ajuste)
        this.apiUrl = "https://charles-gitcourse.duckdns.org:8080";
        this.repoBase = "/gitcourse-frontend-v2/curso/git-course/";
        this.urlBaseCompleta = `https://linduarte.github.io${this.repoBase}`;
    }

    render() {
        const userName = localStorage.getItem('user_name') || "Engenheiro";
        return `
            <div class="dashboard-header text-center mb-4">
                <h2 class="fw-bold">Bem-vindo, ${userName}!</h2>
                <p class="text-muted">Centro de Comando de Versionamento</p>
            </div>
            <div class="card shadow-sm border-0 mb-4">
                <div class="card-body p-4 text-center">
                    <h5 class="text-muted mb-2">Progresso do Curso</h5>
                    <div id="progressCardContent" class="display-5 fw-bold text-primary mb-3">Sincronizando...</div>
                    <div id="statusNotificationArea"></div>
                </div>
            </div>
            <div class="d-grid gap-2 mb-5">
                <a id="mainActionButton" class="btn btn-lg shadow-sm d-none" href="#" 
                   style="padding: 15px; font-weight: bold; border-radius: 8px;"></a>
            </div>
        `;
    }

    async carregarSumario() {
        const email = localStorage.getItem('user_email');
        const token = localStorage.getItem("access_token");

        try {
            const res = await fetch(`${this.apiUrl}/progress/summary?email=${email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Falha na Telemetria");
            
            const dados = await res.json();
            this.atualizarInterface(dados);
        } catch (err) {
            console.error("💥 Erro:", err);
            document.getElementById('progressCardContent').innerText = "Erro na conexão.";
        }
    }

    atualizarInterface(dados) {
        const btn = document.getElementById('mainActionButton');
        const progressText = document.getElementById('progressCardContent');
        const notify = document.getElementById('statusNotificationArea');

        // 1. Determina Estado
        let estado = "SEQUENCIAL";
        if (dados.pending_topics?.length > 0) estado = "PENDENTE";
        else if (dados.completed >= dados.total) estado = "CONCLUIDO";

        // 2. Busca Estratégia
        const acao = STUDY_MAP[estado](dados, this.urlBaseCompleta);

        // 3. Aplica UI
        progressText.innerText = `${dados.percentage}% (${dados.actual_count}/${dados.total})`;
        btn.innerText = acao.texto;
        btn.href = acao.link;
        btn.classList.remove('d-none');
        Object.assign(btn.style, {
            backgroundColor: acao.cor,
            borderColor: acao.cor,
            color: acao.textoCor
        });

        if (notify && acao.msg) {
            notify.innerHTML = `<div class="alert mt-3" style="background-color: ${acao.cor}22; border: 1px solid ${acao.cor};">${acao.msg}</div>`;
        }
    }
}