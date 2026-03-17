// ===============================
// 1. Proteção de rota
// ===============================
export function protectRoute() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        // Caminho absoluto — funciona em qualquer página
        window.location.href = "/auth/login.html";
        return false;
    }

    return true;
}

// ===============================
// 2. Buscar usuário autenticado
// ===============================
export async function getCurrentUser() {
    const token = localStorage.getItem("access_token");

    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) return null;

        return await response.json();

    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        return null;
    }
}

// ===============================
// 3. Logout
// ===============================
export function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "/auth/login.html"; // Caminho absoluto
}

// ===============================
// 4. Carregar navbar dinâmica
// ===============================
export async function loadNavbar() {
    const navbarContainer = document.getElementById("navbar");

    if (!navbarContainer) return;

    const user = await getCurrentUser();

    navbarContainer.innerHTML = `
        <nav class="navbar">
            <div class="nav-left">
                <a href="/curso/topics.html">Tópicos</a>
                <a href="/curso/progress.html">Progresso</a>
                <a href="/curso/program.html">Programa</a>
            </div>

            <div class="nav-right">
                <span class="user-info">${user ? user.email : ""}</span>
                <button id="logoutBtn" class="logout-btn">Sair</button>
            </div>
        </nav>
    `;

    document.getElementById("logoutBtn").addEventListener("click", logout);
}
