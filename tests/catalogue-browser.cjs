const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/geome/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const site = path.resolve(process.env.SITE_DIR || path.join(__dirname, '../Grocery'));
const evidence = path.resolve(process.env.EVIDENCE_DIR || path.join(__dirname, '../tmp/catalogue-evidence'));
const verificationDate = process.env.VERIFIED_ON || new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Qyzylorda'}).format(new Date());
const pageNames = ['index', 'products', 'prices', 'delivery', 'contacts', 'colophon'];
fs.mkdirSync(evidence, {recursive:true});

(async function () {
    const browser = await chromium.launch({channel:'msedge', headless:true});
    const errors = [];
    const dialogs = [];
    let page;
    try {
        const context = await browser.newContext({reducedMotion:'reduce', viewport:{width:1366, height:900}});
        page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.dismiss(); });
        const url = name => pathToFileURL(path.join(site, name + '.html')).href;
        const go = async name => {
            await page.goto(url(name), {waitUntil:'networkidle'});
            await page.waitForFunction(() => Boolean(window.Lido && document.querySelector('#cart-link')));
        };
        const renderedIds = () => page.locator('#catalogue-results [data-add-product]').evaluateAll(buttons => buttons.map(button => button.getAttribute('data-add-product')));
        const cartSnapshot = () => page.evaluate(() => window.Lido.cart.map(line => ({id:line.id, quantity:line.quantity})));
        const cartTotal = async () => Number((await page.locator('#cart-total').innerText()).replace(/\D/g, ''));
        const cartQuantity = async () => Number((await page.locator('#cart-quantity').innerText()).match(/\d+/)[0]);
        const assertCart = async (expectedTotal, expectedQuantity) => {
            assert.equal(await cartTotal(), expectedTotal, 'The displayed total equals independently calculated product prices');
            assert.equal(await cartQuantity(), expectedQuantity, 'The displayed quantity equals the shopping list quantity');
        };
        const loadImages = async () => {
            // Load offscreen lazy images as well, so the asset check covers all fifty photos.
            await page.locator('img[loading="lazy"]').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
            await page.evaluate(async () => Promise.all(Array.from(document.images, image => image.decode().catch(() => {}))));
        };

        await go('products');
        await page.evaluate(() => localStorage.removeItem('lido-cart'));
        await go('products');
        assert.equal(await page.evaluate(() => jQuery.fn.jquery), '3.7.1');
        assert.equal(await page.evaluate(() => jQuery.fx.off), true);
        const products = await page.evaluate(() => window.Lido.products.map(product => ({id:product.id, name:product.name, englishName:product.englishName, category:product.category, price:product.price})));
        const categories = await page.evaluate(() => window.Lido.categories.map(category => category.id));
        assert.equal(products.length, 50);
        assert.deepEqual([...categories].sort(), ['bakery', 'dairy', 'meat', 'pantry', 'produce']);
        const productById = new Map(products.map(product => [product.id, product]));
        const first = products[0];
        const second = products[1];
        assert.equal(await page.locator('#catalogue-cart #shopping-cart').count(), 1, 'The existing cart is in the catalogue sidebar');
        assert.equal(await page.locator('#catalogue-sort').count(), 1);
        assert.equal(await page.locator('[data-category-shortcut]').count(), 5);
        assert.deepEqual(await renderedIds(), products.map(product => product.id));

        for (const category of categories) {
            await page.locator('#catalogue-category').selectOption(category);
            const ids = await renderedIds();
            assert.equal(ids.length, 10, category + ': ten products');
            assert.ok(ids.every(id => productById.get(id).category === category));
            assert.equal(await page.locator('[data-category-shortcut="' + category + '"]').getAttribute('aria-pressed'), 'true');
        }
        for (const query of [first.name.toUpperCase(), first.englishName.toUpperCase(), '  ' + first.name + '  ']) {
            await page.locator('#catalogue-reset').click();
            await page.locator('#catalogue-search').fill(query);
            assert.ok((await renderedIds()).includes(first.id), 'Bilingual case-insensitive search finds the expected product');
        }
        const otherCategory = categories.find(category => category !== first.category);
        await page.locator('#catalogue-category').selectOption(otherCategory);
        assert.equal((await renderedIds()).length, 0, 'Category and search work together');
        assert.equal(await page.locator('#catalogue-empty').isVisible(), true);
        await page.locator('#catalogue-reset').click();
        await page.locator('#catalogue-search').fill('zz-no-such-product-4817');
        assert.equal((await renderedIds()).length, 0);
        assert.equal(await page.locator('#catalogue-empty').isVisible(), true);
        await page.locator('#catalogue-reset').click();
        for (const direction of ['price-asc', 'price-desc']) {
            await page.locator('#catalogue-sort').selectOption(direction);
            const ids = await renderedIds();
            assert.equal(ids.length, 50);
            const prices = ids.map(id => productById.get(id).price);
            for (let index = 1; index < prices.length; index++) {
                assert.ok(direction === 'price-asc' ? prices[index - 1] <= prices[index] : prices[index - 1] >= prices[index], direction + ': numeric order');
            }
        }
        await page.locator('#catalogue-reset').click();
        assert.equal(await page.locator('#catalogue-sort').inputValue(), 'default');
        assert.equal(await page.locator('#catalogue-category').inputValue(), 'all');
        assert.equal(await page.locator('#catalogue-search').inputValue(), '');
        assert.deepEqual(await renderedIds(), products.map(product => product.id));
        assert.equal(await page.locator('#cart-checkout').isDisabled(), true);

        // Every add button is clicked after category filtering rebuilt the cards.
        for (const category of categories) {
            await page.locator('[data-category-shortcut="' + category + '"]').click();
            for (const product of products.filter(product => product.category === category)) {
                await page.locator('[data-add-product="' + product.id + '"]').click();
            }
        }
        await page.locator('#catalogue-reset').click();
        const sum = products.reduce((total, product) => total + product.price, 0);
        await assertCart(sum, 50);
        assert.equal((await cartSnapshot()).length, 50);
        assert.equal(await page.locator('#cart-items > li').count(), 50);
        assert.equal(await page.locator('#catalogue-results .product-cart-quantity').filter({hasText:'In your cart: 1'}).count(), 50);
        const increaseFirst = page.locator('[data-cart-action="increase"][data-product-id="' + first.id + '"]');
        await increaseFirst.click();
        await assertCart(sum + first.price, 51);
        await increaseFirst.focus();
        await page.keyboard.press('Enter');
        await assertCart(sum + 2 * first.price, 52);
        assert.equal(await increaseFirst.evaluate(element => element === document.activeElement), true, 'Repeated keyboard changes keep focus');
        await page.locator('[data-cart-action="decrease"][data-product-id="' + first.id + '"]').click();
        await page.locator('[data-cart-action="remove"][data-product-id="' + second.id + '"]').click();
        await assertCart(sum + first.price - second.price, 50);
        await page.locator('[data-add-product="' + second.id + '"]').click();
        await page.locator('[data-cart-action="decrease"][data-product-id="' + first.id + '"]').click();
        await assertCart(sum, 50);

        const savedBeforeReview = await page.evaluate(() => localStorage.getItem('lido-cart'));
        for (let repeat = 0; repeat < 2; repeat++) {
            await page.locator('#cart-checkout').click();
            assert.equal(await page.locator('#cart-confirmation').isVisible(), true);
            assert.equal(await page.locator('#cart-confirmation li').count(), 50, 'Repeated review replaces its summary without duplicating lines');
            assert.match(await page.locator('#cart-confirmation').innerText(), /No order or payment has been submitted/i);
            assert.equal(await page.locator('#cart-checkout').isDisabled(), false);
            assert.equal(await page.evaluate(() => localStorage.getItem('lido-cart')), savedBeforeReview, 'Review must preserve the saved cart');
            await assertCart(sum, 50);
            const reviewLayout = await page.locator('#catalogue-cart').evaluate(element => ({
                height:element.getBoundingClientRect().height,
                viewport:innerHeight,
                position:getComputedStyle(element).position
            }));
            assert.equal(reviewLayout.position, 'sticky');
            assert.ok(reviewLayout.height <= reviewLayout.viewport, 'The sticky shopping-list sidebar must fit inside the viewport when reviewing all fifty products');
            const pageScrollBefore = await page.evaluate(() => scrollY);
            await page.locator('#catalogue-cart').evaluate(element => { element.scrollTop = element.scrollHeight; });
            const totalInView = await page.locator('#cart-confirmation > p').filter({hasText:/^Total:/}).evaluate(element => {
                const bounds = element.getBoundingClientRect();
                return bounds.top >= 0 && bounds.bottom <= innerHeight;
            });
            assert.equal(totalInView, true, 'The final review total is reachable by scrolling the sidebar');
            assert.equal(await page.evaluate(() => scrollY), pageScrollBefore, 'Reading the review total must not require scrolling the entire catalogue');
        }
        await page.locator('#catalogue-cart').screenshot({path:path.join(evidence, 'shopping-list-review.png')});

        for (const category of categories) {
            await go('index');
            assert.equal(await page.locator('#home-category-list a').count(), 5);
            assert.match(await page.locator('#cart-link').innerText(), /\(50\)/);
            const shortcut = page.locator('#home-category-list a').filter({has:page.locator('img')});
            const links = await shortcut.evaluateAll(anchors => anchors.map(anchor => anchor.href));
            assert.equal(new Set(links.map(href => new URL(href).searchParams.get('category'))).size, 5);
            const target = page.locator('#home-category-list a[href*="category=' + category + '"]');
            await target.click();
            await page.waitForURL(current => current.pathname.endsWith('products.html'));
            assert.equal(await page.locator('#catalogue-category').inputValue(), category);
            assert.equal((await renderedIds()).length, 10, 'Home category opens the filtered catalogue');
            await assertCart(sum, 50);
        }
        await page.locator('#catalogue-reset').click();
        await page.evaluate(({id}) => localStorage.setItem('lido-cart', JSON.stringify([{id,quantity:2},{id:'removed-from-catalogue',quantity:1}])), first);
        await go('products');
        assert.equal(await page.locator('#cart-catalogue-notice').isVisible(), true, 'Explain when obsolete saved products are removed');
        assert.deepEqual(await cartSnapshot(), [{id:first.id, quantity:2}]);
        await assertCart(first.price * 2, 2);
        await page.locator('#cart-clear').click();
        assert.equal(await page.locator('#cart-empty').isVisible(), true);
        assert.equal(await page.locator('#cart-checkout').isDisabled(), true);
        await assertCart(0, 0);
        await page.locator('[data-add-product="' + first.id + '"]').click();

        const requestDetails = page.locator('#product-request');
        if (await requestDetails.evaluate(element => element.tagName === 'DETAILS' && !element.open)) {
            await requestDetails.locator('summary').first().click();
        }
        await page.locator('#request-submit').click();
        assert.equal(await page.locator('#request-error').isVisible(), true);
        assert.equal(await page.locator('#customer-name').evaluate(element => element === document.activeElement), true);
        await page.locator('#customer-name').fill('<b>Temirlan</b>');
        await page.locator('#customer-email').fill('bad');
        assert.equal(await page.locator('#customer-email').getAttribute('aria-invalid'), 'true');
        await page.locator('#customer-email').fill('visitor@example.com');
        assert.equal(await page.locator('#customer-email').getAttribute('aria-invalid'), 'false');
        await page.locator('#product-name').fill(first.name);
        await page.locator('#quantity').fill('2');
        await page.locator('#category').selectOption(first.category);
        await page.locator('#contact-phone').check();
        await page.locator('#contact-permission').check();
        await page.locator('#request-submit').click();
        assert.match(await page.locator('#customer-phone-error').innerText(), /phone|telephone|number/i);
        await page.locator('#customer-phone').fill('+7 700 000 00 00');
        await page.locator('#request-comment').fill('<img src=x onerror=alert(1)>');
        await page.setViewportSize({width:375, height:900});
        await page.locator('#request-submit').click();
        assert.equal(await page.locator('#request-error').isVisible(), false);
        assert.match(await page.locator('#request-summary').innerText(), /<b>Temirlan<\/b>/);
        assert.match(await page.locator('#request-summary').innerText(), /<img src=x onerror=alert\(1\)>/);
        assert.equal(await page.locator('#request-summary b, #request-summary img').count(), 0, 'Visitor entries remain literal text');
        assert.equal(await page.locator('#customer-name').inputValue(), '');
        assert.equal(await page.locator('#customer-email').inputValue(), '');
        assert.equal(await page.locator('#quantity').inputValue(), '1');
        assert.equal(await page.locator('#contact-permission').isChecked(), false);
        assert.equal(await page.locator('#request-comment').inputValue(), '');
        assert.match(await page.locator('#comment-counter').innerText(), /^0/);
        assert.equal(new URL(page.url()).search, '');
        assert.equal(await page.locator('#request-confirmation').evaluate(element => element === document.activeElement), true);
        await assertCart(first.price, 1);
        await page.locator('#request-summary').screenshot({path:path.join(evidence, 'request-safe-summary.png')});
        await page.locator('#request-reset').click();
        assert.equal(await page.locator('#request-confirmation').isVisible(), false);
        await assertCart(first.price, 1);
        await page.evaluate(() => localStorage.setItem('lido-cart', 'broken JSON'));
        await go('products');
        assert.equal(await page.locator('#cart-empty').isVisible(), true, 'Corrupt saved data recovers to an empty cart');

        const results = [];
        const links = [];
        const pageIds = {};
        for (const width of [375, 768, 1366]) {
            await page.setViewportSize({width, height:900});
            for (const name of pageNames) {
                await go(name);
                await loadImages();
                const state = await page.evaluate(() => ({
                    overflow:document.documentElement.scrollWidth > innerWidth,
                    brokenImages:Array.from(document.images).filter(image => !image.complete || !image.naturalWidth).map(image => image.getAttribute('src')),
                    duplicateIds:(() => { const ids = Array.from(document.querySelectorAll('[id]'), element => element.id); return ids.length - new Set(ids).size; })()
                }));
                assert.equal(state.overflow, false, name + ' ' + width + ': no horizontal overflow');
                assert.deepEqual(state.brokenImages, [], name + ' ' + width + ': all photos load');
                assert.equal(state.duplicateIds, 0, name + ' ' + width + ': no duplicate ids');
                if (width === 1366) {
                    pageIds[name + '.html'] = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id));
                    const localLinks = await page.locator('a[href]').evaluateAll(anchors => anchors.map(anchor => anchor.href).filter(href => href.startsWith('file:')));
                    links.push(...localLinks.map(href => ({from:name, href})));
                    fs.writeFileSync(path.join(evidence, name + '-dom.html'), await page.content());
                }
                if (name === 'index' || name === 'products') {
                    await page.screenshot({path:path.join(evidence, name + '-' + width + '.png'), fullPage:true});
                }
                results.push({page:name, width, ...state});
            }
        }
        for (const link of links) {
            const target = new URL(link.href);
            const file = decodeURIComponent(target.pathname).replace(/^\/(\w:)/, '$1');
            assert.equal(fs.existsSync(file), true, link.from + ': local target exists ' + file);
            if (target.hash) assert.ok((pageIds[path.basename(file)] || []).includes(decodeURIComponent(target.hash.slice(1))), link.from + ': anchor exists ' + target.hash);
        }
        assert.deepEqual(dialogs, [], 'No visitor text executes as HTML or JavaScript');
        assert.deepEqual(errors, [], 'No browser console or page errors');
        fs.writeFileSync(path.join(evidence, 'browser-checks.json'), JSON.stringify({
            date:verificationDate,
            productCount:50,
            categories:categories.map(id => ({id, count:products.filter(product => product.category === id).length})),
            bilingualSearch:true,
            numericPriceSorting:true,
            allFiftyDelegatedAddButtons:true,
            independentCartTotals:true,
            keyboardQuantityChanges:true,
            reviewPreservesCart:true,
            repeatedReviewHasNoDuplicates:true,
            fiftyItemReviewFitsViewport:true,
            reviewTotalReachedBySidebarScroll:true,
            homeCategoryLinks:true,
            sharedCartPersistence:true,
            obsoleteSavedItemsExplained:true,
            corruptStorageRecovery:true,
            requestValidationAndReset:true,
            safeVisitorText:true,
            localLinksChecked:links.length,
            results,
            errors,
            dialogs
        }, null, 2));
        console.log('PASS: five categories / fifty photos and delegated products; bilingual search, sorting, retained cart review, persistence, safe request form, and six pages at three widths.');
        console.log('Evidence: ' + evidence);
    } catch (error) {
        fs.writeFileSync(path.join(evidence, 'browser-failure.json'), JSON.stringify({date:verificationDate, message:error.message, stack:error.stack, errors, dialogs}, null, 2));
        if (page) await page.screenshot({path:path.join(evidence, 'failure.png'), fullPage:false}).catch(() => {});
        throw error;
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error.stack); process.exit(1); });
