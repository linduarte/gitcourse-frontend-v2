// Last update: May 19, 2026 – 15:39
// dashboard-router.js — Versão Consolidada 
import { CONFIG } from '../config.js?v=2026-05-19-v9';
import { HomeView } from './views/home-view.js?v=2026-05-19-v9';
import { ProgressoView } from './views/progresso-view.js?v=2026-05-19-v9';

export const LESSONS = [
    "1a-prefacio.html", "2-terminal-customization.html", "2a-introduction.html",
    "3-git-config.html", "4-hosting.html", "5-connect.html",
    "6-git-clone.html", "7-git-status.html", "8-git-add.html",
    "9-git-commit.html", "10-feature_req.html", "11-branch.html",
    "12-branch-merge.html", "13-git-diff.html", "14-undo-changes.html",
    "15-git-init.html", "16-git-workflows.html"
];

const routes = {
    home: () => new HomeView(),
    progresso: () => new ProgressoView()
};

/**
 * 🚀 Função Principal de Navegação
 * @param {string} rota - Ex: 'home', 'progresso' ou 'lesson:8'
 * @param {boolean} atualizarURL - Define se deve mudar a URL no navegador
 */
export async function navegar(rota, atualizarURL = false) {
    const container = document.getElementById('spa-content');
    if (!container) return;

    // --- CASO 1: Navegação para Aulas (Redirecionamento Externo) ---
    if (rota.startsWith("lesson:")) {
        const id = rota.split(":")[1];
        const arquivo = resolverArquivoAula(id);
        
        if (arquivo) {
            // Usa o COURSE_BASE do config.js para garantir o caminho correto
            window.location.href = `${CONFIG.COURSE_BASE}${arquivo}`;
        } else {
            console.error(`⚠️ Aula com ID ${id} não encontrada no mapa.`);
        }
        return;
    }

    // --- CASO 2: Navegação SPA (Troca de Conteúdo Interno) ---
    if (atualizarURL) {
        // Atualiza a URL para dashboard.html?page=home por exemplo
        history.pushState({ rota }, "", `?page=${rota}`);
    }

    try {
        const factory = routes[rota];
        if (!factory) {
            container.innerHTML = "<h2>Página não encontrada</h2>";
            return;
        }

        const view = factory();
        container.innerHTML = ""; // Limpa o loader/conteúdo anterior
        await view.render();      // Renderiza a HomeView ou ProgressoView

    } catch (err) {
        console.error("💥 Erro ao renderizar view:", err);
        container.innerHTML = "<h2>Erro ao carregar conteúdo</h2>";
    }
}

/**
 * 🔍 Auxiliar para encontrar o arquivo .html pelo ID numérico
 */
function resolverArquivoAula(id) {
    const idBusca = String(id).toLowerCase();
    
    // Procura o arquivo que começa com o número (ex: "8-") ou é o prefácio
    return LESSONS.find(aula => 
        aula.startsWith(`${idBusca}-`) || 
        aula.startsWith(`${idBusca}a-`)
    );
}

// 🔄 Suporte ao botão "Voltar" do navegador
window.addEventListener("popstate", (event) => {
    const rota = event.state?.rota || "home";
    navegar(rota, false);
});