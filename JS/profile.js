document.addEventListener("DOMContentLoaded", () => {
  // Initialize sample order data
  function initializeSampleOrders() {
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user")) || {
      email: "budi.santoso@email.com",
    }

    // Check if sample orders already exist
    let transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []

    // Remove existing sample orders for this user to avoid duplicates
    transactions = transactions.filter((t) => t.customerEmail !== currentUser.email)

    // Sample orders with different statuses
    const sampleOrders = [
      {
        transactionId: "AMZ001",
        customerEmail: currentUser.email,
        customerName: "Budi Santoso",
        products: "Blouse Elegant",
        quantity: 1,
        total: 120000,
        status: "completed",
        date: "2023-11-15",
        paymentMethod: "Transfer Bank",
        shippingAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
      },
      {
        transactionId: "AMZ002",
        customerEmail: currentUser.email,
        customerName: "Budi Santoso",
        products: "Rok Putih Pita",
        quantity: 1,
        total: 100000,
        status: "shipped",
        date: "2023-11-20",
        paymentMethod: "E-Wallet",
        shippingAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
      },
      {
        transactionId: "AMZ003",
        customerEmail: currentUser.email,
        customerName: "Budi Santoso",
        products: "Kemeja Crop",
        quantity: 1,
        total: 180000,
        status: "processing",
        date: "2023-11-25",
        paymentMethod: "Credit Card",
        shippingAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
      },
      {
        transactionId: "AMZ004",
        customerEmail: currentUser.email,
        customerName: "Budi Santoso",
        products: "Celana Jeans Gambar",
        quantity: 1,
        total: 165000,
        status: "completed",
        date: "2023-10-30",
        paymentMethod: "Transfer Bank",
        shippingAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
      },
      {
        transactionId: "AMZ005",
        customerEmail: currentUser.email,
        customerName: "Budi Santoso",
        products: "Blouse Elegant",
        quantity: 2,
        total: 240000,
        status: "pending",
        date: "2023-11-28",
        paymentMethod: "Transfer Bank",
        shippingAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
      },
      {
        transactionId: "AMZ006",
        customerEmail: currentUser.email,
        customerName: "Budi Santoso",
        products: "Rok Putih Pita",
        quantity: 1,
        total: 100000,
        status: "completed",
        date: "2023-10-15",
        paymentMethod: "E-Wallet",
        shippingAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
      },
    ]

    // Add sample orders to transactions
    transactions.push(...sampleOrders)

    // Save to localStorage
    localStorage.setItem("ameza_transactions", JSON.stringify(transactions))
  }

  // Load user data from localStorage
  function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user")) || {
      firstName: "Budi",
      lastName: "Santoso",
      email: "budi.santoso@email.com",
      phone: "+62 812 3456 7890",
    }

    // Save default user if not exists
    if (!localStorage.getItem("ameza_current_user")) {
      localStorage.setItem("ameza_current_user", JSON.stringify(currentUser))
    }

    // Update profile display
    const profileName = document.getElementById("profile-display-name")
    const profileEmail = document.getElementById("profile-display-email")
    const welcomeMessage = document.getElementById("welcome-message")
    const profileAvatar = document.getElementById("profile-avatar-img")

    if (profileName) {
      profileName.textContent = `${currentUser.firstName} ${currentUser.lastName}`
    }
    if (profileEmail) {
      profileEmail.textContent = currentUser.email
    }
    if (welcomeMessage) {
      welcomeMessage.textContent = `Selamat Datang, ${currentUser.firstName}!`
    }
    if (profileAvatar && currentUser.avatar) {
      profileAvatar.src = currentUser.avatar
    }

    // Fill form fields
    const firstNameInput = document.getElementById("first-name")
    const lastNameInput = document.getElementById("last-name")
    const emailInput = document.getElementById("profile-email")
    const phoneInput = document.getElementById("profile-phone")

    if (firstNameInput) firstNameInput.value = currentUser.firstName || ""
    if (lastNameInput) lastNameInput.value = currentUser.lastName || ""
    if (emailInput) emailInput.value = currentUser.email || ""
    if (phoneInput) phoneInput.value = currentUser.phone || ""
  }

  // Load user orders from admin data with enhanced functionality
  function loadUserOrders() {
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []

    if (!currentUser) return

    // Filter transactions for current user
    const userTransactions = transactions.filter((transaction) => transaction.customerEmail === currentUser.email)

    // Update stats
    updateOrdersStats(userTransactions)

    const ordersContainer = document.getElementById("profile-orders-list")
    const emptyOrders = document.getElementById("empty-orders")

    if (!ordersContainer) return

    ordersContainer.innerHTML = ""

    if (userTransactions.length === 0) {
      ordersContainer.style.display = "none"
      if (emptyOrders) {
        emptyOrders.style.display = "block"
      }
      return
    }

    ordersContainer.style.display = "block"
    if (emptyOrders) {
      emptyOrders.style.display = "none"
    }

    userTransactions.forEach((transaction) => {
      const orderItem = document.createElement("div")
      orderItem.className = "profile-order-item"

      // Get product image based on product name
      const productImage = getProductImage(transaction.products)

      orderItem.innerHTML = `
        <div class="profile-order-header">
          <div class="profile-order-id">
            <span>ID Pesanan:</span>
            <strong>${transaction.transactionId}</strong>
          </div>
          <div class="profile-order-date">
            <span>Tanggal:</span>
            <strong>${formatDate(transaction.date)}</strong>
          </div>
          <div class="profile-order-status">
            <span class="status-${transaction.status}">${getStatusName(transaction.status)}</span>
          </div>
        </div>
        <div class="profile-order-products">
          <div class="profile-order-product">
            <div class="profile-order-product-image" style="background-image: url('${productImage}');"></div>
            <div class="profile-order-product-details">
              <h4>${transaction.products}</h4>
              <p>Jumlah: ${transaction.quantity}</p>
              <p>Metode Pembayaran: ${transaction.paymentMethod}</p>
              <p>Rp ${formatPrice(transaction.total)}</p>
            </div>
          </div>
        </div>
        <div class="profile-order-footer">
          <div class="profile-order-total">
            <span>Total:</span>
            <strong>Rp ${formatPrice(transaction.total)}</strong>
          </div>
          <div class="profile-order-actions">
            ${getOrderActionButtons(transaction)}
          </div>
        </div>
      `
      ordersContainer.appendChild(orderItem)
    })

    // Add event listeners for new buttons
    addOrderActionListeners()
  }

  // Load user stats
  function loadUserStats() {
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []

    if (!currentUser) return

    // Count user transactions
    const userTransactions = transactions.filter((transaction) => transaction.customerEmail === currentUser.email)

    const totalOrdersElement = document.getElementById("user-total-orders")
    const totalReviewsElement = document.getElementById("user-total-reviews")

    if (totalOrdersElement) {
      totalOrdersElement.textContent = userTransactions.length
    }

    if (totalReviewsElement) {
      totalReviewsElement.textContent = userTransactions.filter((t) => t.status === "completed").length
    }
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu")
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      const mobileMenu = document.querySelector(".mobile-menu-container")
      if (mobileMenu) {
        mobileMenu.classList.toggle("active")
      }
    })
  }

  // Profile menu tabs
  const profileMenuItems = document.querySelectorAll(".profile-menu-item")
  const profileTabs = document.querySelectorAll(".profile-tab")
  const profileWelcome = document.querySelector(".profile-welcome")

  // Show profile details button
  const showProfileDetailsBtn = document.getElementById("show-profile-details")
  if (showProfileDetailsBtn) {
    showProfileDetailsBtn.addEventListener("click", () => {
      showTab("profile")
    })
  }

  // Tab switching function
  function showTab(tabId) {
    // Hide welcome screen
    if (profileWelcome) {
      profileWelcome.style.display = "none"
    }

    // Hide all tabs
    profileTabs.forEach((tab) => {
      tab.classList.remove("active")
    })

    // Show selected tab
    const selectedTab = document.getElementById(`${tabId}-tab`)
    if (selectedTab) {
      selectedTab.classList.add("active")
    }

    // Update active menu item
    profileMenuItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("data-tab") === tabId) {
        item.classList.add("active")
      }
    })
  }

  // Menu item click handler
  profileMenuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()
      const tabId = this.getAttribute("data-tab")
      if (tabId) {
        showTab(tabId)
      }
    })
  })

  // Logout handler
  const logoutBtn = document.querySelector(".profile-menu-item.logout")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("Apakah Anda yakin ingin keluar?")) {
        localStorage.removeItem("ameza_current_user")
        window.location.href = "login.html"
      }
    })
  }

  // Form submission handlers
  const profileForm = document.querySelector(".profile-form")
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveUserProfile()
    })
  }

  const passwordForm = document.querySelector(".password-form")
  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      e.preventDefault()
      changePassword()
    })
  }

  // Track order button handler
  const trackOrderBtns = document.querySelectorAll(".track-order-btn")
  const trackingModal = document.getElementById("tracking-modal")
  const closeTrackingModal = trackingModal ? trackingModal.querySelector(".close-modal") : null

  if (trackOrderBtns.length > 0 && trackingModal) {
    trackOrderBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        trackingModal.classList.add("active")
      })
    })

    if (closeTrackingModal) {
      closeTrackingModal.addEventListener("click", () => {
        trackingModal.classList.remove("active")
      })
    }

    // Close modal when clicking outside
    trackingModal.addEventListener("click", (e) => {
      if (e.target === trackingModal) {
        trackingModal.classList.remove("active")
      }
    })
  }

  // Review button handler
  const reviewBtns = document.querySelectorAll(".review-btn")
  const reviewModal = document.getElementById("review-modal")
  const closeReviewModal = reviewModal ? reviewModal.querySelector(".close-modal") : null

  if (reviewBtns.length > 0 && reviewModal) {
    reviewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        reviewModal.classList.add("active")
      })
    })

    if (closeReviewModal) {
      closeReviewModal.addEventListener("click", () => {
        reviewModal.classList.remove("active")
      })
    }

    // Close modal when clicking outside
    reviewModal.addEventListener("click", (e) => {
      if (e.target === reviewModal) {
        reviewModal.classList.remove("active")
      }
    })
  }

  // Star rating functionality
  const ratingStars = document.querySelectorAll(".rating-stars")

  if (ratingStars.length > 0) {
    ratingStars.forEach((container) => {
      const stars = container.querySelectorAll("i")

      stars.forEach((star) => {
        // Hover effect
        star.addEventListener("mouseover", function () {
          const rating = Number.parseInt(this.getAttribute("data-rating"))

          stars.forEach((s) => {
            const starRating = Number.parseInt(s.getAttribute("data-rating"))
            if (starRating <= rating) {
              s.classList.remove("lar")
              s.classList.add("las")
            } else {
              s.classList.remove("las")
              s.classList.add("lar")
            }
          })
        })

        // Click to set rating
        star.addEventListener("click", function () {
          const rating = Number.parseInt(this.getAttribute("data-rating"))

          stars.forEach((s) => {
            const starRating = Number.parseInt(s.getAttribute("data-rating"))
            if (starRating <= rating) {
              s.classList.remove("lar")
              s.classList.add("las")
            } else {
              s.classList.remove("las")
              s.classList.add("lar")
            }
          })

          // Store the rating value
          const hiddenInput = document.createElement("input")
          hiddenInput.type = "hidden"
          hiddenInput.name = "rating"
          hiddenInput.value = rating

          // Replace existing hidden input if any
          const existingInput = container.querySelector('input[name="rating"]')
          if (existingInput) {
            container.replaceChild(hiddenInput, existingInput)
          } else {
            container.appendChild(hiddenInput)
          }
        })

        // Reset on mouseout if not clicked
        container.addEventListener("mouseleave", () => {
          const selectedRating = container.querySelector('input[name="rating"]')

          if (selectedRating) {
            const rating = Number.parseInt(selectedRating.value)

            stars.forEach((s) => {
              const starRating = Number.parseInt(s.getAttribute("data-rating"))
              if (starRating <= rating) {
                s.classList.remove("lar")
                s.classList.add("las")
              } else {
                s.classList.remove("las")
                s.classList.add("lar")
              }
            })
          } else {
            stars.forEach((s) => {
              s.classList.remove("las")
              s.classList.add("lar")
            })
          }
        })
      })
    })
  }

  // Submit review handler
  const submitReviewBtn = document.querySelector(".submit-review")

  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", () => {
      // Check if all products have ratings
      const productRatings = document.querySelectorAll(".product-rating")
      let allRated = true

      productRatings.forEach((container) => {
        const rating = container.querySelector('input[name="rating"]')
        if (!rating) {
          allRated = false
        }
      })

      if (!allRated) {
        alert("Harap berikan rating untuk semua produk.")
        return
      }

      // Show success message
      alert("Terima kasih atas ulasan Anda!")

      // Close modal
      if (reviewModal) {
        reviewModal.classList.remove("active")
      }
    })
  }

  // Change avatar
  const changeAvatarBtn = document.querySelector(".change-avatar")

  if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener("click", () => {
      // Create a file input
      const fileInput = document.createElement("input")
      fileInput.type = "file"
      fileInput.accept = "image/*"

      fileInput.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          const reader = new FileReader()

          reader.onload = (e) => {
            const profileAvatar = document.querySelector(".profile-avatar img")
            if (profileAvatar) {
              profileAvatar.src = e.target.result
            }
          }

          reader.readAsDataURL(this.files[0])
        }
      })

      fileInput.click()
    })
  }

  // Filter orders functionality
  function setupOrdersFilter() {
    const periodFilter = document.getElementById("profile-order-period")
    const statusFilter = document.getElementById("profile-order-status")
    const searchInput = document.getElementById("profile-order-search")
    const searchBtn = document.getElementById("profile-search-btn")

    if (periodFilter) {
      periodFilter.addEventListener("change", filterOrders)
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", filterOrders)
    }

    if (searchInput) {
      searchInput.addEventListener("input", filterOrders)
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", filterOrders)
    }
  }

  // Filter orders based on selected criteria
  function filterOrders() {
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []

    if (!currentUser) return

    let filteredTransactions = transactions.filter((transaction) => transaction.customerEmail === currentUser.email)

    // Apply period filter
    const periodFilter = document.getElementById("profile-order-period")
    if (periodFilter && periodFilter.value !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (periodFilter.value) {
        case "last-month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "last-3-months":
          filterDate.setMonth(now.getMonth() - 3)
          break
        case "last-6-months":
          filterDate.setMonth(now.getMonth() - 6)
          break
        case "last-year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) >= filterDate)
    }

    // Apply status filter
    const statusFilter = document.getElementById("profile-order-status")
    if (statusFilter && statusFilter.value !== "all") {
      filteredTransactions = filteredTransactions.filter((t) => t.status === statusFilter.value)
    }

    // Apply search filter
    const searchInput = document.getElementById("profile-order-search")
    if (searchInput && searchInput.value.trim()) {
      const searchTerm = searchInput.value.trim().toLowerCase()
      filteredTransactions = filteredTransactions.filter(
        (t) => t.transactionId.toLowerCase().includes(searchTerm) || t.products.toLowerCase().includes(searchTerm),
      )
    }

    // Update display with filtered results
    displayFilteredOrders(filteredTransactions)
  }

  // Display filtered orders
  function displayFilteredOrders(transactions) {
    const ordersContainer = document.getElementById("profile-orders-list")
    const emptyOrders = document.getElementById("empty-orders")

    if (!ordersContainer) return

    ordersContainer.innerHTML = ""

    if (transactions.length === 0) {
      ordersContainer.style.display = "none"
      if (emptyOrders) {
        emptyOrders.style.display = "block"
        emptyOrders.querySelector("h4").textContent = "Tidak ada pesanan ditemukan"
        emptyOrders.querySelector("p").textContent = "Coba ubah filter atau kata kunci pencarian Anda."
      }
      return
    }

    ordersContainer.style.display = "block"
    if (emptyOrders) {
      emptyOrders.style.display = "none"
    }

    transactions.forEach((transaction) => {
      const orderItem = document.createElement("div")
      orderItem.className = "profile-order-item"

      const productImage = getProductImage(transaction.products)

      orderItem.innerHTML = `
        <div class="profile-order-header">
          <div class="profile-order-id">
            <span>ID Pesanan:</span>
            <strong>${transaction.transactionId}</strong>
          </div>
          <div class="profile-order-date">
            <span>Tanggal:</span>
            <strong>${formatDate(transaction.date)}</strong>
          </div>
          <div class="profile-order-status">
            <span class="status-${transaction.status}">${getStatusName(transaction.status)}</span>
          </div>
        </div>
        <div class="profile-order-products">
          <div class="profile-order-product">
            <div class="profile-order-product-image" style="background-image: url('${productImage}');"></div>
            <div class="profile-order-product-details">
              <h4>${transaction.products}</h4>
              <p>Jumlah: ${transaction.quantity}</p>
              <p>Metode Pembayaran: ${transaction.paymentMethod}</p>
              <p>Rp ${formatPrice(transaction.total)}</p>
            </div>
          </div>
        </div>
        <div class="profile-order-footer">
          <div class="profile-order-total">
            <span>Total:</span>
            <strong>Rp ${formatPrice(transaction.total)}</strong>
          </div>
          <div class="profile-order-actions">
            ${getOrderActionButtons(transaction)}
          </div>
        </div>
      `
      ordersContainer.appendChild(orderItem)
    })

    // Add event listeners for new buttons
    addOrderActionListeners()
  }

  // Add event listeners for order actions
  function addOrderActionListeners() {
    // Track order buttons
    const trackBtns = document.querySelectorAll(".track-order-btn")
    trackBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const trackingModal = document.getElementById("tracking-modal")
        if (trackingModal) {
          trackingModal.classList.add("active")
        }
      })
    })

    // Review buttons
    const reviewBtns = document.querySelectorAll(".review-btn")
    reviewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const reviewModal = document.getElementById("review-modal")
        if (reviewModal) {
          reviewModal.classList.add("active")
        }
      })
    })

    // Pay now buttons
    const payBtns = document.querySelectorAll(".pay-now-btn")
    payBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.getAttribute("data-order-id")
        alert(`Mengarahkan ke halaman pembayaran untuk pesanan ${orderId}...`)
        // Here you would redirect to payment page
      })
    })

    // Buy again buttons
    const buyAgainBtns = document.querySelectorAll(".buy-again-btn")
    buyAgainBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.getAttribute("data-order-id")

        // Find the transaction
        const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
        const transaction = transactions.find((t) => t.transactionId === orderId)

        if (transaction) {
          // Add to cart logic here
          alert(`${transaction.products} telah ditambahkan ke keranjang!`)

          // Update cart count
          const cartCount = document.getElementById("cart-count")
          if (cartCount) {
            const currentCount = Number.parseInt(cartCount.textContent) || 0
            cartCount.textContent = currentCount + transaction.quantity
          }
        }
      })
    })

    // Cancel order buttons
    const cancelBtns = document.querySelectorAll(".cancel-order-btn")
    cancelBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.getAttribute("data-order-id")
        if (confirm(`Apakah Anda yakin ingin membatalkan pesanan ${orderId}?`)) {
          // Update order status to cancelled
          const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
          const transactionIndex = transactions.findIndex((t) => t.transactionId === orderId)

          if (transactionIndex !== -1) {
            transactions[transactionIndex].status = "cancelled"
            localStorage.setItem("ameza_transactions", JSON.stringify(transactions))

            // Reload orders
            loadUserOrders()
            alert("Pesanan berhasil dibatalkan.")
          }
        }
      })
    })

    // Confirm received buttons
    const confirmBtns = document.querySelectorAll(".confirm-received-btn")
    confirmBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.getAttribute("data-order-id")
        if (confirm(`Konfirmasi bahwa Anda telah menerima pesanan ${orderId}?`)) {
          // Update order status to completed
          const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
          const transactionIndex = transactions.findIndex((t) => t.transactionId === orderId)

          if (transactionIndex !== -1) {
            transactions[transactionIndex].status = "completed"
            localStorage.setItem("ameza_transactions", JSON.stringify(transactions))

            // Reload orders
            loadUserOrders()
            alert("Terima kasih! Pesanan telah dikonfirmasi diterima.")
          }
        }
      })
    })

    // Contact seller buttons
    const contactBtns = document.querySelectorAll(".contact-seller-btn")
    contactBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        alert("Mengarahkan ke halaman chat dengan penjual...")
        // Here you would open chat or contact form
      })
    })
  }

  // Get product image based on product name
  function getProductImage(productName) {
    const productImages = {
      "Blouse Elegant": "/placeholder.svg?height=80&width=80&text=Blouse+Elegant",
      "Rok Putih Pita": "/placeholder.svg?height=80&width=80&text=Rok+Putih+Pita",
      "Kemeja Crop": "/placeholder.svg?height=80&width=80&text=Kemeja+Crop",
      "Celana Jeans Gambar": "/placeholder.svg?height=80&width=80&text=Celana+Jeans",
    }
    return productImages[productName] || "/placeholder.svg?height=80&width=80&text=Product"
  }

  // Get order action buttons based on status
  function getOrderActionButtons(transaction) {
    const buttons = []

    // Track button for all orders except pending
    if (transaction.status !== "pending") {
      buttons.push(`<button class="btn-sm track-order-btn" data-order-id="${transaction.transactionId}">Lacak</button>`)
    }

    // Status-specific buttons
    switch (transaction.status) {
      case "pending":
        buttons.push(
          `<button class="btn-sm pay-now-btn" data-order-id="${transaction.transactionId}">Bayar Sekarang</button>`,
        )
        buttons.push(
          `<button class="btn-sm cancel-order-btn" data-order-id="${transaction.transactionId}">Batalkan</button>`,
        )
        break

      case "processing":
        buttons.push(
          `<button class="btn-sm contact-seller-btn" data-order-id="${transaction.transactionId}">Hubungi Penjual</button>`,
        )
        break

      case "shipped":
        buttons.push(
          `<button class="btn-sm confirm-received-btn" data-order-id="${transaction.transactionId}">Konfirmasi Diterima</button>`,
        )
        break

      case "completed":
        buttons.push(
          `<button class="btn-sm review-btn" data-order-id="${transaction.transactionId}">Beri Ulasan</button>`,
        )
        buttons.push(
          `<button class="btn-sm buy-again-btn" data-order-id="${transaction.transactionId}">Beli Lagi</button>`,
        )
        break
    }

    return buttons.join("")
  }

  // Save user profile
  function saveUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    if (!currentUser) return

    const firstName = document.getElementById("first-name").value
    const lastName = document.getElementById("last-name").value
    const email = document.getElementById("profile-email").value
    const phone = document.getElementById("profile-phone").value
    const birthDate = document.getElementById("birth-date").value
    const gender = document.getElementById("gender").value

    // Update current user data
    currentUser.firstName = firstName
    currentUser.lastName = lastName
    currentUser.email = email
    currentUser.phone = phone
    currentUser.birthDate = birthDate
    currentUser.gender = gender

    // Save to localStorage
    localStorage.setItem("ameza_current_user", JSON.stringify(currentUser))

    // Update users list in admin data
    const users = JSON.parse(localStorage.getItem("ameza_users")) || []
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...currentUser }
      localStorage.setItem("ameza_users", JSON.stringify(users))
    }

    // Update display
    loadUserData()

    alert("Profil berhasil diperbarui!")
  }

  // Change password
  function changePassword() {
    const currentPassword = document.getElementById("current-password").value
    const newPassword = document.getElementById("new-password").value
    const confirmPassword = document.getElementById("confirm-password").value

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Harap isi semua kolom password.")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok.")
      return
    }

    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    if (!currentUser) return

    // Verify current password
    if (currentUser.password !== currentPassword) {
      alert("Password saat ini tidak benar.")
      return
    }

    // Update password
    currentUser.password = newPassword
    localStorage.setItem("ameza_current_user", JSON.stringify(currentUser))

    // Update users list in admin data
    const users = JSON.parse(localStorage.getItem("ameza_users")) || []
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex].password = newPassword
      localStorage.setItem("ameza_users", JSON.stringify(users))
    }

    alert("Password berhasil diubah!")

    // Clear form
    document.querySelector(".password-form").reset()
  }

  // Utility functions
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  function getStatusName(status) {
    const statusNames = {
      pending: "Menunggu Pembayaran",
      paid: "Sudah Dibayar",
      processing: "Sedang Diproses",
      shipped: "Dikirim",
      delivered: "Terkirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
      refunded: "Dikembalikan",
    }
    return statusNames[status] || status
  }

  // Update orders stats
  function updateOrdersStats(transactions) {
    const totalOrdersElement = document.getElementById("user-total-orders")
    const totalReviewsElement = document.getElementById("user-total-reviews")

    if (totalOrdersElement) {
      totalOrdersElement.textContent = transactions.length
    }

    if (totalReviewsElement) {
      totalReviewsElement.textContent = transactions.filter((t) => t.status === "completed").length
    }
  }

  // Initialize sample orders
  initializeSampleOrders()

  // Load user data from localStorage
  loadUserData()

  // Load user orders from admin data
  loadUserOrders()

  // Load user stats
  loadUserStats()

  // Add this line after loadUserStats()
  setupOrdersFilter()
})
