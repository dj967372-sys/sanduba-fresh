// 1. Configuração Oficial do Sanduba Fresh e Supabase
const WHATSAPP_NUMBER = "557996353465";
const PIX_KEY = "e990fe3d-0e10-42fe-b511-fa99742c86f3";

const SUPABASE_URL = 'https://nzsibssjttxrtcsyfgmx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c2lic3NqdHR4cnRjc3lmZ214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMDQ3MzMsImV4cCI6MjEwODg4MDczM30.ij7eQzm5XvHTZqGwCrZ3lWiZKRD6XNbd09CICtsVK3c';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let products = JSON.parse(localStorage.getItem('sanduba_products')) || [
    {
        id: 1,
        name: "Sanduíche Natural de Peito de Peru",
        category: "peru",
        description: "Sanduíche natural leve e saudável com finas fatias de peito de peru defumado.",
        ingredients: "Pão Integral, peito de peru defumado, requeijão cremoso, alface e tomate.",
        price: 5.00,
        available: true,
        image: "img/peru.jpeg"
    },
    {
        id: 2,
        name: "Sanduíche Natural de Atum",
        category: "atum",
        description: "Atum fresco selecionado com maionese artesanal e ervas finas.",
        ingredients: "Pão de Forma, atum sólido em óleo, maionese, milho e cebolinha.",
        price: 5.00,
        available: true,
        image: "img/atum.jpeg"
    },
    {
        id: 3,
        name: "Sanduíche Natural de Frango",
        category: "frango",
        description: "Sanduíche natural de frango desfiado temperado com ervas e um toque de cenoura.",
        ingredients: "Pão de Forma, frango desfiado, requeijão light, cenoura ralada e alface.",
        price: 5.00,
        available: true,
        image: "img/frango.jpeg"
    },
    {
        id: 4,
        name: "Biscoitinhos Caseiros de Queijo",
        category: "biscoitos",
        description: "Biscoitinhos caseiros de queijo super crocantes, amanteigados e fresquinhos.",
        ingredients: "Farinha de trigo, queijo ralado, manteiga e ovos.",
        price: 10.00,
        available: true,
        image: "img/biscoito de que.jpeg"
    },
    {
        id: 5,
        name: "Biscoitinho amanteigado",
        category: "biscoito",
        description: "Biscoito amanteigado com açúcar.",
        ingredients: "Farinha de trigo, ovos, creme de leite, manteiga e açucar.",
        price: 10.00,
        available: true,
        image: "img/biscoito aman.jpeg"
    }
];

let cart = JSON.parse(localStorage.getItem('sanduba_cart')) || [];

// 3. Renderização do Cardápio e Filtros
function renderProducts(filterCategory = 'todos', searchTerm = '') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesCategory = filterCategory === 'todos' || p.category === filterCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Nenhum sanduíche encontrado.</p>';
        return;
    }

    filtered.forEach(product => {
        grid.innerHTML += `
            <div class="product-card" style="background: var(--card-bg, #fff); border-radius: 12px; padding: 16px; box-shadow: 0 4px 10px rgba(0,0.5,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
                <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius: 8px; height: 160px; object-fit: cover; margin-bottom: 12px;">
                <div>
                    <h3 style="margin-bottom: 8px; font-size: 18px;">${product.name}</h3>
                    <p style="font-size: 14px; opacity: 0.8; margin-bottom: 8px;">${product.description}</p>
                    <p style="font-size: 13px; margin-bottom: 12px;"><strong>Ingredientes:</strong> ${product.ingredients}</p>
                </div>
                <div>
                    <p class="price" style="font-weight: bold; font-size: 16px; color: var(--primary, #27ae60); margin-bottom: 12px;">R$ ${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})" class="btn btn-primary" style="width: 100%; padding: 8px; cursor: pointer;">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
    });
}

// 4. Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('sanduba_cart', JSON.stringify(cart));
        updateCartUI();
        alert(`${product.name} adicionado ao carrinho!`);
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = cart.length;

    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; padding:20px;">O seu carrinho está vazio.</p>';
        } else {
            let total = 0;
            cart.forEach((item, index) => {
                total += item.price;
                cartItemsContainer.innerHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                        <span>${item.name}</span>
                        <div>
                            <span>R$ ${item.price.toFixed(2)}</span>
                            <button onclick="removeFromCart(${index})" style="background: none; border: none; color: red; cursor: pointer; margin-left: 10px;"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });
        }
        if (subtotalEl) subtotalEl.textContent = `R$ ${cart.reduce((sum, i) => sum + i.price, 0).toFixed(2)}`;
        if (totalEl) totalEl.textContent = `R$ ${cart.reduce((sum, i) => sum + i.price, 0).toFixed(2)}`;
    }
}

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    localStorage.setItem('sanduba_cart', JSON.stringify(cart));
    updateCartUI();
}

// 5. Modo Claro / Escuro (Versão Definitiva)
function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (!themeToggleBtn) return;

    // Aplicar tema salvo ao iniciar
    const savedTheme = localStorage.getItem('sanduba_theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        body.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    // Evento de clique direto no botão do tema
    themeToggleBtn.onclick = function() {
        const hasDarkTheme = body.hasAttribute('data-theme');

        if (hasDarkTheme) {
            body.removeAttribute('data-theme');
            localStorage.setItem('sanduba_theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('sanduba_theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    };
}

// 6. Mini Jogo Interativo (Adivinhação / Memória de Ingredientes com Emojis)
function setupMiniGame() {
    const startBtn = document.getElementById('start-game-btn');
    const board = document.getElementById('memory-board');
    const timerEl = document.getElementById('game-timer');
    const pairsEl = document.getElementById('pairs-left');

    if (!startBtn || !board) return;

    // Ingredientes do Sanduba Fresh representados por emojis coloridos
    const ingredients = [
        { name: "Alface", emoji: "🥬" },
        { name: "Tomate", emoji: "🍅" },
        { name: "Frango", emoji: "🍗" },
        { name: "Queijo", emoji: "🧀" }
    ];

    let cards = [...ingredients, ...ingredients];
    let flippedCards = [];
    let matchedPairs = 0;
    let timeLeft = 45;
    let timerInterval = null;
    let isPlaying = false;

    startBtn.addEventListener('click', () => {
        board.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        timeLeft = 45;
        isPlaying = true;
        if (pairsEl) pairsEl.textContent = ingredients.length;
        if (timerEl) timerEl.textContent = timeLeft;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isPlaying = false;
                alert('⏰ O tempo acabou! Tenta novamente para acertar os ingredientes.');
                board.innerHTML = '<div class="game-placeholder-msg">Tempo esgotado! Clique em "Iniciar Jogo" para tentar outra vez.</div>';
            }
        }, 1000);

        cards.sort(() => Math.random() - 0.5);

        cards.forEach((item) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.name = item.name;

            card.style.cssText = "background: var(--card-bg, #f0f0f0); border: 2px dashed var(--primary, #27ae60); height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 14px; border-radius: 8px; cursor: pointer; user-select: none; transition: all 0.3s ease;";
            card.innerHTML = `<span style="font-size: 20px; opacity: 0.5; margin-bottom: 4px;">❓</span><span style="font-size: 11px; opacity: 0.7;">Adivinhar</span>`;

            card.addEventListener('click', () => {
                if (!isPlaying || card.classList.contains('matched') || card.classList.contains('flipped')) return;
                if (flippedCards.length >= 2) return;

                card.classList.add('flipped');
                card.style.background = "var(--bg, #fff)";
                card.style.border = "2px solid var(--primary, #27ae60)";
                card.innerHTML = `<span style="font-size: 28px; margin-bottom: 2px;">${item.emoji}</span><strong style="font-size: 11px;">${item.name}</strong>`;

                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    const [card1, card2] = flippedCards;

                    if (card1.dataset.name === card2.dataset.name) {
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        matchedPairs++;
                        if (pairsEl) pairsEl.textContent = ingredients.length - matchedPairs;
                        flippedCards = [];

                        if (matchedPairs === ingredients.length) {
                            clearInterval(timerInterval);
                            isPlaying = false;
                            setTimeout(() => {
                                alert('🎉 Parabéns! Descobriste todos os ingredientes frescos do Sanduba Fresh!');
                            }, 300);
                        }
                    } else {
                        setTimeout(() => {
                            card1.classList.remove('flipped');
                            card1.style.background = "var(--card-bg, #f0f0f0)";
                            card1.style.border = "2px dashed var(--primary, #27ae60)";
                            card1.innerHTML = `<span style="font-size: 20px; opacity: 0.5; margin-bottom: 4px;">❓</span><span style="font-size: 11px; opacity: 0.7;">Adivinhar</span>`;

                            card2.classList.remove('flipped');
                            card2.style.background = "var(--card-bg, #f0f0f0)";
                            card2.style.border = "2px dashed var(--primary, #27ae60)";
                            card2.innerHTML = `<span style="font-size: 20px; opacity: 0.5; margin-bottom: 4px;">❓</span><span style="font-size: 11px; opacity: 0.7;">Adivinhar</span>`;

                            flippedCards = [];
                        }, 900);
                    }
                }
            });

            board.appendChild(card);
        });

        board.style.cssText = "display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 15px;";
    });
}

// 7. Avaliações com Supabase
async function carregarAvaliacoes() {
    const listContainer = document.getElementById('reviews-list');
    if (!listContainer) return;

    const { data, error } = await supabaseClient
        .from('reviews')
        .select('*');

    if (error) {
        console.error('Erro ao carregar avaliações:', error);
        listContainer.innerHTML = '<p>Erro ao carregar comentários.</p>';
        return;
    }

    listContainer.innerHTML = '';
    if (!data || data.length === 0) {
        listContainer.innerHTML = '<p>Ainda não há avaliações. Seja o primeiro a comentar!</p>';
        return;
    }

    data.forEach(rev => {
        listContainer.innerHTML += `
            <div style="background: var(--card-bg, #f9f9f9); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                <strong>${rev.name}</strong> <span style="font-size: 12px; opacity: 0.6;">(${rev.type})</span>
                <p style="margin: 6px 0;">${rev.text || ''}</p>
                <div style="color: #f1c40f; font-size: 12px;">Nota: ${rev.rating} ★</div>
            </div>
        `;
    });
}

async function enviarAvaliacao(nome, tipo, rating, texto) {
    const { error } = await supabaseClient
        .from('reviews')
        .insert([
            {
                name: nome,
                type: tipo,
                rating: parseInt(rating),
                text: texto,
                date: new Date().toLocaleDateString('pt-BR')
            }
        ]);

    if (error) {
        console.error('Erro ao enviar:', error);
        alert('Erro ao enviar avaliação.');
        return;
    }

    alert('Avaliação enviada com sucesso!');
    carregarAvaliacoes();
}

// 8. Modais (Carrinho e Admin)
function setupModals() {
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            updateCartUI();
            cartModal.style.display = 'flex';
        });
    }
    if (closeCart && cartModal) {
        closeCart.addEventListener('click', () => { cartModal.style.display = 'none'; });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('O seu carrinho está vazio!');
                return;
            }
            let msg = "Olá! Gostaria de fazer o pedido dos seguintes sanduíches:\n";
            cart.forEach(item => { msg += `- ${item.name} (R$ ${item.price.toFixed(2)})\n`; });
            const total = cart.reduce((sum, i) => sum + i.price, 0);
            msg += `\nTotal: R$ ${total.toFixed(2)}`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }
}

// 9. Inicialização Geral
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    setupThemeToggle();
    setupMiniGame();
    carregarAvaliacoes();
    setupModals();

    // Filtros de Categoria do Cardápio
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            const searchVal = document.getElementById('search-input')?.value || '';
            renderProducts(category, searchVal);
        });
    });

    // Barra de Pesquisa
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeCategory = document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'todos';
            renderProducts(activeCategory, e.target.value);
        });
    }

    // Formulário de Avaliações
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('reviewer-name')?.value || 'Anônimo';
            const tipo = document.getElementById('review-type')?.value || 'avaliacao';
            const rating = document.getElementById('review-rating')?.value || 5;
            const texto = document.getElementById('review-text')?.value || '';

            await enviarAvaliacao(nome, tipo, rating, texto);
            reviewForm.reset();
        });
    }

    // Estrelas de Avaliação Interativas
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const val = star.getAttribute('data-value');
            const ratingInput = document.getElementById('review-rating');
            if (ratingInput) ratingInput.value = val;
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= val) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
});
// Ferramenta de Filtro por Categoria (Menu Suspenso)
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            const searchVal = document.getElementById('search-input')?.value || '';
            renderProducts(selectedCategory, searchVal);
        });
    }
    // 8.1. Painel Administrativo (Lógica Completa)
function setupAdminPanel() {
    const adminBtn = document.getElementById('admin-login-btn');
    const adminModal = document.getElementById('admin-modal');
    const closeAdmin = document.getElementById('close-admin');
    const adminBody = document.getElementById('admin-body');

    if (!adminBtn || !adminModal) return;

    // Abrir modal do Admin ao clicar no cadeado
    adminBtn.addEventListener('click', () => {
        const password = prompt('Digite a senha de administrador:');
        
        // Senha padrão definida: admin123 (podes alterar se quiseres)
        if (password === 'admin123') {
            renderAdminPanel();
            adminModal.style.display = 'flex';
        } else if (password !== null) {
            alert('Senha incorreta!');
        }
    });

    // Fechar modal do Admin
    if (closeAdmin) {
        closeAdmin.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }

    // Renderizar o conteúdo do Painel Admin
    function renderAdminPanel() {
        if (!adminBody) return;

        let html = `
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">Gerenciar Produtos</h4>
                <div style="max-height: 250px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
        `;

        products.forEach((prod, index) => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <div>
                        <strong>${prod.name}</strong> - R$ ${prod.price.toFixed(2)} (${prod.category})
                    </div>
                    <div>
                        <button onclick="toggleProductAvailability(${prod.id})" class="btn" style="padding: 4px 8px; font-size: 12px; background: ${prod.available ? '#27ae60' : '#e74c3c'}; color: #fff; margin-right: 5px;">
                            ${prod.available ? 'Disponível' : 'Indisponível'}
                        </button>
                        <button onclick="deleteProduct(${prod.id})" class="btn" style="padding: 4px 8px; font-size: 12px; background: #c0392b; color: #fff;">
                            Excluir
                        </button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <hr style="margin: 15px 0;">
                <h4>Adicionar Novo Produto</h4>
                <form id="add-product-form" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                    <input type="text" id="new-prod-name" placeholder="Nome do Produto" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <select id="new-prod-category" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                        <option value="frango">Frango</option>
                        <option value="peru">Peito de Peru</option>
                        <option value="atum">Atum</option>
                        <option value="biscoitos">Biscoitinhos de Queijo</option>
                        <option value="biscoito">Biscoitinho Amanteigado</option>
                    </select>
                    <input type="text" id="new-prod-desc" placeholder="Descrição" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <input type="text" id="new-prod-ing" placeholder="Ingredientes" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <input type="number" step="0.50" id="new-prod-price" placeholder="Preço (ex: 5.50)" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <input type="text" id="new-prod-img" placeholder="Caminho/URL da Imagem" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <button type="submit" class="btn btn-primary" style="margin-top: 8px; padding: 10px;">Salvar Produto</button>
                </form>
            </div>
        `;

        adminBody.innerHTML = html;

        // Evento de submissão do novo produto
        const addForm = document.getElementById('add-product-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const newProd = {
                    id: Date.now(),
                    name: document.getElementById('new-prod-name').value,
                    category: document.getElementById('new-prod-category').value,
                    description: document.getElementById('new-prod-desc').value,
                    ingredients: document.getElementById('new-prod-ing').value,
                    price: parseFloat(document.getElementById('new-prod-price').value),
                    available: true,
                    image: document.getElementById('new-prod-img').value
                };

                products.push(newProd);
                localStorage.setItem('sanduba_products', JSON.stringify(products));
                renderProducts();
                renderAdminPanel();
                alert('Produto adicionado com sucesso!');
            });
        }
    }

    // Funções globais de ação do Admin
    window.toggleProductAvailability = function(id) {
        const prod = products.find(p => p.id === id);
        if (prod) {
            prod.available = !prod.available;
            localStorage.setItem('sanduba_products', JSON.stringify(products));
            renderProducts();
            renderAdminPanel();
        }
    };

    window.deleteProduct = function(id) {
        if (confirm('Tem certeza de que deseja excluir este produto?')) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem('sanduba_products', JSON.stringify(products));
            renderProducts();
            renderAdminPanel();
        }
    };
}
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    setupThemeToggle();
    setupMiniGame();
    carregarAvaliacoes();
    setupModals();
    setupAdminPanel(); // 👈 Garante que esta linha está aqui!
});
// Função para copiar a Chave Pix
function copiarChavePix() {
    const chaveElemento = document.getElementById("pix-chave");
    
    if (chaveElemento) {
        const chaveTexto = chaveElemento.innerText;
        
        navigator.clipboard.writeText(chaveTexto).then(() => {
            alert("Chave Pix copiada com sucesso!");
        }).catch(err => {
            console.error("Erro ao copiar a chave Pix: ", err);
        });
    }
}