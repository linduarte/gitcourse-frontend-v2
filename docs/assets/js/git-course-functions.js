// assets/js/git-course-functions.js

// assets/js/git-course-functions.js

export async function getCurrentUser() {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
        // CORREÇÃO: A rota correta na sua VPS é /dashboard (sem o /auth/)
        const response = await fetch(`${API_URL}/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("Erro na resposta da VPS:", response.status);
            return null;
        }

        const data = await response.json();
        
        // O seu backend retorna um objeto com { user_email: "..." }
        // Vamos padronizar para retornar um objeto que o dashboard entenda
        return { email: data.user_email };

    } catch (error) {
        console.error("Erro de conexão com a VPS:", error);
        return null;
    }
}


export function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "auth/login.html";
}
