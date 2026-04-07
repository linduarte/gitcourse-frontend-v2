// Lógica para o botão "Continuar de onde parei"
export function atualizarBotaoContinuar(dados) {
    const btn = document.getElementById('btn-continuar-onde-parei');
    if (!btn) return;

    // Se completou 5, a próxima aula é a 6 (ou a 5, dependendo do seu índice)
    const proximaAulaIndice = (dados.completed || 0) + 1;

    // 🗺️ O MAPA DE ROTAS (Ajuste os nomes conforme seus arquivos reais)
    const mapaAulas = {
        1: "1a-prefacio.html",
        2: "2-introduction.html",
        3: "3-git-config.html",
        4: "4-hosting.html",
        5: "5-connect.html",
        6: "6-git-clone.html",
        7: "7-git-status.html",
        8: "8-git-add.html",
        9: "9-git-commit.html",
        10: "10-feature_req.html",
        11: "11-branch.html",
        12: "12-branch-merge.html",
        13: "13-git-diff.html",
        14: "14-undo-changes.html",
        15: "15-git-init.html",
        16: "16-git-workflows.html",
        17: "17-terminal-customization.html"     // ... adicione as outras até a 16
    };

    const paginaDestino = mapaAulas[proximaAulaIndice] || "2-introduction.html";
    
    // 🔗 Define o link final (certifique-se que o caminho curso/git-course/ está correto)
    btn.href = `curso/git-course/${paginaDestino}`;
    
    console.log(`🚀 Navegação calibrada: Próxima parada -> ${paginaDestino}`);
}