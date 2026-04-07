/**
 * GitCourse - Funções de Integração Frontend/Backend
 * Refatoração Charles Duarte - Abril 2026
 */

const API_URL = "https://charles-gitcourse.duckdns.org";

/**
 * Registra o progresso de uma aula e avança para a próxima.
 * @param {Event} event - O evento de clique do botão.
 * @param {number} topicId - O ID da aula atual.
 * @param {string} proximaAula - O link para a próxima página.
 */
export async function registrarEAvancar(event, topicId, proximaAula) {
    // 1. Previne o comportamento padrão do navegador (essencial para SPAs)
    if (event) event.preventDefault();

    // 2. Captura referências e credenciais
    const btn = event ? (event.currentTarget || event.target) : null;
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email") || "test_insonia@test.com";

    console.log(`📡 [Fluxo] Iniciando registro da Aula ${topicId} para ${email}`);

    // Função auxiliar para navegação
    const navegar = () => { window.location.href = proximaAula; };

    // 3. Validação de Token (Modo Visitante vs Logado)
    if (!token) {
        console.warn("⚠️ [Auth] Token não encontrado. Navegando como visitante.");
        navegar();
        return;
    }

    try {
        // 4. Disparo do Sinal para a VPS
        const response = await fetch(`${API_URL}/progress/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // O "Crachá" que mata o 401
            },
            body: JSON.stringify({
                email: email,
                topic_id: parseInt(topicId)
            })
        });

        // 5. Tratamento de Resposta
        if (response.ok) {
            console.log("✅ [VPS] Registro concluído. Telegram acionado.");
            
            // Feedback visual imediato
            if (btn) {
                btn.innerText = "Registrado! ✓";
                btn.style.backgroundColor = "#28a745"; // Verde Sucesso
                btn.disabled = true;
            }

            // Delay de 800ms para o usuário ver o "Registrado!" antes de saltar
            setTimeout(navegar, 800);

        } else if (response.status === 401) {
            console.error("❌ [Auth] Sessão expirada ou Token inválido (401).");
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            window.location.href = "login.html";
        } else {
            const erroMsg = await response.text();
            console.error(`❌ [Erro] Status ${response.status}: ${erroMsg}`);
            navegar(); // Navega mesmo com erro para não travar o aluno
        }

    } catch (error) {
        console.error("💥 [Rede] Falha crítica de conexão:", error);
        navegar();
    }
}