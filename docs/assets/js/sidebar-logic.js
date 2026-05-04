
// sidebar-logic.js — versão final — 2026-05-04
// Last update: May 04, 2026 – 09:02
import { navegar } from './dashboard-router.js';
import { logout } from './git-course-functions.js';
import { getProgress } from './git-course-functions.js';

export function inicializarMenuLateral() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    sidebar.addEventListener('click', async (e) => {
        const link = e.target.closest('a');
        if (!link || !sidebar.contains(link)) return;

        e.preventDefault();

        const id = link.id;
        console.log(`🖱️ Menu: ${id}`);

        // Remove estado ativo anterior
        sidebar.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        switch (id) {

            case 'menuDashboard':
                navegar('home', true);
                break;

            case 'menuProgresso':
                navegar('progresso', true);
                break;

            case 'menuContinue':
                try {
                    const progresso = await getProgress();
                    const pending = progresso?.pending_topics || [];

                    if (pending.length > 0) {
                        const nextId = Number(pending[0]);
                        navegar(`lesson:${nextId}`, true);
                    } else {
                        navegar('progresso', true);
                    }

                } catch (err) {
                    console.error("Erro ao obter progresso:", err);
                    navegar('home', true);
                }
                break;

            case 'menuSair':
                logout();
                break;

            default:
                console.warn("⚠️ Rota não mapeada:", id);
        }
    });
}
