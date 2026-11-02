const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const site = path.join(__dirname, '../Grocery');
const source = path.join(site, 'js/store.js');
assert.ok(fs.existsSync(source), 'Shared catalogue and cart logic must exist');
const context = {window: {}, Date, Math, Intl, $: function (ready) { ready(); }};
vm.createContext(context);
vm.runInContext(fs.readFileSync(source, 'utf8'), context);
const s = context.window.Lido;
const categories = ['dairy', 'produce', 'meat', 'bakery', 'pantry'];

assert.equal(s.products.length, 50, 'The catalogue must contain fifty products');
assert.equal(new Set(s.products.map(product => product.id)).size, 50, 'Product ids must be unique');
assert.deepEqual(Array.from(s.categories, category => category.id).sort(), [...categories].sort());
for (const category of categories) {
    assert.equal(s.products.filter(product => product.category === category).length, 10, category + ' has ten products');
    assert.equal(s.filterProducts(s.products, '', category).length, 10);
}
for (const product of s.products) {
    for (const field of ['id', 'name', 'englishName', 'unit', 'image', 'sourceUrl']) {
        assert.equal(typeof product[field], 'string', product.id + ': ' + field);
        assert.ok(product[field].trim(), product.id + ': ' + field + ' is not empty');
    }
    assert.ok(Number.isFinite(product.price) && product.price > 0, product.id + ': positive numeric price');
    assert.equal(new URL(product.sourceUrl).protocol, 'https:', product.id + ': public price source');
    assert.ok(categories.includes(product.category), product.id + ': supported category');
}

const first = s.products[0];
const second = s.products.find(product => product.id !== first.id);
assert.equal(s.findProduct(first.id).name, first.name);
assert.equal(s.findProduct('missing'), undefined);
for (const query of [first.name.toUpperCase(), first.englishName.toUpperCase(), '  ' + first.name + '  ']) {
    assert.ok(s.filterProducts(s.products, query, first.category).some(product => product.id === first.id), 'Search finds Russian and English names without case or edge-space sensitivity');
}
const otherCategory = categories.find(category => category !== first.category);
assert.equal(s.filterProducts(s.products, first.name, otherCategory).length, 0, 'Search and category work together');
assert.equal(s.filterProducts(s.products, '   ', 'all').length, 50);
assert.equal(s.filterProducts(s.products, 'zz-no-such-product-4817', 'all').length, 0);
const originalOrder = Array.from(s.products, product => product.id);
for (const direction of ['price-asc', 'price-desc']) {
    const sorted = Array.from(s.sortProducts(s.products, direction));
    assert.equal(sorted.length, 50);
    assert.equal(new Set(sorted.map(product => product.id)).size, 50);
    for (let index = 1; index < sorted.length; index++) {
        assert.ok(direction === 'price-asc' ? sorted[index - 1].price <= sorted[index].price : sorted[index - 1].price >= sorted[index].price, direction + ' uses numeric prices');
    }
}
assert.deepEqual(Array.from(s.products, product => product.id), originalOrder, 'Sorting must preserve the source order');
assert.deepEqual(Array.from(s.sortProducts(s.products, 'default'), product => product.id), originalOrder);

assert.equal(s.validQuantity('2'), true);
for (const value of ['', '1.5', '0', '-1', '1000', 'NaN', Infinity, true, false, null, undefined, [], {}]) {
    assert.equal(s.validQuantity(value), false);
}
let cart = s.addItem([], first.id);
cart = s.addItem(cart, second.id);
assert.equal(s.cartTotals(cart).total, first.price + second.price);
assert.equal(s.cartTotals(cart).quantity, 2);
assert.equal(s.cartTotals(s.changeQuantity(cart, first.id, 2)).total, first.price * 2 + second.price);
assert.equal(s.changeQuantity(cart, first.id, 0).length, 1);
assert.equal(s.changeQuantity(cart, 'missing', 3).length, 2);
assert.equal(s.changeQuantity(cart, first.id, 1000)[0].quantity, 1);
assert.equal(s.normalizeCart(null).length, 0);
assert.equal(s.normalizeCart([null, {id:'missing',quantity:1}, {id:first.id,quantity:-1}]).length, 0);
assert.equal(s.normalizeCart([{id:first.id,quantity:2}, {id:first.id,quantity:3}])[0].quantity, 5);
assert.equal(s.normalizeCart([{id:first.id,quantity:999}, {id:first.id,quantity:2}])[0].quantity, 999);
assert.equal(s.cartTotals(s.addItem([{id:first.id,quantity:999}], first.id)).quantity, 999);
const everyProduct = s.products.map(product => ({id: product.id, quantity: 1}));
assert.equal(s.cartTotals(everyProduct).quantity, 50);
assert.equal(s.cartTotals(everyProduct).total, s.products.reduce((total, product) => total + product.price, 0), 'Every catalogue product contributes to its shopping-list total');

const request = {name:'Temirlan', email:'test@example.com', phone:'', product:first.name, quantity:'2', date:'2026-11-02', category:first.category, method:'email', permission:true, comment:''};
assert.equal(Object.keys(s.validateRequest(request,'2026-11-02')).length, 0);
for (const category of categories) assert.equal(Object.keys(s.validateRequest({...request,category},'2026-11-02')).length, 0, 'A request accepts ' + category);
assert.ok(s.validateRequest({...request,name:'  '},'2026-11-02').name);
assert.ok(s.validateRequest({...request,email:'bad'},'2026-11-02').email);
assert.ok(s.validateRequest({...request,method:'phone'},'2026-11-02').phone);
assert.ok(s.validateRequest({...request,quantity:'1.5'},'2026-11-02').quantity);
assert.ok(s.validateRequest({...request,date:'2026-11-01'},'2026-11-02').date);
assert.ok(s.validateRequest({...request,category:'fake'},'2026-11-02').category);
assert.ok(s.validateRequest({...request,permission:false},'2026-11-02').permission);
assert.ok(s.validateRequest({...request,comment:'a'.repeat(1001)},'2026-11-02').comment);
assert.ok(s.validateRequest({...request,date:'2026-02-30'},'2026-02-01').date);
assert.equal(Object.keys(s.validateRequest({...request,date:'',method:'phone',phone:'+7 700 000 00 00'},'2026-11-02')).length, 0);
assert.ok(s.validateRequest({...request,phone:'call me'},'2026-11-02').phone);
assert.ok(s.validateRequest({...request,method:'unknown'},'2026-11-02').method);
console.log('PASS: fifty products in five categories, bilingual filters, price sorting, cart arithmetic/bounds/normalization and request validation.');
