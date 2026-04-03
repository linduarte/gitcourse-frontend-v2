// docs/assets/js/login.js
// //import { API_URL } from './config.js'; // O './' é obrigatório para arquivos na mesma pasta
const API_URL = "https://charles-gitcourse.duckdns.org"; // <-- Defina direto aqui


document.addEventListener('DOMContentLoaded', () => {
    console.log("🔌 Sistema de Login: Inicializado.");

    const loginForm = document.getElementById('login-form');

    if (!loginForm) {
        console.error("❌ Erro Crítico: Formulário 'login-form' não encontrado no HTML.");
        return;
    }

        loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        console.log("🚀 Tentando realizar login...");

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const loginData = {
            email: email,
            password: password
        };

        try {
            console.log(`📡 Conectando à VPS: ${API_URL}/auth/login...`);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const data = await response.json();
                
                // --- AQUI ENTRA A MUDANÇA ---
                // Salva o token retornado pela VPS
                localStorage.setItem("access_token", data.access_token);
                // Salva o email que o usuário acabou de digitar no formulário
                localStorage.setItem("user_email", email); 
                
                console.log("✅ Login OK! Redirecionando...");
                window.location.href = "../dashboard.html";
                // ----------------------------
                
            } else {
                const errorDetail = await response.json();
                alert(`Acesso negado: ${errorDetail.detail || "Usuário ou senha inválidos."}`);
            }

        } catch (error) {
            console.error("💥 Falha de Conexão:", error);
            alert("Erro de Rede: Não foi possível alcançar o servidor na VPS.");
        }
    });

});
