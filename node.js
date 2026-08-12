// ===== STATE =====
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let blogs = JSON.parse(localStorage.getItem('blogs')) || getDefaultBlogs();

// ===== DEFAULT BLOG DATA =====
function getDefaultBlogs() {
  return [
    {
      id: 1,
      title: "Getting Started with HTML, CSS & JavaScript",
      content: "HTML provides the structure, CSS adds the style, and JavaScript brings interactivity. Together, they form the foundation of every website on the internet. In this post, we'll explore the key concepts and best practices for beginners just starting their frontend journey.",
      category: "Technology",
      author: "Admin",
      date: "August 10, 2026",
      views: 142,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80"
    },
    {
      id: 2,
      title: "10 Productivity Tips for Developers",
      content: "Staying productive as a developer requires more than just good code. From using the right tools to time-blocking techniques, these 10 tips will help you write better code faster and maintain work-life balance throughout your career.",
      category: "Lifestyle",
      author: "Admin",
      date: "August 9, 2026",
      views: 98,
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80"
    },
    {
      id: 3,
      title: "Responsive Design: Building for Every Screen",
      content: "With users accessing the web on devices of all sizes, responsive design is no longer optional — it's essential. Learn how to use CSS media queries, flexible grids, and fluid typography to create layouts that look great on any device.",
      category: "Technology",
      author: "Admin",
      date: "August 8, 2026",
      views: 215,
      image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&q=80"
    }
  ];
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
  if ((pageId === 'dashboard' || pageId === 'createBlog') && !currentUser) {
    showPage('login');
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);

  if (pageId === 'home') renderBlogs();
  if (pageId === 'dashboard') renderDashboard();
}

// ===== NAV MENU TOGGLE =====
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ===== UPDATE NAV =====
function updateNav() {
  const loggedIn = !!currentUser;
  document.getElementById('loginNav').style.display    = loggedIn ? 'none' : 'list-item';
  document.getElementById('registerNav').style.display = loggedIn ? 'none' : 'list-item';
  document.getElementById('logoutNav').style.display   = loggedIn ? 'list-item' : 'none';
  document.getElementById('dashNav').style.display     = loggedIn ? 'list-item' : 'none';
}

// ===== AUTH =====
function handleRegister(e) {
  e.preventDefault();
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const errEl    = document.getElementById('regError');
  const sucEl    = document.getElementById('regSuccess');

  errEl.textContent = '';
  sucEl.textContent = '';

  if (users.find(u => u.email === email)) {
    errEl.textContent = 'An account with this email already exists.';
    return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    return;
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  sucEl.textContent = '✓ Account created! Redirecting to login...';
  document.getElementById('regName').value = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regPassword').value = '';

  setTimeout(() => showPage('login'), 1500);
}

function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');

  errEl.textContent = '';

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    errEl.textContent = 'Invalid email or password.';
    return;
  }

  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateNav();
  showPage('dashboard');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateNav();
  showPage('home');
}

// ===== RENDER HOME BLOGS =====
function renderBlogs() {
  const grid = document.getElementById('blogGrid');
  if (!blogs.length) {
    grid.innerHTML = `<div class="empty-state"><h3>No posts yet</h3><p>Be the first to publish a post!</p></div>`;
    return;
  }
  grid.innerHTML = blogs.map(blog => createBlogCard(blog, false)).join('');
}

// ===== RENDER DASHBOARD =====
function renderDashboard() {
  if (!currentUser) return;

  document.getElementById('welcomeUser').textContent = `Welcome back, ${currentUser.name}! 👋`;

  const myBlogs = blogs.filter(b => b.authorId === currentUser.id);
  const totalViews = myBlogs.reduce((sum, b) => sum + (b.views || 0), 0);

  document.getElementById('totalPosts').textContent = myBlogs.length;
  document.getElementById('totalViews').textContent = totalViews;

  const grid = document.getElementById('myPosts');
  if (!myBlogs.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No posts yet</h3>
        <p>Click "New Post" to publish your first blog.</p>
      </div>`;
    return;
  }
  grid.innerHTML = myBlogs.map(blog => createBlogCard(blog, true)).join('');
}

// ===== BLOG CARD TEMPLATE =====
function createBlogCard(blog, showDelete) {
  const imgTag = blog.image
    ? `<img src="${blog.image}" alt="${blog.title}" onerror="this.style.display='none'" />`
    : `<div style="height:180px;background:linear-gradient(135deg,#6c63ff20,#6c63ff40);display:flex;align-items:center;justify-content:center;font-size:3rem;">✍️</div>`;

  const deleteBtn = showDelete
    ? `<button class="delete-btn" onclick="event.stopPropagation(); deleteBlog(${blog.id})">Delete</button>`
    : `<span>👁 ${blog.views || 0} views</span>`;

  return `
    <div class="blog-card" onclick="openModal(${blog.id})">
      ${imgTag}
      <div class="card-body">
        <span class="category">${blog.category}</span>
        <h3>${blog.title}</h3>
        <p>${blog.content}</p>
      </div>
      <div class="card-footer">
        <span>✍️ ${blog.author}</span>
        <span>${blog.date}</span>
        ${deleteBtn}
      </div>
    </div>`;
}

// ===== CREATE BLOG =====
function handleCreateBlog(e) {
  e.preventDefault();
  if (!currentUser) { showPage('login'); return; }

  const title    = document.getElementById('blogTitle').value.trim();
  const content  = document.getElementById('blogContent').value.trim();
  const category = document.getElementById('blogCategory').value;
  const image    = document.getElementById('blogImage').value.trim();

  const newBlog = {
    id: Date.now(),
    title,
    content,
    category,
    image: image || null,
    author: currentUser.name,
    authorId: currentUser.id,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    views: 0
  };

  blogs.unshift(newBlog);
  localStorage.setItem('blogs', JSON.stringify(blogs));

  document.getElementById('blogSuccess').textContent = '✓ Post published successfully!';
  document.getElementById('blogTitle').value = '';
  document.getElementById('blogContent').value = '';
  document.getElementById('blogImage').value = '';

  setTimeout(() => {
    document.getElementById('blogSuccess').textContent = '';
    showPage('dashboard');
  }, 1500);
}

// ===== DELETE BLOG =====
function deleteBlog(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  blogs = blogs.filter(b => b.id !== id);
  localStorage.setItem('blogs', JSON.stringify(blogs));
  renderDashboard();
}

// ===== MODAL =====
function openModal(id) {
  const blog = blogs.find(b => b.id === id);
  if (!blog) return;

  blog.views = (blog.views || 0) + 1;
  localStorage.setItem('blogs', JSON.stringify(blogs));

  const modal   = document.getElementById('blogModal');
  const overlay = document.getElementById('modalOverlay');
  const imgEl   = document.getElementById('modalImg');

  if (blog.image) {
    imgEl.src = blog.image;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  document.getElementById('modalMeta').innerHTML =
    `<span class="category">${blog.category}</span><span>✍️ ${blog.author}</span><span>📅 ${blog.date}</span>`;
  document.getElementById('modalTitle').textContent = blog.title;
  document.getElementById('modalBody').textContent  = blog.content;

  modal.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('blogModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== KEYBOARD CLOSE =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ===== INIT =====
function init() {
  updateNav();
  renderBlogs();
}

init();
