// assets/js/dashboard-logic.js
import { getCurrentUser } from "./git-course-functions.js";

export async function inicializarDashboard() {
    // Seleção de Elementos da UI
    const emailDisplay = document.getElementById("userEmailDisplay");
    const welcomeMsg = document.getElementById("welcomeMessage");
    const btnContinue = document.getElementById("btnContinueCard");
    const menuContinue = document.getElementById("menuContinue");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressText = document.getElementById("progressCardContent");

    const token = localStorage.getItem("access_token");
    const userEmail = localStorage.getItem("user_email");
    const TOTAL_TOPICOS = 17;

    // 1. Verificação de Segurança
    if (!token || !userEmail) {
        window.location.href = "auth/login.html";
        return;
    }

    if (emailDisplay) emailDisplay.textContent = userEmail;

    // 2. Lógica de Navegação (Continuar de onde parou)
    const navegarParaUltimoProgresso = async () => {
        try {
            const response = await fetch(`${API_URL}/progress/latest`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
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

    // 3. Atualização de Progresso e Sincronização
    try {
        // Buscamos o progresso total do utilizador na API
        const response = await fetch(`${API_URL}/progress/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json(); // Espera-se { "completed_count": X }
            const concluido = data.completed_count || 0;
            const percentagem = Math.round((concluido / TOTAL_TOPICOS) * 100);

            // Atualiza a Barra de Progresso Visual
            if (progressBarFill) {
                progressBarFill.style.width = `${percentagem}%`;
            }

            // Atualiza o Texto descritivo
            if (progressText) {
                progressText.innerHTML = `Tens <strong>${concluido}</strong> de <strong>${TOTAL_TOPICOS}</strong> tópicos concluídos (${percentagem}%).`;
            }
            
            welcomeMsg.textContent = "Sessão sincronizada. O teu progresso está atualizado.";
        } else {
            welcomeMsg.textContent = "Aviso: Não foi possível carregar o teu progresso real.";
        }
    } catch (error) {
        console.error("Erro ao sincronizar progresso:", error);
        welcomeMsg.textContent = "Servidor Offline. Mostrando dados em cache.";
    }
}