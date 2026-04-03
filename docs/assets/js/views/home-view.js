/**
 * home-view.js
 * O conteúdo dinâmico da Dashboard.
 */
export const HomeView = {
    render: () => `
        <section id="progressCard" class="card fade-in">
          <h3>Seu Progresso</h3>
          <div id="progressCardContent">Calculando...</div>
          
          <div class="progress-bar">
            <div id="progressBarFill" class="progress-bar-fill" style="width: 0%;"></div>
          </div>

          <button type="button" id="btnContinueCard" class="btn-footer-primary">
            Continuar de onde parei →
          </button>
        </section>
    `,
    init: () => {
        // Como o 'inicializarDashboard' já roda no app.js, 
        // ele já vai encontrar os IDs acima e preenchê-los.
        console.log("HomeView energizada.");
    }
};