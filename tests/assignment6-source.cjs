const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const clean=s=>s.replace(/\r\n/g,'\n');
const baseline='3c83c69336164c918538f859eb6a52d50596f181';
const show=file=>clean(cp.execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8'}));
const pages=['index','products','prices','delivery','contacts','colophon'];
const jquery='https://code.jquery.com/jquery-3.7.1.min.js';
for(const page of pages){
 const file='Grocery/'+page+'.html',current=clean(fs.readFileSync(path.join(root,file),'utf8'));
 const withoutCDN=current.replace(/^[ \t]*<script src="https:\/\/code\.jquery\.com\/jquery-3\.7\.1\.min\.js" integrity="sha256-\/JqT3SQfawRcv\/BIHPThkBvs0OEvtFFmqPF\/lYI\/Cxo=" crossorigin="anonymous" defer><\/script>\n/gm,'');
 assert.equal(withoutCDN,show(file),file+': only the jQuery CDN link may differ from Assignment 5');
 const scripts=[...current.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 const at=scripts.indexOf(jquery);
 assert.ok(at>=0&&at<scripts.indexOf('js/store.js')&&at<scripts.indexOf('js/main.js'));
 assert.equal(scripts.some(s=>s.includes('old-js-version')),false,'Old version must never load');
 assert.equal(/\son[a-z]+\s*=/.test(current),false,'No inline events');
}
for(const name of fs.readdirSync(path.join(root,'Grocery/css'))){
 if(!name.endsWith('.css'))continue;
 const file='Grocery/css/'+name;
 assert.equal(clean(fs.readFileSync(path.join(root,file),'utf8')),show(file),file+': no CSS changes');
}
const files=['store.js','main.js','products.js','request.js'];
const old=clean(fs.readFileSync(path.join(root,'Grocery/js/old-js-version.js'),'utf8'));
for(const file of files){
 assert.ok(old.includes(show('Grocery/js/'+file).trimEnd()),'Original snapshot '+file);
 const text=fs.readFileSync(path.join(root,'Grocery/js',file),'utf8');
 assert.ok(text.includes("'use strict';"),file+': strict mode');
 assert.match(text,/\$\(function\s*\(\)\s*\{/);
 assert.equal(/\b(?:getElementById|querySelectorAll?|createElement|addEventListener|dispatchEvent)\s*\(|\.textContent\b|\.innerHTML\b|\.parentElement\b|\.classList\b|\.style\b|\.css\s*\(/.test(text),false,file+': no native DOM/mixed feature styles');
 assert.equal(/\bvar\s|(?<![=!])==(?!=)|(?<!!)!=(?!=)|\beval\s*\(|document\.write/.test(text),false,file+': prohibited patterns');
}
const joined=files.map(f=>fs.readFileSync(path.join(root,'Grocery/js',f),'utf8')).join('\n');
for(const method of ['find','closest','parent','siblings','each','text','html','val','attr','prop','addClass','removeClass','toggleClass','hasClass','append','on','fadeOut','fadeIn','slideDown'])assert.match(joined,new RegExp('\\.'+method+'\\s*\\('),method);
assert.ok((joined.match(/\$\(this\)/g)||[]).length>=2);
const evidence=path.join(root,'Grocery/Temirlan_Assignment6/evidence');fs.mkdirSync(evidence,{recursive:true});
fs.writeFileSync(path.join(evidence,'source-checks.json'),JSON.stringify({date:process.env.VERIFIED_ON||'2026-10-31',baseline,html:'six previous pages plus jQuery CDN script only',css:'all four files unchanged',oldVersion:'all four original sources preserved, no page loads comparison file',activeDOM:'jQuery only; no unsafe native DOM/style or inline handlers',methods:'required traversal, attributes, classes, events and effects found',passed:true},null,2));
console.log('PASS: jQuery loading order, old-source preservation, six frozen pages, four frozen stylesheets and active DOM/event checks.');

