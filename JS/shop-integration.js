/**
 * Shop Integration Script
 * Menghubungkan data dari admin dashboard ke halaman shop
 */
document.addEventListener('DOMContentLoaded', function() {
  // Ambil data produk dari localStorage
  const products = JSON.parse(localStorage.getItem('website_products')) || [];
  
  // Jika ada produk, tampilkan di halaman shop
  if (products.length > 0) {
    updateProductsDisplay(products);
  }
  
  // Fungsi untuk memperbarui tampilan produk
  function updateProductsDisplay(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Hapus semua produk yang ada
    productsGrid.innerHTML = '';
    
    // Tambahkan produk baru
    products.forEach(product => {
      // Hanya tampilkan produk yang memiliki gambar dan nama
      if (!product.name || !product.image) return;
      
      // Buat elemen kolom untuk produk
      const colDiv = document.createElement('div');
      colDiv.className = 'col-lg-3 col-md-6 col-sm-6 mb-4';
      
      // Hitung diskon jika ada
      let discountTag = '';
      if (product.discount) {
        discountTag = `<div class="discount-tag">-${product.discount}%</div>`;
      }
      
      // Hitung harga original jika ada
      let originalPriceHtml = '';
      if (product.originalPrice) {
        originalPriceHtml = `<span class="product-price-original">Rp ${formatPrice(product.originalPrice)}</span>`;
      }
      
      // Buat HTML untuk produk
      colDiv.innerHTML = `
        <div class="product-card" data-category="${product.category}" data-price="${product.price}" data-color="${product.colors.join(',')}" data-size="${product.sizes.join(',')}">
          <div class="product-image" style="background-image: url('${product.image}');">
            ${discountTag}
          </div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price-container">
              ${originalPriceHtml}
              <span class="product-price">Rp ${formatPrice(product.price)}</span>
            </div>
            <div class="product-actions">
              <a href="detail.html?id=${product.id}" class="view-details">Detail</a>
              <a href="#" class="cart-icon-btn" data-product-id="${product.id}"><i class="las la-shopping-cart"></i></a>
            </div>
          </div>
        </div>
      `;
      
      // Tambahkan ke grid
      productsGrid.appendChild(colDiv);
    });
    
    // Tambahkan event listener untuk tombol keranjang
    addCartButtonListeners();
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
  
  // Inisialisasi jumlah keranjang
  updateCartCount();
  
  // Filter produk berdasarkan kategori
  const categoryButtons = document.querySelectorAll('.category-btn');
  if (categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Update tombol aktif
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter produk
        if (category === 'all') {
          updateProductsDisplay(products);
        } else {
          const filteredProducts = products.filter(product => product.category === category);
          updateProductsDisplay(filteredProducts);
        }
      });
    });
  }
});
