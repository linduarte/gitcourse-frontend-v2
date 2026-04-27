// Last update: April 27, 2026 – 05:12

import { CONFIG } from "./config.js";

const API = CONFIG.API_URL;

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
            body: JSON.stringify({
                topic_id: parseInt(topicId)
            })
        });

        if (response.ok) {
            console.log("✅ Progresso registrado:", topicId);
            navegar();
        } else if (response.status === 401) {
            console.warn("⚠️ Sessão expirada");
            window.location.href = "/gitcourse-frontend-v2/auth/login.html";
        } else {
            console.error("❌ Falha ao registrar:", response.status);
            navegar(); // não trava o aluno
        }

    } catch (err) {
        console.error("❌ Erro de rede:", err);
        navegar(); // fallback
    }

    // 🔹 BUSCA PROGRESSO DO ALUNO
export async function getProgress() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("Token não encontrado");
    }

    try {
        const response = await fetch(`${API}/progress/summary`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("❌ Erro ao buscar progresso:", err);
        throw err;
    }
}

}