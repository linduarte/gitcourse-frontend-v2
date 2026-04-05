// Configuração da Central de Comando
const API_URL = "https://charles-gitcourse.duckdns.org";

document.addEventListener('DOMContentLoaded', () => {
    console.log("🔌 Sistema de Login: Inicializado.");

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log("📡 Tentando conexão com a VPS...");

        try {
            // 1. DISPARO DO LOGIN (Padrão JSON Puro)
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' // O "idioma" que a VPS entende
                },
                body: JSON.stringify({
                    'email': email,    // Campo exato da sua estrutura
                    'password': password
                })
            });

            if (!response.ok) {
                alert("❌ Falha no login. Verifique e-mail e senha.");
                return;
            }

            const data = await response.json();

            // 2. GRAVAÇÃO NA MEMÓRIA (O localStorage que faltava!)
            // Sem isso, o Prefácio e a Dashboard darão "Sessão Expirada".
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user_email", email);

            console.log("✅ Token armazenado. Verificando telemetria de progresso...");

            // 3. O DESVIO DE FLUXO DO CHARLES (A Inteligência de Rota)
            const resProg = await fetch(`${API_URL}/progress/summary`, {
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });

            const progresso = resProg.ok ? await resProg.json() : { completed: 0 };

            // No bloco de decisão do login.js, altere para:

            if (!progresso || progresso.completed === 0) {
                console.log("🆕 Direcionando para o Prefácio...");
                // Remova o 'auth/' se o arquivo já estiver na raiz ou ajuste o caminho:
                window.location.href = "1a-prefacio.html"; 
                // Se continuar dando erro, tente: window.location.href = "./auth/1a-prefacio.html";
            } else {
                console.log("📈 Direcionando para a Dashboard...");
                window.location.href = "../dashboard.html";
            }

        } catch (error) {
            console.error("❌ Curto-circuito no Login:", error);
            alert("Erro de conexão com o servidor. Verifique se a VPS está online.");
        }
    });
});