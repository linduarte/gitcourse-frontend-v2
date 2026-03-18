document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const resultDiv = document.getElementById("result");

    console.log("🔌 Circuito de Login Ativo: O script foi carregado!");

    loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("🚀 Disparando carga para a VPS...");

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });

        console.log("Status da Resposta:", response.status); // Ver se é 200, 401 ou 422

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            console.log("✅ Token recebido! Redirecionando...");
            window.location.href = "../dashboard.html";
        } else {
            const errorData = await response.json();
            console.error("❌ Erro na VPS:", errorData.detail || "Credenciais inválidas");
            alert("Falha no login: " + (errorData.detail || "Verifique e-mail e senha"));
        }
    } catch (err) {
        console.error("💥 Falha Crítica de Conexão:", err);
    }
});
});
