import { HomeView } from './views/home-view.js';

const routes = {
    home: new HomeView()
};

export async function navegar(rota) {
    const container = document.getElementById('spa-content');

    if (!container) {
        console.error("❌ Container SPA não encontrado");
        return;
    }

    const view = routes[rota];

    if (view) {
        container.innerHTML = "";
        await view.render();
    } else {
        container.innerHTML = "<h2>Rota não encontrada</h2>";
    }
}