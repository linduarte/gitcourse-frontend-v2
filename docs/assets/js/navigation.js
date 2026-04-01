// 1. Importações Necessárias (Conectando os fios)
import { API_URL } from "./config.js";
import { inicializarDashboard } from "./dashboard-logic.js";
import { logout } from "./git-course-functions.js";

/**
 * GitCourse - Controle de Navegação Refatorado
 */
document.addEventListener('DOMContentLoaded', () => {
    // 2. Inicializa o Dashboard (E-mail e Progresso)
    inicializarDashboard();

    // 3. Ouvinte de Clique na Sidebar (Menu Lateral)
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            const alvo = e.target;

            // Comando SAIR
            if (alvo.id === 'menuSair') {
                e.preventDefault();
                console.log("Sinal de Logout enviado para a VPS...");
                logout(); // Agora a função será reconhecida!
            }

            // Comando DASHBOARD
            if (alvo.id === 'menuDashboard') {
                e.preventDefault();
                window.location.href = "dashboard.html";
            }

            // Comando CONTINUAR
            if (alvo.id === 'menuContinue') {
                e.preventDefault();
                // Aciona o clique no botão principal que já tem a lógica da VPS
                document.getElementById("btnContinueCard")?.click();
            }
        });
    }
});