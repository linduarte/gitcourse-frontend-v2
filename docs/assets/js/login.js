// docs/assets/js/login.js

const API_URL = "https://charles-gitcourse.duckdns.org";

document.addEventListener('DOMContentLoaded', () => {
    console.log("🔌 Sistema de Login: Inicializado.");

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Confirmado via Swagger: o endpoint TEM o prefixo /auth
            const endpoint = `${API_URL}/auth/login`;
            console.log(`📡 Transmitindo para: ${endpoint}`);

            const response = await fetch(endpoint, {
                method: 'POST',
                mode: 'cors', // Força o modo Cross-Origin
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Grava os dados para o Dashboard buscar no Postgres
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user_email", email); 
                
                console.log("✅ Login autorizado via Postgres!");
                window.location.href = "../dashboard.html";
                
            } else {
                const error = await response.json();
                alert(`Erro: ${error.detail || "Falha na autenticação."}`);
            }

        } catch (error) {
            console.error("💥 Falha de Rede:", error);
            // Se cair aqui, a VPS recusou a conexão antes mesmo de ler o login
            alert("Erro de Rede: Verifique se o Uvicorn está ativo na VPS.");
        }
    });
});