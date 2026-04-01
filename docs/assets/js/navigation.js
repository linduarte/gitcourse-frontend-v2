import { inicializarDashboard } from "./dashboard-logic.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia o Dashboard (E-mail e Barra de Progresso)
    inicializarDashboard();

    // 2. Função de Logout
    const logoutCharles = (e) => {
        if(e) e.preventDefault();
        console.log("Sinal de Logout recebido");
        localStorage.clear();
        window.location.href = "index.html"; 
    };

    // 3. Mapeamento de IDs (VERIFIQUE SE ESTES IDs ESTÃO NO SEU HTML)
    const botoesMenu = [
        { id: "menuDashboard", action: () => window.location.reload() },
        { id: "menuProgresso", action: () => window.location.reload() }, // Recarrega para sincronizar
        { id: "menuSair",      action: logoutCharles },
        { id: "logoutLink",    action: logoutCharles },
        { id: "menuContinue",  action: () => document.getElementById("btnContinueCard")?.click() },
        { id: "menuLastTopic", action: () => document.getElementById("btnContinueCard")?.click() }
    ];

    // 4. Atribuição com Log de Debug
    botoesMenu.forEach(botao => {
        const el = document.getElementById(botao.id);
        if (el) {
            console.log(`✅ Conectado: Botão ${botao.id}`);
            el.addEventListener('click', botao.action);
        } else {
            console.warn(`❌ Falha de conexão: ID "${botao.id}" não encontrado no HTML.`);
        }
    });
});