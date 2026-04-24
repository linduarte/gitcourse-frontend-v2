// git-course-functions.js - FINAL (produção)
// Last update: April 24, 2026 – 14:10

import { CONFIG } from "./config.js";

const API = CONFIG.API_URL;

/**
 * 🔐 Logout global
 */
export function logout(redirectUrl = "/gitcourse-frontend-v2/index.html") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    window.location.href = redirectUrl;
}

/**
 * 🚀 Registro de progresso + navegação
 */
export async function registrarEAvancar(event, topicId, proximaAula) {
    if (event) event.preventDefault();

    const btn = event?.currentTarget || event?.target || null;
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email") || "visitante@test.com";

    const navegar = () => {
        window.location.href = proximaAula;
    };

    console.log("🚀 Clique detectado", { topicId });

    // 🔐 Sem token → modo visitante
    if (!token) {
        console.warn("⚠️ Sem token → navegação direta");
        navegar();
        return;
    }

    // 🔥 REGRA CENTRAL: 2 + 17
    const topicsParaRegistrar = [topicId];
    if (parseInt(topicId) === 2) {
        topicsParaRegistrar.push(17);
    }

    try {
        console.log("📡 Enviando tópicos:", topicsParaRegistrar);

        for (const t of topicsParaRegistrar) {
            const response = await fetch(`${API}/progress/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    topic_id: parseInt(t)
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.error("❌ Token inválido");
                    alert("Sessão expirada. Faça login novamente.");

                    window.location.href =
                        "/gitcourse-frontend-v2/auth/login.html";
                    return;
                }

                console.error(`❌ Erro ao registrar topic ${t}:`, response.status);
            } else {
                console.log(`✅ Topic ${t} registrado`);
            }
        }

        // 🎯 Feedback UI
        if (btn) {
            btn.innerText = "Registrado! ✓";
            btn.style.backgroundColor = "#28a745";
            btn.disabled = true;
        }

        // ⏳ Pequeno delay UX
        setTimeout(navegar, 800);

    } catch (err) {
        console.error("💥 Erro de rede:", err);
        navegar(); // fallback seguro
    }
}

/**
 * 📊 Buscar progresso
 */
export async function getProgress() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("Token não encontrado");
    }

    try {
        const response = await fetch(`${API}/progress/summary`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        return await response.json();

    } catch (err) {
        console.error("❌ Erro ao buscar progresso:", err);
        throw err;
    }
}