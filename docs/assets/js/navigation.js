import { inicializarDashboard } from "./dashboard-logic.js";

/**
 * GitCourse - Controle de Navegação Modular Refatorado
 * Engenheiro: Charles Duarte
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia a sincronização com a VPS
    inicializarDashboard();

    // 2. Função de Logout (Centralizada para evitar erros de import)
    const executarLogout = (e) => {
        if (e) e.preventDefault();
        console.log("🔐 Encerrando sessão...");
        localStorage.clear();
        window.location.href = "index.html"; // Volta para a Landing Page (com o texto do jj!)
    };

    // 3. Mapeamento Direto (ID do HTML -> Ação)
    // DICA: Verifique se os IDs no seu index.html/dashboard.html são esses mesmos!
    const acoes = [
        { id: "menuSair",       action: executarLogout },
        { id: "logoutLink",     action: executarLogout },
        { id: "menuDashboard",  action: () => window.location.href = "dashboard.html" },
        { id: "menuHome",       action: () => window.location.href = "dashboard.html" },
        // O "Continuar" e "Progresso" o dashboard-logic.js já cuida dos cliques
    ];

    // 4. Atribuição de Eventos
    acoes.forEach(({ id, action }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('click', action);
        }
    });
});