// Last update: May 15, 2026 – 08:18
// progress.js — Versão Consolidada 2026-05-15
// Foco: Interceptação do botão "Concluído" nas páginas de aula

import { registrarEAvancar, logout } from "./git-course-functions.js?v=2026-05-13-v8";
import { CONFIG } from "../config.js?v=2026-05-13-v8";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");

    // 1. 🔒 Proteção de Página
    if (!token) {
        console.warn("Sessão não encontrada. Redirecionando...");
        window.location.href = `${CONFIG.REPO_BASE}index.html`;
        return;
    }

    // 2. 🔓 Configuração do Logout (se existir o botão na aula)
    const logoutBtn = document.getElementById("logoutButton");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    // 3. 🎯 Lógica do Botão "Concluído ✓"
    const btn = document.getElementById("markCompletedButton");

    if (btn) {
        btn.addEventListener("click", async () => {
            // Extração de metadados do botão
            const topicId = Number(btn.dataset.topicId);
            const nextLesson = btn.dataset.nextLesson || null;

            if (isNaN(topicId)) {
                console.error("❌ Erro: ID do tópico inválido no botão.");
                return;
            }

            // Feedback visual de processamento
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Sincronizando...";

            try {
                // Chamada ajustada à assinatura correta: (topicId, proximaAula)
                await registrarEAvancar(topicId, nextLesson);

                // Feedback visual de sucesso
                btn.innerText = "Registrado! ✓";
                btn.style.backgroundColor = "#10b981"; // Verde sucesso
                btn.classList.add("completed");

            } catch (err) {
                console.error("❌ Falha na comunicação com DuckDNS:", err);
                
                // Reverte o botão para permitir nova tentativa
                btn.disabled = false;
                btn.innerText = originalText;
                alert("Não foi possível salvar seu progresso agora. Verifique sua conexão.");
            }
        });
    }
});