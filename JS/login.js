document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const errorAlert = document.getElementById("errorAlert")

  // Initialize mock users if not exists
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

  // Utility functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  function showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
    input.classList.add("error")
  }

  function hideError(input, errorId) {
    const errorElement = document.getElementById(errorId)
    if (errorElement) {
      errorElement.style.display = "none"
    }
    input.classList.remove("error")
  }

  function setLoading(btnId, loadingId, textId, isLoading) {
    const btn = document.getElementById(btnId)
    const loading = document.getElementById(loadingId)
    const text = document.getElementById(textId)

    if (btn && loading && text) {
      if (isLoading) {
        btn.disabled = true
        loading.style.display = "inline-block"
        text.style.display = "none"
      } else {
        btn.disabled = false
        loading.style.display = "none"
        text.style.display = "inline-block"
      }
    }
  }

  function hideAlert(alertId) {
    const alertElement = document.getElementById(alertId)
    if (alertElement) {
      alertElement.style.display = "none"
    }
  }

  function showSuccess(successId, message) {
    const successElement = document.getElementById(successId)
    if (successElement) {
      successElement.textContent = message
      successElement.style.display = "block"
    }
  }

  function showErrorAlert(alertId, message) {
    const alertElement = document.getElementById(alertId)
    if (alertElement) {
      alertElement.textContent = message
      alertElement.style.display = "block"
    }
  }

  function authenticateUser(email, password) {
    const users = JSON.parse(localStorage.getItem("ameza_users")) || []
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      // Don't store password in session
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  }

  function storeUser(user) {
    localStorage.setItem("ameza_current_user", JSON.stringify(user))
  }

  function redirectBasedOnRole(role) {
    if (role === "admin") {
      window.location.href = "admin/index.html"
    } else {
      window.location.href = "index.html"
    }
  }

  // Real-time validation
  emailInput.addEventListener("input", function () {
    if (this.value && !validateEmail(this.value)) {
      showError(this, "emailError", "Please enter a valid email address")
    } else {
      hideError(this, "emailError")
    }
  })

  passwordInput.addEventListener("input", function () {
    if (this.value && this.value.length < 6) {
      showError(this, "passwordError", "Password must be at least 6 characters")
    } else {
      hideError(this, "passwordError")
    }
  })

  // Form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()
    let isValid = true

    // Validate email
    if (!email) {
      showError(emailInput, "emailError", "Email is required")
      isValid = false
    } else if (!validateEmail(email)) {
      showError(emailInput, "emailError", "Please enter a valid email address")
      isValid = false
    } else {
      hideError(emailInput, "emailError")
    }

    // Validate password
    if (!password) {
      showError(passwordInput, "passwordError", "Password is required")
      isValid = false
    } else {
      hideError(passwordInput, "passwordError")
    }

    if (isValid) {
      // Show loading state
      setLoading("loginBtn", "loginLoading", "loginText", true)

      // Hide any previous error
      hideAlert("errorAlert")

      // Simulate API call with a delay
      setTimeout(() => {
        // Authenticate user
        const user = authenticateUser(email, password)

        if (user) {
          // Store user data in localStorage
          storeUser(user)

          // Show success message
          showSuccess("successMessage", "Login successful! Redirecting...")

          // Redirect based on role
          setTimeout(() => {
            redirectBasedOnRole(user.role)
          }, 1500)
        } else {
          // Show error message
          showErrorAlert(
            "errorAlert",
            "Invalid email or password. Try admin@ameza.com / admin123 or user@ameza.com / user123",
          )

          // Reset loading state
          setLoading("loginBtn", "loginLoading", "loginText", false)
        }
      }, 1000)
    }
  })

  // Social login handlers
  document.getElementById("googleLogin")?.addEventListener("click", () => {
    alert("Google login integration would be implemented here")
  })

  document.getElementById("facebookLogin")?.addEventListener("click", () => {
    alert("Facebook login integration would be implemented here")
  })

  // Forgot password handler
  document.querySelector(".forgot-password")?.addEventListener("click", (e) => {
    e.preventDefault()
    alert("Forgot password functionality would be implemented here")
  })
})
