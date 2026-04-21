// register.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const resultEl = document.getElementById("result");

    // API global
    const API = window.CONFIG.API_URL;

    // Foco inicial
    if (emailInput) emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validação simples
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

        // Feedback visual
        resultEl.style.color = "#9ca3af";
        resultEl.textContent = "Criando conta...";

        try {
            // Registro
            const registerResponse = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                resultEl.style.color = "#f87171";
                if (typeof registerData.detail === "string") {
                    resultEl.textContent = "Erro: " + registerData.detail;
                } else if (Array.isArray(registerData.detail)) {
                    resultEl.textContent = "Erro: " + registerData.detail[0].msg;
                } else {
                    resultEl.textContent = "Erro ao registrar.";
                }
                return;
            }

            // Salva email para UX
            localStorage.setItem("user_email", email);

            // Feedback
            resultEl.style.color = "#4ade80";
            resultEl.textContent = "Conta criada! Entrando automaticamente...";

            // Auto-login
            const loginResponse = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok && loginData.access_token) {
                localStorage.setItem("access_token", loginData.access_token);

                setTimeout(() => {
                    window.location.href = "../dashboard.html";
                }, 800);
            } else {
                // Fallback
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1200);
            }

        } catch (err) {
            console.error(err);
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar ao servidor.";
        }
    });
});