/**
 * dashboard-app.js
 * Ponto de Entrada Único.
 */
import { navegar } from './dashboard-router.js';
import { inicializarDashboard } from './dashboard-logic.js';
import { inicializarMenuLateral } from './sidebar-logic.js'; // Novo!

document.addEventListener('DOMContentLoaded', async () => {
    console.log("⚡ SPA Charles Duarte: Iniciando...");

    try {
        // 1. Liga os comandos do menu lateral
        inicializarMenuLateral();

        // 2. Busca dados da Ana na VPS (E-mail do topo)
        await inicializarDashboard();

        // 3. Carrega a tela inicial (Injeta o Card de Progresso)
        await navegar('home');

    } catch (error) {
        console.error("❌ Falha no boot da SPA:", error);
    }
});