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

        // 🧠 LÓGICA DE ENGENHARIA:
        // Se o banco diz que completou 7 aulas (IDs 2 ao 8), 
        // a próxima aula na LESSONS_LIST (que tem 17 itens) deve ser o índice 8.
        
        const concluido = parseInt(dados.completed || 0);
        
        // Se ele completou 7, o índice 7 da lista é a aula 8. 
        // Para ir para a aula 9, precisamos do índice 8.
        const indiceProxima = concluido + 1; 

        const destino = LESSONS_LIST[indiceProxima] || LESSONS_LIST[1]; // Fallback para Introdução
        
        // IMPORTANTE: Como é SPA, não usamos href direto para o GitHub se quisermos manter o controle.
        // Mas para o seu teste atual, vamos manter o caminho completo:
        btn.href = `https://linduarte.github.io${this.repoBase}${destino}`;
        
        console.log(`🚀 GPS Calibrado: Completou ${concluido} aulas. Apontando para índice ${indiceProxima}: ${destino}`);
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