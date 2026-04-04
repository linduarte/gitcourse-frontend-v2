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

// Escutador Seletivo: Apenas para o botão de "Próximo"
document.addEventListener('DOMContentLoaded', () => {
    // Pegamos todos os links com a classe footer-link
    const links = document.querySelectorAll('.footer-link');
    let btnProximo = null;

    // Filtramos para encontrar o que contém a seta para a direita (→) ou a palavra "Próximo"
    links.forEach(link => {
        if (link.innerText.includes('→') || link.innerText.toLowerCase().includes('próximo')) {
            btnProximo = link;
        }
    });

    if (btnProximo) {
        console.log("🎯 Sensor acoplado corretamente ao botão de AVANÇAR: " + btnProximo.innerText);
        
        btnProximo.addEventListener('click', async (event) => {
            // Sincroniza com o Postgres antes de mudar de página
            await registrarConclusao();
            console.log("🚀 Sinal de conclusão enviado. Avançando...");
        });
    } else {
        console.warn("⚠️ Botão de avanço (→) não encontrado nesta página.");
    }
});