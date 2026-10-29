\# 🖥️ SysWatch — Monitoramento de Servidor em Tempo Real

## 🌐 Demo Ao Vivo

[▶️ Acessar o dashboard](https://syswatch-yt0t.onrender.com/)


Dashboard web para monitorar e gerenciar processos de um servidor em tempo real. Coleta métricas de CPU, memória, disco e processos diretamente do sistema operacional e exibe em uma interface moderna com atualização automática a cada 2 segundos.



!\[SysWatch Dashboard](docs/screenshot.png)



\## ✨ Funcionalidades



\- \*\*Métricas em tempo real\*\* — CPU, memória RAM, disco e contagem de processos atualizadas a cada 2s

\- \*\*Gráficos animados\*\* — histórico das últimas 30 leituras com Chart.js

\- \*\*Indicadores inteligentes\*\* — cores dinâmicas (verde → amarelo → vermelho) conforme o nível de uso

\- \*\*Top Processos\*\* — tabela com os 15 processos que mais consomem memória

\- \*\*Gestão de processos\*\* — botão KILL que envia `SIGTERM` ao processo selecionado (o mesmo sinal usado no terminal com `kill`)

\- \*\*Status de conexão\*\* — indicador online/offline com timestamp da última atualização



\## 🛠️ Stack Técnica



| Camada | Tecnologia |

|---|---|

| Backend | Python · FastAPI · psutil |

| Frontend | HTML5 · CSS3 · JavaScript (vanilla) · Chart.js |

| Servidor | Uvicorn |

| Versionamento | Git |



\## 🚀 Como Rodar



\### Pré-requisitos



\- Python 3.10+

\- pip



\### Instalação



```bash

\# Clone o repositório

git clone https://github.com/SEU-USUARIO/syswatch.git

cd syswatch/backend



\# Crie e ative o ambiente virtual

python -m venv venv

source venv/bin/activate        # Linux/Mac

\# ou

venv\\Scripts\\activate           # Windows



\# Instale as dependências

pip install -r requirements.txt



\# Inicie o servidor

python -m uvicorn app:app --reload --port 8000

