# PRD — Vibe Finance (App de Organização de Finanças Pessoais)

## 1. Visão Geral
Um app web simples, rápido e acessível para registro de transações pessoais, com resumo financeiro e gráfico de acompanhamento. Construído em HTML/CSS/JS puro para facilitar a entrega do desafio.

## 2. Objetivos
- Permitir que o usuário registre entradas e saídas em segundos.
- Exibir balanço (entradas, saídas e total) em tempo real.
- Mostrar evolução mensal em gráfico (Chart.js).
- Persistir dados no navegador (localStorage), sem backend.

## 3. Escopo
### 3.1 Funcional (MVP)
- [x] Criar transação (descrição, valor, tipo, categoria, data)
- [x] Listar transações com ordenação por data (desc)
- [x] Excluir transação
- [x] Resumo (entradas, saídas, total)
- [x] Filtros (tipo e texto)
- [x] Gráfico de entradas x saídas por mês (3/6/12 meses)
- [x] Exportar JSON e Limpar dados

### 3.2 Não Funcional
- Performance client-side (sem dependências pesadas além de Chart.js)
- Responsividade mobile-first
- Acessibilidade básica (contrast ratio, foco visível)
- Design Glassmorphism + Neon coerente com Vibe Coding

## 4. Personas e Jornadas
- **Pessoa Estudante/Dev Júnior:** deseja aprender e controlar gastos. Jornada: abre → cadastra transações → acompanha gráfico → exporta JSON.
- **Pessoa Autônoma:** registra recebimentos e custos do dia a dia. Jornada: usa no celular → filtra por tipo → exclui itens eventuais.

## 5. Requisitos Detalhados
- R01: Salvar dados localmente (`localStorage`), chave `financas_vibe_transacoes`.
- R02: Entradas positivas, saídas positivas (o tipo define o sinal).
- R03: Valores exibidos em `pt-BR` com moeda `BRL`.
- R04: Ordenação por data (recente primeiro).
- R05: Gráfico agrupado por mês; ranges: 3, 6 e 12 meses.
- R06: Exportação JSON das transações.
- R07: Limpar dados com confirmação.

## 6. Métricas de Sucesso
- Tempo médio para cadastrar uma transação < 10s.
- Usuário consegue entender o saldo em 1 glance (sumário).
- Gráfico atualiza em até 100ms após nova transação (cliente típico).

## 7. Riscos e Mitigações
- **Troca de dispositivo** → Dados não acompanham: oferecer exportação JSON.
- **Limpeza de cache** → Dados se perdem: reforçar exportação.
- **Compatibilidade** → `backdrop-filter` pode degradar: CSS degrada com cores sólidas.

## 8. Critérios de Aceite
- CA1: Consigo adicionar, excluir e ver transações sem recarregar.
- CA2: Sumário e gráfico refletem os dados imediatamente.
- CA3: Layout funcional em 360px de largura.
- CA4: Repositório com README e PRD.

## 9. Roadmap (futuro)
- Importar JSON
- Categorias com cor e filtro dedicado
- Múltiplas carteiras/contas
- PWA (instalável offline)
- Exportar CSV e PDF
