// === Код для кнопки "Подняться вверх" ===
document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollTopButton = document.getElementById('scroll-to-top');
    const accessibilityButton = document.getElementById('accessibility-toggle');
    const searchBox = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const productsGrid = document.querySelector('.products-grid');

    // Кнопка прокрутки вверх
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Функционал для версии для слабовидящих
    if (accessibilityButton) {
        // Получаем сохраненный режим из localStorage
        let accessibilityMode = parseInt(localStorage.getItem('accessibilityMode')) || 0;
        
        // Применяем сохраненный режим при загрузке страницы
        applyAccessibilityMode(accessibilityMode);

        accessibilityButton.addEventListener('click', () => {
            accessibilityMode = (accessibilityMode + 1) % 4;
            // Сохраняем новый режим в localStorage
            localStorage.setItem('accessibilityMode', accessibilityMode);
            
            applyAccessibilityMode(accessibilityMode);
        });
    }

    // Функция применения режима доступности
    function applyAccessibilityMode(mode) {
        document.body.classList.remove('high-contrast', 'large-text', 'larger-text');
        
        switch(mode) {
            case 1:
                document.body.classList.add('high-contrast');
                break;
            case 2:
                document.body.classList.add('large-text');
                break;
            case 3:
                document.body.classList.add('larger-text');
                break;
        }
    }

    // Функционал поиска
    if (searchButton && searchBox) {
        searchButton.addEventListener('click', performSearch);
        searchBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const searchTerm = searchBox.value.trim().toLowerCase();
        if (searchTerm) {
            // Если мы на странице каталога, фильтруем товары
            if (window.location.pathname.includes('catalog.html')) {
                if (typeof filterProductsBySearch === 'function') {
                    filterProductsBySearch(searchTerm);
                }
            } else {
                // Если мы на другой странице, перенаправляем на каталог с параметром поиска
                window.location.href = `catalog.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    }

    // Часы
    function updateTime() {
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    // Обновляем время сразу при загрузке
    updateTime();

    // Обновляем каждую секунду
    setInterval(updateTime, 1000);

    // Анимации при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.advantage-item, .product-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

// Загрузка популярных товаров
const popularProducts = [
    {
        id: 1,
        name: 'Кухня "Современная Классика"',
        price: 168000,
        image: 'pic/Современная классика.jfif',
        delivery: '14-21 день',
        quantity: 1
    },
    {
        id: 2,
        name: 'Кухня "Хай-тек Премиум"',
        price: 185000,
        image: 'pic/хай-тек.jfif',
        delivery: '14-21 день',
        quantity: 1
    },
    {
        id: 3,
        name: 'Кухня "Минималистичная"',
        price: 158000,
        image: 'pic/минималистичная.jfif',
        delivery: '14-21 день',
        quantity: 1
    }
];

// Функция для проверки, находимся ли мы на главной странице
function isMainPage() {
    return window.location.pathname === '/' || 
           window.location.pathname === '/index.html' ||
           window.location.pathname.endsWith('/index.html');
}

// Функция добавления в корзину
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Если товар уже есть, увеличиваем количество
        cart[existingItemIndex].quantity++;
    } else {
        // Если товара нет, добавляем новый
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            delivery: product.delivery,
            quantity: 1
        });
    }

    // Сохраняем корзину
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик корзины
    updateCartCount();

    // Показываем уведомление
    const button = document.querySelector(`.add-to-cart[data-id="${product.id}"]`);
    if (button) {
        button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        button.classList.add('added');
        
        setTimeout(() => {
            button.innerHTML = 'В корзину';
            button.classList.remove('added');
        }, 2000);
    }
}

// Функция обновления счетчика корзины
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='pic/i.webp'">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toLocaleString()} ₽</p>
            <p class="delivery">Срок доставки: ${product.delivery}</p>
            <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
        </div>
    `;
    
    const addButton = card.querySelector('.add-to-cart');
    addButton.addEventListener('click', () => addToCart(product));
    
    return card;
}

// Загружаем продукты только если мы на главной странице и есть контейнер для них
document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.querySelector('.products-grid');
    if (isMainPage() && productsGrid) {
        popularProducts.forEach(product => {
            productsGrid.appendChild(createProductCard(product));
        });
    }
    
    // Обновляем счетчик корзины при загрузке страницы
    updateCartCount();
});