if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise((async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]}))},r=(r,c)=>{Promise.all(r.map(e)).then((e=>c(1===e.length?e[0]:e)))},c={require:Promise.resolve(r)};self.define=(r,s,i)=>{c[r]||(c[r]=Promise.resolve().then((()=>{let c={};const a={uri:location.origin+r.slice(1)};return Promise.all(s.map((r=>{switch(r){case"exports":return c;case"module":return a;default:return e(r)}}))).then((e=>{const r=i(...e);return c.default||(c.default=r),c}))})))}}define("./sw.js",["./workbox-65d82760"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.4a4b8b80.js",revision:"c87593527964390b0afb512044e3d7a1"},{url:"assets/index.e5f52726.css",revision:"a5a3c120c6772d272078efcfd55e8e10"},{url:"assets/vendor.849cbb6e.js",revision:"643a17f6a56fd5d4c0e8366e4b46dbaf"},{url:"index.html",revision:"03d3122dfbc949335ff67af14b5c0cf7"},{url:"calculator.ico",revision:"d5db91b6517abede079d20591ba788af"},{url:"robots.txt",revision:"7a3b6f85cda53a90108524b5dfc6c157"},{url:"calculator_120.png",revision:"3924fe4a1d958394b9a8b1f2373c8bab"},{url:"calculator_180.png",revision:"39f65ef3cf8aa4bd6d285ca340b0e451"},{url:"calculator_72.png",revision:"2c03c8189f502b024442015b43d68a18"},{url:"calculator_144.png",revision:"5865146205e043701192b3519500e224"},{url:"calculator_152.png",revision:"f64b49e2d2c6e315929db674d904e4f6"},{url:"calculator_384.png",revision:"008d4de98805b39e300053ee25c59bca"},{url:"calculator_192.png",revision:"42817441890d6f0d43f62f9d654bcb91"},{url:"calculator_256.png",revision:"8bbcc7e53d219633dbced0f0021f678f"},{url:"calculator_512.png",revision:"50668a17c1b513a5203fd66446e367d1"},{url:"manifest.webmanifest",revision:"e3229a8dfd2c2c74ba875b5528742ad7"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
