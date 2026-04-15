/**
 * HomeView.js - Corrigida (Alinhamento de Índice e Identidade)
 */
import { navegar, LESSONS_LIST } from '../dashboard-router.js'; // Importamos a lista centralizada

export class HomeView {
    constructor() {
        this.apiUrl = "https://charles-gitcourse.duckdns.org";
        this.repoBase = "/gitcourse-frontend-v2/curso/git-course/";
        console.log("🏠 HomeView energizada.");
    }

    render() {
        const userEmail = localStorage.getItem('user_email') || "";
        const storedName = localStorage.getItem('user_name');
        const emailInitials = userEmail.split('@')[0];
        const userName = storedName || emailInitials || "Aluno";

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
        // 🚨 ATENÇÃO: Aqui estava fixo 'test_insonia'. Mudei para pegar o e-mail logado!
        const email = localStorage.getItem('user_email') || "teste_almoco@gmail.com";
        const endpoint = `${this.apiUrl}/progress/summary?email=${email}`;
        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const dados = await response.json();
                console.log("✅ Dados da VPS:", dados);
                
                this.configurarBotaoContinuar(dados);
                this.atualizarInterface(dados);
            }
        } catch (error) {
            console.error("💥 Erro de rede:", error);
            this.mostrarErro("Servidor offline.");
        }
    }

    configurarBotaoContinuar(dados) {
    const btn = document.getElementById('btn-continuar-onde-parei');
    if (!btn) return;

    // A mágica está aqui:
    // Se o maior ID concluído é 11, a aula 11 está na posição 10 da lista.
    // Portanto, a PRÓXIMA aula (12) está exatamente na posição 11 da lista!
    const indiceAlvo = parseInt(dados.completed || 0); 

    // Não somamos +1 aqui, pois o ID já é o deslocamento correto para o array 0-indexed
    const destino = LESSONS_LIST[indiceAlvo] || LESSONS_LIST[1]; 

    btn.href = `https://linduarte.github.io${this.repoBase}${destino}`;
    
    console.log(`🎯 Mira ajustada: ID ${dados.completed} -> Indo para o índice ${indiceAlvo}: ${destino}`);
}

    atualizarInterface(dados) {
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