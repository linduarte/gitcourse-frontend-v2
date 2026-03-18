document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const resultDiv = document.getElementById("result");

    // Aguarda o HTML carregar completamente
    document.addEventListener('DOMContentLoaded', () => {
    console.log("🔌 Circuito de Login Ativo: O script foi carregado!");

    // ESTA É A LINHA QUE ESTAVA FALTANDO (A DECLARAÇÃO):
    const loginForm = document.getElementById('login-form');

    // Verifica se o formulário existe antes de ligar o "disjuntor"
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("🚀 Botão disparado! Iniciando requisição...");

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // O seu código de fetch (a chamada para a VPS) continua aqui...
            // ...
        });
    } else {
        console.error("❌ Erro: Não encontrei o formulário com id 'login-form' no HTML.");
    }
});
});

