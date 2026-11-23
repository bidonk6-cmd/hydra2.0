const PRODUCTS = [
  { id: 1,  title: "Героин",   cat: "опиоиды", price: 0.06215,  old: 119, rating: 4.7, reviews: 1280, seller: "SoundLab",  emoji: "🎧", g: ["#2a2a2a", "#0e0e0e"] },
  { id: 2,  title: "Дезоморфин",           cat: "опиоиды", price: 0.11501, old: 0,   rating: 4.5, reviews: 860,  seller: "TechHouse", emoji: "⌚", g: ["#303030", "#101010"] },
  { id: 3,  title: "фентанил",   cat: "опиоиды", price: 0.09172, old: 130, rating: 4.8, reviews: 540,  seller: "KeyForge",  emoji: "⌨️", g: ["#262626", "#0a0a0a"] },
  { id: 4,  title: "Метадон ", cat: "опиоиды", price: 0.06095,  old: 0,   rating: 4.4, reviews: 2100, seller: "SoundLab",  emoji: "🔊", g: ["#2c2c2c", "#111"] },
  { id: 5,  title: "Сплиф Gorilla",         cat: "каннабис",      price: 0.06215,  old: 75,  rating: 4.6, reviews: 970,  seller: "Dark Wear", emoji: "🧥", g: ["#222", "#080808"] },
  { id: 6,  title: "Самокрутки Gorilla",          cat: "каннабис",      price: 0.07144,  old: 0,   rating: 4.7, reviews: 410,  seller: "Dark Wear", emoji: "🎒", g: ["#2e2e2e", "#0d0d0d"] },
  { id: 7,  title: "Шишки Gorilla",        cat: "каннабис",      price: 0.10107, old: 150, rating: 4.5, reviews: 1500, seller: "Runline",   emoji: "👟", g: ["#292929", "#0b0b0b"] },
  { id: 8,  title: "Гашиш",      cat: "каннабис",      price: 0.07144,  old: 0,   rating: 4.2, reviews: 320,  seller: "Optica",    emoji: "🕶️", g: ["#333", "#121212"] },
  { id: 9,  title: "Псилоцибиновые грибы (Psilocybe)",          cat: "психоделики",         price: 52,  old: 64,  rating: 4.6, reviews: 280,  seller: "HomeForm",  emoji: "💡", g: ["#2b2b2b", "#0c0c0c"] },
  { id: 10, title: "Метамфетамин (blue)",           cat: "психоделики",         price: 0.08243, old: 260, rating: 4.8, reviews: 730,  seller: "HomeForm",  emoji: "☕", g: ["#272727", "#090909"] },
  { id: 11, title: "Псилоцибиновые грибы(Stropharia)",     cat: "психоделики",         price: 0.07721,  old: 0,   rating: 4.3, reviews: 640,  seller: "Clay&Co",   emoji: "🍵", g: ["#313131", "#101010"] },
  { id: 12, title: "LSD smile",    cat: "галлюциногены",       price: 0.06095, old: 0,   rating: 4.7, reviews: 390,  seller: "IronGym",   emoji: "🏋️", g: ["#242424", "#080808"] },
  { id: 13, title: "Кетамин",       cat: "галлюциногены",       price: 0.07314,  old: 30,  rating: 4.4, reviews: 1100, seller: "IronGym",   emoji: "🧘", g: ["#2d2d2d", "#0e0e0e"] },
  { id: 14, title: "MDMA ecstasy",                 cat: "галлюциногены",       price: 0.06618,  old: 0,   rating: 4.6, reviews: 210,  seller: "Runline",   emoji: "🚴", g: ["#282828", "#0a0a0a"] }
];
const CATEGORIES = ["Все", ...new Set(PRODUCTS.map(p => p.cat))];

const state = { cat: "Все", q: "", sort: "popular", cart: {}, user: null };

const $ = id => document.getElementById(id);
const grid = $("grid"), chips = $("chips"), found = $("found");
const drawer = $("drawer"), overlay = $("overlay");
const money = n => "ETH " + n.toLocaleString("en-US");

const cartKey = () => "noir-cart:" + (state.user || "").toLowerCase();
function loadCart() {
  try { return JSON.parse(localStorage.getItem(cartKey())) || {}; }
  catch { return {}; }
}
function saveCart() {
  if (!state.user) return;
  try { localStorage.setItem(cartKey(), JSON.stringify(state.cart)); } catch {}
}

function visibleProducts() {
  const q = state.q.trim().toLowerCase();
  let list = PRODUCTS.filter(p =>
    (state.cat === "Все" || p.cat === state.cat) &&
    (!q || (p.title + " " + p.seller + " " + p.cat).toLowerCase().includes(q))
  );
  const sorts = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "rating": (a, b) => b.rating - a.rating,
    "popular": (a, b) => b.reviews - a.reviews
  };
  return list.sort(sorts[state.sort]);
}

function renderChips() {
  chips.innerHTML = CATEGORIES.map(c =>
    `<button class="chip ${c === state.cat ? "is-active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");
}

function renderGrid() {
  const list = visibleProducts();
  found.textContent = `Найдено товаров: ${list.length}`;
  if (!list.length) {
    grid.innerHTML = `<p class="empty">Ничего не найдено. Измените запрос или выберите другую категорию.</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="card__img" style="--g1:${p.g[0]};--g2:${p.g[1]}">${p.emoji}</div>
      <div class="card__body">
        <span class="card__seller">${p.seller}</span>
        <h3 class="card__title">${p.title}</h3>
        <span class="card__rating"><b>★ ${p.rating}</b> · ${p.reviews} отзывов</span>
        <div class="card__foot">
          <span class="price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</span>
          <button class="btn" data-add="${p.id}">В корзину</button>
        </div>
      </div>
    </article>`).join("");
}

function renderCart() {
  const items = Object.entries(state.cart).map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id == id), qty })).filter(i => i.p);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.p.price, 0);
  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);
  $("checkout").disabled = !count;
  $("cartItems").innerHTML = items.length ? items.map(({ p, qty }) => `
    <div class="line">
      <div class="line__img" style="--g1:${p.g[0]};--g2:${p.g[1]}">${p.emoji}</div>
      <div>
        <div class="line__title">${p.title}</div>
        <div class="line__price">${money(p.price)}</div>
        <div class="qty">
          <button data-dec="${p.id}" aria-label="Уменьшить">−</button>
          <span>${qty}</span>
          <button data-inc="${p.id}" aria-label="Увеличить">+</button>
        </div>
      </div>
      <button class="remove" data-del="${p.id}" aria-label="Удалить">✕</button>
    </div>`).join("") : `<p class="empty">Корзина пуста. Добавьте товары из каталога.</p>`;
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("is-visible"), 1800);
}

function setCart(id, qty) {
  if (qty <= 0) delete state.cart[id]; else state.cart[id] = qty;
  saveCart();
  renderCart();
}

function openCart(open) {
  drawer.classList.toggle("is-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  overlay.hidden = !open;
}

chips.addEventListener("click", e => {
  const b = e.target.closest("[data-cat]");
  if (!b) return;
  state.cat = b.dataset.cat;
  renderChips(); renderGrid();
});
$("search").addEventListener("input", e => { state.q = e.target.value; renderGrid(); });
$("sort").addEventListener("change", e => { state.sort = e.target.value; renderGrid(); });

grid.addEventListener("click", e => {
  const b = e.target.closest("[data-add]");
  if (!b) return;
  const id = +b.dataset.add;
  setCart(id, (state.cart[id] || 0) + 1);
  toast("Товар добавлен в корзину");
});

$("cartItems").addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  const d = t.dataset;
  if (d.inc) setCart(d.inc, state.cart[d.inc] + 1);
  if (d.dec) setCart(d.dec, state.cart[d.dec] - 1);
  if (d.del) setCart(d.del, 0);
});

$("cartBtn").addEventListener("click", () => openCart(true));
$("closeCart").addEventListener("click", () => openCart(false));
overlay.addEventListener("click", () => openCart(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") openCart(false); });

$("checkout").addEventListener("click", () => {
  state.cart = {};
  saveCart(); renderCart(); openCart(false);
  toast("Заказ оформлен. Спасибо за покупку!");
});

/* ---------- Аккаунт: имя + пароль ---------- */
const USERS_KEY = "noir-users";
const SESSION_KEY = "noir-session";
let authMode = "login";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch { return {}; }
}
function setUsers(u) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch {}
}
function getSession() {
  try { return sessionStorage.getItem(SESSION_KEY); } catch { return null; }
}
function setSession(name) {
  try {
    if (name) sessionStorage.setItem(SESSION_KEY, name);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

const toHex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
const newSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)));

async function hashPassword(pass, salt) {
  if (window.crypto && crypto.subtle) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
    return toHex(bits);
  }
  let h = 0; // запасной вариант для браузеров без SubtleCrypto
  for (const c of salt + pass) h = (h * 31 + c.charCodeAt(0)) | 0;
  return String(h);
}

function authError(msg) { $("authError").textContent = msg; }

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll(".auth__tab").forEach(t => t.classList.toggle("is-active", t.dataset.mode === mode));
  $("confirmRow").hidden = mode !== "register";
  $("authSubmit").textContent = mode === "register" ? "Создать аккаунт" : "Войти";
  $("authPass").autocomplete = mode === "register" ? "new-password" : "current-password";
  authError("");
}

function lock(locked) {
  $("auth").hidden = !locked;
  document.querySelectorAll(".header, main, .footer").forEach(el => { el.inert = locked; });
  document.body.style.overflow = locked ? "hidden" : "";
  if (locked) $("authName").focus();
}

function enterApp(name) {
  state.user = name;
  state.cart = loadCart();
  setSession(name);
  $("userName").textContent = name;
  $("authForm").reset();
  authError("");
  lock(false);
  renderCart();
}

function logout() {
  setSession(null);
  state.user = null;
  state.cart = {};
  openCart(false);
  setAuthMode("login");
  renderCart();
  lock(true);
}

document.querySelector(".auth__tabs").addEventListener("click", e => {
  const t = e.target.closest("[data-mode]");
  if (t) setAuthMode(t.dataset.mode);
});

$("authForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = $("authName").value.trim();
  const pass = $("authPass").value;
  const users = getUsers();
  const key = name.toLowerCase();

  if (authMode === "register") {
    if (name.length < 3 || name.length > 20) return authError("Имя должно быть от 3 до 20 символов.");
    if (pass.length < 6) return authError("Пароль должен быть не короче 6 символов.");
    if ($("authPass2").value !== pass) return authError("Пароли не совпадают.");
    if (users[key]) return authError("Это имя уже занято. Выберите другое или перейдите во вкладку «Вход».");
    const salt = newSalt();
    users[key] = { name, salt, hash: await hashPassword(pass, salt) };
    setUsers(users);
    enterApp(name);
  } else {
    if (!name || !pass) return authError("Введите имя и пароль.");
    const u = users[key];
    if (!u || (await hashPassword(pass, u.salt)) !== u.hash) return authError("Неверное имя или пароль.");
    enterApp(u.name);
  }
});

$("logout").addEventListener("click", logout);

renderChips(); renderGrid(); renderCart();
const savedUser = getSession() && getUsers()[getSession().toLowerCase()];
if (savedUser) enterApp(savedUser.name); else lock(true);
