// Admin Dashboard JavaScript
class AdminDashboard {
  constructor() {
    this.currentPage = "dashboard"
    this.products = []
    this.articles = []
    this.users = []
    this.transactions = []
    this.editingProductId = null
    this.editingArticleId = null
    this.editingUserId = null
    this.editingTransactionId = null
    this.sidebarCollapsed = false
    this.isLoading = true

    // Tampilkan loading indicator
    this.showLoading()

    // Load data dengan setTimeout untuk menghindari blocking UI
    setTimeout(() => {
      this.loadInitialData()
      this.init()
      this.hideLoading()
    }, 100)
  }

  init() {
    this.bindEvents()
    this.updateStats()
    this.loadProducts()
    this.loadArticles()
    this.loadUsers()
    this.loadTransactions()
    this.loadRecentTransactions()
    this.loadCustomers()
    this.setupUserDropdown()
    this.setupLogout()
    this.setupSidebarToggle()
    this.setupAdminProfile()
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll(".nav-item a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const page = e.target.closest("a").dataset.page
        this.switchPage(page)
      })
    })

    // Product management
    const addProductBtn = document.getElementById("add-product-btn")
    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => {
        this.openProductModal()
      })
    }

    const productForm = document.getElementById("product-form")
    if (productForm) {
      productForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.saveProduct()
      })
    }

    const cancelProduct = document.getElementById("cancel-product")
    if (cancelProduct) {
      cancelProduct.addEventListener("click", () => {
        this.closeProductModal()
      })
    }

    // Article management
    const addArticleBtn = document.getElementById("add-article-btn")
    if (addArticleBtn) {
      addArticleBtn.addEventListener("click", () => {
        this.openArticleModal()
      })
    }

    const articleForm = document.getElementById("article-form")
    if (articleForm) {
      articleForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.saveArticle()
      })
    }

    const cancelArticle = document.getElementById("cancel-article")
    if (cancelArticle) {
      cancelArticle.addEventListener("click", () => {
        this.closeArticleModal()
      })
    }

    // Transaction management
    const addTransactionBtn = document.getElementById("add-transaction-btn")
    if (addTransactionBtn) {
      addTransactionBtn.addEventListener("click", () => {
        this.openTransactionModal()
      })
    }

    const transactionForm = document.getElementById("transaction-form")
    if (transactionForm) {
      transactionForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.saveTransaction()
      })
    }

    const cancelTransaction = document.getElementById("cancel-transaction")
    if (cancelTransaction) {
      cancelTransaction.addEventListener("click", () => {
        this.closeTransactionModal()
      })
    }

    // User management
    const addUserBtn = document.getElementById("add-user-btn")
    if (addUserBtn) {
      addUserBtn.addEventListener("click", () => {
        this.openUserModal()
      })
    }

    const userForm = document.getElementById("user-form")
    if (userForm) {
      userForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.saveUser()
      })
    }

    const cancelUser = document.getElementById("cancel-user")
    if (cancelUser) {
      cancelUser.addEventListener("click", () => {
        this.closeUserModal()
      })
    }

    // Admin profile management
    const adminProfileForm = document.getElementById("admin-profile-form")
    if (adminProfileForm) {
      adminProfileForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.saveAdminProfile()
      })
    }

    const cancelAdminProfile = document.getElementById("cancel-admin-profile")
    if (cancelAdminProfile) {
      cancelAdminProfile.addEventListener("click", () => {
        this.closeAdminProfileModal()
      })
    }

    // Modal close buttons
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.target.closest(".modal").classList.remove("active")
      })
    })

    // Close modal on backdrop click
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
        }
      })
    })
  }

  setupUserDropdown() {
    const userInfo = document.querySelector(".user-info")
    const userDropdown = document.querySelector(".user-dropdown")

    if (userInfo && userDropdown) {
      userInfo.addEventListener("click", (e) => {
        e.stopPropagation()
        userDropdown.classList.toggle("active")
      })

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!userInfo.contains(e.target)) {
          userDropdown.classList.remove("active")
        }
      })
    }
  }

  setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn")
    const logoutBtnDropdown = document.getElementById("logoutBtnDropdown")

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.logout()
      })
    }

    if (logoutBtnDropdown) {
      logoutBtnDropdown.addEventListener("click", (e) => {
        e.preventDefault()
        this.logout()
      })
    }
  }

  setupAdminProfile() {
    const editProfileBtn = document.getElementById("editProfileBtn")
    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.openAdminProfileModal()
      })
    }
  }

  logout() {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("ameza_current_user")
      window.location.href = "../login.html"
    }
  }

  setupSidebarToggle() {
    const sidebarToggle = document.querySelector(".sidebar-toggle")
    const sidebar = document.querySelector(".sidebar")
    const mainContent = document.querySelector(".main-content")
    const mobileToggle = document.querySelector(".mobile-toggle")

    if (sidebarToggle && sidebar && mainContent) {
      sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed")
        mainContent.classList.toggle("expanded")
        this.sidebarCollapsed = sidebar.classList.contains("collapsed")
      })
    }

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active")
      })
    }

    // Close mobile sidebar when clicking outside
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
          sidebar.classList.remove("active")
        }
      }
    })
  }

  switchPage(page) {
    if (this.currentPage === page) return

    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
    })
    const targetNav = document.querySelector(`[data-page="${page}"]`)
    if (targetNav) {
      targetNav.closest(".nav-item").classList.add("active")
    }

    // Hide current page
    const oldPage = document.getElementById(`${this.currentPage}-page`)
    if (oldPage) {
      oldPage.classList.remove("active")
    }

    // Show new page
    const targetPage = document.getElementById(`${page}-page`)
    if (targetPage) {
      targetPage.classList.add("active")
    }

    // Update page title
    const titles = {
      dashboard: "Dashboard",
      products: "Kelola Produk",
      articles: "Kelola Artikel",
      transactions: "Kelola Transaksi",
      customers: "Kelola Pelanggan",
      users: "Kelola Pengguna",
      settings: "Pengaturan",
    }
    const pageTitle = document.getElementById("page-title")
    if (pageTitle) {
      pageTitle.textContent = titles[page] || page
    }

    this.currentPage = page

    // Close mobile sidebar after navigation
    if (window.innerWidth <= 768) {
      document.querySelector(".sidebar").classList.remove("active")
    }
  }

  loadInitialData() {
    // Load existing data from localStorage
    this.products = JSON.parse(localStorage.getItem("ameza_products")) || []
    this.articles = JSON.parse(localStorage.getItem("ameza_articles")) || []
    this.users = JSON.parse(localStorage.getItem("ameza_users")) || []
    this.transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []

    // Load default products if none exist
    if (this.products.length === 0) {
      this.products = [
        {
          id: 1,
          name: "Blouse Elegant",
          category: "tops",
          price: 120000,
          originalPrice: 140000,
          discount: 15,
          stock: 25,
          image: "https://i.pinimg.com/736x/9e/37/d7/9e37d7607ebd223a0d636e018e56bc6c.jpg",
          sizes: ["S", "M", "L"],
          colors: ["black", "white"],
        },
        {
          id: 2,
          name: "Rok Putih Pita",
          category: "bottoms",
          price: 100000,
          originalPrice: 125000,
          discount: 20,
          stock: 15,
          image: "https://i.pinimg.com/736x/37/12/f2/3712f25a7326e2140125b94a0c895e68.jpg",
          sizes: ["S", "M", "L", "XL"],
          colors: ["white", "cream"],
        },
        {
          id: 3,
          name: "Kemeja Crop",
          category: "tops",
          price: 180000,
          originalPrice: 200000,
          discount: 10,
          stock: 30,
          image: "https://i.pinimg.com/736x/fa/86/0a/fa860a6293b84962751df4c63cb3509a.jpg",
          sizes: ["M", "L", "XL"],
          colors: ["beige", "brown"],
        },
        {
          id: 4,
          name: "Celana Jeans Gambar",
          category: "bottoms",
          price: 165000,
          originalPrice: 195000,
          discount: 15,
          stock: 20,
          image: "https://i.pinimg.com/736x/16/92/ee/1692ee5cc3a5a10cb7a946e1e5c70560.jpg",
          sizes: ["S", "M", "L", "XL"],
          colors: ["blue", "dark blue"],
        },
      ]
      this.saveProducts()
    }

    // Load default articles if none exist
    if (this.articles.length === 0) {
      this.articles = [
        {
          id: 1,
          title: "Tren Fashion Musim Panas 2023",
          content:
            "Temukan tren fashion terbaru untuk musim panas tahun ini yang akan membuat penampilan Anda semakin menarik.",
          image: "https://i.pinimg.com/736x/fc/b0/61/fcb0618d08902f4527a5a47e4d03e79b.jpg",
          date: "2023-05-15",
          status: "published",
        },
        {
          id: 2,
          title: "Cara Merawat Pakaian Berbahan Katun",
          content: "Tips dan trik untuk merawat pakaian berbahan katun agar tetap awet dan nyaman digunakan.",
          image: "https://i.pinimg.com/736x/9c/21/8b/9c218b9bf19fcab4f4735f6c621abffc.jpg",
          date: "2023-05-10",
          status: "published",
        },
        {
          id: 3,
          title: "Mix and Match Pakaian untuk Berbagai Acara",
          content: "Panduan lengkap untuk memadukan pakaian yang tepat untuk berbagai acara formal maupun kasual.",
          image: "https://i.pinimg.com/736x/83/f5/ad/83f5ad1ee456d657260250c4dfb9507f.jpg",
          date: "2023-05-05",
          status: "published",
        },
      ]
      this.saveArticles()
    }

    // Load default transactions if none exist
    if (this.transactions.length === 0) {
      this.transactions = [
        {
          id: 1,
          transactionId: "TRX001",
          customer: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+62 123 456 789",
          products: "Blouse Elegant, Rok Putih Pita",
          quantity: 2,
          total: 220000,
          paymentMethod: "transfer",
          status: "completed",
          date: "2023-12-01",
          address: "Jl. Sudirman No. 123, Jakarta Pusat",
          notes: "Pengiriman reguler",
        },
        {
          id: 2,
          transactionId: "TRX002",
          customer: "Jane Smith",
          customerEmail: "jane@example.com",
          customerPhone: "+62 987 654 321",
          products: "Kemeja Crop",
          quantity: 1,
          total: 180000,
          paymentMethod: "ewallet",
          status: "shipped",
          date: "2023-12-02",
          address: "Jl. Thamrin No. 456, Jakarta Selatan",
          notes: "Kirim cepat",
        },
        {
          id: 3,
          transactionId: "TRX003",
          customer: "Bob Wilson",
          customerEmail: "bob@example.com",
          customerPhone: "+62 555 123 456",
          products: "Celana Jeans Gambar",
          quantity: 1,
          total: 165000,
          paymentMethod: "cod",
          status: "processing",
          date: "2023-12-03",
          address: "Jl. Gatot Subroto No. 789, Jakarta Barat",
          notes: "",
        },
        {
          id: 4,
          transactionId: "TRX004",
          customer: "Alice Brown",
          customerEmail: "alice@example.com",
          customerPhone: "+62 777 888 999",
          products: "Blouse Elegant",
          quantity: 1,
          total: 120000,
          paymentMethod: "credit_card",
          status: "pending",
          date: "2023-12-04",
          address: "Jl. Kuningan No. 321, Jakarta Timur",
          notes: "Pembayaran menunggu konfirmasi",
        },
      ]
      this.saveTransactions()
    }

    // Load default users if none exist
    if (this.users.length === 0) {
      this.users = [
        {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: "admin@ameza.com",
          phone: "123456789",
          password: "admin123",
          role: "admin",
          createdAt: "2023-01-01",
          avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-REHji32IhsEiv5DZx5FrCe2YXRMvpW.png",
          bio: "Administrator sistem Ameza Fashion",
        },
        {
          id: 2,
          firstName: "Regular",
          lastName: "User",
          email: "user@ameza.com",
          phone: "987654321",
          password: "user123",
          role: "user",
          createdAt: "2023-01-15",
        },
        {
          id: 3,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+62 123 456 789",
          password: "john123",
          role: "user",
          createdAt: "2023-02-01",
        },
        {
          id: 4,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          phone: "+62 987 654 321",
          password: "jane123",
          role: "user",
          createdAt: "2023-02-15",
        },
      ]
      this.saveUsers()
    }

    // Load current user
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    if (currentUser) {
      const userNameElement = document.getElementById("userName")
      if (userNameElement) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`
      }
    }
  }

  updateStats() {
    const totalProducts = document.getElementById("total-products")
    const totalArticles = document.getElementById("total-articles")
    const totalTransactions = document.getElementById("total-transactions")
    const totalCustomers = document.getElementById("total-customers")

    if (totalProducts) totalProducts.textContent = this.products.length
    if (totalArticles) totalArticles.textContent = this.articles.length
    if (totalTransactions) totalTransactions.textContent = this.transactions.length
    if (totalCustomers) totalCustomers.textContent = this.users.filter((u) => u.role === "user").length
  }

  loadProducts() {
    const tbody = document.getElementById("products-table-body")
    if (!tbody) return

    tbody.innerHTML = ""

    this.products.forEach((product) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>
          <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
        </td>
        <td>${product.name}</td>
        <td>${this.getCategoryName(product.category)}</td>
        <td>Rp ${product.price.toLocaleString()}</td>
        <td>${product.discount || 0}%</td>
        <td>${product.stock}</td>
        <td>
          <button class="btn btn-sm" onclick="adminDashboard.editProduct(${product.id})">
            <i class="las la-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteProduct(${product.id})">
            <i class="las la-trash"></i>
          </button>
        </td>
      `
      tbody.appendChild(row)
    })
  }

  loadArticles() {
    const tbody = document.getElementById("articles-table-body")
    if (!tbody) return

    tbody.innerHTML = ""

    this.articles.forEach((article) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>
          <img src="${article.image}" alt="${article.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
        </td>
        <td>${article.title}</td>
        <td>${new Date(article.date).toLocaleDateString("id-ID")}</td>
        <td>
          <span class="status-${article.status}">${article.status === "published" ? "Dipublikasi" : "Draft"}</span>
        </td>
        <td>
          <button class="btn btn-sm" onclick="adminDashboard.editArticle(${article.id})">
            <i class="las la-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteArticle(${article.id})">
            <i class="las la-trash"></i>
          </button>
        </td>
      `
      tbody.appendChild(row)
    })
  }

  loadTransactions() {
    const tbody = document.getElementById("transactions-table-body")
    if (!tbody) return

    tbody.innerHTML = ""

    this.transactions.forEach((transaction) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${transaction.transactionId}</td>
        <td>
          <div>
            <strong>${transaction.customer}</strong><br>
            <small>${transaction.customerEmail}</small><br>
            <small>${transaction.customerPhone}</small>
          </div>
        </td>
        <td>${transaction.products}</td>
        <td>Rp ${transaction.total.toLocaleString()}</td>
        <td>
          <span class="status-${transaction.status}">${this.getStatusName(transaction.status)}</span>
        </td>
        <td>${new Date(transaction.date).toLocaleDateString("id-ID")}</td>
        <td>
          <button class="btn btn-sm" onclick="adminDashboard.editTransaction(${transaction.id})">
            <i class="las la-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteTransaction(${transaction.id})">
            <i class="las la-trash"></i>
          </button>
        </td>
      `
      tbody.appendChild(row)
    })
  }

  loadUsers() {
    const tbody = document.getElementById("users-table-body")
    if (!tbody) return

    tbody.innerHTML = ""

    this.users.forEach((user) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>
          <span class="status-${user.role}">${user.role === "admin" ? "Admin" : "User"}</span>
        </td>
        <td>${new Date(user.createdAt).toLocaleDateString("id-ID")}</td>
        <td>
          <button class="btn btn-sm" onclick="adminDashboard.editUser(${user.id})">
            <i class="las la-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteUser(${user.id})">
            <i class="las la-trash"></i>
          </button>
        </td>
      `
      tbody.appendChild(row)
    })
  }

  loadRecentTransactions() {
    const container = document.getElementById("recent-transactions-list")
    if (!container) return

    container.innerHTML = ""

    // Get last 5 transactions
    const recentTransactions = this.transactions.slice(-5).reverse()

    recentTransactions.forEach((transaction) => {
      const item = document.createElement("div")
      item.className = "order-item"
      item.innerHTML = `
        <div class="order-info">
          <h4>${transaction.transactionId}</h4>
          <p>${transaction.customer}</p>
          <p>Rp ${transaction.total.toLocaleString()}</p>
        </div>
        <div class="order-status">
          <span class="status-${transaction.status}">${this.getStatusName(transaction.status)}</span>
        </div>
      `
      container.appendChild(item)
    })
  }

  loadCustomers() {
    const tbody = document.getElementById("customers-table-body")
    if (!tbody) return

    tbody.innerHTML = ""

    const customers = this.users.filter((user) => user.role === "user")

    customers.forEach((customer) => {
      // Count orders for this customer
      const customerOrders = this.transactions.filter((t) => t.customerEmail === customer.email)

      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${customer.firstName} ${customer.lastName}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>${customerOrders.length}</td>
        <td>${new Date(customer.createdAt).toLocaleDateString("id-ID")}</td>
      `
      tbody.appendChild(row)
    })
  }

  // Product Management
  openProductModal(productId = null) {
    const modal = document.getElementById("product-modal")
    const title = document.getElementById("product-modal-title")
    const form = document.getElementById("product-form")

    if (productId) {
      const product = this.products.find((p) => p.id === productId)
      if (product) {
        title.textContent = "Edit Produk"
        document.getElementById("product-name").value = product.name
        document.getElementById("product-category").value = product.category
        document.getElementById("product-price").value = product.price
        document.getElementById("product-original-price").value = product.originalPrice || ""
        document.getElementById("product-discount").value = product.discount || ""
        document.getElementById("product-stock").value = product.stock
        document.getElementById("product-image").value = product.image
        document.getElementById("product-sizes").value = product.sizes ? product.sizes.join(",") : ""
        document.getElementById("product-colors").value = product.colors ? product.colors.join(",") : ""
        this.editingProductId = productId
      }
    } else {
      title.textContent = "Tambah Produk"
      form.reset()
      this.editingProductId = null
    }

    modal.classList.add("active")
  }

  closeProductModal() {
    const modal = document.getElementById("product-modal")
    modal.classList.remove("active")
    this.editingProductId = null
  }

  saveProduct() {
    const name = document.getElementById("product-name").value
    const category = document.getElementById("product-category").value
    const price = Number.parseInt(document.getElementById("product-price").value)
    const originalPrice = Number.parseInt(document.getElementById("product-original-price").value) || price
    const discount = Number.parseInt(document.getElementById("product-discount").value) || 0
    const stock = Number.parseInt(document.getElementById("product-stock").value)
    const image = document.getElementById("product-image").value
    const sizes = document
      .getElementById("product-sizes")
      .value.split(",")
      .map((s) => s.trim())
      .filter((s) => s)
    const colors = document
      .getElementById("product-colors")
      .value.split(",")
      .map((c) => c.trim())
      .filter((c) => c)

    const productData = {
      name,
      category,
      price,
      originalPrice,
      discount,
      stock,
      image,
      sizes,
      colors,
    }

    if (this.editingProductId) {
      // Update existing product
      const index = this.products.findIndex((p) => p.id === this.editingProductId)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...productData }
      }
    } else {
      // Add new product
      const newId = Math.max(...this.products.map((p) => p.id), 0) + 1
      this.products.push({ id: newId, ...productData })
    }

    this.saveProducts()
    this.loadProducts()
    this.updateStats()
    this.closeProductModal()
    this.showNotification("Produk berhasil disimpan!", "success")
  }

  editProduct(id) {
    this.openProductModal(id)
  }

  deleteProduct(id) {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      this.products = this.products.filter((p) => p.id !== id)
      this.saveProducts()
      this.loadProducts()
      this.updateStats()
      this.showNotification("Produk berhasil dihapus!", "success")
    }
  }

  // Article Management
  openArticleModal(articleId = null) {
    const modal = document.getElementById("article-modal")
    const title = document.getElementById("article-modal-title")
    const form = document.getElementById("article-form")

    if (articleId) {
      const article = this.articles.find((a) => a.id === articleId)
      if (article) {
        title.textContent = "Edit Artikel"
        document.getElementById("article-title").value = article.title
        document.getElementById("article-content").value = article.content
        document.getElementById("article-image").value = article.image
        document.getElementById("article-date").value = article.date
        document.getElementById("article-status").value = article.status
        this.editingArticleId = articleId
      }
    } else {
      title.textContent = "Tambah Artikel"
      form.reset()
      document.getElementById("article-date").value = new Date().toISOString().split("T")[0]
      this.editingArticleId = null
    }

    modal.classList.add("active")
  }

  closeArticleModal() {
    const modal = document.getElementById("article-modal")
    modal.classList.remove("active")
    this.editingArticleId = null
  }

  saveArticle() {
    const title = document.getElementById("article-title").value
    const content = document.getElementById("article-content").value
    const image = document.getElementById("article-image").value
    const date = document.getElementById("article-date").value
    const status = document.getElementById("article-status").value

    const articleData = {
      title,
      content,
      image,
      date,
      status,
    }

    if (this.editingArticleId) {
      // Update existing article
      const index = this.articles.findIndex((a) => a.id === this.editingArticleId)
      if (index !== -1) {
        this.articles[index] = { ...this.articles[index], ...articleData }
      }
    } else {
      // Add new article
      const newId = Math.max(...this.articles.map((a) => a.id), 0) + 1
      this.articles.push({ id: newId, ...articleData })
    }

    this.saveArticles()
    this.loadArticles()
    this.updateStats()
    this.closeArticleModal()
    this.showNotification("Artikel berhasil disimpan!", "success")
  }

  editArticle(id) {
    this.openArticleModal(id)
  }

  deleteArticle(id) {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      this.articles = this.articles.filter((a) => a.id !== id)
      this.saveArticles()
      this.loadArticles()
      this.updateStats()
      this.showNotification("Artikel berhasil dihapus!", "success")
    }
  }

  // Transaction Management
  openTransactionModal(transactionId = null) {
    const modal = document.getElementById("transaction-modal")
    const title = document.getElementById("transaction-modal-title")
    const form = document.getElementById("transaction-form")

    if (transactionId) {
      const transaction = this.transactions.find((t) => t.id === transactionId)
      if (transaction) {
        title.textContent = "Edit Transaksi"
        document.getElementById("transaction-id").value = transaction.transactionId
        document.getElementById("transaction-customer").value = transaction.customer
        document.getElementById("transaction-customer-email").value = transaction.customerEmail
        document.getElementById("transaction-customer-phone").value = transaction.customerPhone
        document.getElementById("transaction-products").value = transaction.products
        document.getElementById("transaction-quantity").value = transaction.quantity
        document.getElementById("transaction-total").value = transaction.total
        document.getElementById("transaction-payment-method").value = transaction.paymentMethod
        document.getElementById("transaction-status").value = transaction.status
        document.getElementById("transaction-date").value = transaction.date
        document.getElementById("transaction-address").value = transaction.address
        document.getElementById("transaction-notes").value = transaction.notes || ""
        this.editingTransactionId = transactionId
      }
    } else {
      title.textContent = "Tambah Transaksi"
      form.reset()
      document.getElementById("transaction-date").value = new Date().toISOString().split("T")[0]
      this.editingTransactionId = null
    }

    modal.classList.add("active")
  }

  closeTransactionModal() {
    const modal = document.getElementById("transaction-modal")
    modal.classList.remove("active")
    this.editingTransactionId = null
  }

  saveTransaction() {
    const transactionId = document.getElementById("transaction-id").value
    const customer = document.getElementById("transaction-customer").value
    const customerEmail = document.getElementById("transaction-customer-email").value
    const customerPhone = document.getElementById("transaction-customer-phone").value
    const products = document.getElementById("transaction-products").value
    const quantity = Number.parseInt(document.getElementById("transaction-quantity").value)
    const total = Number.parseInt(document.getElementById("transaction-total").value)
    const paymentMethod = document.getElementById("transaction-payment-method").value
    const status = document.getElementById("transaction-status").value
    const date = document.getElementById("transaction-date").value
    const address = document.getElementById("transaction-address").value
    const notes = document.getElementById("transaction-notes").value

    const transactionData = {
      transactionId,
      customer,
      customerEmail,
      customerPhone,
      products,
      quantity,
      total,
      paymentMethod,
      status,
      date,
      address,
      notes,
    }

    if (this.editingTransactionId) {
      // Update existing transaction
      const index = this.transactions.findIndex((t) => t.id === this.editingTransactionId)
      if (index !== -1) {
        this.transactions[index] = { ...this.transactions[index], ...transactionData }
      }
    } else {
      // Add new transaction
      const newId = Math.max(...this.transactions.map((t) => t.id), 0) + 1
      this.transactions.push({ id: newId, ...transactionData })
    }

    this.saveTransactions()
    this.loadTransactions()
    this.loadRecentTransactions()
    this.updateStats()
    this.closeTransactionModal()
    this.showNotification("Transaksi berhasil disimpan!", "success")
  }

  editTransaction(id) {
    this.openTransactionModal(id)
  }

  deleteTransaction(id) {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      this.transactions = this.transactions.filter((t) => t.id !== id)
      this.saveTransactions()
      this.loadTransactions()
      this.loadRecentTransactions()
      this.updateStats()
      this.showNotification("Transaksi berhasil dihapus!", "success")
    }
  }

  // User Management
  openUserModal(userId = null) {
    const modal = document.getElementById("user-modal")
    const title = document.getElementById("user-modal-title")
    const form = document.getElementById("user-form")

    if (userId) {
      const user = this.users.find((u) => u.id === userId)
      if (user) {
        title.textContent = "Edit Pengguna"
        document.getElementById("user-firstName").value = user.firstName
        document.getElementById("user-lastName").value = user.lastName
        document.getElementById("user-email").value = user.email
        document.getElementById("user-phone").value = user.phone
        document.getElementById("user-password").value = user.password
        document.getElementById("user-role").value = user.role
        this.editingUserId = userId
      }
    } else {
      title.textContent = "Tambah Pengguna"
      form.reset()
      this.editingUserId = null
    }

    modal.classList.add("active")
  }

  closeUserModal() {
    const modal = document.getElementById("user-modal")
    modal.classList.remove("active")
    this.editingUserId = null
  }

  saveUser() {
    const firstName = document.getElementById("user-firstName").value
    const lastName = document.getElementById("user-lastName").value
    const email = document.getElementById("user-email").value
    const phone = document.getElementById("user-phone").value
    const password = document.getElementById("user-password").value
    const role = document.getElementById("user-role").value

    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    }

    if (this.editingUserId) {
      // Update existing user
      const index = this.users.findIndex((u) => u.id === this.editingUserId)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...userData }
      }
    } else {
      // Add new user
      const newId = Math.max(...this.users.map((u) => u.id), 0) + 1
      this.users.push({
        id: newId,
        ...userData,
        createdAt: new Date().toISOString().split("T")[0],
      })
    }

    this.saveUsers()
    this.loadUsers()
    this.loadCustomers()
    this.updateStats()
    this.closeUserModal()
    this.showNotification("Pengguna berhasil disimpan!", "success")
  }

  editUser(id) {
    this.openUserModal(id)
  }

  deleteUser(id) {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      this.users = this.users.filter((u) => u.id !== id)
      this.saveUsers()
      this.loadUsers()
      this.loadCustomers()
      this.updateStats()
      this.showNotification("Pengguna berhasil dihapus!", "success")
    }
  }

  // Admin Profile Management
  openAdminProfileModal() {
    const modal = document.getElementById("admin-profile-modal")
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))

    if (currentUser) {
      document.getElementById("admin-firstName").value = currentUser.firstName || ""
      document.getElementById("admin-lastName").value = currentUser.lastName || ""
      document.getElementById("admin-email").value = currentUser.email || ""
      document.getElementById("admin-phone").value = currentUser.phone || ""
      document.getElementById("admin-avatar").value = currentUser.avatar || ""
      document.getElementById("admin-bio").value = currentUser.bio || ""
    }

    modal.classList.add("active")
  }

  closeAdminProfileModal() {
    const modal = document.getElementById("admin-profile-modal")
    modal.classList.remove("active")

    // Clear password fields
    document.getElementById("admin-current-password").value = ""
    document.getElementById("admin-new-password").value = ""
    document.getElementById("admin-confirm-password").value = ""
  }

  saveAdminProfile() {
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    if (!currentUser) return

    const firstName = document.getElementById("admin-firstName").value
    const lastName = document.getElementById("admin-lastName").value
    const email = document.getElementById("admin-email").value
    const phone = document.getElementById("admin-phone").value
    const avatar = document.getElementById("admin-avatar").value
    const bio = document.getElementById("admin-bio").value
    const currentPassword = document.getElementById("admin-current-password").value
    const newPassword = document.getElementById("admin-new-password").value
    const confirmPassword = document.getElementById("admin-confirm-password").value

    // Validate password change if provided
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        this.showNotification("Harap masukkan password saat ini.", "error")
        return
      }

      if (currentUser.password !== currentPassword) {
        this.showNotification("Password saat ini tidak benar.", "error")
        return
      }

      if (!newPassword) {
        this.showNotification("Harap masukkan password baru.", "error")
        return
      }

      if (newPassword !== confirmPassword) {
        this.showNotification("Password baru dan konfirmasi password tidak cocok.", "error")
        return
      }

      if (newPassword.length < 6) {
        this.showNotification("Password baru harus minimal 6 karakter.", "error")
        return
      }
    }

    // Update user data
    const updatedUser = {
      ...currentUser,
      firstName,
      lastName,
      email,
      phone,
      avatar,
      bio,
    }

    // Update password if provided
    if (newPassword) {
      updatedUser.password = newPassword
    }

    // Save to localStorage
    localStorage.setItem("ameza_current_user", JSON.stringify(updatedUser))

    // Update in users array
    const userIndex = this.users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      this.users[userIndex] = updatedUser
      this.saveUsers()
    }

    // Update UI
    const userNameElement = document.getElementById("userName")
    if (userNameElement) {
      userNameElement.textContent = `${firstName} ${lastName}`
    }

    // Update avatar if provided
    if (avatar) {
      const avatarElements = document.querySelectorAll(".avatar")
      avatarElements.forEach((el) => {
        el.src = avatar
      })
    }

    this.showNotification("Profil berhasil diperbarui!", "success")
    this.closeAdminProfileModal()
  }

  // Utility functions
  getCategoryName(category) {
    const categories = {
      tops: "Atasan",
      bottoms: "Bawahan",
      dresses: "Dress",
      outerwear: "Outerwear",
    }
    return categories[category] || category
  }

  getStatusName(status) {
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

  // Save functions
  saveProducts() {
    localStorage.setItem("ameza_products", JSON.stringify(this.products))
  }

  saveArticles() {
    localStorage.setItem("ameza_articles", JSON.stringify(this.articles))
  }

  saveUsers() {
    localStorage.setItem("ameza_users", JSON.stringify(this.users))
  }

  saveTransactions() {
    localStorage.setItem("ameza_transactions", JSON.stringify(this.transactions))
  }

  showLoading() {
    const loadingElement = document.createElement("div")
    loadingElement.id = "loading-indicator"
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div class="loading-spinner"></div>
      </div>
    `
    document.body.appendChild(loadingElement)
  }

  hideLoading() {
    const loadingElement = document.getElementById("loading-indicator")
    if (loadingElement) {
      loadingElement.remove()
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="las ${type === "success" ? "la-check-circle" : type === "error" ? "la-exclamation-circle" : "la-info-circle"}"></i>
        <span>${message}</span>
      </div>
    `

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8"};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }
}

// Initialize admin dashboard when DOM is loaded
let adminDashboard
document.addEventListener("DOMContentLoaded", () => {
  adminDashboard = new AdminDashboard()
})
