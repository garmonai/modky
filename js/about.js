// Анимация чисел в статистике
function animateNumbers() {
    const numbers = document.querySelectorAll('.number');
    
    numbers.forEach(number => {
        const target = parseInt(number.textContent);
        const suffix = number.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2 секунды
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            current = Math.floor(target * progress);
            number.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }

        requestAnimationFrame(updateNumber);
    });
}

// Анимация появления элементов при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.info-block, .team-member, .certificate');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Галерея изображений производства
function initializeGallery() {
    const images = document.querySelectorAll('.image-gallery img');
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            // Создаем модальное окно
            const modal = document.createElement('div');
            modal.className = 'modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            const modalImage = document.createElement('img');
            modalImage.src = img.src;
            
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '&times;';
            
            modalContent.appendChild(modalImage);
            modalContent.appendChild(closeButton);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Анимация появления
            setTimeout(() => {
                modal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
            
            // Обработчики закрытия
            const closeModal = () => {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => modal.remove(), 300);
            };
            
            closeButton.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        });
        
        // Добавляем эффект при наведении
        img.addEventListener('mouseover', () => {
            img.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('mouseout', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

// Анимация команды
function initializeTeam() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseover', () => {
            member.style.transform = 'translateY(-10px)';
            member.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
        
        member.addEventListener('mouseout', () => {
            member.style.transform = 'translateY(0)';
            member.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
}

// Анимация сертификатов
function initializeCertificates() {
    const certificates = document.querySelectorAll('.certificate');
    
    certificates.forEach(cert => {
        cert.addEventListener('mouseover', () => {
            cert.style.transform = 'rotate(5deg)';
        });
        
        cert.addEventListener('mouseout', () => {
            cert.style.transform = 'rotate(0)';
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем анимацию чисел только когда элемент появляется в поле зрения
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    });

    const stats = document.querySelector('.stats');
    if (stats) {
        observer.observe(stats);
    }

    // Инициализируем остальные функции
    initializeGallery();
    initializeTeam();
    initializeCertificates();
});

// Обработчик скролла
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll); 