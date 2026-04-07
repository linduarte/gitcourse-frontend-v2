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
    
    // 1. Limpa o "combustível" (Token e Progresso)
    localStorage.clear(); 
    
    // 2. Redireciona para a base do projeto
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
export async function registrarEAvancar(event, topicId, proximaAula) { 
    const API_URL = "https://charles-gitcourse.duckdns.org"; 
    const token = localStorage.getItem("access_token");

    // 🕵️‍♂️ Agora o 'event' (ou 'e') existe e podemos capturar o botão!
    const btn = event ? event.currentTarget || event.target : null;

    console.log("📡 Registrando tópico:", topicId);

    const navegar = () => { window.location.href = proximaAula; };

    // Se não tem token, apenas navega (modo visitante)
    if (!token) { 
        console.warn("⚠️ Sem token, apenas navegando...");
        navegar(); 
        return; 
    }

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