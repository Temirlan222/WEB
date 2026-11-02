const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = {window: {}, Date, Math, Intl, $: ready => ready()};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'Grocery/js/store.js'), 'utf8'), context);
const store = context.window.Lido;
assert.equal(store.products.length, 50, 'The customer requested five categories with ten products each');
assert.equal(store.categories.length, 5);
assert.equal(new Set(store.products.map(p => p.id)).size, 50, 'Every product has its own cart id');
for (const category of store.categories) {
  assert.equal(store.products.filter(p => p.category === category.id).length, 10, category.label);
  assert.equal(store.filterProducts(store.products, '', category.id).length, 10);
}
for (const product of store.products) {
  assert.ok(product.name && product.englishName && product.unit);
  assert.ok(Number.isInteger(product.price) && product.price > 0, product.id + ' has a real KZT price');
  assert.match(product.sourceUrl, /^https:\/\/wolt.com\/.+\/galmart-/);
  assert.match(product.image, /^images\/catalogue\/[a-z0-9-]+\.webp$/);
  assert.ok(fs.statSync(path.join(root, 'Grocery', product.image)).size > 500, product.id + ' photo exists');
  assert.equal(store.filterProducts(store.products, product.name, product.category).some(p => p.id === product.id), true);
  assert.equal(store.filterProducts(store.products, product.englishName.toUpperCase(), product.category).some(p => p.id === product.id), true);
}
const sorted = store.sortProducts(store.products, 'price-asc');
assert.equal(sorted.length, 50);
assert.ok(sorted.every((p, i) => i === 0 || sorted[i - 1].price <= p.price));
const descending = store.sortProducts(store.products, 'price-desc');
assert.ok(descending.every((p, i) => i === 0 || descending[i - 1].price >= p.price));
assert.equal(store.catalogueSource.city, 'Astana');
assert.match(store.catalogueSource.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
assert.match(store.catalogueSource.retailer, /Galmart/);
console.log('PASS: five categories, 50 unique sourced products, local photographs, bilingual search and price sorting.');
