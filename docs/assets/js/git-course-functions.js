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
    
    // 1. Limpa os dados de navegação e tokens
    localStorage.clear();
    
    // 2. Redireciona para a Landing Page (onde está o seu texto do jj!)
    window.location.href = "index.html";
}

/**
 * Formata datas ou outras strings se necessário futuramente
 */
export function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString('pt-BR');
}