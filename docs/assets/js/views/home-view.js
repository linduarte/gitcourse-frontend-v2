/**
 * home-view.js
 * Dashboard sincronizada com o Sumário do Postgres.
 */
export const HomeView = {
    render: () => `
        <section id="progressCard" class="card fade-in">
          <h3>Seu Progresso</h3>
          <div id="progressCardContent" style="margin-bottom: 10px; font-size: 1.1rem;">Sincronizando com a VPS...</div>
          
          <div class="progress-bar" style="background: #e9ecef; border-radius: 8px; height: 24px; margin: 15px 0; overflow: hidden; border: 1px solid #ddd;">
            <div id="progressBarFill" class="progress-bar-fill" style="width: 0%; height: 100%; background: #5f9ea0; transition: width 1s ease-in-out;"></div>
          </div>

          <button type="button" id="btnContinueCard" class="btn-footer-primary" style="display:none; width: 100%; padding: 12px; font-weight: bold; cursor: pointer;">
            Continuar de onde parei →
          </button>
        </section>
    `,

    init: async function() {
        console.log("🏠 HomeView energizada.");
        
        const email = localStorage.getItem("user_email");
        const token = localStorage.getItem("access_token");
        const API_URL = "https://charles-gitcourse.duckdns.org";

        if (!email || !token) {
            console.warn("⚠️ Credenciais ausentes. Redirecionando...");
            return;
        }

        try {
            // Rota exata do seu Swagger para o GET
            const endpoint = `${API_URL}/progress/summary?email=${email}`;
            console.log(`📡 Solicitando Sumário em: ${endpoint}`);

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const dados = await response.json(); 
                console.log("✅ Dados brutos recebidos:", dados);

                // 🚀 A LINHA MÁGICA: Guarda o progresso no navegador para o botão "Continuar"
                localStorage.setItem('user_progress', JSON.stringify(dados));
                
                // Chamada da função que "pinta" a tela com os dados reais
                this.atualizarInterface(dados);
            } else {
                console.error("❌ Falha na resposta da VPS.");
                const content = document.getElementById('progressCardContent');
                if (content) content.innerText = "Erro ao carregar sumário.";
            }
        } catch (error) {
            console.error("💥 Erro de rede na HomeView:", error);
        }
    },

    atualizarInterface: function(dados) {
        // Mapeamento dos dados do Postgres
        const concluidas = dados.completed !== undefined ? dados.completed : 0;
        const totalAulas = dados.total !== undefined ? dados.total : 16;
        const percentual = dados.percentage !== undefined ? dados.percentage : 0;

        const content = document.getElementById('progressCardContent');
        const fill = document.getElementById('progressBarFill');
        const btn = document.getElementById('btnContinueCard');

        // 1. Atualiza o texto e a mensagem de parabéns
        if (content) {
            if (percentual >= 100) {
                content.innerHTML = `<span style="color: #B8860B; font-weight: bold; font-size: 1.2rem;">🎊 PARABÉNS! Curso concluído!</span>`;
            } else {
                content.innerHTML = `Concluíste <strong>${concluidas}</strong> de <strong>${totalAulas}</strong> (<strong>${percentual}%</strong>)`;
            }
        }
        
        // 2. Anima a barra com o efeito "Dourado"
        if (fill) {
            setTimeout(() => {
                fill.style.width = `${percentual}%`;
                
                if (percentual >= 100) {
                    // O efeito Dourado que você criou:
                    fill.style.backgroundColor = "#FFD700";
                    fill.style.boxShadow = "0 0 15px #FFD700";
                    fill.style.border = "1px solid #B8860B";
                } else {
                    fill.style.backgroundColor = "#5f9ea0";
                    fill.style.boxShadow = "none";
                }
            }, 100);
        }
        
        // 3. Configura o botão de ação (Link de Revisão)
        if (btn) {
            btn.style.display = "block";
            
            if (percentual >= 100) {
                btn.innerHTML = "🏆 Revisar o Curso Agora →";
                btn.style.backgroundColor = "#B8860B"; // Botão em tom bronze/dourado
                
                btn.onclick = (e) => {
                    e.preventDefault();
                    console.log("🚀 Redirecionando para a Introdução (Arquivo Físico)...");
                    
                    // Como a Dashboard está na raiz, e as aulas provavelmente 
                    // estão em uma pasta (ou na mesma raiz), usamos o nome do arquivo:
                    // Usamos o nome do repositório para garantir que o GitHub Pages não se perca
                window.location.href = "/gitcourse-frontend-v2/curso/git-course/2-introduction.html"; 
                };
            } else {
                btn.onclick = (e) => {
                    e.preventDefault();
                    // Para quem ainda não terminou, o próximo passo também deve incluir o caminho da pasta:
                    const arquivoMapa = "2-introduction.html"; // Exemplo baseado no seu mapa
                    window.location.href = `curso/git-course/${arquivoMapa}`;
                };
            }
        }
    
    }
};