/**
 * dashboard-router.js - Corrigido
 */
import { HomeView } from './views/home-view.js';

const routes = {
    // 🚀 O segredo está aqui: Instanciar a classe com 'new'
    'home': new HomeView() 
};

export function navegar(rota) {
    const container = document.getElementById('spa-content');
    
    if (!container) {
        console.error("Contêiner 'spa-content' não encontrado!");
        return;
    }

    const view = routes[rota];

    if (view) {
        // 1. Injeta o esqueleto do HTML
        container.innerHTML = view.render();
        
        // 2. Dispara a lógica (Busca na VPS, Calibragem do Botão, etc.)
        // Mudamos de .init() para .carregarSumario() que é o nome da nossa função real
        if (view.carregarSumario) {
            view.carregarSumario();
        }
    }
}