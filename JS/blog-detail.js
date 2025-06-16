document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart sync for desktop only
    loadCartCount();
    
    // Initialize share functionality
    initShareButtons();
    
    // Initialize comment form
    initCommentForm();
    
    // Initialize search (desktop only)
    initSearch();
    
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
 * Go back to previous page - FIXED
 */
function goBack() {
    // Check if there's a referrer and it's from the same domain
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        // Fallback to blog page
        window.location.href = 'blog.html';
    }
}

/**
 * Load cart count from localStorage (desktop only)
 */
function loadCartCount() {
    try {
        let cartCount = 0;
        
        // Check cartCount
        const storedCount = localStorage.getItem('cartCount');
        if (storedCount && !isNaN(parseInt(storedCount))) {
            cartCount = parseInt(storedCount);
        }
        
        // Check cart array
        const cartArray = localStorage.getItem('cart');
        if (cartArray) {
            try {
                const parsedCart = JSON.parse(cartArray);
                if (Array.isArray(parsedCart)) {
                    cartCount = Math.max(cartCount, parsedCart.length);
                }
            } catch (e) {
                console.log('Error parsing cart array');
            }
        }
        
        // Check amezaCart array
        const amezaCart = localStorage.getItem('amezaCart');
        if (amezaCart) {
            try {
                const parsedAmezaCart = JSON.parse(amezaCart);
                if (Array.isArray(parsedAmezaCart)) {
                    cartCount = Math.max(cartCount, parsedAmezaCart.length);
                }
            } catch (e) {
                console.log('Error parsing amezaCart array');
            }
        }
        
        // Update badges (desktop only)
        updateCartBadges(cartCount);
        
        // Keep localStorage in sync
        if (cartCount > 0) {
            localStorage.setItem('cartCount', cartCount.toString());
        }
        
    } catch (error) {
        console.error('Error loading cart count:', error);
        updateCartBadges(0);
    }
}

/**
 * Update cart badges (desktop only)
 */
function updateCartBadges(count) {
    const desktopBadge = document.getElementById('cart-count');
    
    if (desktopBadge) {
        desktopBadge.textContent = count.toString();
        desktopBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Initialize share buttons
 */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.social-share a');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const icon = this.querySelector('i');
            if (icon.classList.contains('la-facebook-f')) {
                shareToFacebook();
            } else if (icon.classList.contains('la-twitter')) {
                shareToTwitter();
            } else if (icon.classList.contains('la-whatsapp')) {
                shareToWhatsApp();
            } else if (icon.classList.contains('la-link')) {
                copyLink();
            }
        });
    });
}

/**
 * Share to Facebook
 */
function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`,
        'facebook-share',
        'width=600,height=400'
    );
}

/**
 * Share to Twitter
 */
function shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    window.open(
        `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        'twitter-share',
        'width=600,height=400'
    );
}

/**
 * Share to WhatsApp
 */
function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    window.open(
        `https://wa.me/?text=${title}%20${url}`,
        'whatsapp-share'
    );
}

/**
 * Copy link to clipboard
 */
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(function() {
        showNotification('Link berhasil disalin!');
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Link berhasil disalin!');
    });
}

/**
 * Show notification
 */
function showNotification(message) {
    // Create notification if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s;
            z-index: 1000;
            font-size: 0.9rem;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
    }, 3000);
}

/**
 * Initialize comment form
 */
function initCommentForm() {
    const commentForm = document.querySelector('.comment-form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value.trim();
            const email = document.getElementById('comment-email').value.trim();
            const message = document.getElementById('comment-message').value.trim();
            
            if (name && email && message) {
                showNotification('Komentar berhasil dikirim!');
                
                // Reset form
                this.reset();
            } else {
                showNotification('Mohon lengkapi semua field!');
            }
        });
    }
}

/**
 * Initialize search (desktop only)
 */
function initSearch() {
    const searchForm = document.querySelector('.search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchTerm = this.querySelector('input').value.trim();
            if (searchTerm) {
                // Redirect to blog page with search parameter
                window.location.href = `blog.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}

// Make functions available globally
window.goBack = goBack;
window.shareToFacebook = shareToFacebook;
window.shareToTwitter = shareToTwitter;
window.shareToWhatsApp = shareToWhatsApp;
window.copyLink = copyLink;