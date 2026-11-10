'use strict';
const $=selector=>document.querySelector(selector),all=selector=>[...document.querySelectorAll(selector)];
const menu=$('.menu-toggle'),nav=$('#main-nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');}
menu?.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menu.focus();}});
all('[data-launch]').forEach(button=>button.addEventListener('click',()=>$('#launch-dialog').showModal()));
all('[data-privacy]').forEach(button=>button.addEventListener('click',()=>$('#privacy-dialog').showModal()));
all('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
function showImage(button){const img=$('#enlarged-image');img.src=button.dataset.image;img.alt=button.querySelector('img')?.alt||button.dataset.title;$('#image-title').textContent=button.dataset.title;$('#image-dialog').showModal();}
document.addEventListener('click',event=>{const button=event.target.closest('[data-image]');if(button)showImage(button);});
const views={
 mixer:{src:'mixer-session.png',title:'Mixer · Demo session',alt:'Complete BenKen mixer with active meters during four-track demo playback',caption:'Four demo tracks playing through the mixer. The meters show the actual audio signal.'},
 stage:{src:'performance-bottom.png',title:'Bottom controls',alt:'Complete BenKen performance view with compact bottom controls',caption:'Keep the regular playback controls along the bottom.'},
 side:{src:'performance-side.png',title:'Side controls',alt:'Complete BenKen performance view with controls down the left side',caption:'Move the controls to the side and keep lyrics and chords in view.'},
 clean:{src:'performance-clean.png',title:'Hidden controls',alt:'Complete BenKen lyrics view with the control bar hidden',caption:'Hide the control bar for a clear reading view. Bring it back with the corner button.'},
 settings:{src:'settings-overview.png',title:'Settings',alt:'BenKen Settings with categories for songs, audio, lyrics, appearance, controls and planning',caption:'Grouped settings for songs, audio, lyrics, appearance, controls and planning.'}
};
const tabs=all('[data-view]');
function selectView(button,focus=false){const view=views[button.dataset.view];if(!view)return;tabs.forEach(tab=>{const selected=tab===button;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});$('#product-screen').src=view.src;$('#product-screen').alt=view.alt;$('#product-enlarge').dataset.image=view.src;$('#product-enlarge').dataset.title=view.title;$('#screen-caption').textContent=view.caption;$('#screen-panel').setAttribute('aria-labelledby',button.id);if(focus)button.focus();}
tabs.forEach((button,index)=>{button.addEventListener('click',()=>selectView(button));button.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=tabs[(index+1)%tabs.length];if(event.key==='ArrowLeft')target=tabs[(index+tabs.length-1)%tabs.length];if(event.key==='Home')target=tabs[0];if(event.key==='End')target=tabs.at(-1);if(target){event.preventDefault();selectView(target,true);}});});
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const learning=window.BenKenLearning||{guides:[],videos:[],youtubeChannel:''};
const index=$('#guide-index');
if(index){
 index.innerHTML=learning.guides.map(g=>'<a class="guide-card" data-guide-card="'+esc(g.id)+'" href="#'+esc(g.id)+'"><span class="category">'+esc(g.category)+'</span><h2>'+esc(g.title)+'</h2><p>'+esc(g.summary)+'</p><span class="read-guide">Read the guide →</span></a>').join('');
 $('#guide-articles').innerHTML=learning.guides.map(g=>'<details class="guide-article" id="'+esc(g.id)+'"><summary>'+esc(g.title)+'</summary><div class="guide-body"><div><ol>'+g.steps.map(step=>'<li>'+esc(step)+'</li>').join('')+'</ol><p class="guide-note">'+esc(g.note)+'</p></div><button class="image-open" data-image="'+esc(g.image)+'" data-title="'+esc(g.title)+'" aria-label="Enlarge '+esc(g.title)+' screenshot"><img src="'+esc(g.image)+'" alt="'+esc(g.title)+' in BenKen Stage Pro" loading="lazy"><span class="expand-icon" aria-hidden="true">↗</span></button></div></details>').join('');
 let filter='all';const search=$('#guide-search');
 function applyFilter(){const query=search.value.trim().toLocaleLowerCase();let count=0;for(const g of learning.guides){const text=[g.title,g.summary,g.category,g.note,...g.steps].join(' ').toLocaleLowerCase();const show=(filter==='all'||g.category===filter)&&(!query||query.split(/\s+/).every(word=>text.includes(word)));$('[data-guide-card="'+g.id+'"]').hidden=!show;document.getElementById(g.id).hidden=!show;if(show)count++;}$('#guide-results').textContent=count+' '+(count===1?'guide':'guides')+(filter!=='all'?' · '+filter:'');$('#no-guides').hidden=count!==0;}
 all('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;all('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));applyFilter();}));search.addEventListener('input',applyFilter);applyFilter();
 function openHash(){const id=location.hash.slice(1),guide=learning.guides.find(g=>g.id===id);if(!guide)return;const article=document.getElementById(id);if(article.hidden){filter='all';search.value='';all('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));applyFilter();}article.open=true;article.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 index.addEventListener('click',event=>{const card=event.target.closest('a[data-guide-card]');if(card){const article=document.getElementById(card.dataset.guideCard);article.open=true;}});window.addEventListener('hashchange',openHash);openHash();
 // Links are added only when a real BenKen video URL has been supplied.
 function youtubeURL(value){try{const url=new URL(value);return url.protocol==='https:'&&['youtube.com','www.youtube.com','youtu.be'].includes(url.hostname)?url.href:null;}catch{return null;}}
 const videos=(learning.videos||[]).map(v=>({...v,url:youtubeURL(v.url)})).filter(v=>v.url),channel=youtubeURL(learning.youtubeChannel);const library=$('#video-library');
 if(videos.length||channel){library.hidden=false;$('.video-placeholder').hidden=true;library.innerHTML=(channel?'<a class="button secondary" href="'+esc(channel)+'" target="_blank" rel="noopener noreferrer">BenKen on YouTube ↗</a>':'')+videos.map(v=>'<a class="video-card" href="'+esc(v.url)+'" target="_blank" rel="noopener noreferrer">'+(v.poster?'<img class="video-poster" src="'+esc(v.poster)+'" alt="'+esc(v.title)+'" loading="lazy">':'')+'<span class="tag">Watch on YouTube ↗</span><strong>'+esc(v.title)+'</strong><p>'+esc(v.description||'')+'</p></a>').join('');}
}

