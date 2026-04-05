/**
 * git-course-functions.js
 * Utilitários globais para o Git Course.
 * Charles Duarte - v2.0 SPA
 */

/**
 * Realiza o Logout seguro do sistema
 */
export function logout() {
    console.log("🔐 Encerrando sessão...");
    localStorage.clear();
    // Use o caminho completo do repositório para evitar o 404
    window.location.href = "/gitcourse-frontend-v2/index.html"; 
}
/**
 * Formata datas ou outras strings se necessário futuramente
 */
export function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString('pt-BR');
}

/**
 * REGISTRAR E AVANÇAR
 * Envia o progresso para a VPS e pula para a próxima aula
 */
export async function registrarEAvancar(proximaAula) {
    const token = localStorage.getItem("access_token");
    const btn = window.event ? window.event.target : null;

    console.log("📡 Sincronizando progresso com a VPS...");

    if (token) {
        try {
            // Tenta avisar a VPS (timeout implícito de rede)
            const response = await fetch(`${API_URL}/progress/update`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ lesson_url: proximaAula })
            });

            if (response.ok && btn) {
                // FEEDBACK DE ENGENHARIA: O botão "avisa" que funcionou
                btn.style.backgroundColor = "#28a745"; // Verde Sucesso
                btn.innerText = "Registrado! ✓";
                console.log("✅ Progresso salvo com sucesso.");
            }
        } catch (e) {
            console.error("⚠️ Falha na telemetria (VPS offline ou erro de rede):", e);
        }
    }

    // O "Timer" de segurança: espera 500ms para o usuário ver o verde e pula!
    // Se a VPS falhar, ele pula do mesmo jeito para não travar o aluno.
    setTimeout(() => {
        window.location.href = proximaAula;
    }, 500);
}