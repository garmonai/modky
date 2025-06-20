// Инициализация карты
ymaps.ready(initMap);

function initMap() {
    // Координаты центра карты (замените на реальные координаты вашего магазина)
    const mapCenter = [55.755819, 37.617644];
    
    // Создаем карту
    const map = new ymaps.Map('map', {
        center: mapCenter,
        zoom: 16,
        controls: ['zoomControl', 'fullscreenControl']
    });

    // Создаем метку
    const placemark = new ymaps.Placemark(mapCenter, {
        balloonContent: `
            <div class="map-balloon">
                <h3>ВкусноКухни</h3>
                <p>г. Москва, ул. Примерная, д. 1</p>
                <p>Телефон: +7 (XXX) XXX-XX-XX</p>
                <p>Email: info@vkusnokuhni.ru</p>
            </div>
        `
    }, {
        preset: 'islands#redDotIcon'
    });

    // Добавляем метку на карту
    map.geoObjects.add(placemark);

    // Запрещаем скролл карты до клика на ней
    map.behaviors.disable('scrollZoom');
    
    // Разрешаем скролл после клика
    map.events.add('click', function() {
        map.behaviors.enable('scrollZoom');
    });
}

// Обработка формы обратной связи
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Получаем данные формы
        const formData = new FormData(feedbackForm);
        const data = Object.fromEntries(formData.entries());

        // Анимация кнопки при отправке
        const submitButton = feedbackForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

        try {
            // Здесь должен быть код отправки данных на сервер
            // Имитация отправки данных
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Показываем уведомление об успешной отправке
            showNotification('Сообщение успешно отправлено!', 'success');
            
            // Очищаем форму
            feedbackForm.reset();
        } catch (error) {
            // Показываем уведомление об ошибке
            showNotification('Произошла ошибка при отправке. Попробуйте позже.', 'error');
        } finally {
            // Возвращаем кнопку в исходное состояние
            submitButton.disabled = false;
            submitButton.innerHTML = 'Отправить';
        }
    });
}

// Функция показа уведомлений
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);

    // Удаление уведомления
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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

// Анимация элементов при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.info-item, .contact-form');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll); 