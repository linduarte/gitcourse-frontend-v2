document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const resultEl = document.getElementById("result");
    const btn = document.getElementById("btn-login");

    const API = window.CONFIG?.API_URL;

    console.log("🔥 API:", API);

    // 🔥 Preenche email salvo
    const savedEmail = localStorage.getItem("user_email");
    if (savedEmail) {
        emailInput.value = savedEmail;
    }

    // 🎯 foco automático
    emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // UX
        btn.disabled = true;
        btn.textContent = "Entrando...";
        resultEl.textContent = "";

        try {
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            console.log("🔐 resposta:", data);

            if (response.ok && data.access_token) {

                // 💾 salvar sessão
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user_email", email);

                resultEl.style.color = "#4ade80";
                resultEl.textContent = "Login realizado com sucesso!";

                setTimeout(() => {
                    window.location.href = "../dashboard.html";
                }, 800);

            } else {
                resultEl.style.color = "#f87171";
                resultEl.textContent = data.detail || "Email ou senha inválidos.";

                btn.disabled = false;
                btn.textContent = "Entrar";
            }

        } catch (err) {
            console.error(err);

            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar ao servidor.";

            btn.disabled = false;
            btn.textContent = "Entrar";
        }
    });
});