// Keys come from a private family pairing. The public workshop contains no family credentials.
window.ArcadeLive = (() => {
  const endpoint = '@@LIVE_ENDPOINT@@';
  const storageKey = role => 'study-arcade.live.' + role + '.v1';
  const tokenPattern = /^[A-Za-z0-9_-]{43}$/;
  const encode = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const decode = text => Uint8Array.from(atob(text.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
  function config(role, input) {
    if (!input || input.role !== role || !tokenPattern.test(input.token) || !tokenPattern.test(input.cipher)) throw Error('This family connection is invalid. Reopen the private setup link.');
    return {role, token:input.token, cipher:input.cipher};
  }
  function readConfig(role) {
    if (role === 'reader' && location.hash.startsWith('#view=')) {
      const [token,cipher] = location.hash.slice(6).split('.');
      const found = config(role,{role,token,cipher});
      try {localStorage.setItem(storageKey(role),JSON.stringify(found));}catch{}
      return found;
    }
    let text;try{text=localStorage.getItem(storageKey(role));}catch{}
    return text ? config(role,JSON.parse(text)) : null;
  }
  async function request(body) {
    const abort=new AbortController(), timer=setTimeout(()=>abort.abort(),20000);
    try {
      const response=await fetch(endpoint,{method:'POST',mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(body),signal:abort.signal});
      if(!response.ok)throw Error('The progress service is unavailable.');
      const data=await response.json();
      if(!data.ok)throw Error(data.error==='unauthorized'?'This family connection was not accepted. Reopen the private setup link.':data.error==='device-limit'?'This family has reached its browser connection limit.':'The progress service could not complete this update.');
      return data;
    } finally {clearTimeout(timer);}
  }
  async function secret(c){return crypto.subtle.importKey('raw',decode(c.cipher),{name:'AES-GCM'},false,['encrypt','decrypt']);}
  const associated=(id,rev)=>new TextEncoder().encode('arcade-report-v1/'+id+'/'+rev);
  async function seal(c,id,rev,snapshot) {
    const iv=crypto.getRandomValues(new Uint8Array(12)), key=await secret(c);
    const bytes=new TextEncoder().encode(JSON.stringify(snapshot));
    const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:associated(id,rev)},key,bytes);
    const packet=new Uint8Array(12+encrypted.byteLength);packet.set(iv);packet.set(new Uint8Array(encrypted),12);
    return encode(packet);
  }
  async function readDevices(c) {
    const data=await request({op:'read',key:c.token}), key=await secret(c);
    return Promise.all(data.devices.map(async row=>{
      const bytes=decode(row.blob);
      const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(0,12),additionalData:associated(row.id,row.rev)},key,bytes.slice(12));
      const snapshot=JSON.parse(new TextDecoder().decode(clear));
      if(snapshot.v!==1)throw Error('This report needs a newer dashboard.');
      return {id:row.id,received:row.received,snapshot};
    }));
  }
  return {readConfig,readDevices,config,request,seal,storageKey};
})();
