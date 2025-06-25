// Orders Manager Class
class OrdersManager {
  constructor() {
    this.currentUser = null
    this.orders = []
    this.filteredOrders = []
    this.init()
  }

  init() {
    this.checkAuth()
    this.loadUserData()
    this.forceCreateOrders() // Force create new orders
    this.loadOrders()
    this.bindEvents()
    this.updateCartCount()
  }

  checkAuth() {
    this.currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    if (!this.currentUser) {
      // For demo purposes, create a demo user
      this.currentUser = {
        firstName: "User",
      
        email: "demo@amezafashion.com",
        avatar: "/placeholder.svg?height=80&width=80",
      }
      localStorage.setItem("ameza_current_user", JSON.stringify(this.currentUser))
    }
  }

  loadUserData() {
    if (!this.currentUser) return

    // Update user info in sidebar and mobile
    const elements = {
      "user-name": `${this.currentUser.firstName || ""} ${this.currentUser.lastName || ""}`.trim() || "User",
      "user-email": this.currentUser.email || "demo@amezafashion.com",
      "mobile-user-name":
        `${this.currentUser.firstName || ""} ${this.currentUser.lastName || ""}`.trim() || "Demo User",
      "mobile-user-email": this.currentUser.email || "demo@amezafashion.com",
    }

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) element.textContent = value
    })

    // Update avatars
    const avatars = ["user-avatar", "mobile-user-avatar"]
    avatars.forEach((id) => {
      const element = document.getElementById(id)
      if (element && this.currentUser.avatar) {
        element.src = this.currentUser.avatar
      }
    })
  }

  loadOrders() {
    // Load orders from localStorage or create demo orders
    let storedOrders = JSON.parse(localStorage.getItem("amezaOrders")) || []

    // If no orders exist, create demo orders
    if (storedOrders.length === 0) {
      storedOrders = this.createDemoOrders()
      localStorage.setItem("amezaOrders", JSON.stringify(storedOrders))
    }

    // Filter orders for current user
    this.orders = storedOrders.filter((order) => order.address && order.address.email === this.currentUser.email)

    this.filteredOrders = [...this.orders]
    this.updateStats()
    this.renderOrders()
  }

  createDemoOrders() {
    const demoOrders = [
      {
        id: "AMZ" + Date.now().toString().slice(-8),
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        status: "delivered",
        items: [
          {
            id: 1,
            name: "Blouse Elegant Premium",
            price: "Rp 329.000",
            image: "https://i.pinimg.com/736x/9e/37/d7/9e37d7607ebd223a0d636e018e56bc6c.jpg",
            category: "Tops",
            size: "M",
            color: "Hitam",
            quantity: 1,
          },
          {
            id: 2,
            name: "Celana Kulot Casual",
            price: "Rp 189.000",
            image: "https://i.pinimg.com/736x/1f/9f/1b/1f9f1be976546ef5ffa3296e237cf36b.jpg",
            category: "Bottoms",
            size: "L",
            color: "Navy",
            quantity: 1,
          },
        ],
        address: {
          fullname: this.currentUser.firstName + " " + this.currentUser.lastName,
          email: this.currentUser.email,
          phone: "+62 812 3456 7890",
          address: "Jl. Sudirman No. 123, RT 01/RW 02",
          city: "Jakarta Selatan",
          province: "DKI Jakarta",
          postalCode: "12190",
        },
        payment: {
          method: "bca",
          name: "Bank BCA",
        },
        subtotal: 518000,
        shipping: 25000,
        discount: 50000,
        total: 493000,
      },
      {
        id: "AMZ" + (Date.now() - 1000).toString().slice(-8),
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: "shipped",
        items: [
          {
            id: 3,
            name: "Dress Casual Floral",
            price: "Rp 459.000",
            image: "https://i.pinimg.com/736x/1f/9f/1b/1f9f1be976546ef5ffa3296e237cf36b.jpg",
            category: "Dresses",
            size: "M",
            color: "Floral Print",
            quantity: 1,
          },
        ],
        address: {
          fullname: this.currentUser.firstName + " " + this.currentUser.lastName,
          email: this.currentUser.email,
          phone: "+62 812 3456 7890",
          address: "Jl. Sudirman No. 123, RT 01/RW 02",
          city: "Jakarta Selatan",
          province: "DKI Jakarta",
          postalCode: "12190",
        },
        payment: {
          method: "mandiri",
          name: "Bank Mandiri",
        },
        subtotal: 459000,
        shipping: 25000,
        discount: 0,
        total: 484000,
      },
      {
        id: "AMZ" + (Date.now() - 2000).toString().slice(-8),
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        status: "pending",
        items: [
          {
            id: 4,
            name: "Kemeja Formal Putih",
            price: "Rp 289.000",
            image: "https://i.pinimg.com/736x/9e/37/d7/9e37d7607ebd223a0d636e018e56bc6c.jpg",
            category: "Shirts",
            size: "L",
            color: "Putih",
            quantity: 2,
          },
          {
            id: 5,
            name: "Rok Mini Denim",
            price: "Rp 199.000",
            image: "https://i.pinimg.com/736x/1f/9f/1b/1f9f1be976546ef5ffa3296e237cf36b.jpg",
            category: "Bottoms",
            size: "S",
            color: "Light Blue",
            quantity: 1,
          },
        ],
        address: {
          fullname: this.currentUser.firstName + " " + this.currentUser.lastName,
          email: this.currentUser.email,
          phone: "+62 812 3456 7890",
          address: "Jl. Sudirman No. 123, RT 01/RW 02",
          city: "Jakarta Selatan",
          province: "DKI Jakarta",
          postalCode: "12190",
        },
        payment: {
          method: "bca",
          name: "Bank BCA",
        },
        subtotal: 777000,
        shipping: 25000,
        discount: 100000,
        total: 702000,
      },
      {
        id: "AMZ" + (Date.now() - 3000).toString().slice(-8),
        date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        status: "completed",
        items: [
          {
            id: 6,
            name: "Jaket Denim Oversized",
            price: "Rp 399.000",
            image: "https://i.pinimg.com/736x/9e/37/d7/9e37d7607ebd223a0d636e018e56bc6c.jpg",
            category: "Outerwear",
            size: "M",
            color: "Dark Blue",
            quantity: 1,
          },
        ],
        address: {
          fullname: this.currentUser.firstName + " " + this.currentUser.lastName,
          email: this.currentUser.email,
          phone: "+62 812 3456 7890",
          address: "Jl. Sudirman No. 123, RT 01/RW 02",
          city: "Jakarta Selatan",
          province: "DKI Jakarta",
          postalCode: "12190",
        },
        payment: {
          method: "gopay",
          name: "GoPay",
        },
        subtotal: 399000,
        shipping: 25000,
        discount: 0,
        total: 424000,
      },
    ]

    return demoOrders
  }

  updateStats() {
    const totalOrders = this.orders.length
    const pendingOrders = this.orders.filter((order) => order.status === "pending").length
    const completedOrders = this.orders.filter(
      (order) => order.status === "completed" || order.status === "delivered",
    ).length
    const totalSpent = this.orders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Update stat elements
    const stats = {
      "total-orders": totalOrders,
      "pending-orders": pendingOrders,
      "completed-orders": completedOrders,
      "total-spent": this.formatPrice(totalSpent),
    }

    Object.entries(stats).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) element.textContent = value
    })
  }

  renderOrders() {
    const ordersListElement = document.getElementById("orders-list")
    const emptyStateElement = document.getElementById("empty-state")

    if (!ordersListElement) return

    if (this.filteredOrders.length === 0) {
      ordersListElement.style.display = "none"
      if (emptyStateElement) emptyStateElement.style.display = "block"
      return
    }

    ordersListElement.style.display = "flex"
    if (emptyStateElement) emptyStateElement.style.display = "none"

    ordersListElement.innerHTML = ""

    this.filteredOrders.forEach((order) => {
      const orderElement = this.createOrderElement(order)
      ordersListElement.appendChild(orderElement)
    })
  }

  createOrderElement(order) {
    const orderDiv = document.createElement("div")
    orderDiv.className = "order-item"
    orderDiv.setAttribute("data-order-id", order.id)

    const orderDate = new Date(order.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const statusClass = this.getStatusClass(order.status)
    const statusText = this.getStatusText(order.status)

    orderDiv.innerHTML = `
      <div class="order-header">
        <div class="order-info">
          <div class="order-id">
            <span>ID Pesanan:</span>
            <strong>#${order.id}</strong>
          </div>
          <div class="order-date">
            <span>Tanggal:</span>
            <strong>${orderDate}</strong>
          </div>
        </div>
        <div class="order-status">
          <span class="${statusClass}">${statusText}</span>
        </div>
      </div>
      <div class="order-products">
        ${this.createOrderProductsHTML(order)}
      </div>
      <div class="order-footer">
        <div class="order-total">
          <span>Total: </span>
          <strong>${this.formatPrice(order.total)}</strong>
        </div>
        <div class="order-actions">
          ${this.createOrderActionsHTML(order)}
        </div>
      </div>
    `

    return orderDiv
  }

  createOrderProductsHTML(order) {
    if (!order.items || order.items.length === 0) return ""

    return order.items
      .map(
        (item) => `
      <div class="order-product">
        <div class="order-product-image">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=60&width=60'">
        </div>
        <div class="order-product-details">
          <h4>${item.name}</h4>
          <p>Ukuran: ${item.size || "M"} | Warna: ${item.color || "Default"}</p>
          <p>Jumlah: ${item.quantity}</p>
        </div>
      </div>
    `,
      )
      .join("")
  }

  createOrderActionsHTML(order) {
    let actionsHTML = `
      <button class="btn btn-sm btn-secondary view-detail-btn" data-order-id="${order.id}">
        <i class="las la-eye"></i>
        <span>Detail</span>
      </button>
    `

    switch (order.status) {
      case "pending":
        actionsHTML += `
          <button class="btn btn-sm btn-primary pay-now-btn" data-order-id="${order.id}">
            <i class="las la-credit-card"></i>
            <span>Bayar</span>
          </button>
        `
        break
      case "shipped":
        actionsHTML += `
          <button class="btn btn-sm btn-primary track-order-btn" data-order-id="${order.id}">
            <i class="las la-truck"></i>
            <span>Lacak</span>
          </button>
        `
        break
      case "delivered":
      case "completed":
        actionsHTML += `
          <button class="btn btn-sm btn-primary buy-again-btn" data-order-id="${order.id}">
            <i class="las la-redo"></i>
            <span>Beli Lagi</span>
          </button>
        `
        break
    }

    return actionsHTML
  }

  getStatusClass(status) {
    const statusClasses = {
      pending: "status-pending",
      paid: "status-paid",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      completed: "status-completed",
      cancelled: "status-cancelled",
    }
    return statusClasses[status] || "status-pending"
  }

  getStatusText(status) {
    const statusTexts = {
      pending: "Menunggu Pembayaran",
      paid: "Sudah Dibayar",
      processing: "Sedang Diproses",
      shipped: "Dikirim",
      delivered: "Terkirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    }
    return statusTexts[status] || "Menunggu Pembayaran"
  }

  bindEvents() {
    // Logout buttons
    const logoutBtns = ["logout-btn", "mobile-logout-btn"]
    logoutBtns.forEach((id) => {
      const btn = document.getElementById(id)
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          if (confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem("ameza_current_user")
            window.location.href = "login.html"
          }
        })
      }
    })

    // Filter events
    this.bindFilterEvents()

    // Modal events
    this.bindModalEvents()

    // Order action events (using event delegation)
    document.addEventListener("click", (e) => {
      const target = e.target.closest("button")
      if (!target) return

      const orderId = target.getAttribute("data-order-id")
      if (!orderId) return

      if (target.classList.contains("view-detail-btn")) {
        this.showOrderDetail(orderId)
      } else if (target.classList.contains("track-order-btn")) {
        this.showTrackingModal(orderId)
      } else if (target.classList.contains("pay-now-btn")) {
        this.processPayment(orderId)
      } else if (target.classList.contains("buy-again-btn")) {
        this.buyAgain(orderId)
      }
    })
  }

  bindFilterEvents() {
    const filters = ["order-status", "order-period", "order-search"]
    filters.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        element.addEventListener("change", () => this.applyFilters())
        if (id === "order-search") {
          element.addEventListener("input", () => this.applyFilters())
        }
      }
    })

    const searchBtn = document.querySelector(".search-btn")
    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.applyFilters())
    }
  }

  bindModalEvents() {
    // Close modal buttons
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal")
        if (modal) modal.classList.remove("active")
      })
    })

    // Close modal when clicking outside
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
        }
      })
    })
  }

  applyFilters() {
    let filtered = [...this.orders]

    // Status filter
    const statusFilter = document.getElementById("order-status")
    if (statusFilter && statusFilter.value !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter.value)
    }

    // Period filter
    const periodFilter = document.getElementById("order-period")
    if (periodFilter && periodFilter.value !== "all") {
      const now = new Date()
      const startDate = new Date()

      switch (periodFilter.value) {
        case "last-month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "last-3-months":
          startDate.setMonth(now.getMonth() - 3)
          break
        case "last-6-months":
          startDate.setMonth(now.getMonth() - 6)
          break
      }

      filtered = filtered.filter((order) => new Date(order.date) >= startDate)
    }

    // Search filter
    const searchInput = document.getElementById("order-search")
    if (searchInput && searchInput.value.trim()) {
      const searchTerm = searchInput.value.trim().toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm) ||
          (order.items && order.items.some((item) => item.name.toLowerCase().includes(searchTerm))),
      )
    }

    this.filteredOrders = filtered
    this.renderOrders()
  }

  showOrderDetail(orderId) {
    const order = this.orders.find((o) => o.id === orderId)
    if (!order) return

    const modal = document.getElementById("order-detail-modal")
    if (!modal) return

    // Update modal content
    document.getElementById("detail-order-id").textContent = `#${order.id}`

    const statusElement = document.getElementById("detail-status")
    statusElement.textContent = this.getStatusText(order.status)
    statusElement.className = `detail-value ${this.getStatusClass(order.status)}`

    const orderDate = new Date(order.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    document.getElementById("detail-date").textContent = orderDate
    document.getElementById("detail-payment").textContent = order.payment?.name || "Transfer Bank"
    document.getElementById("detail-payment-status").textContent =
      order.status === "pending" ? "Belum Dibayar" : "Sudah Dibayar"

    // Update shipping address
    const shippingAddressElement = document.getElementById("shipping-address")
    if (shippingAddressElement && order.address) {
      shippingAddressElement.innerHTML = `
        <p><strong>${order.address.fullname}</strong></p>
        <p>${order.address.address}</p>
        <p>${order.address.city}, ${order.address.province} ${order.address.postalCode}</p>
        <p>${order.address.phone}</p>
      `
    }

    // Update products
    const detailProductsElement = document.getElementById("detail-products")
    if (detailProductsElement && order.items) {
      detailProductsElement.innerHTML = order.items
        .map(
          (item) => `
        <div class="order-detail-product">
          <div class="product-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=60&width=60'">
          </div>
          <div class="product-info">
            <h4>${item.name}</h4>
            <p>Ukuran: ${item.size || "M"}</p>
            <p>Warna: ${item.color || "Default"}</p>
            <p>Jumlah: ${item.quantity}</p>
          </div>
          <div class="product-total">
            ${item.price}
          </div>
        </div>
      `,
        )
        .join("")
    }

    // Update payment summary
    const paymentSummaryElement = document.getElementById("payment-summary")
    if (paymentSummaryElement) {
      paymentSummaryElement.innerHTML = `
        <div class="payment-row">
          <span>Subtotal Produk</span>
          <span>${this.formatPrice(order.subtotal || 0)}</span>
        </div>
        <div class="payment-row">
          <span>Biaya Pengiriman</span>
          <span>${this.formatPrice(order.shipping || 0)}</span>
        </div>
        <div class="payment-row">
          <span>Diskon</span>
          <span>- ${this.formatPrice(order.discount || 0)}</span>
        </div>
        <div class="payment-row total">
          <span>Total Pembayaran</span>
          <span>${this.formatPrice(order.total)}</span>
        </div>
      `
    }

    // Update buy again button
    const buyAgainBtn = document.getElementById("buy-again")
    if (buyAgainBtn) {
      buyAgainBtn.setAttribute("data-order-id", order.id)
      buyAgainBtn.addEventListener("click", () => this.buyAgain(order.id))
    }

    modal.classList.add("active")
  }

  showTrackingModal(orderId) {
    const modal = document.getElementById("tracking-modal")
    if (!modal) return

    // Generate tracking data
    const trackingNumber = `JNE${Math.floor(Math.random() * 1000000000)}`
    document.getElementById("tracking-number").textContent = trackingNumber
    document.getElementById("courier-name").textContent = "JNE Express"

    const timelineElement = document.getElementById("tracking-timeline")
    if (timelineElement) {
      const today = new Date()
      const yesterday = new Date(today.getTime() - 86400000)

      timelineElement.innerHTML = `
        <div class="timeline-item completed">
          <div class="timeline-point"></div>
          <div class="timeline-content">
            <div class="timeline-date">${yesterday.toLocaleDateString("id-ID")} 14:30 WIB</div>
            <div class="timeline-title">Paket telah diterima oleh kurir</div>
            <div class="timeline-desc">Jakarta Selatan - Gudang Sortir</div>
          </div>
        </div>
        <div class="timeline-item completed">
          <div class="timeline-point"></div>
          <div class="timeline-content">
            <div class="timeline-date">${today.toLocaleDateString("id-ID")} 08:15 WIB</div>
            <div class="timeline-title">Paket dalam perjalanan</div>
            <div class="timeline-desc">Menuju alamat tujuan</div>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-point"></div>
          <div class="timeline-content">
            <div class="timeline-date">Estimasi hari ini 16:00 WIB</div>
            <div class="timeline-title">Paket akan segera tiba</div>
            <div class="timeline-desc">Kurir sedang dalam perjalanan ke alamat Anda</div>
          </div>
        </div>
      `
    }

    modal.classList.add("active")
  }

  processPayment(orderId) {
    if (!confirm("Lanjutkan ke halaman pembayaran?")) return

    // Simulate payment process
    const order = this.orders.find((o) => o.id === orderId)
    if (order) {
      order.status = "paid"

      // Update localStorage
      const allOrders = JSON.parse(localStorage.getItem("amezaOrders")) || []
      const orderIndex = allOrders.findIndex((o) => o.id === orderId)
      if (orderIndex !== -1) {
        allOrders[orderIndex] = order
        localStorage.setItem("amezaOrders", JSON.stringify(allOrders))
      }

      this.updateStats()
      this.renderOrders()
      this.showNotification("Pembayaran berhasil diproses!", "success")
    }
  }

  buyAgain(orderId) {
    const order = this.orders.find((o) => o.id === orderId)
    if (!order || !order.items) return

    // Add items to cart
    const cart = JSON.parse(localStorage.getItem("amezaCart")) || []

    order.items.forEach((item) => {
      cart.push({
        id: Date.now() + Math.random(),
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })
    })

    localStorage.setItem("amezaCart", JSON.stringify(cart))
    this.updateCartCount()
    this.showNotification("Produk berhasil ditambahkan ke keranjang!", "success")
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("amezaCart")) || []
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    const cartCountElements = document.querySelectorAll("#cart-count, #cart-count-mobile")
    cartCountElements.forEach((element) => {
      if (element) element.textContent = totalItems
    })

    const badges = document.querySelectorAll(".badge")
    badges.forEach((badge) => {
      if (totalItems > 0) {
        badge.style.display = "flex"
        badge.textContent = totalItems
      } else {
        badge.style.display = "none"
      }
    })
  }

  formatPrice(price) {
    return `Rp ${price.toLocaleString("id-ID")}`
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

  forceCreateOrders() {
    // Always create fresh demo orders for testing
    const demoOrders = this.createDemoOrders()
    localStorage.setItem("amezaOrders", JSON.stringify(demoOrders))
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.ordersManager = new OrdersManager()
})

// Export for use in other pages
if (typeof module !== "undefined" && module.exports) {
  module.exports = OrdersManager
}
