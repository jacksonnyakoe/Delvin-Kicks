// Persistent Header and Navigation Management

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Menu toggle functionality
    const toggleButton = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    
    if (toggleButton && nav) {
        toggleButton.addEventListener('click', function() {
            // Toggle the 'show' class on nav
            nav.classList.toggle('show');
            
            // Toggle hamburger icon to X when menu is open
            if (nav.classList.contains('show')) {
                this.textContent = '✕';
                this.setAttribute('aria-expanded', 'true');
            } else {
                this.textContent = '☰';
                this.setAttribute('aria-expanded', 'false');
            }
            
            // Prevent body scroll when menu is open on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = nav.classList.contains('show') ? 'hidden' : '';
            }
        });
    }

    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const nav = document.getElementById('main-nav');
        const toggleButton = document.getElementById('menu-toggle');
        
        if (nav && toggleButton && window.innerWidth <= 768) {
            if (!nav.contains(e.target) && !toggleButton.contains(e.target) && nav.classList.contains('show')) {
                nav.classList.remove('show');
                toggleButton.textContent = '☰';
                toggleButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });

    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        const nav = document.getElementById('main-nav');
        const toggleButton = document.getElementById('menu-toggle');
        
        if (nav && toggleButton && window.innerWidth > 768) {
            nav.classList.remove('show');
            toggleButton.textContent = '☰';
            toggleButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Set active navigation item based on current page
    setActiveNavigation();
    
    // Search functionality
    initializeSearch();
    
    // Smooth scroll behavior
    initializeSmoothScroll();
    
    // Header scroll effects
    initializeHeaderEffects();
});

// Set active navigation item
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.toLowerCase().trim();
            filterProducts(query);
        });
        
        // Real-time search as user types
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                filterProducts(query);
            });
        }
    }
}

// Filter products based on search query
function filterProducts(query) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (query === '') {
            product.style.display = '';
            product.style.animation = '';
            return;
        }
        
        const title = product.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = product.querySelector('p')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || description.includes(query)) {
            product.style.display = '';
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
    
    // Show no results message if needed
    showNoResultsMessage(query, products);
}

// Show no results message
function showNoResultsMessage(query, products) {
    const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');
    const existingMessage = document.getElementById('no-results-message');
    
    if (query && visibleProducts.length === 0) {
        if (!existingMessage) {
            const message = document.createElement('div');
            message.id = 'no-results-message';
            message.style.textAlign = 'center';
            message.style.padding = '2rem';
            message.style.color = '#7f8c8d';
            message.innerHTML = `<h3>No products found for "${query}"</h3><p>Try searching with different keywords.</p>`;
            
            const productsSection = document.querySelector('.product-grid');
            if (productsSection) {
                productsSection.parentNode.insertBefore(message, productsSection);
            }
        }
    } else if (existingMessage) {
        existingMessage.remove();
    }
}

// Initialize smooth scrolling
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const navHeight = document.querySelector('nav').offsetHeight;
                const offsetTop = target.offsetTop - headerHeight - navHeight - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after navigation
                const nav = document.getElementById('main-nav');
                const toggleButton = document.getElementById('menu-toggle');
                if (nav && toggleButton && window.innerWidth <= 768) {
                    nav.classList.remove('show');
                    toggleButton.textContent = '☰';
                    toggleButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Initialize header scroll effects
function initializeHeaderEffects() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Add shadow on scroll
        if (currentScrollY > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            nav.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            nav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Utility function to load header dynamically (if needed)
function loadHeader() {
    const headerHTML = `
    <header>
      <div class="logo">Delvin Kicks</div>
      <div class="contact-info">
        <span>Call us: +254718530376</span>
        <div class="icons">
          <form id="search-form" role="search" aria-label="Site Search" style="display:flex; align-items:center;">
            <label for="search-input" class="visually-hidden">Search:</label>
            <input type="text" id="search-input" placeholder="Search..." aria-label="Search" />
            <button type="submit" aria-label="Search" style="background:none; border:none; cursor:pointer;">🔍</button>
          </form>
          <div class="icon">🛒</div>
        </div>
      </div>
      <div class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-label="Toggle navigation menu">☰</div>
    </header>
    
    <nav id="main-nav">
      <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="New arrivals.html">New Arrivals</a></li>
          <li><a href="Sneakers.html">Sneakers</a></li>
          <li><a href="Sports Shoes.html">Sports Shoes</a></li>
          <li><a href="Official.html">Official</a></li>
          <li><a href="Slip Ons.html">Slip Ons</a></li>
          <li><a href="contact.html">About Us</a></li>
      </ul>
    </nav>
    `;
    
    return headerHTML;
}

// Add CSS animation for fade in effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);