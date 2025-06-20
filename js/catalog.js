// Данные каталога
const catalogData = [
    {
        id: 1,
        name: 'Кухня "Хай-тек Премиум"',
        price: 185000,
        image: 'pic/хай-тек.jfif',
        description: 'Ультрасовременная кухня с глянцевыми фасадами и встроенной LED-подсветкой',
        features: ['Глянцевые фасады', 'LED-подсветка', 'Встроенная техника'],
        delivery: '14-21 день'
    },
    {
        id: 2,
        name: 'Кухня "Этно-Мотив"',
        price: 165000,
        image: 'pic/Этно-монтив.jfif',
        description: 'Яркая кухня в этническом стиле с использованием натуральных материалов',
        features: ['Натуральное дерево', 'Этнические узоры', 'Ручная роспись'],
        delivery: '21-28 дней'
    },
    {
        id: 3,
        name: 'Кухня "Арт-Деко Люкс"',
        price: 245000,
        image: 'pic/Арт-деко Люкс.jfif',
        description: 'Роскошная кухня в стиле арт-деко с геометрическими узорами',
        features: ['Мраморные столешницы', 'Золотая фурнитура', 'Витражные элементы'],
        delivery: '28-35 дней'
    },
    {
        id: 4,
        name: 'Кухня "Скандинавский Уют"',
        price: 155000,
        image: 'pic/скандинавский уют.jfif',
        description: 'Светлая и функциональная кухня в скандинавском стиле',
        features: ['Светлое дерево', 'Минималистичный дизайн', 'Экологичные материалы'],
        delivery: '14-21 день'
    },
    {
        id: 5,
        name: 'Кухня "Эклектика Модерн"',
        price: 195000,
        image: 'pic/эклетика модерн.jfif',
        description: 'Оригинальная кухня, сочетающая различные стили и материалы',
        features: ['Смешение стилей', 'Яркие акценты', 'Дизайнерская мебель'],
        delivery: '21-28 дней'
    },
    {
        id: 6,
        name: 'Кухня "Прованс"',
        price: 175000,
        image: 'pic/прованс.jfif',
        description: 'Уютная кухня в стиле прованс с элементами французского кантри',
        features: ['Патина', 'Фрезеровка', 'Витражи'],
        delivery: '21-28 дней'
    },
    {
        id: 7,
        name: 'Кухня "Современная Классика"',
        price: 168000,
        image: 'pic/Современная классика.jfif',
        description: 'Современная кухня с чистыми линиями и продуманной эргономикой',
        features: ['Матовые фасады', 'Умная организация', 'Встроенная техника'],
        delivery: '14-21 день'
    },
    {
        id: 8,
        name: 'Кухня "Минималистичная"',
        price: 158000,
        image: 'pic/минималистичная.jfif',
        description: 'Минималистичная кухня с акцентом на функциональность',
        features: ['Минимализм', 'Функциональность', 'Современный дизайн'],
        delivery: '21-28 дней'
    },
    {
        id: 9,
        name: 'Кухня "Кантри Шарм"',
        price: 145000,
        image: 'pic/кантри шарм.webp',
        description: 'Уютная кухня в деревенском стиле с элементами винтажного декора',
        features: ['Массив дерева', 'Плетеные корзины', 'Винтажная фурнитура'],
        delivery: '21-28 дней'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.querySelector('.products-grid');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const sortSelect = document.getElementById('sort-select');
    const applyFilters = document.querySelector('.apply-filters');
    const resetFilters = document.querySelector('.reset-filters');

    // Функция отображения товаров
    function displayProducts(products) {
        if (!productsGrid) return;
        
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toLocaleString()} ₽</p>
                    <p class="description">${product.description}</p>
                    <div class="features">
                        ${product.features.map(feature => `<span class="feature">${feature}</span>`).join('')}
                    </div>
                    <p class="delivery">Срок доставки: ${product.delivery}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">В корзину</button>
                </div>
            `;
            
            productsGrid.appendChild(productCard);

            // Добавляем обработчик для кнопки
            const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', () => addToCart(product.id));
        });
    }

    // Функция фильтрации и сортировки
    function filterAndSortProducts() {
        let filteredProducts = [...catalogData];
        
        // Поиск по названию
        const searchBox = document.querySelector('.search-box input');
        if (searchBox && searchBox.value.trim()) {
            const searchTerm = searchBox.value.trim().toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
        }
        
        // Фильтрация по цене
        const minPrice = priceMin.value ? parseInt(priceMin.value) : 0;
        const maxPrice = priceMax.value ? parseInt(priceMax.value) : Infinity;
        
        filteredProducts = filteredProducts.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );

        // Сортировка
        const sortValue = sortSelect.value;
        switch(sortValue) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        displayProducts(filteredProducts);
    }

    // Функция поиска по названию для внешнего использования
    window.filterProductsBySearch = function(searchTerm) {
        if (searchBox) {
            searchBox.value = searchTerm;
        }
        filterAndSortProducts();
    };

    // Добавляем обработчик события для поля поиска
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', filterAndSortProducts);
    }

    // Проверяем URL на наличие параметра поиска при загрузке страницы
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && searchBox) {
        searchBox.value = searchParam;
        filterAndSortProducts();
    }

    // Функция добавления в корзину
    function addToCart(productId) {
        const product = catalogData.find(p => p.id === productId);
        if (!product) return;

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
        updateCartCounter();

        // Показываем уведомление
        const button = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
        button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        button.classList.add('added');
        
        setTimeout(() => {
            button.innerHTML = 'В корзину';
            button.classList.remove('added');
        }, 2000);
    }

    // Функция обновления счетчика корзины
    function updateCartCounter() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Обработчики событий
    if (applyFilters) {
        applyFilters.addEventListener('click', filterAndSortProducts);
    }

    if (resetFilters) {
        resetFilters.addEventListener('click', () => {
            if (priceMin) priceMin.value = '';
            if (priceMax) priceMax.value = '';
            if (sortSelect) sortSelect.value = 'default';
            displayProducts(catalogData);
        });
    }

    // Инициализация
    displayProducts(catalogData);
    updateCartCounter();
}); 