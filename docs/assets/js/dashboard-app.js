/**
 * dashboard-app.js
 * Ponto de entrada da arquitetura SPA.
 */
import { navegar } from './dashboard-router.js';
import { inicializarDashboard } from './dashboard-logic.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 Sistema SPA: Iniciando sequência de boot...");
    
    try {
        // 1. Carrega dados globais (E-mail no topo)
        await inicializarDashboard();

        // 2. Chama a primeira visualização
        navegar('home');
    } catch (error) {
        console.error("Erro na carga inicial:", error);
    }
});