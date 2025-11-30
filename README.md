🌐 HTTP Frequency
Analisador de Desempenho HTTP (Requisições Assíncronas)

Autor: Gabriel de Vargas
Linguagem: Python 3.13
Biblioteca principal: HTTPX

📘 Sobre o Projeto

O HTTP Frequency é uma ferramenta desenvolvida em Python para testar múltiplas URLs simultaneamente e medir o tempo de resposta de cada uma. O sistema identifica:
• tempos de resposta,
• códigos HTTP,
• erros de rede,
• ranking das URLs mais rápidas.

O projeto utiliza as bibliotecas httpx (requisições assíncronas) e asyncio (concorrência), junto com semáforo, dataclasses e perf_counter, criando um analisador profissional de desempenho de servidores web.

📊 Fluxo de Funcionamento

(Coloque aqui o arquivo assets/fluxograma.png)

O diagrama representa o fluxo geral: o usuário insere URLs → asyncio executa tarefas simultâneas → httpx envia requisições → servidores respondem → o programa gera relatório final com ranking e erros.

💻 Execução Real no Terminal

(Coloque aqui o arquivo assets/terminal.png)

Essa imagem mostra o programa funcionando:
• usuário insere as URLs;
• sistema realiza requisições;
• mostra ranking ordenado pelo tempo;
• exibe falhas e códigos HTTP.

🚀 Recursos do Sistema

• Entrada de múltiplas URLs
• Execução assíncrona com asyncio
• Requisições HTTP usando httpx.AsyncClient
• Controle de concorrência com semáforo
• Tratamento de erros (timeout, DNS, 403, 500 etc.)
• Medição de latência com precisão
• Relatório final completo
• 100% executado em terminal

⚙️ Instalação
1. Clone o repositório:

git clone https://github.com/biel-444/HTTP-Frequency.git

cd HTTP-Frequency

2. Crie um ambiente virtual:

Linux/Mac:
python3 -m venv .venv
source .venv/bin/activate

Windows:
python -m venv .venv
..venv\Scripts\activate

3. Instale as dependências:

pip install -r requirements.txt

▶️ Como Usar

Execute o programa:
python src/http_frequency.py

Insira as URLs, uma por linha.
Aperte Enter sem digitar nada para iniciar o teste.

🧠 Tecnologias Utilizadas

Python 3.13 – Linguagem
httpx – Requisições assíncronas
asyncio – Concorrência
Semáforo – Controle de tarefas simultâneas
dataclasses – Organização dos resultados
perf_counter – Medir tempo
typing – Tipagem

🧩 Estrutura do Projeto

HTTP-Frequency/
│
├── src/
│ └── http_frequency.py
│
├── assets/
│ ├── fluxograma.png
│ ├── terminal.png
│ └── grafico_tempo_resposta.png
│
├── README.md
├── LICENSE
└── requirements.txt

🔍 Explicação Técnica

Execução Assíncrona:
O programa usa asyncio.gather para testar várias URLs ao mesmo tempo.

Semáforo:
Limita o número de requisições simultâneas para não sobrecarregar os servidores.

HTTPX:
Responsável por conexão HTTP, erros, redirects, status, tamanho da resposta e URL final.

Medição de Latência:
Feita com time.perf_counter() garantindo precisão.

Dataclasses:
Organiza cada resultado com: URL, status, tempo, bytes e erro.

📊 Gráfico de Desempenho

(Coloque aqui o arquivo assets/grafico_tempo_resposta.png)

O gráfico mostra o tempo em milissegundos das URLs testadas.

🧪 Exemplo de Resultados

URL — Tempo — Status
owasp.org — 154.3ms — 200
youtube.com — 618.6ms — 200
ufsc.br — 631.0ms — 200
google.com — 688.9ms — 200
github.com — 1258.6ms — 200
openai.com — Falhou — 403

🛠 Melhorias Futuras (Roadmap)

• Exportar relatório em PDF
• Criar interface gráfica
• Criar página web para testes
• Suporte a outros métodos HTTP (HEAD, POST)
• Logs automáticos
• Modo benchmark avançado
• Versão instalável via pip

📄 Licença

Este projeto está sob a licença MIT.

👤 Autor

Gabriel de Vargas
Projeto desenvolvido para a disciplina Tecnologia da Informação e Comunicação (TIC) – UFSC, Araranguá.

## ⚙️ Instalação

### **1️⃣ Clone o repositório**
```bash
git clone https://github.com/biel-444/HTTP-Frequency.git
cd HTTP-Frequency
