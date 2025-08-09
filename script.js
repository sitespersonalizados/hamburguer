let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function adicionarAoCarrinho(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinhoLateral();
  alert(`${nome} adicionado ao carrinho.`);
}

function abrirCarrinho() {
  atualizarCarrinhoLateral();
  const painel = document.getElementById('carrinho-lateral');
  if (painel) {
    painel.classList.add('aberto');
  }
}

function fecharCarrinho() {
  const painel = document.getElementById('carrinho-lateral');
  if (painel) {
    painel.classList.remove('aberto');
  }
}

function removerDoCarrinho(nome) {
  carrinho = carrinho.filter(item => item.nome !== nome);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinhoLateral();
}

function atualizarCarrinhoLateral() {
  const container = document.getElementById('carrinho-itens');
  const totalSpan = document.getElementById('total');

  if (!container || !totalSpan) return;

  container.innerHTML = '';
  let total = 0;

  if (carrinho.length === 0) {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    carrinho.forEach(item => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.padding = '5px 0';

      const texto = document.createElement('span');
      texto.innerText = `${item.nome} (x${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}`;

      const botaoRemover = document.createElement('button');
      botaoRemover.innerText = 'X';
      botaoRemover.onclick = () => removerDoCarrinho(item.nome);

      div.appendChild(texto);
      div.appendChild(botaoRemover);
      container.appendChild(div);

      total += item.preco * item.quantidade;
    });
  }

  totalSpan.innerText = total.toFixed(2);
}

function finalizarWhatsApp() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "*Olá! Gostaria de finalizar o seguinte pedido:*\n\n";
  let total = 0;

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (x${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    total += item.preco * item.quantidade;
  });

  mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

  const numero = "5599999999999"; // <-- coloque seu número de WhatsApp aqui
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, '_blank');

  carrinho = [];
  localStorage.removeItem('carrinho');
  fecharCarrinho();
}

// Menu hamburguer - ajustado para seleção correta do ul dentro do nav
const menuHamburguer = document.getElementById('menu-hamburguer');
const menuNavegacao = document.querySelector('nav ul'); // Ajustado para pegar o ul dentro do nav

menuHamburguer.addEventListener('click', (e) => {
  e.stopPropagation(); // evita conflito com clique fora
  menuNavegacao.classList.toggle('mostrar');
});

// Fecha o menu ao clicar em links
menuNavegacao.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuNavegacao.classList.remove('mostrar');
  });
});

// Fecha o menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!menuNavegacao.contains(e.target) && !menuHamburguer.contains(e.target)) {
    menuNavegacao.classList.remove('mostrar');
  }
});

// Atualiza o carrinho na carga inicial da página (caso tenha itens no localStorage)
atualizarCarrinhoLateral();
