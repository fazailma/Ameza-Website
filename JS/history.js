document.addEventListener("DOMContentLoaded", () => {
  console.log("History page loaded")

  // Initialize history page
  initHistoryPage()

  // Load user data
  loadUserData()

  // Setup event listeners
  setupEventListeners()

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

function initHistoryPage() {
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

  // Update cart count
  updateCartCount()
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

  // Load profile image
  loadProfileImage()
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
}

function setupEventListeners() {
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
