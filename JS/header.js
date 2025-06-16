// Import AuthUtils or declare it before using
const AuthUtils = {
  getCurrentUser: () => {
    // Mock implementation for demonstration
    return {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "user",
    }
  },
  logout: () => {
    // Mock implementation for demonstration
    console.log("User logged out")
  },
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = AuthUtils.getCurrentUser()

  // Update header based on login status
  const userMenuContainer = document.getElementById("userMenuContainer")
  const loginLink = document.getElementById("loginLink")

  if (currentUser) {
    // User is logged in
    if (userMenuContainer) {
      userMenuContainer.innerHTML = `
                <div class="user-menu">
                    <a href="#" class="user-menu-trigger">
                        <i class="fas fa-user-circle"></i>
                        <span>${currentUser.firstName}</span>
                    </a>
                    <div class="user-dropdown">
                        <div class="user-info">
                            <div class="user-name">${currentUser.firstName} ${currentUser.lastName}</div>
                            <div class="user-email">${currentUser.email}</div>
                        </div>
                        <ul>
                            <li><a href="${currentUser.role === "admin" ? "admin/index.html" : "profile.html"}">
                                <i class="fas fa-user"></i> My Profile
                            </a></li>
                            <li><a href="orders.html">
                                <i class="fas fa-shopping-bag"></i> My Orders
                            </a></li>
                            ${
                              currentUser.role === "admin"
                                ? `<li><a href="admin/index.html">
                                    <i class="fas fa-tachometer-alt"></i> Admin Dashboard
                                </a></li>`
                                : ""
                            }
                            <li><a href="#" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </a></li>
                        </ul>
                    </div>
                </div>
            `

      // Add event listener for user menu dropdown
      const userMenuTrigger = document.querySelector(".user-menu-trigger")
      const userDropdown = document.querySelector(".user-dropdown")

      if (userMenuTrigger && userDropdown) {
        userMenuTrigger.addEventListener("click", (e) => {
          e.preventDefault()
          userDropdown.classList.toggle("active")
        })

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          if (!userMenuTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove("active")
          }
        })
      }

      // Add event listener for logout
      const logoutBtn = document.getElementById("logoutBtn")
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault()
          AuthUtils.logout()
        })
      }
    }

    // Hide login link if it exists
    if (loginLink) {
      loginLink.style.display = "none"
    }
  } else {
    // User is not logged in
    if (userMenuContainer) {
      userMenuContainer.innerHTML = `
                <a href="login.html" class="login-btn">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                </a>
            `
    }

    // Show login link if it exists
    if (loginLink) {
      loginLink.style.display = "block"
    }
  }
})
