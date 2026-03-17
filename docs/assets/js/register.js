document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const resultEl = document.getElementById("result");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        resultEl.style.color = "#333";
        resultEl.textContent = "Registrando...";

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                resultEl.style.color = "#388e3c";
                resultEl.textContent = "Registro realizado com sucesso! Redirecionando...";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1200);

            } else {
                resultEl.style.color = "#d32f2f";

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
            resultEl.style.color = "#d32f2f";
            resultEl.textContent = "Erro ao conectar ao servidor.";
        }
    });
});
