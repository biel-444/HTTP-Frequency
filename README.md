# 🌐 HTTP Frequency
### Analisador de Desempenho HTTP (com requisições assíncronas)
**Autor:** Gabriel de Vargas  
**Linguagem:** Python 3.13  
**Biblioteca principal:** HTTPX  

---

## 📘 Sobre o Projeto

O **HTTP Frequency** é uma ferramenta desenvolvida em Python para testar múltiplas URLs simultaneamente, medindo o tempo de resposta de cada servidor, identificando erros de rede e exibindo um ranking das URLs mais rápidas.

Ele utiliza:

- **httpx** para requisições HTTP assíncronas,
- **asyncio** para executar várias tarefas em paralelo,
- **semáforo** para controlar a quantidade de requisições simultâneas,
- **perf_counter** para medir latência com precisão,
- **dataclasses** para organizar os resultados.

É um projeto ideal para estudos de TIC, testes de rede e análise de desempenho de sites.

---

## 📊 Fluxo de Funcionamento

![Fluxograma](./assets/fluxograma.png)

> **Figura – Fluxo de funcionamento do HTTP Frequency.**

O diagrama mostra:  
Usuário → Entrada de URLs → asyncio (concorrência) → httpx → Servidores Web → Processamento → Relatório final.

---

## 💻 Execução Real no Terminal

![Execução](./assets/terminal.png)

> **Figura – Saída real do programa no terminal.**

O relatório final inclui:

- ranking das URLs mais rápidas,  
- tempo total de resposta em milissegundos,  
- códigos HTTP,  
- erros de rede (caso ocorram).

---

## 🚀 Recursos do Sistema

- ✔ Entrada de múltiplas URLs  
- ✔ Execução assíncrona com `asyncio`  
- ✔ Requisições HTTP com `httpx.AsyncClient`  
- ✔ Controle de concorrência com semáforo  
- ✔ Medição precisa de latência  
- ✔ Tratamento de erros (timeout, DNS, 403, 500 etc.)  
- ✔ Relatório claro com ranking  
- ✔ Identificação de falhas individuais  
- ✔ 100% executado em terminal  

---

## ⚙️ Instalação

### **1️⃣ Clone o repositório**
```bash
git clone https://github.com/biel-444/HTTP-Frequency.git
cd HTTP-Frequency
