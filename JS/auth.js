// Shared authentication utilities
const AuthUtils = {
  // Validate email format
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },

  // Validate phone number format
  validatePhone: (phone) => {
    const re = /^[+]?[1-9][\d]{0,15}$/
    return re.test(phone.replace(/\s/g, ""))
  },

  // Check password strength
  checkPasswordStrength: (password) => {
    let strength = 0
    let text = "Weak"
    let className = "strength-weak"

    if (password.length >= 8) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++

    if (strength >= 3) {
      text = "Medium"
      className = "strength-medium"
    }
    if (strength >= 4) {
      text = "Strong"
      className = "strength-strong"
    }

    return { strength, text, className }
  },

  // Show form error
  showError: (input, errorId, message) => {
    input.classList.add("error")
    input.classList.remove("success")
    document.getElementById(errorId).style.display = "block"
    document.getElementById(errorId).textContent = message
  },

  // Hide form error
  hideError: (input, errorId) => {
    input.classList.remove("error")
    input.classList.add("success")
    document.getElementById(errorId).style.display = "none"
  },

  // Show success message
  showSuccess: (elementId, message) => {
    const element = document.getElementById(elementId)
    element.textContent = message
    element.style.display = "block"
  },

  // Show error alert
  showErrorAlert: (elementId, message) => {
    const element = document.getElementById(elementId)
    element.textContent = message
    element.style.display = "block"
  },

  // Hide alert
  hideAlert: (elementId) => {
    document.getElementById(elementId).style.display = "none"
  },

  // Set loading state
  setLoading: (buttonId, loadingId, textId, isLoading) => {
    const button = document.getElementById(buttonId)
    const loading = document.getElementById(loadingId)
    const text = document.getElementById(textId)

    button.disabled = isLoading
    loading.style.display = isLoading ? "block" : "none"
    text.style.display = isLoading ? "none" : "block"
  },

  // Store user data in localStorage
  storeUser: (userData) => {
    localStorage.setItem("ameza_user", JSON.stringify(userData))
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userData = localStorage.getItem("ameza_user")
    return userData ? JSON.parse(userData) : null
  },

  // Check if user is logged in
  isLoggedIn: function () {
    return !!this.getCurrentUser()
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("ameza_user")
    window.location.href = "login.html"
  },

  // Redirect based on user role
  redirectBasedOnRole: (role) => {
    if (role === "admin") {
      window.location.href = "admin/index.html"
    } else {
      window.location.href = "index.html"
    }
  },

  // Check if user has admin role
  isAdmin: function () {
    const user = this.getCurrentUser()
    return user && user.role === "admin"
  },

  // Initialize mock users if none exist
  initMockUsers: () => {
    if (!localStorage.getItem("ameza_users")) {
      const mockUsers = [
        {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: "admin@ameza.com",
          phone: "123456789",
          password: "admin123",
          role: "admin",
        },
        {
          id: 2,
          firstName: "Regular",
          lastName: "User",
          email: "user@ameza.com",
          phone: "987654321",
          password: "user123",
          role: "user",
        },
      ]
      localStorage.setItem("ameza_users", JSON.stringify(mockUsers))
    }
  },

  // Get all users
  getAllUsers: () => {
    const users = localStorage.getItem("ameza_users")
    return users ? JSON.parse(users) : []
  },

  // Add new user
  addUser: function (userData) {
    const users = this.getAllUsers()
    userData.id = Date.now()
    users.push(userData)
    localStorage.setItem("ameza_users", JSON.stringify(users))
    return userData
  },

  // Find user by email
  findUserByEmail: function (email) {
    const users = this.getAllUsers()
    return users.find((user) => user.email === email)
  },

  // Authenticate user
  authenticateUser: function (email, password) {
    const user = this.findUserByEmail(email)
    if (user && user.password === password) {
      // Don't store password in localStorage for security
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  },
}

// Initialize mock users when the script loads
AuthUtils.initMockUsers()
