import { protectRoute, loadNavbar, getCurrentUser } from "../git-course-functions.js";

document.addEventListener("DOMContentLoaded", async () => {
    protectRoute();
    loadNavbar();

    const user = await getCurrentUser();
    const infoEl = document.getElementById("progress-info");
    const listEl = document.getElementById("progress-list");

    try {
        const topics = await fetch(`${API_URL}/topics`).then(r => r.json());
        const progress = await fetch(`${API_URL}/progress/${user.id}`).then(r => r.json());

        const doneIds = progress.map(p => p.topic_id);
        const percent = Math.round((progress.length / topics.length) * 100);

        infoEl.textContent = `Você concluiu ${progress.length} de ${topics.length} tópicos (${percent}%).`;

        listEl.innerHTML = topics.map(t => `
            <li>
                ${doneIds.includes(t.id) ? "✔" : "✖"} 
                ${t.title}
            </li>
        `).join("");

    } catch (err) {
        console.error(err);
        infoEl.textContent = "Erro ao carregar progresso.";
    }
});
