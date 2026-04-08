# GitCourse Frontend (V2)

Interface web moderna para o curso de Git, projetada com foco em performance e experiência do usuário (UX).

## 🌐 Deploy e Arquitetura
* **Hospedagem:** GitHub Pages.
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