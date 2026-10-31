// ===== Plans ka data =====
const plans = [
  { id: 1, name: "Monthly Gym", type: "gym", price: 999, months: 1, tag: "" },
  { id: 2, name: "Quarterly Gym", type: "gym", price: 2499, months: 3, tag: "Popular" },
  { id: 3, name: "Yearly Gym", type: "gym", price: 7999, months: 12, tag: "Best Value" },
  { id: 4, name: "Yoga Morning", type: "yoga", price: 799, months: 1, tag: "" },
  { id: 5, name: "Zumba Dance", type: "cardio", price: 899, months: 1, tag: "New" },
  { id: 6, name: "Personal Trainer", type: "gym", price: 2999, months: 1, tag: "" },
  { id: 7, name: "CrossFit Pro", type: "cardio", price: 1499, months: 1, tag: "Hot" },
  { id: 8, name: "Couple Yearly", type: "gym", price: 13999, months: 12, tag: "Offer" },
];

const planList = document.getElementById("planList");

function showPlans(list) {
  if (list.length === 0) {
    planList.innerHTML = '<p class="empty">Koi plan nahi mila 😕</p>';
    return;
  }
  planList.innerHTML = list.map(p => `
    <div class="card plan">
      ${p.tag ? `<span class="badge">${p.tag}</span>` : ""}
      <h3>${p.name}</h3>
      <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
      <p>${p.months} month • ${p.type}</p>
      <button class="btn add" data-id="${p.id}">Add to Cart</button>
    </div>`).join("");
}
showPlans(plans);

// ===== Filter + Search =====
let currentType = "all";
const search = document.getElementById("search");

function applyFilters() {
  const text = search.value.toLowerCase();
  const result = plans.filter(p => {
    return (currentType === "all" || p.type === currentType) &&
      p.name.toLowerCase().includes(text);
  });
  const sort = document.getElementById("sort").value;
  if (sort === "low") result.sort((a, b) => a.price - b.price);
  if (sort === "high") result.sort((a, b) => b.price - a.price);
  showPlans(result);
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    currentType = btn.dataset.type;
    applyFilters();
  });
});
search.addEventListener("input", applyFilters);
document.getElementById("sort").addEventListener("change", applyFilters);

// ===== Cart =====
function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log("Preview mein save nahi hua");
  }
}

let cart = load("cart") || [];
const count = document.getElementById("count");
count.textContent = cart.length;

planList.addEventListener("click", e => {
  if (!e.target.classList.contains("add")) return;
  const id = Number(e.target.dataset.id);
  if (!cart.includes(id)) {
    cart.push(id);
    save("cart", cart);
    count.textContent = cart.length;
  }
  e.target.textContent = "Added ✅";
});

// ===== Cart popup =====
const modal = document.getElementById("modal");

function renderCart() {
  const items = cart.map(id => plans.find(p => p.id === id));
  document.getElementById("cartItems").innerHTML = items
    .map(p => `<li>${p.name} <b>₹${p.price}</b> <button class="remove" data-id="${p.id}">✕</button></li>`)
    .join("") || "<li>Cart khali hai 🛒</li>";
  const total = items.reduce((sum, p) => sum + p.price, 0);
  document.getElementById("total").textContent = total.toLocaleString("en-IN");
}

document.getElementById("cartBtn").addEventListener("click", () => {
  renderCart();
  modal.classList.add("show");
});

document.getElementById("closeBtn").addEventListener("click", () => {
  modal.classList.remove("show");
});

// ===== BMI Calculator =====
document.getElementById("bmiBtn").addEventListener("click", () => {
  const weight = Number(document.getElementById("weight").value);
  const feet = Number(document.getElementById("feet").value);
  const inch = Number(document.getElementById("inch").value);
  const meters = (feet * 12 + inch) * 0.0254;
  const bmi = weight / (meters * meters);
  const result = document.getElementById("bmiResult");

  if (!weight || !feet) {
    result.textContent = "Weight aur height dono daalo 🙏";
    result.style.color = "red";
    return;
  }
  let status = "Normal 💪";
  let color = "green";
  if (bmi < 18.5) { status = "Underweight"; color = "orange"; }
  else if (bmi >= 25) { status = "Overweight"; color = "red"; }
  result.textContent = `Aapka BMI: ${bmi.toFixed(1)} (${status})`;
  result.style.color = color;
});

// ===== Join form validation =====
const form = document.getElementById("joinForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const plan = document.getElementById("plan").value;

  if (name.length < 3) return showMsg("Naam kam se kam 3 letter ka ho", "red");
  if (!/^[6-9]\d{9}$/.test(phone)) return showMsg("Sahi 10 digit mobile number daalo", "red");
  if (plan === "") return showMsg("Koi ek plan chuno", "red");

  showMsg(`Shukriya ${name}! Free trial book ho gaya 🎉`, "green");
  form.reset();
});

function showMsg(text, color) {
  msg.textContent = text;
  msg.style.color = color;
}

// ===== Dark mode =====
const themeBtn = document.getElementById("themeBtn");
if (load("theme") === "dark") document.body.classList.add("dark");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  save("theme", isDark ? "dark" : "light");
});

// ===== Mobile menu =====
const nav = document.getElementById("nav");
document.getElementById("menuBtn").addEventListener("click", () => {
  nav.classList.toggle("open");
});
nav.addEventListener("click", () => nav.classList.remove("open"));

document.getElementById("cartItems").addEventListener("click", e => {
  if (!e.target.classList.contains("remove")) return;
  const id = Number(e.target.dataset.id);
  cart = cart.filter(x => x !== id);
  save("cart", cart);
  count.textContent = cart.length;
  renderCart();
});

// ===== Back to top =====
const topBtn = document.getElementById("topBtn");
window.addEventListener("scroll", () => {
  topBtn.classList.toggle("show", window.scrollY > 400);
});
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
