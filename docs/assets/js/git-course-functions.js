// Last update: May 02, 2026 – 17:42
// git-course-functions.js - SPA + Mock
// Abril 2026 – Refatorado completo
import { CONFIG } from "./config.js";

const API = CONFIG.API_URL;

// 🔹 Login real via backend
export async function loginAPI(email, password, apiUrl = API) {
    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password })
        });

        if (!response.ok) {
            console.warn("⚠️ Login API falhou:", response.status);
            return null;
        }

        const data = await response.json();

        if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            return data;
        } else {
            console.warn("⚠️ Nenhum access_token retornado:", data);
            return null;
        }

    } catch (err) {
        console.error("❌ Erro de rede loginAPI:", err);
        return null;
    }
}

// 🔹 Buscar progresso do usuário
export async function getProgress(apiUrl = API) {
    const token = localStorage.getItem("access_token");

    if (!token) throw new Error("Token não encontrado");

    try {
        const response = await fetch(`${apiUrl}/progress/summary`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return await response.json();

    } catch (err) {
        console.error("❌ Erro ao buscar progresso:", err);
        throw err;
    }
}

// 🔹 Registrar progresso de uma aula
export async function registrarEAvancar(_, topicId, proximaAula) {
    const token = localStorage.getItem("access_token");

    const navegar = () => {
        window.location.href = CONFIG.REPO_BASE + proximaAula;
    };

    if (!token) {
        console.warn("⚠️ Sem token → seguindo como visitante");
        navegar();
        return;
    }

    try {
        const response = await fetch(`${API}/progress/complete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ topic_id: parseInt(topicId) })
        });

        if (response.ok) {
            console.log("✅ Progresso registrado:", topicId);
            navegar();
        } else if (response.status === 401) {
            console.warn("⚠️ Sessão expirada");
            window.location.href = CONFIG.REPO_BASE + "auth/login.html";
        } else {
            console.error("❌ Falha ao registrar:", response.status);
            navegar(); // não trava o aluno
        }

    } catch (err) {
        console.error("❌ Erro de rede:", err);
        navegar(); // fallback
    }
}

// 🔹 Logout do usuário
export function logout(redirectUrl = CONFIG.REPO_BASE + "auth/login.html") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    window.location.href = redirectUrl;
}
