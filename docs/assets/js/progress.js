// Last update: May 03, 2026 – 09:49
// sensor-progresso.js – Registro de conclusão usando o fluxo oficial

import { registrarEAvancar } from "./git-course-functions.js";
import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("access_token");

    // 🔒 Proteção: usuário não autenticado
    if (!token) {
        window.location.href = `${CONFIG.REPO_BASE}landing.html`;
        return;
    }

    // 🔓 Logout
    const logoutBtn = document.getElementById("logoutButton");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_email");
            window.location.href = `${CONFIG.REPO_BASE}landing.html`;
        });
    }

    // 🎯 Botão Concluído
    const btn = document.getElementById("markCompletedButton");

    if (btn) {
        btn.addEventListener("click", async () => {

            const topicId = Number(btn.dataset.topicId);
            const nextLesson = btn.dataset.nextLesson || null;

            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Enviando...";

            try {
                await registrarEAvancar(null, topicId, nextLesson);

                btn.innerText = "Concluído ✓";
                btn.classList.add("completed");

            } catch (err) {
                console.error("❌ Erro ao registrar progresso:", err);
                btn.disabled = false;
                btn.innerText = originalText;
                alert("Erro ao registrar progresso");
            }
        });
    }
});
