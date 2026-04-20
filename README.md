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

# 🎓 Git Course Platform

Plataforma educacional interativa para ensino de Git, com foco em prática guiada, progressão inteligente e experiência do aluno.

---

## ✨ Visão Geral

Este projeto evoluiu de um estudo técnico para uma **plataforma funcional de aprendizado**, com:

- 📊 Dashboard dinâmico (mini-SPA)
- 🔐 Autenticação com JWT
- 📈 Progresso real persistido no backend
- 🧠 Lógica pedagógica (detecção de lacunas)
- 🎯 Navegação guiada (retomar aula automaticamente)
- 🎨 Interface moderna e responsiva

---

## 🧠 Conceito Pedagógico

O sistema não apenas apresenta conteúdo — ele **guia o aluno**.

### 🔹 Fluxo do Curso
Prefácio (onboarding)
↓
Aula 2 (Introdução)
↓
Aula 17 (customização obrigatória)
↓
Retorno à Aula 2
↓
Aulas 3 → 16
↓
Conclusão


### 🔹 Regras Importantes

- Aula **1a (Prefácio)** → não conta progresso  
- Aula **17** → sub-aula da 2  
- Progresso válido → aulas **2 a 16 (15 aulas)**  

---

## 📊 Sistema de Progresso

O backend calcula:

```json
{
  "total": 15,
  "actual_count": 10,
  "pending_topics": [3, 5, 7],
  "percentage": 66.67
}

✔ Características
Detecta aulas puladas automaticamente
Nunca retorna progresso falso
Corrige inconsistências de navegação
Funciona mesmo fora de ordem


🎯 Experiência do Usuário
Dashboard
👋 Saudação personalizada (email parcial)
📊 Barra de progresso animada
💬 Mensagem inteligente (feedback emocional)
⚠️ Detecção de lacunas
👉 Destaque da próxima aula recomendada

Exemplos de feedback:
🏆 Parabéns! Você concluiu o curso!
🔥 Você está muito perto de concluir!
🚀 Excelente progresso, continue assim!

!
🎨 Interface
Tema dark moderno (estilo dev)
Botões interativos (hover + animação)
Gradiente animado na barra de progresso
Layout responsivo
Componentes reutilizáveis

Arquitetura
Frontend

docs/
 ├── assets/
 │   ├── css/
 │   ├── js/
 │   │   ├── views/
 │   │   │   └── home-view.js
 │   │   ├── dashboard-router.js
 │   │   └── git-course-functions.js

 Mini-SPA (sem framework)
Renderização dinâmica via JS
Estado controlado via localStorage
Backend (FastAPI)
JWT Authentication
Endpoint /progress/complete
Endpoint /progress/summary
Banco com constraint única (user_id, topic_id)
🧪 Testes Realizados
👤 Aluno A (fluxo ideal)

✔ Conclusão linear
✔ 100% correto

👤 Aluno B (fluxo caótico)

✔ Pula aulas
✔ Sistema detecta lacunas
✔ Navegação corrigida automaticamente

👤 Aluno C (uso parcial)

✔ Entrada segura
✔ Sem quebra de fluxo

🚀 Status Atual
✔ Backend consistente
✔ Frontend funcional
✔ UX moderna
✔ Fluxo pedagógico validado
✔ Sistema resiliente

👉 Pronto para uso real com alunos.

📌 Próximos Passos (planejados)
🏆 Tela de conclusão avançada
📜 Geração de certificado (PDF)
📊 Histórico de progresso
🎯 Recomendações inteligentes
📈 Métricas de uso
💡 Filosofia do Projeto

Mini-SPA (sem framework)
Renderização dinâmica via JS
Estado controlado via localStorage
Backend (FastAPI)
JWT Authentication
Endpoint /progress/complete
Endpoint /progress/summary
Banco com constraint única (user_id, topic_id)
🧪 Testes Realizados
👤 Aluno A (fluxo ideal)

✔ Conclusão linear
✔ 100% correto

👤 Aluno B (fluxo caótico)

✔ Pula aulas
✔ Sistema detecta lacunas
✔ Navegação corrigida automaticamente

👤 Aluno C (uso parcial)

✔ Entrada segura
✔ Sem quebra de fluxo

🚀 Status Atual
✔ Backend consistente
✔ Frontend funcional
✔ UX moderna
✔ Fluxo pedagógico validado
✔ Sistema resiliente

👉 Pronto para uso real com alunos.

📌 Próximos Passos (planejados)
🏆 Tela de conclusão avançada
📜 Geração de certificado (PDF)
📊 Histórico de progresso
🎯 Recomendações inteligentes
📈 Métricas de uso
💡 Filosofia do Projeto

Mini-SPA (sem framework)
Renderização dinâmica via JS
Estado controlado via localStorage
Backend (FastAPI)
JWT Authentication
Endpoint /progress/complete
Endpoint /progress/summary
Banco com constraint única (user_id, topic_id)
🧪 Testes Realizados
👤 Aluno A (fluxo ideal)

✔ Conclusão linear
✔ 100% correto

👤 Aluno B (fluxo caótico)

✔ Pula aulas
✔ Sistema detecta lacunas
✔ Navegação corrigida automaticamente

👤 Aluno C (uso parcial)

✔ Entrada segura
✔ Sem quebra de fluxo

🚀 Status Atual
✔ Backend consistente
✔ Frontend funcional
✔ UX moderna
✔ Fluxo pedagógico validado
✔ Sistema resiliente

👉 Pronto para uso real com alunos.

📌 Próximos Passos (planejados)
🏆 Tela de conclusão avançada
📜 Geração de certificado (PDF)
📊 Histórico de progresso
🎯 Recomendações inteligentes
📈 Métricas de uso
💡 Filosofia do Projeto

💡 Filosofia do Projeto

“O sistema não apenas mostra conteúdo — ele orienta o aluno.”

👨‍💻 Autor

Projeto desenvolvido como evolução prática de aprendizado em:

Python / FastAPI
JavaScript (SPA leve)
UX aplicada à educação

educação
📬 Contribuição

Sugestões e melhorias são bem-vindas.

🏁 Conclusão

Este projeto representa a transição de:

estudo técnico → produto funcional


---

# 🎯 O que eu melhorei aqui

✔ Transformei em **produto (não projeto)**  
✔ Expliquei lógica pedagógica  
✔ Documentei decisões importantes  
✔ Mostrei maturidade técnica  
✔ Preparado para GitHub público  

---



