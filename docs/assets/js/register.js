const API = window.CONFIG.API;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const resultEl = document.getElementById("result");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // 🎯 Foco automático
    if (emailInput) {
        emailInput.focus();
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // =========================
        // 🔐 VALIDAÇÃO SIMPLES
        // =========================
        if (password.length < 6) {
            resultEl.style.color = "#f87171";
            resultEl.textContent = "A senha deve ter pelo menos 6 caracteres.";
            return;
        }

        if (!/[a-zA-Z]/.test(password)) {
            resultEl.style.color = "#f87171";
            resultEl.textContent = "A senha deve conter pelo menos uma letra.";
            return;
        }

        // =========================
        // ⏳ FEEDBACK
        // =========================
        resultEl.style.color = "#9ca3af";
        resultEl.textContent = "Criando conta...";

        try {
            // =========================
            // 🧾 REGISTRO
            // =========================
            const response = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {

                // 💾 salva email (UX)
                localStorage.setItem("user_email", email);

                resultEl.style.color = "#4ade80";
                resultEl.textContent = "Conta criada! Entrando automaticamente...";

                // =========================
                // 🔐 AUTO LOGIN (CORRIGIDO)
                // =========================
                const loginResponse = await fetch(`${API}/auth/token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        username: email,   // FastAPI espera "username"
                        password: password
                    })
                });

                // 🔍 DEBUG (muito útil agora)
                console.log("🔐 status login:", loginResponse.status);

                const loginData = await loginResponse.json();
                console.log("🔐 resposta login:", loginData);

                if (loginResponse.ok && loginData.access_token) {
                    // 💾 salva token
                    localStorage.setItem("access_token", loginData.access_token);
                
                    console.log("✅ Login automático OK");
                
                    // 🚀 redireciona direto
                    setTimeout(() => {
                        window.location.href = "../dashboard.html";
                    }, 800);
                
                } else {
                    console.warn("⚠️ Auto-login falhou → indo para login");
                
                    // fallback seguro
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1200);
                }
            }
        } catch (err) {
            console.error(err);
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar ao servidor.";
        }
    });
});