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
            const response = await fetch(`${API_URL}/auth/register`, {
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
                // 🔐 AUTO LOGIN
                // =========================
                const loginResponse = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        username: email,  // ⚠️ FastAPI exige "username"
                        password: password
                    })
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    // 💾 salva token
                    localStorage.setItem("access_token", loginData.access_token);

                    // 🚀 vai direto para dashboard
                    setTimeout(() => {
                        window.location.href = "../dashboard.html";
                    }, 1000);

                } else {
                    // fallback seguro
                    window.location.href = "login.html";
                }

            } else {
                resultEl.style.color = "#f87171";

                if (typeof data.detail === "string") {
                    resultEl.textContent = "Erro: " + data.detail;
                } else if (Array.isArray(data.detail)) {
                    resultEl.textContent = "Erro: " + data.detail[0].msg;
                } else {
                    resultEl.textContent = "Erro ao registrar.";
                }
            }

        } catch (err) {
            console.error(err);
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar ao servidor.";
        }
    });
});