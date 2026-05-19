
// assets/config.js - Cache Buster Forte
// Last update: May 19, 2026 – 08:31

export const CONFIG = {
    // ==================== ENDEREÇO DO BACKEND ====================
    API_URL: "https://charles-gitcourse.duckdns.org",

    // ==================== CONFIGURAÇÕES DO FRONTEND ====================
    REPO_BASE: "/gitcourse-frontend-v2/",
    COURSE_BASE: "/gitcourse-frontend-v2/curso/git-course/",
    
    // Rota central de suporte e atendimento aos alunos
    FORUM_SUPORTE: "https://github.com/linduarte/gitcourse-frontend-v2/discussions",

    // ==================== Cache Buster ====================
    // Quando mudar de versão (ex: v10), altere APENAS esta string!
    VERSION: "2026-05-19-v9"
};

// ==========================================================================
// INJEÇÃO AUTOMÁTICA DE CACHE BUSTER NOS ESTILOS (CSS)
// ==========================================================================
function aplicarCacheBusterGlobal() {
    // Captura todos os links de folhas de estilo da página que está sendo aberta
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    
    links.forEach(link => {
        // Ignora links externos (como fontes do Google, se houver)
        if (link.href.includes(window.location.hostname) || link.href.startsWith('/') || link.href.startsWith('.')) {
            const url = new URL(link.href, window.location.origin);
            
            // Aplica dinamicamente a versão configurada acima (?v=2026-05-18-v9)
            url.searchParams.set('v', CONFIG.VERSION);
            link.href = url.toString();
        }
    });
}

// Executa a automação imediatamente no carregamento do script
aplicarCacheBusterGlobal();