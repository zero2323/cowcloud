"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
if(typeof module!="undefined"&&module.exports)module.exports=sjcl;
sjcl.cipher.aes=function(a){this.p[0][0][0]||this.M();var b,c,d,e,f=this.p[0][4],g=this.p[1];b=a.length;var h=1;if(b!==4&&b!==6&&b!==8)throw new sjcl.exception.invalid("invalid aes key size");this.c=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(a%b===0||b===8&&a%b===4){c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255];if(a%b===0){c=c<<8^c>>>24^h<<24;h=h<<1^(h>>7)*283}}d[a]=d[a-b]^c}for(b=0;a;b++,a--){c=d[b&3?a:a-4];e[b]=a<=4||b<4?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^
g[3][f[c&255]]}};
sjcl.cipher.aes.prototype={encrypt:function(a){return this.U(a,0)},decrypt:function(a){return this.U(a,1)},p:[[[],[],[],[],[]],[[],[],[],[],[]]],M:function(){var a=this.p[0],b=this.p[1],c=a[4],d=b[4],e,f,g,h=[],i=[],j,k,l,m;for(e=0;e<0x100;e++)i[(h[e]=e<<1^(e>>7)*283)^e]=e;for(f=g=0;!c[f];f^=j||1,g=i[g]||1){l=g^g<<1^g<<2^g<<3^g<<4;l=l>>8^l&255^99;c[f]=l;d[l]=f;k=h[e=h[j=h[f]]];m=k*0x1010101^e*0x10001^j*0x101^f*0x1010100;k=h[l]*0x101^l*0x1010100;for(e=0;e<4;e++){a[e][f]=k=k<<24^k>>>8;b[e][l]=m=m<<24^m>>>8}}for(e=
0;e<5;e++){a[e]=a[e].slice(0);b[e]=b[e].slice(0)}},U:function(a,b){if(a.length!==4)throw new sjcl.exception.invalid("invalid aes block size");var c=this.c[b],d=a[0]^c[0],e=a[b?3:1]^c[1],f=a[2]^c[2];a=a[b?1:3]^c[3];var g,h,i,j=c.length/4-2,k,l=4,m=[0,0,0,0];g=this.p[b];var n=g[0],o=g[1],p=g[2],q=g[3],r=g[4];for(k=0;k<j;k++){g=n[d>>>24]^o[e>>16&255]^p[f>>8&255]^q[a&255]^c[l];h=n[e>>>24]^o[f>>16&255]^p[a>>8&255]^q[d&255]^c[l+1];i=n[f>>>24]^o[a>>16&255]^p[d>>8&255]^q[e&255]^c[l+2];a=n[a>>>24]^o[d>>16&
255]^p[e>>8&255]^q[f&255]^c[l+3];l+=4;d=g;e=h;f=i}for(k=0;k<4;k++){m[b?3&-k:k]=r[d>>>24]<<24^r[e>>16&255]<<16^r[f>>8&255]<<8^r[a&255]^c[l++];g=d;d=e;e=f;f=a;a=g}return m}};
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.fa(a.slice(b/32),32-(b&31)).slice(1);return c===undefined?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(a.length===0||b.length===0)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return d===32?a.concat(b):sjcl.bitArray.fa(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;
if(b===0)return 0;return(b-1)*32+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(a.length*32<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;if(c>0&&b)a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1);return a},partial:function(a,b,c){if(a===32)return b;return(c?b|0:b<<32-a)+a*0x10000000000},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return false;var c=0,d;for(d=0;d<a.length;d++)c|=
a[d]^b[d];return c===0},fa:function(a,b,c,d){var e;e=0;if(d===undefined)d=[];for(;b>=32;b-=32){d.push(c);c=0}if(b===0)return d.concat(a);for(e=0;e<a.length;e++){d.push(c|a[e]>>>b);c=a[e]<<32-b}e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,b+a>32?c:d.pop(),1));return d},m:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++){if((d&3)===0)e=a[d/4];b+=String.fromCharCode(e>>>24);e<<=8}return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++){d=d<<8|a.charCodeAt(c);if((c&3)===3){b.push(d);d=0}}c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,d*4)}};
sjcl.codec.base64={R:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.R,g=0,h=sjcl.bitArray.bitLength(a);if(c)f=f.substr(0,62)+"-_";for(c=0;d.length*6<h;){d+=f.charAt((g^a[c]>>>e)>>>26);if(e<6){g=a[c]<<6-e;e+=26;c++}else{g<<=6;e-=6}}for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d=0,e=sjcl.codec.base64.R,f=0,g;if(b)e=e.substr(0,62)+"-_";for(b=0;b<a.length;b++){g=e.indexOf(a.charAt(b));
if(g<0)throw new sjcl.exception.invalid("this isn't base64!");if(d>26){d-=26;c.push(f^g>>>d);f=g<<32-d}else{d+=6;f^=g<<32-d}}d&56&&c.push(sjcl.bitArray.partial(d&56,f,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};
sjcl.codec.bytes={fromBits:function(a){var b=[],c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++){if((d&3)===0)e=a[d/4];b.push(e>>>24);e<<=8}return b},toBits:function(a){var b=[],c,d=0;for(c=0;c<a.length;c++){d=d<<8|a[c];if((c&3)===3){b.push(d);d=0}}c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};sjcl.hash.sha256=function(a){this.c[0]||this.M();if(a){this.h=a.h.slice(0);this.e=a.e.slice(0);this.d=a.d}else this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.h=this.w.slice(0);this.e=[];this.d=0;return this},update:function(a){if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);var b,c=this.e=sjcl.bitArray.concat(this.e,a);b=this.d;a=this.d=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)this.q(c.splice(0,16));return this},finalize:function(){var a,b=this.e,c=this.h;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.d/
4294967296));for(b.push(this.d|0);b.length;)this.q(b.splice(0,16));this.reset();return c},w:[],c:[],M:function(){function a(e){return(e-Math.floor(e))*0x100000000|0}var b=0,c=2,d;a:for(;b<64;c++){for(d=2;d*d<=c;d++)if(c%d===0)continue a;if(b<8)this.w[b]=a(Math.pow(c,0.5));this.c[b]=a(Math.pow(c,1/3));b++}},q:function(a){var b,c,d=a.slice(0),e=this.h,f=this.c,g=e[0],h=e[1],i=e[2],j=e[3],k=e[4],l=e[5],m=e[6],n=e[7];for(a=0;a<64;a++){if(a<16)b=d[a];else{b=d[a+1&15];c=d[a+14&15];b=d[a&15]=(b>>>7^b>>>18^
b>>>3^b<<25^b<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+d[a&15]+d[a+9&15]|0}b=b+n+(k>>>6^k>>>11^k>>>25^k<<26^k<<21^k<<7)+(m^k&(l^m))+f[a];n=m;m=l;l=k;k=j+b|0;j=i;i=h;h=g;g=b+(h&i^j&(h^i))+(h>>>2^h>>>13^h>>>22^h<<30^h<<19^h<<10)|0}e[0]=e[0]+g|0;e[1]=e[1]+h|0;e[2]=e[2]+i|0;e[3]=e[3]+j|0;e[4]=e[4]+k|0;e[5]=e[5]+l|0;e[6]=e[6]+m|0;e[7]=e[7]+n|0}};sjcl.hash.sha1=function(a){if(a){this.h=a.h.slice(0);this.e=a.e.slice(0);this.d=a.d}else this.reset()};sjcl.hash.sha1.hash=function(a){return(new sjcl.hash.sha1).update(a).finalize()};
sjcl.hash.sha1.prototype={blockSize:512,reset:function(){this.h=this.w.slice(0);this.e=[];this.d=0;return this},update:function(a){if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);var b,c=this.e=sjcl.bitArray.concat(this.e,a);b=this.d;a=this.d=b+sjcl.bitArray.bitLength(a);for(b=this.blockSize+b&-this.blockSize;b<=a;b+=this.blockSize)this.q(c.splice(0,16));return this},finalize:function(){var a,b=this.e,c=this.h;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);
b.push(Math.floor(this.d/0x100000000));for(b.push(this.d|0);b.length;)this.q(b.splice(0,16));this.reset();return c},w:[1732584193,4023233417,2562383102,271733878,3285377520],c:[1518500249,1859775393,2400959708,3395469782],ja:function(a,b,c,d){if(a<=19)return b&c|~b&d;else if(a<=39)return b^c^d;else if(a<=59)return b&c|b&d|c&d;else if(a<=79)return b^c^d},D:function(a,b){return b<<a|b>>>32-a},q:function(a){var b,c,d,e,f,g,h=a.slice(0),i=this.h;c=i[0];d=i[1];e=i[2];f=i[3];g=i[4];for(a=0;a<=79;a++){if(a>=
16)h[a]=this.D(1,h[a-3]^h[a-8]^h[a-14]^h[a-16]);b=this.D(5,c)+this.ja(a,d,e,f)+g+h[a]+this.c[Math.floor(a/20)]|0;g=f;f=e;e=this.D(30,d);d=c;c=b}i[0]=i[0]+c|0;i[1]=i[1]+d|0;i[2]=i[2]+e|0;i[3]=i[3]+f|0;i[4]=i[4]+g|0}};
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,i=h.bitLength(c)/8,j=h.bitLength(g)/8;e=e||64;d=d||[];if(i<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;f<4&&j>>>8*f;f++);if(f<15-i)f=15-i;c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.T(a,b,c,d,e,f);g=sjcl.mode.ccm.V(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),i=f.clamp(b,h-e),j=f.bitSlice(b,
h-e);h=(h-e)/8;if(g<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;b<4&&h>>>8*b;b++);if(b<15-g)b=15-g;c=f.clamp(c,8*(15-b));i=sjcl.mode.ccm.V(a,i,c,j,e,b);a=sjcl.mode.ccm.T(a,i.data,c,d,e,b);if(!f.equal(i.tag,a))throw new sjcl.exception.corrupt("ccm: tag doesn't match");return i.data},T:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,i=h.m;e/=8;if(e%2||e<4||e>16)throw new sjcl.exception.invalid("ccm: invalid tag length");if(d.length>0xffffffff||b.length>0xffffffff)throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;if(c<=65279)g=[h.partial(16,c)];else if(c<=0xffffffff)g=h.concat([h.partial(16,65534)],[c]);g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(i(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(i(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,e*8)},V:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.m;var i=b.length,j=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!i)return{tag:d,data:[]};for(g=0;g<i;g+=4){c[3]++;e=a.encrypt(c);b[g]^=e[0];b[g+1]^=e[1];b[g+2]^=e[2];b[g+3]^=e[3]}return{tag:d,data:h.clamp(b,j)}}};if(sjcl.beware===undefined)sjcl.beware={};
sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]=function(){sjcl.mode.cbc={name:"cbc",encrypt:function(a,b,c,d){if(d&&d.length)throw new sjcl.exception.invalid("cbc can't authenticate data");if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("cbc iv must be 128 bits");var e=sjcl.bitArray,f=e.m,g=e.bitLength(b),h=0,i=[];if(g&7)throw new sjcl.exception.invalid("pkcs#5 padding only works for multiples of a byte");for(d=0;h+128<=g;d+=4,h+=128){c=a.encrypt(f(c,
b.slice(d,d+4)));i.splice(d,0,c[0],c[1],c[2],c[3])}g=(16-(g>>3&15))*0x1010101;c=a.encrypt(f(c,e.concat(b,[g,g,g,g]).slice(d,d+4)));i.splice(d,0,c[0],c[1],c[2],c[3]);return i},decrypt:function(a,b,c,d){if(d&&d.length)throw new sjcl.exception.invalid("cbc can't authenticate data");if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("cbc iv must be 128 bits");if(sjcl.bitArray.bitLength(b)&127||!b.length)throw new sjcl.exception.corrupt("cbc ciphertext must be a positive multiple of the block size");
var e=sjcl.bitArray,f=e.m,g,h=[];for(d=0;d<b.length;d+=4){g=b.slice(d,d+4);c=f(c,a.decrypt(g));h.splice(d,0,c[0],c[1],c[2],c[3]);c=g}g=h[d-1]&255;if(g==0||g>16)throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");c=g*0x1010101;if(!e.equal(e.bitSlice([c,c,c,c],0,g*8),e.bitSlice(h,h.length*32-g*8,h.length*32)))throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");return e.bitSlice(h,0,h.length*32-g*8)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl.mode.ocb2.P,i=sjcl.bitArray,j=i.m,k=[0,0,0,0];c=h(a.encrypt(c));var l,m=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4){l=b.slice(g,g+4);k=j(k,l);m=m.concat(j(c,a.encrypt(j(c,l))));c=h(c)}l=b.slice(g);b=i.bitLength(l);g=a.encrypt(j(c,[0,0,0,b]));l=i.clamp(j(l.concat([0,0,0]),g),b);k=j(k,j(l.concat([0,0,0]),g));k=a.encrypt(j(k,j(c,h(c))));
if(d.length)k=j(k,f?d:sjcl.mode.ocb2.pmac(a,d));return m.concat(i.concat(l,i.clamp(k,e)))},decrypt:function(a,b,c,d,e,f){if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl.mode.ocb2.P,h=sjcl.bitArray,i=h.m,j=[0,0,0,0],k=g(a.encrypt(c)),l,m,n=sjcl.bitArray.bitLength(b)-e,o=[];d=d||[];for(c=0;c+4<n/32;c+=4){l=i(k,a.decrypt(i(k,b.slice(c,c+4))));j=i(j,l);o=o.concat(l);k=g(k)}m=n-c*32;l=a.encrypt(i(k,[0,0,0,m]));l=i(l,h.clamp(b.slice(c),
m).concat([0,0,0]));j=i(j,l);j=a.encrypt(i(j,i(k,g(k))));if(d.length)j=i(j,f?d:sjcl.mode.ocb2.pmac(a,d));if(!h.equal(h.clamp(j,e),h.bitSlice(b,n)))throw new sjcl.exception.corrupt("ocb: tag doesn't match");return o.concat(h.clamp(l,m))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.P,e=sjcl.bitArray,f=e.m,g=[0,0,0,0],h=a.encrypt([0,0,0,0]);h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4){h=d(h);g=f(g,a.encrypt(f(h,b.slice(c,c+4))))}b=b.slice(c);if(e.bitLength(b)<128){h=f(h,d(h));b=e.concat(b,[2147483648|0,0,
0,0])}g=f(g,b);return a.encrypt(f(d(f(h,d(h))),g))},P:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^(a[0]>>>31)*135]}};sjcl.misc.hmac=function(a,b){this.aa=b=b||sjcl.hash.sha256;var c=[[],[]],d=b.prototype.blockSize/32;this.t=[new b,new b];if(a.length>d)a=b.hash(a);for(b=0;b<d;b++){c[0][b]=a[b]^909522486;c[1][b]=a[b]^1549556828}this.t[0].update(c[0]);this.t[1].update(c[1])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a,b){a=(new this.aa(this.t[0])).update(a,b).finalize();return(new this.aa(this.t[1])).update(a).finalize()};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;if(d<0||c<0)throw sjcl.exception.invalid("invalid params to pbkdf2");if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,i,j=[],k=sjcl.bitArray;for(i=1;32*j.length<(d||1);i++){e=f=a.encrypt(k.concat(b,[i]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}j=j.concat(e)}if(d)j=k.clamp(j,d);return j};
sjcl.random={randomWords:function(a,b){var c=[];b=this.isReady(b);var d;if(b===0)throw new sjcl.exception.notReady("generator isn't seeded");else b&2&&this.na(!(b&1));for(b=0;b<a;b+=4){(b+1)%0x10000===0&&this.$();d=this.K();c.push(d[0],d[1],d[2],d[3])}this.$();return c.slice(0,a)},setDefaultParanoia:function(a){this.I=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.C[c],h=this.isReady();d=this.S[c];if(d===undefined)d=this.S[c]=this.ia++;if(g===undefined)g=this.C[c]=0;
this.C[c]=(this.C[c]+1)%this.j.length;switch(typeof a){case "number":break;case "object":if(b===undefined)for(c=b=0;c<a.length;c++)for(e=a[c];e>0;){b++;e>>>=1}this.j[g].update([d,this.Y++,2,b,f,a.length].concat(a));break;case "string":if(b===undefined)b=a.length;this.j[g].update([d,this.Y++,3,b,f,a.length]);this.j[g].update(a);break;default:throw new sjcl.exception.bug("random: addEntropy only supports number, array or string");}this.s[g]+=b;this.n+=b;if(h===0){this.isReady()!==0&&this.Z("seeded",
Math.max(this.o,this.n));this.Z("progress",this.getProgress())}},isReady:function(a){a=this.Q[a!==undefined?a:this.I];return this.o&&this.o>=a?this.s[0]>80&&(new Date).valueOf()>this.ea?3:1:this.n>=a?2:0},getProgress:function(a){a=this.Q[a?a:this.I];return this.o>=a?1["0"]:this.n>a?1["0"]:this.n/a},startCollectors:function(){if(!this.u){if(window.addEventListener){window.addEventListener("load",this.A,false);window.addEventListener("mousemove",this.B,false)}else if(document.attachEvent){document.attachEvent("onload",
this.A);document.attachEvent("onmousemove",this.B)}else throw new sjcl.exception.bug("can't attach event");this.u=true}},stopCollectors:function(){if(this.u){if(window.removeEventListener){window.removeEventListener("load",this.A,false);window.removeEventListener("mousemove",this.B,false)}else if(window.detachEvent){window.detachEvent("onload",this.A);window.detachEvent("onmousemove",this.B)}this.u=false}},addEventListener:function(a,b){this.F[a][this.ha++]=b},removeEventListener:function(a,b){var c;
a=this.F[a];var d=[];for(c in a)a.hasOwnProperty(c)&&a[c]===b&&d.push(c);for(b=0;b<d.length;b++){c=d[b];delete a[c]}},j:[new sjcl.hash.sha256],s:[0],O:0,C:{},Y:0,S:{},ia:0,o:0,n:0,ea:0,c:[0,0,0,0,0,0,0,0],l:[0,0,0,0],H:undefined,I:6,u:false,F:{progress:{},seeded:{}},ha:0,Q:[0,48,64,96,128,192,0x100,384,512,768,1024],K:function(){for(var a=0;a<4;a++){this.l[a]=this.l[a]+1|0;if(this.l[a])break}return this.H.encrypt(this.l)},$:function(){this.c=this.K().concat(this.K());this.H=new sjcl.cipher.aes(this.c)},
ma:function(a){this.c=sjcl.hash.sha256.hash(this.c.concat(a));this.H=new sjcl.cipher.aes(this.c);for(a=0;a<4;a++){this.l[a]=this.l[a]+1|0;if(this.l[a])break}},na:function(a){var b=[],c=0,d;this.ea=b[0]=(new Date).valueOf()+3E4;for(d=0;d<16;d++)b.push(Math.random()*0x100000000|0);for(d=0;d<this.j.length;d++){b=b.concat(this.j[d].finalize());c+=this.s[d];this.s[d]=0;if(!a&&this.O&1<<d)break}if(this.O>=1<<this.j.length){this.j.push(new sjcl.hash.sha256);this.s.push(0)}this.n-=c;if(c>this.o)this.o=c;this.O++;
this.ma(b)},B:function(a){sjcl.random.addEntropy([a.x||a.clientX||a.offsetX,a.y||a.clientY||a.offsetY],2,"mouse")},A:function(){sjcl.random.addEntropy(new Date,2,"loadtime")},Z:function(a,b){var c;a=sjcl.random.F[a];var d=[];for(c in a)a.hasOwnProperty(c)&&d.push(a[c]);for(c=0;c<d.length;c++)d[c](b)}};try{var s=new Uint32Array(32);crypto.getRandomValues(s);sjcl.random.addEntropy(s,1024,"crypto['getRandomValues']")}catch(t){}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},encrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.k({iv:sjcl.random.randomWords(4,0)},e.defaults);e.k(f,c);if(typeof f.salt==="string")f.salt=sjcl.codec.base64.toBits(f.salt);if(typeof f.iv==="string")f.iv=sjcl.codec.base64.toBits(f.iv);if(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||typeof a==="string"&&f.iter<=100||f.ts!==64&&f.ts!==96&&f.ts!==128||f.ks!==128&&f.ks!==192&&f.ks!==0x100||f.iv.length<2||f.iv.length>
4)throw new sjcl.exception.invalid("json encrypt: invalid parameters");if(typeof a==="string"){c=sjcl.misc.cachedPbkdf2(a,f);a=c.key.slice(0,f.ks/32);f.salt=c.salt}if(typeof b==="string")b=sjcl.codec.utf8String.toBits(b);c=new sjcl.cipher[f.cipher](a);e.k(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(c,b,f.iv,f.adata,f.ts);return e.encode(e.oa(f,e.defaults))},decrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.k(e.k(e.k({},e.defaults),e.decode(b)),c,true);if(typeof b.salt==="string")b.salt=
sjcl.codec.base64.toBits(b.salt);if(typeof b.iv==="string")b.iv=sjcl.codec.base64.toBits(b.iv);if(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||typeof a==="string"&&b.iter<=100||b.ts!==64&&b.ts!==96&&b.ts!==128||b.ks!==128&&b.ks!==192&&b.ks!==0x100||!b.iv||b.iv.length<2||b.iv.length>4)throw new sjcl.exception.invalid("json decrypt: invalid parameters");if(typeof a==="string"){c=sjcl.misc.cachedPbkdf2(a,b);a=c.key.slice(0,b.ks/32);b.salt=c.salt}c=new sjcl.cipher[b.cipher](a);c=sjcl.mode[b.mode].decrypt(c,
b.ct,b.iv,b.adata,b.ts);e.k(d,b);d.key=a;return sjcl.codec.utf8String.fromBits(c)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl.exception.invalid("json encode: invalid property name");c+=d+'"'+b+'":';d=",";switch(typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],1)+'"';break;default:throw new sjcl.exception.bug("json encode: unsupported type");
}}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");if(!a.match(/^\{.*\}$/))throw new sjcl.exception.invalid("json decode: this isn't json!");a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i)))throw new sjcl.exception.invalid("json decode: this isn't json!");b[d[2]]=d[3]?parseInt(d[3],10):d[2].match(/^(ct|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4])}return b},k:function(a,
b,c){if(a===undefined)a={};if(b===undefined)return a;var d;for(d in b)if(b.hasOwnProperty(d)){if(c&&a[d]!==undefined&&a[d]!==b[d])throw new sjcl.exception.invalid("required parameter overridden");a[d]=b[d]}return a},oa:function(a,b){var c={},d;for(d in a)if(a.hasOwnProperty(d)&&a[d]!==b[d])c[d]=a[d];return c},pa:function(a,b){var c={},d;for(d=0;d<b.length;d++)if(a[b[d]]!==undefined)c[b[d]]=a[b[d]];return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.la={};
sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.la,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===undefined?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};sjcl.bn=function(a){this.initWith(a)};
sjcl.bn.prototype={radix:24,maxMul:8,f:sjcl.bn,copy:function(){return new this.f(this)},initWith:function(a){var b=0,c;switch(typeof a){case "object":this.limbs=a.limbs.slice(0);break;case "number":this.limbs=[a];this.normalize();break;case "string":a=a.replace(/^0x/,"");this.limbs=[];c=this.radix/4;for(b=0;b<a.length;b+=c)this.limbs.push(parseInt(a.substring(Math.max(a.length-b-c,0),a.length-b),16));break;default:this.limbs=[0]}return this},equals:function(a){if(typeof a==="number")a=new this.f(a);
var b=0,c;this.fullReduce();a.fullReduce();for(c=0;c<this.limbs.length||c<a.limbs.length;c++)b|=this.getLimb(c)^a.getLimb(c);return b===0},getLimb:function(a){return a>=this.limbs.length?0:this.limbs[a]},greaterEquals:function(a){if(typeof a==="number")a=new this.f(a);var b=0,c=0,d,e,f;for(d=Math.max(this.limbs.length,a.limbs.length)-1;d>=0;d--){e=this.getLimb(d);f=a.getLimb(d);c|=f-e&~b;b|=e-f&~c}return(c|~b)>>>31},toString:function(){this.fullReduce();var a="",b,c,d=this.limbs;for(b=0;b<this.limbs.length;b++){for(c=
d[b].toString(16);b<this.limbs.length-1&&c.length<6;)c="0"+c;a=c+a}return"0x"+a},addM:function(a){if(typeof a!=="object")a=new this.f(a);var b=this.limbs,c=a.limbs;for(a=b.length;a<c.length;a++)b[a]=0;for(a=0;a<c.length;a++)b[a]+=c[a];return this},doubleM:function(){var a,b=0,c,d=this.radix,e=this.radixMask,f=this.limbs;for(a=0;a<f.length;a++){c=f[a];c=c+c+b;f[a]=c&e;b=c>>d}b&&f.push(b);return this},halveM:function(){var a,b=0,c,d=this.radix,e=this.limbs;for(a=e.length-1;a>=0;a--){c=e[a];e[a]=c+b>>
1;b=(c&1)<<d}e[e.length-1]||e.pop();return this},subM:function(a){if(typeof a!=="object")a=new this.f(a);var b=this.limbs,c=a.limbs;for(a=b.length;a<c.length;a++)b[a]=0;for(a=0;a<c.length;a++)b[a]-=c[a];return this},mod:function(a){a=(new sjcl.bn(a)).normalize();for(var b=(new sjcl.bn(this)).normalize(),c=0;b.greaterEquals(a);c++)a.doubleM();for(;c>0;c--){a.halveM();b.greaterEquals(a)&&b.subM(a).normalize()}return b.trim()},inverseMod:function(a){var b=new sjcl.bn(1),c=new sjcl.bn(0),d=new sjcl.bn(this),
e=new sjcl.bn(a),f,g=1;if(!(a.limbs[0]&1))throw new sjcl.exception.invalid("inverseMod: p must be odd");do{if(d.limbs[0]&1){if(!d.greaterEquals(e)){f=d;d=e;e=f;f=b;b=c;c=f}d.subM(e);d.normalize();b.greaterEquals(c)||b.addM(a);b.subM(c)}d.halveM();b.limbs[0]&1&&b.addM(a);b.normalize();b.halveM();for(f=g=0;f<d.limbs.length;f++)g|=d.limbs[f]}while(g);if(!e.equals(1))throw new sjcl.exception.invalid("inverseMod: p and x must be relatively prime");return c},add:function(a){return this.copy().addM(a)},
sub:function(a){return this.copy().subM(a)},mul:function(a){if(typeof a==="number")a=new this.f(a);var b,c=this.limbs,d=a.limbs,e=c.length,f=d.length,g=new this.f,h=g.limbs,i,j=this.maxMul;for(b=0;b<this.limbs.length+a.limbs.length+1;b++)h[b]=0;for(b=0;b<e;b++){i=c[b];for(a=0;a<f;a++)h[b+a]+=i*d[a];if(!--j){j=this.maxMul;g.cnormalize()}}return g.cnormalize().reduce()},square:function(){return this.mul(this)},power:function(a){if(typeof a==="number")a=[a];else if(a.limbs!==undefined)a=a.normalize().limbs;
var b,c,d=new this.f(1),e=this;for(b=0;b<a.length;b++)for(c=0;c<this.radix;c++){if(a[b]&1<<c)d=d.mul(e);e=e.square()}return d},mulmod:function(a,b){return this.mod(b).mul(a.mod(b)).mod(b)},powermod:function(a,b){var c=new sjcl.bn(1),d=new sjcl.bn(this);for(a=new sjcl.bn(a);;){if(a.limbs[0]&1)c=c.mulmod(d,b);a.halveM();if(a.equals(0))break;d=d.mulmod(d,b)}return c.normalize().reduce()},trim:function(){var a=this.limbs,b;do b=a.pop();while(a.length&&b===0);a.push(b);return this},reduce:function(){return this},
fullReduce:function(){return this.normalize()},normalize:function(){var a=0,b,c=this.ipv,d,e=this.limbs,f=e.length,g=this.radixMask;for(b=0;b<f||a!==0&&a!==-1;b++){a=(e[b]||0)+a;d=e[b]=a&g;a=(a-d)*c}if(a===-1)e[b-1]-=this.placeVal;return this},cnormalize:function(){var a=0,b,c=this.ipv,d,e=this.limbs,f=e.length,g=this.radixMask;for(b=0;b<f-1;b++){a=e[b]+a;d=e[b]=a&g;a=(a-d)*c}e[b]+=a;return this},toBits:function(a){this.fullReduce();a=a||this.exponent||this.limbs.length*this.radix;var b=Math.floor((a-
1)/24),c=sjcl.bitArray;a=[c.partial((a+7&-8)%this.radix||this.radix,this.getLimb(b))];for(b--;b>=0;b--)a=c.concat(a,[c.partial(this.radix,this.getLimb(b))]);return a},bitLength:function(){this.fullReduce();for(var a=this.radix*(this.limbs.length-1),b=this.limbs[this.limbs.length-1];b;b>>=1)a++;return a+7&-8}};
sjcl.bn.fromBits=function(a){var b=new this,c=[],d=sjcl.bitArray,e=this.prototype,f=Math.min(this.bitLength||0x100000000,d.bitLength(a)),g=f%e.radix||e.radix;for(c[0]=d.extract(a,0,g);g<f;g+=e.radix)c.unshift(d.extract(a,g,e.radix));b.limbs=c;return b};sjcl.bn.prototype.ipv=1/(sjcl.bn.prototype.placeVal=Math.pow(2,sjcl.bn.prototype.radix));sjcl.bn.prototype.radixMask=(1<<sjcl.bn.prototype.radix)-1;
sjcl.bn.pseudoMersennePrime=function(a,b){function c(g){this.initWith(g)}var d=c.prototype=new sjcl.bn,e,f;e=d.modOffset=Math.ceil(f=a/d.radix);d.exponent=a;d.offset=[];d.factor=[];d.minOffset=e;d.fullMask=0;d.fullOffset=[];d.fullFactor=[];d.modulus=c.modulus=new sjcl.bn(Math.pow(2,a));d.fullMask=0|-Math.pow(2,a%d.radix);for(e=0;e<b.length;e++){d.offset[e]=Math.floor(b[e][0]/d.radix-f);d.fullOffset[e]=Math.ceil(b[e][0]/d.radix-f);d.factor[e]=b[e][1]*Math.pow(0.5,a-b[e][0]+d.offset[e]*d.radix);d.fullFactor[e]=
b[e][1]*Math.pow(0.5,a-b[e][0]+d.fullOffset[e]*d.radix);d.modulus.addM(new sjcl.bn(Math.pow(2,b[e][0])*b[e][1]));d.minOffset=Math.min(d.minOffset,-d.offset[e])}d.f=c;d.modulus.cnormalize();d.reduce=function(){var g,h,i,j=this.modOffset,k=this.limbs,l=this.offset,m=this.offset.length,n=this.factor,o;for(g=this.minOffset;k.length>j;){i=k.pop();o=k.length;for(h=0;h<m;h++)k[o+l[h]]-=n[h]*i;g--;if(!g){k.push(0);this.cnormalize();g=this.minOffset}}this.cnormalize();return this};d.ga=d.fullMask===-1?d.reduce:
function(){var g=this.limbs,h=g.length-1,i,j;this.reduce();if(h===this.modOffset-1){j=g[h]&this.fullMask;g[h]-=j;for(i=0;i<this.fullOffset.length;i++)g[h+this.fullOffset[i]]-=this.fullFactor[i]*j;this.normalize()}};d.fullReduce=function(){var g,h;this.ga();this.addM(this.modulus);this.addM(this.modulus);this.normalize();this.ga();for(h=this.limbs.length;h<this.modOffset;h++)this.limbs[h]=0;g=this.greaterEquals(this.modulus);for(h=0;h<this.limbs.length;h++)this.limbs[h]-=this.modulus.limbs[h]*g;this.cnormalize();
return this};d.inverse=function(){return this.power(this.modulus.sub(2))};c.fromBits=sjcl.bn.fromBits;return c};
sjcl.bn.prime={p127:sjcl.bn.pseudoMersennePrime(127,[[0,-1]]),p25519:sjcl.bn.pseudoMersennePrime(255,[[0,-19]]),p192:sjcl.bn.pseudoMersennePrime(192,[[0,-1],[64,-1]]),p224:sjcl.bn.pseudoMersennePrime(224,[[0,1],[96,-1]]),p256:sjcl.bn.pseudoMersennePrime(0x100,[[0,-1],[96,1],[192,1],[224,-1]]),p384:sjcl.bn.pseudoMersennePrime(384,[[0,-1],[32,1],[96,-1],[128,-1]]),p521:sjcl.bn.pseudoMersennePrime(521,[[0,-1]])};
sjcl.bn.random=function(a,b){if(typeof a!=="object")a=new sjcl.bn(a);for(var c,d,e=a.limbs.length,f=a.limbs[e-1]+1,g=new sjcl.bn;;){do{c=sjcl.random.randomWords(e,b);if(c[e-1]<0)c[e-1]+=0x100000000}while(Math.floor(c[e-1]/f)===Math.floor(0x100000000/f));c[e-1]%=f;for(d=0;d<e-1;d++)c[d]&=a.radixMask;g.limbs=c;if(!g.greaterEquals(a))return g}};sjcl.ecc={};sjcl.ecc.point=function(a,b,c){if(b===undefined)this.isIdentity=true;else{this.x=b;this.y=c;this.isIdentity=false}this.curve=a};
sjcl.ecc.point.prototype={toJac:function(){return new sjcl.ecc.pointJac(this.curve,this.x,this.y,new this.curve.field(1))},mult:function(a){return this.toJac().mult(a,this).toAffine()},mult2:function(a,b,c){return this.toJac().mult2(a,this,b,c).toAffine()},multiples:function(){var a,b,c;if(this.da===undefined){c=this.toJac().doubl();a=this.da=[new sjcl.ecc.point(this.curve),this,c.toAffine()];for(b=3;b<16;b++){c=c.add(this);a.push(c.toAffine())}}return this.da},isValid:function(){return this.y.square().equals(this.curve.b.add(this.x.mul(this.curve.a.add(this.x.square()))))},
toBits:function(){return sjcl.bitArray.concat(this.x.toBits(),this.y.toBits())}};sjcl.ecc.pointJac=function(a,b,c,d){if(b===undefined)this.isIdentity=true;else{this.x=b;this.y=c;this.z=d;this.isIdentity=false}this.curve=a};
sjcl.ecc.pointJac.prototype={add:function(a){var b,c,d,e;if(this.curve!==a.curve)throw"sjcl['ecc']['add'](): Points must be on the same curve to add them!";if(this.isIdentity)return a.toJac();else if(a.isIdentity)return this;b=this.z.square();c=a.x.mul(b).subM(this.x);if(c.equals(0))return this.y.equals(a.y.mul(b.mul(this.z)))?this.doubl():new sjcl.ecc.pointJac(this.curve);b=a.y.mul(b.mul(this.z)).subM(this.y);d=c.square();a=b.square();e=c.square().mul(c).addM(this.x.add(this.x).mul(d));a=a.subM(e);
b=this.x.mul(d).subM(a).mul(b);d=this.y.mul(c.square().mul(c));b=b.subM(d);c=this.z.mul(c);return new sjcl.ecc.pointJac(this.curve,a,b,c)},doubl:function(){if(this.isIdentity)return this;var a=this.y.square(),b=a.mul(this.x.mul(4)),c=a.square().mul(8);a=this.z.square();var d=this.x.sub(a).mul(3).mul(this.x.add(a));a=d.square().subM(b).subM(b);b=b.sub(a).mul(d).subM(c);c=this.y.add(this.y).mul(this.z);return new sjcl.ecc.pointJac(this.curve,a,b,c)},toAffine:function(){if(this.isIdentity||this.z.equals(0))return new sjcl.ecc.point(this.curve);
var a=this.z.inverse(),b=a.square();return new sjcl.ecc.point(this.curve,this.x.mul(b).fullReduce(),this.y.mul(b.mul(a)).fullReduce())},mult:function(a,b){if(typeof a==="number")a=[a];else if(a.limbs!==undefined)a=a.normalize().limbs;var c,d=(new sjcl.ecc.point(this.curve)).toJac(),e=b.multiples();for(b=a.length-1;b>=0;b--)for(c=sjcl.bn.prototype.radix-4;c>=0;c-=4)d=d.doubl().doubl().doubl().doubl().add(e[a[b]>>c&15]);return d},mult2:function(a,b,c,d){if(typeof a==="number")a=[a];else if(a.limbs!==
undefined)a=a.normalize().limbs;if(typeof c==="number")c=[c];else if(c.limbs!==undefined)c=c.normalize().limbs;var e,f=(new sjcl.ecc.point(this.curve)).toJac();b=b.multiples();var g=d.multiples(),h,i;for(d=Math.max(a.length,c.length)-1;d>=0;d--){h=a[d]|0;i=c[d]|0;for(e=sjcl.bn.prototype.radix-4;e>=0;e-=4)f=f.doubl().doubl().doubl().doubl().add(b[h>>e&15]).add(g[i>>e&15])}return f},isValid:function(){var a=this.z.square(),b=a.square();a=b.mul(a);return this.y.square().equals(this.curve.b.mul(a).add(this.x.mul(this.curve.a.mul(b).add(this.x.square()))))}};
sjcl.ecc.curve=function(a,b,c,d,e,f){this.field=a;this.r=a.prototype.modulus.sub(b);this.a=new a(c);this.b=new a(d);this.G=new sjcl.ecc.point(this,new a(e),new a(f))};sjcl.ecc.curve.prototype.fromBits=function(a){var b=sjcl.bitArray,c=this.field.prototype.exponent+7&-8;a=new sjcl.ecc.point(this,this.field.fromBits(b.bitSlice(a,0,c)),this.field.fromBits(b.bitSlice(a,c,2*c)));if(!a.isValid())throw new sjcl.exception.corrupt("not on the curve!");return a};
sjcl.ecc.curves={c192:new sjcl.ecc.curve(sjcl.bn.prime.p192,"0x662107c8eb94364e4b2dd7ce",-3,"0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1","0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012","0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"),c224:new sjcl.ecc.curve(sjcl.bn.prime.p224,"0xe95c1f470fc1ec22d6baa3a3d5c4",-3,"0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4","0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21","0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"),
c256:new sjcl.ecc.curve(sjcl.bn.prime.p256,"0x4319055358e8617b0c46353d039cdaae",-3,"0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b","0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296","0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),c384:new sjcl.ecc.curve(sjcl.bn.prime.p384,"0x389cb27e0bc8d21fa7e5f24cb74f58851313e696333ad68c",-3,"0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef","0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7",
"0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")};
sjcl.ecc.W=function(a){sjcl.ecc[a]={publicKey:function(b,c){this.i=b;this.L=c instanceof Array?b.fromBits(c):c},secretKey:function(b,c){this.i=b;this.J=c},generateKeys:function(b,c){if(b===undefined)b=0x100;if(typeof b==="number"){b=sjcl.ecc.curves["c"+b];if(b===undefined)throw new sjcl.exception.invalid("no such curve");}c=sjcl.bn.random(b.r,c);var d=b.G.mult(c);return{pub:new sjcl.ecc[a].publicKey(b,d),sec:new sjcl.ecc[a].secretKey(b,c)}}}};sjcl.ecc.W("elGamal");
sjcl.ecc.elGamal.publicKey.prototype={kem:function(a){a=sjcl.bn.random(this.i.r,a);var b=this.i.G.mult(a).toBits();return{key:sjcl.hash.sha256.hash(this.L.mult(a).toBits()),tag:b}}};sjcl.ecc.elGamal.secretKey.prototype={unkem:function(a){return sjcl.hash.sha256.hash(this.i.fromBits(a).mult(this.J).toBits())},dh:function(a){return sjcl.hash.sha256.hash(a.L.mult(this.J).toBits())}};sjcl.ecc.W("ecdsa");
sjcl.ecc.ecdsa.secretKey.prototype={sign:function(a,b){var c=this.i.r,d=c.bitLength(),e=sjcl.bn.random(c.sub(1),b).add(1);b=this.i.G.mult(e).x.mod(c);a=sjcl.bn.fromBits(a).add(b.mul(this.J)).inverseMod(c).mul(e).mod(c);return sjcl.bitArray.concat(b.toBits(d),a.toBits(d))}};
sjcl.ecc.ecdsa.publicKey.prototype={verify:function(a,b){var c=sjcl.bitArray,d=this.i.r,e=d.bitLength(),f=sjcl.bn.fromBits(c.bitSlice(b,0,e));b=sjcl.bn.fromBits(c.bitSlice(b,e,2*e));a=sjcl.bn.fromBits(a).mul(b).mod(d);c=f.mul(b).mod(d);a=this.i.G.mult2(a,c,this.L).x;if(f.equals(0)||b.equals(0)||f.greaterEquals(d)||b.greaterEquals(d)||!a.equals(f))throw new sjcl.exception.corrupt("signature didn't check out");return true}};
sjcl.keyexchange.srp={makeVerifier:function(a,b,c,d){a=this.makeX(a,b,c);a=sjcl.bn.fromBits(a);return d.g.powermod(a,d.N)},makeX:function(a,b,c){a=sjcl.hash.sha1.hash(a+":"+b);return sjcl.hash.sha1.hash(sjcl.bitArray.concat(c,a))},knownGroup:function(a){if(typeof a!=="string")a=a.toString();this.X||this.ka();return this.ca[a]},X:false,ka:function(){var a,b;for(a=0;a<this.ba.length;a++){b=this.ba[a].toString();b=this.ca[b];b.N=new sjcl.bn(b.N);b.g=new sjcl.bn(b.g)}this.X=true},ba:[1024,1536,2048],
ca:{"1024":{N:"EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE48E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B297BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9AFD5138FE8376435B9FC61D2FC0EB06E3",g:2},"1536":{N:"9DEF3CAFB939277AB1F12A8617A47BBBDBA51DF499AC4C80BEEEA9614B19CC4D5F4F5F556E27CBDE51C6A94BE4607A291558903BA0D0F84380B655BB9A22E8DCDF028A7CEC67F0D08134B1C8B97989149B609E0BE3BAB63D47548381DBC5B1FC764E3F4B53DD9DA1158BFD3E2B9C8CF56EDF019539349627DB2FD53D24B7C48665772E437D6C7F8CE442734AF7CCB7AE837C264AE3A9BEB87F8A2FE9B8B5292E5A021FFF5E91479E8CE7A28C2442C6F315180F93499A234DCF76E3FED135F9BB",
g:2},"2048":{N:"AC6BDB41324A9A9BF166DE5E1389582FAF72B6651987EE07FC3192943DB56050A37329CBB4A099ED8193E0757767A13DD52312AB4B03310DCD7F48A9DA04FD50E8083969EDB767B0CF6095179A163AB3661A05FBD5FAAAE82918A9962F0B93B855F97993EC975EEAA80D740ADBF4FF747359D041D5C33EA71D281E446B14773BCA97B43A23FB801676BD207A436C6481F1D2B9078717461A5B9D32E688F87748544523B524B0D57D5EA77A2775D2ECFA032CFBDBF52FB3786160279004E57AE6AF874E7303CE53299CCC041C7BC308D82A5698F3A8D0C38271AE35F8E9DBFBB694B5C803D89F7AE435DE236D525F54759B65E372FCD68EF20FA7111F9E4AFF73",
g:2}}};
