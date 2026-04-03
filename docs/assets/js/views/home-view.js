/**
 * home-view.js
 * Dashboard conectada diretamente ao progresso no Postgres.
 */
export const HomeView = {
    render: () => `
        <section id="progressCard" class="card fade-in">
          <h3>Seu Progresso</h3>
          <div id="progressCardContent" style="margin-bottom: 10px;">Sincronizando com a VPS...</div>
          
          <div class="progress-bar" style="background: #e9ecef; border-radius: 8px; height: 20px; margin: 15px 0; overflow: hidden;">
            <div id="progressBarFill" class="progress-bar-fill" style="width: 0%; height: 100%; background: #5f9ea0; transition: width 0.8s ease-in-out;"></div>
          </div>

          <button type="button" id="btnContinueCard" class="btn-footer-primary" style="display:none; width: 100%; padding: 12px; cursor: pointer;">
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
            console.warn("⚠️ Credenciais ausentes.");
            return;
        }

        try {
            // AJUSTE DEFINITIVO: GET /progress/summary conforme o seu Swagger
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
                console.log("✅ Sumário recuperado do Postgres:", dados);
                
                // O Swagger geralmente retorna um objeto com 'completed_topics' ou similar
                // Ajuste a linha abaixo conforme o formato que aparecer no seu Console
                const listaAulas = dados.completed_topics || dados; 
                this.atualizarInterface(listaAulas);
            } else {
                console.error("❌ Erro na VPS ao buscar sumário.");
            }
        } catch (error) {
            console.error("💥 Falha de rede na HomeView:", error);
        }
    },

    atualizarInterface: function(aulas) {
        const totalAulas = 15; 
        const concluidas = Array.isArray(aulas) ? aulas.length : 0;
        const percentual = Math.round((concluidas / totalAulas) * 100);

        const content = document.getElementById('progressCardContent');
        const fill = document.getElementById('progressBarFill');
        const btn = document.getElementById('btnContinueCard');

        if (content) {
            content.innerHTML = `Você concluiu <strong>${concluidas}</strong> de ${totalAulas} aulas (${percentual}%).`;
        }
        
        if (fill) {
            fill.style.width = `${percentual}%`;
        }
        
        if (concluidas > 0 && btn) {
            btn.style.display = "block";
            // Lógica: Se concluiu 5, leva para a aula 6
            btn.onclick = () => {
                window.location.hash = `#/aula/${concluidas + 1}`;
            };
        } else if (btn) {
            // Se for a primeira vez da Ana, o botão leva para a aula 1
            btn.style.display = "block";
            btn.onclick = () => { window.location.hash = `#/aula/1`; };
        }
    }
};