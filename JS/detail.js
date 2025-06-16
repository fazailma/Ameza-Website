document.addEventListener("DOMContentLoaded", () => {
  // Get product ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (productId) {
    fetchProductDetails(productId)
  } else {
    // Fallback to demo product if no ID provided
    loadDemoProduct()
  }

  // Setup event listeners
  setupEventListeners()
})

// Fetch product details from admin database
async function fetchProductDetails(productId) {
  try {
    // In a real application, this would be an API call to your backend
    // For now, we'll simulate fetching from localStorage where admin might store products
    const products = JSON.parse(localStorage.getItem("products")) || []
    const product = products.find((p) => p.id === productId)

    if (product) {
      renderProductDetails(product)
    } else {
      console.error("Product not found")
      loadDemoProduct() // Fallback to demo product
    }
  } catch (error) {
    console.error("Error fetching product details:", error)
    loadDemoProduct() // Fallback to demo product
  }
}

// Load demo product data
function loadDemoProduct() {
  // Get product type from URL parameter or default to blouse
  const urlParams = new URLSearchParams(window.location.search)
  const productType = urlParams.get("type") || "blouse"

  // Define different products based on type
  const products = {
    blouse: {
      id: "blouse1",
      name: "Blouse Elegant",
      description:
        "Blouse elegant dengan desain modern yang cocok untuk berbagai acara. Dibuat dengan bahan berkualitas tinggi yang nyaman dipakai sepanjang hari.",
      price: 120000,
      originalPrice: 140000,
      discount: 15,
      rating: 4.5,
      reviewCount: 24,
      sku: "BL-ELG-001",
      categories: ["Blouse", "Wanita"],
      tags: ["Fashion", "Elegant", "Kasual"],
      image: "https://i.pinimg.com/736x/9e/37/d7/9e37d7607ebd223a0d636e018e56bc6c.jpg",
    },
    rok: {
      id: "rok1",
      name: "Rok Putih Pita",
      description:
        "Rok putih dengan detail pita yang cantik, cocok untuk acara formal maupun kasual. Bahan berkualitas tinggi dengan potongan yang elegan.",
      price: 100000,
      originalPrice: 125000,
      discount: 20,
      rating: 4.3,
      reviewCount: 18,
      sku: "RK-PTH-001",
      categories: ["Rok", "Wanita"],
      tags: ["Fashion", "Formal", "Putih"],
      image: "/placeholder.svg?height=500&width=500&text=Rok+Putih+Pita",
    },
    kemeja: {
      id: "kemeja1",
      name: "Kemeja Crop",
      description:
        "Kemeja crop dengan desain modern dan trendy. Cocok untuk gaya kasual yang stylish dan nyaman dipakai sehari-hari.",
      price: 180000,
      originalPrice: 200000,
      discount: 10,
      rating: 4.7,
      reviewCount: 32,
      sku: "KM-CRP-001",
      categories: ["Kemeja", "Wanita"],
      tags: ["Fashion", "Crop", "Trendy"],
      image: "/placeholder.svg?height=500&width=500&text=Kemeja+Crop",
    },
    celana: {
      id: "celana1",
      name: "Celana Jeans Gambar",
      description:
        "Celana jeans dengan detail gambar yang unik dan menarik. Bahan denim berkualitas tinggi dengan fit yang nyaman.",
      price: 165000,
      originalPrice: 195000,
      discount: 15,
      rating: 4.4,
      reviewCount: 27,
      sku: "CL-JNS-001",
      categories: ["Celana", "Wanita"],
      tags: ["Fashion", "Jeans", "Casual"],
      image: "/placeholder.svg?height=500&width=500&text=Celana+Jeans",
    },
  }

  // Get the selected product or default to blouse
  const selectedProduct = products[productType] || products.blouse

  // Add common properties
  const demoProduct = {
    ...selectedProduct,
    colors: [
      { name: "Hitam", code: "#000" },
      { name: "Putih", code: "#fff" },
      { name: "Merah Muda", code: "#B76E79" },
      { name: "Biru", code: "#7393B3" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [selectedProduct.image],
    additionalInfo: {
      Bahan: "95% Katun, 5% Elastan",
      Warna: "Hitam, Putih, Merah Muda, Biru",
      Ukuran: "S, M, L, XL",
      Berat: "250 gram",
      Perawatan: "Cuci dengan air dingin, jangan gunakan pemutih, setrika dengan suhu rendah",
    },
    fullDescription: `
      <p>${selectedProduct.name} adalah pilihan sempurna untuk Anda yang menginginkan tampilan yang anggun namun tetap kasual. Dibuat dengan bahan katun berkualitas tinggi yang nyaman dipakai sepanjang hari.</p>
      <p>Fitur produk:</p>
      <ul>
          <li>Bahan katun premium yang nyaman dan tidak mudah kusut</li>
          <li>Desain modern dengan potongan yang pas di badan</li>
          <li>Tersedia dalam berbagai pilihan warna</li>
          <li>Cocok untuk acara formal maupun kasual</li>
          <li>Mudah dipadukan dengan berbagai jenis bawahan</li>
      </ul>
      <p>Produk ini dapat dipadukan dengan berbagai outfit untuk menciptakan tampilan yang berbeda sesuai dengan acara yang Anda hadiri.</p>
    `,
    reviews: [
      {
        name: "Siti Rahma",
        date: "12 Mei 2023",
        rating: 5,
        content: `${selectedProduct.name} ini sangat nyaman dipakai dan bahannya tidak panas. Saya suka dengan desainnya yang simple tapi tetap elegant. Ukurannya juga pas di badan saya. Recommended!`,
        avatar: "/placeholder.svg?height=50&width=50&text=SR",
      },
      {
        name: "Anita Wijaya",
        date: "5 Mei 2023",
        rating: 4,
        content:
          "Bahannya bagus dan jahitannya rapi. Warnanya tidak luntur saat dicuci. Hanya saja ukurannya agak kecil, jadi disarankan untuk ambil satu ukuran lebih besar dari biasanya.",
        avatar: "/placeholder.svg?height=50&width=50&text=AW",
      },
      {
        name: "Dian Sastro",
        date: "28 April 2023",
        rating: 4.5,
        content: `Saya sangat puas dengan ${selectedProduct.name} ini. Bahannya adem dan nyaman dipakai seharian. Desainnya juga cocok untuk acara formal maupun casual. Pengirimannya juga cepat. Terima kasih Ameza Fashion!`,
        avatar: "/placeholder.svg?height=50&width=50&text=DS",
      },
    ],
    ratingDistribution: {
      5: 70,
      4: 20,
      3: 5,
      2: 3,
      1: 2,
    },
  }

  renderProductDetails(demoProduct)
}

// Render product details to the page
function renderProductDetails(product) {
  // Update main product image
  const mainImage = document.getElementById("main-product-image")
  mainImage.src = product.images[0]
  mainImage.alt = product.name

  // Show discount tag if applicable
  const discountTag = document.getElementById("discount-tag")
  if (product.discount > 0) {
    discountTag.textContent = `${product.discount}% OFF`
    discountTag.style.display = "block"
  } else {
    discountTag.style.display = "none"
  }

  // Update product title
  document.getElementById("product-title").textContent = product.name

  // Update prices
  const priceOriginal = document.getElementById("product-price-original")
  const price = document.getElementById("product-price")

  if (product.originalPrice && product.originalPrice > product.price) {
    priceOriginal.textContent = `Rp ${product.originalPrice.toLocaleString("id-ID")}`
    priceOriginal.style.display = "block"
  } else {
    priceOriginal.style.display = "none"
  }

  price.textContent = `Rp ${product.price.toLocaleString("id-ID")}`

  // Update rating
  const ratingStars = document.getElementById("rating-stars")
  ratingStars.innerHTML = ""

  const fullStars = Math.floor(product.rating)
  const hasHalfStar = product.rating % 1 !== 0

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i")
    if (i < fullStars) {
      star.className = "fas fa-star"
    } else if (i === fullStars && hasHalfStar) {
      star.className = "fas fa-star-half-alt"
    } else {
      star.className = "far fa-star"
    }
    ratingStars.appendChild(star)
  }

  // Update review count
  document.getElementById("review-count").textContent = `(${product.reviewCount} ulasan)`
  document.getElementById("review-count-tab").textContent = product.reviewCount
  document.getElementById("review-count-summary").textContent = product.reviewCount

  // Update product description
  document.getElementById("product-description").textContent = product.description

  // Update full description in tab
  document.getElementById("product-description-full").innerHTML = product.fullDescription

  // Render color options
  const colorOptions = document.getElementById("color-options")
  colorOptions.innerHTML = ""

  product.colors.forEach((color, index) => {
    const colorOption = document.createElement("div")
    colorOption.className = `color-option ${index === 0 ? "active" : ""}`
    colorOption.style.backgroundColor = color.code
    colorOption.dataset.color = color.name

    if (color.name === "Putih") {
      colorOption.style.border = "1px solid #ddd"
    }

    colorOptions.appendChild(colorOption)

    // Add click event to color option
    colorOption.addEventListener("click", function () {
      // Update selected color text
      document.getElementById("selected-color-text").textContent = this.dataset.color

      // Update active state
      document.querySelectorAll(".color-option").forEach((option) => {
        option.classList.remove("active")
      })
      this.classList.add("active")
    })
  })

  // Render size options
  const sizeOptions = document.getElementById("size-options")
  sizeOptions.innerHTML = ""

  product.sizes.forEach((size, index) => {
    const sizeOption = document.createElement("div")
    sizeOption.className = `size-option ${index === 1 ? "active" : ""}`
    sizeOption.textContent = size
    sizeOption.dataset.size = size

    sizeOptions.appendChild(sizeOption)

    // Add click event to size option
    sizeOption.addEventListener("click", function () {
      // Update selected size text
      document.getElementById("selected-size-text").textContent = this.dataset.size

      // Update active state
      document.querySelectorAll(".size-option").forEach((option) => {
        option.classList.remove("active")
      })
      this.classList.add("active")
    })
  })

  // Update product meta
  const productMeta = document.getElementById("product-meta")
  productMeta.innerHTML = `
        <p><strong>SKU:</strong> ${product.sku}</p>
        <p><strong>Kategori:</strong> ${product.categories.map((cat) => `<a href="#">${cat}</a>`).join(", ")}</p>
        <p><strong>Tag:</strong> ${product.tags.map((tag) => `<a href="#">${tag}</a>`).join(", ")}</p>
    `

  // Update additional info table
  const infoTable = document.getElementById("info-table")
  infoTable.innerHTML = ""

  for (const [key, value] of Object.entries(product.additionalInfo)) {
    const row = document.createElement("tr")

    const th = document.createElement("th")
    th.textContent = key

    const td = document.createElement("td")
    td.textContent = value

    row.appendChild(th)
    row.appendChild(td)
    infoTable.appendChild(row)
  }

  // Update average rating
  document.getElementById("average-rating").textContent = product.rating

  // Update average stars
  const averageStars = document.getElementById("average-stars")
  averageStars.innerHTML = ""

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i")
    if (i < fullStars) {
      star.className = "fas fa-star"
    } else if (i === fullStars && hasHalfStar) {
      star.className = "fas fa-star-half-alt"
    } else {
      star.className = "far fa-star"
    }
    averageStars.appendChild(star)
  }

  // Update rating bars
  const ratingBars = document.getElementById("rating-bars")
  ratingBars.innerHTML = ""

  for (let i = 5; i >= 1; i--) {
    const percentage = product.ratingDistribution[i] || 0

    const ratingBar = document.createElement("div")
    ratingBar.className = "rating-bar"

    ratingBar.innerHTML = `
            <span>${i} Bintang</span>
            <div class="bar-container">
                <div class="bar" style="width: ${percentage}%;"></div>
            </div>
            <span>${percentage}%</span>
        `

    ratingBars.appendChild(ratingBar)
  }

  // Render reviews
  const reviewsList = document.getElementById("reviews-list")
  reviewsList.innerHTML = ""

  product.reviews.forEach((review) => {
    const reviewItem = document.createElement("div")
    reviewItem.className = "review-item"

    // Create stars HTML
    let starsHtml = ""
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(review.rating)) {
        starsHtml += '<i class="fas fa-star"></i>'
      } else if (i === Math.floor(review.rating) && review.rating % 1 !== 0) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>'
      } else {
        starsHtml += '<i class="far fa-star"></i>'
      }
    }

    reviewItem.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.avatar}" alt="${review.name}" class="reviewer-avatar">
                    <div>
                        <h4>${review.name}</h4>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${starsHtml}
                </div>
            </div>
            <div class="review-content">
                <p>${review.content}</p>
            </div>
        `

    reviewsList.appendChild(reviewItem)
  })
}

// Setup event listeners
function setupEventListeners() {
  // Quantity selector
  const minusBtn = document.querySelector(".quantity-btn.minus")
  const plusBtn = document.querySelector(".quantity-btn.plus")
  const quantityInput = document.getElementById("quantity-input")

  minusBtn.addEventListener("click", () => {
    const currentValue = Number.parseInt(quantityInput.value)
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1
    }
  })

  plusBtn.addEventListener("click", () => {
    const currentValue = Number.parseInt(quantityInput.value)
    if (currentValue < 10) {
      quantityInput.value = currentValue + 1
    }
  })

  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all tabs
      tabBtns.forEach((tab) => tab.classList.remove("active"))
      document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")
      document.getElementById(this.dataset.tab).classList.add("active")
    })
  })

  // Rating select in review form
  const ratingStars = document.querySelectorAll(".rating-select i")

  ratingStars.forEach((star) => {
    star.addEventListener("click", function () {
      const rating = Number.parseInt(this.dataset.rating)

      // Update stars
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.className = "fas fa-star active"
        } else {
          s.className = "far fa-star"
        }
      })
    })

    star.addEventListener("mouseover", function () {
      const rating = Number.parseInt(this.dataset.rating)

      // Update stars on hover
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.className = "fas fa-star"
        } else {
          s.className = "far fa-star"
        }
      })
    })
  })

  // Review form submission
  const reviewForm = document.querySelector(".review-form")

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const name = document.getElementById("review-name").value
    const email = document.getElementById("review-email").value
    const content = document.getElementById("review-content").value

    // Get selected rating
    const activeStars = document.querySelectorAll(".rating-select i.active")
    const rating = activeStars.length

    if (rating === 0) {
      alert("Silakan pilih rating")
      return
    }

    // In a real application, you would send this data to your server
    alert("Terima kasih atas ulasan Anda!")

    // Reset form
    reviewForm.reset()
    ratingStars.forEach((s) => (s.className = "far fa-star"))
  })

  // Add to cart button
  const addToCartBtn = document.querySelector(".add-to-cart-btn")

  addToCartBtn.addEventListener("click", () => {
    const productTitle = document.getElementById("product-title").textContent
    const quantity = Number.parseInt(document.getElementById("quantity-input").value)
    const selectedColor = document.getElementById("selected-color-text").textContent
    const selectedSize = document.getElementById("selected-size-text").textContent

    // In a real application, you would add this product to the cart
    // For now, just show an alert
    alert(`${productTitle} (${selectedColor}, ${selectedSize}) x${quantity} telah ditambahkan ke keranjang`)

    // Update cart count (simulated)
    const cartCount = document.getElementById("cart-count")
    cartCount.textContent = Number.parseInt(cartCount.textContent) + quantity
  })

  // Wishlist button
  const wishlistBtn = document.querySelector(".wishlist-btn")

  wishlistBtn.addEventListener("click", function () {
    const icon = this.querySelector("i")

    if (icon.classList.contains("far")) {
      icon.className = "fas fa-heart"
      icon.style.color = "#e74c3c"
      alert("Produk ditambahkan ke wishlist")
    } else {
      icon.className = "far fa-heart"
      icon.style.color = ""
      alert("Produk dihapus dari wishlist")
    }
  })
}
