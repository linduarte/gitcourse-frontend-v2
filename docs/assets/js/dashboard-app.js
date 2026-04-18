import { navegar } from './dashboard-router.js';
import { inicializarMenuLateral } from './sidebar-logic.js';

const boot = async () => {
    console.log("⚡ Boot SPA iniciado");

    try {
        inicializarMenuLateral();

        // valida sessão básica
        const token = localStorage.getItem("access_token");
        const email = localStorage.getItem("user_email");

        if (!token || !email) {
            console.warn("⚠️ Sem sessão. Redirecionando...");
            window.location.href = "auth/login.html";
            return;
        }

        await navegar('home');

        console.log("✅ SPA pronta!");
    } catch (err) {
        console.error("💥 Erro no boot:", err);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}