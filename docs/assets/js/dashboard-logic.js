/**
 * GitCourse Dashboard - Lógica de Integração com VPS
 * Desenvolvido por: Charles Duarte
 */

async function inicializarDashboard() {
    // 1. Configuração de Seletores
    const emailDisplay = document.getElementById("userEmailDisplay");
    const welcomeMsg = document.getElementById("welcomeMessage");
    const btnContinue = document.getElementById("btnContinueCard");
    const menuContinue = document.getElementById("menuContinue");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressText = document.getElementById("progressCardContent");

    // 2. Gestão de Sessão
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.warn("Acesso negado: Token não encontrado.");
        window.location.href = "auth/login.html";
        return;
    }

    /**
     * FUNÇÃO: Busca Identidade do Usuário (E-mail Real)
     * Rota: /auth/me (conforme definido no main.py)
     */
    const carregarPerfilUsuario = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const userData = await response.json();
                if (emailDisplay) emailDisplay.textContent = userData.email;
                if (welcomeMsg) welcomeMsg.textContent = "Sincronizado com a VPS.";
                localStorage.setItem("user_email", userData.email);
            } else {
                throw new Error("Sessão inválida ou expirada");
            }
        } catch (error) {
            console.error("Erro no Perfil:", error);
            localStorage.clear();
            window.location.href = "auth/login.html";
        }
    };

    /**
     * FUNÇÃO: Sincroniza Progresso do Aluno
     */
    const sincronizarProgresso = async () => {
        try {
            const response = await fetch(`${API_URL}/progress/summary`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const concluido = data.completed ?? 0;
                const total = data.total ?? 17;
                const percentagem = data.percentage ?? 0;

                atualizarInterfaceProgresso(concluido, total, percentagem);
                return concluido;
            }
        } catch (error) {
            console.error("Erro ao sincronizar progresso:", error);
            if (welcomeMsg) welcomeMsg.textContent = "Aviso: Modo Offline.";
        }
        return 0;
    };

    /**
     * FUNÇÃO AUXILIAR: Atualiza Elementos Visuais
     */
    function atualizarInterfaceProgresso(concluido, total, percentagem) {
        if (progressBarFill) {
            progressBarFill.style.width = `${percentagem}%`;
            if (percentagem >= 100) {
                progressBarFill.style.backgroundColor = "#FFD700";
                progressBarFill.style.boxShadow = "0 0 10px #FFD700";
            }
        }

        if (progressText) {
            if (percentagem >= 100) {
                progressText.innerHTML = `
                    <div style="color: #b8860b; font-weight: bold; margin-top: 10px;">
                        🎊 PARABÉNS, ENGENHEIRO! 🎊 <br>
                        Você completou 100% do treinamento Git & Jujutsu.
                    </div>`;
                if (btnContinue) btnContinue.innerHTML = "Revisar Conteúdo 📚";
            } else {
                progressText.innerHTML = `Concluíste <strong>${concluido}</strong> de <strong>${total}</strong> tópicos (${percentagem}%).`;
            }
        }
    }

    /**
     * FUNÇÃO: Navegação Inteligente (Mapa de Aulas)
     */
    const navegarParaUltimoProgresso = async (e) => {
        if (e) e.preventDefault();
        
        const mapaAulas = {
            0: "1a-prefacio.html", 1: "2-introduction.html", 2: "3-git-config.html",
            3: "4-hosting.html", 4: "5-connect.html", 5: "6-git-clone.html",
            6: "7-git-status.html", 7: "8-git-add.html", 8: "9-git-commit.html",
            9: "10-feature_req.html", 10: "11-branch.html", 11: "12-branch-merge.html",
            12: "13-git-diff.html", 13: "14-undo-changes.html", 14: "15-git-init.html",
            15: "16-git-workflows.html", 16: "../../dashboard.html"
        };

        const aulasCompletas = await sincronizarProgresso();
        const arquivoDestino = mapaAulas[aulasCompletas] || "1a-prefacio.html";
        window.location.href = `curso/git-course/${arquivoDestino}`;
    };

    // --- Execução Inicial ---
    await carregarPerfilUsuario();
    await sincronizarProgresso();

    // Eventos
    btnContinue?.addEventListener('click', navegarParaUltimoProgresso);
    menuContinue?.addEventListener('click', navegarParaUltimoProgresso);
}

// Inicialização
document.addEventListener('DOMContentLoaded', inicializarDashboard);