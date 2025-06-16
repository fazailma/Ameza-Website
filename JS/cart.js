document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  const mobileMenuContainer = document.querySelector('.mobile-menu-container');
  
  if (mobileMenuBtn && mobileMenuContainer) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenuContainer.classList.toggle('active');
    });
  }
  
  // Load cart items from localStorage
  function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('amezaCart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
      cartCount.textContent = cart.length.toString();
    }
    
    // If cart is empty, show empty cart message
    if (cart.length === 0 && cartItemsContainer) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">
            <i class="las la-shopping-cart"></i>
          </div>
          <h3>Keranjang Belanja Anda Kosong</h3>
          <p>Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p>
          <a href="shop.html" class="shop-now-btn">Belanja Sekarang</a>
        </div>
      `;
      
      if (cartSummary) {
        cartSummary.style.display = 'none';
      }
      
      return;
    }
    
    // If cart has items, update the UI
    updateCartUI(cart);
  }
  
  // Update cart UI with items
  function updateCartUI(cart) {
    const cartItemsContainer = document.querySelector('.cart-items h2').nextElementSibling;
    const subtotalElement = document.querySelector('.summary-item:first-child span:last-child');
    const totalElement = document.querySelector('.summary-item.total span:last-child');
    
    if (!cartItemsContainer || !subtotalElement || !totalElement) return;
    
    // Clear existing items
    while (cartItemsContainer.nextElementSibling && cartItemsContainer.nextElementSibling.classList.contains('cart-item')) {
      cartItemsContainer.nextElementSibling.remove();
    }
    
    let subtotal = 0;
    
    // Add cart items to UI
    cart.forEach((item, index) => {
      const itemPrice = parseInt(item.price.replace(/\D/g, ''));
      subtotal += itemPrice * item.quantity;
      
      const cartItemElement = document.createElement('div');
      cartItemElement.classList.add('cart-item');
      cartItemElement.setAttribute('data-index', index);
      
      cartItemElement.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="item-category">Kategori: ${item.category || 'Umum'}</p>
          <p class="item-size">Ukuran: ${item.size || 'Standard'}</p>
          <p class="item-color">Warna: ${item.color || 'Default'}</p>
        </div>
        <div class="item-quantity">
          <button class="quantity-btn minus"><i class="las la-minus"></i></button>
          <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input">
          <button class="quantity-btn plus"><i class="las la-plus"></i></button>
        </div>
        <div class="item-price">${item.price}</div>
        <div class="item-remove">
          <button class="remove-btn"><i class="las la-trash"></i></button>
        </div>
      `;
      
      cartItemsContainer.parentNode.insertBefore(cartItemElement, document.querySelector('.cart-actions'));
    });
    
    // Update subtotal and total
    const shipping = 20000; // Rp 20.000 for shipping
    const discount = 0; // No discount by default
    
    subtotalElement.textContent = formatPrice(subtotal);
    totalElement.textContent = formatPrice(subtotal + shipping - discount);
    
    // Add event listeners to quantity buttons and remove buttons
    addCartItemEventListeners();
  }
  
  // Add event listeners to cart item buttons
  function addCartItemEventListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
      button.addEventListener('click', function() {
        const input = this.nextElementSibling;
        const currentValue = parseInt(input.value);
        if (currentValue > 1) {
          input.value = currentValue - 1;
          updateItemQuantity(this.closest('.cart-item'), currentValue - 1);
        }
      });
    });
    
    // Quantity plus buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
      button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const currentValue = parseInt(input.value);
        if (currentValue < 10) {
          input.value = currentValue + 1;
          updateItemQuantity(this.closest('.cart-item'), currentValue + 1);
        }
      });
    });
    
    // Quantity input change
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
          value = 1;
          this.value = 1;
        } else if (value > 10) {
          value = 10;
          this.value = 10;
        }
        updateItemQuantity(this.closest('.cart-item'), value);
      });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', function() {
        const cartItem = this.closest('.cart-item');
        const index = parseInt(cartItem.getAttribute('data-index'));
        removeCartItem(index);
      });
    });
  }
  
  // Update item quantity in cart
  function updateItemQuantity(cartItem, quantity) {
    const index = parseInt(cartItem.getAttribute('data-index'));
    const cart = JSON.parse(localStorage.getItem('amezaCart')) || [];
    
    if (index >= 0 && index < cart.length) {
      cart[index].quantity = quantity;
      localStorage.setItem('amezaCart', JSON.stringify(cart));
      
      // Update price display
      const itemPrice = parseInt(cart[index].price.replace(/\D/g, ''));
      cartItem.querySelector('.item-price').textContent = formatPrice(itemPrice * quantity);
      
      // Update subtotal and total
      updateCartTotals();
    }
  }
  
  // Remove item from cart
  function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem('amezaCart')) || [];
    
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      localStorage.setItem('amezaCart', JSON.stringify(cart));
      
      // Reload cart items
      loadCartItems();
    }
  }
  
  // Update cart totals
  function updateCartTotals() {
    const cart = JSON.parse(localStorage.getItem('amezaCart')) || [];
    const subtotalElement = document.querySelector('.summary-item:first-child span:last-child');
    const totalElement = document.querySelector('.summary-item.total span:last-child');
    
    if (!subtotalElement || !totalElement) return;
    
    let subtotal = 0;
    
    cart.forEach(item => {
      const itemPrice = parseInt(item.price.replace(/\D/g, ''));
      subtotal += itemPrice * item.quantity;
    });
    
    const shipping = 20000; // Rp 20.000 for shipping
    const discount = 0; // No discount by default
    
    subtotalElement.textContent = formatPrice(subtotal);
    totalElement.textContent = formatPrice(subtotal + shipping - discount);
  }
  
  // Format price to Rupiah
  function formatPrice(price) {
    return `Rp ${price.toLocaleString('id-ID')}`;
  }
  
  // Update cart button
  const updateCartBtn = document.querySelector('.update-cart');
  if (updateCartBtn) {
    updateCartBtn.addEventListener('click', function() {
      // Reload cart items
      loadCartItems();
      alert('Keranjang berhasil diperbarui');
    });
  }
  
  // Apply coupon button
  const applyCouponBtn = document.querySelector('.apply-coupon');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', function() {
      const couponInput = document.querySelector('.coupon-input');
      if (!couponInput) return;
      
      const couponCode = couponInput.value.trim();
      if (!couponCode) {
        alert('Silakan masukkan kode kupon');
        return;
      }
      
      // Check if coupon is valid (dummy implementation)
      if (couponCode.toUpperCase() === 'DISKON10') {
        // Apply 10% discount
        const cart = JSON.parse(localStorage.getItem('amezaCart')) || [];
        let subtotal = 0;
        
        cart.forEach(item => {
          const itemPrice = parseInt(item.price.replace(/\D/g, ''));
          subtotal += itemPrice * item.quantity;
        });
        
        const discount = Math.round(subtotal * 0.1); // 10% discount
        
        // Update discount display
        const discountElement = document.querySelector('.summary-item:nth-child(2) span:last-child');
        const totalElement = document.querySelector('.summary-item.total span:last-child');
        
        if (discountElement && totalElement) {
          discountElement.textContent = `- ${formatPrice(discount)}`;
          
          const shipping = 20000; // Rp 20.000 for shipping
          totalElement.textContent = formatPrice(subtotal + shipping - discount);
        }
        
        alert('Kupon berhasil diterapkan! Anda mendapatkan diskon 10%.');
      } else {
        alert('Kode kupon tidak valid');
      }
    });
  }
  
  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      // Redirect to checkout page
      window.location.href = 'checkout.html';
    });
  }
  
  // Initialize
  loadCartItems();
});