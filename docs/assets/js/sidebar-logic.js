// Last update: May 15, 2026 – 08:24
// sidebar-logic.js — Versão Consolidada 2026-05-15
// Foco: Gestão de cliques na sidebar e navegação inteligente

import { navegar } from './dashboard-router.js?v=2026-05-13-v8';
import { logout, getProgress } from './git-course-functions.js?v=2026-05-13-v8';

/**
 * Inicializa os ouvintes de evento da barra lateral
 */
export function inicializarMenuLateral() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) {
        console.warn("⚠️ Aviso: Elemento .sidebar não encontrado no DOM.");
        return;
    }

    // Delegação de evento: um único ouvinte para toda a sidebar
    sidebar.addEventListener('click', async (e) => {
        const link = e.target.closest('a');
        
        // Valida se o clique foi em um link válido da sidebar
        if (!link || !sidebar.contains(link)) return;

        // Impede o comportamento de link HTML padrão (refresh)
        e.preventDefault();

        const id = link.id;
        console.log(`🖱️ Navegando via menu: ${id}`);

        // Feedback Visual: Atualiza a classe 'active'
        sidebar.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        // Lógica de Roteamento
        switch (id) {
            case 'menuDashboard':
                navegar('home', true);
                break;

            case 'menuProgresso':
                navegar('progresso', true);
                break;

            case 'menuContinue':
                await gerenciarBotaoContinuar();
                break;

            case 'menuSair':
                if (confirm("Deseja realmente sair do cockpit?")) {
                    logout();
                }
                break;

            default:
                console.warn("⚠️ Rota não mapeada no switch:", id);
        }
    });
}

/**
 * Lógica inteligente para o botão "Continuar" da sidebar
 */
async function gerenciarBotaoContinuar() {
    try {
        const progresso = await getProgress();
        const pending = progresso?.pending_topics || [];

        if (pending.length > 0) {
            // Pega o primeiro ID pendente da lista enviada pelo DuckDNS
            const nextId = Number(pending[0]);
            console.log(`🚀 Retomando jornada na Aula ${nextId}`);
            navegar(`lesson:${nextId}`, true);
        } else {
            // Se não há pendências, leva para a visão geral de progresso
            navegar('progresso', true);
        }
    } catch (err) {
        console.error("❌ Falha ao recuperar ponto de retorno:", err);
        navegar('home', true);
    }
}