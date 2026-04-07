export function atualizarBotaoContinuar(dados) {
    const btn = document.getElementById('btn-continuar-onde-parei');
    if (!btn) return;

    // 1. Garantimos que o índice é um NÚMERO
    // Se a VPS manda 'completed', usamos ele. Se não, zero.
    const concluido = parseInt(dados.completed || 0);
    const proximaAulaIndice = concluido + 1;

    console.log("📊 Debug de Navegação:", { concluido, proximaAulaIndice });

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
        17: "17-terminal-customization.html", 
    };

    const paginaDestino = mapaAulas[proximaAulaIndice];

    if (paginaDestino) {
        // 🔗 Monta o link absoluto para evitar erros de pasta
        const baseUrl = "/gitcourse-frontend-v2/curso/git-course/";
        btn.href = baseUrl + paginaDestino;
        console.log("✅ Rota definida para:", btn.href);
    } else {
        // ⚠️ Se cair aqui, o ID não existe no mapa!
        console.warn("⚠️ ID não encontrado no mapa, usando fallback.");
        btn.href = "/gitcourse-frontend-v2/curso/git-course/2-introduction.html";
    }
    
}
// ✅ AGORA SIM, DO LADO DE FORA:
    window.atualizarBotaoContinuar = atualizarBotaoContinuar;