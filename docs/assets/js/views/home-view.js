/**
 * HomeView.js - Refatorada para Gestão de Progresso e Navegação
 * Charles Duarte - Engenharia de Software
 */

export class HomeView {
    constructor() {
        this.apiUrl = "https://charles-gitcourse.duckdns.org";
        this.repoBase = "/gitcourse-frontend-v2/curso/git-course/";
        console.log("🏠 HomeView energizada.");
    }

    // 1. O RENDER APENAS ENTREGA O "ESQUELETO"
    render() {
    const userName = localStorage.getItem('user_name') || "Charles Duarte";
    
    // Retornamos a string para o Roteador injetar no 'spa-content'
    return `
        <div class="dashboard-header">
            <h2>Bem-vindo, ${userName}!</h2>
        </div>
        <div id="progressCardContent">Sincronizando com a VPS...</div>
        <a id="btn-continuar-onde-parei" class="btn-footer-primary" href="#">
            Continuar de onde parei ✓
        </a>
    `;
}

    async carregarSumario() {
        const email = "test_insonia@test.com"; // O usuário de teste atual
        const endpoint = `${this.apiUrl}/progress/summary?email=${email}`;
        
        console.log("📡 Solicitando Sumário em:", endpoint);

        try {
            const response = await fetch(endpoint);
            
            if (response.ok) {
                const dados = await response.json();
                console.log("✅ Dados brutos recebidos:", dados);

                // 1. PERSISTÊNCIA: Salva na "gaveta" para consulta global
                localStorage.setItem('user_progress', JSON.stringify(dados));

                // 2. NAVEGAÇÃO: Calibragem do botão "Continuar de onde parei"
                this.configurarBotaoContinuar(dados);

                // 3. INTERFACE: Pinta os gráficos e contadores
                this.atualizarInterface(dados);

            } else {
                console.error("❌ Falha na resposta da VPS. Status:", response.status);
                this.mostrarErro("Erro ao conectar com o servidor.");
            }
        } catch (error) {
            console.error("💥 Erro de rede na HomeView:", error);
            this.mostrarErro("Servidor offline ou erro de conexão.");
        }
    }

    configurarBotaoContinuar(dados) {
        const btn = document.getElementById('btn-continuar-onde-parei');
        if (!btn) return;

        // Cálculo do Índice: Se completou 5, a próxima é a 6
        const concluido = parseInt(dados.completed || 0);
        const proxima = concluido + 1;

        // MAPA DE ROTAS (O "GPS" do curso)
        const mapaAulas = {
            1: "1a-prefacio.html", 2: "2-introduction.html", 3: "3-git-config.html",
            4: "4-hosting.html", 5: "5-connect.html", 6: "6-git-clone.html",
            7: "7-git-status.html", 8: "8-git-add.html", 9: "9-git-commit.html",
            10: "10-feature_req.html", 11: "11-branch.html", 12: "12-branch-merge.html",
            13: "13-git-diff.html", 14: "14-undo-changes.html", 15: "15-git-init.html",
            16: "16-git-workflows.html", 17: "17-terminal-customization.html"
        };

        const destino = mapaAulas[proxima] || "2-introduction.html";
        
        // Aplica o link final
        btn.href = this.repoBase + destino;
        
        console.log(`🚀 Navegação calibrada: Completou ${concluido} -> Próxima: ${destino}`);
    }

    atualizarInterface(dados) {
        // Aqui vai sua lógica de preencher o Card de Progresso (porcentagem, etc)
        const progressText = document.getElementById('progressCardContent');
        if (progressText) {
            progressText.innerText = `${dados.percentage}% concluído (${dados.completed}/${dados.total})`;
        }
    }

    mostrarErro(msg) {
        const content = document.getElementById('progressCardContent');
        if (content) content.innerText = msg;
    }
}