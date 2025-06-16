document.addEventListener("DOMContentLoaded", function() {
  // Tab switching functionality
  const optionTabs = document.querySelectorAll('.option-tab');
  const optionsContents = document.querySelectorAll('.options-content');
  
  // Set the first tab as active by default
  if (optionTabs.length > 0 && optionsContents.length > 0) {
    optionTabs[0].classList.add('active');
    optionsContents[0].classList.add('active');
  }
  
  optionTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      optionTabs.forEach(tab => tab.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all content sections
      optionsContents.forEach(content => content.classList.remove('active'));
      
      // Show corresponding content section
      const tabName = this.getAttribute('data-tab');
      const contentElement = document.getElementById(`${tabName}-options`);
      if (contentElement) {
        contentElement.classList.add('active');
      }
    });
  });
  
  // Item selection functionality
  const optionItems = document.querySelectorAll('.option-item');
  
  optionItems.forEach(item => {
    item.addEventListener('click', function() {
      // Get the parent tab content
      const parentContent = this.closest('.options-content');
      if (!parentContent) return;
      
      // Remove active class from all items in this category
      parentContent.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Update model based on selection
      const itemType = parentContent.id.split('-')[0]; // tops, bottoms, etc.
      const itemId = this.getAttribute('data-item');
      const itemName = this.getAttribute('data-name');
      const itemPrice = parseInt(this.getAttribute('data-price') || '0');
      
      updateModel(itemType, itemId, itemName, itemPrice);
    });
  });
  
  // Helper function to update model based on selection
  function updateModel(itemType, itemId, itemName, itemPrice) {
    console.log(`Updating ${itemType} to ${itemId}`);
    
    // Update the image
    switch (itemType) {
      case 'tops':
        const topImage = document.getElementById('selected-top-img');
        if (topImage) {
          topImage.src = `images/tops/${itemId}.png`;
          // Set a fallback image if the original doesn't load
          topImage.onerror = function() {
            this.src = '/placeholder.svg?height=300&width=300';
            console.log('Failed to load top image, using placeholder');
          };
        }
        
        // Update item name and price in the info section
        const topNameElement = document.getElementById('top-name');
        const topPriceElement = document.getElementById('top-price');
        
        if (topNameElement) topNameElement.textContent = itemName || 'Selected Top';
        if (topPriceElement) topPriceElement.textContent = formatPrice(itemPrice);
        break;
        
      case 'bottoms':
        const bottomImage = document.getElementById('selected-bottom-img');
        if (bottomImage) {
          bottomImage.src = `images/bottoms/${itemId}.png`;
          // Set a fallback image if the original doesn't load
          bottomImage.onerror = function() {
            this.src = '/placeholder.svg?height=300&width=300';
            console.log('Failed to load bottom image, using placeholder');
          };
        }
        
        // Update item name and price in the info section
        const bottomNameElement = document.getElementById('bottom-name');
        const bottomPriceElement = document.getElementById('bottom-price');
        
        if (bottomNameElement) bottomNameElement.textContent = itemName || 'Selected Bottom';
        if (bottomPriceElement) bottomPriceElement.textContent = formatPrice(itemPrice);
        break;
    }
    
    // Update total price
    updateTotalPrice();
  }
  
  // Function to update total price
  function updateTotalPrice() {
    const topPriceElement = document.getElementById('top-price');
    const bottomPriceElement = document.getElementById('bottom-price');
    const totalPriceElement = document.getElementById('outfit-total-price');
    
    if (topPriceElement && bottomPriceElement && totalPriceElement) {
      // Extract prices (remove "Rp " and commas)
      const topPrice = extractPrice(topPriceElement.textContent);
      const bottomPrice = extractPrice(bottomPriceElement.textContent);
      
      // Calculate total
      const totalPrice = topPrice + bottomPrice;
      
      // Update total price display
      totalPriceElement.textContent = formatPrice(totalPrice);
    }
  }
  
  // Helper function to format price
  function formatPrice(price) {
    return `Rp ${price.toLocaleString('id-ID')}`;
  }
  
  // Helper function to extract price from formatted string
  function extractPrice(priceString) {
    return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
  }
  
  // Add to cart functionality
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      const topName = document.getElementById('top-name').textContent;
      const bottomName = document.getElementById('bottom-name').textContent;
      
      alert(`Added to cart: ${topName} and ${bottomName}`);
      
      // Update cart count
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        cartCount.textContent = parseInt(cartCount.textContent) + 1;
      }
    });
  }
  
  // Save outfit functionality
  const saveOutfitBtn = document.getElementById('save-outfit');
  if (saveOutfitBtn) {
    saveOutfitBtn.addEventListener('click', function() {
      const topName = document.getElementById('top-name').textContent;
      const bottomName = document.getElementById('bottom-name').textContent;
      
      alert(`Outfit saved: ${topName} and ${bottomName}`);
      
      // Here you would typically save the outfit to localStorage or send to server
    });
  }
  
  // Initialize by selecting the first item in each category
  const firstTopItem = document.querySelector('#tops-options .option-item');
  const firstBottomItem = document.querySelector('#bottoms-options .option-item');
  
  if (firstTopItem) firstTopItem.click();
  if (firstBottomItem) firstBottomItem.click();
});

// shop dan home 
document.addEventListener("DOMContentLoaded", function() {
  // ===== CART FUNCTIONALITY =====
  // Find all cart buttons (both text buttons and icon buttons)
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart-icon');
  const cartCount = document.getElementById('cart-count');
  
  // Cart data storage
  let cart = JSON.parse(localStorage.getItem('amezaCart')) || [];
  
  // Update cart count display
  function updateCartCount() {
    if (cartCount) {
      cartCount.textContent = cart.length;
    }
  }
  
  // Initialize cart count
  updateCartCount();
  
  // Add to cart functionality
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get product info
      const productCard = this.closest('.product-card');
      if (!productCard) return;
      
      const productName = productCard.querySelector('.product-name')?.textContent || 'Product';
      const productPrice = productCard.querySelector('.product-price')?.textContent || 'Rp 0';
      
      // Get product image (either from background-image or img tag)
      let productImageUrl = '';
      const productImageDiv = productCard.querySelector('.product-image');
      if (productImageDiv) {
        if (productImageDiv.style.backgroundImage) {
          productImageUrl = productImageDiv.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        } else if (productImageDiv.querySelector('img')) {
          productImageUrl = productImageDiv.querySelector('img').src;
        }
      }
      
      // Create product object
      const product = {
        id: Date.now().toString(),
        name: productName,
        price: productPrice,
        image: productImageUrl,
        quantity: 1
      };
      
      // Add to cart
      cart.push(product);
      
      // Update localStorage
      localStorage.setItem('amezaCart', JSON.stringify(cart));
      
      // Update cart count
      updateCartCount();
      
      // Animation for added to cart confirmation
      productCard.classList.add('added-to-cart');
      setTimeout(() => {
        productCard.classList.remove('added-to-cart');
      }, 1000);
      
      // Show confirmation
      alert(`${productName} telah ditambahkan ke keranjang!`);
    });
  });
  
  // ===== SHOP FILTER FUNCTIONALITY =====
  // Toggle filter visibility
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const shopFilters = document.getElementById('shop-filters');
  
  if (filterToggleBtn && shopFilters) {
    // Initialize the filter panel as hidden
    shopFilters.style.display = 'none';
    
    filterToggleBtn.addEventListener('click', function() {
      // Toggle visibility
      if (shopFilters.style.display === 'none') {
        shopFilters.style.display = 'block';
        filterToggleBtn.innerHTML = '<i class="fas fa-times"></i> Tutup Filter';
      } else {
        shopFilters.style.display = 'none';
        filterToggleBtn.innerHTML = '<i class="fas fa-sliders-h"></i> Filter';
      }
    });
  }
  
  // Category filtering
  const categoryButtons = document.querySelectorAll('.category-btn');
  const productCards = document.querySelectorAll('.product-card');
  const productCountElement = document.getElementById('product-count');
  
  if (categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter products
        let visibleCount = 0;
        
        productCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });
        
        // Update product count
        if (productCountElement) {
          productCountElement.textContent = visibleCount;
        }
      });
    });
  }
  
  // Price slider functionality
  const priceSlider = document.getElementById('price-slider');
  const priceValue = document.getElementById('price-value');
  
  if (priceSlider && priceValue) {
    // Set initial value
    priceValue.textContent = formatPrice(priceSlider.value);
    
    priceSlider.addEventListener('input', function() {
      // Format price with thousand separator
      priceValue.textContent = formatPrice(this.value);
    });
  }
  
  // Color selection
  const colorOptions = document.querySelectorAll('.color-option');
  
  if (colorOptions.length > 0) {
    colorOptions.forEach(option => {
      option.addEventListener('click', function() {
        this.classList.toggle('selected');
      });
    });
  }
  
  // Size selection
  const sizeOptions = document.querySelectorAll('.size-option input');
  
  // Apply filters button
  const applyFiltersBtn = document.querySelector('.apply-filters-btn');
  
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function() {
      filterProducts();
    });
  }
  
  // Clear filters button
  const clearFiltersBtn = document.querySelector('.clear-filters-btn');
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function() {
      // Reset price slider
      if (priceSlider) {
        priceSlider.value = priceSlider.max;
        priceValue.textContent = formatPrice(priceSlider.max);
      }
      
      // Deselect all colors
      colorOptions.forEach(option => {
        option.classList.remove('selected');
      });
      
      // Uncheck all size checkboxes
      sizeOptions.forEach(option => {
        option.checked = false;
      });
      
      // Show all products
      productCards.forEach(card => {
        card.style.display = 'block';
      });
      
      // Update product count
      updateProductCount();
    });
  }
  
  // Sort products
  const sortSelect = document.getElementById('sort-select');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortProducts(this.value);
    });
  }
  
  // Filter products based on selected filters
  function filterProducts() {
    // Get max price
    const maxPrice = priceSlider ? parseInt(priceSlider.value) : 1000000;
    
    // Get selected colors
    const selectedColors = [];
    colorOptions.forEach(option => {
      if (option.classList.contains('selected')) {
        selectedColors.push(option.getAttribute('data-color'));
      }
    });
    
    // Get selected sizes
    const selectedSizes = [];
    sizeOptions.forEach(option => {
      if (option.checked) {
        selectedSizes.push(option.getAttribute('data-size'));
      }
    });
    
    // Filter products
    productCards.forEach(card => {
      const price = parseInt(card.getAttribute('data-price') || '0');
      const color = card.getAttribute('data-color');
      const sizes = card.getAttribute('data-size') ? card.getAttribute('data-size').split(',') : [];
      
      let showCard = true;
      
      // Filter by price
      if (price > maxPrice) {
        showCard = false;
      }
      
      // Filter by color
      if (selectedColors.length > 0 && !selectedColors.includes(color)) {
        showCard = false;
      }
      
      // Filter by size
      if (selectedSizes.length > 0 && !selectedSizes.some(size => sizes.includes(size))) {
        showCard = false;
      }
      
      // Show or hide card
      card.style.display = showCard ? 'block' : 'none';
    });
    
    // Update product count
    updateProductCount();
  }
  
  // Sort products
  function sortProducts(sortBy) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    const products = Array.from(productCards);
    
    // Sort products based on selected option
    products.sort((a, b) => {
      const priceA = parseInt(a.getAttribute('data-price') || '0');
      const priceB = parseInt(b.getAttribute('data-price') || '0');
      
      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'newest':
          // In a real app, you would sort by date
          return 0;
        default:
          // Featured (default order)
          return 0;
      }
    });
    
    // Reorder products in the DOM
    products.forEach(product => {
      productsGrid.appendChild(product);
    });
  }
  
  // Update product count
  function updateProductCount() {
    if (!productCountElement) return;
    
    let visibleCount = 0;
    productCards.forEach(card => {
      if (card.style.display !== 'none') {
        visibleCount++;
      }
    });
    
    productCountElement.textContent = visibleCount;
  }
  
  // Helper function to format price
  function formatPrice(price) {
    return `Rp ${parseInt(price).toLocaleString('id-ID')}`;
  }
  
  // ===== CART ICON CONVERSION =====
  // Find all "Tambah ke Keranjang" buttons and replace them with icons
  const cartTextButtons = document.querySelectorAll('.add-to-cart-btn');
  
  cartTextButtons.forEach(button => {
    // Change the class
    button.classList.remove('add-to-cart-btn');
    button.classList.add('add-to-cart-icon');
    
    // Replace the text with an icon
    button.innerHTML = '<i class="fas fa-shopping-cart"></i>';
  });
  
  // ===== PAGINATION FUNCTIONALITY =====
  const paginationItems = document.querySelectorAll('.pagination-item');
  
  paginationItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all pagination items
      paginationItems.forEach(item => item.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // In a real app, you would load the corresponding page of products
      // For this demo, we'll just scroll to the top of the products section
      const shopSection = document.querySelector('.shop-section');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // ===== MOBILE MENU TOGGLE =====
  const mobileMenuButton = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuButton && navLinks) {
    mobileMenuButton.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
});

// profile
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const menuItems = document.querySelectorAll('.profile-menu-item');
  const tabs = document.querySelectorAll('.profile-tab');
  const welcomeTab = document.querySelector('.profile-welcome');
  
  menuItems.forEach(item => {
    if (item.classList.contains('logout')) {
      // Handle logout separately
      item.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin keluar?')) {
          // Redirect to login page or home page
          window.location.href = 'index.html';
        }
      });
      return;
    }
    
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      
      // Hide welcome message
      if (welcomeTab) {
        welcomeTab.style.display = 'none';
      }
      
      // Remove active class from all menu items and tabs
      menuItems.forEach(menuItem => menuItem.classList.remove('active'));
      tabs.forEach(tab => tab.classList.remove('active'));
      
      // Add active class to clicked menu item and corresponding tab
      this.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // Welcome tab button to show profile details
  const profileDetailsBtn = document.getElementById('show-profile-details');
  if (profileDetailsBtn) {
    profileDetailsBtn.addEventListener('click', function() {
      // Find and click the profile menu item
      const profileMenuItem = document.querySelector('.profile-menu-item[data-tab="profile"]');
      if (profileMenuItem) {
        profileMenuItem.click();
      }
    });
  }
  
  // Tracking modal functionality
  const trackButtons = document.querySelectorAll('.track-order-btn');
  const trackingModal = document.getElementById('tracking-modal');
  
  trackButtons.forEach(button => {
    button.addEventListener('click', function() {
      const orderId = this.getAttribute('data-order-id');
      // You can use orderId to fetch tracking data from server
      
      // For now, just show the modal
      if (trackingModal) {
        trackingModal.classList.add('active');
      }
    });
  });
  
  // Review modal functionality
  const reviewButtons = document.querySelectorAll('.review-btn');
  const reviewModal = document.getElementById('review-modal');
  
  reviewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const orderId = this.getAttribute('data-order-id');
      // You can use orderId to fetch order products for review
      
      // For now, just show the modal
      if (reviewModal) {
        reviewModal.classList.add('active');
      }
    });
  });
  
  // Close modal functionality
  const closeButtons = document.querySelectorAll('.close-modal');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Find the parent modal and close it
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Star rating functionality
  const ratingStars = document.querySelectorAll('.rating-stars i');
  
  ratingStars.forEach(star => {
    star.addEventListener('mouseover', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      const parentStars = this.parentElement.querySelectorAll('i');
      
      // Reset all stars
      parentStars.forEach(s => s.className = 'far fa-star');
      
      // Fill stars up to the hovered one
      for (let i = 0; i < rating; i++) {
        parentStars[i].className = 'fas fa-star';
      }
    });
    
    star.addEventListener('mouseout', function() {
      const parentStars = this.parentElement.querySelectorAll('i');
      const selectedRating = this.parentElement.getAttribute('data-selected') || 0;
      
      // Reset all stars
      parentStars.forEach(s => s.className = 'far fa-star');
      
      // Fill stars up to the selected rating
      for (let i = 0; i < selectedRating; i++) {
        parentStars[i].className = 'fas fa-star';
      }
    });
    
    star.addEventListener('click', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      const parentStars = this.parentElement;
      
      // Set the selected rating
      parentStars.setAttribute('data-selected', rating);
    });
  });
  
  // Submit review functionality
  const submitReviewBtn = document.querySelector('.submit-review');
  
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', function() {
      // Validate if all products have ratings
      const ratingContainers = document.querySelectorAll('.rating-stars');
      let allRated = true;
      
      ratingContainers.forEach(container => {
        if (!container.getAttribute('data-selected')) {
          allRated = false;
        }
      });
      
      if (!allRated) {
        alert('Silakan beri rating untuk semua produk');
        return;
      }
      
      // Get review data
      const reviewProducts = document.querySelectorAll('.review-product');
      const reviews = [];
      
      reviewProducts.forEach(product => {
        const productName = product.querySelector('.product-info h4').textContent;
        const rating = product.querySelector('.rating-stars').getAttribute('data-selected');
        const comment = product.querySelector('textarea').value;
        
        reviews.push({
          product: productName,
          rating: rating,
          comment: comment
        });
      });
      
      // Here you would normally send the review data to the server
      console.log('Review data:', reviews);
      
      // Close the modal and show success message
      reviewModal.classList.remove('active');
      alert('Terima kasih atas ulasan Anda!');
    });
  }
  
  // Profile form submission
  const profileForm = document.querySelector('.profile-form');
  
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would normally send the form data to the server
      alert('Profil berhasil diperbarui');
    });
  }
  
  // Password form submission
  const passwordForm = document.querySelector('.password-form');
  
  if (passwordForm) {
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Silakan isi semua field password');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        alert('Password baru dan konfirmasi password tidak cocok');
        return;
      }
      
      // Here you would normally send the password data to the server
      alert('Password berhasil diubah');
      
      // Reset form
      this.reset();
    });
  }
  
  // Change avatar functionality
  const changeAvatarButton = document.querySelector('.change-avatar');
  
  if (changeAvatarButton) {
    changeAvatarButton.addEventListener('click', function() {
      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      
      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            // Update avatar image
            document.querySelector('.profile-avatar img').src = e.target.result;
          };
          
          reader.readAsDataURL(this.files[0]);
        }
      });
      
      // Trigger file input click
      fileInput.click();
    });
  }
  
  // Address actions functionality
  const addressActionButtons = document.querySelectorAll('.address-actions button');
  
  addressActionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const addressItem = this.closest('.address-item');
      const buttonText = this.textContent.trim();
      
      if (buttonText === 'Edit') {
        // Here you would normally open an edit form
        alert('Edit alamat');
      } else if (buttonText === 'Hapus') {
        if (confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
          // Here you would normally remove the address via API
          addressItem.remove();
        }
      } else if (buttonText === 'Jadikan Utama') {
        // Remove default badge from all addresses
        document.querySelectorAll('.address-item').forEach(item => {
          item.classList.remove('default');
          const badge = item.querySelector('.address-badge');
          if (badge) badge.remove();
        });
        
        // Add default badge to this address
        addressItem.classList.add('default');
        const badge = document.createElement('div');
        badge.className = 'address-badge';
        badge.textContent = 'Utama';
        addressItem.appendChild(badge);
      }
    });
  });
  
  // Add new address functionality
  const addAddressButton = document.querySelector('.add-address button');
  
  if (addAddressButton) {
    addAddressButton.addEventListener('click', function() {
      // Here you would normally open a form to add a new address
      alert('Tambah alamat baru');
    });
  }
  
  // Buy again functionality
  const buyAgainButtons = document.querySelectorAll('.buy-again-btn');
  
  buyAgainButtons.forEach(button => {
    button.addEventListener('click', function() {
      const orderId = this.getAttribute('data-order-id');
      
      // Here you would normally add all products from this order to cart
      alert(`Produk dari pesanan #${orderId} telah ditambahkan ke keranjang`);
    });
  });
  
  // Initialize the page with welcome tab visible
  if (welcomeTab) {
    welcomeTab.style.display = 'block';
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu")
  const mobileMenuContainer = document.querySelector(".mobile-menu-container")

  if (mobileMenuBtn && mobileMenuContainer) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenuContainer.classList.toggle("active")
    })
  }

  // Initialize cart count from localStorage if available
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const storedCartCount = localStorage.getItem("cartCount") || "0"
    cartCount.textContent = storedCartCount
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      mobileMenuContainer &&
      mobileMenuContainer.classList.contains("active") &&
      !mobileMenuContainer.contains(event.target) &&
      !mobileMenuBtn.contains(event.target)
    ) {
      mobileMenuContainer.classList.remove("active")
    }
  })
})
