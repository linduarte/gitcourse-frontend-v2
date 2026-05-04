// Last update: May 04, 2026 – 17:42
// módulo de tópico (refatorado)

import { CONFIG } from "../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = CONFIG.REPO_BASE + "auth/login.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug"); // importante: backend usa slug

    const titleEl = document.getElementById("topic-title");
    const contentEl = document.getElementById("topic-content");

    try {
        const response = await fetch(`${CONFIG.API_URL}/topics/${slug}`);
        if (!response.ok) throw new Error("Falha ao carregar tópico");
        const topic = await response.json();

        titleEl.textContent = topic.title;
        contentEl.innerHTML = topic.content_html;
    } catch (err) {
        console.error(err);
        titleEl.textContent = "Erro ao carregar tópico.";
    }

    const markBtn = document.getElementById("mark-done");
    if (markBtn) {
        markBtn.addEventListener("click", async () => {
            try {
                await fetch(`${CONFIG.API_URL}/progress/complete`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        topic_id: Number(markBtn.dataset.topicId)
                    })
                });

                alert("Progresso salvo!");
            } catch (err) {
                console.error(err);
                alert("Erro ao salvar progresso.");
            }
        });
    }
});
