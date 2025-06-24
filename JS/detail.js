document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart sync
    loadCartCount();
    
    // Initialize product functionality
    initProductOptions();
    initTabs();
    initProductActions();
    
    // Sync cart count every 2 seconds
    setInterval(loadCartCount, 2000);
    
    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'cartCount' || e.key === 'cart' || e.key === 'amezaCart') {
            loadCartCount();
        }
    });
});

/**
 * Go back to previous page
 */
function goBack() {
    try {
        // Try to go back in history
        if (document.referrer && document.referrer.includes(window.location.hostname)) {
            window.history.back();
        } else {
            // If no referrer or external referrer, go to shop page
            window.location.href = 'shop.html';
        }
    } catch (error) {
        console.error('Error navigating back:', error);
        window.location.href = 'shop.html';
    }
}

/**
 * Load cart count from localStorage - IMPROVED VERSION
 */
function loadCartCount() {
    try {
        let cartCount = 0;
        let cart = [];
        
        // Priority order: amezaCart -> cart -> cartCount
        const amezaCartData = localStorage.getItem('amezaCart');
        const cartData = localStorage.getItem('cart');
        const cartCountData = localStorage.getItem('cartCount');
        
        if (amezaCartData) {
            try {
                cart = JSON.parse(amezaCartData);
                if (Array.isArray(cart)) {
                    // Calculate total quantity from all items
                    cartCount = cart.reduce((total, item) => {
                        return total + (parseInt(item.quantity) || 1);
                    }, 0);
                }
            } catch (e) {
                console.log('Error parsing amezaCart:', e);
            }
        } else if (cartData) {
            try {
                cart = JSON.parse(cartData);
                if (Array.isArray(cart)) {
                    cartCount = cart.reduce((total, item) => {
                        return total + (parseInt(item.quantity) || 1);
                    }, 0);
                }
            } catch (e) {
                console.log('Error parsing cart:', e);
            }
        } else if (cartCountData && !isNaN(parseInt(cartCountData))) {
            cartCount = parseInt(cartCountData);
        }
        
        // Update cart badges
        updateCartBadges(cartCount);
        
        // Sync all storage keys to maintain consistency
        if (cartCount > 0) {
            localStorage.setItem('cartCount', cartCount.toString());
            if (cart.length > 0) {
                localStorage.setItem('amezaCart', JSON.stringify(cart));
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        }
        
        console.log('Cart count loaded:', cartCount);
        
    } catch (error) {
        console.error('Error loading cart count:', error);
        updateCartBadges(0);
    }
}

/**
 * Update cart badges
 */
function updateCartBadges(count) {
    const desktopBadge = document.getElementById('desktop-cart-count');
    const mobileBadge = document.getElementById('mobile-cart-count');
    
    if (desktopBadge) {
        desktopBadge.textContent = count.toString();
        desktopBadge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    if (mobileBadge) {
        mobileBadge.textContent = count.toString();
        mobileBadge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    // Also update any other cart count elements
    const allCartCounts = document.querySelectorAll('.cart-count, [id*="cart-count"]');
    allCartCounts.forEach(element => {
        if (element.id !== 'desktop-cart-count' && element.id !== 'mobile-cart-count') {
            element.textContent = count.toString();
            element.style.display = count > 0 ? 'flex' : 'none';
        }
    });
}

/**
 * Initialize product options
 */
function initProductOptions() {
    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorText = document.getElementById('selected-color-text');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            if (selectedColorText) {
                selectedColorText.textContent = this.dataset.color;
            }
        });
    });
    
    // Size options
    const sizeOptions = document.querySelectorAll('.size-option');
    const selectedSizeText = document.getElementById('selected-size-text');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            if (selectedSizeText) {
                selectedSizeText.textContent = this.dataset.size;
            }
        });
    });
    
    // Quantity selector
    const quantityInput = document.getElementById('quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    if (minusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
    }
    
    if (plusBtn && quantityInput) {
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
    }
    
    // Thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
            const newSrc = this.querySelector('img').src;
            if (mainImage) {
                mainImage.src = newSrc;
            }
        });
    });
}

/**
 * Initialize tabs
 */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/**
 * Initialize product actions
 */
function initProductActions() {
    // Mobile cart button
    const mobileCartBtn = document.querySelector('.mobile-action-btn.cart-btn');
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', function() {
            addToCart();
        });
    }
    
    // Mobile buy button
    const mobileBuyBtn = document.querySelector('.mobile-action-btn.buy-btn');
    if (mobileBuyBtn) {
        mobileBuyBtn.addEventListener('click', function() {
            buyNow();
        });
    }
    
    // Desktop add to cart button
    const desktopCartBtn = document.querySelector('.add-to-cart-btn');
    if (desktopCartBtn) {
        desktopCartBtn.addEventListener('click', function() {
            addToCart();
        });
    }
    
    // Desktop buy now button
    const desktopBuyBtn = document.querySelector('.buy-now-btn');
    if (desktopBuyBtn) {
        desktopBuyBtn.addEventListener('click', function() {
            buyNow();
        });
    }
}

/**
 * Add to cart functionality - IMPROVED VERSION
 */
function addToCart() {
    try {
        const productTitle = document.getElementById('product-title')?.textContent || 'Product';
        const productPrice = document.getElementById('product-price')?.textContent || 'Rp 0';
        const selectedColor = document.getElementById('selected-color-text')?.textContent || 'Default';
        const selectedSize = document.getElementById('selected-size-text')?.textContent || 'M';
        const quantity = document.getElementById('quantity-input') ? 
            parseInt(document.getElementById('quantity-input').value) : 1;
        const mainImage = document.getElementById('main-product-image');
        
        const product = {
            id: Date.now() + Math.random(), // Unique ID
            title: productTitle,
            price: productPrice,
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            image: mainImage ? mainImage.src : '/placeholder.svg?height=300&width=300',
            addedAt: new Date().toISOString()
        };
        
        // Get existing cart
        let cart = [];
        try {
            const existingCart = localStorage.getItem('amezaCart');
            if (existingCart) {
                cart = JSON.parse(existingCart);
                if (!Array.isArray(cart)) {
                    cart = [];
                }
            }
        } catch (e) {
            console.log('Error parsing existing cart, starting fresh');
            cart = [];
        }
        
        // Check if same product with same options already exists
        const existingProductIndex = cart.findIndex(item => 
            item.title === product.title && 
            item.color === product.color && 
            item.size === product.size
        );
        
        if (existingProductIndex > -1) {
            // Update quantity of existing product
            cart[existingProductIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        // Calculate total quantity
        const totalQuantity = cart.reduce((total, item) => {
            return total + parseInt(item.quantity);
        }, 0);
        
        // Save to localStorage with all keys for compatibility
        localStorage.setItem('amezaCart', JSON.stringify(cart));
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('cartCount', totalQuantity.toString());
        
        // Update cart count display immediately
        updateCartBadges(totalQuantity);
        
        // Show success message
        showNotification(`${product.title} berhasil ditambahkan ke keranjang! (${quantity} item)`);
        
        console.log('Product added to cart:', product);
        console.log('Total cart items:', totalQuantity);
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Terjadi kesalahan saat menambahkan ke keranjang');
    }
}

/**
 * Buy now functionality
 */
function buyNow() {
    addToCart();
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 500);
}

/**
 * Show notification - IMPROVED VERSION
 */
function showNotification(message, type = 'success') {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    
    const bgColor = type === 'success' ? '#28a745' : '#dc3545';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        font-size: 0.9rem;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    notification.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
    }, 3000);
}

/**
 * Clear cart function (for testing)
 */
function clearCart() {
    localStorage.removeItem('amezaCart');
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    updateCartBadges(0);
    showNotification('Keranjang berhasil dikosongkan');
}

// Make functions available globally
window.goBack = goBack;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.clearCart = clearCart;