/**
 * sidebar-logic.js (versão SPA com URL)
 */
// Last update: April 28, 2026 – 05:34
import { navegar } from './dashboard-router.js';
import { logout } from './git-course-functions.mjs?v=1777361682432';

export function inicializarMenuLateral() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    sidebar.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        e.preventDefault();

        const id = link.id;

        console.log(`🖱️ Menu: ${id}`);

        switch (id) {
            case 'menuDashboard':
                navegar('home', true);
                break;

            case 'menuProgresso':
                navegar('progresso', true);
                break;

            case 'menuContinue':
                navegar('home', true);
                break;

            case 'menuSair':
                logout();
                break;

            default:
                console.warn("Rota não mapeada.");
        }
    });
}