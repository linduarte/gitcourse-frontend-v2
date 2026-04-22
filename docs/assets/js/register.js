// register. - 2026-04-22

function getAPI() {
    if (!window.CONFIG || !window.CONFIG.API_URL) {
        console.warn("⚠️ CONFIG não carregado. Usando fallback.");
        return "https://charles-gitcourse.duckdns.org";
    }
    return window.CONFIG.API_URL;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const resultEl = document.getElementById("result");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (emailInput) emailInput.focus();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // 🔐 validação simples
        if (password.length < 6 || !/[a-zA-Z]/.test(password)) {
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Senha inválida (mínimo 6 caracteres e 1 letra).";
            return;
        }

        resultEl.style.color = "#9ca3af";
        resultEl.textContent = "Criando conta...";

        try {
            // 🧾 REGISTRO
            const res = await fetch(`${getAPI()}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                resultEl.style.color = "#f87171";
                resultEl.textContent = data.detail || "Erro ao registrar.";
                return;
            }

            localStorage.setItem("user_email", email);

            resultEl.style.color = "#4ade80";
            resultEl.textContent = "Conta criada! Entrando...";

            // 🔐 AUTO LOGIN
            const loginRes = await fetch(`${getAPI()}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const loginData = await loginRes.json();

            if (loginRes.ok && loginData.access_token) {
                localStorage.setItem("access_token", loginData.access_token);

                setTimeout(() => {
                    window.location.href = "../dashboard.html";
                }, 800);
            } else {
                window.location.href = "login.html";
            }

        } catch (err) {
            console.error(err);
            resultEl.style.color = "#f87171";
            resultEl.textContent = "Erro ao conectar.";
        }
    });
});