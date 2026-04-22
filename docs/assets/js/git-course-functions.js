// git-course-functions.js - Versão final (Módulo ES6)
// Autor: Charles Duarte - Abril 2026
// 🔹 Funções de integração Frontend ↔ Backend
// 🔹 Compatível com import { login, register, logout, registrarEAvancar, getProgress } from "./git-course-functions.js"

export async function register(email, password, apiUrl) {
    try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) return false;
        return true;
    } catch (err) {
        console.error("Erro no register:", err);
        return false;
    }
}

export async function login(email, password, apiUrl) {
    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) return false;

        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            return true;
        }
        return false;
    } catch (err) {
        console.error("Erro no login:", err);
        return false;
    }
}

export function logout(redirectUrl = "/gitcourse-frontend-v2/index.html") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    window.location.href = redirectUrl;
}

export async function registrarEAvancar(event, topicId, proximaAula, apiUrl) {
    if (event) event.preventDefault();
    const btn = event ? (event.currentTarget || event.target) : null;
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email") || "visitante@test.com";

    const navegar = () => { window.location.href = proximaAula; };

    if (!token) {
        console.warn("⚠️ Token não encontrado. Redirecionando como visitante.");
        navegar();
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/progress/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email, topic_id: parseInt(topicId) })
        });

        if (response.ok && btn) {
            btn.innerText = "Registrado! ✓";
            btn.style.backgroundColor = "#28a745";
            btn.disabled = true;
            setTimeout(navegar, 800);
        } else if (response.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "/gitcourse-frontend-v2/login.html";
        } else {
            console.error(`Erro no registro: Status ${response.status}`);
            navegar();
        }
    } catch (err) {
        console.error("Erro de rede:", err);
        navegar();
    }
}

export async function getProgress(apiUrl) {
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
        console.error("Erro ao buscar progresso:", err);
        throw err;
    }
}