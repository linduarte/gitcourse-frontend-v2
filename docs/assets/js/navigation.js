import { inicializarDashboard } from "./dashboard-logic.js";
import { logout } from "./git-course-functions.js";

/**
 * GitCourse - Controle de Navegação Modular
 * Engenheiro: Charles Duarte
 * Data: Abril/2026
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia a comunicação com a VPS e renderiza o progresso
    inicializarDashboard();

    // 2. Tabela de Roteamento (Fácil de expandir para o módulo Jujutsu)
    const routes = {
        continue: "curso/git-course/aula-atual.html",
        home: "dashboard.html",
        progress: "curso/git-course/progress.html",
        jj_news: "novidades/jujutsu-google.html" // Exemplo de nova rota
    };

    // 3. Lógica de Navegação Baseada em Estado
    const navegarPara = (destino) => {
        let url;
        if (destino === 'continue') {
            url = localStorage.getItem('current_lesson_url') || routes.continue;
        } else if (destino === 'last') {
            url = localStorage.getItem('last_topic') || routes.home;
        } else {
            url = routes[destino] || routes.home;
        }
        
        console.log(`🚀 Navegando para: ${url}`);
        window.location.href = url;
    };

    // 4. Mapeamento de Cliques (IDs do HTML -> Funções JS)
    const clickMap = [
        { id: "menuContinue",    action: () => navegarPara('continue') },
        { id: "btnContinueCard", action: () => navegarPara('continue') },
        { id: "menuLastTopic",   action: () => navegarPara('last')     },
        { id: "logoutLink",      action: (e) => { e.preventDefault(); logout(); } }
    ];

    // 5. Atribuição de Eventos com Verificação de Existência
    clickMap.forEach(({ id, action }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.cursor = "pointer"; // Garante o feedback visual de clique
            elemento.addEventListener('click', action);
        }
    });
});