// assets/js/dashboard-logic.js

/**
 * Inicializa os componentes do Dashboard consumindo a API da VPS
 */
async function inicializarDashboard() {
    // 1. Seletores de UI
    const emailDisplay = document.getElementById("userEmailDisplay");
    const welcomeMsg = document.getElementById("welcomeMessage");
    const btnContinue = document.getElementById("btnContinueCard");
    const menuContinue = document.getElementById("menuContinue");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressText = document.getElementById("progressCardContent");
    const statusContainer = document.getElementById("status-container"); // Para a mensagem de parabéns

    const token = localStorage.getItem("access_token");
    const userEmail = localStorage.getItem("user_email");

    // 2. Validação de Sessão
    if (!token || !userEmail) {
        window.location.href = "auth/login.html";
        return;
    }

    if (emailDisplay) emailDisplay.textContent = userEmail;

    // 3. O Catálogo de Peças (Mapeamento de IDs para Arquivos)
    const mapaAulas = {
        0: "1a-prefacio.html",
        1: "2-introduction.html",
        2: "3-git-config.html",
        3: "4-hosting.html",
        4: "5-connect.html",
        5: "6-git-clone.html",
        6: "7-git-status.html",
        7: "8-git-add.html",
        8: "9-git-commit.html",
        9: "10-feature_req.html",
        10: "11-branch.html",
        11: "12-branch-merge.html",
        12: "13-git-diff.html",
        13: "14-undo-changes.html",
        14: "15-git-init.html",
        15: "16-git-workflows.html",
        16: "17-terminal-customization.html",
        17: "../../dashboard.html" // Ciclo completo: volta para o dashboard
    };

    /**
     * Lógica de Navegação: "Continuar de onde parei"
     */
    const navegarParaUltimoProgresso = async (e) => {
        if (e) e.preventDefault();
        
        try {
            const response = await fetch(`${API_URL}/progress/summary`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const aulasCompletas = data.completed || 0;
                
                // Define o próximo arquivo com base no progresso atual
                const arquivoDestino = mapaAulas[aulasCompletas] || "1a-prefacio.html";

                console.log(`Progresso: ${aulasCompletas}. Destino: ${arquivoDestino}`);
                window.location.href = `curso/git-course/${arquivoDestino}`;
            } else {
                window.location.href = "curso/git-course/1a-prefacio.html";
            }
        } catch (error) {
            console.error("Erro na navegação:", error);
            window.location.href = "curso/git-course/1a-prefacio.html";
        }
    };

    // 4. Sincronização de Progresso e Estilização de "Vitória"
    try {
        const response = await fetch(`${API_URL}/progress/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json(); 
            const concluido = data.completed ?? 0;
            const total = data.total ?? 17;
            const percentagem = data.percentage ?? 0;

            // Atualiza a Barra de Progresso
            if (progressBarFill) {
                progressBarFill.style.width = `${percentagem}%`;
                
                // Se chegou em 100%, douramos a pílula!
                if (percentagem >= 100) {
                    progressBarFill.style.backgroundColor = "#FFD700"; // Cor Ouro
                    progressBarFill.style.boxShadow = "0 0 10px #FFD700";
                }
            }

            // Atualiza o Texto de Progresso
            if (progressText) {
                if (percentagem >= 100) {
                    progressText.innerHTML = `
                        <div style="color: #b8860b; font-weight: bold; margin-top: 10px;">
                            🎊 PARABÉNS, ENGENHEIRO! 🎊 <br>
                            Você completou 100% do treinamento Git.
                        </div>
                    `;
                    // Muda o texto do botão principal
                    if (btnContinue) btnContinue.innerHTML = "Revisar Conteúdo 📚";
                } else {
                    progressText.innerHTML = `Concluíste <strong>${concluido}</strong> de <strong>${total}</strong> tópicos (${percentagem}%).`;
                }
            }
            
            welcomeMsg.textContent = "Sincronizado com a VPS.";
        } else {
            welcomeMsg.textContent = "Sessão ativa, mas sem dados de progresso.";
        }
    } catch (error) {
        console.error("Erro ao sincronizar progresso:", error);
        welcomeMsg.textContent = "Aviso: VPS indisponível no momento.";
    }

    // 5. Adicionando os ouvintes de clique
    btnContinue?.addEventListener('click', navegarParaUltimoProgresso);
    menuContinue?.addEventListener('click', navegarParaUltimoProgresso);
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarDashboard);