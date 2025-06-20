document.addEventListener('DOMContentLoaded', function() {
    loadBonusInfo();
});

function loadBonusInfo() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const bonusAmount = userData.bonusAmount || 0;
    const nextLevel = 1000; // Следующий уровень бонусов
    const progress = (bonusAmount / nextLevel) * 100;

    document.getElementById('bonusAmount').textContent = bonusAmount;
    if (bonusAmount >= nextLevel) {
        document.getElementById('nextLevel').parentElement.innerHTML = 'Максимальный уровень';
    } else {
        document.getElementById('nextLevel').textContent = nextLevel;
    }
    document.getElementById('bonusProgress').style.width = `${Math.min(progress, 100)}%`;
} 