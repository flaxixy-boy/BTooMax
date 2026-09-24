const screens=document.querySelectorAll(".screen");
const navItems=document.querySelectorAll(".nav-item");
const tools=[
 {id:"calculator",icon:"🧮",name:"Calculator",desc:"Quick everyday calculations.",tags:"math calculate"},
 {id:"qr",icon:"▣",name:"QR Code Generator",desc:"Create QR codes from text or links.",tags:"qr code"},
 {id:"password",icon:"🔐",name:"Password Generator",desc:"Generate strong random passwords.",tags:"password security"},
 {id:"unit",icon:"⇄",name:"Unit Converter",desc:"Convert common units instantly.",tags:"convert units"},
 {id:"word",icon:"Aa",name:"Word Counter",desc:"Count words and characters.",tags:"text words characters"},
 {id:"json",icon:"{}",name:"JSON Formatter",desc:"Format and validate JSON.",tags:"json developer"},
 {id:"color",icon:"◉",name:"Color Converter",desc:"Convert HEX, RGB and HSL.",tags:"color hex rgb hsl"},
 {id:"timestamp",icon:"◷",name:"Timestamp Converter",desc:"Convert Unix timestamps and dates.",tags:"time timestamp unix"},
 {id:"base64",icon:"B64",name:"Base64 Encoder",desc:"Encode or decode Base64 text.",tags:"base64 encode decode"},
 {id:"percentage",icon:"%",name:"Percentage Calculator",desc:"Calculate percentages quickly.",tags:"percent percentage math"},
 {id:"image",icon:"▧",name:"Image Compressor",desc:"Reduce image file size.",tags:"image compress"},
 {id:"uuid",icon:"#",name:"UUID Generator",desc:"Generate random UUIDs.",tags:"uuid id generator"}
];
const popular=["calculator","qr","password","unit","word","json"];
function card(tool){const href=tool.id==="image"?"./tools/image-compressor/compressor.html":"#tools";const attr=tool.id==="image"?"":" data-tool=\""+tool.id+"\"";return '<a class="tool-card" href="'+href+'"'+attr+'><div class="tool-icon">'+tool.icon+'</div><div class="tool-name">'+tool.name+'</div><div class="tool-desc">'+tool.desc+'</div></a>'}
function renderTools(){document.getElementById("popular-tools").innerHTML=popular.map(id=>card(tools.find(t=>t.id===id))).join("");document.getElementById("all-tools").innerHTML=tools.map(card).join("");document.getElementById("tool-count").textContent=tools.length}
function showPage(page){const target=document.getElementById(page)||document.getElementById("home");screens.forEach(s=>s.classList.toggle("active",s===target));navItems.forEach(n=>n.classList.toggle("active",n.dataset.page===target.id));history.replaceState(null,"","#"+target.id);window.scrollTo({top:0,behavior:"smooth"})}
function openTool(id){showPage("tools");setTimeout(()=>document.querySelector('[data-tool="'+id+'"]')?.scrollIntoView({behavior:"smooth",block:"center"}),80)}
renderTools();
document.addEventListener("click",e=>{const pageLink=e.target.closest("[data-page]"),tool=e.target.closest("[data-tool]");if(tool){e.preventDefault();openTool(tool.dataset.tool);return}if(pageLink){e.preventDefault();showPage(pageLink.dataset.page)}});
const search=document.getElementById("tool-search"),results=document.getElementById("search-results");
search.addEventListener("input",()=>{const q=search.value.trim().toLowerCase();if(!q){results.innerHTML="";return}const matches=tools.filter(t=>(t.name+" "+t.desc+" "+t.tags).toLowerCase().includes(q)).slice(0,6);results.innerHTML=matches.length?matches.map(t=>'<button class="search-result" data-tool="'+t.id+'"><span class="result-icon">'+t.icon+'</span><span><strong>'+t.name+'</strong><small>'+t.desc+'</small></span></button>').join(""):'<div class="search-result"><span><strong>No matching tool</strong><small>Try another keyword.</small></span></div>'});
document.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement!==search){e.preventDefault();search.focus()}if(e.key==="Escape"&&document.activeElement===search){search.value="";results.innerHTML="";search.blur()}});
const initial=location.hash.replace("#","");showPage(initial==="tools"?"tools":"home");