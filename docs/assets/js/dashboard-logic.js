// dashboard-logic.js

import { CONFIG } from './config.js';

/**
 * 🔐 Valida sessão do usuário
 */
export function getSession() {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    if (!token || !email) {
        return null;
    }

    return { token, email };
}

/**
 * 🚫 Redireciona se não estiver logado
 */
export function requireAuth() {
    const session = getSession();

    if (!session) {
        console.warn("⚠️ Usuário não autenticado");
        window.location.href = "auth/login.html";
        return null;
    }

    return session;
}

/**
 * 👤 Busca dados do usuário
 */
export async function fetchUser() {
    const session = requireAuth();
    if (!session) return null;

    try {
        const res = await fetch(`${CONFIG.API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        });

        if (!res.ok) throw new Error("Erro ao buscar usuário");

        return await res.json();

    } catch (err) {
        console.error("❌ fetchUser:", err);
        return null;
    }
}

/**
 * 📊 Busca progresso do usuário
 */
export async function fetchProgress() {
    const session = requireAuth();
    if (!session) return null;

    try {
        const res = await fetch(
            `${CONFIG.API_URL}/progress/summary?email=${session.email}`,
            {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            }
        );

        if (!res.ok) throw new Error("Erro ao buscar progresso");

        return await res.json();

    } catch (err) {
        console.error("❌ fetchProgress:", err);
        return null;
    }
}

/**
 * 🚀 Função combinada (opcional)
 */
export async function fetchDashboardData() {
    const session = requireAuth();
    if (!session) return null;

    try {
        const [user, progress] = await Promise.all([
            fetchUser(),
            fetchProgress()
        ]);

        return { user, progress };

    } catch (err) {
        console.error("❌ fetchDashboardData:", err);
        return null;
    }
}