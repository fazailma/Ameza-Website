document.addEventListener("DOMContentLoaded", () => {
  console.log("Profile page loaded")

  // Initialize profile page
  initProfilePage()

  // Load user data
  loadUserData()

  // Setup event listeners
  setupEventListeners()

  // Setup photo upload functionality
  setupPhotoUpload()

  // Update cart count on page load
  updateCartCount()

  // Listen for cart updates from other pages
  window.addEventListener("storage", (e) => {
    if (e.key === "cart" || e.key === "cartCount") {
      updateCartCount()
    }
  })

  // Listen for custom cart update events
  window.addEventListener("cartUpdated", () => {
    updateCartCount()
  })
})

function initProfilePage() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
  if (!currentUser) {
    // Create default user if not exists
    const defaultUser = {
      firstName: "faza",
      lastName: "ilma",
      email: "user@ameza.com",
      phone: "+62 812 3456 7890",
      birthDate: "1995-03-15",
      gender: "female",
      profileImage: null,
    }
    localStorage.setItem("ameza_current_user", JSON.stringify(defaultUser))
  }

  // Load saved profile image
  loadProfileImage()

  // Update cart count
  updateCartCount()
}

function setupPhotoUpload() {
  const mobileAvatar = document.getElementById("mobile-avatar")
  const photoUpload = document.getElementById("photo-upload")

  if (mobileAvatar && photoUpload) {
    // Click on avatar to trigger file upload
    mobileAvatar.addEventListener("click", () => {
      photoUpload.click()
    })

    // Handle file selection
    photoUpload.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          showNotification("Harap pilih file gambar yang valid!", "error")
          return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showNotification("Ukuran file terlalu besar! Maksimal 5MB.", "error")
          return
        }

        // Read and display the image
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = e.target.result

          // Update all profile images
          updateAllProfileImages(imageData)

          // Save to localStorage
          const currentUser = JSON.parse(localStorage.getItem("ameza_current_user")) || {}
          currentUser.profileImage = imageData
          localStorage.setItem("ameza_current_user", JSON.stringify(currentUser))

          showNotification("Foto profil berhasil diperbarui!", "success")
        }

        reader.onerror = () => {
          showNotification("Gagal membaca file gambar!", "error")
        }

        reader.readAsDataURL(file)
      }
    })
  }
}

function updateAllProfileImages(imageData) {
  // Update mobile profile image
  const profileImage = document.getElementById("profile-image")
  if (profileImage) {
    profileImage.src = imageData
  }

  // Update desktop profile image
  const desktopUserAvatar = document.getElementById("desktop-user-avatar")
  if (desktopUserAvatar) {
    desktopUserAvatar.src = imageData
  }

  // Update any other profile images on the page
  const allProfileImages = document.querySelectorAll('[id*="user-avatar"], [id*="profile-image"]')
  allProfileImages.forEach((img) => {
    if (img && img.tagName === "IMG") {
      img.src = imageData
    }
  })

  // Dispatch event for other pages to listen
  window.dispatchEvent(
    new CustomEvent("profileImageUpdated", {
      detail: { imageData },
    }),
  )

  // Also save to a global key for cross-page access
  localStorage.setItem("ameza_profile_image", imageData)
}

function loadProfileImage() {
  const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
  const globalProfileImage = localStorage.getItem("ameza_profile_image")

  let imageData = null

  if (currentUser && currentUser.profileImage) {
    imageData = currentUser.profileImage
  } else if (globalProfileImage) {
    imageData = globalProfileImage
  }

  if (imageData) {
    updateAllProfileImages(imageData)
  }
}

function loadUserData() {
  const currentUser = JSON.parse(localStorage.getItem("ameza_current_user"))
  if (!currentUser) return

  // Update user info in desktop sidebar
  const userNameElement = document.getElementById("user-name")
  const userEmailElement = document.getElementById("user-email")

  // Update user info in mobile section
  const mobileUserNameElement = document.getElementById("mobile-user-name")
  const mobileUserEmailElement = document.getElementById("mobile-user-email")

  const fullName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "User"
  const email = currentUser.email || "user@example.com"

  if (userNameElement) userNameElement.textContent = fullName
  if (userEmailElement) userEmailElement.textContent = email
  if (mobileUserNameElement) mobileUserNameElement.textContent = fullName
  if (mobileUserEmailElement) mobileUserEmailElement.textContent = email

  // Fill mobile form fields
  const firstNameInput = document.getElementById("first-name")
  const lastNameInput = document.getElementById("last-name")
  const emailInput = document.getElementById("email")
  const phoneInput = document.getElementById("phone")
  const birthDateInput = document.getElementById("birth-date")
  const genderSelect = document.getElementById("gender")

  if (firstNameInput) firstNameInput.value = currentUser.firstName || ""
  if (lastNameInput) lastNameInput.value = currentUser.lastName || ""
  if (emailInput) emailInput.value = currentUser.email || ""
  if (phoneInput) phoneInput.value = currentUser.phone || ""
  if (birthDateInput) birthDateInput.value = currentUser.birthDate || ""
  if (genderSelect) genderSelect.value = currentUser.gender || "female"

  // Fill desktop form fields
  const desktopFirstNameInput = document.getElementById("desktop-first-name")
  const desktopLastNameInput = document.getElementById("desktop-last-name")
  const desktopEmailInput = document.getElementById("desktop-email")
  const desktopPhoneInput = document.getElementById("desktop-phone")
  const desktopBirthDateInput = document.getElementById("desktop-birth-date")
  const desktopGenderSelect = document.getElementById("desktop-gender")

  if (desktopFirstNameInput) desktopFirstNameInput.value = currentUser.firstName || ""
  if (desktopLastNameInput) desktopLastNameInput.value = currentUser.lastName || ""
  if (desktopEmailInput) desktopEmailInput.value = currentUser.email || ""
  if (desktopPhoneInput) desktopPhoneInput.value = currentUser.phone || ""
  if (desktopBirthDateInput) desktopBirthDateInput.value = currentUser.birthDate || ""
  if (desktopGenderSelect) desktopGenderSelect.value = currentUser.gender || "female"

  // Load profile image
  loadProfileImage()
}

function setupEventListeners() {
  // Mobile profile form submission
  const profileForm = document.getElementById("profile-form")
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveUserProfile("mobile")
    })
  }

  // Desktop profile form submission
  const desktopProfileForm = document.getElementById("desktop-profile-form")
  if (desktopProfileForm) {
    desktopProfileForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveUserProfile("desktop")
    })
  }

  // Reset buttons
  const resetBtn = document.getElementById("reset-btn")
  const desktopResetBtn = document.getElementById("desktop-reset-btn")

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mereset form ke data asli?")) {
        loadUserData()
      }
    })
  }

  if (desktopResetBtn) {
    desktopResetBtn.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mereset form ke data asli?")) {
        loadUserData()
      }
    })
  }

  // Logout buttons
  const logoutBtn = document.getElementById("logout-btn")
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      handleLogout()
    })
  }

  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      handleLogout()
    })
  }
}

function saveUserProfile(formType = "mobile") {
  const currentUser = JSON.parse(localStorage.getItem("ameza_current_user")) || {}

  let firstName, lastName, email, phone, birthDate, gender

  if (formType === "desktop") {
    firstName = document.getElementById("desktop-first-name").value
    lastName = document.getElementById("desktop-last-name").value
    email = document.getElementById("desktop-email").value
    phone = document.getElementById("desktop-phone").value
    birthDate = document.getElementById("desktop-birth-date").value
    gender = document.getElementById("desktop-gender").value
  } else {
    firstName = document.getElementById("first-name").value
    lastName = document.getElementById("last-name").value
    email = document.getElementById("email").value
    phone = document.getElementById("phone").value
    birthDate = document.getElementById("birth-date").value
    gender = document.getElementById("gender").value
  }

  // Update current user data
  currentUser.firstName = firstName
  currentUser.lastName = lastName
  currentUser.email = email
  currentUser.phone = phone
  currentUser.birthDate = birthDate
  currentUser.gender = gender

  // Save to localStorage
  localStorage.setItem("ameza_current_user", JSON.stringify(currentUser))

  // Update display
  loadUserData()

  // Show success message
  showNotification("Profil berhasil diperbarui!", "success")
}

function handleLogout() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    localStorage.removeItem("ameza_current_user")
    localStorage.removeItem("cart")
    localStorage.removeItem("cartCount")
    localStorage.removeItem("ameza_profile_image")
    window.location.href = "login.html"
  }
}

function updateCartCount() {
  // Get cart count from localStorage (same as shop.js)
  const savedCartCount = localStorage.getItem("cartCount")
  const cartCount = savedCartCount ? Number.parseInt(savedCartCount) : 0

  console.log("Updating cart count:", cartCount)

  // Update desktop cart count
  const desktopCartCount = document.getElementById("cart-count")
  if (desktopCartCount) {
    desktopCartCount.textContent = cartCount
    desktopCartCount.style.display = cartCount > 0 ? "flex" : "none"
  }
}

function showNotification(message, type = "info") {
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

// Global function to sync cart across pages
window.syncCartCount = () => {
  updateCartCount()
}

// Dispatch custom event when cart is updated
function dispatchCartUpdate() {
  window.dispatchEvent(new CustomEvent("cartUpdated"))
}

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    updateCartCount,
    dispatchCartUpdate,
  }
}
