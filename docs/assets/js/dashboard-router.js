/**
 * dashboard-router.js
 * Gerenciador de injeção de conteúdo.
 */
import { HomeView } from './views/home-view.js';

const routes = {
    'home': HomeView
    // Futuramente: 'progresso': ProgressoView
};

export function navegar(rota) {
    const container = document.getElementById('spa-content');
    
    if (!container) {
        console.error("Contêiner 'spa-content' não encontrado!");
        return;
    }

    if (routes[rota]) {
        // Injeta o HTML da View
        container.innerHTML = routes[rota].render();
        
        // Inicializa a lógica específica daquela View (ex: preencher a barra de progresso)
        if (routes[rota].init) {
            routes[rota].init();
        }
    }
}