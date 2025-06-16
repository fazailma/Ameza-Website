document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality
    initBlogAnimations();
    initSearch();
    initMobileCategories();
    initCartSync();
    initMobileNavigation();
    
    // Load and sync cart count on page load
    loadCartCount();
    syncCartCount();
    
    // Listen for storage changes from other pages
    window.addEventListener('storage', handleStorageChange);
});

/**
 * Initialize cart synchronization
 */
function initCartSync() {
    // Sync cart count every 1 second to ensure consistency
    setInterval(syncCartCount, 1000);
    
    // Sync when page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            syncCartCount();
        }
    });
}

/**
 * Load cart count from localStorage
 */
function loadCartCount() {
    try {
        // Try to get from cartCount first (used by customize page)
        let cartCount = localStorage.getItem('cartCount');
        
        // If cartCount doesn't exist, try to get from cart array
        if (!cartCount || cartCount === '0') {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cartCount = cart.length.toString();
            
            // Update cartCount in localStorage for consistency
            localStorage.setItem('cartCount', cartCount);
        }
        
        // Also try amezaCart (if used by other pages)
        if (!cartCount || cartCount === '0') {
            const amezaCart = JSON.parse(localStorage.getItem('amezaCart') || '[]');
            if (amezaCart.length > 0) {
                cartCount = amezaCart.length.toString();
                localStorage.setItem('cartCount', cartCount);
            }
        }
        
        updateCartBadges(cartCount);
        
    } catch (error) {
        console.error('Error loading cart count:', error);
        updateCartBadges('0');
    }
}

/**
 * Sync cart count across all elements
 */
function syncCartCount() {
    try {
        // Get cart count from multiple possible sources
        let cartCount = '0';
        
        // Method 1: From cartCount localStorage
        const storedCount = localStorage.getItem('cartCount');
        if (storedCount && parseInt(storedCount) > 0) {
            cartCount = storedCount;
        }
        
        // Method 2: From cart array
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length > 0) {
            cartCount = cart.length.toString();
            localStorage.setItem('cartCount', cartCount);
        }
        
        // Method 3: From amezaCart array
        const amezaCart = JSON.parse(localStorage.getItem('amezaCart') || '[]');
        if (amezaCart.length > 0 && parseInt(cartCount) === 0) {
            cartCount = amezaCart.length.toString();
            localStorage.setItem('cartCount', cartCount);
        }
        
        updateCartBadges(cartCount);
        
    } catch (error) {
        console.error('Error syncing cart count:', error);
        updateCartBadges('0');
    }
}

/**
 * Update cart badges in both desktop and mobile
 */
function updateCartBadges(count) {
    const desktopBadge = document.getElementById('cart-count');
    const mobileBadge = document.getElementById('mobile-cart-count');
    
    if (desktopBadge) {
        desktopBadge.textContent = count;
        desktopBadge.style.display = parseInt(count) > 0 ? 'flex' : 'none';
    }
    
    if (mobileBadge) {
        mobileBadge.textContent = count;
        mobileBadge.style.display = parseInt(count) > 0 ? 'flex' : 'none';
    }
}

/**
 * Handle storage changes from other pages
 */
function handleStorageChange(e) {
    if (e.key === 'cartCount' || e.key === 'cart' || e.key === 'amezaCart') {
        syncCartCount();
    }
}

/**
 * Initialize mobile categories
 */
function initMobileCategories() {
    const categoryItems = document.querySelectorAll('.mobile-category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Filter articles by category (implement as needed)
            const category = this.textContent.trim();
            filterArticlesByCategory(category);
        });
    });
}

/**
 * Filter articles by category
 */
function filterArticlesByCategory(category) {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        if (category === 'Semua' || category === 'All') {
            card.style.display = 'block';
        } else {
            // Check if card matches category (implement based on your data structure)
            const cardCategory = card.querySelector('.post-category')?.textContent || '';
            if (cardCategory.toLowerCase().includes(category.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchForms = document.querySelectorAll('.search-form, .mobile-search-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = this.querySelector('input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                searchArticles(searchTerm);
            }
        });
    });
}

/**
 * Search articles
 */
function searchArticles(searchTerm) {
    const blogCards = document.querySelectorAll('.blog-card');
    let foundResults = false;
    
    blogCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const content = card.querySelector('p')?.textContent.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        if (title.includes(searchLower) || content.includes(searchLower)) {
            card.style.display = 'block';
            foundResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show no results message if needed
    if (!foundResults) {
        showNoResultsMessage(searchTerm);
    }
}

/**
 * Show no results message
 */
function showNoResultsMessage(searchTerm) {
    const blogGrid = document.querySelector('.blog-grid');
    const existingMessage = document.querySelector('.no-results-message');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results-message';
    noResultsDiv.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #777;">
            <i class="las la-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3>Tidak ada hasil untuk "${searchTerm}"</h3>
            <p>Coba gunakan kata kunci yang berbeda</p>
        </div>
    `;
    
    blogGrid.appendChild(noResultsDiv);
}

/**
 * Initialize mobile navigation
 */
function initMobileNavigation() {
    const navItems = document.querySelectorAll('.mobile-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

/**
 * Initialize blog animations
 */
function initBlogAnimations() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const blogObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                blogObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        blogObserver.observe(card);
    });
}

// Export functions for use in other scripts
window.blogFunctions = {
    syncCartCount,
    loadCartCount,
    updateCartBadges
};