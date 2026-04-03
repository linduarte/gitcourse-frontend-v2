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
        // MAPEAMENTO DOS DADOS DO POSTGRES {completed: 16, total: 16, percentage: 100}
        const concluidas = dados.completed !== undefined ? dados.completed : 0;
        const totalAulas = dados.total !== undefined ? dados.total : 15;
        const percentual = dados.percentage !== undefined ? dados.percentage : 0;

        const content = document.getElementById('progressCardContent');
        const fill = document.getElementById('progressBarFill');
        const btn = document.getElementById('btnContinueCard');

        // 1. Atualiza o texto descritivo
        if (content) {
            content.innerHTML = `Você concluiu <strong>${concluidas}</strong> de ${totalAulas} aulas (<strong>${percentual}%</strong>).`;
        }
        
        // 2. Anima a barra de progresso
        if (fill) {
            // Pequeno delay para garantir que o DOM renderizou antes da animação
            setTimeout(() => {
                fill.style.width = `${percentual}%`;
            }, 100);
        }
        
        // 3. Configura o botão de ação
        if (btn) {
            btn.style.display = "block";
            
            if (percentual >= 100) {
                btn.innerText = "🎉 Curso Concluído! Revisar Aulas →";
                btn.onclick = () => { window.location.hash = `#/aula/1`; };
            } else {
                btn.innerText = "Continuar de onde parei →";
                btn.onclick = () => { 
                    // Se concluiu 5, vai para a 6
                    window.location.hash = `#/aula/${concluidas + 1}`; 
                };
            }
        }
    }
};