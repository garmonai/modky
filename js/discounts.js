document.addEventListener('DOMContentLoaded', function() {
    loadDiscounts();
});

function loadDiscounts() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const bonusAmount = userData.bonusAmount || 0;
    const discountsList = document.getElementById('discountsList');
    // Получаем использованные скидки
    let usedDiscounts = [];
    if (localStorage.getItem('usedDiscounts')) {
        try {
            usedDiscounts = JSON.parse(localStorage.getItem('usedDiscounts'));
        } catch(e) { usedDiscounts = []; }
    }
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
        },
        {
            title: 'Скидка 20%',
            description: 'Доступна при накоплении 5000 бонусов',
            available: bonusAmount >= 5000
        },
        {
            title: 'Скидка 25%',
            description: 'Доступна при накоплении 10000 бонусов',
            available: bonusAmount >= 10000
        },
        {
            title: 'Партнёрская скидка 50%',
            description: 'Доступна только по спецусловиям',
            available: userData.name === 'Виталий'
        }
    ];

    let discountsHTML = '';
    discounts.forEach((discount, idx) => {
        // Проверяем, выбрана ли эта скидка
        let isActive = false;
        if (localStorage.getItem('activeDiscount')) {
            try {
                const active = JSON.parse(localStorage.getItem('activeDiscount'));
                if (active && active.title === discount.title) isActive = true;
            } catch(e) {}
        }
        // Проверяем, использована ли скидка
        let isUsed = usedDiscounts.includes(discount.title);
        discountsHTML += `
            <div class="discount-card ${isUsed ? 'used' : (discount.available ? 'available' : 'unavailable')}">
                <h3>${discount.title}</h3>
                <p>${discount.description}</p>
                <p class="status">${isUsed ? 'Использована' : (discount.available ? 'Доступна' : 'Недоступна')}</p>
                ${(!isUsed && discount.available) ? `<button class="use-discount-btn" data-idx="${idx}" ${isActive ? 'disabled' : ''}>${isActive ? 'Использовано' : 'Использовать'}</button>` : ''}
            </div>
        `;
    });

    discountsList.innerHTML = discountsHTML;

    // Добавляем обработчик для кнопок 'Использовать'
    document.querySelectorAll('.use-discount-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            localStorage.setItem('activeDiscount', JSON.stringify(discounts[idx]));
            // Делаем все кнопки снова активными
            document.querySelectorAll('.use-discount-btn').forEach(b => {
                b.disabled = false;
                b.textContent = 'Использовать';
            });
            // Делаем текущую неактивной
            this.disabled = true;
            this.textContent = 'Использовано';
            alert('Скидка применена! Теперь она будет учтена в корзине.');
        });
    });
} 