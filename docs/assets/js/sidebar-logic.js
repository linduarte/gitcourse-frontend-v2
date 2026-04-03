/**
 * sidebar-logic.js
 * Controla os cliques no menu lateral da SPA.
 */
import { navegar } from './dashboard-router.js';
import { logout } from './git-course-functions.js';

export function inicializarMenuLateral() {
    const sidebar = document.querySelector('.sidebar');
    
    if (!sidebar) return;

    sidebar.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        e.preventDefault();
        const id = link.id;

        console.log(`🖱️ Menu: Clique detectado em ${id}`);

        switch (id) {
            case 'menuDashboard':
                navegar('home');
                break;
            case 'menuSair':
                logout();
                break;
            case 'menuProgresso':
                // Futuramente: navegar('progresso');
                console.log("Rota de progresso em construção...");
                break;
            default:
                console.warn("Rota não mapeada para este ID.");
        }
    });
}