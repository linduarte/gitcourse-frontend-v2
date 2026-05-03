
// Last update: May 03, 2026 – 09:53
// dashboard-logic.js – Controle de progresso dentro das páginas do curso
// Usa o fluxo oficial registrarEAvancar()

import { registrarEAvancar } from "/gitcourse-frontend-v2/assets/js/git-course-functions.js";
import { CONFIG } from "/gitcourse-frontend-v2/assets/js/config.js";

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("access_token");

    // 🔒 Proteção: usuário não autenticado → volta para landing
    if (!token) {
        window.location.href = `${CONFIG.REPO_BASE}landing.html`;
        return;
    }

    // 🔓 Logout (se existir na página)
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

