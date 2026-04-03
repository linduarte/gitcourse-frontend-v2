import { inicializarDashboard, navegarParaUltimoProgresso } from "./dashboard-logic.js";
import { logout } from "./git-course-functions.js";

document.addEventListener('DOMContentLoaded', () => {

    // ✅ Inicialização única
    inicializarDashboard();

    // ✅ Sidebar (delegação robusta)
    const sidebar = document.querySelector('.sidebar');

    if (!sidebar) return;

    sidebar.addEventListener('click', (e) => {
        const alvo = e.target.closest('a');
        if (!alvo) return;

        e.preventDefault();

        switch (alvo.id) {

            case 'menuSair':
                console.log("Logout acionado...");
                logout();
                break;

            case 'menuDashboard':
                window.location.href = "dashboard.html";
                break;

            case 'menuContinue':
                navegarParaUltimoProgresso();
                break;

            case 'menuProgresso':
                document.getElementById("progressCard")
                    ?.scrollIntoView({ behavior: "smooth" });
                break;
        }
    });
});