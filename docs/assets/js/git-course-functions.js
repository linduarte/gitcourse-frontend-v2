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
export async function registrarEAvancar(proximaAula) {
    // 1. Definição Local (Garante que a função possui o endereço)
    const API_URL = "https://charles-gitcourse.duckdns.org"; 
    const token = localStorage.getItem("access_token");
    const btn = window.event ? window.event.currentTarget || window.event.target : null;

    console.log("📡 Tentando registrar progresso para:", proximaAula);

    const navegar = () => { window.location.href = proximaAula; };

    if (!token) {
        console.warn("⚠️ Token não encontrado no LocalStorage!");
        navegar(); return;
    }

    try {
        // 2. O Disparo (Acompanhe na aba 'Network' do F12)
        const response = await fetch(`${API_URL}/progress/complete`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ lesson_url: proximaAula })
        });

        if (response.ok && btn) {
            // 3. Feedback Visual (O sinal de sucesso)
            btn.style.backgroundColor = "#28a745"; 
            btn.innerHTML = "Registrado! ✓";
            console.log("✅ VPS respondeu com SUCESSO.");
            
            setTimeout(navegar, 800); 
        } else {
            console.error("❌ VPS recusou o registro. Status:", response.status);
            navegar();
        }
    } catch (error) {
        console.error("🚨 Erro crítico de rede/CORS:", error);
        navegar();
    }
}