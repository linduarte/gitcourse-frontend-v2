// git-course-functions.js - Refatorado 2026-04-23
// Last update: April 23, 2026 – 17:23
import { CONFIG } from "./config.js";

const API = CONFIG.API_URL;

// Função de logout
export function logout(redirectUrl = "/gitcourse-frontend-v2/index.html") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    window.location.href = redirectUrl;
}

// Registro de progresso (inclui suporte para aula 2 + sub-aula 17)
export async function registrarEAvancar(event, topicId, proximaAula) {
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

    // Define os tópicos a registrar
    const topicsParaRegistrar = [topicId];
    if (topicId === 2) topicsParaRegistrar.push(17); // aula 2 + sub-aula 17

    try {
        for (const t of topicsParaRegistrar) {
            const response = await fetch(`${API}/progress/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, topic_id: parseInt(t) })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert("Sessão expirada. Faça login novamente.");
                    window.location.href = "/gitcourse-frontend-v2/login.html";
                    return;
                }
                console.error(`Erro no registro do topic ${t}: Status ${response.status}`);
            } else {
                console.log(`✅ Topic ${t} registrado com sucesso.`);
            }
        }

        // Feedback visual
        if (btn) {
            btn.innerText = "Registrado! ✓";
            btn.style.backgroundColor = "#28a745";
            btn.disabled = true;
        }

        setTimeout(navegar, 800);

    } catch (err) {
        console.error("💥 Erro de rede ao registrar progresso:", err);
        navegar(); // fallback seguro
    }
}

// Função para buscar progresso do usuário
export async function getProgress() {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Token não encontrado");

    try {
        const response = await fetch(`${API}/progress/summary`, {
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