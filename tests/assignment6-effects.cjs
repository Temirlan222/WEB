const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/geome/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(pathToFileURL(path.resolve('Grocery/products.html')).href,{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.removeItem('lido-cart'));
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>jQuery.fn.jquery),'3.7.1');
  assert.equal(await page.evaluate(()=>jQuery.fx.off),false);
  await page.evaluate(()=>{
   window.fxAudit={calls:[],completed:[]};
   ['fadeOut','fadeIn','slideDown'].forEach(function(name){
    const original=jQuery.fn[name];
    jQuery.fn[name]=function(duration,complete){
     const ids=this.map(function(){return this.id;}).get();
     fxAudit.calls.push({method:name,duration,ids,callback:typeof complete==='function'});
     if(typeof complete==='function'){
      return original.call(this,duration,function(){fxAudit.completed.push({method:name,id:this.id});return complete.apply(this,arguments);});
     }
     return original.apply(this,arguments);
    };
   });
  });
  await page.locator('#catalogue-search').fill('milk');
  await page.evaluate(()=>{
   jQuery('[data-add-product="milk"]').trigger('click');
   jQuery('#catalogue-reset').trigger('click');
  });
  await page.evaluate(()=>jQuery('#catalogue-feedback').promise('fx'));
  assert.equal(await page.locator('#catalogue-feedback').textContent(),'','Reset cancels the pending add message');
  assert.equal(await page.locator('[data-add-product]').count(),8);
  await page.locator('[data-add-product="bread"]').click();
  await page.evaluate(()=>jQuery('#catalogue-feedback').promise('fx'));
  assert.match(await page.locator('#catalogue-feedback').textContent(),/Bread added/);
  assert.equal((await page.locator('#catalogue-feedback').getAttribute('style') || '').trim(),'','Fade styles are cleaned');
  await page.locator('#cart-checkout').click();
  await page.waitForFunction(()=>document.activeElement.id==='cart-confirmation');
  assert.match(await page.locator('#cart-confirmation').textContent(),/DEMO-\d{6}/);
  assert.equal((await page.locator('#cart-confirmation').getAttribute('style') || '').trim(),'');
  await page.evaluate(()=>{
   jQuery('[data-add-product="milk"]').trigger('click');
   jQuery('#cart-checkout').trigger('click');
   jQuery('[data-add-product="bread"]').trigger('click');
  });
  await page.evaluate(()=>jQuery('#cart-confirmation').promise('fx'));
  assert.equal(await page.locator('#cart-confirmation').isVisible(),false,'Editing cart cancels obsolete checkout effect');
  assert.equal(await page.locator('#cart-confirmation').textContent(),'');
  await page.locator('#request-submit').click();
  assert.equal(await page.locator('#customer-name-error').isVisible(),true);
  await page.locator('#customer-name').fill('  Temirlan  ');
  await page.locator('#customer-email').fill('bad');
  assert.equal(await page.locator('#customer-email-error').evaluate(e=>e.classList.contains('error')),true);
  await page.locator('#customer-email').fill('visitor@example.com');
  assert.equal(await page.locator('#customer-email-error').evaluate(e=>e.classList.contains('error')),false,'Corrected email clears its error immediately');
  async function fillValid(){
   await page.locator('#customer-name').fill('<b>Temirlan</b>');
   await page.locator('#customer-email').fill('visitor@example.com');
   await page.locator('#product-name').fill('Milk');
   await page.locator('#quantity').fill('2');
   await page.locator('#contact-email').check();
   await page.locator('#contact-permission').check();
   await page.locator('#request-comment').fill('<img src=x onerror=alert(1)>');
  }
  await fillValid();
  await page.evaluate(()=>{
   jQuery('#product-request-form').trigger('submit');
   jQuery('#product-request-form').trigger('reset');
  });
  await page.evaluate(()=>jQuery('#request-confirmation').promise('fx'));
  assert.equal(await page.locator('#request-confirmation').isVisible(),false,'Reset cancels pending success reveal');
  assert.equal(await page.locator('#request-confirmation').textContent(),'');
  await fillValid();
  await page.locator('#request-submit').click();
  await page.waitForFunction(()=>document.activeElement.id==='request-confirmation');
  assert.match(await page.locator('#request-summary').textContent(),/<b>Temirlan<\/b>/);
  assert.match(await page.locator('#request-summary').textContent(),/<img src=x onerror=alert\(1\)>/);
  assert.equal(await page.locator('#request-summary img, #request-summary b').count(),0);
  assert.equal(await page.locator('#customer-name').inputValue(),'');
  assert.equal(await page.locator('#quantity').inputValue(),'1');
  assert.equal(await page.locator('#contact-permission').isChecked(),false);
  assert.equal(await page.locator('#customer-name-error').isVisible(),false,'Successful reset hides field feedback');
  assert.equal((await page.locator('#request-confirmation').getAttribute('style') || '').trim(),'','Slide styles are cleaned');
  assert.equal(await page.locator('#customer-name').getAttribute('required'),'');
  assert.equal(await page.locator('#customer-email').getAttribute('type'),'email');
  assert.equal(await page.locator('#quantity').getAttribute('max'),'999');
  assert.equal(await page.evaluate(()=>jQuery('#contact-permission').prop('checked')),false);
  assert.equal(new URL(page.url()).search,'');
  const audit=await page.evaluate(()=>window.fxAudit);
  for(const name of ['fadeOut','fadeIn','slideDown']){
   assert.ok(audit.calls.some(c=>c.method===name&&c.duration>0&&c.callback),name+' runs with duration/callback');
   assert.ok(audit.completed.some(c=>c.method===name),name+' callback completed');
  }
  assert.deepEqual(errors,[]);
  const folder=path.resolve('Grocery/Temirlan_Assignment6/evidence');fs.mkdirSync(folder,{recursive:true});
  await page.locator('#request-summary').screenshot({path:path.join(folder,'safe-summary.png')});
  fs.writeFileSync(path.join(folder,'effects-checks.json'),JSON.stringify({date:process.env.VERIFIED_ON||'2026-10-31',jquery:'3.7.1',realMotion:true,effects:audit,cancelledStaleMessages:true,liveFieldCorrection:true,validSubmitReset:true,retainedSafeSummary:true,htmlFallbackAttributes:true,temporaryEffectStylesCleaned:true,errors},null,2));
  console.log('PASS: three real effects/callbacks, rapid-action cancellation, live errors, valid reset, safe retained summary and style cleanup.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exit(1)});
