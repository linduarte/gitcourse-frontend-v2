document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('access_token');

    // 🔒 Proteção: se não estiver logado
    if (!token) {
        window.location.href = '/gitcourse-frontend-v2/landing.html';
        return;
    }

    // 🔓 Logout
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('access_token');
            window.location.href = '/gitcourse-frontend-v2/landing.html';
        });
    }

    // ✅ Botão Concluído
    const btn = document.getElementById("markCompletedButton");

    if (btn) {
        btn.addEventListener("click", async () => {

            const topicId = btn.dataset.topicId;
            const originalText = btn.innerText;

            btn.disabled = true;
            btn.innerText = "Enviando...";

            try {
                const response = await fetch(`${API_URL}/progress/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        topic_id: topicId,
                        completed: true,
                        feedback: "Concluído via site"
                    })
                });

                if (response.ok) {
                    btn.innerText = "Concluído ✓";
                    btn.classList.add("completed");
                } else {
                    btn.disabled = false;
                    btn.innerText = originalText;
                    alert("Erro ao registrar progresso");
                }

            } catch (error) {
                btn.disabled = false;
                btn.innerText = originalText;
                alert("Erro de conexão com o servidor");
            }
        });
    }

});