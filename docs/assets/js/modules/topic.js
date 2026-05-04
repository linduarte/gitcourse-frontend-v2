// Last update: May 04, 2026 – 17:32
// Last update: May 04, 2026 – Revisado por Copilot

import { CONFIG } from "../config.js";

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = CONFIG.REPO_BASE + "auth/login.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const topicId = params.get("id");

    const titleEl = document.getElementById("topic-title");
    const contentEl = document.getElementById("topic-content");

    try {
        const response = await fetch(`${CONFIG.API_URL}/topics/${topicId}`);
        const topic = await response.json();

        titleEl.textContent = topic.title;
        contentEl.innerHTML = topic.content_html;

    } catch (err) {
        console.error(err);
        titleEl.textContent = "Erro ao carregar tópico.";
    }

    document.getElementById("mark-done").addEventListener("click", async () => {

        try {
            await fetch(`${CONFIG.API_URL}/progress/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    topic_id: Number(topicId),
                    completed: true,
                    feedback: "Concluído via módulo"
                })
            });

            alert("Progresso salvo!");

        } catch (err) {
            console.error(err);
            alert("Erro ao salvar progresso.");
        }
    });
});
