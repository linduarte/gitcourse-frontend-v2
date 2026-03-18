/**
 * SISTEMA DE AUTENTICAÇÃO - GIT COURSE
 * Desenvolvedor: Charles Duarte
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🔌 Sistema de Login: Inicializado.");

    const loginForm = document.getElementById('login-form');

    // Verifica se o componente existe no painel (HTML)
    if (!loginForm) {
        console.error("❌ Erro Crítico: Formulário 'login-form' não encontrado no HTML.");
        return;
    }

    console.log("✅ Formulário detectado. Aguardando ignição...");

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o refresh da página
        
        console.log("🚀 Botão 'Entrar' clicado. Coletando dados...");

        // 1. Coleta de Dados do Painel
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // 2. Preparação da Carga (OAuth2 Password Flow)
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            console.log(`📡 Conectando à VPS: ${API_URL}/auth/token...`);

            // 3. Disparo da Requisição
            const response = await fetch(`${API_URL}/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            // 4. Análise da Resposta do Servidor
            if (response.ok) {
                const data = await response.json();
                
                // Grava o "Passaporte" (Token) no bolso do navegador
                localStorage.setItem("access_token", data.access_token);
                
                console.log("✅ Autenticação bem-sucedida! Token armazenado.");
                
                // Redirecionamento de Rota
                window.location.href = "../dashboard.html";
            } else {
                const errorDetail = await response.json();
                console.warn("⚠️ Falha na Autenticação:", errorDetail.detail);
                alert(`Acesso negado: ${errorDetail.detail || "Usuário ou senha inválidos."}`);
            }

        } catch (error) {
            // Falha de Hardware/Rede (VPS fora do ar, erro de DNS, etc)
            console.error("💥 Falha de Conexão com a VPS:", error);
            alert("Erro de Rede: Não foi possível alcançar o servidor na VPS.");
        }
    });
});