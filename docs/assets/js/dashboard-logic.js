// Last update: May 19, 2026 – 15:39
// dashboard-logic.js — Versão Consolidada 2026-05-15
// Controle de progresso e proteção de acesso para páginas de aula

import { registrarEAvancar, logout } from "./git-course-functions.js?v=2026-05-19-v9";
import { CONFIG } from "../config.js?v=2026-05-19-v9";

document.addEventListener("DOMContentLoaded", () => {
    // 1. 🔐 Verificação de Segurança
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.warn("⚠️ Acesso negado: Token não encontrado. Redirecionando para login.");
        window.location.href = `${CONFIG.REPO_BASE}index.html`;
        return;
    }

    // 2. 🔓 Gerenciamento de Logout
    // Procura por 'logoutButton' ou 'btn-logout' (suporte a ambos os padrões usados nos seus HTMLs)
    const logoutBtn = document.getElementById("logoutButton") || document.getElementById("btn-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout(); // Usa a função centralizada do functions.js
        });
    }

    // 3. 🎯 Lógica do Botão "Concluído"
    const btn = document.getElementById("markCompletedButton");

    if (btn) {
        btn.addEventListener("click", async () => {
            // Extração segura de dados do dataset do HTML
            const topicId = Number(btn.dataset.topicId);
            const nextLesson = btn.dataset.nextLesson || null;

            if (!topicId || isNaN(topicId)) {
                console.error("❌ Erro: data-topic-id ausente ou inválido no botão.");
                return;
            }

            // Feedback visual de processamento (UX)
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Gravando...";

            try {
                // Envia para o backend (DuckDNS) e redireciona se houver sucesso
                await registrarEAvancar(topicId, nextLesson);

                // Feedback de sucesso (caso o redirecionamento demore 1s)
                btn.innerText = "Concluído ✓";
                btn.classList.add("completed");
                btn.style.backgroundColor = "#10b981"; // Verde Starship

            } catch (err) {
                console.error("❌ Erro no registro de progresso:", err);
                
                // Reabilita o botão para nova tentativa em caso de falha de rede
                btn.disabled = false;
                btn.innerText = originalText;
                alert("Falha ao salvar progresso. Verifique sua conexão com a internet.");
            }
        });
    }
});