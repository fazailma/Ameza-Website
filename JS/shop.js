document.addEventListener("DOMContentLoaded", () => {
  console.log("Shop page loaded")

  // Initialize cart count from localStorage
  loadCartCount()

  // Initialize search functionality
  initSearch()

  // Initialize filter functionality
  initFilters()

  // Initialize category filtering
  initCategoryFilters()

  // Initialize add to cart functionality
  initAddToCart()

  // Initialize mobile bottom navigation
  initMobileBottomNav()

  // Initialize sorting
  initSorting()

  // Initialize product count
  updateProductCount(document.querySelectorAll(".product-card").length)
})

/**
 * Load cart count from localStorage
 */
function loadCartCount() {
  const savedCartCount = localStorage.getItem("cartCount")
  if (savedCartCount) {
    const cartCountElement = document.getElementById("cart-count")
    if (cartCountElement) {
      cartCountElement.textContent = savedCartCount
    }
  }
}

/**
 * Initialize search functionality
 */
function initSearch() {
  const searchForm = document.getElementById("search-form")
  const searchInput = document.getElementById("search-input")

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      performSearch(searchInput.value.trim())
    })

    // Real-time search as user types
    searchInput.addEventListener("input", function () {
      performSearch(this.value.trim())
    })
  }
}

/**
 * Perform search functionality
 */
function performSearch(query) {
  const productCards = document.querySelectorAll(".product-card")
  let visibleCount = 0

  productCards.forEach((card) => {
    const productName = card.querySelector(".product-name").textContent.toLowerCase()
    const productCol = card.closest(".col-lg-3")

    if (!query || productName.includes(query.toLowerCase())) {
      productCol.style.display = "block"
      visibleCount++
    } else {
      productCol.style.display = "none"
    }
  })

  updateProductCount(visibleCount)
}

/**
 * Initialize filter functionality
 */
function initFilters() {
  const filterToggleBtn = document.getElementById("filter-toggle-btn")
  const shopFilters = document.getElementById("shop-filters")
  const applyFiltersBtn = document.querySelector(".apply-filters-btn")
  const clearFiltersBtn = document.querySelector(".clear-filters-btn")

  // Toggle filter visibility
  if (filterToggleBtn && shopFilters) {
    filterToggleBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Filter toggle clicked")

      if (shopFilters.style.display === "none" || !shopFilters.style.display) {
        shopFilters.style.display = "block"
        filterToggleBtn.innerHTML = '<i class="las la-times"></i> Tutup Filter'
      } else {
        shopFilters.style.display = "none"
        filterToggleBtn.innerHTML = '<i class="las la-sliders-h"></i> Filter'
      }
    })
  }

  // Apply filters
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Apply filters clicked")
      applyFilters()
    })
  }

  // Clear filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Clear filters clicked")
      clearFilters()
    })
  }

  // Color selection
  const colorOptions = document.querySelectorAll(".color-option")
  colorOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault()
      console.log("Color option clicked:", this.getAttribute("data-color"))
      this.classList.toggle("active")
    })
  })
}

/**
 * Initialize category filtering
 */
function initCategoryFilters() {
  const categoryButtons = document.querySelectorAll(".category-btn")
  console.log("Found category buttons:", categoryButtons.length)

  categoryButtons.forEach((button, index) => {
    console.log(`Setting up button ${index}:`, button.getAttribute("data-category"))

    button.addEventListener("click", function (e) {
      e.preventDefault()
      const category = this.getAttribute("data-category")
      console.log("Category button clicked:", category)

      // Update active button
      categoryButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Filter products by category
      filterByCategory(category)
    })
  })
}

/**
 * Filter products by category
 */
function filterByCategory(category) {
  console.log("Filtering by category:", category)
  const productCards = document.querySelectorAll(".product-card")
  let visibleCount = 0

  productCards.forEach((card) => {
    const productCol = card.closest(".col-lg-3")
    const cardCategory = card.getAttribute("data-category")
    console.log("Card category:", cardCategory, "Filter category:", category)

    if (category === "all" || cardCategory === category) {
      productCol.style.display = "block"
      visibleCount++
    } else {
      productCol.style.display = "none"
    }
  })

  console.log("Visible products:", visibleCount)
  updateProductCount(visibleCount)
}

/**
 * Apply all filters
 */
function applyFilters() {
  console.log("Applying all filters")
  const productCards = document.querySelectorAll(".product-card")
  let visibleCount = 0

  // Get active category
  const activeCategoryBtn = document.querySelector(".category-btn.active")
  const activeCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute("data-category") : "all"
  console.log("Active category:", activeCategory)

  // Get selected price range
  const selectedPriceInput = document.querySelector('input[name="priceRange"]:checked')
  const selectedPriceRange = selectedPriceInput ? selectedPriceInput.value : "all"
  console.log("Selected price range:", selectedPriceRange)

  // Get selected colors
  const selectedColors = []
  document.querySelectorAll(".color-option.active").forEach((option) => {
    selectedColors.push(option.getAttribute("data-color"))
  })
  console.log("Selected colors:", selectedColors)

  // Get selected sizes
  const selectedSizes = []
  document.querySelectorAll('.size-options input[type="checkbox"]:checked').forEach((checkbox) => {
    selectedSizes.push(checkbox.getAttribute("data-size"))
  })
  console.log("Selected sizes:", selectedSizes)

  productCards.forEach((card) => {
    const productCol = card.closest(".col-lg-3")
    const cardCategory = card.getAttribute("data-category")
    const cardColor = card.getAttribute("data-color")
    const cardSizes = card.getAttribute("data-size") ? card.getAttribute("data-size").split(",") : []
    const cardPrice = Number.parseInt(card.getAttribute("data-price") || "0")

    // Check category filter
    const passesCategory = activeCategory === "all" || cardCategory === activeCategory

    // Check price filter
    let passesPrice = true
    switch (selectedPriceRange) {
      case "under-200k":
        passesPrice = cardPrice < 200000
        break
      case "200k-400k":
        passesPrice = cardPrice >= 200000 && cardPrice <= 400000
        break
      case "over-400k":
        passesPrice = cardPrice > 400000
        break
      default:
        passesPrice = true
    }

    // Check color filter
    const passesColor = selectedColors.length === 0 || selectedColors.includes(cardColor)

    // Check size filter
    const passesSize = selectedSizes.length === 0 || cardSizes.some((size) => selectedSizes.includes(size.trim()))

    if (passesCategory && passesPrice && passesColor && passesSize) {
      productCol.style.display = "block"
      visibleCount++
    } else {
      productCol.style.display = "none"
    }
  })

  console.log("Filtered visible products:", visibleCount)
  updateProductCount(visibleCount)

  // Hide filters after applying
  const shopFilters = document.getElementById("shop-filters")
  const filterToggleBtn = document.getElementById("filter-toggle-btn")
  if (shopFilters && filterToggleBtn) {
    shopFilters.style.display = "none"
    filterToggleBtn.innerHTML = '<i class="las la-sliders-h"></i> Filter'
  }
}

/**
 * Clear all filters
 */
function clearFilters() {
  console.log("Clearing all filters")

  // Reset price filter
  const priceAllRadio = document.getElementById("price-all")
  if (priceAllRadio) {
    priceAllRadio.checked = true
  }

  // Reset color filters
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("active")
  })

  // Reset size filters
  document.querySelectorAll('.size-options input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false
  })

  // Reset category to "All"
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-category") === "all") {
      btn.classList.add("active")
    }
  })

  // Show all products
  filterByCategory("all")
}

/**
 * Initialize add to cart functionality
 */
function initAddToCart() {
  const cartButtons = document.querySelectorAll(".add-to-cart")
  const cartNotificationOverlay = document.getElementById("cartNotificationOverlay")
  const cartNotificationProduct = document.getElementById("cartNotificationProduct")
  const cartNotificationClose = document.getElementById("cartNotificationClose")
  const cartNotificationContinue = document.getElementById("cartNotificationContinue")

  console.log("Found cart buttons:", cartButtons.length)

  cartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      console.log("Add to cart clicked")

      // Get product info
      const productName = this.getAttribute("data-product")
      const productPrice = this.getAttribute("data-price")

      // Get current cart count
      const cartCountElement = document.getElementById("cart-count")
      let currentCount = Number.parseInt(cartCountElement.textContent || "0")

      // Increment count
      currentCount++
      cartCountElement.textContent = currentCount

      // Show custom notification
      if (cartNotificationOverlay && cartNotificationProduct) {
        cartNotificationProduct.textContent = productName
        cartNotificationOverlay.classList.add("show")

        // Auto hide after 5 seconds
        setTimeout(() => {
          cartNotificationOverlay.classList.remove("show")
        }, 5000)
      }

      // Save to localStorage
      localStorage.setItem("cartCount", currentCount)

      // Save product to cart in localStorage
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const existingProduct = cart.find((item) => item.name === productName)

      if (existingProduct) {
        existingProduct.quantity += 1
      } else {
        cart.push({
          name: productName,
          price: Number.parseInt(productPrice),
          quantity: 1,
        })
      }

      localStorage.setItem("cart", JSON.stringify(cart))

      // Animation for added to cart
      this.classList.add("added")
      setTimeout(() => {
        this.classList.remove("added")
      }, 500)
    })
  })

  // Close notification when clicking the close button
  if (cartNotificationClose) {
    cartNotificationClose.addEventListener("click", () => {
      cartNotificationOverlay.classList.remove("show")
    })
  }

  // Close notification when clicking "Continue Shopping"
  if (cartNotificationContinue) {
    cartNotificationContinue.addEventListener("click", () => {
      cartNotificationOverlay.classList.remove("show")
    })
  }

  // Close notification when clicking outside
  if (cartNotificationOverlay) {
    cartNotificationOverlay.addEventListener("click", (e) => {
      if (e.target === cartNotificationOverlay) {
        cartNotificationOverlay.classList.remove("show")
      }
    })
  }
}

/**
 * Initialize mobile bottom navigation
 */
function initMobileBottomNav() {
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item")

  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all items
      mobileNavItems.forEach((navItem) => {
        navItem.classList.remove("active")
      })

      // Add active class to clicked item
      this.classList.add("active")

      // Add bounce animation to icon
      const icon = this.querySelector("i")
      if (icon) {
        // Reset animation
        icon.style.animation = "none"
        setTimeout(() => {
          icon.style.animation = "bounce 0.5s"
        }, 10)
      }
    })
  })
}

/**
 * Initialize sorting functionality
 */
function initSorting() {
  const sortSelect = document.getElementById("sort-select")

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      console.log("Sort changed to:", this.value)
      sortProducts(this.value)
    })
  }
}

/**
 * Sort products based on selected option
 */
function sortProducts(sortBy) {
  const productsGrid = document.querySelector(".products-grid")
  if (!productsGrid) return

  const productCols = Array.from(document.querySelectorAll(".products-grid .col-lg-3"))
  const visibleCols = productCols.filter((col) => col.style.display !== "none")

  // Sort visible products based on selected option
  visibleCols.sort((a, b) => {
    const cardA = a.querySelector(".product-card")
    const cardB = b.querySelector(".product-card")
    const priceA = Number.parseInt(cardA.getAttribute("data-price") || "0")
    const priceB = Number.parseInt(cardB.getAttribute("data-price") || "0")

    switch (sortBy) {
      case "price-low":
        return priceA - priceB
      case "price-high":
        return priceB - priceA
      case "newest":
        // In a real app, you would sort by date
        return 0
      default:
        // Featured (default order)
        return 0
    }
  })

  // Remove all product columns
  productCols.forEach((col) => {
    col.remove()
  })

  // Re-add sorted visible columns first
  visibleCols.forEach((col) => {
    productsGrid.appendChild(col)
  })

  // Then add hidden columns
  const hiddenCols = productCols.filter((col) => col.style.display === "none")
  hiddenCols.forEach((col) => {
    productsGrid.appendChild(col)
  })
}

/**
 * Update product count display
 */
function updateProductCount(count) {
  const productCountElement = document.getElementById("product-count")
  if (productCountElement) {
    productCountElement.textContent = count
  }
}
