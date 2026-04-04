/**
 * sensor-progresso.js
 * Sincroniza a conclusão da aula com a VPS/Postgres
 */
async function registrarConclusao() {
    const email = localStorage.getItem("user_email");
    const token = localStorage.getItem("access_token");
    const API_URL = "https://charles-gitcourse.duckdns.org";
    
    // Pega o nome do arquivo atual (ex: 2-introduction.html)
    const aulaNome = window.location.pathname.split("/").pop(); 

    if (!email || !token) {
        console.warn("⚠️ Usuário não autenticado. Progresso não será salvo.");
        return;
    }

    try {
        console.log(`📡 Sincronizando conclusão: ${aulaNome}...`);
        
        const response = await fetch(`${API_URL}/progress/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: email,
                lesson_file: aulaNome
            })
        });

        if (response.ok) {
            console.log("✅ Progresso salvo com sucesso no Postgres!");
        } else {
            console.error("❌ Falha na resposta da VPS ao salvar progresso.");
        }
    } catch (error) {
        console.error("💥 Erro de rede ao conectar com a VPS:", error);
    }
}

// Escutador inteligente para a classe 'footer-link'
document.addEventListener('DOMContentLoaded', () => {
    // Procuramos o botão pela CLASSE que você já usa no HTML
    const btnProximo = document.querySelector('.footer-link');
    
    if (btnProximo) {
        console.log("🎯 Sensor acoplado ao botão: " + btnProximo.innerText);
        
        btnProximo.addEventListener('click', async (event) => {
            // Executa o registro no Postgres antes de mudar de página
            await registrarConclusao();
            console.log("🚀 Sinal enviado. Navegando...");
        });
    } else {
        console.warn("⚠️ Botão '.footer-link' não encontrado nesta página.");
    }
});