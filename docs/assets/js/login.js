// login.js - v1.3 Refatorado
// Charles Duarte - Foco em Sequência Lógica e Proteção de Dados

const API_URL = "https://charles-gitcourse.duckdns.org:8000";

document.addEventListener('DOMContentLoaded', () => {
    console.log("🔌 Sistema de Login: Inicializado.");

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. CAPTURA DOS INPUTS (O básico primeiro)
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        console.log("📡 Tentando conexão com a VPS...");

        try {
            // 2. DISPARO DO LOGIN
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'email': emailInput,
                    'password': passwordInput
                })
            });

            if (!response.ok) {
                alert("❌ Falha no login. Verifique e-mail e senha.");
                return;
            }

            // 3. RECEBIMENTO DOS DADOS (Aqui o 'data' nasce!)
            const data = await response.json();

            // 4. GRAVAÇÃO SEGURA NA MEMÓRIA (Proteção de Engenharia)
            const nomeUsuario = (data.user && data.user.name) ? data.user.name : "Charles";
            
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user_name", nomeUsuario);
            localStorage.setItem("user_email", emailInput);

            console.log("✅ Autenticado. Verificando telemetria...");

            // 5. BUSCA DE PROGRESSO (Para decidir a rota)
            const resProg = await fetch(`${API_URL}/progress/summary?email=${emailInput}`, {
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });

            const progresso = resProg.ok ? await resProg.json() : { completed: 0 };

            // 6. INTELIGÊNCIA DE ROTA (A decisão do Charles)
            if (!progresso || progresso.completed === 0) {
                console.log("🆕 Direcionando para o Prefácio...");
                window.location.href = "../curso/git-course/1a-prefacio.html";
            } else {
                console.log("📈 Direcionando para a Dashboard...");
                window.location.href = "../dashboard.html";
            }

        } catch (error) {
            console.error("❌ Curto-circuito no Login:", error);
            alert("Erro de conexão com o servidor. Verifique se o SSL na porta 8000 está ativo.");
        }
    });
});