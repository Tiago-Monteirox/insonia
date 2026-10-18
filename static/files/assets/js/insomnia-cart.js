(function () {
    const cartKey = "insoniaCart";
    const drawerShell = document.querySelector("[data-cart-drawer]");

    if (!drawerShell) {
        return;
    }

    const openButtons = document.querySelectorAll("[data-cart-open]");
    const closeButtons = drawerShell.querySelectorAll("[data-cart-close]");
    const addButtons = document.querySelectorAll("[data-cart-add]");
    const itemsContainer = drawerShell.querySelector("[data-cart-items]");
    const emptyState = drawerShell.querySelector("[data-cart-empty]");
    const subtotalElement = drawerShell.querySelector("[data-cart-subtotal]");
    const countElements = document.querySelectorAll("[data-cart-count]");
    const checkoutButton = drawerShell.querySelector(".cart-checkout");
    let lastFocusedElement = null;

    const formatMoney = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    function loadCart() {
        try {
            return JSON.parse(localStorage.getItem(cartKey)) || [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    function parsePrice(value) {
        if (!value) {
            return 0;
        }

        const normalized = String(value)
            .replace(/[^\d,.-]/g, "")
            .replace(/\.(?=\d{3})/g, "")
            .replace(",", ".");
        const parsed = Number.parseFloat(normalized);

        return Number.isFinite(parsed) ? parsed : 0;
    }

    function getTotalItems(cart) {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    function getSubtotal(cart) {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function getInitials(name) {
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
        })[character]);
    }

    function renderCart() {
        const cart = loadCart();
        const totalItems = getTotalItems(cart);

        itemsContainer.innerHTML = "";
        emptyState.hidden = cart.length > 0;
        subtotalElement.textContent = formatMoney.format(getSubtotal(cart));
        checkoutButton.classList.toggle("is-disabled", cart.length === 0);
        checkoutButton.setAttribute("aria-disabled", cart.length === 0 ? "true" : "false");

        countElements.forEach((element) => {
            element.textContent = totalItems;
            element.hidden = totalItems === 0;
        });

        cart.forEach((item) => {
            const row = document.createElement("article");
            row.className = "cart-item";
            const safeName = escapeHTML(item.name);
            row.innerHTML = `
                <div class="cart-item-thumb" aria-hidden="true">${escapeHTML(getInitials(item.name))}</div>
                <div class="cart-item-body">
                    <div class="cart-item-heading">
                        <h3>${safeName}</h3>
                        <strong>${formatMoney.format(item.price * item.quantity)}</strong>
                    </div>
                    <p>${formatMoney.format(item.price)} cada</p>
                    <div class="cart-item-actions">
                        <button type="button" data-cart-decrease="${escapeHTML(item.id)}" aria-label="Diminuir quantidade de ${safeName}">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-cart-increase="${escapeHTML(item.id)}" aria-label="Aumentar quantidade de ${safeName}">+</button>
                        <button class="cart-remove" type="button" data-cart-remove="${escapeHTML(item.id)}">Remover</button>
                    </div>
                </div>
            `;
            itemsContainer.appendChild(row);
        });
    }

    function openCart() {
        lastFocusedElement = document.activeElement;
        drawerShell.classList.add("is-open");
        drawerShell.setAttribute("aria-hidden", "false");
        document.body.classList.add("cart-is-open");
        openButtons.forEach((button) => button.setAttribute("aria-expanded", "true"));
        drawerShell.querySelector("[data-cart-close]").focus();
    }

    function closeCart() {
        drawerShell.classList.remove("is-open");
        drawerShell.setAttribute("aria-hidden", "true");
        document.body.classList.remove("cart-is-open");
        openButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    function addToCart(button) {
        const id = button.dataset.productId;
        const name = button.dataset.productName;
        const price = parsePrice(button.dataset.productPrice);

        if (!id || !name) {
            return;
        }

        const cart = loadCart();
        const existingItem = cart.find((item) => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        saveCart(cart);
        renderCart();
        openCart();
    }

    function updateQuantity(id, amount) {
        const cart = loadCart()
            .map((item) => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
            .filter((item) => item.quantity > 0);

        saveCart(cart);
        renderCart();
    }

    openButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            renderCart();
            openCart();
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeCart);
    });

    addButtons.forEach((button) => {
        button.addEventListener("click", () => addToCart(button));
    });

    itemsContainer.addEventListener("click", (event) => {
        const increaseButton = event.target.closest("[data-cart-increase]");
        const decreaseButton = event.target.closest("[data-cart-decrease]");
        const removeButton = event.target.closest("[data-cart-remove]");

        if (increaseButton) {
            updateQuantity(increaseButton.dataset.cartIncrease, 1);
        }

        if (decreaseButton) {
            updateQuantity(decreaseButton.dataset.cartDecrease, -1);
        }

        if (removeButton) {
            const cart = loadCart().filter((item) => item.id !== removeButton.dataset.cartRemove);
            saveCart(cart);
            renderCart();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && drawerShell.classList.contains("is-open")) {
            closeCart();
        }
    });

    renderCart();
})();
