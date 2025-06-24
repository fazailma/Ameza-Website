// Checkout Manager Class
class CheckoutManager {
  constructor() {
    this.cart = this.loadCart()
    this.currentStep = 1
    this.orderData = {}
    this.init()
  }

  init() {
    this.updateCartCount()
    this.loadCartItems()
    this.initializeSteps()
    
    // Delay binding events to ensure DOM is ready
    setTimeout(() => {
      this.bindEvents()
    }, 100)
  }

  loadCart() {
    try {
      return JSON.parse(localStorage.getItem("amezaCart")) || []
    } catch (error) {
      console.error("Error loading cart:", error)
      return []
    }
  }

  updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0)

    // Update all cart count elements
    const cartCountElements = document.querySelectorAll("#cart-count, #cart-count-mobile")
    cartCountElements.forEach((element) => {
      if (element) {
        element.textContent = totalItems
      }
    })

    // Show/hide badge
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

  loadCartItems() {
    const orderItems = document.getElementById("order-items")
    if (!orderItems || this.cart.length === 0) {
      // Redirect to cart if empty
      if (this.cart.length === 0) {
        window.location.href = "cart.html"
        return
      }
    }

    let subtotal = 0
    orderItems.innerHTML = ""

    this.cart.forEach((item) => {
      const price = typeof item.price === "string" ? Number.parseInt(item.price.replace(/\D/g, "")) : item.price
      const itemTotal = price * item.quantity
      subtotal += itemTotal

      const orderItem = document.createElement("div")
      orderItem.className = "order-item"
      orderItem.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://i.pinimg.com/736x/9e/37/d7/9e37d7607ebd223a0d636e018e56bc6c.jpg'">
        </div>
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>Kategori: ${item.category || "Fashion"}</p>
          <p>Ukuran: ${item.size || "M"}</p>
          <p>Warna: ${item.color || "Default"}</p>
          <p>Jumlah: ${item.quantity}</p>
        </div>
        <div class="item-price">${this.formatPrice(itemTotal)}</div>
      `
      orderItems.appendChild(orderItem)
    })

    // Update summary
    this.updateOrderSummary(subtotal)
  }

  updateOrderSummary(subtotal) {
    const shipping = 20000
    const discount = 0
    const total = subtotal + shipping - discount

    // Update summary elements
    document.getElementById("summary-item-count").textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0)
    document.getElementById("summary-subtotal").textContent = this.formatPrice(subtotal)
    document.getElementById("summary-shipping").textContent = this.formatPrice(shipping)
    document.getElementById("summary-discount").textContent = `- ${this.formatPrice(discount)}`
    document.getElementById("summary-total").textContent = this.formatPrice(total)

    // Store totals for later use
    this.orderData.subtotal = subtotal
    this.orderData.shipping = shipping
    this.orderData.discount = discount
    this.orderData.total = total
  }

  formatPrice(price) {
    return `Rp ${price.toLocaleString("id-ID")}`
  }

  initializeSteps() {
    // Show first step
    this.showStep(1)
    this.updateProgress(1)
  }

  bindEvents() {
    // Next step buttons
    document.querySelectorAll(".next-step").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        const button = e.currentTarget
        const nextStep = Number.parseInt(button.getAttribute("data-next"))
        console.log("Next step clicked:", nextStep) // Debug log
        if (this.validateCurrentStep()) {
          this.goToStep(nextStep)
        }
      })
    })

    // Previous step buttons
    document.querySelectorAll(".prev-step").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        const button = e.currentTarget
        const prevStep = Number.parseInt(button.getAttribute("data-prev"))
        console.log("Previous step clicked:", prevStep) // Debug log
        this.goToStep(prevStep)
      })
    })

    // Payment method selection
    document.querySelectorAll('input[name="payment"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        this.handlePaymentSelection()
      })
    })

    // Location dropdowns
    this.bindLocationEvents()

    // Confirm order button
    const confirmBtn = document.getElementById("confirm-order-btn")
    if (confirmBtn) {
      confirmBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.confirmOrder()
      })
    }

    // Modal close
    const modalClose = document.getElementById("modal-close")
    if (modalClose) {
      modalClose.addEventListener("click", () => {
        this.closeModal()
      })
    }
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        return true // Order summary is always valid
      case 2:
        return this.validateAddressForm()
      case 3:
        return this.validatePaymentSelection()
      case 4:
        return this.validateSecurityCode()
      default:
        return true
    }
  }

  validateAddressForm() {
    const requiredFields = ["fullname", "phone", "email", "address", "province", "city", "district", "postal-code"]
    let isValid = true

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId)
      if (field && !field.value.trim()) {
        field.style.borderColor = "var(--danger)"
        isValid = false
      } else if (field) {
        field.style.borderColor = "var(--border-color)"
      }
    })

    if (!isValid) {
      this.showNotification("Harap isi semua kolom yang diperlukan", "error")
    } else {
      // Store address data
      this.orderData.address = {
        fullname: document.getElementById("fullname").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        province: document.getElementById("province").options[document.getElementById("province").selectedIndex].text,
        city: document.getElementById("city").options[document.getElementById("city").selectedIndex].text,
        district: document.getElementById("district").options[document.getElementById("district").selectedIndex].text,
        postalCode: document.getElementById("postal-code").value,
        notes: document.getElementById("shipping-notes").value,
      }
    }

    return isValid
  }

  validatePaymentSelection() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked')
    if (!selectedPayment) {
      this.showNotification("Harap pilih metode pembayaran", "error")
      return false
    }

    // Store payment data
    this.orderData.payment = {
      method: selectedPayment.value,
      name: selectedPayment.nextElementSibling.querySelector(".payment-name").textContent,
    }

    return true
  }

  validateSecurityCode() {
    const securityCode = document.getElementById("security-code").value
    if (!securityCode || securityCode.length < 4) {
      this.showNotification("Harap masukkan kode keamanan yang valid", "error")
      return false
    }
    return true
  }

  goToStep(stepNumber) {
    console.log("Going to step:", stepNumber, "from:", this.currentStep) // Debug log
    
    this.currentStep = stepNumber
    
    // Use setTimeout to ensure DOM updates properly
    setTimeout(() => {
      this.showStep(stepNumber)
      this.updateProgress(stepNumber)

      // Update confirmation data when reaching step 4
      if (stepNumber === 4) {
        this.updateConfirmationData()
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 50)
  }

  showStep(stepNumber) {
    console.log("Showing step:", stepNumber) // Debug log
    
    // Hide all steps
    document.querySelectorAll(".checkout-step").forEach((step) => {
      step.classList.remove("active")
      step.style.display = "none"
    })

    // Show target step
    const targetStep = document.getElementById(`step-${stepNumber}`)
    if (targetStep) {
      targetStep.classList.add("active")
      targetStep.style.display = "block"
      console.log("Step", stepNumber, "is now visible") // Debug log
    } else {
      console.error("Step element not found:", `step-${stepNumber}`)
    }
  }

  updateProgress(stepNumber) {
    const progressSteps = document.querySelectorAll(".progress-step")
    const progressLines = document.querySelectorAll(".progress-line")

    progressSteps.forEach((step, index) => {
      const stepNum = index + 1
      if (stepNum < stepNumber) {
        step.classList.add("completed")
        step.classList.remove("active")
      } else if (stepNum === stepNumber) {
        step.classList.add("active")
        step.classList.remove("completed")
      } else {
        step.classList.remove("active", "completed")
      }
    })

    progressLines.forEach((line, index) => {
      if (index < stepNumber - 1) {
        line.classList.add("completed")
      } else {
        line.classList.remove("completed")
      }
    })
  }

  handlePaymentSelection() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked')
    const paymentDetails = document.getElementById("payment-details")
    const paymentNextBtn = document.getElementById("payment-next-btn")

    console.log("Payment selected:", selectedPayment?.value) // Debug log

    if (selectedPayment && paymentNextBtn) {
      paymentNextBtn.disabled = false
      paymentNextBtn.style.opacity = "1"
      this.showPaymentDetails(selectedPayment.value)
      if (paymentDetails) {
        paymentDetails.classList.add("active")
        paymentDetails.style.display = "block"
      }
    }
  }

  showPaymentDetails(paymentType) {
    const paymentDetails = document.getElementById("payment-details")
    let detailsHTML = ""

    const paymentInfo = {
      bca: {
        name: "Bank BCA",
        account: "1234-5678-9012-3456",
        holder: "PT Ameza Fashion Indonesia",
      },
      mandiri: {
        name: "Bank Mandiri",
        account: "9876-5432-1098-7654",
        holder: "PT Ameza Fashion Indonesia",
      },
      bni: {
        name: "Bank BNI",
        account: "5678-9012-3456-7890",
        holder: "PT Ameza Fashion Indonesia",
      },
      gopay: {
        name: "GoPay",
        account: "0812-3456-7890",
        holder: "Ameza Fashion",
      },
    }

    const info = paymentInfo[paymentType]
    if (info) {
      detailsHTML = `
        <h4>Instruksi Pembayaran ${info.name}</h4>
        <p>Silakan transfer ke ${paymentType === "gopay" ? "nomor" : "rekening"} berikut:</p>
        <div class="account-number">
          <span>${info.account}</span>
          <button class="copy-btn" data-clipboard="${info.account}">
            <i class="las la-copy"></i>
          </button>
        </div>
        <p>Atas nama: ${info.holder}</p>
        <p>Jumlah: ${this.formatPrice(this.orderData.total)}</p>
        <p>Catatan: Pembayaran akan diverifikasi dalam 5-10 menit setelah transfer.</p>
      `
    }

    paymentDetails.innerHTML = detailsHTML

    // Bind copy functionality
    const copyBtn = paymentDetails.querySelector(".copy-btn")
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const textToCopy = copyBtn.getAttribute("data-clipboard")
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.innerHTML = '<i class="las la-check"></i>'
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="las la-copy"></i>'
          }, 2000)
        })
      })
    }
  }

  updateConfirmationData() {
    // Update order items
    const confirmationItems = document.getElementById("confirmation-items")
    confirmationItems.innerHTML = `
      <div class="confirmation-item">
        <span>${this.cart.reduce((sum, item) => sum + item.quantity, 0)} Produk</span>
        <span>${this.formatPrice(this.orderData.subtotal)}</span>
      </div>
      <div class="confirmation-item">
        <span>Ongkos Kirim</span>
        <span>${this.formatPrice(this.orderData.shipping)}</span>
      </div>
      <div class="confirmation-item">
        <span>Diskon</span>
        <span>- ${this.formatPrice(this.orderData.discount)}</span>
      </div>
      <div class="confirmation-item total">
        <span>Total</span>
        <span>${this.formatPrice(this.orderData.total)}</span>
      </div>
    `

    // Update address
    const confirmationAddress = document.getElementById("confirmation-address")
    if (this.orderData.address) {
      confirmationAddress.innerHTML = `
        <p><strong>Nama:</strong> ${this.orderData.address.fullname}</p>
        <p><strong>Telepon:</strong> ${this.orderData.address.phone}</p>
        <p><strong>Email:</strong> ${this.orderData.address.email}</p>
        <p><strong>Alamat:</strong> ${this.orderData.address.address}</p>
        <p><strong>Kota:</strong> ${this.orderData.address.city}, ${this.orderData.address.province}</p>
        <p><strong>Kode Pos:</strong> ${this.orderData.address.postalCode}</p>
      `
    }

    // Update payment
    const confirmationPayment = document.getElementById("confirmation-payment")
    if (this.orderData.payment) {
      confirmationPayment.innerHTML = `
        <p><strong>Metode:</strong> ${this.orderData.payment.name}</p>
        <p><strong>Total:</strong> ${this.formatPrice(this.orderData.total)}</p>
      `
    }
  }

  bindLocationEvents() {
    const provinceSelect = document.getElementById("province")
    const citySelect = document.getElementById("city")
    const districtSelect = document.getElementById("district")

    if (provinceSelect) {
      provinceSelect.addEventListener("change", (e) => {
        const selectedProvince = e.target.value
        console.log("Province selected:", selectedProvince) // Debug log

        // Reset city and district
        citySelect.innerHTML = '<option value="">Pilih Kota/Kabupaten</option>'
        districtSelect.innerHTML = '<option value="">Pilih Kecamatan</option>'

        if (selectedProvince) {
          this.populateCities(selectedProvince)
        }
      })
    }

    if (citySelect) {
      citySelect.addEventListener("change", (e) => {
        const selectedCity = e.target.value
        console.log("City selected:", selectedCity) // Debug log

        // Reset district
        districtSelect.innerHTML = '<option value="">Pilih Kecamatan</option>'

        if (selectedCity) {
          this.populateDistricts(selectedCity)
        }
      })
    }
  }

  populateCities(province) {
    const citySelect = document.getElementById("city")
    if (!citySelect) return

    // Clear existing options
    citySelect.innerHTML = '<option value="">Pilih Kota/Kabupaten</option>'

    const cities = {
      jakarta: ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur"],
      "jawa-barat": [
        "Bandung",
        "Bogor",
        "Depok",
        "Bekasi",
        "Cimahi",
        "Tangerang",
        "Tangerang Selatan",
        "Karawang",
        "Purwakarta",
        "Subang",
      ],
      "jawa-tengah": [
        "Semarang",
        "Solo",
        "Magelang",
        "Salatiga",
        "Pekalongan",
        "Tegal",
        "Purwokerto",
        "Klaten",
        "Yogyakarta",
      ],
      "jawa-timur": [
        "Surabaya",
        "Malang",
        "Kediri",
        "Madiun",
        "Probolinggo",
        "Jember",
        "Banyuwangi",
        "Sidoarjo",
        "Gresik",
      ],
      bali: ["Denpasar", "Badung", "Gianyar", "Tabanan", "Karangasem", "Klungkung", "Bangli", "Buleleng"],
    }

    console.log("Available cities for", province, ":", cities[province]) // Debug log

    if (cities[province]) {
      cities[province].forEach((city) => {
        const option = document.createElement("option")
        option.value = city.toLowerCase().replace(/\s+/g, "-")
        option.textContent = city
        citySelect.appendChild(option)
        console.log("Added city option:", city) // Debug log
      })
    }
  }

  populateDistricts(city) {
    const districtSelect = document.getElementById("district")
    districtSelect.innerHTML = '<option value="">Pilih Kecamatan</option>'

    const districts = {
      "jakarta-pusat": [
        "Menteng",
        "Tanah Abang",
        "Kemayoran",
        "Senen",
        "Cempaka Putih",
        "Gambir",
        "Sawah Besar",
        "Johar Baru",
      ],
      "jakarta-utara": ["Tanjung Priok", "Koja", "Kelapa Gading", "Pademangan", "Penjaringan", "Cilincing"],
      "jakarta-barat": [
        "Grogol Petamburan",
        "Taman Sari",
        "Tambora",
        "Kebon Jeruk",
        "Kalideres",
        "Palmerah",
        "Cengkareng",
        "Kembangan",
      ],
      "jakarta-selatan": [
        "Kebayoran Baru",
        "Kebayoran Lama",
        "Pesanggrahan",
        "Cilandak",
        "Pasar Minggu",
        "Jagakarsa",
        "Mampang Prapatan",
        "Pancoran",
        "Tebet",
        "Setia Budi",
      ],
      "jakarta-timur": [
        "Matraman",
        "Pulogadung",
        "Jatinegara",
        "Cakung",
        "Duren Sawit",
        "Kramat Jati",
        "Makasar",
        "Pasar Rebo",
        "Ciracas",
        "Cipayung",
      ],
      bandung: [
        "Coblong",
        "Cibeunying Kidul",
        "Cibeunying Wetan",
        "Sukajadi",
        "Buahbatu",
        "Antapani",
        "Arcamanik",
        "Astana Anyar",
        "Babakan Ciparay",
        "Bandung Kidul",
      ],
      bogor: ["Bogor Tengah", "Bogor Utara", "Bogor Selatan", "Bogor Timur", "Bogor Barat", "Tanah Sareal"],
      depok: [
        "Pancoran Mas",
        "Sukmajaya",
        "Limo",
        "Sawangan",
        "Beji",
        "Cipayung",
        "Cilodong",
        "Cimanggis",
        "Tapos",
        "Bojongsari",
        "Cinere",
      ],
      bekasi: [
        "Bekasi Timur",
        "Bekasi Barat",
        "Bekasi Utara",
        "Bekasi Selatan",
        "Medan Satria",
        "Bantar Gebang",
        "Mustika Jaya",
        "Pondok Gede",
        "Jati Asih",
        "Jati Sampurna",
        "Pondok Melati",
        "Rawalumbu",
      ],
      semarang: [
        "Semarang Tengah",
        "Semarang Utara",
        "Semarang Barat",
        "Semarang Selatan",
        "Semarang Timur",
        "Candisari",
        "Gajahmungkur",
        "Genuk",
        "Gunungpati",
        "Ngaliyan",
        "Pedurungan",
        "Tembalang",
        "Tugu",
        "Banyumanik",
        "Gayamsari",
        "Mijen",
      ],
      surabaya: [
        "Tegalsari",
        "Simokerto",
        "Genteng",
        "Bubutan",
        "Gubeng",
        "Wonokromo",
        "Sawahan",
        "Krembangan",
        "Semampir",
        "Pabean Cantian",
        "Sukomanunggal",
        "Tandes",
        "Asemrowo",
        "Benowo",
        "Lakarsantri",
        "Sambikerep",
        "Dukuh Pakis",
        "Gayungan",
        "Jambangan",
        "Karang Pilang",
        "Wonocolo",
        "Wiyung",
        "Tenggilis Mejoyo",
        "Gunung Anyar",
        "Rungkut",
        "Sukolilo",
        "Bulak",
        "Kenjeran",
        "Tambaksari",
        "Pakal",
        "Mulyorejo",
      ],
      denpasar: ["Denpasar Utara", "Denpasar Barat", "Denpasar Timur", "Denpasar Selatan"],
    }

    const fallbackDistricts = ["Kecamatan 1", "Kecamatan 2", "Kecamatan 3", "Kecamatan 4", "Kecamatan 5"]
    const districtsToUse = districts[city] || fallbackDistricts

    districtsToUse.forEach((district) => {
      const option = document.createElement("option")
      option.value = district.toLowerCase().replace(/\s+/g, "-")
      option.textContent = district
      districtSelect.appendChild(option)
    })
  }

  confirmOrder() {
    if (!this.validateSecurityCode()) {
      return
    }

    // Generate order ID
    const orderId = this.generateOrderId()

    // Create order object
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      status: "pending",
      items: this.cart,
      address: this.orderData.address,
      payment: this.orderData.payment,
      subtotal: this.orderData.subtotal,
      shipping: this.orderData.shipping,
      discount: this.orderData.discount,
      total: this.orderData.total,
      securityCode: document.getElementById("security-code").value,
    }

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("amezaOrders")) || []
    orders.push(order)
    localStorage.setItem("amezaOrders", JSON.stringify(orders))

    // Clear cart
    localStorage.setItem("amezaCart", JSON.stringify([]))

    // Update order number in modal
    document.getElementById("order-number").textContent = `#${orderId}`

    // Show success modal
    this.showModal()

    // Update cart count
    this.updateCartCount()
  }

  generateOrderId() {
    return "AMZ" + Date.now().toString().slice(-8)
  }

  showModal() {
    const modal = document.getElementById("success-modal")
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    const modal = document.getElementById("success-modal")
    modal.classList.remove("show")
    document.body.style.overflow = "auto"

    // Redirect to orders page
    setTimeout(() => {
      window.location.href = "orders.html"
    }, 500)
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
}

// Initialize checkout when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.checkoutManager = new CheckoutManager()
})

// Export for use in other pages
if (typeof module !== "undefined" && module.exports) {
  module.exports = CheckoutManager
}
