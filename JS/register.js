document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm")
  const inputs = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    terms: document.getElementById("terms"),
  }
  const roleOptions = document.querySelectorAll(".role-option")
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
  function showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
    input.classList.add("error")
    input.classList.remove("success")
  }

  function hideError(input, errorId) {
    const errorElement = document.getElementById(errorId)
    if (errorElement) {
      errorElement.style.display = "none"
    }
    input.classList.remove("error")
    input.classList.add("success")
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  function validatePhone(phone) {
    const re = /^[+]?[1-9][\d]{0,15}$/
    return re.test(phone.replace(/\s/g, ""))
  }

  function checkPasswordStrength(password) {
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
  }

  function findUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem("ameza_users")) || []
    return users.find((user) => user.email === email)
  }

  function addUser(userData) {
    const users = JSON.parse(localStorage.getItem("ameza_users")) || []
    userData.id = Date.now()
    users.push(userData)
    localStorage.setItem("ameza_users", JSON.stringify(users))
    return userData
  }

  function showErrorAlert(alertId, message) {
    const alertElement = document.getElementById(alertId)
    if (alertElement) {
      alertElement.textContent = message
      alertElement.style.display = "block"
    }
  }

  function hideAlert(alertId) {
    const alertElement = document.getElementById(alertId)
    if (alertElement) {
      alertElement.style.display = "none"
    }
  }

  function setLoading(btnId, loadingId, textId, isLoading) {
    const btnElement = document.getElementById(btnId)
    const loadingElement = document.getElementById(loadingId)
    const textElement = document.getElementById(textId)

    if (btnElement && loadingElement && textElement) {
      if (isLoading) {
        btnElement.disabled = true
        loadingElement.style.display = "inline-block"
        textElement.style.display = "none"
      } else {
        btnElement.disabled = false
        loadingElement.style.display = "none"
        textElement.style.display = "inline-block"
      }
    }
  }

  function showSuccess(successId, message) {
    const successElement = document.getElementById(successId)
    if (successElement) {
      successElement.textContent = message
      successElement.style.display = "block"
    }
  }

  // Role selection
  let selectedRole = "user" // Default role

  roleOptions.forEach((option) => {
    option.addEventListener("click", function () {
      roleOptions.forEach((opt) => opt.classList.remove("selected"))
      this.classList.add("selected")
      selectedRole = this.getAttribute("data-role")
    })
  })

  // Real-time validation
  inputs.firstName.addEventListener("input", function () {
    if (this.value.trim().length < 2) {
      showError(this, "firstNameError", "First name must be at least 2 characters")
    } else {
      hideError(this, "firstNameError")
    }
  })

  inputs.lastName.addEventListener("input", function () {
    if (this.value.trim().length < 2) {
      showError(this, "lastNameError", "Last name must be at least 2 characters")
    } else {
      hideError(this, "lastNameError")
    }
  })

  inputs.email.addEventListener("input", function () {
    if (this.value && !validateEmail(this.value)) {
      showError(this, "emailError", "Please enter a valid email address")
    } else {
      hideError(this, "emailError")
    }
  })

  inputs.phone.addEventListener("input", function () {
    if (this.value && !validatePhone(this.value)) {
      showError(this, "phoneError", "Please enter a valid phone number")
    } else {
      hideError(this, "phoneError")
    }
  })

  inputs.password.addEventListener("input", function () {
    const result = checkPasswordStrength(this.value)

    const strengthElement = document.getElementById("passwordStrength")
    const strengthTextElement = document.getElementById("strengthText")

    if (strengthElement && strengthTextElement) {
      strengthElement.className = "password-strength " + result.className
      strengthTextElement.textContent = result.text
    }

    if (this.value.length < 8) {
      showError(this, "passwordError", "Password must be at least 8 characters")
    } else {
      hideError(this, "passwordError")
    }

    // Check confirm password if it has value
    if (inputs.confirmPassword.value) {
      if (this.value !== inputs.confirmPassword.value) {
        showError(inputs.confirmPassword, "confirmPasswordError", "Passwords do not match")
      } else {
        hideError(inputs.confirmPassword, "confirmPasswordError")
      }
    }
  })

  inputs.confirmPassword.addEventListener("input", function () {
    if (this.value !== inputs.password.value) {
      showError(this, "confirmPasswordError", "Passwords do not match")
    } else {
      hideError(this, "confirmPasswordError")
    }
  })

  // Form submission
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let isValid = true

    // Validate all fields
    Object.keys(inputs).forEach((key) => {
      const input = inputs[key]
      const value = input.type === "checkbox" ? input.checked : input.value.trim()

      switch (key) {
        case "firstName":
        case "lastName":
          if (!value || value.length < 2) {
            showError(
              input,
              key + "Error",
              `${key === "firstName" ? "First" : "Last"} name must be at least 2 characters`,
            )
            isValid = false
          }
          break
        case "email":
          if (!value) {
            showError(input, "emailError", "Email is required")
            isValid = false
          } else if (!validateEmail(value)) {
            showError(input, "emailError", "Please enter a valid email address")
            isValid = false
          } else {
            // Check if email already exists
            const existingUser = findUserByEmail(value)
            if (existingUser) {
              showError(input, "emailError", "This email is already registered")
              isValid = false
            }
          }
          break
        case "phone":
          if (!value) {
            showError(input, "phoneError", "Phone number is required")
            isValid = false
          } else if (!validatePhone(value)) {
            showError(input, "phoneError", "Please enter a valid phone number")
            isValid = false
          }
          break
        case "password":
          if (!value) {
            showError(input, "passwordError", "Password is required")
            isValid = false
          } else if (value.length < 8) {
            showError(input, "passwordError", "Password must be at least 8 characters")
            isValid = false
          }
          break
        case "confirmPassword":
          if (!value) {
            showError(input, "confirmPasswordError", "Please confirm your password")
            isValid = false
          } else if (value !== inputs.password.value) {
            showError(input, "confirmPasswordError", "Passwords do not match")
            isValid = false
          }
          break
        case "terms":
          if (!value) {
            alert("Please accept the Terms of Service and Privacy Policy")
            isValid = false
          }
          break
      }
    })

    if (isValid) {
      // Show loading state
      setLoading("registerBtn", "registerLoading", "registerText", true)

      // Hide any previous error
      hideAlert("errorAlert")

      // Create user object
      const userData = {
        firstName: inputs.firstName.value.trim(),
        lastName: inputs.lastName.value.trim(),
        email: inputs.email.value.trim(),
        phone: inputs.phone.value.trim(),
        password: inputs.password.value,
        role: selectedRole,
        newsletter: document.getElementById("newsletter")?.checked || false,
      }

      // Simulate API call
      setTimeout(() => {
        try {
          // Add user to storage
          const newUser = addUser(userData)

          // Show success message
          showSuccess("successMessage", "Account created successfully! Redirecting to login...")

          // Redirect to login page
          setTimeout(() => {
            window.location.href = "login.html"
          }, 2000)
        } catch (error) {
          // Show error message
          showErrorAlert("errorAlert", "Registration failed. Please try again.")

          // Reset loading state
          setLoading("registerBtn", "registerLoading", "registerText", false)
        }
      }, 1500)
    }
  })

  // Social registration handlers
  document.getElementById("googleRegister")?.addEventListener("click", () => {
    alert("Google registration integration would be implemented here")
  })

  document.getElementById("facebookRegister")?.addEventListener("click", () => {
    alert("Facebook registration integration would be implemented here")
  })
})
