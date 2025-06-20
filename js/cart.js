// Состояние корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM элементы
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSubtotalElement = document.querySelector('.cart-subtotal');
    const cartTotalElement = document.querySelector('.cart-total');
    const cartCountElement = document.querySelector('.cart-count');

    // Функция обновления отображения корзины
    function updateCartDisplay() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartContainer = document.querySelector('.cart-items');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.querySelector('.cart-count');
        const cartSummary = document.querySelector('.cart-summary');
        // Получаем активную скидку
        let discount = null;
        let discountPercent = 0;
        let discountTitle = '';
        if (localStorage.getItem('activeDiscount')) {
            try {
                discount = JSON.parse(localStorage.getItem('activeDiscount'));
                if (discount && discount.title) {
                    if (discount.title.includes('5%')) discountPercent = 5;
                    if (discount.title.includes('10%')) discountPercent = 10;
                    if (discount.title.includes('15%')) discountPercent = 15;
                    if (discount.title.includes('20%')) discountPercent = 20;
                    if (discount.title.includes('25%')) discountPercent = 25;
                    if (discount.title.includes('50%')) discountPercent = 50;
                    discountTitle = discount.title;
                }
            } catch(e) {}
        }
        if (cartItems.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p><a href="catalog.html" class="go-to-catalog">Перейти в каталог</a>';
            cartTotal.textContent = '0';
            cartCount.textContent = '0';
            if (cartSummary) cartSummary.innerHTML = '<h3>Итого: <span id="cartTotal">0</span> ₽</h3>';
            return;
        }
        let cartHTML = '';
        cartItems.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">${item.price} ₽</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity-value" data-index="${index}">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <span class="item-total" data-index="${index}">${(item.price * item.quantity).toLocaleString()} ₽</span>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        cartContainer.innerHTML = cartHTML;
        const total = calculateTotal();
        let discountAmount = 0;
        if (discountPercent > 0) {
            discountAmount = Math.round(total * discountPercent / 100);
        }
        const finalTotal = total - discountAmount;
        cartTotal.textContent = finalTotal.toLocaleString();
        cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        // Обновляем блок итогов
        if (cartSummary) {
            cartSummary.innerHTML = `<h3>Итого: <span id="cartTotal">${finalTotal.toLocaleString()}</span> ₽</h3>`;
            if (discountPercent > 0) {
                cartSummary.innerHTML += `<div class="cart-discount-info">Скидка: -${discountPercent}% (${discountTitle})<br>Экономия: ${discountAmount.toLocaleString()} ₽</div>`;
            }
        }
    }

    // Функция обновления итоговых сумм
    function updateTotalSums(subtotal) {
        if (cartSubtotalElement) cartSubtotalElement.textContent = `${subtotal.toLocaleString()} ₽`;
        if (cartTotalElement) cartTotalElement.textContent = `${subtotal.toLocaleString()} ₽`;
    }

    // Функция обновления одного товара
    function updateCartItem(index) {
        const item = cart[index];
        const cartItem = cartItemsContainer.querySelector(`.cart-item[data-index="${index}"]`);
        
        if (cartItem) {
            const quantityValue = cartItem.querySelector('.quantity-value');
            const itemTotal = cartItem.querySelector('.item-total');
            
            quantityValue.textContent = item.quantity;
            itemTotal.textContent = `${(item.price * item.quantity).toLocaleString()} ₽`;

            // Обновляем общую сумму
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            updateTotalSums(subtotal);
        }
    }

    // Функция настройки элементов управления корзиной
    function setupCartControls() {
        // Делегирование событий для изменения количества и удаления
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', function(e) {
                const btn = e.target.closest('button');
                if (!btn) return;
                const index = parseInt(btn.dataset.index);
                if (btn.classList.contains('quantity-btn')) {
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    if (btn.classList.contains('plus')) {
                        cart[index].quantity++;
                    } else if (btn.classList.contains('minus')) {
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                        }
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay(); // всегда пересчитываем корзину с учётом скидки
                } else if (btn.classList.contains('remove-item')) {
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                }
            });
        }
    }

    // Функция обновления счетчика корзины
    function updateCartCount() {
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Инициализация корзины
    updateCartDisplay();
    setupCartControls();
    updateCartCount();

    // Обработчик отправки формы заказа
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            checkout();
        });
    }
});

// Маска для телефона
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '')
            .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/);
        
        e.target.value = !x[2] ? x[1] : 
            `+7 (${x[2]}${x[3] ? `) ${x[3]}` : ''}${x[4] ? `-${x[4]}` : ''}`;
    });
}

function calculateTotal() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function checkout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) {
        alert('Корзина пуста');
        return;
    }

    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        comment: formData.get('comment')
    };

    // Проверяем заполнение обязательных полей
    if (!orderData.name || !orderData.phone || !orderData.email || !orderData.address) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    // Получаем активную скидку
    let discount = null;
    let discountPercent = 0;
    if (localStorage.getItem('activeDiscount')) {
        try {
            discount = JSON.parse(localStorage.getItem('activeDiscount'));
            if (discount && discount.title) {
                if (discount.title.includes('5%')) discountPercent = 5;
                if (discount.title.includes('10%')) discountPercent = 10;
                if (discount.title.includes('15%')) discountPercent = 15;
                if (discount.title.includes('20%')) discountPercent = 20;
                if (discount.title.includes('25%')) discountPercent = 25;
                if (discount.title.includes('50%')) discountPercent = 50;
            }
        } catch(e) {}
    }
    const total = calculateTotal();
    let discountAmount = 0;
    if (discountPercent > 0) {
        discountAmount = Math.round(total * discountPercent / 100);
    }
    const finalTotal = total - discountAmount;

    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        status: 'В обработке',
        items: cartItems,
        total: finalTotal,
        discount: discountPercent > 0 ? discountPercent : 0,
        customerData: orderData
    };

    // Сохраняем заказ в историю
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Сохраняем данные пользователя
    const userData = {
        name: orderData.name,
        phone: orderData.phone,
        email: orderData.email
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    // Начисляем бонусы (5% от суммы заказа)
    const bonusAmount = Math.floor(order.total * 0.05);
    userData.bonusAmount = (userData.bonusAmount || 0) + bonusAmount;
    localStorage.setItem('userData', JSON.stringify(userData));

    // Очищаем корзину
    localStorage.removeItem('cart');
    // Удаляем активную скидку после оформления заказа
    localStorage.removeItem('activeDiscount');
    updateCartDisplay();

    alert(`Заказ успешно оформлен! Начислено ${bonusAmount} бонусов.`);
    window.location.href = 'account.html';
}

// При возврате на страницу корзины после выбора скидки, сразу пересчитывать корзину
window.addEventListener('storage', function(e) {
    if (e.key === 'activeDiscount') {
        updateCartDisplay();
    }
}); 