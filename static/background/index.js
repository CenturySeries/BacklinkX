var e,t;"function"==typeof(e=globalThis.define)&&(t=e,e=null),function(t,s,r,a,d){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o="function"==typeof i[a]&&i[a],n=o.cache||{},l="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function E(e,s){if(!n[e]){if(!t[e]){var r="function"==typeof i[a]&&i[a];if(!s&&r)return r(e,!0);if(o)return o(e,!0);if(l&&"string"==typeof e)return l(e);var d=Error("Cannot find module '"+e+"'");throw d.code="MODULE_NOT_FOUND",d}u.resolve=function(s){var r=t[e][1][s];return null!=r?r:s},u.cache={};var c=n[e]=new E.Module(e);t[e][0].call(c.exports,u,c,c.exports,this)}return n[e].exports;function u(e){var t=u.resolve(e);return!1===t?{}:E(t)}}E.isParcelRequire=!0,E.Module=function(e){this.id=e,this.bundle=E,this.exports={}},E.modules=t,E.cache=n,E.parent=o,E.register=function(e,s){t[e]=[function(e,t){t.exports=s},{}]},Object.defineProperty(E,"root",{get:function(){return i[a]}}),i[a]=E;for(var c=0;c<s.length;c++)E(s[c]);if(r){var u=E(r);"object"==typeof exports&&"undefined"!=typeof module?module.exports=u:"function"==typeof e&&e.amd?e(function(){return u}):d&&(this[d]=u)}}({kgW6q:[function(e,t,s){e("../../../background/index")},{"../../../background/index":"lSzt3"}],lSzt3:[function(e,t,s){var r=e("@plasmohq/storage"),a=e("~lib/db"),d=e("~lib/ai");console.log("[BacklinkX] Background service worker loaded");let i=new r.Storage,o=0;try{let e=void 0!==chrome.sidePanel;i.set("sidepanel_supported",e)}catch(e){i.set("sidepanel_supported",!1)}async function n(e){let t=function(){try{let e=chrome.runtime.getManifest(),t=e.content_scripts||[];for(let e of t){let t=e.js?.[0];if(t)return t}}catch(e){}return null}();if(!t)throw Error("\u672a\u627e\u5230\u5185\u5bb9\u811a\u672c\u6587\u4ef6");if(!chrome.scripting?.executeScript)throw Error("\u5f53\u524d\u73af\u5883\u4e0d\u652f\u6301\u811a\u672c\u6ce8\u5165");await chrome.scripting.executeScript({target:{tabId:e},files:[t]})}function l(e,t){return new Promise((s,r)=>{chrome.tabs.sendMessage(e,t,e=>{chrome.runtime.lastError?r(Error(chrome.runtime.lastError.message)):e?.success?s(e.data):r(Error(e?.error||"\u672a\u77e5\u9519\u8bef"))})})}try{let e=chrome.sidePanel;e?.setPanelBehavior&&e.setPanelBehavior({openPanelOnActionClick:!0}).catch(()=>{})}catch(e){}async function E(e){switch(e.type){case"D1_QUERY":return c(e.payload);case"TEST_D1_CONNECTION":return u(e.payload);case"GENERATE_COMMENTS":return p(e.payload);case"GET_PAGE_INFO":case"AUDIT_LINKS":case"FILL_FORM":case"CLEAR_LINK_HIGHLIGHTS":return _(e);default:throw Error(`\u672a\u77e5\u6d88\u606f\u7c7b\u578b: ${e.type}`)}}async function c(e){let t=await S();if(!t.api_base_url||!t.database)throw Error("D1 \u914d\u7f6e\u672a\u8bbe\u7f6e");let s=(e.sql||"").trim();if(!(0,a.isSqlAllowed)(s))throw Error("SQL \u6a21\u677f\u672a\u6388\u6743");let r=new a.D1Client(t.api_base_url,t.database);return N(()=>r.query(s,e.params||[]),t.api_base_url)}async function u(e){let t=new a.D1Client(e.api_base_url);return N(()=>t.testConnection(),e.api_base_url)}async function p(e){let t=await h();if(!t.api_key||!t.model)throw Error("AI \u914d\u7f6e\u672a\u8bbe\u7f6e");let s=new d.AIStudioClient(t.api_key,t.model),r=await s.generateComments(e.page_info,e.assets,e.link_style,e.length);return r}async function _(e){let t=await chrome.tabs.query({active:!0,currentWindow:!0});if(!t[0]?.id)throw Error("\u65e0\u6cd5\u83b7\u53d6\u5f53\u524d\u6807\u7b7e\u9875");let s=t[0].id;try{return await l(s,e)}catch(t){if(function(e){let t=String(e?.message||"");return t.includes("Receiving end does not exist")||t.includes("Could not establish connection")||t.includes("The message port closed before a response was received")||t.includes("\u63a5\u6536\u7aef\u4e0d\u5b58\u5728")||t.includes("\u65e0\u6cd5\u5efa\u7acb\u8fde\u63a5")||t.includes("\u6d88\u606f\u7aef\u53e3")}(t))return await n(s),await l(s,e);throw t}}async function S(){let e=await i.get("d1_api_base_url"),t=await i.get("d1_database")||"default";return{api_base_url:e||"",database:t}}async function h(){let e=await i.get("ai_api_key"),t=await i.get("ai_model")||"gemini-2.5-flash";return{api_key:e||"",model:t}}function A(e){let t=String(e?.message||"");return e?.code==="HTML_RESPONSE"||t.includes("\u63a5\u53e3\u8fd4\u56deHTML\u800c\u4e0d\u662fJSON")}function C(e){return e?.message==="AUTH_REQUIRED"||A(e)}async function N(e,t){try{return await e()}catch(s){if(!C(s))throw s;await O(t);try{return await e()}catch(e){if(C(e)){if(A(e))throw Error("\u63a5\u53e3\u4ecd\u8fd4\u56deHTML\uff0c\u8bf7\u68c0\u67e5 D1 API Base URL \u662f\u5426\u53ea\u586b\u6839\u57df\u540d\uff0c\u6216\u5b8c\u6210 Cloudflare Access \u767b\u5f55\u540e\u91cd\u8bd5");throw Error("\u9700\u8981\u5148\u767b\u5f55 Cloudflare Access\uff0c\u8bf7\u5b8c\u6210\u767b\u5f55\u540e\u91cd\u8bd5")}throw e}}}async function O(e){let t=Date.now();if(!(t-o<6e4)){o=t;try{await chrome.tabs.create({url:e})}catch(e){}}}chrome.runtime.onMessage.addListener((e,t,s)=>(E(e).then(e=>{s({success:!0,data:e})}).catch(e=>{console.error("[BacklinkX] Message handler error:",e),s({success:!1,error:e.message})}),!0))},{"@plasmohq/storage":"3wfAg","~lib/db":"jd7I8","~lib/ai":"d4Czo"}],"3wfAg":[function(e,t,s){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(s),r.export(s,"BaseStorage",()=>o),r.export(s,"Storage",()=>n);var a=e("pify"),d=r.interopDefault(a),i=()=>{try{let e=globalThis.navigator?.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[];if("Chrome"===e[1])return 100>parseInt(e[2])||globalThis.chrome.runtime?.getManifest()?.manifest_version===2}catch{}return!1},o=class{#e;#t;get primaryClient(){return this.#t}#s;get secondaryClient(){return this.#s}#r;get area(){return this.#r}get hasWebApi(){try{return"u">typeof window&&!!window.localStorage}catch(e){return console.error(e),!1}}#a=new Map;#d;get copiedKeySet(){return this.#d}isCopied=e=>this.hasWebApi&&(this.allCopied||this.copiedKeySet.has(e));#i=!1;get allCopied(){return this.#i}getExtStorageApi=()=>globalThis.browser?.storage||globalThis.chrome?.storage;get hasExtensionApi(){try{return!!this.getExtStorageApi()}catch(e){return console.error(e),!1}}isWatchSupported=()=>this.hasExtensionApi;keyNamespace="";isValidKey=e=>e.startsWith(this.keyNamespace);getNamespacedKey=e=>`${this.keyNamespace}${e}`;getUnnamespacedKey=e=>e.slice(this.keyNamespace.length);serde={serializer:JSON.stringify,deserializer:JSON.parse};constructor({area:e="sync",allCopied:t=!1,copiedKeyList:s=[],serde:r={}}={}){this.setCopiedKeySet(s),this.#r=e,this.#i=t,this.serde={...this.serde,...r};try{this.hasWebApi&&(t||s.length>0)&&(this.#s=window.localStorage)}catch{}try{this.hasExtensionApi&&(this.#e=this.getExtStorageApi(),i()?this.#t=(0,d.default)(this.#e[this.area],{exclude:["getBytesInUse"],errorFirst:!1}):this.#t=this.#e[this.area])}catch{}}setCopiedKeySet(e){this.#d=new Set(e)}rawGetAll=()=>this.#t?.get();getAll=async()=>Object.entries(await this.rawGetAll()).filter(([e])=>this.isValidKey(e)).reduce((e,[t,s])=>(e[this.getUnnamespacedKey(t)]=s,e),{});copy=async e=>{let t=void 0===e;if(!t&&!this.copiedKeySet.has(e)||!this.allCopied||!this.hasExtensionApi)return!1;let s=this.allCopied?await this.rawGetAll():await this.#t.get((t?[...this.copiedKeySet]:[e]).map(this.getNamespacedKey));if(!s)return!1;let r=!1;for(let e in s){let t=s[e],a=this.#s?.getItem(e);this.#s?.setItem(e,t),r||=t!==a}return r};rawGet=async e=>(await this.rawGetMany([e]))[e];rawGetMany=async e=>this.hasExtensionApi?await this.#t.get(e):e.filter(this.isCopied).reduce((e,t)=>(e[t]=this.#s?.getItem(t),e),{});rawSet=async(e,t)=>await this.rawSetMany({[e]:t});rawSetMany=async e=>(this.#s&&Object.entries(e).filter(([e])=>this.isCopied(e)).forEach(([e,t])=>this.#s.setItem(e,t)),this.hasExtensionApi&&await this.#t.set(e),null);clear=async(e=!1)=>{e&&this.#s?.clear(),await this.#t.clear()};rawRemove=async e=>{await this.rawRemoveMany([e])};rawRemoveMany=async e=>{this.#s&&e.filter(this.isCopied).forEach(e=>this.#s.removeItem(e)),this.hasExtensionApi&&await this.#t.remove(e)};removeAll=async()=>{let e=Object.keys(await this.getAll());await this.removeMany(e)};watch=e=>{let t=this.isWatchSupported();return t&&this.#o(e),t};#o=e=>{for(let t in e){let s=this.getNamespacedKey(t),r=this.#a.get(s)?.callbackSet||new Set;if(r.add(e[t]),r.size>1)continue;let a=(e,t)=>{if(t!==this.area||!e[s])return;let r=this.#a.get(s);if(!r)throw Error(`Storage comms does not exist for nsKey: ${s}`);Promise.all([this.parseValue(e[s].newValue),this.parseValue(e[s].oldValue)]).then(([e,s])=>{for(let a of r.callbackSet)a({newValue:e,oldValue:s},t)})};this.#e.onChanged.addListener(a),this.#a.set(s,{callbackSet:r,listener:a})}};unwatch=e=>{let t=this.isWatchSupported();return t&&this.#n(e),t};#n(e){for(let t in e){let s=this.getNamespacedKey(t),r=e[t],a=this.#a.get(s);a&&(a.callbackSet.delete(r),0===a.callbackSet.size&&(this.#a.delete(s),this.#e.onChanged.removeListener(a.listener)))}}unwatchAll=()=>this.#l();#l(){this.#a.forEach(({listener:e})=>this.#e.onChanged.removeListener(e)),this.#a.clear()}async getItem(e){return this.get(e)}async getItems(e){return await this.getMany(e)}async setItem(e,t){await this.set(e,t)}async setItems(e){await await this.setMany(e)}async removeItem(e){return this.remove(e)}async removeItems(e){return await this.removeMany(e)}},n=class extends o{get=async e=>{let t=this.getNamespacedKey(e),s=await this.rawGet(t);return this.parseValue(s)};getMany=async e=>{let t=e.map(this.getNamespacedKey),s=await this.rawGetMany(t),r=await Promise.all(Object.values(s).map(this.parseValue));return Object.keys(s).reduce((e,t,s)=>(e[this.getUnnamespacedKey(t)]=r[s],e),{})};set=async(e,t)=>{let s=this.getNamespacedKey(e),r=this.serde.serializer(t);return this.rawSet(s,r)};setMany=async e=>{let t=Object.entries(e).reduce((e,[t,s])=>(e[this.getNamespacedKey(t)]=this.serde.serializer(s),e),{});return await this.rawSetMany(t)};remove=async e=>{let t=this.getNamespacedKey(e);return this.rawRemove(t)};removeMany=async e=>{let t=e.map(this.getNamespacedKey);return await this.rawRemoveMany(t)};setNamespace=e=>{this.keyNamespace=e};parseValue=async e=>{try{if(void 0!==e)return this.serde.deserializer(e)}catch(e){console.error(e)}}}},{pify:"dsXuM","@parcel/transformer-js/src/esmodule-helpers.js":"f6DG4"}],dsXuM:[function(e,t,s){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(s),r.export(s,"default",()=>i);let a=(e,t,s,r)=>function(...a){let d=t.promiseModule;return new d((d,i)=>{t.multiArgs?a.push((...e)=>{t.errorFirst?e[0]?i(e):(e.shift(),d(e)):d(e)}):t.errorFirst?a.push((e,t)=>{e?i(e):d(t)}):a.push(d),Reflect.apply(e,this===s?r:this,a)})},d=new WeakMap;function i(e,t){t={exclude:[/.+(?:Sync|Stream)$/],errorFirst:!0,promiseModule:Promise,...t};let s=typeof e;if(!(null!==e&&("object"===s||"function"===s)))throw TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${null===e?"null":s}\``);let r=(e,s)=>{let r=d.get(e);if(r||(r={},d.set(e,r)),s in r)return r[s];let a=e=>"string"==typeof e||"symbol"==typeof s?s===e:e.test(s),i=Reflect.getOwnPropertyDescriptor(e,s),o=void 0===i||i.writable||i.configurable,n=t.include?t.include.some(e=>a(e)):!t.exclude.some(e=>a(e)),l=n&&o;return r[s]=l,l},i=new WeakMap,o=new Proxy(e,{apply(e,s,r){let d=i.get(e);if(d)return Reflect.apply(d,s,r);let n=t.excludeMain?e:a(e,t,o,e);return i.set(e,n),Reflect.apply(n,s,r)},get(e,s){let d=e[s];if(!r(e,s)||d===Function.prototype[s])return d;let n=i.get(d);if(n)return n;if("function"==typeof d){let s=a(d,t,o,e);return i.set(d,s),s}return d}});return o}},{"@parcel/transformer-js/src/esmodule-helpers.js":"f6DG4"}],f6DG4:[function(e,t,s){s.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},s.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},s.exportAll=function(e,t){return Object.keys(e).forEach(function(s){"default"===s||"__esModule"===s||t.hasOwnProperty(s)||Object.defineProperty(t,s,{enumerable:!0,get:function(){return e[s]}})}),t},s.export=function(e,t,s){Object.defineProperty(e,t,{enumerable:!0,get:s})}},{}],jd7I8:[function(e,t,s){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(s),r.export(s,"D1Client",()=>E),r.export(s,"isSqlAllowed",()=>S),r.export(s,"SQL_TEMPLATES",()=>h),r.export(s,"buildInClause",()=>A),r.export(s,"generateId",()=>C),r.export(s,"now",()=>N);let a=[300,800,1500];function d(e,t){let s=String(t||"").toLowerCase();return!!s.includes("text/html")||function(e){let t=String(e||"").trim();return!!t&&(/^<!doctype/i.test(t)||/^<html/i.test(t)||/^<head/i.test(t)||/^<body/i.test(t))}(e)}function i(e,t,s){let r=e.headers.get("content-type")||"",a=e.url||"",d="";if(a){let e=a.indexOf("/api");e>=0&&(d=`${a.slice(0,e)}/api`)}let i=["D1 API Base URL \u53ea\u586b\u7ad9\u70b9\u6839\u57df\u540d\uff08\u4e0d\u8981\u5305\u542b /api\uff09","\u5982\u4f7f\u7528 Cloudflare Access\uff0c\u8bf7\u5148\u5b8c\u6210\u767b\u5f55",d?`\u53ef\u5728\u6d4f\u89c8\u5668\u8bbf\u95ee ${d} \u9a8c\u8bc1\u5e94\u8fd4\u56de JSON`:""].filter(Boolean).join("\uff1b"),o=r?`\uff08content-type: ${r}\uff09`:"",n=Error(`${t}\u5931\u8d25: \u63a5\u53e3\u8fd4\u56deHTML\u800c\u4e0d\u662fJSON${o}\u3002${i}`);return n.code="HTML_RESPONSE",n}async function o(e,t){let s=await e.text();return d(s,e.headers.get("content-type"))?i(e,t,s):Error(`${t}\u5931\u8d25: ${e.status} ${e.statusText} - ${s}`)}async function n(e,t){let s=await e.text();if(d(s,e.headers.get("content-type")))throw i(e,t,s);try{return JSON.parse(s)}catch(e){throw Error(`${t}\u5931\u8d25: \u65e0\u6cd5\u89e3\u6790JSON\u54cd\u5e94: ${e?.message||e}`)}}async function l(e,t){let s;let r=a.length+1;for(let i=0;i<r;i++){try{var d;let s=await fetch(e,t);if(s.ok||(d=s.status,429!==d&&(!(d>=500)||!(d<=599)))||i===r-1)return s}catch(e){if(s=e,i===r-1)throw e}i<a.length&&await function(e){return new Promise(t=>setTimeout(t,e))}(a[i])}if(s)throw s;throw Error("\u8bf7\u6c42\u5931\u8d25")}class E{constructor(e,t="default"){this.baseUrl=e.endsWith("/")?e.slice(0,-1):e,this.database=t}async testConnection(){let e=await l(`${this.baseUrl}/api`,{credentials:"include"});if(!e.ok){if(401===e.status||403===e.status)throw Error("AUTH_REQUIRED");throw await o(e,"\u8fde\u63a5")}return n(e,"\u8fde\u63a5")}async query(e,t=[]){let s=await l(`${this.baseUrl}/api/db/${this.database}/all`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({query:e,params:t.map(e=>void 0===e?null:e)})});if(!s.ok){if(401===s.status||403===s.status)throw Error("AUTH_REQUIRED");throw await o(s,"\u67e5\u8be2")}return n(s,"\u67e5\u8be2")}async exec(e){let t=await l(`${this.baseUrl}/api/db/${this.database}/exec`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({query:e})});if(!t.ok){if(401===t.status||403===t.status)throw Error("AUTH_REQUIRED");throw await o(t,"\u6267\u884c")}return n(t,"\u6267\u884c")}}function c(e){return e.replace(/\s+/g," ").trim()}function u(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function p(e){let t=c(e).replace("%METHOD_PLACEHOLDERS%","__METHOD__").replace("%LINK_ATTR_PLACEHOLDERS%","__LINK__").replace("%DR_ORDER%","__DR_ORDER__").replace("%ID_PLACEHOLDERS%","__ID__").replace("%DOMAIN_PLACEHOLDERS%","__DOMAIN__").replace("%PROSPECT_VALUES%","__PROSPECT_VALUES__"),s=u(t),r="\\?\\s*(,\\s*\\?\\s*)*",a="\\(\\?\\s*(,\\s*\\?\\s*){11}\\)",d=`${a}(\\s*,\\s*${a})*`,i=s.replace(u("__METHOD__"),r).replace(u("__LINK__"),r).replace(u("__DR_ORDER__"),"(ASC|DESC)").replace(u("__ID__"),r).replace(u("__DOMAIN__"),r).replace(u("__PROSPECT_VALUES__"),d);return RegExp(`^${i}$`,"i")}let _=null;function S(e){let t=c(e);return(_||(_=Object.values(h).map(p)),_).some(e=>e.test(t))}let h={FETCH_NEXT_PROSPECT:`
    SELECT *
    FROM prospects
    WHERE (
      ? = 'any'
      OR (? = 'pending' AND status IS NULL)
      OR status = ?
    )
      AND (? = 1 OR method IN (%METHOD_PLACEHOLDERS%))
      AND (? = 1 OR link_attr IN (%LINK_ATTR_PLACEHOLDERS%))
      AND (? = -1 OR is_paid = ?)
      AND (
        ? = 1
        OR (? = 1 AND target_asset_id IS NULL)
        OR target_asset_id = ?
      )
    ORDER BY dr %DR_ORDER%, updated_at ASC
    LIMIT 1
  `,FETCH_NEXT_PROSPECT_BATCH:`
    SELECT *
    FROM prospects
    WHERE (
      ? = 'any'
      OR (? = 'pending' AND status IS NULL)
      OR status = ?
    )
      AND (? = 1 OR method IN (%METHOD_PLACEHOLDERS%))
      AND (? = 1 OR link_attr IN (%LINK_ATTR_PLACEHOLDERS%))
      AND (? = -1 OR is_paid = ?)
      AND (
        ? = 1
        OR (? = 1 AND target_asset_id IS NULL)
        OR target_asset_id = ?
      )
    ORDER BY dr %DR_ORDER%, updated_at ASC
    LIMIT 20
  `,UPDATE_PROSPECT_INFO:`
    UPDATE prospects
    SET source_url = ?,
        domain_normalized = ?,
        dr = ?,
        notes = ?,
        method = ?,
        is_paid = ?,
        link_attr = ?,
        updated_at = ?
    WHERE id = ?
  `,UPDATE_PROSPECT_UNSUITABLE:`
    UPDATE prospects
    SET status = 'UNSUITABLE',
        updated_at = ?
    WHERE id = ?
  `,UPDATE_PROSPECT_SUITABLE:`
    UPDATE prospects
    SET status = 'SUITABLE',
        updated_at = ?
    WHERE id = ?
  `,UPDATE_LINK_AUDIT:`
    UPDATE prospects
    SET page_follow_count = ?,
        page_nofollow_count = ?,
        page_link_audit_at = ?,
        updated_at = ?
    WHERE id = ?
  `,UPSERT_ASSET_POST_SUBMITTED:`
    INSERT INTO asset_posts (
      id, asset_id, domain_normalized, last_status,
      posted_at, failed_at, last_note, discovered_at, updated_at
    ) VALUES (
      ?, ?, ?, 'SUBMITTED',
      ?, NULL, NULL, ?, ?
    )
    ON CONFLICT(asset_id, domain_normalized)
    DO UPDATE SET
      last_status = 'SUBMITTED',
      posted_at = excluded.posted_at,
      failed_at = NULL,
      last_note = NULL,
      discovered_at = COALESCE(excluded.discovered_at, asset_posts.discovered_at),
      updated_at = excluded.updated_at
  `,UPSERT_ASSET_POST_FAILED:`
    INSERT INTO asset_posts (
      id, asset_id, domain_normalized, last_status,
      posted_at, failed_at, last_note, discovered_at, updated_at
    ) VALUES (
      ?, ?, ?, 'FAILED',
      NULL, ?, ?, ?, ?
    )
    ON CONFLICT(asset_id, domain_normalized)
    DO UPDATE SET
      last_status = 'FAILED',
      failed_at = excluded.failed_at,
      last_note = excluded.last_note,
      discovered_at = COALESCE(excluded.discovered_at, asset_posts.discovered_at),
      updated_at = excluded.updated_at
  `,UPSERT_ASSET_DR_HISTORY:`
    INSERT INTO asset_dr_history (
      id, asset_id, date, day_start_ts,
      dr, source, imported_at
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?
    )
    ON CONFLICT(asset_id, date, source)
    DO UPDATE SET
      dr = excluded.dr,
      day_start_ts = excluded.day_start_ts,
      imported_at = excluded.imported_at
  `,GET_ALL_ASSETS:`
    SELECT * FROM assets ORDER BY updated_at DESC
  `,GET_ASSET_BY_ID:`
    SELECT * FROM assets WHERE id = ?
  `,UPSERT_ASSET:`
    INSERT INTO assets (
      id, name, website_url, email, description, anchor_texts,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id)
    DO UPDATE SET
      name = excluded.name,
      website_url = excluded.website_url,
      email = excluded.email,
      description = excluded.description,
      anchor_texts = excluded.anchor_texts,
      updated_at = excluded.updated_at
  `,DELETE_ASSET:`
    DELETE FROM assets WHERE id = ?
  `,GET_ASSET_POST:`
    SELECT * FROM asset_posts
    WHERE asset_id = ? AND domain_normalized = ?
  `,GET_DOMAIN_POSTS:`
    SELECT * FROM asset_posts
    WHERE domain_normalized = ?
  `,ANALYSIS_TOTAL_COUNTS:`
    SELECT
      SUM(CASE WHEN last_status = 'SUBMITTED' AND posted_at >= ? AND posted_at < ? THEN 1 ELSE 0 END) AS today_count,
      SUM(CASE WHEN last_status = 'SUBMITTED' AND posted_at >= ? AND posted_at < ? THEN 1 ELSE 0 END) AS yesterday_count,
      SUM(CASE WHEN last_status = 'SUBMITTED' AND posted_at >= ? AND posted_at <= ? THEN 1 ELSE 0 END) AS last7_count,
      SUM(CASE WHEN last_status = 'SUBMITTED' AND posted_at >= ? AND posted_at <= ? THEN 1 ELSE 0 END) AS last30_count
    FROM asset_posts
  `,ANALYSIS_ASSET_COUNTS:`
    SELECT
      a.id AS asset_id,
      a.name AS asset_name,
      a.website_url AS website_url,
      SUM(CASE WHEN ap.last_status = 'SUBMITTED' AND ap.posted_at >= ? AND ap.posted_at < ? THEN 1 ELSE 0 END) AS today_count,
      SUM(CASE WHEN ap.last_status = 'SUBMITTED' AND ap.posted_at >= ? AND ap.posted_at < ? THEN 1 ELSE 0 END) AS yesterday_count,
      SUM(CASE WHEN ap.last_status = 'SUBMITTED' AND ap.posted_at >= ? AND ap.posted_at <= ? THEN 1 ELSE 0 END) AS last7_count,
      SUM(CASE WHEN ap.last_status = 'SUBMITTED' AND ap.posted_at >= ? AND ap.posted_at <= ? THEN 1 ELSE 0 END) AS last30_count
    FROM assets a
    LEFT JOIN asset_posts ap ON ap.asset_id = a.id
    GROUP BY a.id
    ORDER BY a.updated_at DESC
  `,ANALYSIS_SINGLE_ASSET_COUNTS:`
    SELECT
      SUM(CASE WHEN last_status = 'SUBMITTED' AND posted_at >= ? AND posted_at < ? THEN 1 ELSE 0 END) AS today_count,
      SUM(CASE WHEN last_status = 'SUBMITTED' AND posted_at >= ? AND posted_at < ? THEN 1 ELSE 0 END) AS yesterday_count,
      SUM(CASE WHEN last_status = 'SUBMITTED' AND posted_at >= ? AND posted_at <= ? THEN 1 ELSE 0 END) AS last7_count,
      SUM(CASE WHEN last_status = 'SUBMITTED' AND posted_at >= ? AND posted_at <= ? THEN 1 ELSE 0 END) AS last30_count
    FROM asset_posts
    WHERE asset_id = ?
  `,FETCH_ASSET_DR_HISTORY:`
    SELECT asset_id, date, day_start_ts, dr
    FROM asset_dr_history
    WHERE asset_id IN (%ID_PLACEHOLDERS%)
      AND day_start_ts >= ?
      AND day_start_ts <= ?
    ORDER BY day_start_ts ASC
  `,FETCH_ASSET_DISCOVERED_POSTS:`
    SELECT
      ap.asset_id,
      ap.domain_normalized,
      ap.discovered_at,
      ap.posted_at,
      ap.last_status,
      p.source_url,
      p.source_title,
      p.link_attr,
      p.method
    FROM asset_posts ap
    LEFT JOIN prospects p ON p.domain_normalized = ap.domain_normalized
    WHERE ap.asset_id IN (%ID_PLACEHOLDERS%)
      AND ap.discovered_at IS NOT NULL
      AND ap.discovered_at >= ?
      AND ap.discovered_at <= ?
    ORDER BY ap.discovered_at DESC
  `,UPDATE_ASSET_POST_DISCOVERED_AT:`
    UPDATE asset_posts
    SET discovered_at = CASE
      WHEN discovered_at IS NULL OR discovered_at > ? THEN ?
      ELSE discovered_at
    END,
    updated_at = ?
    WHERE asset_id = ? AND domain_normalized = ?
  `,INSERT_PROSPECT:`
    INSERT INTO prospects (
      id, source_url, domain_normalized, source_title, anchor_text,
      dr, link_attr, method, is_paid, notes,
      target_asset_id, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(domain_normalized)
    DO UPDATE SET
      source_url = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.source_url
        ELSE prospects.source_url
      END,
      source_title = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.source_title
        ELSE prospects.source_title
      END,
      anchor_text = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.anchor_text
        ELSE prospects.anchor_text
      END,
      dr = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.dr
        ELSE prospects.dr
      END,
      link_attr = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN COALESCE(excluded.link_attr, prospects.link_attr)
        ELSE prospects.link_attr
      END,
      method = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN COALESCE(excluded.method, prospects.method)
        ELSE prospects.method
      END,
      is_paid = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN COALESCE(excluded.is_paid, prospects.is_paid)
        ELSE prospects.is_paid
      END,
      notes = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN COALESCE(excluded.notes, prospects.notes)
        ELSE prospects.notes
      END,
      updated_at = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.updated_at
        ELSE prospects.updated_at
      END,
      target_asset_id = CASE
        WHEN prospects.target_asset_id IS NULL OR excluded.target_asset_id IS NULL THEN NULL
        WHEN prospects.target_asset_id != excluded.target_asset_id THEN NULL
        ELSE prospects.target_asset_id
      END
  `,INSERT_PROSPECTS_BATCH:`
    INSERT INTO prospects (
      id, source_url, domain_normalized, source_title, anchor_text,
      dr, link_attr, method, is_paid, notes,
      target_asset_id, updated_at
    ) VALUES %PROSPECT_VALUES%
    ON CONFLICT(domain_normalized)
    DO UPDATE SET
      source_url = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.source_url
        ELSE prospects.source_url
      END,
      source_title = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.source_title
        ELSE prospects.source_title
      END,
      anchor_text = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.anchor_text
        ELSE prospects.anchor_text
      END,
      dr = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.dr
        ELSE prospects.dr
      END,
      link_attr = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN COALESCE(excluded.link_attr, prospects.link_attr)
        ELSE prospects.link_attr
      END,
      method = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN COALESCE(excluded.method, prospects.method)
        ELSE prospects.method
      END,
      is_paid = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN COALESCE(excluded.is_paid, prospects.is_paid)
        ELSE prospects.is_paid
      END,
      notes = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN COALESCE(excluded.notes, prospects.notes)
        ELSE prospects.notes
      END,
      updated_at = CASE
        WHEN (COALESCE(excluded.dr, -1) > COALESCE(prospects.dr, -1))
          OR (
            COALESCE(excluded.dr, -1) = COALESCE(prospects.dr, -1)
            AND excluded.updated_at > prospects.updated_at
          )
        THEN excluded.updated_at
        ELSE prospects.updated_at
      END,
      target_asset_id = CASE
        WHEN prospects.target_asset_id IS NULL OR excluded.target_asset_id IS NULL THEN NULL
        WHEN prospects.target_asset_id != excluded.target_asset_id THEN NULL
        ELSE prospects.target_asset_id
      END
  `,GET_PROSPECT_BY_ID:`
    SELECT * FROM prospects WHERE id = ?
  `,GET_PROSPECT_BY_DOMAIN:`
    SELECT * FROM prospects WHERE domain_normalized = ?
  `,FETCH_PROSPECTS:`
    SELECT *
    FROM prospects
    WHERE (? = '' OR source_url LIKE ? OR domain_normalized LIKE ?)
      AND (
        ? = 'any'
        OR (? = 'pending' AND status IS NULL)
        OR status = ?
      )
      AND (? IS NULL OR dr >= ?)
      AND (? IS NULL OR dr <= ?)
      AND (? = 1 OR method IN (%METHOD_PLACEHOLDERS%))
      AND (? = 1 OR link_attr IN (%LINK_ATTR_PLACEHOLDERS%))
      AND (? = -1 OR is_paid = ?)
      AND (
        ? = 1
        OR (? = 1 AND target_asset_id IS NULL)
        OR target_asset_id = ?
      )
    ORDER BY updated_at DESC
  `,GET_PROSPECT_DOMAINS_IN:`
    SELECT domain_normalized
    FROM prospects
    WHERE domain_normalized IN (%DOMAIN_PLACEHOLDERS%)
  `,DELETE_PROSPECTS_BY_IDS:`
    DELETE FROM prospects WHERE id IN (%ID_PLACEHOLDERS%)
  `,DELETE_ASSET_POSTS_BY_DOMAINS:`
    DELETE FROM asset_posts WHERE domain_normalized IN (%DOMAIN_PLACEHOLDERS%)
  `,DELETE_PROSPECT:`
    DELETE FROM prospects WHERE id = ?
  `,DELETE_ASSET_POSTS_BY_DOMAIN:`
    DELETE FROM asset_posts WHERE domain_normalized = ?
  `};function A(e){return Array(e).fill("?").join(", ")}function C(){return crypto.randomUUID()}function N(){return Date.now()}},{"@parcel/transformer-js/src/esmodule-helpers.js":"f6DG4"}],d4Czo:[function(e,t,s){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(s),r.export(s,"AIStudioClient",()=>a),r.export(s,"parseAnchorTexts",()=>l),r.export(s,"selectRandomAnchor",()=>E),r.export(s,"formatLink",()=>c);class a{constructor(e,t){this.apiKey=e,this.model=t}async generateComments(e,t,s,r){let a=this.buildPrompt(e,t,s,r),E=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({contents:[{parts:[{text:a}]}],generationConfig:{temperature:.9,maxOutputTokens:2048}})});if(!E.ok){let e=await E.text();throw Error(`AI \u8c03\u7528\u5931\u8d25: ${E.status} - ${e}`)}let c=await E.json(),u=c.candidates?.[0]?.content?.parts||[],p=u.map(e=>e?.text||"").join("");if(!p)throw Error("AI \u8fd4\u56de\u5185\u5bb9\u4e3a\u7a7a");try{let s=function(e){let t;let s=[],r=String(e||"").trim();if(!r)return s;let a=/```(?:json)?\s*([\s\S]*?)\s*```/gi;for(;t=a.exec(r);)t[1]&&s.push(t[1].trim());let d=r.indexOf("["),i=r.lastIndexOf("]");-1!==d&&-1!==i&&i>d&&s.unshift(r.slice(d,i+1).trim()),s.push(r);let o=new Set;return s.filter(e=>!(!e||o.has(e))&&(o.add(e),!0))}(p),a=null,E=null;for(let e of s)try{a=JSON.parse(e);break}catch(e){E=e}if(!a)throw E||Error("\u65e0\u6cd5\u89e3\u6790 JSON");return function(e,t,s,r){if(!Array.isArray(e))throw Error(`AI \u8f93\u51fa\u5b57\u6bb5\u6821\u9a8c\u5931\u8d25: \u9876\u5c42\u4e0d\u662f\u6570\u7ec4
\u539f\u59cb\u8f93\u51fa: ${s}`);let a=new Set(t.map(e=>e.id)),E=new Map,c=new Set;for(let e of t){let t=i(e.website_url);t&&(E.has(t)?c.add(t):E.set(t,e))}let u=new Set,p=[];for(let s of(e.forEach((e,s)=>{let _=d(e?.website_value)?String(e.website_value).slice(0,120):"",S=_?`#${s+1} [${_}]`:`#${s+1}`;if(!e||"object"!=typeof e){p.push(`${S} \u4e0d\u662f\u5bf9\u8c61`);return}let h=e.asset_id,A=e.comment_body,C=e.website_value,N=t.find(e=>e.id===h);if(!N||!h||!a.has(h)){let t=i(C),s=t?E.get(t):void 0;s&&(c.has(t)?p.push(`${S} website_value \u5bf9\u5e94\u591a\u4e2a\u8d44\u4ea7\uff0c\u8bf7\u63d0\u4f9b asset_id\uff08\u91cd\u590d URL: ${t}\uff09`):(h=s.id,e.asset_id=s.id,N=s))}if(h&&a.has(h)?u.add(h):d(C)&&p.push(`${S} \u65e0\u6cd5\u901a\u8fc7 website_value \u5339\u914d\u8d44\u4ea7\uff08website_value: ${C}\uff09`),d(A)||p.push(`${S} \u7f3a\u5c11 comment_body`),d(C)?N&&i(C)!==i(N.website_url)&&p.push(`${S} website_value \u5fc5\u987b\u7b49\u4e8e\u8d44\u4ea7 URL\uff08\u671f\u671b ${N.website_url}\uff0c\u5b9e\u9645 ${C}\uff09`):N?e.website_value=N.website_url:p.push(`${S} \u7f3a\u5c11 website_value`),N&&d(A)){let e=l(N.anchor_texts),t=e.length>0?e:[N.name].filter(Boolean),s=null;for(let e of t)if(s=function(e,t,s,r){let a=function(e,t,s){let r=n(e);if(!r)return null;let a=o(t||"");switch(s){case"a-tag":if(!a)return null;return RegExp(`<a[^>]*href=["']?${r}["']?[^>]*>\\s*${a}\\s*<\\/a>`,"i");case"bbcode":if(!a)return null;return RegExp(`\\[url=${r}\\]\\s*${a}\\s*\\[/url\\]`,"i");case"markdown":if(!a)return null;return RegExp(`\\[${a}\\]\\(\\s*${r}\\s*\\)`,"i");case"url":return RegExp(`\\b${r}\\b`,"i");default:return null}}(t,s,r);if(!a)return null;let d=a.exec(e);return d?{index:d.index,length:d[0].length,value:d[0]}:null}(A,N.website_url,e,r.expectedLinkStyle))break;s||(s=function(e,t,s){let r=function(e,t){let s=n(e);if(!s)return null;switch(t){case"a-tag":return RegExp(`<a[^>]*href=["']?${s}["']?[^>]*>\\s*[\\s\\S]*?\\s*<\\/a>`,"i");case"bbcode":return RegExp(`\\[url=${s}\\]\\s*[\\s\\S]*?\\s*\\[/url\\]`,"i");case"markdown":return RegExp(`\\[[^\\]]+\\]\\(\\s*${s}\\s*\\)`,"i");case"url":return RegExp(`\\b${s}\\b`,"i");default:return null}}(t,s);if(!r)return null;let a=r.exec(e);return a?{index:a.index,length:a[0].length,value:a[0]}:null}(A,N.website_url,r.expectedLinkStyle)),s||p.push(`${S} \u8bc4\u8bba\u4e2d\u94fe\u63a5\u6837\u5f0f\u4e0d\u7b26\u5408\u8981\u6c42\uff08\u671f\u671b markdown\uff0cURL: ${N.website_url}\uff09`)}}),a))if(!u.has(s)){let e=t.find(e=>e.id===s);p.push(`\u7f3a\u5c11\u8d44\u4ea7\u8bc4\u8bba: ${s}${e?` (${e.name} | ${e.website_url})`:""}`)}if(p.length>0){let e=p.map(e=>`- ${e}`).join("\n");throw Error(`AI \u8f93\u51fa\u5b57\u6bb5\u6821\u9a8c\u5931\u8d25(${p.length}\u9879):
${e}
\u539f\u59cb\u8f93\u51fa: ${s}`)}return e}(a,t,p,{expectedLanguage:e.language,expectedLinkStyle:"markdown",expectedLength:r,expectedExcerpt:e.main_content_excerpt})}catch(e){throw Error(`\u65e0\u6cd5\u89e3\u6790 AI \u8f93\u51fa\u4e3a JSON: ${e.message}
\u539f\u59cb\u8f93\u51fa: ${p}`)}}buildPrompt(e,t,s,r){let a=t.map(e=>{let t=l(e.anchor_texts),s=E(t,e.name);return{name:e.name,url:e.website_url,email:e.email||"",description:e.description||"",anchor:s}}),d=`
\u4f60\u662f\u4e00\u4e2a\u4e13\u4e1a\u7684\u5185\u5bb9\u8425\u9500\u4e13\u5bb6,\u9700\u8981\u4e3a\u4ee5\u4e0b\u7f51\u9875\u64b0\u5199\u4ea7\u54c1\u8bc4\u8bba\u3002

# \u9875\u9762\u4fe1\u606f
- \u6807\u9898: ${e.title}
- URL: ${e.url}
- \u8bed\u8a00: ${e.language}
- \u6b63\u6587\u6458\u8981:
${e.main_content_excerpt}

# \u8bc4\u8bba\u8981\u6c42
- \u8f93\u51fa\u8bed\u8a00: **\u5fc5\u987b\u4e25\u683c\u7b49\u4e8e ${e.language}**,\u4e0d\u8981\u4f7f\u7528\u5176\u4ed6\u4efb\u4f55\u8bed\u8a00
- \u8bc4\u8bba\u957f\u5ea6: ${({short:"50-80 \u5b57",medium:"100-150 \u5b57",long:"200-300 \u5b57"})[r]}
- \u5fc5\u987b\u5f15\u7528\u9875\u9762\u4e2d\u7684\u5177\u4f53\u7ec6\u8282(\u81f3\u5c11 1-2 \u5904\u53ef\u9a8c\u8bc1\u7684\u5185\u5bb9)
- \u9690\u853d\u690d\u5165\u4ea7\u54c1\u4fe1\u606f,\u4e0d\u8981\u786c\u5e7f
- \u81ea\u7136\u771f\u5b9e,\u50cf\u771f\u5b9e\u7528\u6237\u7684\u8bc4\u8bba

# \u94fe\u63a5\u8981\u6c42
- \u94fe\u63a5\u6837\u5f0f: \u7edf\u4e00\u4f7f\u7528 markdown \u683c\u5f0f\uff1a[\u951a\u6587\u672c](URL)
- \u5d4c\u5165\u65b9\u5f0f: \u94fe\u63a5\u5fc5\u987b\u81ea\u7136\u878d\u5165\u53e5\u5b50\u4e2d

# \u9700\u8981\u64b0\u5199 ${t.length} \u4e2a\u8d44\u4ea7\u7684\u8bc4\u8bba

${a.map((e,t)=>`
## \u8d44\u4ea7 ${t+1}
- \u4ea7\u54c1\u540d\u79f0: ${e.name}
- \u7f51\u7ad9: ${e.url}
- \u951a\u6587\u672c: ${e.anchor}
- \u4ea7\u54c1\u63cf\u8ff0: ${e.description}
`).join("\n")}

# \u8f93\u51fa\u683c\u5f0f\uff08\u53ea\u5141\u8bb8\u8fd9\u4e2a\uff09
\u4f60\u5fc5\u987b\u53ea\u8f93\u51fa JSON\uff0c\u7981\u6b62\u4efb\u4f55\u89e3\u91ca/\u6807\u9898/Markdown/\u4ee3\u7801\u5757\u3002
\u6570\u7ec4\u957f\u5ea6\u5fc5\u987b\u7b49\u4e8e\u8d44\u4ea7\u6570\u91cf\uff0c\u987a\u5e8f\u4e0e\u8d44\u4ea7\u5217\u8868\u4e00\u81f4\u3002

[
  {
    "website_value": "\u8d44\u4ea7\u7f51\u7ad9\u5b8c\u6574URL\uff08\u5fc5\u987b\u51c6\u786e\u4e14\u4e00\u81f4\uff09",
    "comment_body": "\u8bc4\u8bba\u6b63\u6587\uff08\u5305\u542b\u94fe\u63a5\uff09"
  }
]

# \u5f3a\u5236\u89c4\u5219\uff08\u4e0d\u6ee1\u8db3\u89c6\u4e3a\u5931\u8d25\uff09
1) \u53ea\u8f93\u51fa JSON\uff0c\u7981\u6b62\u4f7f\u7528 json \u4ee3\u7801\u5757\u5305\u88f9\uff0c\u7981\u6b62\u591a\u4f59\u6587\u5b57
2) \u8bed\u8a00\u5fc5\u987b\u4e25\u683c\u7b49\u4e8e ${e.language}
3) website_value \u5fc5\u987b\u4e0e\u8d44\u4ea7\u5217\u8868\u4e2d\u7684\u7f51\u7ad9 URL \u5b8c\u5168\u4e00\u81f4\uff08\u5b8c\u6574\u3001\u4e0d\u7f29\u77ed\u3001\u4e0d\u6539\u5199\u3001\u4e0d\u52a0/\u5220\u53c2\u6570\uff09
4) comment_body \u53ea\u80fd\u51fa\u73b0\u4e00\u6b21\u8be5\u8d44\u4ea7 URL\uff0c\u7981\u6b62\u51fa\u73b0\u5176\u5b83 URL/\u57df\u540d
5) \u6bcf\u6761\u8bc4\u8bba\u53ea\u5bf9\u5e94\u4e00\u4e2a\u8d44\u4ea7\uff0c\u4e0d\u80fd\u6df7\u7528\u5176\u4ed6\u8d44\u4ea7\u4fe1\u606f
6) comment_body \u5fc5\u987b\u4f7f\u7528 markdown \u94fe\u63a5\u683c\u5f0f\uff1a[\u951a\u6587\u672c](URL)
7) \u94fe\u63a5\u4f4d\u7f6e\u8981\u6c42\uff1a\u94fe\u63a5\u5fc5\u987b\u81ea\u7136\u878d\u5165\u53e5\u5b50\u4e2d
8) \u5fc5\u987b\u5f15\u7528\u9875\u9762\u6b63\u6587\u91cc\u7684\u5177\u4f53\u7ec6\u8282\uff08\u81f3\u5c111-2\u5904\uff0c\u5305\u542b\u5177\u4f53\u540d\u8bcd/\u6570\u636e/\u6b65\u9aa4/\u672f\u8bed\uff09
9) \u7981\u6b62\u4f7f\u7528\u7f16\u53f7/\u5217\u8868/\u6807\u9898/\u5f15\u7528\u7b49\u683c\u5f0f\u5316\u8f93\u51fa
10) \u7981\u6b62\u8f93\u51fa asset_id / language / debug \u7b49\u591a\u4f59\u5b57\u6bb5

\u73b0\u5728\u5f00\u59cb\u751f\u6210\u8bc4\u8bba:
`.trim();return d}}function d(e){return"string"==typeof e&&e.trim().length>0}function i(e){let t=String(e||"").trim();if(!t)return"";try{let e=new URL(t),s=e.origin.toLowerCase(),r=e.pathname.replace(/\/+$/,""),a=e.search;return`${s}${r}${a}`.replace(/\/+$/,"")}catch{return t.replace(/\/+$/,"").toLowerCase()}}function o(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function n(e){let t=i(e);return t?`${o(t)}\\/?`:""}function l(e){try{let t=JSON.parse(e);if(Array.isArray(t))return t.filter(e=>"string"==typeof e&&e.trim())}catch(e){}return[]}function E(e,t){if(0===e.length)return t;let s=Math.floor(Math.random()*e.length);return e[s]}function c(e,t,s){switch(s){case"a-tag":return`<a href="${e}">${t}</a>`;case"bbcode":return`[url=${e}]${t}[/url]`;case"markdown":return`[${t}](${e})`;default:return e}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"f6DG4"}]},["kgW6q"],"kgW6q","parcelRequirece9f"),globalThis.define=t;