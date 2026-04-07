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
/**
 * git-course-functions.js - Versão Corrigida (Fim do 401)
 */
export async function registrarEAvancar(event, topicId, proximaAula) {
    // 1. Evita que a página recarregue e interrompa o fetch
    if (event) event.preventDefault();

    const API_URL = "https://charles-gitcourse.duckdns.org";
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email") || "test_insonia@test.com";

    // Captura o botão para dar feedback visual
    const btn = event ? event.currentTarget || event.target : null;

    console.log(`📡 Tentando registrar aula ${topicId} para ${email}...`);

    const navegar = () => { window.location.href = proximaAula; };

    // Se não houver token, o usuário é um visitante: apenas navegamos.
    if (!token) {
        console.warn("⚠️ Visitante detectado (sem token). Apenas navegando...");
        navegar();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/progress/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 🔐 O "CRACHÁ" QUE ESTAVA FALTANDO:
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                email: email,
                topic_id: parseInt(topicId)
            })
        });

        if (response.ok) {
            console.log("✅ Aula registrada com sucesso na VPS!");
            
            // Feedback Visual: Transforma o botão em "Registrado!"
            if (btn) {
                btn.innerText = "Registrado! ✓";
                btn.classList.add("btn-success"); // Se você tiver essa classe no CSS
            }

            // Aguarda 1 segundo para o usuário ver o sucesso e depois navega
            setTimeout(navegar, 1000);

        } else {
            const erroData = await response.json();
            console.error("❌ Erro da VPS:", response.status, erroData);
            alert(`Erro ${response.status}: Não foi possível registrar seu progresso.`);
        }
    } catch (error) {
        console.error("💥 Erro de rede:", error);
        // Se a rede falhar, navegamos de qualquer forma para não travar o aluno
        navegar();
    }
}