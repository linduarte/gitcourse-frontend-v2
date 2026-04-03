import { navegar } from './dashboard-router.js';
import { inicializarDashboard } from './dashboard-logic.js';

// Se você não for usar o logout aqui, não precisa importar. 
// O logout será usado no navigation.js (que controla o menu).

document.addEventListener('DOMContentLoaded', async () => {
    await inicializarDashboard();
    navegar('home');
});