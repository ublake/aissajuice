// Initialize EmailJS with your user ID from EmailJS
emailjs.init("TyIHI-dQIjkrCeXsc"); // Replace with your EmailJS user ID

// Mapping from product names to image sources
const productImages = {
  'Hibiscus Blend': 'images/hibiscus.png',
  'Ginger Blend': 'images/ginger.png',
  'Baobab Juice': 'images/baobab.png',
  'Tamarind Blend': 'images/tamarind.png'
};

let cart = [];

function addToCart(event, product, btn) {
  event.stopPropagation();

  // Animate the plus button
  btn.classList.add("animate");
  setTimeout(() => {
    btn.classList.remove("animate");
  }, 300);

  // Check if product is already in cart; if so, increase quantity
  const existing = cart.find(item => item.product === product);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ product, quantity: 1, image: productImages[product] });
  }
  updateCartCount();
  alert(`${product} added to cart`);
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').innerText = count;
}

function showCart() {
  updateOrderSummary();
  document.getElementById('cartModal').style.display = 'block';
}

function hideCart() {
  document.getElementById('cartModal').style.display = 'none';
}

function updateOrderSummary() {
  const summaryDiv = document.getElementById('orderSummary');
  summaryDiv.innerHTML = ""; // Clear previous summary

  if (cart.length === 0) {
    summaryDiv.innerText = "Your cart is empty.";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    // Product Image
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.product;
    img.className = "cart-item-img";
    itemDiv.appendChild(img);

    // Info Container
    const infoDiv = document.createElement("div");
    infoDiv.className = "cart-item-info";

    const nameSpan = document.createElement("span");
    nameSpan.className = "cart-item-name";
    nameSpan.innerText = item.product;
    infoDiv.appendChild(nameSpan);

    // Quantity Controls
    const quantityDiv = document.createElement("div");
    quantityDiv.className = "cart-item-quantity";

    const minusBtn = document.createElement("button");
    minusBtn.innerText = "-";
    minusBtn.onclick = function() { decrementQuantity(index); };
    quantityDiv.appendChild(minusBtn);

    const qtySpan = document.createElement("span");
    qtySpan.innerText = item.quantity;
    quantityDiv.appendChild(qtySpan);

    const plusBtn = document.createElement("button");
    plusBtn.innerText = "+";
    plusBtn.onclick = function() { incrementQuantity(index); };
    quantityDiv.appendChild(plusBtn);

    infoDiv.appendChild(quantityDiv);
    itemDiv.appendChild(infoDiv);

    summaryDiv.appendChild(itemDiv);
  });
}

function incrementQuantity(index) {
  cart[index].quantity++;
  updateCartCount();
  updateOrderSummary();
}

function decrementQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCartCount();
  updateOrderSummary();
}

function sendEmail(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.name.value;
  const phone = form.phone.value;
  const email = form.email.value;
  const additionalInfo = form.specialInstructions.value; // additional info field

  const orderText = cart.length 
    ? cart.map(item => `${item.product} - Quantity: ${item.quantity}`).join("\n")
    : "No items in cart";

  document.getElementById('orderDetails').value = orderText;

  const templateParams = {
    name,
    phone,
    email,
    orderDetails: orderText,
    specialInstructions: additionalInfo
  };

  emailjs.send("service_ift20eg", "template_qbqblbq", templateParams)//"template_qbqblbq", templateParams)
    .then(response => {
      alert("Order submitted successfully!");
      form.reset();
      cart = [];
      updateCartCount();
      hideCart();
    }, error => {
      console.error(error);
      alert("Failed to send order.");
    });
}

window.onclick = function(event) {
  const modal = document.getElementById('cartModal');
  if (event.target == modal) {
    hideCart();
  }
};