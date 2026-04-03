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
    localStorage.removeItem("user_email");
    // Se você está na pasta /curso/git-course/, precisa subir dois níveis:
    window.location.href = "../../index.html"; 
}


async function registrarEAvancar(proximaAulaSlug) {
    const token = localStorage.getItem('access_token');
    
    // Mapeamento simples: se a Aula 2 foi concluída, o topic_id é 2
    // Extraímos o número do nome do arquivo (ex: "2-introduction.html" -> 2)
    const topicId = parseInt(window.location.pathname.split('/').pop()) || 0;

    if (token && topicId > 0) {
        try {
            await fetch(`${API_URL}/progress/complete`, {
                method: 'POST', // O HTTPie provou que é POST
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    topic_id: topicId, // O HTTPie provou que o banco quer o ID
                    completed: true 
                })
            });
        } catch (error) {
            console.error("Erro na telemetria:", error);
        }
    }
    // Segue para a próxima página
    window.location.href = proximaAulaSlug;
}

// Adicione isso na última linha do arquivo git-course-functions.js
window.registrarEAvancar = registrarEAvancar;