const $=s=>document.querySelector(s),fi=$("#file"),drop=$("#drop"),work=$("#work"),preview=$("#preview"),name=$("#name"),meta=$("#meta"),format=$("#format"),quality=$("#quality"),qv=$("#qv"),result=$("#result"),size=$("#size"),saved=$("#saved"),fill=$("#fill");let file=null,out=null,url=null;

const OUTPUTS=[
  ["image/webp","WebP","webp"],
  ["image/avif","AVIF","avif"],
  ["image/jpeg","JPG","jpg"],
  ["image/png","PNG","png"]
];

const fmt=n=>n<1048576?(n/1024).toFixed(1)+" KB":(n/1048576).toFixed(2)+" MB";

function canEncode(type){
  const c=document.createElement("canvas");
  c.width=1;c.height=1;
  try{return c.toDataURL(type).startsWith(type==="image/jpeg"?"data:image/jpeg":type==="image/png"?"data:image/png":type==="image/webp"?"data:image/webp":type==="image/avif"?"data:image/avif":"data:")}
  catch(e){return false}
}

function setupFormats(){
  format.innerHTML="";
  OUTPUTS.filter(o=>canEncode(o[0])).forEach(([mime,label])=>{
    const option=document.createElement("option");
    option.value=mime;option.textContent=label;
    format.appendChild(option);
  });
  if(!format.options.length){
    const option=document.createElement("option");
    option.value="image/png";option.textContent="PNG";
    format.appendChild(option);
  }
}
setupFormats();

function load(f){
  if(!f||!f.type.startsWith("image/"))return alert("Choose an image file.");
  if(f.size>25*1024*1024)return alert("Max 25 MB.");
  file=f;
  if(url)URL.revokeObjectURL(url);
  url=URL.createObjectURL(f);
  preview.src=url;
  preview.onload=()=>meta.textContent=preview.naturalWidth+" x "+preview.naturalHeight+" - "+fmt(f.size);
  name.textContent=f.name;
  work.hidden=false;
  result.hidden=true;
}
fi.onchange=()=>load(fi.files[0]);
drop.ondragover=e=>e.preventDefault();
drop.ondrop=e=>{e.preventDefault();load(e.dataTransfer.files[0])};
quality.oninput=()=>qv.textContent=quality.value;
$("#remove").onclick=()=>{fi.value="";work.hidden=true;result.hidden=true;file=null;out=null;if(url)URL.revokeObjectURL(url);url=null};

$("#compress").onclick=()=>{
  if(!file)return;
  const img=new Image();
  img.onload=()=>{
    const scale=Math.min(1,2400/Math.max(img.naturalWidth,img.naturalHeight));
    const c=document.createElement("canvas");
    c.width=Math.max(1,Math.round(img.naturalWidth*scale));
    c.height=Math.max(1,Math.round(img.naturalHeight*scale));
    const x=c.getContext("2d");
    if(format.value==="image/jpeg"){x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height)}
    x.drawImage(img,0,0,c.width,c.height);
    c.toBlob(b=>{
      if(!b)return alert("This output format is not supported by your browser.");
      out=b;
      size.textContent=fmt(b.size);
      const p=Math.max(0,Math.round((1-b.size/file.size)*100));
      saved.textContent=p+"% smaller";
      fill.style.width=Math.min(100,p)+"%";
      result.hidden=false;
    },format.value,quality.value/100);
  };
  img.onerror=()=>alert("This image format cannot be decoded by your browser.");
  img.src=url;
};

$("#download").onclick=()=>{
  if(!out)return;
  const ext=OUTPUTS.find(o=>o[0]===format.value)?.[2]||"png";
  const a=document.createElement("a");
  const u=URL.createObjectURL(out);
  a.href=u;a.download="compressed-"+file.name.replace(/\.[^.]+$/,"")+"."+ext;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(u),1000);
};