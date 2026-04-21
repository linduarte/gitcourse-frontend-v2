const API = window.CONFIG.API_URL;

const response = await fetch(`${CONFIG.API_URL}/auth/token`, {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
        username: emailInput,
        password: passwordInput
    })
});

// 🔥 DEBUG TOTAL
console.log("STATUS:", response.status);

const data = await response.json();

console.log("RESPOSTA COMPLETA:", data);

// 🔴 TESTE DIRETO
if (!data.access_token) {
    console.error("❌ NÃO VEIO TOKEN!");
} else {
    console.log("✅ TOKEN RECEBIDO:", data.access_token);
}

// 💾 SALVAR (CRÍTICO)
localStorage.setItem("access_token", data.access_token);

// 🔍 CONFIRMAR
console.log("💾 LOCALSTORAGE:", localStorage.getItem("access_token"));

// 🚀 REDIRECT
window.location.href = "../dashboard.html";