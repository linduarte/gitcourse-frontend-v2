document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const resultDiv = document.getElementById("result");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        resultDiv.innerText = "";

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("access_token", data.access_token);
                window.location.href = "../curso/git-course/topics.html";
                return;
            }

            if (Array.isArray(data.detail)) {
                resultDiv.innerText = "Erro: " + data.detail[0].msg;
            } else if (typeof data.detail === "string") {
                resultDiv.innerText = "Erro: " + data.detail;
            } else {
                resultDiv.innerText = "Erro ao fazer login.";
            }

        } catch (error) {
            console.error(error);
            resultDiv.innerText = "Erro inesperado ao conectar ao servidor.";
        }
    });
});
