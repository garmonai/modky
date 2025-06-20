document.addEventListener('DOMContentLoaded', function() {
    // Загрузка данных пользователя
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    document.getElementById('userName').textContent = userData.name || 'Пользователь';
    document.getElementById('userEmail').textContent = userData.email || 'Не указан';
    document.getElementById('userPhone').textContent = userData.phone || 'Не указан';

    // Загрузка данных профиля
    document.getElementById('profileName').textContent = userData.name || 'Пользователь';
    document.getElementById('profileEmail').textContent = userData.email || 'Не указан';
    document.getElementById('profilePhone').textContent = userData.phone || 'Не указан';

    // Загрузка истории заказов
    loadOrderHistory();

    // Загрузка бонусов
    loadBonusInfo();

    // Загрузка скидок
    loadDiscounts();

    // Обработка переключения вкладок
    const navLinks = document.querySelectorAll('.account-nav a');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Убираем активный класс у всех вкладок и ссылок
            tabContents.forEach(content => content.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Получаем ID целевой вкладки
            const targetId = this.getAttribute('href').substring(1);
            
            // Добавляем активный класс выбранной вкладке и ссылке
            document.getElementById(targetId).classList.add('active');
            this.classList.add('active');
        });
    });
});

function loadOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderHistoryContainer = document.getElementById('orderHistory');
    
    if (orders.length === 0) {
        orderHistoryContainer.innerHTML = '<p>У вас пока нет заказов</p>';
        return;
    }

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

function loadBonusInfo() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const bonusAmount = userData.bonusAmount || 0;
    const nextLevel = 1000; // Следующий уровень бонусов
    const progress = (bonusAmount / nextLevel) * 100;

    document.getElementById('bonusAmount').textContent = bonusAmount;
    document.getElementById('nextLevel').textContent = nextLevel;
    document.getElementById('bonusProgress').style.width = `${Math.min(progress, 100)}%`;
}

function loadDiscounts() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const bonusAmount = userData.bonusAmount || 0;
    const discountsList = document.getElementById('discountsList');
    
    // Определяем доступные скидки на основе бонусов
    const discounts = [
        {
            title: 'Скидка 5%',
            description: 'Доступна при накоплении 500 бонусов',
            available: bonusAmount >= 500
        },
        {
            title: 'Скидка 10%',
            description: 'Доступна при накоплении 1000 бонусов',
            available: bonusAmount >= 1000
        },
        {
            title: 'Скидка 15%',
            description: 'Доступна при накоплении 2000 бонусов',
            available: bonusAmount >= 2000
        }
    ];

    let discountsHTML = '';
    discounts.forEach(discount => {
        discountsHTML += `
            <div class="discount-card ${discount.available ? 'available' : 'unavailable'}">
                <h3>${discount.title}</h3>
                <p>${discount.description}</p>
                <p class="status">${discount.available ? 'Доступна' : 'Недоступна'}</p>
            </div>
        `;
    });

    discountsList.innerHTML = discountsHTML;
}

function editProfile() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const newName = prompt('Введите новое имя:', userData.name || '');
    const newEmail = prompt('Введите новый email:', userData.email || '');
    const newPhone = prompt('Введите новый телефон:', userData.phone || '');

    if (newName !== null && newEmail !== null && newPhone !== null) {
        const updatedUserData = {
            ...userData,
            name: newName,
            email: newEmail,
            phone: newPhone
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Обновляем отображение данных
        document.getElementById('userName').textContent = newName;
        document.getElementById('userEmail').textContent = newEmail;
        document.getElementById('userPhone').textContent = newPhone;
        document.getElementById('profileName').textContent = newName;
        document.getElementById('profileEmail').textContent = newEmail;
        document.getElementById('profilePhone').textContent = newPhone;
    }
} 