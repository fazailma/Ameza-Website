document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog page loaded, initializing cart sync...');
    
    // Initialize all functionality
    initRealCartSync();
    initSearch();
    initMobileCategories();
    initMobileNavigation();
    
    // Load cart count immediately
    loadRealCartCount();
    
    // Sync every 2 seconds to catch changes from other pages
    setInterval(loadRealCartCount, 2000);
    
    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'cartCount' || e.key === 'cart' || e.key === 'amezaCart') {
            console.log('Storage changed, syncing cart...');
            loadRealCartCount();
        }
    });
    
    // Sync when page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('Page visible, syncing cart...');
            loadRealCartCount();
        }
    });
});

/**
 * Initialize real cart synchronization
 */
function initRealCartSync() {
    console.log('Initializing real cart sync...');
    
    // Check all possible localStorage keys
    const possibleKeys = ['cartCount', 'cart', 'amezaCart'];
    
    possibleKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`localStorage ${key}:`, value);
    });
}

/**
 * Load REAL cart count from localStorage
 */
function loadRealCartCount() {
    try {
        let realCartCount = 0;
        
        // Method 1: Check cartCount directly (from customize page)
        const storedCartCount = localStorage.getItem('cartCount');
        if (storedCartCount && !isNaN(parseInt(storedCartCount))) {
            realCartCount = parseInt(storedCartCount);
            console.log('Found cartCount:', realCartCount);
        }
        
        // Method 2: Check cart array length
        const cartArray = localStorage.getItem('cart');
        if (cartArray) {
            try {
                const parsedCart = JSON.parse(cartArray);
                if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                    realCartCount = Math.max(realCartCount, parsedCart.length);
                    console.log('Found cart array length:', parsedCart.length);
                }
            } catch (e) {
                console.log('Error parsing cart array:', e);
            }
        }
        
        // Method 3: Check amezaCart array length
        const amezaCartArray = localStorage.getItem('amezaCart');
        if (amezaCartArray) {
            try {
                const parsedAmezaCart = JSON.parse(amezaCartArray);
                if (Array.isArray(parsedAmezaCart) && parsedAmezaCart.length > 0) {
                    realCartCount = Math.max(realCartCount, parsedAmezaCart.length);
                    console.log('Found amezaCart array length:', parsedAmezaCart.length);
                }
            } catch (e) {
                console.log('Error parsing amezaCart array:', e);
            }
        }
        
        // Update the badges with real count
        updateCartBadges(realCartCount);
        
        // Keep cartCount in sync
        if (realCartCount > 0) {
            localStorage.setItem('cartCount', realCartCount.toString());
        }
        
        console.log('Final cart count:', realCartCount);
        
    } catch (error) {
        console.error('Error loading real cart count:', error);
        updateCartBadges(0);
    }
}

/**
 * Update cart badges with real count
 */
function updateCartBadges(count) {
    const desktopBadge = document.getElementById('cart-count');
    const mobileBadge = document.getElementById('mobile-cart-count');
    
    console.log('Updating badges with count:', count);
    
    if (desktopBadge) {
        desktopBadge.textContent = count.toString();
        if (count > 0) {
            desktopBadge.style.display = 'flex';
            desktopBadge.style.opacity = '1';
        } else {
            desktopBadge.style.display = 'none';
        }
    }
    
    if (mobileBadge) {
        mobileBadge.textContent = count.toString();
        if (count > 0) {
            mobileBadge.style.display = 'flex';
            mobileBadge.style.opacity = '1';
        } else {
            mobileBadge.style.display = 'none';
        }
    }
}

/**
 * Initialize search functionality - TETAP ADA
 */
function initSearch() {
    // Desktop search
    const desktopSearchForm = document.querySelector('.search-form');
    if (desktopSearchForm) {
        desktopSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        });
    }
    
    // Mobile search - DI ATAS
    const mobileSearchForm = document.querySelector('.mobile-search-form');
    if (mobileSearchForm) {
        mobileSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        });
    }
}

/**
 * Perform search
 */
function performSearch(searchTerm) {
    console.log('Searching for:', searchTerm);
    
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
    
    if (!foundResults) {
        showNoResultsMessage(searchTerm);
    } else {
        removeNoResultsMessage();
    }
}

/**
 * Show no results message
 */
function showNoResultsMessage(searchTerm) {
    removeNoResultsMessage();
    
    const blogGrid = document.querySelector('.blog-grid');
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results-message';
    noResultsDiv.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #777; grid-column: 1 / -1;">
            <i class="las la-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3>Tidak ada hasil untuk "${searchTerm}"</h3>
            <p>Coba gunakan kata kunci yang berbeda</p>
            <button onclick="clearSearch()" style="margin-top: 15px; padding: 10px 20px; background: #000; color: white; border: none; border-radius: 5px; cursor: pointer;">Tampilkan Semua</button>
        </div>
    `;
    
    blogGrid.appendChild(noResultsDiv);
}

/**
 * Remove no results message
 */
function removeNoResultsMessage() {
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

/**
 * Clear search and show all articles
 */
function clearSearch() {
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.style.display = 'block';
    });
    
    removeNoResultsMessage();
    
    // Clear search inputs
    const searchInputs = document.querySelectorAll('.search-form input, .mobile-search-form input');
    searchInputs.forEach(input => {
        input.value = '';
    });
}

// Make clearSearch available globally
window.clearSearch = clearSearch;

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
            
            // Filter articles by category
            const category = this.textContent.trim();
            filterByCategory(category);
        });
    });
}

/**
 * Filter articles by category
 */
function filterByCategory(category) {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        if (category === 'Semua') {
            card.style.display = 'block';
        } else {
            const cardCategory = card.querySelector('.post-category')?.textContent || '';
            if (cardCategory.toLowerCase().includes(category.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    removeNoResultsMessage();
}

/**
 * Initialize mobile navigation
 */
function initMobileNavigation() {
    const navItems = document.querySelectorAll('.mobile-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Debug function to check localStorage
function debugLocalStorage() {
    console.log('=== DEBUG LOCALSTORAGE ===');
    console.log('cartCount:', localStorage.getItem('cartCount'));
    console.log('cart:', localStorage.getItem('cart'));
    console.log('amezaCart:', localStorage.getItem('amezaCart'));
    console.log('========================');
}

// Make debug function available globally
window.debugLocalStorage = debugLocalStorage;

// Run debug on load
debugLocalStorage();