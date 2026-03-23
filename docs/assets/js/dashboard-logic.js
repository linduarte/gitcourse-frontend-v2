// assets/js/dashboard-logic.js
import { getCurrentUser } from "./git-course-functions.js";

/**
 * Inicializa os componentes do Dashboard consumindo a API da VPS
 */
export async function inicializarDashboard() {
    // Seletores de UI
    const emailDisplay = document.getElementById("userEmailDisplay");
    const welcomeMsg = document.getElementById("welcomeMessage");
    const btnContinue = document.getElementById("btnContinueCard");
    const menuContinue = document.getElementById("menuContinue");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressText = document.getElementById("progressCardContent");

    const token = localStorage.getItem("access_token");
    const userEmail = localStorage.getItem("user_email");

    // 1. Validação de Sessão
    if (!token || !userEmail) {
        window.location.href = "auth/login.html";
        return;
    }

    if (emailDisplay) emailDisplay.textContent = userEmail;

    // 2. Lógica de Navegação: "Continuar de onde parei"
    const navegarParaUltimoProgresso = async () => {
        try {
            const response = await fetch(`${API_URL}/progress/latest`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                // Se a API retornar um slug válido, navega. Senão, vai para a Aula 1.
                if (data && data.topic_slug) {
                    window.location.href = `curso/git-course/${data.topic_slug}.html`;
                    return;
                }
            }
            window.location.href = "curso/git-course/1-introducao.html";
        } catch (error) {
            console.error("Erro na navegação:", error);
            window.location.href = "curso/git-course/1-introducao.html";
        }
    };

    btnContinue?.addEventListener('click', navegarParaUltimoProgresso);
    menuContinue?.addEventListener('click', navegarParaUltimoProgresso);

    // 3. Sincronização de Progresso (Baseado no seu JSON da VPS)
    try {
        const response = await fetch(`${API_URL}/progress/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json(); 
            
            // Extração baseada no seu teste de HTTPie: { "completed": 0, "percentage": 0.0, "total": 17 }
            const concluido = data.completed ?? 0;
            const total = data.total ?? 17;
            const percentagem = data.percentage ?? 0;

            // Atualização da Barra Visual
            if (progressBarFill) {
                progressBarFill.style.width = `${percentagem}%`;
            }

            // Atualização do Texto de Progresso
            if (progressText) {
                progressText.innerHTML = `Concluíste <strong>${concluido}</strong> de <strong>${total}</strong> tópicos (${percentagem}%).`;
            }
            
            welcomeMsg.textContent = "Sincronizado com a VPS.";
        } else {
            welcomeMsg.textContent = "Aviso: Sessão expirada ou erro no servidor.";
        }
    } catch (error) {
        console.error("Erro ao sincronizar progresso:", error);
        welcomeMsg.textContent = "Modo Offline: Verifique sua conexão.";
    }
}