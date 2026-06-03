const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "database.json");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Инициализация базы данных (JSON)
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      products: [
        {
          id: 1,
          name: 'Кухня "Хай-тек Премиум"',
          price: 185000,
          old_price: 220000,
          image: "pic/хай-тек.jfif",
          description:
            "Ультрасовременная кухня с глянцевыми фасадами и встроенной LED-подсветкой",
          material: "МДФ с глянцевой эмалью",
          size: "2500x600x850 мм",
          color: "Белый/Черный",
          is_new: true,
          is_hit: false,
          category: "modern",
          in_stock: true,
          features: ["Глянцевые фасады", "LED-подсветка", "Встроенная техника"],
          delivery: "14-21 день",
        },
        {
          id: 2,
          name: 'Кухня "Этно-Мотив"',
          price: 165000,
          old_price: 195000,
          image: "pic/Этно-монтив.jfif",
          description:
            "Яркая кухня в этническом стиле с использованием натуральных материалов",
          material: "Натуральное дерево",
          size: "2800x600x850 мм",
          color: "Венге/Беж",
          is_new: false,
          is_hit: true,
          category: "classic",
          in_stock: true,
          features: [
            "Натуральное дерево",
            "Этнические узоры",
            "Ручная роспись",
          ],
          delivery: "21-28 дней",
        },
        {
          id: 3,
          name: 'Кухня "Арт-Деко Люкс"',
          price: 245000,
          old_price: 290000,
          image: "pic/Арт-деко Люкс.jfif",
          description:
            "Роскошная кухня в стиле арт-деко с геометрическими узорами",
          material: "Шпон + Мрамор",
          size: "3000x600x850 мм",
          color: "Черный/Золотой",
          is_new: true,
          is_hit: true,
          category: "luxury",
          in_stock: true,
          features: [
            "Мраморные столешницы",
            "Золотая фурнитура",
            "Витражные элементы",
          ],
          delivery: "28-35 дней",
        },
        {
          id: 4,
          name: 'Кухня "Скандинавский Уют"',
          price: 155000,
          old_price: 180000,
          image: "pic/скандинавский уют.jfif",
          description: "Светлая и функциональная кухня в скандинавском стиле",
          material: "Массив сосны",
          size: "2400x600x850 мм",
          color: "Белый/Серый",
          is_new: false,
          is_hit: false,
          category: "scandi",
          in_stock: true,
          features: [
            "Светлое дерево",
            "Минималистичный дизайн",
            "Экологичные материалы",
          ],
          delivery: "14-21 день",
        },
        {
          id: 5,
          name: 'Кухня "Эклектика Модерн"',
          price: 195000,
          old_price: 230000,
          image: "pic/эклетика модерн.jfif",
          description:
            "Оригинальная кухня, сочетающая различные стили и материалы",
          material: "Комбинированный",
          size: "2600x600x850 мм",
          color: "Орех/Бежевый",
          is_new: true,
          is_hit: false,
          category: "modern",
          in_stock: true,
          features: ["Смешение стилей", "Яркие акценты", "Дизайнерская мебель"],
          delivery: "21-28 дней",
        },
        {
          id: 6,
          name: 'Кухня "Прованс"',
          price: 175000,
          old_price: 210000,
          image: "pic/прованс.jfif",
          description:
            "Уютная кухня в стиле прованс с элементами французского кантри",
          material: "Массив дуба",
          size: "2700x600x850 мм",
          color: "Лавандовый/Белый",
          is_new: false,
          is_hit: true,
          category: "classic",
          in_stock: true,
          features: ["Патина", "Фрезеровка", "Витражи"],
          delivery: "21-28 дней",
        },
        {
          id: 7,
          name: 'Кухня "Современная Классика"',
          price: 168000,
          old_price: 198000,
          image: "pic/Современная классика.jfif",
          description:
            "Современная кухня с чистыми линиями и продуманной эргономикой",
          material: "МДФ матовый",
          size: "2600x600x850 мм",
          color: "Серый/Белый",
          is_new: false,
          is_hit: false,
          category: "modern",
          in_stock: true,
          features: [
            "Матовые фасады",
            "Умная организация",
            "Встроенная техника",
          ],
          delivery: "14-21 день",
        },
        {
          id: 8,
          name: 'Кухня "Минималистичная"',
          price: 158000,
          old_price: 185000,
          image: "pic/минималистичная.jfif",
          description: "Минималистичная кухня с акцентом на функциональность",
          material: "ЛДСП",
          size: "2300x600x850 мм",
          color: "Белый матовый",
          is_new: false,
          is_hit: false,
          category: "modern",
          in_stock: true,
          features: ["Минимализм", "Функциональность", "Современный дизайн"],
          delivery: "21-28 дней",
        },
        {
          id: 9,
          name: 'Кухня "Кантри Шарм"',
          price: 145000,
          old_price: 170000,
          image: "pic/кантри шарм.webp",
          description:
            "Уютная кухня в деревенском стиле с элементами винтажного декора",
          material: "Массив сосны",
          size: "2500x600x850 мм",
          color: "Натуральный дуб",
          is_new: false,
          is_hit: true,
          category: "classic",
          in_stock: true,
          features: [
            "Массив дерева",
            "Плетеные корзины",
            "Винтажная фурнитура",
          ],
          delivery: "21-28 дней",
        },
      ],
      orders: [],
      cart: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log("Создан файл database.json с каталогом кухонь");
  }
}

// Вспомогательная функция чтения/записи
function readDB() {
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

initDatabase();

// ----- API -----

// GET /api/products – все товары
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// GET /api/products/:id – конкретный товар
app.get("/api/products/:id", (req, res) => {
  const db = readDB();
  const product = db.products.find((p) => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: "Товар не найден" });
  res.json(product);
});

// POST /api/orders – создание заказа
app.post("/api/orders", (req, res) => {
  const {
    items,
    user_name,
    user_phone,
    user_email,
    delivery_address,
    total_price,
  } = req.body;

  if (!items || !items.length || !user_name || !user_phone) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }

  const db = readDB();

  // Создаем новый заказ
  const newOrder = {
    id: db.orders.length + 1,
    user_name,
    user_phone,
    user_email: user_email || "",
    delivery_address: delivery_address || "",
    items: items,
    total_price: total_price,
    status: "новый",
    created_at: new Date().toISOString(),
  };

  db.orders.push(newOrder);
  writeDB(db);

  res.status(201).json({
    message: "Заказ успешно оформлен!",
    order_id: newOrder.id,
  });
});

// GET /api/orders/:phone – получение заказов по телефону
app.get("/api/orders/:phone", (req, res) => {
  const db = readDB();
  const orders = db.orders.filter((o) => o.user_phone == req.params.phone);
  res.json(orders);
});

// POST /api/cart – сохранение корзины (опционально)
app.post("/api/cart", (req, res) => {
  const { user_id, items } = req.body;
  const db = readDB();

  db.cart = {
    user_id: user_id || "anonymous",
    items: items,
    updated_at: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ message: "Корзина сохранена" });
});

// GET /api/cart/:user_id – получение корзины
app.get("/api/cart/:user_id", (req, res) => {
  const db = readDB();
  res.json(db.cart || { items: [] });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`API доступны по адресу:`);
  console.log(`  - GET  /api/products - список товаров`);
  console.log(`  - POST /api/orders - создание заказа`);
  console.log(`  - GET  /api/orders/:phone - заказы по телефону`);
});
