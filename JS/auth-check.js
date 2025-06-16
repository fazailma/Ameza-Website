// Import or declare AuthUtils here
const AuthUtils = {
  isLoggedIn: () => {
    // Implementation for checking if user is logged in
    return true // Placeholder
  },
  getCurrentUser: () => {
    // Implementation for getting current user
    return { firstName: "John", lastName: "Doe", role: "admin" } // Placeholder
  },
  logout: () => {
    // Implementation for logout functionality
    console.log("User logged out") // Placeholder
  },
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  if (!AuthUtils.isLoggedIn()) {
    // Redirect to login page if not logged in
    window.location.href = "login.html"
    return
  }

  // Get current user
  const currentUser = AuthUtils.getCurrentUser()

  // Check if current page is admin page
  const isAdminPage = window.location.href.includes("/admin/")

  // If admin page but user is not admin, redirect to user page
  if (isAdminPage && currentUser.role !== "admin") {
    window.location.href = "../index.html"
    return
  }

  // If user page but user is admin, redirect to admin page
  if (
    !isAdminPage &&
    currentUser.role === "admin" &&
    !window.location.href.includes("login.html") &&
    !window.location.href.includes("register.html")
  ) {
    window.location.href = "admin/index.html"
    return
  }

  // Update user info in UI if needed
  const userNameElement = document.getElementById("userName")
  if (userNameElement) {
    userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`
  }

  // Setup logout functionality
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      AuthUtils.logout()
    })
  }
})
