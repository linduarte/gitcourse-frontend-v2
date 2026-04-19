# GitCourse Frontend (V2)

Interface web moderna para o curso de Git, projetada com foco em performance e experiência do usuário (UX).

## 🌐 Deploy e Arquitetura
* O projeto utiliza uma arquitetura descentralizada para máxima eficiência e custo zero:
* **Frontend:** Hospedado no **GitHub Pages**. Esta escolha estratégica permite um deploy contínuo (CI/CD) via GitHub Actions, garantindo que o site esteja sempre disponível em um ambiente escalável e seguro, sem a necessidade de servidores web complexos ou custos com domínios personalizados.
* **Backend:** A API permanece em uma VPS dedicada para processamento de dados e segurança.  
* **Arquitetura:** **SPA (Single Page Application)**. A navegação entre módulos e a atualização do Dashboard ocorrem de forma assíncrona, garantindo uma transição fluida sem recarregamento de página.

## 🛠️ Tecnologias
* **HTML5 / CSS3 / JavaScript (ES6+)**
* **SPA Engine:** Lógica customizada para troca dinâmica de conteúdo.
* **Integração:** Fetch API para comunicação com o Backend em tempo real.
* **Segurança:** Gestão de persistência de tokens JWT para sessões de alunos.

## 🔌 Funcionalidades da Dashboard
A Dashboard funciona como o centro de controle do aluno:
1.  **Cálculo de Progresso Dinâmico:** Atualiza instantaneamente via JavaScript conforme as aulas são marcadas.
2.  **Sincronização Assíncrona:** Comunica-se com a API em `https://charles-gitcourse.duckdns.org` para persistir dados.
3.  **Feedback Visual:** Indicadores de conclusão integrados ao sistema de notificações do Telegram (via Backend).

## 🚀 Workflow de Desenvolvimento
Para atualizar o site:
```bash
git add .
git commit -m "feat: implementado SPA na dashboard de progresso"
git push origin main

🚀 Evolução da SPA do Dashboard
📌 Objetivo

Refatorar o Dashboard para uma arquitetura de Single Page Application (SPA) real, com:

Navegação sem recarregamento
Sincronização com URL
Melhor experiência do usuário
Base sólida para evolução futura

🧱 1. Implementação de Navegação SPA com URL

Implementado uso de:

history.pushState({}, "", "?page=home");

E leitura da rota via:

const params = new URLSearchParams(window.location.search);
const page = params.get("page");
✅ Benefícios
URL reflete o estado da aplicação
Navegação sem reload
Botão "voltar/avançar" funcional
Possibilidade de acesso direto a rotas

🧠 2. Centralização da Navegação (dashboard-router.js)

Criado um roteador central responsável por:

Controlar renderização de views
Atualizar URL (quando necessário)
Gerenciar erros de rota
Integrar cache e loader
🔹 Função principal
navegar(rota, atualizarURL)
Responsabilidades:
Renderizar conteúdo no #spa-content
Atualizar histórico (pushState)
Aplicar estado ativo no menu
Controlar loader global

📚 3. Separação de Responsabilidades

Arquitetura definida:

Camada	Responsabilidade
View (HomeView)	Renderização da interface
Router	Controle de navegação
Logic	Comunicação com API
Sidebar	Disparo de navegação

✅ Regra adotada:

Apenas a View manipula o DOM

🎯 4. Menu Lateral Inteligente

O menu passou a:

Interceptar cliques (preventDefault)
Chamar navegar()
Atualizar a URL
Novo comportamento:
navegar('home', true);

🎨 5. Destaque de Menu Ativo

Implementado controle visual automático:

.sidebar a.active
Benefício:
Indica ao usuário a página atual
Melhora navegação e usabilidade

⏳ 6. Loader Global (Feedback Visual)

Adicionado um overlay com spinner:

<div id="global-loader"></div>

Controlado via:

showLoader();
hideLoader();
Benefícios:
Feedback durante carregamento
Evita sensação de travamento
Melhora UX

⚡ 7. Cache de Views

Implementado cache em memória:

const viewCache = new Map();
Estratégia:
Primeira renderização → cria view
Próximas → reutiliza instância
Benefícios:
Navegação instantânea
Redução de chamadas desnecessárias
Melhor performance

🔁 8. Suporte ao Botão "Voltar" do Navegador

Implementado listener:

window.onpopstate = () => {
    navegar(rota);
};
Resultado:
Navegação reversível
Histórico funcional
funcional

🧪 9. Tratamento de Erros

Adicionado:

Verificação de container
Try/catch no render
Fallback visual para falhas

📊 Fluxo Final da Aplicação
[Sidebar Click]
      ↓
navegar('rota', true)
      ↓
pushState (?page=rota)
      ↓
Router
      ↓
View.render()
      ↓
Atualização do DOM

DOM


🧠 Resultado da Refatoração
Antes:
Navegação limitada
Sem controle de estado
Dependente de reload

Depois:
SPA funcional
URL sincronizada
Navegação fluida
Estrutura escalável

🏁 Conclusão

A aplicação evoluiu de uma estrutura tradicional para uma arquitetura SPA moderna, com:

Separação clara de responsabilidades
Navegação consistente
Melhor experiência do usuário
Base sólida para crescimento