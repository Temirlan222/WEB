const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/geome/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const site = path.resolve(__dirname, '../Grocery');
const evidence = path.join(site, 'Temirlan_Assignment4-5/evidence');
fs.mkdirSync(evidence,{recursive:true});
const domFolder = path.resolve(__dirname,'../tmp/browser-dom');
fs.mkdirSync(domFolder,{recursive:true});
(async()=>{
 const browser = await chromium.launch({channel:'msedge',headless:true});
 try {
  const context = await browser.newContext({reducedMotion:'reduce'});
  const page = await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const url=name=>pathToFileURL(path.join(site,name+'.html')).href;
  const go=async name=>page.goto(url(name),{waitUntil:'networkidle'});
  await go('products');
  assert.equal(await page.locator('#catalogue-search').count(),1,'The searchable catalogue must exist');
  await page.evaluate(()=>{localStorage.removeItem('lido-cart');});
  await go('products');
  assert.equal(await page.locator('[data-add-product]').count(),8);
  await page.locator('#catalogue-search').fill('milk');
  assert.equal(await page.locator('[data-add-product]').count(),1);
  await page.locator('#catalogue-category').selectOption('meat');
  assert.equal(await page.locator('[data-add-product]').count(),0);
  assert.equal(await page.locator('#catalogue-empty').isVisible(),true);
  await page.locator('#catalogue-reset').click();
  assert.equal(await page.locator('[data-add-product]').count(),8);
  assert.equal(await page.locator('#cart-checkout').isDisabled(),true);
  await page.locator('[data-add-product="milk"]').click();
  await page.locator('[data-add-product="bread"]').click();
  assert.match(await page.locator('#cart-total').textContent(),/1,076/);
  await page.locator('[data-cart-action="increase"][data-product-id="milk"]').click();
  assert.match(await page.locator('#cart-total').textContent(),/1,922/);
  await page.locator('#shopping-cart').screenshot({path:path.join(evidence,'cart-example.png')});
  await page.locator('[data-cart-action="increase"][data-product-id="milk"]').focus();
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#cart-total').textContent(),/2,768/);
  assert.equal(await page.locator('[data-cart-action="increase"][data-product-id="milk"]').evaluate(e=>e===document.activeElement),true,'Repeated keyboard quantity changes retain focus');
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#cart-total').textContent(),/3,614/);
  await page.locator('[data-cart-action="decrease"][data-product-id="milk"]').click();
  await page.locator('[data-cart-action="decrease"][data-product-id="milk"]').click();
  await page.locator('[data-cart-action="decrease"][data-product-id="milk"]').click();
  await page.locator('[data-cart-action="remove"][data-product-id="bread"]').click();
  assert.match(await page.locator('#cart-total').textContent(),/846/);
  for(const name of ['index','prices','delivery','contacts','colophon']) {
   await go(name);
   assert.match(await page.locator('#cart-link').textContent(),/1/);
  }
  await page.locator('#cart-link').click();
  await page.waitForURL(u=>u.pathname.endsWith('products.html'));
  await page.locator('#cart-checkout').click();
  assert.match(await page.locator('#cart-confirmation').textContent(),/DEMO-\d{6}/);
  assert.match(await page.locator('#cart-confirmation').textContent(),/846/);
  assert.equal(await page.locator('#cart-checkout').isDisabled(),true);
  await page.locator('[data-add-product="milk"]').click();
  assert.equal(await page.locator('#cart-confirmation').isVisible(),false);
  await page.locator('#cart-clear').click();
  assert.equal(await page.locator('#cart-empty').isVisible(),true);
  await page.locator('#request-submit').click();
  assert.equal(await page.locator('#request-error').isVisible(),true);
  assert.equal(await page.locator('#customer-name').evaluate(e=>e===document.activeElement),true);
  await page.locator('#product-request-form').screenshot({path:path.join(evidence,'form-errors.png')});
  await page.locator('#customer-name').fill('<b>Temirlan</b>');
  await page.locator('#customer-email').fill('visitor@example.com');
  await page.locator('#product-name').fill('Milk');
  await page.locator('#quantity').fill('2');
  await page.locator('#category').selectOption('dairy');
  await page.locator('#contact-phone').check();
  await page.locator('#contact-permission').check();
  await page.locator('#request-submit').click();
  assert.match(await page.locator('#customer-phone-error').textContent(),/phone|telephone|number/i);
  await page.locator('#customer-phone').fill('+7 700 000 00 00');
  await page.locator('#request-comment').fill('Hello');
  assert.match(await page.locator('#comment-counter').textContent(),/5.*1000/);
  await page.locator('#request-submit').click();
  assert.equal(await page.locator('#request-error').isVisible(),false);
  assert.match(await page.locator('#request-summary').textContent(),/<b>Temirlan<\/b>/);
  assert.equal(await page.locator('#request-summary b').count(),0);
  assert.equal(new URL(page.url()).search,'');
  assert.match(await page.locator('#request-confirmation').textContent(),/no|not|demo/i);
  await page.locator('#request-reset').click();
  assert.equal(await page.locator('#request-confirmation').isVisible(),false);
  assert.equal(await page.locator('#request-error').isVisible(),false);
  assert.match(await page.locator('#comment-counter').textContent(),/^0/);
  await page.evaluate(()=>localStorage.setItem('lido-cart','broken JSON'));
  await go('products');
  assert.equal(await page.locator('#cart-empty').isVisible(),true);
  const results=[];
  const links=[];
  const pageIds={};
  for(const width of [375,768,1366]) {
   await page.setViewportSize({width,height:900});
   for(const name of ['index','products','prices','delivery','contacts','colophon']) {
    await go(name);
    const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length,duplicateIds:(()=>{const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);return ids.length-new Set(ids).size})()}));
    assert.equal(state.overflow,false,`${name} ${width} overflow`);
    assert.equal(state.missingImages,0,`${name} images`);
    assert.equal(state.duplicateIds,0,`${name} ids`);
    if(width===1366) {
     fs.writeFileSync(path.join(domFolder,name+'.html'),await page.content());
     pageIds[name+'.html']=await page.locator('[id]').evaluateAll(items=>items.map(x=>x.id));
     const localLinks=await page.locator('a[href]').evaluateAll(items=>items.map(x=>x.href).filter(h=>h.startsWith('file:')));
     links.push(...localLinks.map(h=>({from:name,href:h})));
    }
    if(name==='index'||name==='products')await page.screenshot({path:path.join(evidence,`${name}-${width}.png`),fullPage:true});
    results.push({page:name,width,...state});
   }
  }
  for(const link of links) {
   const target=new URL(link.href);
   const file=decodeURIComponent(target.pathname).replace(/^\/(\w:)/,'$1');
   assert.equal(fs.existsSync(file),true,`${link.from}: missing local link ${file}`);
   if(target.hash) {
    assert.ok((pageIds[path.basename(file)]||[]).includes(decodeURIComponent(target.hash.slice(1))),`${link.from}: missing anchor ${target.hash}`);
   }
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(evidence,'browser-checks.json'),JSON.stringify({date:'2026-10-18',catalogue:'passed',cart:'passed',keyboard:'passed',sharedNavigation:'passed',form:'passed',safeText:'passed',corruptStorage:'passed',localLinksChecked:links.length,results,errors},null,2));
  console.log('PASS: catalogue/cart/form/shared navigation/safe text and six pages at three widths.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e.stack);process.exit(1)});
