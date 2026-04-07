/**
 * dashboard-router.js - Corrigido
 */
import { HomeView } from './views/home-view.js';

const routes = {
    // 🚀 O segredo está aqui: Instanciar a classe com 'new'
    'home': new HomeView() 
};

export async function navegar(rota) {
    const container = document.getElementById('spa-content');
    const view = routes[rota];

    if (view) {
        // ETAPA 1: Injeta o HTML (Síncrono)
        container.innerHTML = view.render();
        
        // ETAPA 2: Dispara a busca de dados (Assíncrono)
        // Como o HTML já está no DOM, o JS agora consegue achar o 'btn-continuar-onde-parei'
        if (view.carregarSumario) {
            await view.carregarSumario();
        }
    }
}