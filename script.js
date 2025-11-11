document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const productGrid = document.querySelector('.product-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeDrawerBtn = document.querySelector('.close-drawer-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCounter = document.getElementById('cart-counter');
    const cartSubtotalElem = document.getElementById('cart-subtotal');
    const cartTaxElem = document.getElementById('cart-tax');
    const cartTotalElem = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const userIcon = document.getElementById('user-icon');
    const userLink = document.getElementById('user-link');
    const accountModal = document.getElementById('account-modal');
    const orderConfirmationModal = document.getElementById('order-confirmation-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameElem = document.getElementById('user-name');
    const accountInfoElem = document.getElementById('account-info');
    const orderHistoryElem = document.getElementById('order-history');
    const printInvoiceBtn = document.getElementById('print-invoice-btn');
    const invoiceDetailsElem = document.getElementById('invoice-details');
    const overlay = document.getElementById('overlay');
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navLinks = document.querySelector('.nav-links');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const backToTopButton = document.getElementById('back-to-top');
    const popup = document.getElementById('popup');
    const searchBar = document.querySelector('.search-bar input');

    // --- Data ---
    const products = [
        { id: 1, name: 'Classic Tee', description: 'A comfortable and stylish tee.', price: 29.99, rating: 5, image:'Classic Tee image.jpg', category: 'clothing' },
        { id: 2, name: 'Slim Fit Jeans', description: 'Modern slim fit jeans.', price: 89.99, rating: 4, image: 'Slim fit jeans img.jpg', category: 'clothing' },
        { id: 3, name: 'Leather Jacket', description: 'Premium quality leather jacket.', price: 199.99, rating: 5, image: 'Laether Jacket img.jpg', category: 'clothing' },
        { id: 4, name: 'Running Shoes', description: 'Lightweight and comfortable.', price: 120.00, rating: 4, image: 'Running shoes img.jpg', category: 'shoes' },
        { id: 5, name: 'Chronograph Watch', description: 'Elegant and precise.', price: 250.00, rating: 5, image: 'chronography watch.jpg', category: 'watches' },
        { id: 6, name: 'Beanie Hat', description: 'Warm and stylish beanie.', price: 19.99, rating: 4, image:'Beanie hat.jpg', category: 'clothing' },
        { id: 7, name: 'Aviator Sunglasses', description: 'Classic aviator style.', price: 75.00, rating: 5, image: 'aviator sunglasses.jpg', category: 'accessories' },
        { id: 8, name: 'Leather Backpack', description: 'Durable and spacious.', price: 50.00, rating: 4, image: 'leather backpag.jpg', category: 'bags' },
        { id: 9, name: 'Dress Shirt', description: 'Formal and elegant.', price: 60.00, rating: 4, image: 'dreess shirt.jpg', category: 'clothing' },
        { id: 10, name: 'Luxury Watch', description: 'A statement of class.', price: 750.00, rating: 5, image: 'luxury watch.jpg', category: 'watches' },
        { id: 11, name: 'Canvas Bag', description: 'Casual and versatile.', price: 40.00, rating: 4, image: 'canvas bag.png', category: 'bags' },
        { id: 12, name: 'Sport Sneakers', description: 'For the active person.', price: 95.00, rating: 5, image: 'shoes.png', category: 'shoes' },
    ];

    let users = JSON.parse(localStorage.getItem('users')) || {};
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // --- Initialization ---
    const init = () => {
        renderProducts();
        updateCart();
        updateUserUI();
        checkDarkMode();
    };

    // --- Product Rendering ---
    const renderProducts = (searchTerm = '', category = null) => {
        productGrid.innerHTML = '';
        let filteredProducts = products;

        if (category) {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price.toFixed(2)}</div>
                <div class="rating">${'⭐'.repeat(product.rating)}</div>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productCard);
        });
    };

    // --- Cart Management ---
    const updateCart = () => {
        renderCartItems();
        updateCartSummary();
        updateCartCounter();
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        showPopup('Added to Cart!');
        updateCart();
    };

    const changeQuantity = (productId, newQuantity) => {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (newQuantity > 0) {
                cartItem.quantity = newQuantity;
            } else {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        updateCart();
    };

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }
        cart.forEach(item => {
            const cartItemElem = document.createElement('div');
            cartItemElem.className = 'cart-item';
            cartItemElem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button data-id="${item.id}" class="quantity-change" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" class="quantity-change" data-change="1">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElem);
        });
    };

    const updateCartSummary = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.05;
        const total = subtotal + tax;
        cartSubtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        cartTaxElem.textContent = `$${tax.toFixed(2)}`;
        cartTotalElem.textContent = `$${total.toFixed(2)}`;
    };

    const updateCartCounter = () => {
        cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const clearCart = () => {
        cart = [];
        updateCart();
    };

    // --- User Authentication ---
    const logout = () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUserUI();
        window.location.href = 'index.html';
    };

    const updateUserUI = () => {
        if (currentUser) {
            userNameElem.textContent = currentUser.name;
            userLink.href = '#';
            logoutBtn.style.display = 'block';
        } else {
            userNameElem.textContent = '';
            userLink.href = 'login.html';
            logoutBtn.style.display = 'none';
        }
    };

    // --- Checkout & Orders ---
    const checkout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        if (!currentUser) {
            alert('Please log in to check out.');
            window.location.href = 'login.html';
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        const order = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            user: currentUser.name,
            items: [...cart],
            subtotal,
            tax,
            total
        };

        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        displayInvoice(order);
        openModal(orderConfirmationModal);
        clearCart();
        closeDrawer();
    };

    const displayInvoice = (order) => {
        invoiceDetailsElem.innerHTML = `
            <div class="invoice-header">
                <img src="desidart.png" alt="DesiDart" class="invoice-logo">
                <h2>Invoice</h2>
            </div>
            <div class="invoice-details-section">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Order Date:</strong> ${order.date}</p>
                <p><strong>Customer Name:</strong> ${order.user}</p>
            </div>
            <hr>
            <div class="invoice-items-section">
                <h3>Items:</h3>
                ${order.items.map(item => `<p>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</p>`).join('')}
            </div>
            <hr>
            <div class="invoice-summary-section">
                <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
                <p><strong>Tax (5%):</strong> $${order.tax.toFixed(2)}</p>
                <p><strong>Grand Total:</strong> $${order.total.toFixed(2)}</p>
            </div>
            <div class="paid-stamp">PAID</div>
            <div class="invoice-footer">
                <p>Thank you for your purchase!</p>
                <p>DesiCart</p>
            </div>
        `;
    };

    const printInvoice = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Invoice</title>');
        printWindow.document.write('<link rel="stylesheet" href="style.css">'); // Link to main stylesheet
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: 'Poppins', sans-serif; margin: 0; padding: 20px; }
            .invoice-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .invoice-header h2 { margin: 0; color: #333; }
            .invoice-logo { max-width: 80px; height: auto; }
            .invoice-details-section, .invoice-items-section, .invoice-summary-section { margin-bottom: 20px; }
            .invoice-details-section p, .invoice-summary-section p { margin: 5px 0; }
            .invoice-items-section h3 { margin-bottom: 10px; }
            .paid-stamp {
                border: 2px solid green;
                color: green;
                padding: 10px 20px;
                font-size: 2em;
                font-weight: bold;
                transform: rotate(-20deg);
                position: absolute;
                right: 50px;
                top: 200px;
                opacity: 0.6;
            }
            .invoice-footer { text-align: center; margin-top: 30px; color: #777; }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(invoiceDetailsElem.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    // --- UI & Modals ---
    const openDrawer = () => { cartDrawer.classList.add('open'); overlay.classList.add('show'); };
    const closeDrawer = () => { cartDrawer.classList.remove('open'); overlay.classList.remove('show'); };
    const openModal = (modal) => { modal.style.display = 'block'; overlay.classList.add('show'); };
    const closeModal = (modal) => { modal.style.display = 'none'; overlay.classList.remove('show'); };

    const showAccountModal = () => {
        if (currentUser) {
            accountInfoElem.innerHTML = `<p><strong>Name:</strong> ${currentUser.name}</p><p><strong>Username:</strong> ${currentUser.username}</p>`;
            renderOrderHistory();
            openModal(accountModal);
        } else {
            window.location.href = 'login.html';
        }
    };

    const renderOrderHistory = () => {
        orderHistoryElem.innerHTML = '';
        const userOrders = orders.filter(o => o.user === currentUser.name);
        if (userOrders.length === 0) {
            orderHistoryElem.innerHTML = '<p>You have no past orders.</p>';
            return;
        }
        userOrders.forEach(order => {
            const orderElem = document.createElement('div');
            orderElem.className = 'order';
            orderElem.innerHTML = `
                <p><strong>Order ID:</strong> ${order.id} - <strong>Date:</strong> ${order.date}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            `;
            orderHistoryElem.appendChild(orderElem);
        });
    };

    const showPopup = (message) => {
        popup.textContent = message;
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 2000);
    };

    // --- Dark Mode ---
    const checkDarkMode = () => {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').classList.add('fa-sun');
            darkModeToggle.querySelector('i').classList.remove('fa-moon');
        }
    };

    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        let isEnabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isEnabled ? 'enabled' : 'disabled');
        darkModeToggle.querySelector('i').classList.toggle('fa-sun', isEnabled);
        darkModeToggle.querySelector('i').classList.toggle('fa-moon', !isEnabled);
    };

    // --- Event Listeners ---
    searchBar.addEventListener('input', (e) => {
        renderProducts(e.target.value);
    });

    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            addToCart(parseInt(e.target.dataset.id));
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-change')) {
            const id = parseInt(e.target.dataset.id);
            const change = parseInt(e.target.dataset.change);
            const item = cart.find(i => i.id === id);
            if (item) {
                changeQuantity(id, item.quantity + change);
            }
        }
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => renderProducts('', card.dataset.category));
    });

    cartIcon.addEventListener('click', openDrawer);
    closeDrawerBtn.addEventListener('click', closeDrawer);
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', checkout);
    userLink.addEventListener('click', (e) => {
        if (currentUser) {
            e.preventDefault();
            showAccountModal();
        }
    });
    closeModalBtns.forEach(btn => btn.addEventListener('click', () => closeModal(btn.closest('.modal'))));
    logoutBtn.addEventListener('click', logout);
    printInvoiceBtn.addEventListener('click', printInvoice);
    overlay.addEventListener('click', () => {
        closeDrawer();
        closeModal(accountModal);
        closeModal(orderConfirmationModal);
    });
    mobileMenuIcon.addEventListener('click', () => navLinks.classList.toggle('active'));
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTopButton.classList.add('show');
        else backToTopButton.classList.remove('show');
    });
    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // --- Initial Load ---
    init();
});