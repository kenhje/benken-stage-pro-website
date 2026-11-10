(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const hex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
 function colorRange(text,start,end,color){
  if(!hex(color))throw Error('Choose a valid text color.');text=String(text);start=Math.max(0,Math.min(text.length,Number(start)||0));end=Math.max(start,Math.min(text.length,Number(end)||0));if(start===end)return null;
  const pattern=/\{\s*(color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}/gi,stack=[];let before=[],after=[],m;
  while((m=pattern.exec(text))){if(m.index>=end)break;if(m.index<start&&pattern.lastIndex>start||m.index<end&&pattern.lastIndex>end)throw Error('Select complete words, outside the color tags.');if(m.index<start){const tag=m[1].toLowerCase();tag[0]==='/'?stack.pop():stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0]);before=[...stack]}else{if(after.length===0)after=[...stack];const tag=m[1].toLowerCase();tag[0]==='/'?stack.pop():stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0])}}
  after=[...stack];const prefix='{/color}'.repeat(before.length)+'{color: '+color.toLowerCase()+'}',selected=text.slice(start,end).replace(pattern,''),suffix='{/color}'+after.map(c=>'{color: '+c+'}').join('');
  return {text:text.slice(0,start)+prefix+selected+suffix+text.slice(end),start:start+prefix.length,end:start+prefix.length+selected.length};
 }
 function header(raw){
  const plain=raw.trim();if(/^(?:(?:last|final)\s+)?(?:intro|verse|pre[. -]?chorus|chorus|bridge|solo|outro|melody|instrumental|vers|refreng|bro|melodi)(?:\s+\d+)?$/i.test(plain))return {label:plain,type:root.StageCore.sectionType(plain)};const m=plain.match(/^\{\s*([^}:]+?)\s*(?::\s*(.*?))?\s*\}$/);if(!m)return null;
  const k=m[1].trim().toLowerCase(),labels={soc:'CHORUS',start_of_chorus:'CHORUS',sov:'VERSE',start_of_verse:'VERSE',sob:'BRIDGE',start_of_bridge:'BRIDGE',som:'MELODY',start_of_melody:'MELODY'};
  if(['c','comment','section'].includes(k))return {label:m[2]||'',type:root.StageCore.sectionType(m[2]||'')};
  if(labels[k])return {label:m[2]||labels[k],type:root.StageCore.sectionType(labels[k])};return null
 }
 function sections(text){const out=[];String(text||'').split(/\r?\n/).forEach((line,i)=>{const h=header(line);if(h)out.push({...h,line:i,index:out.length})});return out}
 const signature=text=>JSON.stringify(sections(text).map(s=>[s.label,s.type]));
 function inline(raw,stack=[],transpose=v=>v){
  let plain='',html='',marks=[],runs=[],last=0;const rx=/\{\s*(color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}|\[([A-G](?:#|b)?[a-zA-Z0-9+#/()\-]*)\]/gi;
  const add=value=>{if(value)runs.push({text:value,color:stack[stack.length-1]||null});plain+=value;const content=esc(value);html+=stack.length?'<span class="lyric-color" style="color:'+stack[stack.length-1]+'">'+content+'</span>':content};let m;
  while((m=rx.exec(raw))){add(raw.slice(last,m.index));last=rx.lastIndex;
   if(m[2]){marks.push({pos:[...plain].length,chord:transpose(m[2])});continue}
   const tag=m[1].toLowerCase();if(tag[0]==='/')stack.pop();else stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0].toLowerCase())
  }add(raw.slice(last));return {plain,html,marks,runs}
 }

 // Keep chord anchors in the same unbreakable word as their lyric character.
 // Each browser-created continuation line can then centre independently.
 function centredWords(line){
  const chars=[];for(const run of line.runs)for(const text of run.text)chars.push({text,color:run.color});
  const words=[];for(let i=0;i<chars.length;){if(/\s/u.test(chars[i].text)){i++;continue}const start=i;while(i<chars.length&&!/\s/u.test(chars[i].text))i++;words.push({start,end:i,marks:[]})}
  if(!words.length)return null;
  for(const mark of line.marks){const word=words.find(w=>mark.pos<w.end)||words[words.length-1];word.marks.push(mark)}
  const html=words.map(word=>{
   let text='',color=null,part='';const flush=()=>{if(part)text+=color?'<span class="lyric-color" style="color:'+color+'">'+esc(part)+'</span>':esc(part);part=''};
   for(const ch of chars.slice(word.start,word.end)){if(ch.color!==color){flush();color=ch.color}part+=ch.text}flush();
   let chordEnd=0;const chords=word.marks.map(mark=>{const left=Math.max(0,mark.pos-word.start,chordEnd);chordEnd=left+[...mark.chord].length+1;return '<span class="word-chord" style="left:'+left+'ch">'+esc(mark.chord)+'</span>'}).join('');
   const width=Math.max(word.end-word.start,chordEnd?chordEnd-1:0);
   return '<span class="lyric-word" style="min-width:'+width+'ch">'+chords+'<span class="lyric-word-text">'+text+'</span></span>';
  }).join(' ');
  return html;
 }
 function render(text,{centerLines=false,hideChords=false,onlyChords=false,transpose=v=>v,sectionColors=[],sectionButtons=false,colorLyricsBySection=false}={}){
  const stack=[],out=[];let sectionIndex=0,lyricTint=null;
  const textStyle=()=>colorLyricsBySection&&hex(lyricTint)?' style="color:'+lyricTint+'"':'';
  for(const raw of String(text||'').split(/\r?\n/)){
   const h=header(raw);if(h){const tint=sectionColors[sectionIndex],label='<span class="section-label">'+esc(h.label)+'</span>';lyricTint=tint;out.push('<div class="lyric-line section '+h.type+'" data-section-index="'+sectionIndex+++'"'+(hex(tint)?' style="color:'+tint+'"':'')+'>'+(sectionButtons?'<button type="button" class="lyric-section-button" data-section-play>'+label+'</button>':label)+'</div>');continue}
   const trimmed=raw.trim(),colorOnly=/^\{\s*(?:color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}$/i.test(trimmed);
   if(/^\{\s*[^{}]+\s*\}$/.test(trimmed)&&!colorOnly)continue;
   const line=inline(raw,stack,transpose);if(colorOnly)continue;
   if(onlyChords){if(line.marks.length)out.push('<div class="lyric-line chord-pair chords-only-line"><div class="chord-line">'+esc(line.marks.map(mark=>mark.chord).join('    '))+'</div></div>');continue}
   if(hideChords&&line.marks.length){if(line.plain.trim())out.push('<div class="lyric-line"'+textStyle()+'>'+line.html+'</div>');continue}
   if(centerLines&&line.marks.length){const words=centredWords(line);if(words){out.push('<div class="lyric-line centred-chord-flow"'+textStyle()+'>'+words+'</div>');continue}}
   if(line.marks.length){let chords='',end=0;for(const mark of line.marks){const col=Math.max(mark.pos,end);chords+=' '.repeat(Math.max(0,col-[...chords].length))+mark.chord;end=col+[...mark.chord].length+1}out.push('<div class="lyric-line chord-pair"><div class="chord-line">'+esc(chords)+'</div><div class="lyric-text"'+textStyle()+'>'+(line.html||'&nbsp;')+'</div></div>')}
   else out.push('<div class="lyric-line'+(line.plain?'':' blank-line')+'"'+textStyle()+'>'+(line.html||'&nbsp;')+'</div>')
  }return out.join('')
 }
 function validateSaved(timing){
  if(timing==null)return;
  if(!timing||timing.version!==1||typeof timing.signature!=='string'||timing.signature.length>200000||!Array.isArray(timing.starts)||timing.starts.length>2048||timing.starts.some(n=>n!==null&&(!Number.isFinite(n)||n<0||n>86400)))throw Error('Invalid section timing in the song.');
 }
 // Match ordered headings once per changed song/timing, including duplicate labels.
 const timingCache=new WeakMap();
 const sectionKey=section=>String(section.label||'').trim().toLowerCase().replace(/[.\s_-]+/g,' ');
 function alignSections(list,original){
  const n=original.length,m=list.length,rows=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)rows[i][j]=sectionKey(original[i])===sectionKey(list[j])?1+rows[i+1][j+1]:Math.max(rows[i+1][j],rows[i][j+1]);
  const pairs=[];let i=0,j=0;while(i<n&&j<m){if(sectionKey(original[i])===sectionKey(list[j])){pairs.push([i++,j++])}else if(rows[i+1][j]>=rows[i][j+1])i++;else j++}
  const matches=new Map(pairs.map(([a,b])=>[b,a])),anchors=[[-1,-1],...pairs,[n,m]];
  for(let k=1;k<anchors.length;k++){const [a,b]=anchors[k-1],[c,d]=anchors[k];if(c-a===d-b)for(let t=1;t<c-a;t++)matches.set(b+t,a+t)}
  return list.map((section,index)=>{const previous=original[matches.get(index)];return {...section,...(previous?{start:previous.start,color:previous.color}:{}),index}})
 }
 function saved(song){
  const list=sections(song?.text),timing=song?.sectionTiming;if(!timing)return {list,stale:false,starts:list.map(()=>null)};
  const cached=timingCache.get(song);if(cached&&cached.text===song.text&&cached.timing===timing)return cached.data;
  let starts=list.map(()=>null);try{validateSaved(timing);const prior=JSON.parse(timing.signature);if(!Array.isArray(prior)||prior.length!==timing.starts.length||prior.some(row=>!Array.isArray(row)||typeof row[0]!=='string'||typeof row[1]!=='string'))throw Error('Invalid section names');validateStarts(timing.starts);starts=alignSections(list,prior.map(([label,type],i)=>({label,type,start:timing.starts[i]}))).map(s=>Number.isFinite(s.start)?s.start:null)}catch{}
  const data={list,stale:starts.some(n=>n===null),starts};timingCache.set(song,{text:song.text,timing,data});return data;
 }
 function validateStarts(starts,length=0){let prev=-1;for(const n of starts){if(n===null)continue;if(!Number.isFinite(n)||n<0||n>86400)throw Error('Enter the start as mm:ss or seconds.');if(length>0&&n>=length)throw Error('Sections must start before the end of the song.');if(n<=prev)throw Error('Start times must follow the lyric order and be different.');prev=n}return starts}
 const segmentCache=new WeakMap();
 function segments(song,length){
  if(!song||typeof song!=='object')return [];const rate=root.StageTempo?.ratio(song)||1,provider=root.StageReaper?.timedRegions,prior=segmentCache.get(song);
  if(prior&&prior.text===song.text&&prior.timing===song.sectionTiming&&prior.source===song.reaperSource&&prior.length===length&&prior.rate===rate&&prior.provider===provider)return prior.result;
  const result=buildSegments(song,length);segmentCache.set(song,{text:song.text,timing:song.sectionTiming,source:song.reaperSource,length,rate,provider,result});return result;
 }
 function buildSegments(song,length){
  if(!(length>0))return [];const data=saved(song),rate=root.StageTempo?.ratio(song)||1;let list=data.list;if(!list.length)return [];
  const imported=root.StageReaper?.timedRegions(song,length);
  if(imported){list=alignSections(list,imported)}else list=list.map((s,i)=>({...s,start:data.starts[i]===null?undefined:data.starts[i]/rate}));
  const lines=String(song.text||'').split(/\r?\n/),weights=list.map((section,i)=>Math.max(1,lines.slice(section.line+1,list[i+1]?.line??lines.length).filter(line=>line.trim()&&!/^\s*\{.*\}\s*$/.test(line)).length));
  // Estimate only unmatched new headings. Exact surviving boundaries are never redistributed.
  for(let a=0;a<list.length;){if(Number.isFinite(list[a].start)){a++;continue}let b=a;while(b<list.length&&!Number.isFinite(list[b].start))b++;const lower=a?list[a-1].start:0,upper=b<list.length?list[b].start:length;let total=weights.slice(a? a-1:a,b).reduce((x,y)=>x+y,0),elapsed=a?weights[a-1]:0;
   for(let k=a;k<b;k++){list[k]={...list[k],start:lower+(upper-lower)*elapsed/total,estimated:true};elapsed+=weights[k]}a=b;
  }
  try{validateStarts(list.map(s=>s.start),length)}catch{return []}
  return list.map((s,i)=>({...s,end:list[i+1]?.start??length}))
 }
 function sectionColor(type,opts){const value=opts?.colors?.[type];return hex(value)&&value.toLowerCase()!=='#62dfce'?value:root.StageCore.sectionColors[type]||root.StageCore.sectionColors.verse}
 function segmentColor(segment,opts){return opts?.useReaperRegionColors===true&&hex(segment.color)?segment.color:sectionColor(segment.type,opts)}
 function headingColors(song,opts){const colors=sections(song?.text).map(section=>sectionColor(section.type,opts)),length=(Number(song?.duration)||Number(song?.reaperSource?.duration)||0)/(root.StageTempo?.ratio(song)||1);for(const segment of segments(song,length))if(segment.index>=0)colors[segment.index]=segmentColor(segment,opts);return colors}
 function parseTime(value){const v=String(value).trim().replace(',','.');if(!v)return null;const m=v.match(/^(\d{1,4}):([0-5]\d(?:\.\d{1,3})?)$/);if(m)return Number(m[1])*60+Number(m[2]);if(/^\d+(?:\.\d{1,3})?$/.test(v))return Number(v);throw Error('Use mm:ss, for example 01:24, or seconds.')}
 function time(value){if(value===null||!Number.isFinite(value))return '';const n=Math.round(value*100)/100,whole=Math.floor(n);return String(Math.floor(whole/60)).padStart(2,'0')+':'+String(whole%60).padStart(2,'0')+(n%1?'.'+String(Math.round((n%1)*100)).padStart(2,'0'):'')}
 function interpolate(time,anchors){if(!anchors.length)return 0;if(time<=anchors[0].time)return anchors[0].y;for(let i=1;i<anchors.length;i++)if(time<=anchors[i].time){const a=anchors[i-1],b=anchors[i];return b.time===a.time?b.y:a.y+(b.y-a.y)*Math.max(0,Math.min(1,(time-a.time)/(b.time-a.time)))}return anchors[anchors.length-1].y}
 root.StageLyrics={VERSION:'26.162',esc,hex,colorRange,header,sections,signature,inline,render,validateSaved,saved,validateStarts,segments,sectionColor,segmentColor,headingColors,parseTime,time,interpolate};
})(typeof window!=='undefined'?window:globalThis);