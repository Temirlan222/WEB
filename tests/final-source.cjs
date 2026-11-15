const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '../Grocery');
const pages = ['index', 'products', 'prices', 'cart', 'delivery', 'contacts', 'colophon'];
assert.ok(fs.existsSync(path.join(root, 'cart.html')), 'Standalone cart.html must exist');
for (const name of pages) {
    const html = fs.readFileSync(path.join(root, name + '.html'), 'utf8');
    assert.match(html, /href="cart.html"/, name + ' must link to standalone cart');
    assert.match(html, /bootstrap@5\.3\.8/, name + ' uses the shared Bootstrap version');
    assert.match(html, /id="main-content"/, name + ' has a main landmark target');
    assert.equal(html.includes('products.html#shopping-cart'), false);
    assert.equal(html.includes('src="js/cart.js"'), name === 'cart');
}
assert.ok(!fs.readFileSync(path.join(root, 'js/main.js'), 'utf8').includes("id: 'shopping-cart'"));
console.log('PASS: standalone cart, consistent navigation and shared assets');
