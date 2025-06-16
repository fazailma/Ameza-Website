/**
 * Blog Integration Script
 * Menghubungkan data dari admin dashboard ke halaman blog
 */
document.addEventListener('DOMContentLoaded', function() {
  // Ambil data artikel dari localStorage
  const articles = JSON.parse(localStorage.getItem('website_articles')) || [];
  
  // Jika ada artikel, tampilkan di halaman blog
  if (articles.length > 0) {
    updateBlogDisplay(articles);
  }
  
  // Fungsi untuk memperbarui tampilan blog
  function updateBlogDisplay(articles) {
    // Filter hanya artikel yang dipublikasikan
    const publishedArticles = articles.filter(article => article.status === 'published');
    
    // Update featured post jika ada
    updateFeaturedPost(publishedArticles[0]);
    
    // Update blog grid
    updateBlogGrid(publishedArticles);
    
    // Update recent posts di sidebar
    updateRecentPosts(publishedArticles);
  }
  
  // Fungsi untuk memperbarui featured post
  function updateFeaturedPost(article) {
    if (!article) return;
    
    const featuredPostContainer = document.querySelector('.featured-post-container');
    if (!featuredPostContainer) return;
    
    const featuredImage = featuredPostContainer.querySelector('.featured-post-image');
    const featuredTitle = featuredPostContainer.querySelector('.post-title');
    const featuredExcerpt = featuredPostContainer.querySelector('.post-excerpt');
    const featuredDate = featuredPostContainer.querySelector('.post-date');
    const featuredLink = featuredPostContainer.querySelector('.btn');
    
    if (featuredImage) featuredImage.style.backgroundImage = `url('${article.image}')`;
    if (featuredTitle) featuredTitle.textContent = article.title;
    if (featuredExcerpt) featuredExcerpt.textContent = article.content.substring(0, 150) + '...';
    if (featuredDate) {
      const date = new Date(article.date);
      featuredDate.innerHTML = `<i class="las la-calendar"></i> ${formatDate(date)}`;
    }
    if (featuredLink) featuredLink.href = `blog-detail.html?id=${article.id}`;
  }
  
  // Fungsi untuk memperbarui blog grid
  function updateBlogGrid(articles) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    // Hapus semua artikel yang ada
    blogGrid.innerHTML = '';
    
    // Tambahkan artikel baru (maksimal 6)
    const displayArticles = articles.slice(0, 6);
    
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
  
  // Fungsi untuk memperbarui recent posts di sidebar
  function updateRecentPosts(articles) {
    const recentPosts = document.querySelector('.recent-posts');
    if (!recentPosts) return;
    
    // Hapus semua recent posts yang ada
    recentPosts.innerHTML = '';
    
    // Tambahkan recent posts baru (maksimal 3)
    const recentArticles = articles.slice(0, 3);
    
    recentArticles.forEach(article => {
      const recentPost = document.createElement('div');
      recentPost.className = 'recent-post';
      
      const date = new Date(article.date);
      
      recentPost.innerHTML = `
        <div class="recent-post-image" style="background-image: url('${article.image}');"></div>
        <div class="recent-post-info">
          <h4><a href="blog-detail.html?id=${article.id}">${article.title}</a></h4>
          <p class="post-date"><i class="las la-calendar"></i> ${formatDate(date)}</p>
        </div>
      `;
      
      recentPosts.appendChild(recentPost);
    });
  }
  
  // Fungsi untuk memformat tanggal
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }
  
  // Fungsi untuk mendapatkan parameter dari URL
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  
  // Jika ini adalah halaman detail blog, tampilkan artikel yang sesuai
  const articleId = getUrlParameter('id');
  if (articleId && window.location.href.includes('blog-detail.html')) {
    const article = articles.find(article => article.id == articleId);
    if (article) {
      updateBlogDetail(article);
    }
  }
  
  // Fungsi untuk memperbarui halaman detail blog
  function updateBlogDetail(article) {
    // Update judul
    document.title = `${article.title} - Ameza Fashion`;
    
    // Update meta
    const postTitle = document.querySelector('.post-title');
    const postDate = document.querySelector('.post-date');
    const postImage = document.querySelector('.post-featured-image img');
    const postContent = document.querySelector('.post-content');
    
    if (postTitle) postTitle.textContent = article.title;
    
    if (postDate) {
      const date = new Date(article.date);
      postDate.innerHTML = `<i class="las la-calendar"></i> ${formatDate(date)}`;
    }
    
    if (postImage) postImage.src = article.image;
    
    if (postContent) {
      // Buat paragraf dari konten
      const paragraphs = article.content.split('\n\n');
      let contentHtml = '';
      
      paragraphs.forEach((paragraph, index) => {
        if (index === 0) {
          contentHtml += `<p>${paragraph}</p>`;
        } else if (index % 3 === 0) {
          // Setiap paragraf ketiga, tambahkan heading
          contentHtml += `<h2>Bagian ${Math.floor(index/3)}</h2>`;
          contentHtml += `<p>${paragraph}</p>`;
        } else {
          contentHtml += `<p>${paragraph}</p>`;
        }
      });
      
      postContent.innerHTML = contentHtml;
    }
  }
});
