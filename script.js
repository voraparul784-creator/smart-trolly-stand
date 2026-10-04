const TOTAL_STANDS = 10;
let states = Array(TOTAL_STANDS).fill(false);
let lang = "en";
let port = null, reader = null, demo = false, demoTimer = null;

const enGu = {
  "present":["Trolley Present","ટ્રોલી હાજર છે"],
  "missing":["Trolley Missing","ટ્રોલી નથી"],
  "stand":["Stand","સ્ટેન્ડ"],
  "available":["Trolleys Available","ઉપલબ્ધ ટ્રોલી"],
  "inUse":["Trolleys In Use","વપરાશમાં ટ્રોલી"],
  "connected":["Arduino connected","Arduino કનેક્ટ થયું"],
  "disconnected":["Arduino disconnected","Arduino કનેક્ટ નથી"],
};

function t(pair){ return pair[lang==="en"?0:1]; }

function render(){
  document.getElementById("total").textContent = TOTAL_STANDS;
  const available = states.filter(Boolean).length;
  document.getElementById("available").textContent = available;
  document.getElementById("inUse").textContent = TOTAL_STANDS - available;
  const box = document.getElementById("stands");
  box.innerHTML = "";
  states.forEach((present,i)=>{
    const el = document.createElement("div");
    el.className = "stand " + (present ? "present":"missing");
    el.innerHTML = `<div class="stand-top"><span class="stand-id">${t(enGu.stand)} ${i+1}</span><span class="status-icon">${present?"🛒":"—"}</span></div>
      <h4>${present?t(enGu.present):t(enGu.missing)}</h4>
      <div class="status">${present?"● ONLINE":"● EMPTY"}</div>
      <div class="distance">${present?"IR sensor: object detected":"IR sensor: no trolley detected"}</div>`;
    box.appendChild(el);
  });
  document.getElementById("lastUpdate").textContent = new Date().toLocaleTimeString();
}

function updateConnection(online){
  const c = document.getElementById("connectionStatus");
  c.innerHTML = `<span class="dot ${online?"online":"offline"}"></span><span>${online?t(enGu.connected):t(enGu.disconnected)}</span>`;
}

function parseLine(line){
  line=line.trim();
  if(!line) return;
  // Arduino format: T:1,0,1,1,0,0,1,0,1,1
  if(line.startsWith("T:")){
    const a=line.slice(2).split(",").map(x=>x.trim());
    if(a.length>=TOTAL_STANDS){
      states = a.slice(0,TOTAL_STANDS).map(x=>x==="1");
      render();
    }
  }
}

async function connectSerial(){
  if(!("serial" in navigator)){
    alert("Web Serial is not supported. Please use Google Chrome or Microsoft Edge on Windows.");
    return;
  }
  try{
    port = await navigator.serial.requestPort();
    await port.open({baudRate:9600});
    updateConnection(true);
    demo=false; clearInterval(demoTimer);
    reader = port.readable.getReader();
    let buffer="";
    while(true){
      const {value,done}=await reader.read();
      if(done) break;
      buffer += new TextDecoder().decode(value);
      const lines=buffer.split(/\r?\n/);
      buffer=lines.pop();
      lines.forEach(parseLine);
    }
  }catch(e){
    console.error(e);
    updateConnection(false);
  }
}

async function disconnectSerial(){
  try{ if(reader) await reader.cancel(); }catch(e){}
  try{ if(port) await port.close(); }catch(e){}
  reader=null; port=null; updateConnection(false);
}

function startDemo(){
  demo=true; if(port) disconnectSerial();
  clearInterval(demoTimer);
  demoTimer=setInterval(()=>{
    states = states.map((_,i)=>Math.random()>.35);
    render();
  },1500);
  states=[true,true,false,true,false,true,true,false,true,false];
  render();
}

document.getElementById("connectBtn").addEventListener("click",()=>{
  if(port) disconnectSerial(); else connectSerial();
});
document.getElementById("demoBtn").addEventListener("click",startDemo);
document.getElementById("langBtn").addEventListener("click",()=>{
  lang=lang==="en"?"gu":"en";
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-en]").forEach(el=>el.textContent=el.dataset[lang]);
  document.getElementById("langBtn").textContent=lang==="en"?"ગુજરાતી":"English";
  render(); updateConnection(!!port);
});
render();