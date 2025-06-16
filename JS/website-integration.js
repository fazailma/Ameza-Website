// Website Integration Script
// Add this to your main website to load products and articles from admin

class WebsiteIntegration {
  constructor() {
    this.loadProductsFromAdmin()
    this.loadArticlesFromAdmin()
  }

  loadProductsFromAdmin() {
    const adminProducts = JSON.parse(localStorage.getItem("website_products"))
    if (adminProducts && adminProducts.length > 0) {
      this.updateProductsDisplay(adminProducts)
    }
  }

  loadArticlesFromAdmin() {
    const adminArticles = JSON.parse(localStorage.getItem("website_articles"))
    if (adminArticles && adminArticles.length > 0) {
      this.updateArticlesDisplay(adminArticles)
    }
  }

  updateProductsDisplay(products) {
    const productsGrid = document.querySelector(".products-grid")
    if (!productsGrid) return

    productsGrid.innerHTML = ""

    products.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"
      productCard.setAttribute("data-category", product.category)
      productCard.setAttribute("data-price", product.price)
      productCard.setAttribute("data-color", product.colors.join(","))
      productCard.setAttribute("data-size", product.sizes.join(","))

      productCard.innerHTML = `
                <div class="product-image" style="background-image: url('${product.image}');">
                    ${product.discount ? `<div class="discount-tag">${product.discount}% OFF</div>` : ""}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price-container">
                        ${product.originalPrice ? `<p class="product-price-original">Rp ${this.formatPrice(product.originalPrice)}</p>` : ""}
                        <p class="product-price">Rp ${this.formatPrice(product.price)}</p>
                    </div>
                    <div class="product-actions">
                        <a href="detail.html" class="view-details">Detail</a>
                        <a href="#" class="cart-icon-btn"><i class="las la-shopping-cart"></i></a>
                    </div>
                </div>
            `

      productsGrid.appendChild(productCard)
    })
  }

  updateArticlesDisplay(articles) {
    const blogGrid = document.querySelector(".blog-grid")
    if (!blogGrid) return

    // Only show published articles
    const publishedArticles = articles.filter((article) => article.status === "published")

    blogGrid.innerHTML = ""

    publishedArticles.forEach((article) => {
      const blogCard = document.createElement("div")
      blogCard.className = "blog-card"

      blogCard.innerHTML = `
                <div class="blog-image" style="background-image: url('${article.image}');"></div>
                <div class="blog-content">
                    <div class="blog-date">
                        <i class="las la-calendar"></i> ${this.formatDate(article.date)}
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.content}</p>
                    <a href="#" class="blog-link">Baca Selengkapnya <i class="las la-arrow-right"></i></a>
                </div>
            `

      blogGrid.appendChild(blogCard)
    })
  }

  formatPrice(price) {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WebsiteIntegration()
})
