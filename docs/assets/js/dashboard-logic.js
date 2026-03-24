// assets/js/dashboard-logic.js
import { getCurrentUser } from "./git-course-functions.js";

// [Ajuste] Certifique-se de que a API_URL está definida (ou importada)
const API_URL = 'https://charles-gitcourse.duckdns.org';

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
    const navegarParaUltimoProgresso = async (e) => {
        if (e) e.preventDefault(); // [Ajuste] Evita comportamento padrão se for um link
        
        try {
            // Chamamos a rota que retorna os dados do usuário logado (incluindo last_lesson)
            const response = await fetch(`${API_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                
                // [Ajuste] Se a API retornar a coluna last_lesson do Postgres
                if (data && data.last_lesson) {
                    const slug = data.last_lesson;
                    // Garante que o link aponte para a pasta correta no GitHub Pages
                    window.location.href = `curso/git-course/${slug}`;
                    return;
                }
            }
            // Fallback se não houver progresso: vai para o prefácio (Aula 0)
            window.location.href = "curso/git-course/1a-prefacio.html";
        } catch (error) {
            console.error("Erro na navegação:", error);
            window.location.href = "curso/git-course/1a-prefacio.html";
        }
    };

    // [Ajuste] Adicionando os ouvintes de clique
    btnContinue?.addEventListener('click', navegarParaUltimoProgresso);
    menuContinue?.addEventListener('click', navegarParaUltimoProgresso);

    // 3. Sincronização de Progresso (Barra de 1 a 17)
    try {
        const response = await fetch(`${API_URL}/progress/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json(); 
            
            const concluido = data.completed ?? 0;
            const total = data.total ?? 17;
            const percentagem = data.percentage ?? 0;

            if (progressBarFill) {
                progressBarFill.style.width = `${percentagem}%`;
            }

            if (progressText) {
                progressText.innerHTML = `Concluíste <strong>${concluido}</strong> de <strong>${total}</strong> tópicos (${percentagem}%).`;
            }
            
            welcomeMsg.textContent = "Sincronizado com a VPS.";
        } else {
            welcomeMsg.textContent = "Sessão ativa, mas sem dados de progresso.";
        }
    } catch (error) {
        console.error("Erro ao sincronizar progresso:", error);
        welcomeMsg.textContent = "Aviso: VPS indisponível no momento.";
    }
}