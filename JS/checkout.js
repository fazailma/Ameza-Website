document.addEventListener("DOMContentLoaded", () => {
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

  // Checkout steps navigation
  const steps = document.querySelectorAll(".checkout-step")
  const progressSteps = document.querySelectorAll(".progress-step")
  const progressLines = document.querySelectorAll(".progress-line")
  const nextButtons = document.querySelectorAll(".next-step")
  const prevButtons = document.querySelectorAll(".prev-step")

  // Initialize checkout steps
  function initCheckout() {
    // Show first step
    if (steps.length > 0) {
      steps[0].classList.add("active")
    }
    if (progressSteps.length > 0) {
      progressSteps[0].classList.add("active")
    }

    // Load cart items
    loadCartItems()

    // Pre-fill user data if logged in
    prefillUserData()
  }

  // Load cart items from localStorage
  function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem("ameza_cart")) || []
    const orderItems = document.querySelector(".order-items")
    const summarySubtotal = document.querySelector(".summary-row:first-child span:last-child")
    const summaryTotal = document.querySelector(".summary-row.total span:last-child")
    const confirmationItems = document.querySelector(".confirmation-items .confirmation-item:first-child")
    const confirmationTotal = document.querySelector(".confirmation-items .confirmation-item.total span:last-child")

    if (!orderItems || cart.length === 0) return

    orderItems.innerHTML = ""
    let subtotal = 0

    cart.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className = "order-item"

      itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image || "/placeholder.svg?height=100&width=100"}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-category">Kategori: ${item.category || "Fashion"}</p>
                    <p class="item-size">Ukuran: ${item.size || "M"}</p>
                    <p class="item-color">Warna: ${item.color || "Hitam"}</p>
                    <p class="item-quantity">Jumlah: ${item.quantity}</p>
                    <p class="item-price">Rp ${formatPrice(item.price)}</p>
                </div>
            `

      orderItems.appendChild(itemElement)
      subtotal += item.price * item.quantity
    })

    // Update summary
    const shipping = 20000
    const discount = 0
    const total = subtotal + shipping - discount

    if (summarySubtotal) summarySubtotal.textContent = `Rp ${formatPrice(subtotal)}`
    if (summaryTotal) summaryTotal.textContent = `Rp ${formatPrice(total)}`

    // Update confirmation
    if (confirmationItems)
      confirmationItems.innerHTML = `<span>${cart.length} Produk</span><span>Rp ${formatPrice(subtotal)}</span>`
    if (confirmationTotal) confirmationTotal.textContent = `Rp ${formatPrice(total)}`

    // Update order ID in success modal
    const orderIdElement = document.querySelector("#success-modal strong")
    if (orderIdElement) {
      const orderId = generateOrderId()
      orderIdElement.textContent = `#${orderId}`

      // Store order ID for later use
      localStorage.setItem("ameza_current_order_id", orderId)
    }
  }

  // Pre-fill user data if logged in
  function prefillUserData() {
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    if (!currentUser) return

    const fullnameInput = document.getElementById("fullname")
    const phoneInput = document.getElementById("phone")
    const emailInput = document.getElementById("email")
    const addressInput = document.getElementById("address")
    const postalCodeInput = document.getElementById("postal-code")

    if (fullnameInput) fullnameInput.value = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    if (phoneInput) phoneInput.value = currentUser.phone || ""
    if (emailInput) emailInput.value = currentUser.email || ""
    if (addressInput) addressInput.value = currentUser.address || ""
    if (postalCodeInput) postalCodeInput.value = currentUser.postalCode || ""
  }

  // Go to specific step
  function goToStep(stepNumber) {
    // Hide all steps
    steps.forEach((step) => step.classList.remove("active"))

    // Show target step
    const targetStep = document.getElementById(`step-${stepNumber}`)
    if (targetStep) {
      targetStep.classList.add("active")

      // Update progress indicators
      progressSteps.forEach((step, index) => {
        if (index < stepNumber) {
          step.classList.add("completed")
          step.classList.add("active")
          if (progressLines[index]) {
            progressLines[index].classList.add("active")
          }
        } else if (index === stepNumber - 1) {
          step.classList.add("active")
          step.classList.remove("completed")
          if (index > 0 && progressLines[index - 1]) {
            progressLines[index - 1].classList.add("active")
          }
        } else {
          step.classList.remove("active")
          step.classList.remove("completed")
          if (progressLines[index - 1]) {
            progressLines[index - 1].classList.remove("active")
          }
        }
      })

      // Scroll to top of the step
      window.scrollTo({
        top: document.querySelector(".checkout-progress").offsetTop - 100,
        behavior: "smooth",
      })
    }
  }

  // Next step button click handler
  if (nextButtons) {
    nextButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const nextStep = Number.parseInt(this.getAttribute("data-step"))

        // Validate current step before proceeding
        if (validateStep(nextStep - 1)) {
          goToStep(nextStep)
        }
      })
    })
  }

  // Previous step button click handler
  if (prevButtons) {
    prevButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const prevStep = Number.parseInt(this.getAttribute("data-step"))
        goToStep(prevStep)
      })
    })
  }

  // Validate step before proceeding
  function validateStep(stepNumber) {
    switch (stepNumber) {
      case 1:
        // Order summary validation (always valid)
        return true
      case 2:
        // Address validation
        return validateAddressForm()
      case 3:
        // Payment validation
        return validatePaymentSelection()
      default:
        return true
    }
  }

  // Validate address form
  function validateAddressForm() {
    const requiredFields = ["fullname", "phone", "email", "address", "province", "city", "district", "postal-code"]

    let isValid = true

    requiredFields.forEach((field) => {
      const input = document.getElementById(field)
      if (input && !input.value.trim()) {
        input.style.borderColor = "red"
        isValid = false
      } else if (input) {
        input.style.borderColor = "#ddd"
      }
    })

    if (!isValid) {
      alert("Harap isi semua kolom yang diperlukan.")
    } else {
      // Update confirmation address
      document.getElementById("conf-name").textContent = document.getElementById("fullname").value
      document.getElementById("conf-phone").textContent = document.getElementById("phone").value
      document.getElementById("conf-address").textContent = document.getElementById("address").value
      document.getElementById("conf-city").textContent =
        document.getElementById("province").options[document.getElementById("province").selectedIndex].text +
        ", " +
        document.getElementById("city").options[document.getElementById("city").selectedIndex].text
      document.getElementById("conf-postal").textContent = document.getElementById("postal-code").value
    }

    return isValid
  }

  // Payment method selection
  const paymentMethods = document.querySelectorAll('input[name="payment"]')
  const paymentNextBtn = document.getElementById("payment-next-btn")
  const paymentDetails = document.getElementById("payment-details")

  if (paymentMethods) {
    paymentMethods.forEach((method) => {
      method.addEventListener("change", function () {
        if (this.checked) {
          // Enable next button
          if (paymentNextBtn) {
            paymentNextBtn.disabled = false
          }

          // Show payment details
          if (paymentDetails) {
            const paymentType = this.value
            showPaymentDetails(paymentType)

            // Update confirmation payment
            document.getElementById("conf-payment-method").textContent =
              this.nextElementSibling.querySelector("span").textContent
            document.getElementById("conf-payment-detail").textContent = `${paymentType.toUpperCase()} - Transfer`
          }
        }
      })
    })
  }

  // Validate payment selection
  function validatePaymentSelection() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked')
    if (!selectedPayment) {
      alert("Harap pilih metode pembayaran.")
      return false
    }
    return true
  }

  // Show payment details based on selected method
  function showPaymentDetails(paymentType) {
    let detailsHTML = ""

    switch (paymentType) {
      case "bca":
        detailsHTML = `
                    <h4>Instruksi Pembayaran BCA</h4>
                    <p>Silakan transfer ke rekening berikut:</p>
                    <div class="account-number">
                        <span>1234-5678-9012-3456</span>
                        <button class="copy-btn" data-clipboard="1234-5678-9012-3456">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p>Atas nama: PT Ameza Fashion Indonesia</p>
                    <p>Jumlah: Rp 420.000</p>
                    <p>Catatan: Pembayaran akan diverifikasi dalam 5-10 menit setelah transfer.</p>
                `
        break
      case "mandiri":
        detailsHTML = `
                    <h4>Instruksi Pembayaran Mandiri</h4>
                    <p>Silakan transfer ke rekening berikut:</p>
                    <div class="account-number">
                        <span>9876-5432-1098-7654</span>
                        <button class="copy-btn" data-clipboard="9876-5432-1098-7654">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p>Atas nama: PT Ameza Fashion Indonesia</p>
                    <p>Jumlah: Rp 420.000</p>
                    <p>Catatan: Pembayaran akan diverifikasi dalam 5-10 menit setelah transfer.</p>
                `
        break
      case "bni":
        detailsHTML = `
                    <h4>Instruksi Pembayaran BNI</h4>
                    <p>Silakan transfer ke rekening berikut:</p>
                    <div class="account-number">
                        <span>5678-9012-3456-7890</span>
                        <button class="copy-btn" data-clipboard="5678-9012-3456-7890">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p>Atas nama: PT Ameza Fashion Indonesia</p>
                    <p>Jumlah: Rp 420.000</p>
                    <p>Catatan: Pembayaran akan diverifikasi dalam 5-10 menit setelah transfer.</p>
                `
        break
      case "gopay":
        detailsHTML = `
                    <h4>Instruksi Pembayaran GoPay</h4>
                    <p>Silakan scan QR code berikut atau transfer ke nomor berikut:</p>
                    <div class="account-number">
                        <span>0812-3456-7890</span>
                        <button class="copy-btn" data-clipboard="0812-3456-7890">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p>Atas nama: Ameza Fashion</p>
                    <p>Jumlah: Rp 420.000</p>
                    <p>Catatan: Pembayaran akan diverifikasi secara otomatis.</p>
                `
        break
      default:
        detailsHTML = "<p>Silakan pilih metode pembayaran.</p>"
    }

    paymentDetails.innerHTML = detailsHTML
    paymentDetails.classList.add("active")

    // Add copy functionality
    const copyButtons = document.querySelectorAll(".copy-btn")
    if (copyButtons) {
      copyButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const textToCopy = this.getAttribute("data-clipboard")
          navigator.clipboard.writeText(textToCopy).then(() => {
            // Show copied feedback
            const originalIcon = this.innerHTML
            this.innerHTML = '<i class="fas fa-check"></i>'
            setTimeout(() => {
              this.innerHTML = originalIcon
            }, 2000)
          })
        })
      })
    }
  }

  // Confirm order button
  const confirmOrderBtn = document.getElementById("confirm-order-btn")
  const successModal = document.getElementById("success-modal")
  const closeModalBtn = document.querySelector(".close-modal")

  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", () => {
      const securityCode = document.getElementById("security-code")

      if (!securityCode || !securityCode.value.trim()) {
        alert("Harap masukkan kode keamanan.")
        return
      }

      // Process the order
      processOrder()

      // Show success modal
      if (successModal) {
        successModal.classList.add("active")
      }
    })
  }

  // Process order and save to localStorage
  function processOrder() {
    const cart = JSON.parse(localStorage.getItem("ameza_cart")) || []
    const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
    const orderId = localStorage.getItem("ameza_current_order_id") || generateOrderId()

    if (!currentUser || cart.length === 0) return

    // Calculate totals
    let subtotal = 0
    cart.forEach((item) => {
      subtotal += item.price * item.quantity
    })

    const shipping = 20000
    const discount = 0
    const total = subtotal + shipping - discount

    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked')
    const paymentMethod = selectedPayment ? selectedPayment.value : "bank-transfer"

    // Get shipping address
    const fullname = document.getElementById("fullname").value
    const phone = document.getElementById("phone").value
    const email = document.getElementById("email").value
    const address = document.getElementById("address").value
    const province = document.getElementById("province").options[document.getElementById("province").selectedIndex].text
    const city = document.getElementById("city").options[document.getElementById("city").selectedIndex].text
    const postalCode = document.getElementById("postal-code").value

    // Create products string
    const products = cart.map((item) => item.name).join(", ")
    const quantities = cart.map((item) => item.quantity).join(", ")

    // Create transaction object
    const transaction = {
      transactionId: orderId,
      customerName: fullname,
      customerEmail: currentUser.email,
      customerPhone: phone,
      shippingAddress: `${address}, ${city}, ${province}, ${postalCode}`,
      products: products,
      quantity: quantities,
      total: total,
      subtotal: subtotal,
      shipping: shipping,
      discount: discount,
      paymentMethod: paymentMethod,
      status: "pending",
      date: new Date().toISOString(),
      notes: document.getElementById("shipping-notes") ? document.getElementById("shipping-notes").value : "",
    }

    // Save transaction to localStorage
    const transactions = JSON.parse(localStorage.getItem("ameza_transactions")) || []
    transactions.push(transaction)
    localStorage.setItem("ameza_transactions", JSON.stringify(transactions))

    // Clear cart
    localStorage.setItem("ameza_cart", JSON.stringify([]))

    // Update cart count
    const cartCount = document.getElementById("cart-count")
    if (cartCount) {
      cartCount.textContent = "0"
    }
  }

  // Generate a random order ID
  function generateOrderId() {
    return (
      "AMZ" +
      Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(8, "0")
    )
  }

  // Close modal
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener("click", () => {
      successModal.classList.remove("active")
      window.location.href = "orders.html"
    })
  }

  // Dynamic location selectors
  const provinceSelect = document.getElementById("province")
  const citySelect = document.getElementById("city")
  const districtSelect = document.getElementById("district")

  if (provinceSelect) {
    provinceSelect.addEventListener("change", function () {
      const selectedProvince = this.value

      // Clear city and district dropdowns
      citySelect.innerHTML = '<option value="">Pilih Kota/Kabupaten</option>'
      districtSelect.innerHTML = '<option value="">Pilih Kecamatan</option>'

      // Populate cities based on selected province
      if (selectedProvince) {
        populateCities(selectedProvince)
      }
    })
  }

  if (citySelect) {
    citySelect.addEventListener("change", function () {
      const selectedCity = this.value

      // Clear district dropdown
      districtSelect.innerHTML = '<option value="">Pilih Kecamatan</option>'

      // Populate districts based on selected city
      if (selectedCity) {
        populateDistricts(selectedCity)
      }
    })
  }

  // Populate cities based on province
  function populateCities(province) {
    // This would typically be an API call
    // For demo purposes, we'll use static data
    const cities = {
      jakarta: ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur"],
      "jawa-barat": ["Bandung", "Bogor", "Depok", "Bekasi", "Cimahi"],
      "jawa-tengah": ["Semarang", "Solo", "Magelang", "Salatiga", "Pekalongan"],
      "jawa-timur": ["Surabaya", "Malang", "Kediri", "Madiun", "Probolinggo"],
      bali: ["Denpasar", "Badung", "Gianyar", "Tabanan", "Karangasem"],
    }

    if (cities[province]) {
      cities[province].forEach((city) => {
        const option = document.createElement("option")
        option.value = city.toLowerCase().replace(" ", "-")
        option.textContent = city
        citySelect.appendChild(option)
      })
    }
  }

  // Populate districts based on city
  function populateDistricts(city) {
    // This would typically be an API call
    // For demo purposes, we'll use static data
    const districts = {
      "jakarta-pusat": ["Menteng", "Tanah Abang", "Kemayoran", "Senen", "Cempaka Putih"],
      bandung: ["Coblong", "Cibeunying", "Sukajadi", "Buahbatu", "Antapani"],
      semarang: ["Semarang Tengah", "Semarang Utara", "Semarang Barat", "Semarang Selatan", "Semarang Timur"],
      surabaya: ["Tegalsari", "Simokerto", "Genteng", "Bubutan", "Gubeng"],
      denpasar: ["Denpasar Utara", "Denpasar Barat", "Denpasar Timur", "Denpasar Selatan"],
    }

    // Fallback for cities not in our static data
    const fallbackDistricts = ["Kecamatan 1", "Kecamatan 2", "Kecamatan 3", "Kecamatan 4", "Kecamatan 5"]

    const districtsToUse = districts[city] || fallbackDistricts

    districtsToUse.forEach((district) => {
      const option = document.createElement("option")
      option.value = district.toLowerCase().replace(" ", "-")
      option.textContent = district
      districtSelect.appendChild(option)
    })
  }

  // Format price with thousand separator
  function formatPrice(price) {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  // Initialize checkout
  initCheckout()
})
