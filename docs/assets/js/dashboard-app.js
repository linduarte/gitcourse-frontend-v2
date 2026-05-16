// Last update: May 15, 2026 – 08:01
// dashboard-app.js — Versão Consolidada SPA
import { getProgress } from "./git-course-functions.js?v=2026-05-13-v8";
import { CONFIG } from "../config.js?v=2026-05-13-v8";
import { navegar } from "./dashboard-router.js?v=2026-05-13-v8";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    // 1. Verificação de Segurança
    if (!token || !email) {
        window.location.href = `${CONFIG.REPO_BASE}auth/login.html`;
        return;
    }

    // 2. Ativação da Sidebar (Interceptação de Cliques)
    configurarNavegacaoSPA();

    // 3. Inicialização do Conteúdo
    try {
        const progresso = await getProgress();

        if (progresso.actual_count === 0) {
            // Se não tem progresso, o roteador carrega a home que mostrará o botão de "Iniciar"
            await navegar("home");
        } else {
            // Se já tem progresso, o roteador renderiza a HomeView com os dados da API
            await navegar("home");
        }
    } catch (err) {
        console.error("Erro ao inicializar SPA:", err);
    }
});

/**
 * Escuta os cliques no menu lateral e impede o recarregamento da página
 */
function configurarNavegacaoSPA() {
    const menuLinks = document.querySelectorAll('.sidebar nav a');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const id = e.currentTarget.id;

            // Ignoramos o botão de Sair, pois ele deve seguir o fluxo de logout real
            if (id === 'menuSair') return;

            // Mapeamento de IDs para as rotas do dashboard-router.js
            const mapaRotas = {
                'menuDashboard': 'home',
                'menuProgresso': 'progresso',
                'menuContinue': 'home' // Pode ser ajustado para a última aula se desejar
            };

            if (mapaRotas[id]) {
                e.preventDefault(); // O "pulo do gato" para evitar o refresh
                navegar(mapaRotas[id], true);
            }
        });
    });
}