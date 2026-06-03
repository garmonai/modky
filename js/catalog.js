// catalog.js - скрипт для каталога модульных кухонь

document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.querySelector(".products-grid");
  let allProducts = [];

  // Загрузка товаров с сервера
  async function loadProducts() {
    try {
      // Показываем загрузку
      productsGrid.innerHTML = '<div class="loading">Загрузка товаров...</div>';

      const response = await fetch("http://localhost:3000/api/products");
      console.log(response)
      if (!response.ok) throw new Error("Ошибка загрузки");

      const products = await response.json();
      console.log(products)
      allProducts = products;

      if (products.length === 0) {
        productsGrid.innerHTML =
          '<div class="loading">Товары временно недоступны</div>';
        return;
      }

      renderProducts(products);
    } catch (error) {
      console.error(error);
      productsGrid.innerHTML =
        '<div class="loading">Не удалось загрузить каталог. Попробуйте позже.</div>';
    }
  }

  // Отображение товаров
  function renderProducts(products) {
    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      // Форматирование цены
      const formattedPrice = new Intl.NumberFormat("ru-RU").format(
        product.price,
      );

      productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image || "pic/default-kitchen.jpg"}" alt="${escapeHtml(product.name)}" loading="lazy">
                    ${product.is_new ? '<span class="badge new">Новинка</span>' : ""}
                    ${product.is_hit ? '<span class="badge hit">Хит</span>' : ""}
                </div>
                <div class="product-info">
                    <h3>${escapeHtml(product.name)}</h3>
                    <div class="product-description">${escapeHtml(product.description || "")}</div>
                    <div class="product-specs">
                        ${product.material ? `<span><i class="fas fa-cube"></i> ${escapeHtml(product.material)}</span>` : ""}
                        ${product.size ? `<span><i class="fas fa-ruler-combined"></i> ${escapeHtml(product.size)}</span>` : ""}
                        ${product.color ? `<span><i class="fas fa-palette"></i> ${escapeHtml(product.color)}</span>` : ""}
                    </div>
                    <div class="product-price">
                        <span class="price">${formattedPrice} ₽</span>
                        ${product.old_price ? `<span class="old-price">${new Intl.NumberFormat("ru-RU").format(product.old_price)} ₽</span>` : ""}
                    </div>
                    <button class="btn btn-add-to-cart" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
            `;

      productsGrid.appendChild(productCard);
    });

    // Добавляем обработчики для кнопок "В корзину"
    attachCartHandlers();
  }

  // Обработчики добавления в корзину
  function attachCartHandlers() {
    document.querySelectorAll(".btn-add-to-cart").forEach((btn) => {
      btn.removeEventListener("click", handleAddToCart);
      btn.addEventListener("click", handleAddToCart);
    });
  }

  function handleAddToCart(e) {
    const btn = e.currentTarget;
    const productId = btn.getAttribute("data-id");
    const productName = btn.getAttribute("data-name");
    const productPrice = parseInt(btn.getAttribute("data-price"));

    // Получаем текущую корзину
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Проверяем, есть ли уже такой товар
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
      });
    }

    // Сохраняем в localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Показываем уведомление
    showNotification(`Товар "${productName}" добавлен в корзину`, "success");

    // Обновляем счетчик корзины
    updateCartCount();

    // Анимация кнопки
    btn.classList.add("added");
    setTimeout(() => btn.classList.remove("added"), 500);
  }

  // Показ уведомления
  function showNotification(message, type = "success") {
    // Удаляем существующее уведомление
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            <span>${message}</span>
        `;
    notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === "success" ? "#4caf50" : "#f44336"};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Обновление счетчика корзины
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartLink = document.querySelector(".cart-link span");
    if (cartLink && totalItems > 0) {
      cartLink.innerHTML = `Корзина (${totalItems})`;
    } else if (cartLink) {
      cartLink.innerHTML = `Корзина`;
    }
  }

  // Фильтрация товаров
  function filterProducts() {
    const priceMin = parseInt(document.getElementById("price-min")?.value) || 0;
    const priceMax =
      parseInt(document.getElementById("price-max")?.value) || Infinity;
    const sortValue =
      document.getElementById("sort-select")?.value || "default";

    let filtered = [...allProducts];

    // Фильтр по цене
    filtered = filtered.filter(
      (product) => product.price >= priceMin && product.price <= priceMax,
    );

    // Сортировка
    switch (sortValue) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // По умолчанию - порядок с сервера
        break;
    }

    renderProducts(filtered);

    if (filtered.length === 0) {
      productsGrid.innerHTML = '<div class="loading">Товаров не найдено</div>';
    }
  }

  // Сброс фильтров
  function resetFilters() {
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");
    const sortSelect = document.getElementById("sort-select");

    if (priceMin) priceMin.value = "";
    if (priceMax) priceMax.value = "";
    if (sortSelect) sortSelect.value = "default";

    renderProducts(allProducts);
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

  // Инициализация обработчиков фильтров
  function initFilters() {
    const applyBtn = document.querySelector(".apply-filters");
    const resetBtn = document.querySelector(".reset-filters");
    const sortSelect = document.getElementById("sort-select");
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");

    if (applyBtn) applyBtn.addEventListener("click", filterProducts);
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);
    if (sortSelect) sortSelect.addEventListener("change", filterProducts);
    if (priceMin) priceMin.addEventListener("change", filterProducts);
    if (priceMax) priceMax.addEventListener("change", filterProducts);
  }

  // Добавляем стили для уведомлений
  function addNotificationStyles() {
    const style = document.createElement("style");
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
            .btn-add-to-cart.added {
                transform: scale(0.95);
                transition: transform 0.2s;
            }
            .product-card {
                transition: transform 0.3s, box-shadow 0.3s;
            }
            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            }
            .loading {
                text-align: center;
                padding: 40px;
                font-size: 18px;
                color: #666;
            }
        `;
    document.head.appendChild(style);
  }

  // Запуск
  addNotificationStyles();
  loadProducts();
  initFilters();
  updateCartCount();
});
