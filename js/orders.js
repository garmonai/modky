// Функция для сохранения заказа в localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order); // Добавляем новый заказ в начало массива
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Функция для получения всех заказов
function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

// Функция для отображения заказов в личном кабинете
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    const orders = getOrders();
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">У вас пока нет заказов</p>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">Заказ #${order.id}</span>
                <span class="order-date">${order.date}</span>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-details">
                <img src="${order.image}" alt="${order.name}">
                <div class="order-info">
                    <h4>${order.name}</h4>
                    <p>Комплектация: ${order.configuration}</p>
                    <p>Цвет: ${order.color}</p>
                    <p class="order-price">${order.price.toLocaleString()} ₽</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Функция для оформления заказа из корзины
function placeOrder(cartItems) {
    const order = {
        id: Date.now().toString().slice(-5),
        date: new Date().toLocaleDateString('ru-RU'),
        status: 'В обработке',
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.price, 0)
    };

    saveOrder(order);
    localStorage.removeItem('cart'); // Очищаем корзину после оформления заказа
    updateCartCount(); // Обновляем счетчик корзины
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadOrderHistory();
});

function loadOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderHistoryContainer = document.getElementById('orderHistory');
    
    if (orders.length === 0) {
        orderHistoryContainer.innerHTML = '<p class="no-orders">У вас пока нет заказов</p>';
        return;
    }

    // Сортируем заказы по дате (новые сверху)
    orders.sort((a, b) => b.id - a.id);

    let ordersHTML = '';
    orders.forEach(order => {
        ordersHTML += `
            <div class="order-item">
                <div class="order-header">
                    <h3>Заказ #${order.id}</h3>
                    <span class="order-date">${order.date}</span>
                    <span class="order-status">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="product-info">
                                <h4>${item.name}</h4>
                                <p>Количество: ${item.quantity}</p>
                                <p>Цена: ${item.price} ₽</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <p>Итого: ${order.total} ₽</p>
                </div>
            </div>
        `;
    });

    orderHistoryContainer.innerHTML = ordersHTML;
} 