document.addEventListener("DOMContentLoaded", () => {
  // Import AOS animation library if available
  const AOS = window.AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    })
  }

  // Import Bootstrap library
  const bootstrap = window.bootstrap

  // Initialize discount claim functionality
  initDiscountClaim()

  // Initialize product hover effects
  initProductHoverEffects()

  // Initialize add to cart functionality
  initAddToCart()

  // Initialize mobile bottom navigation
  initMobileBottomNav()

  // Load cart count from localStorage
  loadCartCount()

  // Add page entrance animation
  animatePageEntrance()
})

/**
 * Initialize discount claim functionality
 */
function initDiscountClaim() {
  const claimBtn = document.getElementById("claim-discount")
  if (claimBtn) {
    claimBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Check if already claimed
      if (localStorage.getItem("discountClaimed") === "true") {
        return
      }

      // Show the Bootstrap modal
      const discountModal = new bootstrap.Modal(document.getElementById("discountModal"))
      discountModal.show()

      // Change button text and disable it with animation
      claimBtn.textContent = "Diklaim"
      claimBtn.style.backgroundColor = "#000000"
      claimBtn.style.color = "white"
      claimBtn.style.borderColor = "#000000"
      claimBtn.style.cursor = "default"
      claimBtn.style.pointerEvents = "none"
      claimBtn.classList.add("claimed")

      // Add claimed class to the banner with animation
      const banner = document.querySelector(".first-purchase-content")
      if (banner) {
        banner.classList.add("claimed")
        banner.style.animation = "pulse 1s"
      }

      // Store in localStorage that discount has been claimed
      localStorage.setItem("discountClaimed", "true")
      localStorage.setItem("discountCode", "AMEZA20")
    })
  }

  // Check if discount was already claimed
  if (localStorage.getItem("discountClaimed") === "true" && claimBtn) {
    claimBtn.textContent = "Diklaim"
    claimBtn.style.backgroundColor = "#000000"
    claimBtn.style.color = "white"
    claimBtn.style.borderColor = "#000000"
    claimBtn.style.cursor = "default"
    claimBtn.style.pointerEvents = "none"

    const banner = document.querySelector(".first-purchase-content")
    if (banner) {
      banner.classList.add("claimed")
    }
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
 * Initialize product hover effects
 */
function initProductHoverEffects() {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const image = this.querySelector(".product-img")
      if (image) {
        image.style.transform = "scale(1.05)"
      }

      // Add subtle glow effect
      this.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)"
    })

    card.addEventListener("mouseleave", function () {
      const image = this.querySelector(".product-img")
      if (image) {
        image.style.transform = "scale(1)"
      }

      // Remove glow effect
      this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.05)"
    })
  })
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

  cartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()

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
 * Add page entrance animation
 */
function animatePageEntrance() {
  // Animate sections on scroll
  const sections = document.querySelectorAll("section")

  // Create an Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 },
  )

  // Add a class for the animation and observe each section
  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(20px)"
    section.style.transition = "opacity 0.8s ease, transform 0.8s ease"
    observer.observe(section)
  })

  // Add CSS for the visible class
  const style = document.createElement("style")
  style.innerHTML = `
    section.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `
  document.head.appendChild(style)
}
