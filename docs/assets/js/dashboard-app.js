/* dashboard-app.js */
// No GitHub Pages, às vezes o './' precisa ser muito explícito
import { CONFIG } from './config.js'; 
import { navegar } from './dashboard-router.js';
import { inicializarDashboard } from './dashboard-logic.js';
import { inicializarMenuLateral } from './sidebar-logic.js';

// Função de boot que não depende exclusivamente do evento se ele já passou
const boot = async () => {
    console.log("⚡ SPA Charles Duarte: Iniciando Boot de Engenharia...");
    try {
        inicializarMenuLateral();
        await inicializarDashboard(CONFIG);
        await navegar('home');
        console.log("✅ SPA operando com sucesso!");
    } catch (error) {
        console.error("❌ Falha crítica no boot da SPA:", error);
    }
};

// Se o documento já carregou, executa. Se não, espera o evento.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}