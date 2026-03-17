document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "../../auth/login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            localStorage.removeItem("access_token");
            window.location.href = "../../auth/login.html";
            return;
        }

        const user = await response.json();
        console.log("Usuário autenticado:", user);

        // Aqui você carrega os tópicos do curso
        // ...

    } catch (err) {
        console.error(err);
        window.location.href = "../../auth/login.html";
    }
});
