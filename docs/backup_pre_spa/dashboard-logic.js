import { API_URL } from "./config.js";

let token = null;

/**
 * Inicializa o Dashboard
 */
export async function inicializarDashboard() {

    // Elementos
    const emailDisplay = document.getElementById("userEmailDisplay");
    const welcomeMsg = document.getElementById("welcomeMessage");
    const btnContinue = document.getElementById("btnContinueCard");

    const progressBarFill = document.getElementById("progressBarFill");
    const progressText = document.getElementById("progressCardContent");

    // Sessão
    token = localStorage.getItem("access_token");

    if (!token) {
        console.warn("Token não encontrado");
        window.location.href = "auth/login.html";
        return;
    }

    // --- PERFIL ---
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error();

        const user = await response.json();

        if (emailDisplay) emailDisplay.textContent = user.email;
        if (welcomeMsg) welcomeMsg.textContent = "Sincronizado com a VPS.";

        localStorage.setItem("user_email", user.email);

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        localStorage.clear();
        window.location.href = "auth/login.html";
        return;
    }

    // --- PROGRESSO ---
    const progresso = await sincronizarProgresso(progressBarFill, progressText);

    // --- EVENTO BOTÃO ---
    btnContinue?.addEventListener("click", navegarParaUltimoProgresso);
}

/**
 * Busca progresso
 */
async function sincronizarProgresso(progressBarFill, progressText) {
    try {
        const response = await fetch(`${API_URL}/progress/summary`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error();

        const data = await response.json();

        const concluido = data.completed ?? 0;
        const total = data.total ?? 17;
        const percentagem = data.percentage ?? 0;

        atualizarUI(progressBarFill, progressText, concluido, total, percentagem);

        return concluido;

    } catch (error) {
        console.error("Erro progresso:", error);
        return 0;
    }
}

/**
 * Atualiza UI
 */
function atualizarUI(progressBarFill, progressText, c, t, p) {

    if (progressBarFill) {
        progressBarFill.style.width = `${p}%`;

        if (p >= 100) {
            progressBarFill.style.backgroundColor = "#FFD700";
            progressBarFill.style.boxShadow = "0 0 10px #FFD700";
        }
    }

    if (progressText) {
        progressText.innerHTML = p >= 100
            ? `🎊 PARABÉNS! Curso concluído!`
            : `Concluíste <strong>${c}</strong> de <strong>${t}</strong> (${p}%)`;
    }
}

/**
 * Navegação inteligente
 */
export async function navegarParaUltimoProgresso() {

    const mapa = {
        0: "1a-prefacio.html",
        1: "2-introduction.html",
        2: "3-git-config.html",
        3: "4-hosting.html",
        4: "5-connect.html",
        5: "6-git-clone.html",
        6: "7-git-status.html",
        7: "8-git-add.html",
        8: "9-git-commit.html",
        9: "10-feature_req.html",
        10: "11-branch.html",
        11: "12-branch-merge.html",
        12: "13-git-diff.html",
        13: "14-undo-changes.html",
        14: "15-git-init.html",
        15: "16-git-workflows.html",
        16: "../../dashboard.html"
    };

    try {
        const response = await fetch(`${API_URL}/progress/summary`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();

        const concluido = data.completed ?? 0;

        const destino = mapa[concluido] || "1a-prefacio.html";

        window.location.href = `curso/git-course/${destino}`;

    } catch {
        window.location.href = "curso/git-course/1a-prefacio.html";
    }
}