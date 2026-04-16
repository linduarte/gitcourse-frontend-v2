/* dashboard-app.js */
import { CONFIG } from './config.js';
import { navegar } from './dashboard-router.js';
import { inicializarDashboard } from './dashboard-logic.js';
import { inicializarMenuLateral } from './sidebar-logic.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("⚡ SPA Charles Duarte: Iniciando Boot de Engenharia...");

    try {
        // 1. Liga os comandos do menu lateral (Uma única vez)
        inicializarMenuLateral();

        // 2. Busca dados na VPS passando a CONFIG necessária
        // Aqui garantimos que o Dashboard sabe onde a VPS mora
        await inicializarDashboard(CONFIG);

        // 3. Carrega a tela inicial (Injeta o Card de Progresso)
        await navegar('home');

        console.log("✅ SPA operando com sucesso!");

    } catch (error) {
        console.error("❌ Falha crítica no boot da SPA:", error);
    }
});