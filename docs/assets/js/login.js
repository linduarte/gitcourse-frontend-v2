// login.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const resultEl = document.getElementById("result");

    // 🌐 API global (config.js)
    const API = window.CONFIG?.API_URL;

    console.log("🔥 API URL:", API);

    // 🎯 Foco automático
    if (emailInput) emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // 💡 Feedback inicial
        resultEl.style.color = "#9ca3af";
        resultEl.textContent = "Entrando...";

        try {
            // 🔐 LOGIN
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            console.log("🔐 resposta login:", data);

            if (response.ok && data.access_token) {

                // 💾 salva token
                localStorage.setItem("access_token", data.access_token);

                // 💾 salva email (UX)
                localStorage.setItem("user_email", email);

                resultEl.style.color = "#4ade80";
                resultEl.textContent = "Login realizado com sucesso!";

                console.log("✅ Token salvo:", localStorage.getItem("access_token"));

                // 🚀 Redireciona
                setTimeout(() => {
                    window.location.href = "../dashboard.html";
                }, 800);

            } else {
                // ❌ erro de autenticação
                resultEl.style.color = "#f87171";

                if (typeof data.detail === "string") {
                    resultEl.textContent = "Erro: " + data.detail;
                } else if (Array.isArray(data.detail)) {
                    resultEl.textContent = "Erro: " + data.detail[0].msg;
                } else {
                    resultEl.textContent = "Email ou senha inválidos.";
                }
            }

        } catch (err) {
            console.error("❌ erro conexão:", err);

            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar ao servidor.";
        }
    });
});