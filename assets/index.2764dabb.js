import{v as _,o as c,c as u,a as l,n as d,r as m,t as b,w as k,b as v,u as f,d as E,e as T,f as $,g as B,h as g,i as y,F as L,j as R,k as A,l as I}from"./vendor.34c8f4a0.js";const S=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function s(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(t){if(t.ep)return;t.ep=!0;const n=s(t);fetch(t.href,n)}};S();function O(e={}){const{immediate:i=!1,onNeedRefresh:s,onOfflineReady:r,onRegistered:t,onRegisterError:n}=e;let o;const p=async(a=!0)=>{};return"serviceWorker"in navigator&&(o=new _("/vue-calculator/sw.js",{scope:"/vue-calculator/"}),o.addEventListener("activated",a=>{a.isUpdate?window.location.reload():r==null||r()}),o.register({immediate:i}).then(a=>{t==null||t(a)}).catch(a=>{n==null||n(a)})),p}var x=(e,i)=>{for(const[s,r]of i)e[s]=r;return e};const D={class:"switch-wrap"},W={props:{isDarkTheme:{type:Boolean,required:!0}},emits:["changeTheme"],setup(e){return(i,s)=>(c(),u("div",D,[l("div",{class:d(["switch",{active:e.isDarkTheme,inactive:!e.isDarkTheme}]),onClick:s[0]||(s[0]=r=>i.$emit("changeTheme",!e.isDarkTheme))},null,2)]))}};var N=x(W,[["__scopeId","data-v-4fd169e4"]]);const P={class:"input"},C={props:{showAnimation:{type:Boolean,required:!0},showResult:{type:Boolean,required:!0},expression:{type:String,required:!0},result:{type:[Number,String],required:!0}},setup(e){const i=e,s=m(null),r=m(null),{expression:t,showResult:n}=b(i);return k(t,async()=>{const o=s.value;await E(),o&&o.scrollWidth>o.clientWidth&&(o.scrollLeft=o.scrollWidth-o.clientWidth)}),k(n,async()=>{const o=r.value;await E(),o&&o.scrollWidth>o.clientWidth&&(o.scrollLeft=o.scrollWidth-o.clientWidth)}),(o,p)=>(c(),u("div",P,[l("div",{ref_key:"refExpression",ref:r,class:d(["expression",{animate:e.showAnimation}])},[l("span",null,v(f(n)?f(t):""),1)],2),l("div",{ref_key:"refResult",ref:s,class:d(["result",{animate:e.showAnimation}])},[l("span",null,v(f(n)||!f(t)?e.result:f(t)),1)],2)]))}};var q=x(C,[["__scopeId","data-v-b6f830be"]]);const M={props:{btn:{type:String,required:!0}},emits:["pressBtn"],setup(e,{emit:i}){const s=e;B(a=>({"90412e80":t}));const r=m(null),t="100ms";let n=null;T(()=>{window.addEventListener("keydown",o)}),$(()=>{window.removeEventListener("keydown",o)});function o(a){const h=a.key.toLowerCase();switch(s.btn===h&&p(),h){case"*":s.btn==="\xD7"&&p();break;case"/":s.btn==="\xF7"&&p();break;case"enter":s.btn==="="&&p();break;case"escape":s.btn==="AC"&&p();break}}function p(){i("pressBtn",s.btn),r.value.classList.add("animate"),n&&clearTimeout(n),n=setTimeout(()=>{r.value.classList.remove("animate")},t.slice(0,-2))}return(a,h)=>(c(),u("div",{ref_key:"refBtn",ref:r,class:d([{operator:/\+|\-|\×|\÷|\=/.test(e.btn),equal:e.btn==="=",zero:e.btn==="0",symbol:/[^+\-×÷=\d\.]/.test(e.btn)},"btn"]),onPointerdown:p},[l("div",{class:d(["btn-content",{backspace:e.btn==="backspace"}])},v(e.btn==="backspace"?"":e.btn),3)],34))}};var F=x(M,[["__scopeId","data-v-25ee3f3b"]]);const w=/\d(\.\d+)?[Ee][+-]\d+/g,j={name:"App",components:{Switch:N,Input:q,Button:F},data:()=>({btnList:["AC","\xB1","%","\xF7","(",")","backspace","\xD7","7","8","9","-","4","5","6","+","1","2","3","=","0","."],expression:"",prevExpression:"",operand:"",operator:"",result:0,showResult:!1,showAnimation:!1,isDarkTheme:!1}),mounted(){window.matchMedia&&(window.matchMedia("(prefers-color-scheme: dark)").matches&&(this.isDarkTheme=!0),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",this.changeTheme))},beforeUnmount(){window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change",this.changeTheme)},methods:{changeTheme(e){this.isDarkTheme=e.matches},pressBtn(e){const i=this.showResult;if(this.showResult){if(e==="="){this.animate();return}this.result.toString()&&isFinite(this.result)?this.expression=this.result.toString():this.expression="",this.prevExpression=this.operand=this.operator="",this.result=0,this.showResult=!1}if(e==="AC"){this.prevExpression=this.operand=this.operator=this.expression="",this.result=0;return}if(e==="\xB1"){i&&(this.operand=this.expression),this.negate();return}if(e==="%"){if(i&&(this.operand=this.expression),!this.operand)return;this.operand=`${this.precise(+this.operand*.01)}`,this.expression=this.prevExpression+this.operand;return}if(e==="backspace"){if(!this.expression)return;this.backspace();return}if(e==="="){if(this.expression||(this.expression="0"),this.expression&&this.expression.match(/\(/g)){const s=this.expression.match(/\(/g).length,r=this.expression.match(/\)/g)&&this.expression.match(/\)/g).length;for(let t=0;t<s-r;t++)this.expression+=")"}this.result=this.compute(this.splitTokens()),!this.result&&this.result!==0&&(this.result="Error"),this.showResult=!0,this.animate();return}/\d|\./.test(e)?this.appendOperand(e):/\(|\)/.test(e)?this.appendParentheses(e):this.appendOperator(e)},animate(){this.showAnimation=!0,setTimeout(()=>{this.showAnimation=!1},0)},negate(){if(this.operator==="+"||this.operator==="-")this.operator=this.operator==="+"?"-":"+",this.operand&&(this.prevExpression=this.prevExpression.slice(0,-1)+this.operator);else{if(!(+this.operand||/^(-?0)$/.test(this.operand)))return;this.operand=`${-this.operand}`}this.expression=this.prevExpression+(this.operand?this.operand:this.operator)},backspace(){let e,i,s;for(;(e=w.exec(this.expression))!==null;)i=e[0],s=w.lastIndex;s===this.expression.length?(this.operand="",this.expression=this.expression.slice(0,0-i.length)):(this.operand=this.operand.slice(0,-1),this.expression=this.expression.slice(0,-1)),/\(|\)/.test(this.expression.slice(-1))?this.prevExpression=this.expression:/[^\d.]/.test(this.expression.slice(-1))?this.prevExpression=this.expression.slice(0,-1):(s===this.expression.length?this.operand=i:this.operand=this.expression.split(/[^\d.]/g).filter(r=>r).slice(-1)[0]||"",this.prevExpression=this.expression.slice(0,this.operand?0-this.operand.length:0),this.prevExpression.slice(-1)==="-"&&/[^\d.]/.test(this.prevExpression.slice(-2,-1))&&(this.operand=`-${this.operand}`,this.prevExpression=this.prevExpression.slice(0,-1))),this.operator=this.operand?this.prevExpression.slice(-1):this.expression.slice(-1),/\(|\)/.test(this.operator)&&(this.operator="")},appendParentheses(e){if(e===")"){if(this.expression&&this.expression.match(/\(/g)){const i=this.expression.match(/\(/g).length,s=this.expression.match(/\)/g)&&this.expression.match(/\)/g).length;i>s&&(this.expression=this.expression+e)}}else/\d|\)/.test(this.expression.slice(-1))&&(this.expression+="\xD7"),this.expression=this.expression+e;this.prevExpression=this.expression,this.operand=this.operator=""},appendOperand(e){if(w.test(this.operand)&&(this.operand=""),/\d|\)/.test(this.prevExpression.slice(-1))&&(this.prevExpression=this.expression),this.prevExpression.slice(-1)===")"&&(this.prevExpression+="\xD7"),/\d/.test(e))this.operand=`${+this.operand||/\.|^-$/.test(this.operand)?this.operand:this.operand==="-0"?"-":""}${e}`;else{if(/\./.test(this.operand))return;this.operand=`${/^(-|-0)$/.test(this.operand)?"-0":+this.operand}${e}`}this.expression=this.prevExpression+this.operand},appendOperator(e){this.expression||(this.prevExpression="0"),(!this.prevExpression||/[^\d.)]/.test(this.prevExpression.slice(-1)))&&(!this.operand&&!this.prevExpression?this.prevExpression=this.expression:Number.isNaN(+this.operand)?this.prevExpression=this.prevExpression.slice(0,-1):this.prevExpression=this.prevExpression+`${+this.operand}`),this.operand="",this.operator=e,this.expression=this.prevExpression+this.operator},splitTokens(){const e=[],i=/(\d(\.\d+)?[Ee][+-]\d+)|(([1-9]+\d*)|0)(\.\d+)?|\(|\)/g;let s,r=0,t=-1;for(;(s=i.exec(this.expression))!==null;)t!==-1&&(e.push(this.expression.slice(t,r)),t=-1),(!(s.index-1)||/[^\d)]/.test(this.expression[s.index-2]))&&this.expression[s.index-1]==="-"?t=s.index-1:(r!==s.index&&e.push(this.expression.slice(r,s.index)),e.push(this.expression.slice(s.index,i.lastIndex))),t!==-1&&r!==t&&e.push(this.expression.slice(r,t)),r=i.lastIndex;const n=this.expression.slice(t!==-1?t:r);return n&&e.push(n),i.test(e[e.length-1])||e.pop(),e},compute(e){if(e.length===1)return+e[0];const i=(t,n)=>!(/\(|\)/.test(n)||/÷|×/.test(t)&&/\+|-/.test(n)),s=[],r=[];for(const t of e){if(/[\d]/.test(t)){s.push(+t);continue}if(t==="("){r.push(t);continue}if(t===")"){for(;r[r.length-1]!=="(";)s.push(this.applyOp(r.pop(),s.pop(),s.pop()));r.pop();continue}for(;r.length>0&&i(t,r[r.length-1]);)s.push(this.applyOp(r.pop(),s.pop(),s.pop()));r.push(t)}for(;r.length>0;)s.push(this.applyOp(r.pop(),s.pop(),s.pop()));return s.pop()},applyOp(e,i,s){switch(s=+s,i=+i,e){case"+":return this.precise(s+i);case"-":return this.precise(s-i);case"\xD7":return this.precise(s*i);case"\xF7":return this.precise(s/i)}return 0},precise(e){const i=+e.toPrecision(8);return`${i}`.length>=8?i.toExponential():i}}},U={class:"main-content"},V={class:"calculator"};function z(e,i,s,r,t,n){const o=g("Switch"),p=g("Input"),a=g("Button");return c(),u("div",{class:d(["app-container",{"dark-theme":e.isDarkTheme,"light-theme":!e.isDarkTheme}])},[l("div",U,[l("div",V,[y(o,{"is-dark-theme":e.isDarkTheme,onChangeTheme:i[0]||(i[0]=h=>e.isDarkTheme=h)},null,8,["is-dark-theme"]),y(p,{"show-animation":e.showAnimation,"show-result":e.showResult,expression:e.expression,result:e.result},null,8,["show-animation","show-result","expression","result"]),(c(!0),u(L,null,R(e.btnList,h=>(c(),A(a,{key:h,btn:h,onPressBtn:n.pressBtn},null,8,["btn","onPressBtn"]))),128))])])],2)}var K=x(j,[["render",z]]);const G=60*60*1e3,H=O({onRegistered(e){e&&setInterval(()=>{e.update()},G)}});I(K).mount("#app");H();
