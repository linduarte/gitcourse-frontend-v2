/**
 * git-course-functions.js
 * Utilitários globais para o Git Course.
 * Charles Duarte - v2.0 SPA
 */



/**
 * Realiza o Logout seguro do sistema
 */
export function logout() {
    console.log("🔐 Encerrando sessão...");
    localStorage.clear();
    // Use o caminho completo do repositório para evitar o 404
    window.location.href = "/gitcourse-frontend-v2/index.html"; 
}
/**
 * Formata datas ou outras strings se necessário futuramente
 */
export function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString('pt-BR');
}

/**
/**
 * REGISTRAR E AVANÇAR (Versão Refatorada - Sem Remendos)
 * Envia o progresso para a VPS, dá feedback visual e navega.
 */
export async function registrarEAvancar(topicId, proximaAula) { // Agora recebe topicId
    const API_URL = "https://charles-gitcourse.duckdns.org"; 
    const token = localStorage.getItem("access_token");
    const btn = window.event ? window.event.currentTarget || window.event.target : null;

    const navegar = () => { window.location.href = proximaAula; };

    if (!token) { navegar(); return; }

    try {
        const response = await fetch(`${API_URL}/progress/complete`, { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            // ENVIANDO O ID COMO NÚMERO (conforme o Swagger)
            body: JSON.stringify({ topic_id: parseInt(topicId) }) 
        });

        if (response.ok && btn) {
            btn.style.backgroundColor = "#28a745"; 
            btn.innerHTML = "Registrado! ✓";
            setTimeout(navegar, 800); 
        } else {
            console.error("Erro na VPS:", response.status);
            navegar();
        }
    } catch (error) {
        navegar();
    }
}