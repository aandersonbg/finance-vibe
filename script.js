// =====================================
// Vibe Finance — lógica principal
// =====================================
const LS_KEY = 'financas_vibe_transacoes';
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const state = {
  transacoes: [],
  chart: null,
};

// ---------- Utilidades ----------
const toCurrency = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const parseNumber = (v) => Number(String(v).replace(',', '.'));
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function load(){
  try {
    state.transacoes = JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch(e){ state.transacoes = []; }
}
function save(){
  localStorage.setItem(LS_KEY, JSON.stringify(state.transacoes));
}

// ---------- Resumo ----------
function renderResumo(){
  const entradas = state.transacoes.filter(t=>t.tipo==='entrada').reduce((a,t)=>a+t.valor,0);
  const saidas   = state.transacoes.filter(t=>t.tipo==='saida').reduce((a,t)=>a+t.valor,0);
  $('#entradas').textContent = toCurrency(entradas);
  $('#saidas').textContent   = toCurrency(saidas);
  $('#total').textContent    = toCurrency(entradas - saidas);
}

// ---------- Lista ----------
function renderTabela(){
  const filtroTipo = $('#filtro-tipo').value;
  const filtroTexto = $('#filtro-texto').value.trim().toLowerCase();
  const tbody = $('#tbody');
  tbody.innerHTML = '';

  let lista = [...state.transacoes].sort((a,b)=> new Date(b.data)-new Date(a.data));
  if(filtroTipo !== 'todas') lista = lista.filter(t=>t.tipo===filtroTipo);
  if(filtroTexto){
    lista = lista.filter(t=> (t.descricao + ' ' + (t.categoria||'')).toLowerCase().includes(filtroTexto));
  }

  for(const t of lista){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(t.data).toLocaleDateString('pt-BR')}</td>
      <td>${t.descricao}</td>
      <td><span class="badge">${t.categoria || '-'}</span></td>
      <td class="right" style="color:${t.tipo==='entrada' ? '#00d084' : '#ff4757'}">${toCurrency(t.valor)}</td>
      <td class="right"><button class="btn-icon" title="Excluir" data-id="${t.id}">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  }
}

// ---------- Gráfico (Chart.js) ----------
function getMesKey(d){
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
}

function getUltimosMeses(n){
  const arr=[];
  const ref = new Date();
  ref.setDate(1);
  for(let i=n-1;i>=0;i--){
    const d = new Date(ref.getFullYear(), ref.getMonth()-i, 1);
    arr.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  }
  return arr;
}

function dadosGrafico(nMeses){
  const labels = getUltimosMeses(nMeses);
  const mapa = Object.fromEntries(labels.map(m=>[m,{e:0,s:0}]));
  for(const t of state.transacoes){
    const k = getMesKey(t.data);
    if(mapa[k]){
      if(t.tipo==='entrada') mapa[k].e += t.valor; else mapa[k].s += t.valor;
    }
  }
  return {
    labels: labels.map(m => {
      const [y,mo] = m.split('-');
      return `${mo}/${String(y).slice(-2)}`;
    }),
    entradas: labels.map(m=>mapa[m].e),
    saidas:   labels.map(m=>mapa[m].s)
  };
}

function renderGrafico(){
  const n = parseInt($('#range-meses').value,10);
  const ctx = $('#grafico');
  const data = dadosGrafico(n);

  const config = {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        { label: 'Entradas', data: data.entradas, backgroundColor: 'rgba(0,208,132,0.6)', borderRadius: 8 },
        { label: 'Saídas',   data: data.saidas,   backgroundColor: 'rgba(255,71,87,0.6)', borderRadius: 8 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: (v)=> toCurrency(v) }, grid: { color: 'rgba(255,255,255,0.08)' } },
        x: { grid: { display:false } }
      },
      plugins: {
        legend: { labels: { color: '#e6f1ff' } },
        tooltip: { callbacks: { label: (ctx)=> `${ctx.dataset.label}: ${toCurrency(ctx.parsed.y)}` } }
      }
    }
  };

  if(state.chart){ state.chart.destroy(); }
  state.chart = new Chart(ctx, config);
}

// ---------- Ações ----------
function addTransacao(e){
  e.preventDefault();
  const descricao = $('#descricao').value.trim();
  const valor = parseNumber($('#valor').value);
  const tipo = $('#tipo').value;
  const categoria = $('#categoria').value.trim();
  const data = $('#data').value || new Date().toISOString().slice(0,10);

  if(!descricao || !valor){
    alert('Preencha descrição e valor.');
    return;
  }

  state.transacoes.push({ id: uid(), descricao, valor, tipo, categoria, data });
  save();
  $('#form-transacao').reset();
  updateUI();
}

function excluirTransacao(id){
  state.transacoes = state.transacoes.filter(t=>t.id!==id);
  save();
  updateUI();
}

function exportar(){
  const blob = new Blob([JSON.stringify(state.transacoes, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'transacoes.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function limpar(){
  if(confirm('Tem certeza que deseja limpar todas as transações?')){
    state.transacoes = [];
    save();
    updateUI();
  }
}

// ---------- Binding UI ----------
function updateUI(){
  renderResumo();
  renderTabela();
  renderGrafico();
}

function bind(){
  load();
  // Form
  $('#form-transacao').addEventListener('submit', addTransacao);
  // Filtros
  $('#filtro-tipo').addEventListener('change', updateUI);
  $('#filtro-texto').addEventListener('input', updateUI);
  $('#range-meses').addEventListener('change', updateUI);
  // Ações topo
  $('#btn-export').addEventListener('click', exportar);
  $('#btn-clear').addEventListener('click', limpar);
  // Delegação para excluir
  $('#tbody').addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-id]');
    if(btn){ excluirTransacao(btn.dataset.id); }
  });

  // Data padrão hoje
  const today = new Date().toISOString().slice(0,10);
  document.getElementById('data').value = today;

  updateUI();
}

document.addEventListener('DOMContentLoaded', bind);
