// Global cart management with enhanced synchronization
class CartManager {
  constructor() {
    this.cart = this.loadCart()
    this.syncCartCount = this.syncCartCount.bind(this)
    this.init()
  }

  init() {
    this.updateCartCount()
    this.renderCart()
    this.bindEvents()
    this.syncWithOtherPages()
    this.setupGlobalCartSync()
    this.syncCartCount()
  }

  loadCart() {
    try {
      return JSON.parse(localStorage.getItem("amezaCart")) || []
    } catch (error) {
      console.error("Error loading cart:", error)
      return []
    }
  }

  saveCart() {
    try {
      localStorage.setItem("amezaCart", JSON.stringify(this.cart))
      this.updateCartCount()
      this.broadcastCartUpdate()
      this.saveCartSummary()
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  saveCartSummary() {
    // Save cart summary for other pages
    const summary = {
      totalItems: this.cart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: this.getCartTotal(),
      itemCount: this.cart.length,
      lastUpdated: Date.now(),
    }
    localStorage.setItem("amezaCartSummary", JSON.stringify(summary))
  }

  broadcastCartUpdate() {
    // Broadcast cart update to other tabs/windows
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: {
          cart: this.cart,
          summary: {
            totalItems: this.cart.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: this.getCartTotal(),
          },
        },
      }),
    )
  }

  setupGlobalCartSync() {
    // Make cart manager globally available for other pages
    window.AmezaCart = {
      getCartCount: () => this.cart.reduce((sum, item) => sum + item.quantity, 0),
      getCartTotal: () => this.getCartTotal(),
      getCart: () => this.cart,
      addToCart: (product) => this.addToCart(product),
      updateCartDisplay: () => this.updateCartCount(),
      formatPrice: (price) => this.formatPrice(price),
    }
  }

  syncWithOtherPages() {
    // Listen for cart updates from other pages
    window.addEventListener("cartUpdated", (event) => {
      this.cart = event.detail.cart
      this.updateCartCount()
      this.renderCart()
    })

    // Listen for storage changes (other tabs)
    window.addEventListener("storage", (event) => {
      if (event.key === "amezaCart") {
        this.cart = this.loadCart()
        this.updateCartCount()
        this.renderCart()
      }
    })
  }

  updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0)

    // Update semua element cart count termasuk mobile
    const cartCountElements = document.querySelectorAll(
      "#cart-count, #cart-count-mobile, #total-items, #summary-items, #mobile-item-count, #mobile-total-items",
    )
    cartCountElements.forEach((element) => {
      if (element) {
        element.textContent = totalItems
      }
    })

    // Update badge - untuk desktop dan mobile
    const badges = document.querySelectorAll(".badge")
    badges.forEach((badge) => {
      if (totalItems > 0) {
        badge.style.display = "flex"
        badge.textContent = totalItems
      } else {
        badge.style.display = "none"
      }
    })

    // Sinkron dengan halaman lain
    localStorage.setItem("cartCount", totalItems.toString())

    // Broadcast event untuk real-time sync
    window.dispatchEvent(
      new CustomEvent("cartCountUpdated", {
        detail: { count: totalItems },
      }),
    )
  }

  addToCart(product) {
    const existingItem = this.cart.find(
      (item) => item.id === product.id && item.size === product.size && item.color === product.color,
    )

    if (existingItem) {
      existingItem.quantity += product.quantity || 1
    } else {
      this.cart.push({
        id: product.id || Date.now(),
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        size: product.size,
        color: product.color,
        quantity: product.quantity || 1,
      })
    }

    this.saveCart()
    this.renderCart()
  }

  removeFromCart(index) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1)
      this.saveCart()
      this.renderCart()
    }
  }

  updateQuantity(index, quantity) {
    if (index >= 0 && index < this.cart.length) {
      if (quantity <= 0) {
        this.removeFromCart(index)
      } else {
        this.cart[index].quantity = Math.min(quantity, 10)
        this.saveCart()
        this.renderCart()
      }
    }
  }

  clearCart() {
    this.showClearCartModal()
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => {
      let price = item.price
      if (typeof price === "string") {
        price = Number.parseInt(price.replace(/\D/g, "")) || 0
      }
      return total + price * item.quantity
    }, 0)
  }

  formatPrice(price) {
    return `Rp ${price.toLocaleString("id-ID")}`
  }

  renderCart() {
    const cartItemsList = document.getElementById("cart-items-list")
    const emptyCart = document.getElementById("empty-cart")
    const cartActions = document.getElementById("cart-actions")
    const cartSummary = document.getElementById("cart-summary")
    const mobileCheckoutBar = document.getElementById("mobile-checkout-bar")

    if (!cartItemsList) return

    if (this.cart.length === 0) {
      // Show empty cart
      emptyCart.style.display = "block"
      cartItemsList.style.display = "none"
      cartActions.style.display = "none"
      cartSummary.style.display = "none"
      mobileCheckoutBar.style.display = "none"
    } else {
      // Show cart items
      emptyCart.style.display = "none"
      cartItemsList.style.display = "block"
      cartActions.style.display = "flex"
      cartSummary.style.display = "block"

      // Show mobile checkout bar on mobile
      if (window.innerWidth <= 768) {
        mobileCheckoutBar.style.display = "flex"
      }

      // Render cart items
      cartItemsList.innerHTML = this.cart
        .map(
          (item, index) => `
        <div class="cart-item" data-index="${index}">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://i.pinimg.com/736x/9e/37/d7/9e37d7607ebd223a0d636e018e56bc6c.jpg'">
          </div>
          <div class="item-details">
            <h3>${item.name}</h3>
            <p class="item-category">Kategori: ${item.category || "Umum"}</p>
            <p class="item-size">Ukuran: ${item.size || "Standard"}</p>
            <p class="item-color">Warna: ${item.color || "Default"}</p>
          </div>
          <div class="item-controls">
            <div class="item-quantity">
              <button class="quantity-btn minus" data-index="${index}" ${item.quantity <= 1 ? "disabled" : ""}>
                <i class="las la-minus"></i>
              </button>
              <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input" data-index="${index}">
              <button class="quantity-btn plus" data-index="${index}" ${item.quantity >= 10 ? "disabled" : ""}>
                <i class="las la-plus"></i>
              </button>
            </div>
            <div class="item-price">${this.formatPrice(Number.parseInt(item.price.replace(/\D/g, "")) * item.quantity)}</div>
          </div>
          <button class="remove-btn" data-index="${index}">
            <i class="las la-trash"></i>
          </button>
        </div>
      `,
        )
        .join("")

      // Update summary
      this.updateSummary()
    }

    // Re-bind events for new elements
    this.bindCartItemEvents()
  }

  updateSummary() {
    const subtotal = this.getCartTotal()
    const shipping = subtotal > 0 ? 20000 : 0
    const discount = this.getDiscount(subtotal)
    const total = subtotal + shipping - discount

    // Update summary elements
    const subtotalElement = document.getElementById("subtotal-amount")
    const discountElement = document.getElementById("discount-amount")
    const shippingElement = document.getElementById("shipping-amount")
    const totalElement = document.getElementById("total-amount")
    const mobileTotalElement = document.getElementById("mobile-total-price")

    if (subtotalElement) subtotalElement.textContent = this.formatPrice(subtotal)
    if (discountElement) discountElement.textContent = `- ${this.formatPrice(discount)}`
    if (shippingElement) shippingElement.textContent = this.formatPrice(shipping)
    if (totalElement) totalElement.textContent = this.formatPrice(total)
    if (mobileTotalElement) mobileTotalElement.textContent = this.formatPrice(total)

    // Update mobile checkout button count
    const mobileItemCountElement = document.getElementById("mobile-item-count")
    if (mobileItemCountElement) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0)
      mobileItemCountElement.textContent = totalItems
    }
  }

  getDiscount(subtotal) {
    const couponInput = document.getElementById("coupon-input")
    if (couponInput && couponInput.dataset.applied === "true") {
      const couponCode = couponInput.value.trim().toUpperCase()
      if (couponCode === "DISKON10") {
        return Math.round(subtotal * 0.1)
      } else if (couponCode === "DISKON20") {
        return Math.round(subtotal * 0.2)
      }
    }
    return 0
  }

  bindEvents() {
    // Clear cart buttons
    const clearCartMobile = document.getElementById("clear-cart-mobile")
    const clearCartDesktop = document.getElementById("clear-cart-desktop")
    const clearCartHeader = document.getElementById("clear-cart-header")
    ;[clearCartMobile, clearCartDesktop, clearCartHeader].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => {
          this.showClearCartModal()
        })
      }
    })

    // Update cart button
    const updateCartBtn = document.getElementById("update-cart")
    if (updateCartBtn) {
      updateCartBtn.addEventListener("click", () => {
        this.renderCart()
        this.showNotification("Keranjang berhasil diperbarui", "success")
      })
    }

    // Apply coupon button
    const applyCouponBtn = document.getElementById("apply-coupon")
    const couponInput = document.getElementById("coupon-input")

    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener("click", () => {
        this.applyCoupon()
      })

      couponInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.applyCoupon()
        }
      })
    }

    // Checkout buttons
    const checkoutBtn = document.getElementById("checkout-btn")
    const mobileCheckoutBtn = document.getElementById("mobile-checkout-btn")
    ;[checkoutBtn, mobileCheckoutBtn].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => {
          if (this.cart.length === 0) {
            this.showNotification("Keranjang Anda kosong", "warning")
            return
          }
          window.location.href = "checkout.html"
        })
      }
    })

    // Handle window resize
    window.addEventListener("resize", () => {
      const mobileCheckoutBar = document.getElementById("mobile-checkout-bar")
      const cartSummary = document.getElementById("cart-summary")

      if (window.innerWidth <= 768) {
        if (this.cart.length > 0 && mobileCheckoutBar) {
          mobileCheckoutBar.style.display = "flex"
        }
        if (cartSummary) {
          cartSummary.style.display = "none"
        }
      } else {
        if (mobileCheckoutBar) {
          mobileCheckoutBar.style.display = "none"
        }
        if (this.cart.length > 0 && cartSummary) {
          cartSummary.style.display = "block"
        }
      }
    })

    this.bindModalEvents()
  }

  showClearCartModal() {
    const modal = document.getElementById("clear-cart-modal")
    if (modal) {
      modal.classList.add("show")
      document.body.style.overflow = "hidden"
    }
  }

  hideClearCartModal() {
    const modal = document.getElementById("clear-cart-modal")
    if (modal) {
      modal.classList.remove("show")
      document.body.style.overflow = "auto"
    }
  }

  bindModalEvents() {
    const modal = document.getElementById("clear-cart-modal")
    const modalClose = document.getElementById("modal-close")
    const confirmClear = document.getElementById("confirm-clear")
    const cancelClear = document.getElementById("cancel-clear")
    ;[modalClose, cancelClear].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => {
          this.hideClearCartModal()
        })
      }
    })

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideClearCartModal()
        }
      })
    }

    if (confirmClear) {
      confirmClear.addEventListener("click", () => {
        this.cart = []
        this.saveCart()
        this.renderCart()
        this.hideClearCartModal()
        this.showNotification("Keranjang berhasil dikosongkan", "success")
      })
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        this.hideClearCartModal()
      }
    })
  }

  bindCartItemEvents() {
    // Remove buttons
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const index = Number.parseInt(e.currentTarget.dataset.index)
        const itemName = this.cart[index]?.name || "item"

        if (confirm(`Hapus ${itemName} dari keranjang?`)) {
          this.removeFromCart(index)
          this.showNotification("Item berhasil dihapus", "success")
        }
      })
    })

    // Quantity buttons
    document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = Number.parseInt(e.currentTarget.dataset.index)
        const currentQuantity = this.cart[index].quantity
        this.updateQuantity(index, currentQuantity - 1)
      })
    })

    document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = Number.parseInt(e.currentTarget.dataset.index)
        const currentQuantity = this.cart[index].quantity
        this.updateQuantity(index, currentQuantity + 1)
      })
    })

    // Quantity inputs
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = Number.parseInt(e.target.dataset.index)
        let quantity = Number.parseInt(e.target.value)

        if (isNaN(quantity) || quantity < 1) {
          quantity = 1
        } else if (quantity > 10) {
          quantity = 10
        }

        e.target.value = quantity
        this.updateQuantity(index, quantity)
      })

      input.addEventListener("blur", (e) => {
        if (e.target.value === "" || Number.parseInt(e.target.value) < 1) {
          e.target.value = 1
          const index = Number.parseInt(e.target.dataset.index)
          this.updateQuantity(index, 1)
        }
      })
    })
  }

  applyCoupon() {
    const couponInput = document.getElementById("coupon-input")
    if (!couponInput) return

    const couponCode = couponInput.value.trim().toUpperCase()

    if (!couponCode) {
      this.showNotification("Silakan masukkan kode kupon", "warning")
      return
    }

    const validCoupons = {
      DISKON10: { discount: 0.1, message: "Kupon berhasil diterapkan! Anda mendapatkan diskon 10%." },
      DISKON20: { discount: 0.2, message: "Kupon berhasil diterapkan! Anda mendapatkan diskon 20%." },
      WELCOME: { discount: 0.15, message: "Selamat datang! Anda mendapatkan diskon 15%." },
    }

    if (validCoupons[couponCode]) {
      couponInput.dataset.applied = "true"
      couponInput.disabled = true
      document.getElementById("apply-coupon").textContent = "Diterapkan"
      document.getElementById("apply-coupon").disabled = true

      this.updateSummary()
      this.showNotification(validCoupons[couponCode].message, "success")
    } else {
      this.showNotification("Kode kupon tidak valid atau sudah kadaluarsa", "error")
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="las ${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
    `

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      font-size: 0.9rem;
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  getNotificationIcon(type) {
    const icons = {
      success: "la-check-circle",
      error: "la-exclamation-circle",
      warning: "la-exclamation-triangle",
      info: "la-info-circle",
    }
    return icons[type] || icons.info
  }

  getNotificationColor(type) {
    const colors = {
      success: "#28a745",
      error: "#dc3545",
      warning: "#ffc107",
      info: "#17a2b8",
    }
    return colors[type] || colors.info
  }

  syncCartCount() {
    window.addEventListener("cartCountUpdated", (event) => {
      const badges = document.querySelectorAll(".badge")
      badges.forEach((badge) => {
        const count = event.detail.count
        if (count > 0) {
          badge.style.display = "flex"
          badge.textContent = count
        } else {
          badge.style.display = "none"
        }
      })
    })

    window.addEventListener("storage", (event) => {
      if (event.key === "cartCount") {
        const count = Number.parseInt(event.newValue) || 0
        const badges = document.querySelectorAll(".badge")
        badges.forEach((badge) => {
          if (count > 0) {
            badge.style.display = "flex"
            badge.textContent = count
          } else {
            badge.style.display = "none"
          }
        })
      }
    })
  }
}

// Initialize cart manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cartManager = new CartManager()

  // Add some sample items for demo
  if (window.cartManager.cart.length === 0) {
    window.cartManager.addToCart({
      id: 1,
      name: "Blouse Elegant",
      price: "Rp 329.000",
      image: "https://i.pinimg.com/736x/9e/37/d7/9e37d7607ebd223a0d636e018e56bc6c.jpg",
      category: "Tops",
      size: "M",
      color: "Hitam",
      quantity: 1,
    })

    window.cartManager.addToCart({
      id: 2,
      name: "Dress Casual",
      price: "Rp 459.000",
      image: "https://i.pinimg.com/736x/1f/9f/1b/1f9f1be976546ef5ffa3296e237cf36b.jpg",
      category: "Dresses",
      size: "L",
      color: "Merah",
      quantity: 1,
    })
  }
})

// Export for use in other pages
if (typeof module !== "undefined" && module.exports) {
  module.exports = CartManager
}
