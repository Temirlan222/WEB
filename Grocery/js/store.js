'use strict';

// Recorded project prices, not live prices or stock promises.
const storeProducts = [
    { id: 'milk', name: 'Milk "Lactel"', category: 'dairy', unit: '1 L', price: 846, image: 'images/catalog/milk.webp' },
    { id: 'bread', name: 'Bread', category: 'food', unit: '1 piece', price: 230, image: 'images/catalog/bread.jpg' },
    { id: 'apples', name: 'Apples', category: 'produce', unit: '1 kg', price: 672, image: 'images/catalog/apples.jpg' },
    { id: 'twix', name: 'Chocolate "Twix"', category: 'sweets', unit: '1 piece', price: 435, image: 'images/catalog/twix.jpg' },
    { id: 'juice', name: 'Juice "Rich"', category: 'beverages', unit: '1 L', price: 1335, image: 'images/catalog/juice.jpg' },
    { id: 'chips', name: 'Potato Chips "Lays"', category: 'snacks', unit: '1 pack', price: 1100, image: 'images/catalog/chips.jpg' },
    { id: 'ariel', name: 'Laundry Detergent "Ariel"', category: 'household', unit: '1 pack', price: 5100, image: 'images/catalog/ariel.jpg' },
    { id: 'sausage', name: 'Sausage', category: 'meat', unit: '1 pack', price: 2000, image: 'images/catalog/sausage.webp' }
];

function findProduct(id) {
    return storeProducts.find(function (product) {
        return product.id === id;
    });
}

function filterProducts(items, search, category) {
    const query = search.trim().toLowerCase();
    return items.filter(function (product) {
        const matchesText = product.name.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesText && matchesCategory;
    });
}

function validQuantity(value) {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return false;
    }
    const quantity = Number(value);
    return Number.isInteger(quantity) && quantity >= 1 && quantity <= 999;
}

function normalizeCart(items) {
    const result = [];
    if (!Array.isArray(items)) {
        return result;
    }
    for (const item of items) {
        if (!item || !findProduct(item.id) || !validQuantity(item.quantity)) {
            continue;
        }
        const existing = result.find(function (line) { return line.id === item.id; });
        if (existing) {
            existing.quantity = Math.min(999, existing.quantity + Number(item.quantity));
        } else {
            result.push({ id: item.id, quantity: Number(item.quantity) });
        }
    }
    return result;
}

function changeQuantity(cart, id, quantity) {
    const result = normalizeCart(cart);
    if (!findProduct(id)) {
        return result;
    }
    if (quantity === 0) {
        return result.filter(function (line) { return line.id !== id; });
    }
    if (!validQuantity(quantity)) {
        return result;
    }
    const line = result.find(function (item) { return item.id === id; });
    if (line) {
        line.quantity = Number(quantity);
    } else {
        result.push({ id: id, quantity: Number(quantity) });
    }
    return result;
}

function addItem(cart, id) {
    const line = normalizeCart(cart).find(function (item) { return item.id === id; });
    const quantity = line ? line.quantity + 1 : 1;
    return changeQuantity(cart, id, quantity);
}

function cartTotals(cart) {
    let quantity = 0;
    let total = 0;
    for (const line of normalizeCart(cart)) {
        const product = findProduct(line.id);
        quantity += line.quantity;
        total += product.price * line.quantity;
    }
    return { quantity: quantity, total: total };
}

function formatMoney(amount) {
    return new Intl.NumberFormat('en-US').format(amount) + ' ₸';
}

function makeReference() {
    return 'DEMO-' + Math.floor(100000 + Math.random() * 900000);
}

function formatDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function today() {
    return formatDate(new Date());
}

function validDate(value) {
    const parsed = new Date(value + 'T00:00:00');
    return !Number.isNaN(parsed.getTime()) && formatDate(parsed) === value;
}

function validateRequest(values, currentDate) {
    const errors = {};
    const name = String(values.name || '').trim();
    const email = String(values.email || '').trim();
    const phone = String(values.phone || '').trim();
    const product = String(values.product || '').trim();
    const date = String(values.date || '');
    const categories = ['dairy', 'food', 'produce', 'accessories', 'beverages', 'snacks', 'sweets', 'meat', 'household'];
    if (name.length < 2 || name.length > 100) {
        errors.name = 'Enter a name with 2 to 100 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Enter a valid email address.';
    }
    const digits = phone.replace(/\D/g, '');
    if (values.method === 'phone' && phone === '') {
        errors.phone = 'Enter a phone number when choosing phone contact.';
    } else if (phone !== '' && (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 10 || digits.length > 15)) {
        errors.phone = 'Enter a valid phone number with 10 to 15 digits.';
    }
    if (product.length === 0 || product.length > 100) {
        errors.product = 'Enter a product name with 1 to 100 characters.';
    }
    if (!validQuantity(values.quantity)) {
        errors.quantity = 'Enter a whole quantity from 1 to 999.';
    }
    if (date !== '' && (!validDate(date) || date < currentDate)) {
        errors.date = 'Choose today or a future date.';
    }
    if (!categories.includes(values.category)) {
        errors.category = 'Choose a product category.';
    }
    if (values.method !== 'email' && values.method !== 'phone') {
        errors.method = 'Choose email or phone contact.';
    }
    if (values.permission !== true) {
        errors.permission = 'Confirm that you understand this is a demonstration.';
    }
    if (String(values.comment || '').length > 1000) {
        errors.comment = 'Keep your comment within 1000 characters.';
    }
    return errors;
}

function makeElement(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className || '';
    return element;
}

window.Lido = {
    products: storeProducts,
    cart: [],
    findProduct: findProduct,
    filterProducts: filterProducts,
    validQuantity: validQuantity,
    normalizeCart: normalizeCart,
    changeQuantity: changeQuantity,
    addItem: addItem,
    cartTotals: cartTotals,
    formatMoney: formatMoney,
    makeReference: makeReference,
    today: today,
    validateRequest: validateRequest,
    makeElement: makeElement
};
