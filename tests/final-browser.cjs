const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/geome/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '../Grocery');
const evidence = path.resolve(__dirname, '../tmp/final-checks');
fs.mkdirSync(evidence, {recursive:true});
const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {res.writeHead(404); res.end(); return;}
    const mime = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.webp':'image/webp', '.png':'image/png'};
    res.setHeader('Content-Type', (mime[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
    fs.createReadStream(file).pipe(res);
});

(async function () {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    const results = [];
    try {
        for (const channel of (process.env.BROWSER_CHANNELS || 'msedge,chrome').split(',')) {
            const browser = await chromium.launch({channel, headless:true});
            try {
                const context = await browser.newContext({viewport:{width:1366,height:900}, reducedMotion:'reduce', acceptDownloads:true});
                const page = await context.newPage();
                const errors = [];
                const watch = p => {
                    p.on('pageerror', e => errors.push(e.message));
                    p.on('console', e => {if (e.type() === 'error') errors.push(e.text());});
                };
                watch(page);
                async function open(name) {
                    await page.goto(base + '/' + name + '.html', {waitUntil:'networkidle'});
                }
                await open('products');
                await page.locator('[data-add-product]').first().waitFor();
                assert.equal(await page.locator('.product-image-button img').count(), 8);
                await page.locator('#catalogue-more').click();
                assert.equal(await page.locator('[data-product-id]').count(),16);
                const expandedProduct = await page.locator('[data-product-id]').nth(12).getAttribute('data-product-id');
                await page.locator('[data-add-product="' + expandedProduct + '"]').click();
                assert.equal(await page.locator('[data-product-id]').count(),16);
                await page.evaluate(() => Lido.clearCart());
                while (await page.locator('#catalogue-more').isVisible()) await page.locator('#catalogue-more').click();
                assert.equal(await page.locator('[data-product-id]').count(),50);
                assert.equal(await page.locator('[data-product-id]').evaluateAll(cards=>new Set(cards.map(c=>c.dataset.productId)).size),50);
                await page.locator('#catalogue-less').click();
                assert.equal(await page.locator('[data-product-id]').count(),8);
                const lastProduct = await page.evaluate(() => Lido.products[49].englishName);
                await page.locator('#catalogue-search').fill(lastProduct);
                assert.equal(await page.locator('[data-product-id]').count(),1);
                await page.locator('#catalogue-reset').click();
                await page.locator('[data-favourite="milk-rodina"]').click();
                await page.locator('#catalogue-favourites').check();
                assert.equal(await page.locator('[data-product-id]').count(), 1);
                await page.locator('.saved-link').click();
                await page.waitForURL('**/products.html?favourites=1#product-gallery');
                await page.locator('[data-product-id]').first().waitFor();
                assert.equal(await page.locator('#catalogue-favourites').isChecked(), true);
                await page.reload({waitUntil:'networkidle'});
                assert.equal(await page.locator('[data-favourite="milk-rodina"]').getAttribute('aria-pressed'), 'true');
                await page.locator('#catalogue-favourites').check();
                await page.locator('[data-favourite="milk-rodina"]').click();
                assert.equal(await page.locator('[data-product-id]').count(), 0);
                assert.equal(await page.locator('#catalogue-empty').isVisible(), true);
                await page.locator('#catalogue-reset').click();
                assert.equal(new URL(page.url()).search, '');
                const favouriteTab = await context.newPage();
                watch(favouriteTab);
                await favouriteTab.goto(base + '/products.html', {waitUntil:'networkidle'});
                await page.locator('[data-favourite="milk-rodina"]').focus();
                await favouriteTab.locator('[data-favourite="milk-rodina"]').click();
                await page.waitForFunction(() => document.querySelector('[data-favourite="milk-rodina"]').getAttribute('aria-pressed') === 'true');
                assert.equal(await page.evaluate(() => document.activeElement.dataset.favourite), 'milk-rodina');
                await favouriteTab.close();
                await page.locator('[data-favourite="milk-rodina"]').click();
                await page.locator('.product-image-button[data-view-product="milk-rodina"]').click();
                assert.equal(await page.locator('#product-dialog').isVisible(), true);
                assert.match(await page.locator('#dialog-title').innerText(), /Rodina/);
                await page.locator('#dialog-add').click();
                assert.match(await page.locator('#dialog-status').innerText(), /Added/);
                await page.keyboard.press('Escape');
                assert.equal(await page.locator('#product-dialog').isVisible(), false);
                await page.waitForFunction(() => document.activeElement.dataset.viewProduct === 'milk-rodina');
                assert.equal(await page.evaluate(() => document.activeElement.dataset.viewProduct), 'milk-rodina');
                await page.locator('.product-detail-link[data-view-product="milk-rodina"]').click();
                await page.keyboard.press('Escape');
                await page.waitForFunction(() => document.activeElement.classList.contains('product-detail-link'));
                assert.equal(await page.evaluate(() => document.activeElement.classList.contains('product-detail-link')), true);
                await page.evaluate(() => Lido.clearCart());
                await open('index');
                await page.locator('#site-search').fill('Rodina');
                await page.locator('#site-search').press('Enter');
                await page.waitForURL('**/products.html?q=Rodina');
                await page.locator('[data-product-id]').first().waitFor();
                assert.equal(await page.locator('[data-product-id]').count(), 1);
                await page.locator('#catalogue-reset').click();
                assert.equal(await page.locator('#shopping-cart').count(), 0, 'Products must not own a full cart');
                await page.locator('[data-add-product="milk-rodina"]').click();
                assert.match(await page.locator('[data-cart-link]').innerText(), /1/);
                assert.equal(await page.evaluate(() => document.activeElement.dataset.addProduct), 'milk-rodina');
                await page.locator('#catalogue-max-price').fill('525');
                await page.locator('#catalogue-search').fill('milk');
                assert.equal(await page.locator('[data-product-id]').count(), 1);
                await page.locator('#catalogue-reset').click();
                assert.equal(await page.locator('[data-product-id]').count(), 8);
                await page.locator('#catalogue-search').fill('nothing-matches-xyz');
                assert.equal(await page.locator('#catalogue-empty').isVisible(), true);
                await page.locator('#catalogue-reset').click();
                await page.locator('[data-cart-link]').click();
                await page.waitForURL('**/cart.html');
                await page.locator('#cart-items input').waitFor();
                assert.equal(await page.locator('#shopping-cart').count(), 1);
                await page.locator('#cart-items input').fill('2');
                await page.locator('#cart-items input').press('Tab');
                assert.match(await page.locator('#cart-total').innerText(), /1,050/);
                assert.equal(await page.evaluate(() => document.activeElement.dataset.action), 'increase');
                await page.keyboard.press('Enter');
                assert.equal(await page.locator('#cart-items input').inputValue(), '3');
                assert.equal(await page.evaluate(() => document.activeElement.dataset.action), 'increase');
                await page.locator('#cart-items input').fill('5');
                await page.locator('[data-action="remove"]').click();
                assert.equal(await page.locator('#cart-items li').count(), 0);
                await open('products');
                await page.locator('[data-add-product="milk-rodina"]').click();
                await open('cart');
                await page.locator('#cart-items input').fill('2');
                await page.locator('#cart-items input').press('Tab');
                await page.locator('#cart-items input').fill('0');
                await page.locator('#cart-items input').press('Tab');
                assert.equal(await page.locator('#cart-items input').inputValue(), '2');
                await page.locator('#cart-checkout').click();
                assert.equal(await page.locator('#cart-confirmation').isVisible(), true);
                const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#cart-download').click()]);
                const downloaded = await download.path();
                assert.match(fs.readFileSync(downloaded, 'utf8'), /1,050/);
                assert.equal(download.suggestedFilename(), 'Lido-shopping-list.txt');
                const other = await context.newPage();
                watch(other);
                await page.locator('#cart-items input').focus();
                await other.goto(base + '/products.html', {waitUntil:'networkidle'});
                await other.locator('[data-add-product="milk-rodina"]').click();
                await page.waitForFunction(() => document.querySelector('#cart-items input').value === '3');
                assert.equal(await page.locator('#cart-confirmation').isVisible(), false);
                assert.equal(await page.evaluate(() => document.activeElement.id), 'quantity-milk-rodina');
                await other.close();
                await page.locator('#cart-next').click();
                await page.waitForURL('**/delivery.html');
                await page.locator('#delivery-form').waitFor();
                assert.equal(await page.locator('#shopping-cart, #cart-items').count(), 0);
                await page.locator('#delivery-form [type="submit"]').click();
                assert.equal(await page.locator('#delivery-name').getAttribute('aria-invalid'), 'true');
                await page.locator('#delivery-name').fill('Temirlan');
                await page.locator('#delivery-email').fill('test@example.com');
                await page.locator('#delivery-phone').fill('+7 700 123 45 67');
                await page.locator('#delivery-phone').press('Enter');
                assert.equal(await page.locator('#delivery-confirmation').isVisible(), true);
                await page.locator('#delivery-method').selectOption('delivery');
                assert.equal(await page.locator('#delivery-confirmation').isVisible(), false);
                await page.locator('#delivery-address').fill('Uly Dala 31');
                await page.locator('#delivery-form [type="submit"]').click();
                assert.match(await page.locator('#delivery-confirmation').innerText(), /Uly Dala 31/);
                await page.locator('#delivery-form [type="reset"]').click();
                await page.waitForFunction(() => document.getElementById('delivery-address').disabled);

                await open('index');
                assert.equal(await page.locator('#home-budget, .budget-panel').count(), 0);
                await page.locator('#home-category-list a').first().click();
                await page.waitForURL('**/products.html?category=dairy#product-gallery');
                await page.waitForFunction(() => document.querySelectorAll('[data-product-id]').length === 8);
                assert.equal(await page.locator('#product-request, [data-request-product], #view-request').count(), 0);
                await page.locator('[data-view-product="milk-rodina"]').first().click();
                assert.equal(await page.locator('#dialog-source, .product-dialog a[href*="wolt"]').count(), 0);
                await page.keyboard.press('Escape');

                await open('contacts');
                assert.equal(await page.locator('[data-phone]').count(), 1);
                assert.equal(await page.locator('#contact-actions [data-phone]').count(), 1);
                await page.locator('#email-unavailable a').click();
                await page.locator('#contact-name').waitFor({state:'visible'});
                await page.locator('#contact-form [type="submit"]').click();
                assert.equal(await page.locator('#contact-name').getAttribute('aria-invalid'), 'true');
                for (const [id, value] of Object.entries({'contact-name':'Temirlan','contact-email':'test@example.com','contact-phone':'+7 700 123 45 67','contact-subject':'Stock','contact-message':'Is milk available?'})) await page.locator('#' + id).fill(value);
                await page.locator('#contact-terms').check();
                await page.locator('#contact-form [type="submit"]').click();
                assert.equal(await page.locator('#contact-success').isVisible(), true);
                const [question] = await Promise.all([page.waitForEvent('download'), page.locator('#contact-download').click()]);
                assert.match(fs.readFileSync(await question.path(), 'utf8'), /Is milk available/);
                await page.locator('.contact-topic').first().click();
                assert.equal(await page.locator('#contact-download').isDisabled(), true);
                await page.locator('#toggle-review').click();
                assert.equal(await page.locator('#review-translation').isVisible(), true);
                await page.locator('#helpful-review').click();
                assert.equal(await page.locator('#helpful-review').getAttribute('aria-pressed'), 'true');

                await open('colophon');
                await page.locator('#site-page-search').fill('cart');
                assert.ok(await page.locator('#site-page-list a[href="cart.html"]').count());
                await page.locator('#site-page-reset').click();
                assert.equal(await page.locator('#site-page-list li').count(), 7);
                await page.locator('.editing-notes summary').click();
                await page.locator('#toggle-phone-example').click();
                assert.equal(await page.locator('#phone-link-example').isVisible(), false);
                await open('prices');
                assert.equal(await page.locator('main table').count(),0);
                assert.equal(await page.locator('[data-price-product]').count(),8);
                await page.locator('#price-more').click();
                assert.equal(await page.locator('[data-price-product]').count(),16);
                await page.locator('#price-less').click();
                assert.equal(await page.locator('[data-price-product]').count(),8);
                await page.locator('[data-price-category="dairy"]').click();
                await page.locator('#price-search').fill('milk');
                assert.equal(await page.locator('[data-price-product]').count(),3);
                assert.match(await page.locator('[data-price-product]').first().innerText(),/525/);
                await page.locator('#price-sort').selectOption('price-desc');
                assert.match(await page.locator('[data-price-product]').first().innerText(),/1,387/);
                await page.locator('#price-search').fill('nothing-matches-xyz');
                assert.equal(await page.locator('#price-empty').isVisible(),true);
                await page.locator('#price-reset').click();
                await page.locator('#price-search').fill(lastProduct);
                assert.equal(await page.locator('[data-price-product]').count(),1);
                await page.locator('[data-price-product] a').click();
                await page.waitForURL('**/products.html?q=**');
                await page.locator('[data-product-id]').first().waitFor();
                assert.equal(await page.locator('[data-product-id]').count(),1);

                for (const width of [375, 768, 1366]) {
                    await page.setViewportSize({width,height:900});
                    for (const name of ['index','products','prices','cart','delivery','contacts','colophon']) {
                        await open(name);
                        await page.evaluate(async () => {
                            await Promise.all([...document.images].map(img => {img.loading='eager';return img.decode().catch(()=>{});}));
                        });
                        const issues = await page.evaluate(() => {
                            const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
                            return {
                                duplicateIds: ids.filter((id,i) => ids.indexOf(id) !== i),
                                overflow: document.documentElement.scrollWidth > innerWidth + 1,
                                brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
                                missingAlt: [...document.images].filter(i => !i.alt).length,
                                brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(a => a.hash.length > 1 && !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash)
                            };
                        });
                        assert.deepEqual(issues, {duplicateIds:[],overflow:false,brokenImages:[],missingAlt:0,brokenAnchors:[]}, name + ' at ' + width);
                        if (width === 375) {
                            await page.locator('.navbar-toggler').click();
                            await page.locator('[data-cart-link]').waitFor({state:'visible'});
                            await page.locator('.navbar-toggler').click();
                        }
                        await page.screenshot({path:path.join(evidence, channel + '-' + name + '-' + width + '.png'),fullPage:true});
                        fs.writeFileSync(path.join(evidence, name + '-rendered.html'), await page.content());
                    }
                }
                await open('cart');
                await page.evaluate(() => Lido.addToCart(Lido.products[1].id));
                assert.equal(await page.locator('#cart-items li').count(), 2);
                await page.locator('#cart-clear').click();
                assert.equal(await page.locator('#cart-items li').count(), 0);
                assert.equal(await page.locator('#cart-download').isDisabled(), true);
                assert.match(await page.locator('#cart-empty').innerText(), /empty/);
                await open('delivery');
                assert.equal(await page.locator('#delivery-form').isVisible(), false);
                await page.evaluate(() => localStorage.setItem('lido-cart', '{broken'));
                await open('cart');
                assert.match(await page.locator('#cart-total').innerText(), /0/);
                await context.close();

                const blocked = await browser.newContext();
                await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', {get(){ throw new Error('Storage blocked'); }}); });
                const blockedPage = await blocked.newPage();
                watch(blockedPage);
                await blockedPage.goto(base + '/products.html', {waitUntil:'networkidle'});
                await blockedPage.locator('[data-add-product]').first().click();
                assert.equal(await blockedPage.locator('#storage-notice').isVisible(), true);
                assert.match(await blockedPage.locator('[data-cart-link]').innerText(), /1/);
                await blockedPage.locator('[data-favourite]').first().click();
                await blockedPage.locator('#catalogue-favourites').check();
                assert.equal(await blockedPage.locator('[data-product-id]').count(),1);
                await blockedPage.waitForFunction(() => document.getElementById('catalogue-feedback').textContent.includes('page only'));
                await blocked.close();
                assert.deepEqual(errors, [], channel + ' console errors');
                results.push({browser:channel, result:'passed', widths:[375,768,1366]});
                console.log('PASS: ' + channel + ' shopping flow, forms, downloads, shared state, seven-page layouts and console');
            } finally { await browser.close(); }
        }
        fs.writeFileSync(path.join(evidence, 'results.json'), JSON.stringify({results, realPhone:'not tested'}, null, 2));
    } finally { server.close(); }
})().catch(error => {console.error(error);process.exitCode=1;server.close();});
