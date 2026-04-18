/**
 * dashboard-router.js - Versão Final de Produção
 * Com base na listagem oficial de arquivos (Abril 2026)
 */
import { HomeView } from './views/home-view.js';

// 📚 Lista Mestra extraída do seu sistema de arquivos
export const LESSONS_LIST = [
    '1a-prefacio.html',
    '2-introduction.html',
    '3-git-config.html',
    '4-hosting.html',
    '5-connect.html',
    '6-git-clone.html',
    '7-git-status.html',
    '8-git-add.html',
    '9-git-commit.html',
    '10-feature_req.html',
    '11-branch.html',
    '12-branch-merge.html',
    '13-git-diff.html',
    '14-undo-changes.html',
    '15-git-init.html',
    '16-git-workflows.html',
    '17-terminal-customization.html'
];

const routes = {
    'home': new HomeView() 
};

export async function navegar(rota) {
    const container = document.getElementById('spa-content');

    // Identifica se a rota é um arquivo de aula
    if (rota.endsWith('.html')) {
        await carregarConteudoAula(rota);
        return;
    }

    const view = routes[rota];
    if (view) {
        container.innerHTML = ''; // Limpa o "Iniciando sistema" antigo
        await view.render();      // Chama o render e PARA POR AQUI.
        // NÃO chame carregarSumario() aqui! A HomeView fará isso sozinha.
    }
}

/**
 * Busca o conteúdo HTML no GitHub Pages e injeta no SPA
 */
async function carregarConteudoAula(arquivo) {
    const container = document.getElementById('spa-content');
    const baseUrl = "https://linduarte.github.io/gitcourse-frontend-v2/curso/git-course/";
    
    try {
        const response = await fetch(baseUrl + arquivo);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const html = await response.text();
        container.innerHTML = html;
        
        // Reset de scroll para o topo da nova aula
        window.scrollTo(0, 0);
        
        // Aqui você pode disparar funções de destaque de código (Highlight.js) se usar
    } catch (error) {
        console.error("Falha ao carregar aula:", error);
        container.innerHTML = `
            <div class="error-container">
                <h2>Ops! Aula não encontrada.</h2>
                <p>Não conseguimos carregar: ${arquivo}</p>
                <button onclick="navegar('home')">Voltar ao Início</button>
            </div>`;
    }
}