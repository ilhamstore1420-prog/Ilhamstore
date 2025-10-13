document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNavMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', function() {
            mobileNavMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Handle mobile dropdown
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        const link = item.querySelector('.mobile-nav-link');
        const dropdown = item.querySelector('.mobile-dropdown');
        
        if (dropdown) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                item.classList.toggle('active');
            });
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileNavMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileNavMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Banner Slider
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const bannerDots = document.querySelectorAll('.banner-dot');
    let currentSlide = 0;
    
    function showSlide(index) {
        if (bannerSlides.length === 0) return;
        
        bannerSlides.forEach(slide => {
            slide.style.transform = `translateX(-${index * 100}%)`;
        });
        
        bannerDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        if (bannerDots[index]) {
            bannerDots[index].classList.add('active');
        }
        currentSlide = index;
    }
    
    // Add keyboard navigation for banner slider
    bannerDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
        
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showSlide(index);
            }
        });
    });
    
    // Auto-slide banner
    if (bannerSlides.length > 0) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % bannerSlides.length;
            showSlide(currentSlide);
        }, 5000);
    }
    
    // Contact Options - Animated toggle
    const chatButton = document.getElementById('chatButton');
    const contactOptions = document.getElementById('contactOptions');
    let isContactOpen = false;
    
    if (chatButton && contactOptions) {
        // Ensure button is visible on load
        chatButton.style.display = 'flex';
        chatButton.style.visibility = 'visible';
        chatButton.style.opacity = '1';
        
        chatButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            isContactOpen = !isContactOpen;
            
            // Toggle active class on both button and options container
            chatButton.classList.toggle('active', isContactOpen);
            contactOptions.classList.toggle('active', isContactOpen);
            
            // Add ripple effect
            createRipple(e, chatButton);
            
            // Don't prevent body scroll when contact options are open on mobile
            // This was causing the scroll issue
        });
        
        // Create ripple effect function
        function createRipple(event, element) {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            // Calculate position relative to the element
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            element.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        }
        
        // Close contact options when clicking outside
        document.addEventListener('click', function(e) {
            if (isContactOpen && 
                !chatButton.contains(e.target) && 
                !contactOptions.contains(e.target)) {
                isContactOpen = false;
                chatButton.classList.remove('active');
                contactOptions.classList.remove('active');
            }
        });
        
        // Close contact options on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isContactOpen) {
                isContactOpen = false;
                chatButton.classList.remove('active');
                contactOptions.classList.remove('active');
            }
        });
        
        // Handle window resize to reset contact options state
        window.addEventListener('resize', function() {
            if (isContactOpen) {
                isContactOpen = false;
                chatButton.classList.remove('active');
                contactOptions.classList.remove('active');
            }
        });
        
        // Prevent contact options from staying open on page navigation
        window.addEventListener('beforeunload', function() {
            if (isContactOpen) {
                isContactOpen = false;
                chatButton.classList.remove('active');
                contactOptions.classList.remove('active');
            }
        });
    }
    
    // CV Preview Modal
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close');
    const previewBtns = document.querySelectorAll('.preview-btn');
    
    previewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cvCard = this.closest('.cv-card');
            const cvImage = cvCard.querySelector('.cv-image img');
            if (modal && modalImg && cvImage) {
                modal.style.display = 'flex';
                modalImg.src = cvImage.src;
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    });
    
    // CV Download - Enhanced with better error handling
    const downloadBtns = document.querySelectorAll('.download-btn');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const file = this.getAttribute('data-file');
            
            try {
                // Check if file exists before download
                const response = await fetch(file, { method: 'HEAD' });
                if (!response.ok) throw new Error('File not found');
                
                // Create a temporary link element to trigger download
                const link = document.createElement('a');
                link.href = file;
                link.download = file.substring(file.lastIndexOf('/') + 1);
                link.style.display = 'none';
                
                // Add to DOM, click, and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                showNotification('Download started!', 'success');
            } catch (error) {
                showNotification('Download failed. Please try again.', 'error');
                console.error('Download error:', error);
            }
        });
    });
    
    // Editable Charity Amount
    const currentDonation = document.getElementById('currentDonation');
    let isEditing = false;
    
    if (currentDonation) {
        currentDonation.addEventListener('click', function() {
            if (!isEditing) {
                isEditing = true;
                const currentValue = this.textContent;
                this.contentEditable = true;
                this.focus();
                
                // Select all text
                const range = document.createRange();
                range.selectNodeContents(this);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        
        currentDonation.addEventListener('blur', function() {
            isEditing = false;
            this.contentEditable = false;
            
            // Save to Supabase (placeholder for actual implementation)
            saveCharityAmount(this.textContent);
        });
        
        currentDonation.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    }
    
    // Placeholder function for saving to Supabase
    function saveCharityAmount(amount) {
        // In a real implementation, this would save to Supabase
        console.log('Saving charity amount:', amount);
    }
    
    // Search functionality - Improved with input sanitization
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.querySelector('.clear-btn');
    const searchResults = document.querySelector('.search-results');
    
    // Mobile Search Bar
    const mobileSearchForm = document.getElementById('mobileSearchForm');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchResults = document.querySelector('.mobile-search-results');
    
    // Product data for search
    const products = [
        // CV Templates
        { title: 'Creative Resume Template', category: 'cv', description: 'For creative industries', price: 'Free', url: 'pages/cv-resume.html' },
        { title: 'Executive CV Template', category: 'cv', description: 'For senior professionals', price: '৳200', url: 'cvs/executive-cv.html' },
        { title: 'Modern CV Template', category: 'cv', description: 'For contemporary professionals', price: 'Free', url: 'pages/cv-resume.html' },
        { title: 'Professional CV Package', category: 'cv', description: 'For corporate professionals', price: '৳150', url: 'cvs/professional-cv.html' },
        { title: 'Academic CV Template', category: 'cv', description: 'For researchers and academics', price: '৳250', url: 'cvs/academic-cv.html' },
        
        // Apps
        { title: 'Bigo Live', category: 'app', description: 'Top-up Bigo Live coins', price: '৳ 35 - ৳ 13,500', url: 'pages/apps/bigo.html' },
        { title: 'Tango Coins', category: 'app', description: 'Top-up Tango coins', price: '৳ 40 - ৳ 10,000', url: 'pages/apps/tango.html' },
        { title: 'Chamet Diamonds', category: 'app', description: 'Top-up Chamet diamonds', price: '৳ 30 - ৳ 12,000', url: 'pages/apps/chamet.html' },
        { title: 'Poppo Live Coins', category: 'app', description: 'Top-up Poppo Live coins', price: '৳ 25 - ৳ 8,000', url: 'pages/apps/poppo.html' },
        { title: 'Likee Diamonds', category: 'app', description: 'Top-up Likee diamonds', price: '৳ 20 - ৳ 7,500', url: 'pages/apps/likee.html' },
        { title: 'Mango Live Diamonds', category: 'app', description: 'Top-up Mango Live diamonds', price: '৳ 35 - ৳ 9,000', url: 'pages/apps/mango.html' },
        { title: 'IMO Diamonds', category: 'app', description: 'Top-up IMO diamonds', price: '৳ 30 - ৳ 10,500', url: 'pages/apps/imo.html' },
        { title: 'Migo Live Coins', category: 'app', description: 'Top-up Migo Live coins', price: '৳ 25 - ৳ 8,500', url: 'pages/apps/migo.html' },
        { title: 'MICO Live Coins', category: 'app', description: 'Top-up MICO Live coins', price: '৳ 40 - ৳ 11,000', url: 'pages/apps/mico.html' },
        { title: 'StarMaker Coins', category: 'app', description: 'Top-up StarMaker coins', price: '৳ 20 - ৳ 7,000', url: 'pages/apps/starmaker.html' },
        { title: 'Telegram Stars', category: 'app', description: 'Top-up Telegram stars', price: '৳ 15 - ৳ 5,000', url: 'pages/apps/telegram.html' },
        
        // Games
        { title: 'Free Fire Diamonds', category: 'game', description: 'Top-up Free Fire diamonds', price: '৳ 50 - ৳ 15,000', url: 'pages/games/freefire.html' },
        { title: 'Ludo Club Cash & Coins', category: 'game', description: 'Top-up Ludo Club cash and coins', price: '৳ 40 - ৳ 12,000', url: 'pages/games/ludoclub.html' },
        { title: 'Mobile Legends Diamonds', category: 'game', description: 'Top-up Mobile Legends diamonds', price: '৳ 60 - ৳ 18,000', url: 'pages/games/mobilelegends.html' },
        { title: 'Valorant Points (VP)', category: 'game', description: 'Top-up Valorant points', price: '৳ 70 - ৳ 20,000', url: 'pages/games/valorant.html' },
        { title: 'Lords Mobile Diamonds', category: 'game', description: 'Top-up Lords Mobile diamonds', price: '৳ 45 - ৳ 13,500', url: 'pages/games/lordsmobile.html' },
        { title: 'Clash Royale Gems', category: 'game', description: 'Top-up Clash Royale gems', price: '৳ 55 - ৳ 16,500', url: 'pages/games/clashroyale.html' },
        { title: 'Carrom Pool', category: 'game', description: 'Top-up Carrom Pool coins', price: '৳ 30 - ৳ 9,000', url: 'pages/games/carrompool.html' },
        { title: 'PUBG Mobile New State NC', category: 'game', description: 'Top-up PUBG Mobile New State NC', price: '৳ 65 - ৳ 19,500', url: 'pages/games/pubg.html' },
        { title: '8 Ball Pool (Coins)', category: 'game', description: 'Top-up 8 Ball Pool coins', price: '৳ 35 - ৳ 10,500', url: 'pages/games/8ballpool.html' },
        { title: 'Delta Force Coins', category: 'game', description: 'Top-up Delta Force coins', price: '৳ 40 - ৳ 12,000', url: 'pages/games/deltaforce.html' },
        { title: 'Yalla Ludo (Diamonds)', category: 'game', description: 'Top-up Yalla Ludo diamonds', price: '৳ 25 - ৳ 7,500', url: 'pages/games/yallaludo.html' },
        
        // Gift Cards
        { title: 'PlayStation PSN Gift Card', category: 'gift', description: 'Buy PlayStation PSN gift cards', price: '৳ 500 - ৳ 10,000', url: 'pages/gifts/psn.html' },
        { title: 'Spotify Gift Card', category: 'gift', description: 'Buy Spotify gift cards', price: '৳ 300 - ৳ 8,000', url: 'pages/gifts/spotify.html' },
        { title: 'Nintendo eShop Gift Card', category: 'gift', description: 'Buy Nintendo eShop gift cards', price: '৳ 400 - ৳ 9,000', url: 'pages/gifts/nintendo.html' },
        { title: 'Tinder Subscription', category: 'gift', description: 'Buy Tinder subscription', price: '৳ 350 - ৳ 1,500', url: 'pages/gifts/tinder.html' },
        { title: 'Discord Nitro Subscription', category: 'gift', description: 'Buy Discord Nitro subscription', price: '৳ 400 - ৳ 1,200', url: 'pages/gifts/discord.html' }
    ];
    
    // Function to perform search with input sanitization
    function performSearch(query, resultsContainer) {
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }
        
        // Sanitize input to prevent XSS
        const sanitizedQuery = sanitizeInput(query);
        
        // Filter products based on query
        const filteredProducts = products.filter(product => {
            const titleMatch = product.title.toLowerCase().includes(sanitizedQuery.toLowerCase());
            const descMatch = product.description.toLowerCase().includes(sanitizedQuery.toLowerCase());
            const categoryMatch = product.category.toLowerCase().includes(sanitizedQuery.toLowerCase());
            
            return titleMatch || descMatch || categoryMatch;
        });
        
        // Display search results
        if (filteredProducts.length > 0) {
            let resultsHTML = '';
            
            filteredProducts.slice(0, 5).forEach(product => {
                resultsHTML += `
                    <div class="search-result-item">
                        <h4>${highlightMatch(product.title, sanitizedQuery)}</h4>
                        <p>${highlightMatch(product.description, sanitizedQuery)}</p>
                        <div class="search-result-price">${product.price}</div>
                    </div>
                `;
            });
            
            if (filteredProducts.length > 5) {
                resultsHTML += `
                    <div class="search-result-item search-view-all">
                        <a href="pages/search.html?q=${encodeURIComponent(sanitizedQuery)}">View all ${filteredProducts.length} results</a>
                    </div>
                `;
            }
            
            resultsContainer.innerHTML = resultsHTML;
        } else {
            resultsContainer.innerHTML = `
                <div class="search-no-results">No results found for "${sanitizedQuery}"</div>
            `;
        }
        
        resultsContainer.style.display = 'block';
        
        // Add click event to search result items
        const searchResultItems = resultsContainer.querySelectorAll('.search-result-item:not(.search-view-all)');
        searchResultItems.forEach((item, index) => {
            // For mobile, use both click and touch events
            item.addEventListener('click', function() {
                window.location.href = filteredProducts[index].url;
            });
            
            item.addEventListener('touchend', function(e) {
                e.preventDefault();
                window.location.href = filteredProducts[index].url;
            });
        });
    }
    
    // Function to highlight matching text
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Function to sanitize input - prevents XSS attacks
    function sanitizeInput(input) {
        // Create a div element to safely escape HTML
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
    
    // Function to show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
    
    // Desktop search functionality
    if (searchForm) {
        // Search form submit event
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = sanitizeInput(searchInput.value.trim());
            if (query.length > 0) {
                window.location.href = `pages/search.html?q=${encodeURIComponent(query)}`;
            }
        });
        
        // Search input event
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = sanitizeInput(this.value.trim());
                
                if (query.length > 0) {
                    if (clearBtn) clearBtn.style.display = 'block';
                    performSearch(query, searchResults);
                } else {
                    if (clearBtn) clearBtn.style.display = 'none';
                    if (searchResults) searchResults.style.display = 'none';
                }
            });
        }
        
        // Clear button click
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                if (searchInput) searchInput.value = '';
                this.style.display = 'none';
                if (searchResults) searchResults.style.display = 'none';
                if (searchInput) searchInput.focus();
            });
        }
        
        // Close search results when clicking outside (desktop only)
        document.addEventListener('click', function(e) {
            if (window.innerWidth > 576 && !searchForm.contains(e.target) && !searchResults.contains(e.target)) {
                if (searchResults) searchResults.style.display = 'none';
            }
        });
    }
    
    // Mobile search functionality
    if (mobileSearchForm) {
        // Mobile search form submit event
        mobileSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = sanitizeInput(mobileSearchInput.value.trim());
            if (query.length > 0) {
                window.location.href = `pages/search.html?q=${encodeURIComponent(query)}`;
            }
        });
        
        // Mobile search input event
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', function() {
                const query = sanitizeInput(this.value.trim());
                performSearch(query, mobileSearchResults);
            });
        }
        
        // Close mobile search results when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 576 && !mobileSearchForm.contains(e.target) && !mobileSearchResults.contains(e.target)) {
                if (mobileSearchResults) mobileSearchResults.style.display = 'none';
            }
        });
    }
    
    // Account button functionality
    const accountBtn = document.getElementById('accountBtn');
    const accountText = document.getElementById('accountText');
    
    // Check if user is logged in (placeholder for actual implementation)
    const isLoggedIn = false;
    
    if (accountBtn && accountText) {
        if (isLoggedIn) {
            accountText.textContent = 'My Account';
            accountBtn.href = '/user/dashboard.html';
        } else {
            accountText.textContent = 'Account';
            accountBtn.href = '/user/login.html';
        }
    }
    
    // Add keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
                mobileNavMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Close contact options if open
            if (isContactOpen) {
                isContactOpen = false;
                if (chatButton) chatButton.classList.remove('active');
                if (contactOptions) contactOptions.classList.remove('active');
            }
            
            // Close modal if open
            if (modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
            
            // Close search results if open
            if (searchResults && searchResults.style.display === 'block') {
                searchResults.style.display = 'none';
            }
            
            // Close mobile search results if open
            if (mobileSearchResults && mobileSearchResults.style.display === 'block') {
                mobileSearchResults.style.display = 'none';
            }
        }
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }
});