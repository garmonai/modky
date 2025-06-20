// Функционал счётчика посетителей
const COUNTER_KEY = 'site_visitors';

function incrementVisitorCount() {
    let count = parseInt(localStorage.getItem(COUNTER_KEY)) || 0;
    count++;
    localStorage.setItem(COUNTER_KEY, count);
    return count;
}

function updateVisitorCounter() {
    const counterElement = document.getElementById('visitor-count');
    if (!counterElement) return;

    const count = incrementVisitorCount();
    
    // Анимированное обновление счётчика
    const duration = 2000; // 2 секунды
    const start = parseInt(counterElement.textContent) || 0;
    const end = count;
    const range = end - start;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (range * progress));
        counterElement.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Обновляем счётчик при загрузке страницы
document.addEventListener('DOMContentLoaded', updateVisitorCounter);

// Проверяем, является ли это новой сессией
if (!sessionStorage.getItem('session_started')) {
    sessionStorage.setItem('session_started', 'true');
    // Увеличиваем счётчик только для новых сессий
    updateVisitorCounter();
} 