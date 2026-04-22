/** 
 * GitCourse - Funções de Integração Frontend/Backend
 * Refatoração blindada contra CONFIG indefinido
 * Autor: Charles Duarte - Abril 2026
 */

// 🔥 Função para obter a API de forma segura
function getAPI() {
    if (!window.CONFIG || !window.CONFIG.API_URL) {
        console.warn("⚠️ CONFIG ou API_URL não encontrado. Usando fallback seguro.");
        return "https://charles-gitcourse.duckdns.org";
    }
    return window.CONFIG.API_URL;
}

// ==================================================
//  FUNÇÃO: registrarEAvancar
// ==================================================
export async function registrarEAvancar(event, topicId, proximaAula) {
    if (event) event.preventDefault();

    const btn = event ? (event.currentTarget || event.target) : null;
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email") || "visitante@test.com";

    console.log(`📡 [Fluxo] Iniciando registro da Aula ${topicId} para ${email}`);

    // Função auxiliar de navegação
    const navegar = () => { 
        if (proximaAula) window.location.href = proximaAula; 
    };

    if (!token) {
        console.warn("⚠️ Token não encontrado. Navegando como visitante.");
        navegar();
        return;
    }

    try {
        const response = await fetch(`${getAPI()}/progress/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                topic_id: parseInt(topicId)
            })
        });

        if (response.ok) {
            console.log("✅ [VPS] Registro concluído.");

            if (btn) {
                btn.innerText = "Registrado! ✓";
                btn.style.backgroundColor = "#28a745";
                btn.disabled = true;
            }

            setTimeout(navegar, 800);

        } else if (response.status === 401) {
            console.error("❌ Sessão expirada ou Token inválido.");
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            window.location.href = "login.html";
        } else {
            const erroMsg = await response.text();
            console.error(`❌ Status ${response.status}: ${erroMsg}`);
            navegar();
        }

    } catch (error) {
        console.error("💥 Falha crítica de conexão:", error);
        navegar();
    }
}

// ==================================================
//  FUNÇÃO: logout
// ==================================================
export function logout() {
    console.log("🔐 Encerrando sessão...");

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");

    const repoPath = "/gitcourse-frontend-v2";
    window.location.href = window.location.origin + repoPath + "/index.html";
}

window.logout = logout;

// ==================================================
//  FUNÇÃO: getProgress
// ==================================================
export async function getProgress() {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Token não encontrado");

    try {
        const response = await fetch(`${getAPI()}/progress/summary`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Erro ao buscar progresso:", error);
        throw error;
    }
}