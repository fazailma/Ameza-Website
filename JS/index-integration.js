/**
 * Index Integration Script
 * Menghubungkan data dari admin dashboard ke halaman index
 */
document.addEventListener('DOMContentLoaded', function() {
  // Ambil data produk dari localStorage
  const products = JSON.parse(localStorage.getItem('website_products')) || [];
  
  // Ambil data artikel dari localStorage
  const articles = JSON.parse(localStorage.getItem('website_articles')) || [];
  
  // Jika ada produk, tampilkan di featured products
  if (products.length > 0) {
    updateFeaturedProducts(products);
  }
  
  // Jika ada artikel, tampilkan di blog section
  if (articles.length > 0) {
    updateBlogSection(articles);
  }
  
  // Fungsi untuk memperbarui featured products
  function updateFeaturedProducts(products) {
    const productsGrid = document.querySelector('.featured-products .products-grid');
    if (!productsGrid) return;
    
    // Hapus semua produk yang ada
    productsGrid.innerHTML = '';
    
    // Tambahkan produk baru (maksimal 4)
    const featuredProducts = products.slice(0, 4);
    
    featuredProducts.forEach(product => {
      // Hanya tampilkan produk yang memiliki gambar dan nama
      if (!product.name || !product.image) return;
      
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.setAttribute('data-category', product.category);
      productCard.setAttribute('data-price', product.price);
      productCard.setAttribute('data-color', product.colors.join(','));
      productCard.setAttribute('data-size', product.sizes.join(','));
      
      // Hitung diskon jika ada
      let discountTag = '';
      if (product.discount) {
        discountTag = `<div class="discount-tag">${product.discount}% OFF</div>`;
      }
      
      // Hitung harga original jika ada
      let originalPriceHtml = '';
      if (product.originalPrice) {
        originalPriceHtml = `<p class="product-price-original">Rp ${formatPrice(product.originalPrice)}</p>`;
      }
      
      productCard.innerHTML = `
        <div class="product-image" style="background-image: url('${product.image}');">
          ${discountTag}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price-container">
            ${originalPriceHtml}
            <p class="product-price">Rp ${formatPrice(product.price)}</p>
          </div>
          <div class="product-actions">
            <a href="detail.html?id=${product.id}" class="view-details">Detail</a>
            <a href="#" class="cart-icon-btn" data-product-id="${product.id}"><i class="las la-shopping-cart"></i></a>
          </div>
        </div>
      `;
      
      productsGrid.appendChild(productCard);
    });
    
    // Tambahkan event listener untuk tombol keranjang
    addCartButtonListeners();
  }
  
  // Fungsi untuk memperbarui blog section
  function updateBlogSection(articles) {
    const blogGrid = document.querySelector('.blog-section .blog-grid');
    if (!blogGrid) return;
    
    // Filter hanya artikel yang dipublikasikan
    const publishedArticles = articles.filter(article => article.status === 'published');
    
    // Hapus semua artikel yang ada
    blogGrid.innerHTML = '';
    
    // Tambahkan artikel baru (maksimal 3)
    const displayArticles = publishedArticles.slice(0, 3);
    
    displayArticles.forEach(article => {
      const blogCard = document.createElement('div');
      blogCard.className = 'blog-card';
      
      const date = new Date(article.date);
      
      blogCard.innerHTML = `
        <div class="blog-image" style="background-image: url('${article.image}');"></div>
        <div class="blog-content">
          <div class="blog-date">
            <i class="las la-calendar"></i> ${formatDate(date)}
          </div>
          <h3>${article.title}</h3>
          <p>${article.content.substring(0, 100)}...</p>
          <a href="blog-detail.html?id=${article.id}" class="blog-link">Baca Selengkapnya <i class="las la-arrow-right"></i></a>
        </div>
      `;
      
      blogGrid.appendChild(blogCard);
    });
  }
  
  // Fungsi untuk menambahkan event listener ke tombol keranjang
  function addCartButtonListeners() {
    const cartButtons = document.querySelectorAll('.cart-icon-btn');
    
    cartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productId = this.getAttribute('data-product-id');
        const product = findProductById(productId);
        
        if (product) {
          addToCart(product);
          
          // Animasi konfirmasi
          this.classList.add('added');
          setTimeout(() => {
            this.classList.remove('added');
          }, 500);
          
          // Tampilkan konfirmasi
          alert(`${product.name} telah ditambahkan ke keranjang!`);
        }
      });
    });
  }
  
  // Fungsi untuk mencari produk berdasarkan ID
  function findProductById(id) {
    const products = JSON.parse(localStorage.getItem('website_products')) || [];
    return products.find(product => product.id == id);
  }
  
  // Fungsi untuk menambahkan produk ke keranjang
  function addToCart(product) {
    // Ambil keranjang dari localStorage
    let cart = JSON.parse(localStorage.getItem('amezaCart')) || [];
    
    // Tambahkan produk ke keranjang
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    
    // Simpan keranjang ke localStorage
    localStorage.setItem('amezaCart', JSON.stringify(cart));
    
    // Update jumlah keranjang
    updateCartCount();
  }
  
  // Fungsi untuk memperbarui jumlah keranjang
  function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      const cart = JSON.parse(localStorage.getItem('amezaCart')) || [];
      cartCount.textContent = cart.length;
    }
  }
  
  // Fungsi untuk memformat harga
  function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
  }
  
  // Fungsi untuk memformat tanggal
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }
  
  // Inisialisasi jumlah keranjang
  updateCartCount();
});
