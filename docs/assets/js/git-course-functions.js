// assets/js/git-course-functions.js

// assets/js/git-course-functions.js

async function getCurrentUser() {
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


function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "auth/login.html";
}


async function registrarEAvancar(proximaAulaSlug) {
    const token = localStorage.getItem('access_token');
    // const API_URL = 'https://charles-gitcourse.duckdns.org';

    // 1. Tenta avisar a VPS (Sincronização)
    if (token) {
        try {
            await fetch(`${API_URL}/users/me/progress`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ last_lesson: proximaAulaSlug })
            });
            console.log("Progresso sincronizado com a VPS!");
        } catch (error) {
            console.error("VPS offline, mas vamos seguir viagem:", error);
        }
    }

    // 2. Navegação (O destino que você já tinha: 2-introduction.html)
    window.location.href = proximaAulaSlug;
}

// Adicione isso na última linha do arquivo git-course-functions.js
window.registrarEAvancar = registrarEAvancar;