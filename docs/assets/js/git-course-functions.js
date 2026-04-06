/**
 * git-course-functions.js
 * Utilitários globais para o Git Course.
 * Charles Duarte - v2.0 SPA
 */
// Adicione isto no topo, se não estiver vindo de outro lugar:
const API_URL = "https://charles-gitcourse.duckdns.org"; // Substitua pela sua URL real da VPS


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
    const token = localStorage.getItem("access_token");
    // Captura o botão que disparou o evento (o 'alvo' do clique)
    const btn = window.event ? window.event.currentTarget || window.event.target : null;

    console.log(`📡 Sincronizando: ${proximaAula}`);

    // Função interna para mudar a página (centraliza a saída)
    const navegar = () => {
        window.location.href = proximaAula;
    };

    // Se não houver token, o test_insonia deslogou. Navega sem salvar.
    if (!token) {
        console.warn("⚠️ Sem token de acesso. Navegando sem registrar.");
        navegar();
        return;
    }

    try {
        // 1. DISPARO PARA A VPS
        const response = await fetch(`${API_URL}/progress/update`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ lesson_url: proximaAula })
        });

        // 2. TRATAMENTO DE SUCESSO (Feedback Visual)
        if (response.ok && btn) {
            // Mudança de estado do botão (O "Banho de Verde")
            btn.style.transition = "background-color 0.3s ease"; // Suaviza a cor
            btn.style.backgroundColor = "#28a745"; 
            btn.style.color = "#ffffff";
            btn.innerHTML = "Registrado! ✓";
            
            console.log("✅ Progresso salvo na VPS.");

            // 3. O "DELAY" DE ENGENHARIA (Aguardamos 0.8s para o usuário ver o verde)
            setTimeout(navegar, 800); 
        } else {
            // Se a VPS responder erro (ex: 401 ou 500), não travamos o aluno
            console.error("❌ Erro na resposta da VPS. Prosseguindo...");
            navegar();
        }

    } catch (error) {
        // Se houver queda de rede ou erro de fetch, o curso continua
        console.error("⚠️ Falha crítica de comunicação:", error);
        navegar();
    }
}
