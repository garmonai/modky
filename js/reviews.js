document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.querySelector('.reviews-container');

    // Загрузка сохраненных отзывов
    loadReviews();

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Получение данных формы
        const name = document.getElementById('name').value;
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const reviewText = document.getElementById('review').value;

        // Создание нового отзыва
        const review = {
            name: name,
            rating: rating,
            text: reviewText,
            date: new Date().toLocaleDateString('ru-RU'),
            avatar: 'pic/i.webp' // Используем единое изображение для всех отзывов
        };

        // Сохранение отзыва
        saveReview(review);

        // Добавление отзыва на страницу
        addReviewToPage(review);

        // Очистка формы
        reviewForm.reset();

        // Показываем сообщение об успехе
        alert('Спасибо за ваш отзыв!');
    });

    function addReviewToPage(review) {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        // Создание HTML для отзыва с обработкой ошибки загрузки изображения
        reviewCard.innerHTML = `
            <div class="review-header">
                <img src="${review.avatar}" alt="Аватар" class="review-avatar" onerror="this.src='pic/i.webp'">
                <div class="review-info">
                    <h3>${escapeHtml(review.name)}</h3>
                    <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    <span class="review-date">${review.date}</span>
                </div>
            </div>
            <p class="review-text">${escapeHtml(review.text)}</p>
        `;

        // Добавление отзыва в начало контейнера
        reviewsContainer.insertBefore(reviewCard, reviewsContainer.firstChild);
    }

    function saveReview(review) {
        // Получение существующих отзывов
        let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        
        // Добавление нового отзыва
        reviews.unshift(review);
        
        // Сохранение в localStorage
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    function loadReviews() {
        // Загрузка отзывов из localStorage
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        
        // Добавление каждого отзыва на страницу
        reviews.forEach(review => {
            // Убедимся, что у всех отзывов используется правильное изображение
            review.avatar = 'pic/i.webp';
            addReviewToPage(review);
        });
    }

    // Функция для безопасного отображения HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}); 