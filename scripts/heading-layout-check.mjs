// Run `node scripts/heading-layout-check.mjs`, open the printed local URL,
// and read the report after its real-browser checks finish. Never ships in dist.
import http from 'node:http';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';

const root = path.resolve('dist');
const port = Number(process.env.HEADING_CHECK_PORT || 5951);
async function findPages(directory = root) {
  const pages = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) pages.push(...await findPages(file));
    else if (entry.name === 'index.html') pages.push('/' + path.relative(root, directory).split(path.sep).filter(Boolean).join('/') + (directory === root ? '' : '/'));
  }
  return pages;
}
const routes = [...await findPages(), '/booking/?purpose=price&product=bodyhealth', '/booking/?purpose=equipment&product=bodyhealth'];
const harness = `<!doctype html><html lang="ru"><meta charset="utf-8"><title>Accessible heading layout checks</title>
<style>body{font:16px/1.5 monospace;margin:24px}iframe{display:block;height:780px;border:1px solid #777}pre{white-space:pre-wrap}button{font:inherit;padding:10px}</style>
<h1>Accessible heading layout checks</h1><p>${routes.length} routes and booking query variants × 3 text sizes × 2 schemes × 2 widths. Checks actual word ranges, horizontal overflow, clipping, and the selected body size. No preferences are stored.</p><button id="run">Run again</button><pre id="report" role="status">Running…</pre><iframe title="Current test page"></iframe>
<script type="module">
const availableRoutes=${JSON.stringify(routes)};
const routes=new URLSearchParams(location.search).has('booking-only')?availableRoutes.filter(route=>route.startsWith('/booking/?')):availableRoutes;
const fallback=new URLSearchParams(location.search).has('fallback');
const frame=document.querySelector('iframe');
const report=document.querySelector('#report');
const runButton=document.querySelector('#run');
const models=new Set(['EyeSystem','BodyHealth','SpineSystem','SleepSystem','FootSystem','Moxi']);
const nextFrame=()=>new Promise(resolve=>setTimeout(resolve,0));
function measure(doc){
  const win=doc.defaultView;
  const headings=[...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(el=>el.getClientRects().length);
  const words=[];
  const walker=doc.createTreeWalker(doc.body,win.NodeFilter.SHOW_TEXT);
  let text;
  while(text=walker.nextNode()){
    const parent=text.parentElement;
    if(!parent||!parent.getClientRects().length||/^(SCRIPT|STYLE|OPTION)$/.test(parent.tagName))continue;
    const heading=parent.closest('h1,h2,h3,h4,h5,h6');
    for(const match of text.data.matchAll(/[\\p{L}\\p{N}]+/gu)){
      if(!heading&&!models.has(match[0])&&!parent.closest('.landing-goals dt'))continue;
      const range=doc.createRange();range.setStart(text,match.index);range.setEnd(text,match.index+match[0].length);
      const rects=[...range.getClientRects()].filter(rect=>rect.width>.1&&rect.height>.1);
      if(!rects.length)continue;
      const tops=[...new Set(rects.map(rect=>Math.round(rect.top*2)/2))];
      const owner=heading||parent;
      const box=owner.getBoundingClientRect();
      const style=win.getComputedStyle(owner);
      let naturalWidth=0;
      for(let i=match.index;i<match.index+match[0].length;i++){
        range.setStart(text,i);range.setEnd(text,i+1);naturalWidth+=range.getBoundingClientRect().width;
      }
      const clipped=[];
      for(let ancestor=owner;ancestor;ancestor=ancestor.parentElement){
        const css=win.getComputedStyle(ancestor);
        if(!/(hidden|clip)/.test(css.overflowX+' '+css.overflowY))continue;
        const boundary=ancestor.getBoundingClientRect();
        if(rects.some(rect=>rect.left<boundary.left-.75||rect.right>boundary.right+.75||rect.top<boundary.top-.75||rect.bottom>boundary.bottom+.75))clipped.push(ancestor.className||ancestor.tagName);
      }
      words.push({word:match[0],heading:heading?.tagName||null,font:style.fontSize,available:Math.round(box.width*100)/100,naturalWidth:Math.round(naturalWidth*100)/100,split:tops.length>1,outside:rects.some(rect=>rect.left<-.75||rect.right>doc.documentElement.clientWidth+.75),clipped});
    }
  }
  return {body:win.getComputedStyle(doc.body).fontSize,headingCount:headings.length,h1:headings.find(el=>el.tagName==='H1')?.ownerDocument.defaultView.getComputedStyle(headings.find(el=>el.tagName==='H1')).fontSize,overflow:doc.documentElement.scrollWidth>doc.documentElement.clientWidth+1,words};
}
async function run(){
  runButton.disabled=true;const cases=[];const issues=[];let largestWord=null;
  for(const route of routes){
    frame.src=route+(fallback?(route.includes('?')?'&':'?')+'heading-fallback=1':'');
    await new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject});
    const doc=frame.contentDocument;await doc.fonts.ready;
    for(const width of [320,390])for(const [size,pixels] of [['large',22],['larger',26],['largest',30]])for(const theme of ['light','dark']){
      frame.style.width=width+'px';Object.assign(doc.documentElement.dataset,{display:'accessible',textSize:size,contrast:theme});
      await nextFrame();const result=measure(doc);const label={route,width,size,theme};
      const badWords=result.words.filter(word=>word.split||word.outside||word.clipped.length);
      const failures=[...(result.body!==pixels+'px'?['body '+result.body]:[]),...(result.overflow?['horizontal overflow']:[]),...badWords];
      if(failures.length)issues.push({...label,failures});
      for(const word of result.words)if(!largestWord||word.naturalWidth/word.available>largestWord.ratio)largestWord={...label,...word,ratio:word.naturalWidth/word.available};
      cases.push({...label,body:result.body,h1:result.h1,headingCount:result.headingCount,words:result.words.length,failures:failures.length});
      report.textContent=JSON.stringify({status:'running',cases:cases.length,issues:issues.length,last:label},null,2);
    }
  }
  report.textContent=JSON.stringify({status:issues.length?'FAIL':'PASS',fallback,cases:cases.length,headings:cases.reduce((n,c)=>n+c.headingCount,0),words:cases.reduce((n,c)=>n+c.words,0),largestWord,issues,results:cases},null,2);runButton.disabled=false;
}
runButton.addEventListener('click',run);run();
</script></html>`;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.ttf':'font/ttf','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    let content;
    let type='text/html; charset=utf-8';
    if(url.pathname==='/__heading-check/')content=harness;
    else if(url.pathname==='/styles.css'){
      content=(await Promise.all(['styles.css','refinement.css','bodyhealth.css','landing.css','reviews.css','display.css'].map(file=>readFile(path.resolve('site',file),'utf8')))).join('\n');type=types['.css'];
      // Emulate a browser that drops unsupported container-unit declarations.
      if(url.searchParams.has('heading-fallback'))content=content.replace(/font-size:[^;}]*cqi[^;}]*;?/g,'');
    }else{
      let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
      if(file!==root&&!file.startsWith(root+path.sep))throw Error('Outside dist');
      if(url.pathname.endsWith('/'))file=path.join(file,'index.html');
      content=await readFile(file);type=types[path.extname(file)]||'application/octet-stream';
      if(type===types['.html']&&url.searchParams.has('heading-fallback'))content=content.toString().replace(/(href="[^"]*styles[.]css)(")/g,'$1?heading-fallback=1$2');
    }
    res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(content);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log('Heading checks: http://127.0.0.1:'+port+'/__heading-check/'));
