document.addEventListener("DOMContentLoaded", () => {
  // Initialize orders page
  initOrdersPage()

  // Load user data
  loadUserData()

  // Load orders
  loadOrders()

  // Setup event listeners
  setupEventListeners()

  // Setup filters
  setupFilters()

  // Setup modals
  setupModals()
})

const currentPage = 1
const ordersPerPage = 5

function initOrdersPage() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
  if (!currentUser) {
    window.location.href = "login.html"
    return
  }

  // Update cart count
  updateCartCount()
}

function loadUserData() {
  const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
  if (!currentUser) return

  // Update user info in sidebar
  const userNameElement = document.getElementById("user-name")
  const userEmailElement = document.getElementById("user-email")
  const userAvatarElement = document.getElementById("user-avatar")

  if (userNameElement) {
    userNameElement.textContent = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "User"
  }

  if (userEmailElement) {
    userEmailElement.textContent = currentUser.email || "user@example.com"
  }

  if (userAvatarElement && currentUser.avatar) {
    userAvatarElement.src = currentUser.avatar
  }
}

function loadOrders() {
  const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
  const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))

  if (!currentUser) return

  // Filter transactions for current user
  const userOrders = transactions.filter((transaction) => transaction.customerEmail === currentUser.email)

  // Update statistics
  updateOrdersStats(userOrders)

  // Display orders
  displayOrders(userOrders)
}

function updateOrdersStats(orders) {
  const totalOrdersElement = document.getElementById("total-orders")
  const pendingOrdersElement = document.getElementById("pending-orders")
  const completedOrdersElement = document.getElementById("completed-orders")
  const totalSpentElement = document.getElementById("total-spent")

  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const completedOrders = orders.filter((order) => order.status === "completed").length
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)

  if (totalOrdersElement) totalOrdersElement.textContent = totalOrders
  if (pendingOrdersElement) pendingOrdersElement.textContent = pendingOrders
  if (completedOrdersElement) completedOrdersElement.textContent = completedOrders
  if (totalSpentElement) totalSpentElement.textContent = `Rp ${formatPrice(totalSpent)}`
}

function displayOrders(orders) {
  const ordersListElement = document.getElementById("orders-list")
  const emptyStateElement = document.getElementById("empty-state")

  if (!ordersListElement) return

  if (orders.length === 0) {
    ordersListElement.style.display = "none"
    if (emptyStateElement) {
      emptyStateElement.style.display = "block"
    }
    return
  }

  ordersListElement.style.display = "flex"
  if (emptyStateElement) {
    emptyStateElement.style.display = "none"
  }

  ordersListElement.innerHTML = ""

  orders.forEach((order) => {
    const orderElement = createOrderElement(order)
    ordersListElement.appendChild(orderElement)
  })
}

function createOrderElement(order) {
  const orderDiv = document.createElement("div")
  orderDiv.className = "order-item"
  orderDiv.setAttribute("data-order-id", order.transactionId)

  const orderDate = new Date(order.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const statusClass = getStatusClass(order.status)
  const statusText = getStatusText(order.status)

  orderDiv.innerHTML = `
        <div class="order-header">
            <div class="order-id">
                <span>ID Pesanan:</span>
                <strong>${order.transactionId}</strong>
            </div>
            <div class="order-date">
                <span>Tanggal:</span>
                <strong>${orderDate}</strong>
            </div>
            <div class="order-status">
                <span class="${statusClass}">${statusText}</span>
            </div>
        </div>
        <div class="order-products">
            ${createOrderProductsHTML(order)}
        </div>
        <div class="order-footer">
            <div class="order-total">
                <span>Total:</span>
                <strong>Rp ${formatPrice(order.total)}</strong>
            </div>
            <div class="order-actions">
                ${createOrderActionsHTML(order)}
            </div>
        </div>
    `

  return orderDiv
}

function createOrderProductsHTML(order) {
  const products = order.products ? order.products.split(", ") : []
  const quantities = order.quantity ? order.quantity.split(", ") : []

  let productsHTML = ""

  products.forEach((product, index) => {
    const quantity = quantities[index] || "1"
    productsHTML += `
            <div class="order-product">
                <div class="order-product-image" style="background-image: url('/placeholder.svg?height=80&width=80');"></div>
                <div class="order-product-details">
                    <h4>${product}</h4>
                    <p>Jumlah: ${quantity}</p>
                </div>
            </div>
        `
  })

  return productsHTML
}

function createOrderActionsHTML(order) {
  let actionsHTML = `
        <button class="btn-sm view-detail-btn" data-order-id="${order.transactionId}">
            <i class="las la-eye"></i> Detail Pesanan
        </button>
    `

  switch (order.status) {
    case "pending":
      actionsHTML += `
                <button class="btn-sm pay-now-btn" data-order-id="${order.transactionId}">
                    <i class="las la-credit-card"></i> Bayar Sekarang
                </button>
                <button class="btn-sm cancel-order-btn" data-order-id="${order.transactionId}">
                    <i class="las la-times"></i> Batalkan
                </button>
            `
      break
    case "shipped":
      actionsHTML += `
                <button class="btn-sm track-order-btn" data-order-id="${order.transactionId}">
                    <i class="las la-truck"></i> Lacak Pengiriman
                </button>
            `
      break
    case "delivered":
    case "completed":
      actionsHTML += `
                <button class="btn-sm review-btn" data-order-id="${order.transactionId}">
                    <i class="las la-star"></i> Beri Ulasan
                </button>
                <button class="btn-sm buy-again-btn" data-order-id="${order.transactionId}">
                    <i class="las la-redo"></i> Beli Lagi
                </button>
            `
      break
  }

  return actionsHTML
}

function getStatusClass(status) {
  const statusClasses = {
    pending: "status-pending",
    paid: "status-paid",
    processing: "status-processing",
    shipped: "status-shipped",
    delivered: "status-delivered",
    completed: "status-completed",
    cancelled: "status-cancelled",
    refunded: "status-refunded",
  }
  return statusClasses[status] || "status-pending"
}

function getStatusText(status) {
  const statusTexts = {
    pending: "Menunggu Pembayaran",
    paid: "Sudah Dibayar",
    processing: "Sedang Diproses",
    shipped: "Dikirim",
    delivered: "Terkirim",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    refunded: "Dikembalikan",
  }
  return statusTexts[status] || "Menunggu Pembayaran"
}

function setupEventListeners() {
  // Logout button
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("Apakah Anda yakin ingin keluar?")) {
        localStorage.removeItem("ameza_current_user")
        window.location.href = "login.html"
      }
    })
  }

  // Order action buttons (using event delegation)
  document.addEventListener("click", (e) => {
    if (e.target.closest(".view-detail-btn")) {
      const orderId = e.target.closest(".view-detail-btn").getAttribute("data-order-id")
      showOrderDetail(orderId)
    }

    if (e.target.closest(".track-order-btn")) {
      const orderId = e.target.closest(".track-order-btn").getAttribute("data-order-id")
      showTrackingModal(orderId)
    }

    if (e.target.closest(".review-btn")) {
      const orderId = e.target.closest(".review-btn").getAttribute("data-order-id")
      showReviewModal(orderId)
    }

    if (e.target.closest(".pay-now-btn")) {
      const orderId = e.target.closest(".pay-now-btn").getAttribute("data-order-id")
      showPaymentModal(orderId)
    }

    if (e.target.closest(".cancel-order-btn")) {
      const orderId = e.target.closest(".cancel-order-btn").getAttribute("data-order-id")
      cancelOrder(orderId)
    }

    if (e.target.closest(".buy-again-btn")) {
      const orderId = e.target.closest(".buy-again-btn").getAttribute("data-order-id")
      buyAgain(orderId)
    }
  })
}

function setupFilters() {
  const periodFilter = document.getElementById("order-period")
  const statusFilter = document.getElementById("order-status")
  const searchInput = document.getElementById("order-search")
  const searchBtn = document.querySelector(".search-btn")

  if (periodFilter) {
    periodFilter.addEventListener("change", applyFilters)
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", applyFilters)
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters)
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", applyFilters)
  }
}

function applyFilters() {
  const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
  const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))

  if (!currentUser) return

  let filteredOrders = transactions.filter((transaction) => transaction.customerEmail === currentUser.email)

  // Apply period filter
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
      case "last-year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    filteredOrders = filteredOrders.filter((order) => new Date(order.date) >= startDate)
  }

  // Apply status filter
  const statusFilter = document.getElementById("order-status")
  if (statusFilter && statusFilter.value !== "all") {
    filteredOrders = filteredOrders.filter((order) => order.status === statusFilter.value)
  }

  // Apply search filter
  const searchInput = document.getElementById("order-search")
  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.trim().toLowerCase()
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.transactionId.toLowerCase().includes(searchTerm) ||
        (order.products && order.products.toLowerCase().includes(searchTerm)),
    )
  }

  // Update statistics and display
  updateOrdersStats(filteredOrders)
  displayOrders(filteredOrders)
}

function setupModals() {
  // Close modal buttons
  const closeModalBtns = document.querySelectorAll(".close-modal")
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      if (modal) {
        modal.classList.remove("active")
      }
    })
  })

  // Close modal when clicking outside
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active")
      }
    })
  })
}

function showOrderDetail(orderId) {
  const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
  const order = transactions.find((t) => t.transactionId === orderId)

  if (!order) return

  const modal = document.getElementById("order-detail-modal")
  if (!modal) return

  // Update modal content
  document.getElementById("detail-order-id").textContent = order.transactionId
  document.getElementById("detail-status").textContent = getStatusText(order.status)
  document.getElementById("detail-status").className = `detail-value ${getStatusClass(order.status)}`

  const orderDate = new Date(order.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  document.getElementById("detail-date").textContent = orderDate
  document.getElementById("detail-payment").textContent = order.paymentMethod || "Transfer Bank"
  document.getElementById("detail-payment-status").textContent =
    order.status === "pending" ? "Belum Dibayar" : "Sudah Dibayar"

  // Update shipping address
  const shippingAddressElement = document.getElementById("shipping-address")
  if (shippingAddressElement) {
    shippingAddressElement.innerHTML = `
            <p><strong>${order.customerName}</strong></p>
            <p>${order.shippingAddress}</p>
            <p>${order.customerPhone}</p>
        `
  }

  // Update products
  const detailProductsElement = document.getElementById("detail-products")
  if (detailProductsElement) {
    const products = order.products ? order.products.split(", ") : []
    const quantities = order.quantity ? order.quantity.split(", ") : []

    let productsHTML = ""
    products.forEach((product, index) => {
      const quantity = quantities[index] || "1"
      productsHTML += `
                <div class="order-detail-product">
                    <div class="product-image">
                        <img src="/placeholder.svg?height=80&width=80" alt="${product}">
                    </div>
                    <div class="product-info">
                        <h4>${product}</h4>
                        <p>Jumlah: ${quantity}</p>
                    </div>
                    <div class="product-total">
                        Rp ${formatPrice(order.subtotal / products.length)}
                    </div>
                </div>
            `
    })
    detailProductsElement.innerHTML = productsHTML
  }

  // Update payment summary
  const paymentSummaryElement = document.getElementById("payment-summary")
  if (paymentSummaryElement) {
    paymentSummaryElement.innerHTML = `
            <div class="payment-row">
                <span>Subtotal Produk</span>
                <span>Rp ${formatPrice(order.subtotal || 0)}</span>
            </div>
            <div class="payment-row">
                <span>Biaya Pengiriman</span>
                <span>Rp ${formatPrice(order.shipping || 0)}</span>
            </div>
            <div class="payment-row">
                <span>Diskon</span>
                <span>- Rp ${formatPrice(order.discount || 0)}</span>
            </div>
            <div class="payment-row total">
                <span>Total Pembayaran</span>
                <span>Rp ${formatPrice(order.total)}</span>
            </div>
        `
  }

  modal.classList.add("active")
}

function showTrackingModal(orderId) {
  const modal = document.getElementById("tracking-modal")
  if (!modal) return

  // Generate tracking number
  const trackingNumber = `JNE${Math.floor(Math.random() * 1000000000)}`
  document.getElementById("tracking-number").textContent = trackingNumber
  document.getElementById("courier-name").textContent = "JNE Express"
  document.getElementById("tracking-status").textContent = "Dalam Perjalanan"
  document.getElementById("tracking-status").className = "status-shipped"

  // Generate tracking timeline
  const timelineElement = document.getElementById("tracking-timeline")
  if (timelineElement) {
    timelineElement.innerHTML = `
            <div class="timeline-item completed">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${new Date().toLocaleDateString("id-ID")} 11:15 WIB</div>
                    <div class="timeline-title">Paket telah diserahkan ke kurir</div>
                    <div class="timeline-desc">Jakarta Selatan</div>
                </div>
            </div>
            <div class="timeline-item completed">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${new Date().toLocaleDateString("id-ID")} 15:30 WIB</div>
                    <div class="timeline-title">Paket telah tiba di gudang sortir</div>
                    <div class="timeline-desc">Jakarta Selatan</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <div class="timeline-date">Estimasi besok 08:45 WIB</div>
                    <div class="timeline-title">Paket dalam perjalanan ke alamat Anda</div>
                    <div class="timeline-desc">Sedang dalam perjalanan</div>
                </div>
            </div>
        `
  }

  modal.classList.add("active")
}

function showReviewModal(orderId) {
  const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
  const order = transactions.find((t) => t.transactionId === orderId)

  if (!order) return

  const modal = document.getElementById("review-modal")
  if (!modal) return

  const reviewProductsElement = document.getElementById("review-products")
  if (reviewProductsElement) {
    const products = order.products ? order.products.split(", ") : []

    let productsHTML = ""
    products.forEach((product) => {
      productsHTML += `
                <div class="review-product">
                    <div class="product-image">
                        <img src="/placeholder.svg?height=80&width=80" alt="${product}">
                    </div>
                    <div class="product-info">
                        <h4>${product}</h4>
                    </div>
                    <div class="product-rating">
                        <div class="rating-stars">
                            <i class="lar la-star" data-rating="1"></i>
                            <i class="lar la-star" data-rating="2"></i>
                            <i class="lar la-star" data-rating="3"></i>
                            <i class="lar la-star" data-rating="4"></i>
                            <i class="lar la-star" data-rating="5"></i>
                        </div>
                        <textarea placeholder="Bagikan pendapat Anda tentang produk ini..."></textarea>
                        <div class="review-photos">
                            <button class="add-photo"><i class="las la-camera"></i> Tambah Foto</button>
                        </div>
                    </div>
                </div>
            `
    })
    reviewProductsElement.innerHTML = productsHTML

    // Setup star rating
    setupStarRating()
  }

  modal.classList.add("active")
}

function setupStarRating() {
  const stars = document.querySelectorAll(".rating-stars i")
  stars.forEach((star) => {
    star.addEventListener("click", function () {
      const rating = Number.parseInt(this.getAttribute("data-rating"))
      const starsContainer = this.parentElement
      const allStars = starsContainer.querySelectorAll("i")

      allStars.forEach((s, index) => {
        if (index < rating) {
          s.className = "las la-star"
        } else {
          s.className = "lar la-star"
        }
      })
    })
  })
}

function showPaymentModal(orderId) {
  const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
  const order = transactions.find((t) => t.transactionId === orderId)

  if (!order) return

  const modal = document.getElementById("payment-modal")
  if (!modal) return

  document.getElementById("payment-order-id").textContent = order.transactionId
  document.getElementById("payment-total").textContent = `Rp ${formatPrice(order.total)}`

  // Setup payment processing
  const processPaymentBtn = document.getElementById("process-payment")
  if (processPaymentBtn) {
    processPaymentBtn.onclick = () => {
      processPayment(orderId)
    }
  }

  modal.classList.add("active")
}

function processPayment(orderId) {
  const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
  const orderIndex = transactions.findIndex((t) => t.transactionId === orderId)

  if (orderIndex === -1) return

  // Update order status
  transactions[orderIndex].status = "paid"
  localStorage.setItem("ameza_transactions", JSON.stringify(transactions))

  // Close modal
  const modal = document.getElementById("payment-modal")
  if (modal) {
    modal.classList.remove("active")
  }

  // Reload orders
  loadOrders()

  alert("Pembayaran berhasil diproses!")
}

function cancelOrder(orderId) {
  if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
    return
  }

  const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
  const orderIndex = transactions.findIndex((t) => t.transactionId === orderId)

  if (orderIndex === -1) return

  // Update order status
  transactions[orderIndex].status = "cancelled"
  localStorage.setItem("ameza_transactions", JSON.stringify(transactions))

  // Reload orders
  loadOrders()

  alert("Pesanan berhasil dibatalkan.")
}

function buyAgain(orderId) {
  const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
  const order = transactions.find((t) => t.transactionId === orderId)

  if (!order) return

  // Add products to cart (simplified)
  const products = order.products ? order.products.split(", ") : []
  const cart = JSON.parse(localStorage.getItem("ameza_cart")) || []

  products.forEach((productName) => {
    cart.push({
      id: Date.now() + Math.random(),
      name: productName,
      price: 150000, // Default price
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
    })
  })

  localStorage.setItem("ameza_cart", JSON.stringify(cart))
  updateCartCount()

  alert("Produk berhasil ditambahkan ke keranjang!")
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("ameza_cart")) || []
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    cartCount.textContent = cart.length
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price)
}
