// Last update: May 03, 2026 – 09:57
// sidebar-logic.js – Navegação SPA integrada ao dashboard

import { navegar } from './dashboard-router.js';
import { logout } from './git-course-functions.js';

export function inicializarMenuLateral() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    sidebar.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || !sidebar.contains(link)) return;

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
                // Por enquanto volta ao dashboard (HomeView decide a próxima aula)
                navegar('home', true);
                break;

            case 'menuSair':
                logout(); // usa fluxo oficial (limpa token + redireciona)
                break;

            default:
                console.warn("⚠️ Rota não mapeada:", id);
        }
    });
}
