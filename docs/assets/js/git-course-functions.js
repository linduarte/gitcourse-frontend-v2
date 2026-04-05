/**
 * git-course-functions.js
 * Utilitários globais para o Git Course.
 * Charles Duarte - v2.0 SPA
 */

/**
 * Realiza o Logout seguro do sistema
 */
export function logout() {
    console.log("🔐 Encerrando sessão do usuário...");
    
    // 1. Limpa tudo (Token, progresso, etc)
    localStorage.clear();
    
    // 2. Redireciona para a raiz (Onde está o index.html)
    // O "/" garante que ele volte para o início do domínio, não importa a pasta
    window.location.href = "/gitcourse-frontend-v2/index.html"; 
}

/**
 * Formata datas ou outras strings se necessário futuramente
 */
export function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString('pt-BR');
}