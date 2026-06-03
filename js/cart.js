// cart.js - управление корзиной

// Глобальные переменные
let currentCart = [];

// Инициализация корзины
document.addEventListener("DOMContentLoaded", () => {
  loadCart();

  // Проверяем, на какой странице мы находимся
  if (document.querySelector(".cart-items")) {
    // Мы на странице корзины
    updateCartDisplay();
    setupCartPageHandlers();
  } else if (document.querySelector(".products-grid")) {
    // Мы на странице каталога - обновляем только счетчик
    updateCartCount();
  }
});

// Загрузка корзины из localStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    currentCart = JSON.parse(savedCart);
  } else {
    currentCart = [];
  }
}

// Сохранение корзины в localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(currentCart));
  updateCartCount();
}

// Обновление счетчика корзины (для всех страниц)
function updateCartCount() {
  const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);

  // Ищем ссылку на корзину в разных местах
  const cartLink = document.querySelector(".cart-link span");
  const cartCountElement = document.getElementById("cart-count");

  if (cartLink) {
    if (totalItems > 0) {
      cartLink.innerHTML = `Корзина (${totalItems})`;
    } else {
      cartLink.innerHTML = `Корзина`;
    }
  }

  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Обновление отображения корзины (только на странице корзины)
function updateCartDisplay() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyCartMessage = document.querySelector(".empty-cart-message");

  // Проверяем существование элементов
  if (!cartItemsContainer) {
    console.warn("Элемент .cart-items не найден на странице");
    return;
  }

  if (currentCart.length === 0) {
    // Корзина пуста
    if (emptyCartMessage) {
      emptyCartMessage.style.display = "block";
    }
    cartItemsContainer.innerHTML =
      '<div class="empty-cart">Ваша корзина пуста</div>';
    if (cartTotalElement) {
      cartTotalElement.textContent = "0 ₽";
    }
    return;
  }

  // Скрываем сообщение о пустой корзине
  if (emptyCartMessage) {
    emptyCartMessage.style.display = "none";
  }

  // Отображаем товары
  cartItemsContainer.innerHTML = "";
  let total = 0;

  currentCart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${escapeHtml(item.name)}</h4>
                <div class="cart-item-price">${formatPrice(item.price)} ₽</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
            <div class="cart-item-total">${formatPrice(itemTotal)} ₽</div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
    cartItemsContainer.appendChild(cartItem);
  });

  if (cartTotalElement) {
    cartTotalElement.textContent = formatPrice(total) + " ₽";
  }

  // Добавляем обработчики для кнопок в корзине
  attachCartItemHandlers();
}

// Форматирование цены
function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

// Защита от XSS
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Добавление товара в корзину
function addToCart(productId, productName, productPrice, quantity = 1) {
  const existingItem = currentCart.find((item) => item.id == productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    currentCart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: quantity,
    });
  }

  saveCart();

  // Если мы на странице корзины, обновляем отображение
  if (document.querySelector(".cart-items")) {
    updateCartDisplay();
  }

  showNotification(`Товар "${productName}" добавлен в корзину`, "success");
}

// Удаление товара из корзины
function removeFromCart(index) {
  if (index >= 0 && index < currentCart.length) {
    const removedItem = currentCart[index];
    currentCart.splice(index, 1);
    saveCart();

    if (document.querySelector(".cart-items")) {
      updateCartDisplay();
    }

    showNotification(`Товар "${removedItem.name}" удален из корзины`, "info");
  }
}

// Изменение количества товара
function changeQuantity(index, delta) {
  if (index >= 0 && index < currentCart.length) {
    const newQuantity = currentCart[index].quantity + delta;

    if (newQuantity <= 0) {
      removeFromCart(index);
    } else {
      currentCart[index].quantity = newQuantity;
      saveCart();

      if (document.querySelector(".cart-items")) {
        updateCartDisplay();
      }
    }
  }
}

// Очистка корзины
function clearCart() {
  if (confirm("Вы уверены, что хотите очистить корзину?")) {
    currentCart = [];
    saveCart();

    if (document.querySelector(".cart-items")) {
      updateCartDisplay();
    }

    showNotification("Корзина очищена", "info");
  }
}

// Показ уведомления
function showNotification(message, type = "success") {
  // Удаляем существующее уведомление
  const existingNotification = document.querySelector(".cart-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `cart-notification notification-${type}`;
  notification.innerHTML = `
        <i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i>
        <span>${message}</span>
    `;

  // Стили для уведомления
  Object.assign(notification.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: type === "success" ? "#4caf50" : "#2196f3",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: "9999",
    animation: "slideIn 0.3s ease",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Обработчики для кнопок корзины
function attachCartItemHandlers() {
  // Кнопки уменьшения количества
  document.querySelectorAll(".cart-item .minus").forEach((btn) => {
    btn.removeEventListener("click", handleMinusClick);
    btn.addEventListener("click", handleMinusClick);
  });

  // Кнопки увеличения количества
  document.querySelectorAll(".cart-item .plus").forEach((btn) => {
    btn.removeEventListener("click", handlePlusClick);
    btn.addEventListener("click", handlePlusClick);
  });

  // Кнопки удаления
  document.querySelectorAll(".cart-item .remove-item").forEach((btn) => {
    btn.removeEventListener("click", handleRemoveClick);
    btn.addEventListener("click", handleRemoveClick);
  });
}

function handleMinusClick(e) {
  const index = parseInt(e.currentTarget.getAttribute("data-index"));
  changeQuantity(index, -1);
}

function handlePlusClick(e) {
  const index = parseInt(e.currentTarget.getAttribute("data-index"));
  changeQuantity(index, 1);
}

function handleRemoveClick(e) {
  const index = parseInt(e.currentTarget.getAttribute("data-index"));
  removeFromCart(index);
}

// Настройка обработчиков на странице корзины
function setupCartPageHandlers() {
  // Кнопка очистки корзины
  const clearCartBtn = document.getElementById("clear-cart");
  if (clearCartBtn) {
    clearCartBtn.removeEventListener("click", () => clearCart());
    clearCartBtn.addEventListener("click", () => clearCart());
  }

  // Кнопка оформления заказа
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.removeEventListener("click", proceedToCheckout);
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }
}

// Переход к оформлению заказа
function proceedToCheckout() {
  if (currentCart.length === 0) {
    showNotification(
      "Корзина пуста. Добавьте товары для оформления заказа",
      "info",
    );
    return;
  }

  // Сохраняем корзину перед переходом
  saveCart();

  // Переходим на страницу оформления заказа
  window.location.href = "checkout.html";
}

// Получение данных корзины для отправки на сервер
function getCartForOrder() {
  return currentCart.map((item) => ({
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));
}

// Экспорт функций для использования в других скриптах
window.cartManager = {
  addToCart,
  removeFromCart,
  clearCart,
  getCart: () => currentCart,
  getCartForOrder,
  updateCartCount,
};

// Добавляем стили для анимаций, если их нет
function addAnimationStyles() {
  if (!document.querySelector("#cart-animation-styles")) {
    const style = document.createElement("style");
    style.id = "cart-animation-styles";
    style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .cart-notification {
                font-family: Arial, sans-serif;
                font-size: 14px;
                z-index: 10000;
            }
        `;
    document.head.appendChild(style);
  }
}

// Вызываем добавление стилей
addAnimationStyles();
