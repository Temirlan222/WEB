const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const clean=s=>s.replace(/\r\n/g,'\n');
for(const name of ['index','products','contacts','colophon']) {
 const current=clean(fs.readFileSync('Grocery/'+name+'.html','utf8'));
 const base=clean(cp.execFileSync('git',['show','midterm:Grocery/'+name+'.html'],{encoding:'utf8'}));
 assert.equal(current.replace(/^    <script src="(?:https:\/\/code\.jquery\.com\/[^"]+|js\/[^"]+)"[^\n]*<\/script>\n/gm,''),base);
 assert.equal(/\son\w+=/.test(current),false);
}
assert.equal(clean(fs.readFileSync('Grocery/css/temirlan.css','utf8')),clean(cp.execFileSync('git',['show','midterm:Grocery/css/temirlan.css'],{encoding:'utf8'})));
assert.equal(/\$\(|jQuery/.test(fs.readFileSync('Grocery/js/home.js','utf8')),false);
assert.equal(/\$\(/.test(fs.readFileSync('Grocery/js/store.js','utf8')),false);
for(const file of ['Grocery/prices.html','Grocery/delivery.html','Grocery/js/cart.js','Grocery/js/delivery.jquery.js']) {
 assert.equal(clean(fs.readFileSync(file,'utf8')),clean(cp.execFileSync('git',['show','42a35ca:'+file],{encoding:'utf8'})),file+' teammate file unchanged');
}
console.log('PASS: midterm source freeze, plain-JS isolation and teammate files preserved.');

assert.equal(clean(fs.readFileSync('Grocery/css/shalkar.css','utf8')),clean(cp.execFileSync('git',['show','midterm:Grocery/css/shalkar.css'],{encoding:'utf8'})));
assert.equal(/\$\(|jQuery\s*\(/.test(fs.readFileSync('Grocery/js/site-guide.js','utf8')),false);
