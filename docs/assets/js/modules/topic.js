import { protectRoute, loadNavbar, getCurrentUser } from "../git-course-functions.js";

document.addEventListener("DOMContentLoaded", async () => {
    protectRoute();
    loadNavbar();

    const params = new URLSearchParams(window.location.search);
    const topicId = params.get("id");

    const titleEl = document.getElementById("topic-title");
    const contentEl = document.getElementById("topic-content");

    try {
        const response = await fetch(`${API_URL}/topics/${topicId}`);
        const topic = await response.json();

        titleEl.textContent = topic.title;
        contentEl.innerHTML = topic.content_html;

    } catch (err) {
        console.error(err);
        titleEl.textContent = "Erro ao carregar tópico.";
    }

    document.getElementById("mark-done").addEventListener("click", async () => {
        const user = await getCurrentUser();

        await fetch(`${API_URL}/progress`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({
                user_id: user.id,
                topic_id: Number(topicId)
            })
        });

        alert("Progresso salvo!");
    });
});
