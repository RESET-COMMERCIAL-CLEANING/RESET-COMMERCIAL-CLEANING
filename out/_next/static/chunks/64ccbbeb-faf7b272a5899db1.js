"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[723],{33863:function(e,t,n){n.d(t,{$:function(){return sR},C:function(){return tn},D:function(){return so},F:function(){return sm},H:function(){return sK},N:function(){return M},Q:function(){return sa},R:function(){return B},U:function(){return _},W:function(){return sk},X:function(){return t0},Y:function(){return sv},Z:function(){return sx},_:function(){return g},a:function(){return R},a0:function(){return nt},a4:function(){return i7},a6:function(){return sh},a7:function(){return tw},a8:function(){return i8},aO:function(){return su},aX:function(){return sg},ac:function(){return se},az:function(){return et},b:function(){return O},c:function(){return eM},d:function(){return b},e:function(){return C},f:function(){return tI},g:function(){return sA},h:function(){return sV},i:function(){return tt},j:function(){return sP},p:function(){return Z},r:function(){return eW},u:function(){return tT},v:function(){return j},w:function(){return J},y:function(){return X},z:function(){return sp}});var r,i,s,a,o=n(93304),l=n(84534),u=n(53172),h=n(18650),c=n(44203);n(62601);var d=n(40263).Buffer;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}f.UNAUTHENTICATED=new f(null),f.GOOGLE_CREDENTIALS=new f("google-credentials-uid"),f.FIRST_PARTY=new f("first-party-uid"),f.MOCK_USER=new f("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let m="12.13.0";function g(e){m=e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let p=new h.Yd("@firebase/firestore");function y(){return p.logLevel}function v(e,...t){if(p.logLevel<=h.in.DEBUG){let n=t.map(T);p.debug(`Firestore (${m}): ${e}`,...n)}}function w(e,...t){if(p.logLevel<=h.in.ERROR){let n=t.map(T);p.error(`Firestore (${m}): ${e}`,...n)}}function E(e,...t){if(p.logLevel<=h.in.WARN){let n=t.map(T);p.warn(`Firestore (${m}): ${e}`,...n)}}function T(e){if("string"==typeof e)return e;try{return JSON.stringify(e)}catch(t){return e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,S(e,r,n)}function S(e,t,n){let r=`FIRESTORE (${m}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(e){r+=" CONTEXT: "+n}throw w(r),Error(r)}function I(e,t,n,r){let i="Unexpected state";"string"==typeof n?i=n:r=n,e||S(t,i,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let C={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class b extends l.ZR{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class k{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(f.UNAUTHENTICATED))}shutdown(){}}class D{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class R{constructor(e){this.t=e,this.currentUser=f.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){I(void 0===this.o,42304);let n=this.i,r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve(),i=new N;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new N,e.enqueueRetryable(()=>r(this.currentUser))};let s=()=>{let t=i;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},a=e=>{v("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(e=>a(e)),setTimeout(()=>{if(!this.auth){let e=this.t.getImmediate({optional:!0});e?a(e):(v("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new N)}},0),s()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(v("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(I("string"==typeof t.accessToken,31837,{l:t}),new A(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){let e=this.auth&&this.auth.getUid();return I(null===e||"string"==typeof e,2055,{h:e}),new f(e)}}class x{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=f.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);let e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class V{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new x(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(f.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class L{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class O{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,(0,o.rh)(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){I(void 0===this.o,3512);let n=e=>{null!=e.error&&v("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);let n=e.token!==this.m;return this.m=e.token,v("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};let r=e=>{v("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){let e=this.V.getImmediate({optional:!0});e?r(e):v("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new L(this.p));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(I("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new L(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{static newId(){let e=62*Math.floor(256/62),t="";for(;t.length<20;){let n=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){let t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let t=0;t<e;t++)n[t]=Math.floor(256*Math.random());return n}(40);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function F(e,t){return e<t?-1:e>t?1:0}function P(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=e.charAt(r),i=t.charAt(r);if(n!==i)return U(n)===U(i)?F(n,i):U(n)?1:-1}return F(e.length,t.length)}function U(e){let t=e.charCodeAt(0);return t>=55296&&t<=57343}function q(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $="__name__";class z{constructor(e,t,n){void 0===t?t=0:t>e.length&&_(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&_(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===z.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof z?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=z.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return F(e.length,t.length)}static compareSegments(e,t){let n=z.isNumericId(e),r=z.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?z.extractNumericId(e).compare(z.extractNumericId(t)):P(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return u.z8.fromString(e.substring(4,e.length-2))}}class B extends z{construct(e,t,n){return new B(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let n of e){if(n.indexOf("//")>=0)throw new b(C.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new B(t)}static emptyPath(){return new B([])}}let K=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class G extends z{construct(e,t,n){return new G(e,t,n)}static isValidIdentifier(e){return K.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),G.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===$}static keyField(){return new G([$])}static fromServerFormat(e){let t=[],n="",r=0,i=()=>{if(0===n.length)throw new b(C.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""},s=!1;for(;r<e.length;){let t=e[r];if("\\"===t){if(r+1===e.length)throw new b(C.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new b(C.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?s=!s:"."!==t||s?n+=t:i(),r++}if(i(),s)throw new b(C.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new G(t)}static emptyPath(){return new G([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e){this.path=e}static fromPath(e){return new j(B.fromString(e))}static fromName(e){return new j(B.fromString(e).popFirst(5))}static empty(){return new j(B.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===B.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return B.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new j(new B(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(e,t,n){if(!n)throw new b(C.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function H(e){if(!j.isDocumentKey(e))throw new b(C.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function W(e){if(j.isDocumentKey(e))throw new b(C.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function Y(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function J(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}return"function"==typeof e?"a function":_(12329,{type:typeof e})}function X(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new b(C.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let n=J(e);throw new b(C.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z(e,t){let n={typeString:e};return t&&(n.value=t),n}function ee(e,t){let n;if(!Y(e))throw new b(C.INVALID_ARGUMENT,"JSON must be an object");for(let r in t)if(t[r]){let i=t[r].typeString,s="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}let a=e[r];if(i&&typeof a!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(void 0!==s&&a!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new b(C.INVALID_ARGUMENT,n);return!0}class et{static now(){return et.fromMillis(Date.now())}static fromDate(e){return et.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3);return new et(t,Math.floor((e-1e3*t)*1e6))}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new b(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800||e>=253402300800)throw new b(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?F(this.nanoseconds,e.nanoseconds):F(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:et._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ee(e,et._jsonSchema))return new et(e.seconds,e.nanoseconds)}valueOf(){return String(this.seconds- -62135596800).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}et._jsonSchemaVersion="firestore/timestamp/1.0",et._jsonSchema={type:Z("string",et._jsonSchemaVersion),seconds:Z("number"),nanoseconds:Z("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{static fromTimestamp(e){return new en(e)}static min(){return new en(new et(0,0))}static max(){return new en(new et(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}class er{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}er.UNKNOWN_ID=-1;class ei{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new ei(en.min(),j.empty(),-1)}static max(){return new ei(en.max(),j.empty(),-1)}}class es{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ea(e){if(e.code!==C.FAILED_PRECONDITION||"The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab."!==e.message)throw e;v("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eo{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&_(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new eo((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{let t=e();return t instanceof eo?t:eo.resolve(t)}catch(e){return eo.reject(e)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):eo.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):eo.reject(t)}static resolve(e){return new eo((t,n)=>{t(e)})}static reject(e){return new eo((t,n)=>{n(e)})}static waitFor(e){return new eo((t,n)=>{let r=0,i=0,s=!1;e.forEach(e=>{++r,e.next(()=>{++i,s&&i===r&&t()},e=>n(e))}),s=!0,i===r&&t()})}static or(e){let t=eo.resolve(!1);for(let n of e)t=t.next(e=>e?eo.resolve(e):n());return t}static forEach(e,t){let n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new eo((n,r)=>{let i=e.length,s=Array(i),a=0;for(let o=0;o<i;o++){let l=o;t(e[l]).next(e=>{s[l]=e,++a===i&&n(s)},e=>r(e))}})}static doWhile(e,t){return new eo((n,r)=>{let i=()=>{!0===e()?t().next(()=>{i()},r):n()};i()})}}function el(e){return"IndexedDbTransactionError"===e.name}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ae(e),this.ue=e=>t.writeSequenceNumber(e))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.ue&&this.ue(e),e}}function eh(e){return 0===e&&1/e==-1/0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ec(e){let t=0;for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function ed(e,t){for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function ef(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}eu.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class em{constructor(e,t){this.comparator=e,this.root=t||ep.EMPTY}insert(e,t){return new em(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ep.BLACK,null,null))}remove(e){return new em(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ep.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){let r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){let e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new eg(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new eg(this.root,e,this.comparator,!1)}getReverseIterator(){return new eg(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new eg(this.root,e,this.comparator,!0)}}class eg{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ep{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:ep.RED,this.left=null!=r?r:ep.EMPTY,this.right=null!=i?i:ep.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new ep(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this,i=n(e,r.key);return(r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n))).fixUp()}removeMin(){if(this.left.isEmpty())return ep.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let n,r=this;if(0>t(e,r.key))r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return ep.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,ep.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,ep.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){return Math.pow(2,this.check())<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw _(43730,{key:this.key,value:this.value});if(this.right.isRed())throw _(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw _(27949);return e+(this.isRed()?0:1)}}ep.EMPTY=null,ep.RED=!0,ep.BLACK=!1,ep.EMPTY=new class{constructor(){this.size=0}get key(){throw _(57766)}get value(){throw _(16141)}get color(){throw _(16727)}get left(){throw _(29726)}get right(){throw _(36894)}copy(e,t,n,r,i){return this}insert(e,t,n){return new ep(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ey{constructor(e){this.comparator=e,this.data=new em(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){let n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){let r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ev(this.data.getIterator())}getIteratorFrom(e){return new ev(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof ey)||this.size!==e.size)return!1;let t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new ey(this.comparator);return t.data=e,t}}class ev{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ew{constructor(e){this.fields=e,e.sort(G.comparator)}static empty(){return new ew([])}unionWith(e){let t=new ey(G.comparator);for(let e of this.fields)t=t.add(e);for(let n of e)t=t.add(n);return new ew(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return q(this.fields,e.fields,(e,t)=>e.isEqual(t))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eE extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eT{constructor(e){this.binaryString=e}static fromBase64String(e){return new eT(function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new eE("Invalid base64 string: "+e):e}}(e))}static fromUint8Array(e){return new eT(function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e))}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return btoa(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return F(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}eT.EMPTY_BYTE_STRING=new eT("");let e_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function eS(e){if(I(!!e,39018),"string"==typeof e){let t=0,n=e_.exec(e);if(I(!!n,46558,{timestamp:e}),n[1]){let e=n[1];t=Number(e=(e+"000000000").substr(0,9))}return{seconds:Math.floor(new Date(e).getTime()/1e3),nanos:t}}return{seconds:eI(e.seconds),nanos:eI(e.nanos)}}function eI(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function eC(e){return"string"==typeof e?eT.fromBase64String(e):eT.fromUint8Array(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eb="server_timestamp",eN="__type__",eA="__previous_value__",ek="__local_write_time__";function eD(e){return(e?.mapValue?.fields||{})[eN]?.stringValue===eb}function eR(e){let t=e.mapValue.fields[eA];return eD(t)?eR(t):t}function ex(e){let t=eS(e.mapValue.fields[ek].timestampValue);return new et(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eV{constructor(e,t,n,r,i,s,a,o,l,u,h){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=a,this.longPollingOptions=o,this.useFetchStreams=l,this.isUsingEmulator=u,this.apiKey=h}}let eL="(default)";class eO{constructor(e,t){this.projectId=e,this.database=t||eL}static empty(){return new eO("","")}get isDefaultDatabase(){return this.database===eL}isEqual(e){return e instanceof eO&&e.projectId===this.projectId&&e.database===this.database}}function eM(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new b(C.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new eO(e.options.projectId,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eF="__type__",eP="__max__",eU={mapValue:{fields:{__type__:{stringValue:eP}}}},eq="__vector__",e$="value";function ez(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?eD(e)?4:e3(e)?9007199254740991:e1(e)?10:11:_(28295,{value:e})}function eB(e,t){if(e===t)return!0;let n=ez(e);if(n!==ez(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return ex(e).isEqual(ex(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let n=eS(e.timestampValue),r=eS(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return eC(e.bytesValue).isEqual(eC(t.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return eI(e.geoPointValue.latitude)===eI(t.geoPointValue.latitude)&&eI(e.geoPointValue.longitude)===eI(t.geoPointValue.longitude);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return eI(e.integerValue)===eI(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){let n=eI(e.doubleValue),r=eI(t.doubleValue);return n===r?eh(n)===eh(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return q(e.arrayValue.values||[],t.arrayValue.values||[],eB);case 10:case 11:return function(e,t){let n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(ec(n)!==ec(r))return!1;for(let e in n)if(n.hasOwnProperty(e)&&(void 0===r[e]||!eB(n[e],r[e])))return!1;return!0}(e,t);default:return _(52216,{left:e})}}function eK(e,t){return void 0!==(e.values||[]).find(e=>eB(e,t))}function eG(e,t){if(e===t)return 0;let n=ez(e),r=ez(t);if(n!==r)return F(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return F(e.booleanValue,t.booleanValue);case 2:return function(e,t){let n=eI(e.integerValue||e.doubleValue),r=eI(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return ej(e.timestampValue,t.timestampValue);case 4:return ej(ex(e),ex(t));case 5:return P(e.stringValue,t.stringValue);case 6:return function(e,t){let n=eC(e),r=eC(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let n=e.split("/"),r=t.split("/");for(let e=0;e<n.length&&e<r.length;e++){let t=F(n[e],r[e]);if(0!==t)return t}return F(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let n=F(eI(e.latitude),eI(t.latitude));return 0!==n?n:F(eI(e.longitude),eI(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return eQ(e.arrayValue,t.arrayValue);case 10:return function(e,t){let n=e.fields||{},r=t.fields||{},i=n[e$]?.arrayValue,s=r[e$]?.arrayValue,a=F(i?.values?.length||0,s?.values?.length||0);return 0!==a?a:eQ(i,s)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===eU.mapValue&&t===eU.mapValue)return 0;if(e===eU.mapValue)return 1;if(t===eU.mapValue)return -1;let n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let e=0;e<r.length&&e<s.length;++e){let t=P(r[e],s[e]);if(0!==t)return t;let a=eG(n[r[e]],i[s[e]]);if(0!==a)return a}return F(r.length,s.length)}(e.mapValue,t.mapValue);default:throw _(23264,{he:n})}}function ej(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return F(e,t);let n=eS(e),r=eS(t),i=F(n.seconds,r.seconds);return 0!==i?i:F(n.nanos,r.nanos)}function eQ(e,t){let n=e.values||[],r=t.values||[];for(let e=0;e<n.length&&e<r.length;++e){let t=eG(n[e],r[e]);if(t)return t}return F(n.length,r.length)}function eH(e){var t,n;return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){let t=eS(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?eC(e.bytesValue).toBase64():"referenceValue"in e?(t=e.referenceValue,j.fromName(t).toString()):"geoPointValue"in e?(n=e.geoPointValue,`geo(${n.latitude},${n.longitude})`):"arrayValue"in e?function(e){let t="[",n=!0;for(let r of e.values||[])n?n=!1:t+=",",t+=eH(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){let t=Object.keys(e.fields||{}).sort(),n="{",r=!0;for(let i of t)r?r=!1:n+=",",n+=`${i}:${eH(e.fields[i])}`;return n+"}"}(e.mapValue):_(61005,{value:e})}function eW(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function eY(e){return!!e&&"integerValue"in e}function eJ(e){return!!e&&"arrayValue"in e}function eX(e){return!!e&&"nullValue"in e}function eZ(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function e0(e){return!!e&&"mapValue"in e}function e1(e){return(e?.mapValue?.fields||{})[eF]?.stringValue===eq}function e2(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:{...e.timestampValue}};if(e.mapValue){let t={mapValue:{fields:{}}};return ed(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=e2(n)),t}if(e.arrayValue){let t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=e2(e.arrayValue.values[n]);return t}return{...e}}function e3(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===eP}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e4{constructor(e){this.value=e}static empty(){return new e4({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(!e0(t=(t.mapValue.fields||{})[e.get(n)]))return null;return(t=(t.mapValue.fields||{})[e.lastSegment()])||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=e2(t)}setAll(e){let t=G.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){let e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=e2(e):r.push(i.lastSegment())});let i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){let t=this.field(e.popLast());e0(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return eB(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];e0(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){for(let r of(ed(t,(t,n)=>e[t]=n),n))delete e[r]}clone(){return new e4(e2(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e6{constructor(e,t,n,r,i,s,a){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=a}static newInvalidDocument(e){return new e6(e,0,en.min(),en.min(),en.min(),e4.empty(),0)}static newFoundDocument(e,t,n,r){return new e6(e,1,t,en.min(),n,r,0)}static newNoDocument(e,t){return new e6(e,2,t,en.min(),en.min(),e4.empty(),0)}static newUnknownDocument(e,t){return new e6(e,3,t,en.min(),en.min(),e4.empty(),2)}convertToFoundDocument(e,t){return this.createTime.isEqual(en.min())&&(2===this.documentType||0===this.documentType)&&(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=e4.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=e4.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=en.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof e6&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new e6(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e9{constructor(e,t){this.position=e,this.inclusive=t}}function e5(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){let s=t[i],a=e.position[i];if(r=s.field.isKeyField()?j.comparator(j.fromName(a.referenceValue),n.key):eG(a,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function e8(e,t){if(null===e)return null===t;if(null===t||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!eB(e.position[n],t.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e7{constructor(e,t="asc"){this.field=e,this.dir=t}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{}class tt extends te{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new ts(e,t,n):"array-contains"===t?new tu(e,n):"in"===t?new th(e,n):"not-in"===t?new tc(e,n):"array-contains-any"===t?new td(e,n):new tt(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new ta(e,n):new to(e,n)}matches(e){let t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(eG(t,this.value)):null!==t&&ez(this.value)===ez(t)&&this.matchesComparison(eG(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return _(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class tn extends te{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new tn(e,t)}matches(e){return tr(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.Pe||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function tr(e){return"and"===e.op}function ti(e){for(let t of e.filters)if(t instanceof tn)return!1;return!0}class ts extends tt{constructor(e,t,n){super(e,t,n),this.key=j.fromName(n.referenceValue)}matches(e){let t=j.comparator(e.key,this.key);return this.matchesComparison(t)}}class ta extends tt{constructor(e,t){super(e,"in",t),this.keys=tl("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class to extends tt{constructor(e,t){super(e,"not-in",t),this.keys=tl("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function tl(e,t){return(t.arrayValue?.values||[]).map(e=>j.fromName(e.referenceValue))}class tu extends tt{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return eJ(t)&&eK(t.arrayValue,this.value)}}class th extends tt{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return null!==t&&eK(this.value.arrayValue,t)}}class tc extends tt{constructor(e,t){super(e,"not-in",t)}matches(e){if(eK(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!eK(this.value.arrayValue,t)}}class td extends tt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!eJ(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>eK(this.value.arrayValue,e))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(e,t=null,n=[],r=[],i=null,s=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=a,this.Te=null}}function tm(e,t=null,n=[],r=[],i=null,s=null,a=null){return new tf(e,t,n,r,i,s,a)}function tg(e){if(null===e.Te){let t=e.path.canonicalString();null!==e.collectionGroup&&(t+="|cg:"+e.collectionGroup),t+="|f:"+e.filters.map(e=>(function e(t){if(t instanceof tt)return t.field.canonicalString()+t.op.toString()+eH(t.value);if(ti(t)&&tr(t))return t.filters.map(t=>e(t)).join(",");{let n=t.filters.map(t=>e(t)).join(",");return`${t.op}(${n})`}})(e)).join(",")+"|ob:"+e.orderBy.map(e=>e.field.canonicalString()+e.dir).join(","),null==e.limit||(t+="|l:"+e.limit),e.startAt&&(t+="|lb:"+(e.startAt.inclusive?"b:":"a:")+e.startAt.position.map(e=>eH(e)).join(",")),e.endAt&&(t+="|ub:"+(e.endAt.inclusive?"a:":"b:")+e.endAt.position.map(e=>eH(e)).join(",")),e.Te=t}return e.Te}function tp(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let i=0;i<e.orderBy.length;i++){var n,r;if(n=e.orderBy[i],r=t.orderBy[i],!(n.dir===r.dir&&n.field.isEqual(r.field)))return!1}if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!function e(t,n){return t instanceof tt?n instanceof tt&&t.op===n.op&&t.field.isEqual(n.field)&&eB(t.value,n.value):t instanceof tn?n instanceof tn&&t.op===n.op&&t.filters.length===n.filters.length&&t.filters.reduce((t,r,i)=>t&&e(r,n.filters[i]),!0):void _(19439)}(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!e8(e.startAt,t.startAt)&&e8(e.endAt,t.endAt)}function ty(e){return j.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tv{constructor(e,t=null,n=[],r=[],i=null,s="F",a=null,o=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=a,this.endAt=o,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function tw(e){return new tv(e)}function tE(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function tT(e){return null!==e.collectionGroup}function t_(e){if(null===e.Ie){let t;e.Ie=[];let n=new Set;for(let t of e.explicitOrderBy)e.Ie.push(t),n.add(t.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(t=new ey(G.comparator),e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t).forEach(t=>{n.has(t.canonicalString())||t.isKeyField()||e.Ie.push(new e7(t,r))}),n.has(G.keyField().canonicalString())||e.Ie.push(new e7(G.keyField(),r))}return e.Ie}function tS(e){return e.Ee||(e.Ee=function(e,t){if("F"===e.limitType)return tm(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{let t="desc"===e.dir?"asc":"desc";return new e7(e.field,t)});let n=e.endAt?new e9(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new e9(e.startAt.position,e.startAt.inclusive):null;return tm(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}(e,t_(e))),e.Ee}function tI(e,t){let n=e.filters.concat([t]);return new tv(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function tC(e,t,n){return new tv(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function tb(e,t){return tp(tS(e),tS(t))&&e.limitType===t.limitType}function tN(e){return`${tg(tS(e))}|lt:${e.limitType}`}function tA(e){var t;let n;return`Query(target=${n=(t=tS(e)).path.canonicalString(),null!==t.collectionGroup&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(e=>(function e(t){return t instanceof tt?`${t.field.canonicalString()} ${t.op} ${eH(t.value)}`:t instanceof tn?t.op.toString()+" {"+t.getFilters().map(e).join(" ,")+"}":"Filter"})(e)).join(", ")}]`),null==t.limit||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(e=>`${e.field.canonicalString()} (${e.dir})`).join(", ")}]`),t.startAt&&(n+=", startAt: "+(t.startAt.inclusive?"b:":"a:")+t.startAt.position.map(e=>eH(e)).join(",")),t.endAt&&(n+=", endAt: "+(t.endAt.inclusive?"a:":"b:")+t.endAt.position.map(e=>eH(e)).join(",")),`Target(${n})`}; limitType=${e.limitType})`}function tk(e,t){return t.isFoundDocument()&&function(e,t){let n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):j.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(let n of t_(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(let n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(!e.startAt||!!function(e,t,n){let r=e5(e,t,n);return e.inclusive?r<=0:r<0}(e.startAt,t_(e),t))&&(!e.endAt||!!function(e,t,n){let r=e5(e,t,n);return e.inclusive?r>=0:r>0}(e.endAt,t_(e),t))}function tD(e){return(t,n)=>{let r=!1;for(let i of t_(e)){let e=function(e,t,n){let r=e.field.isKeyField()?j.comparator(t.key,n.key):function(e,t,n){let r=t.data.field(e),i=n.data.field(e);return null!==r&&null!==i?eG(r,i):_(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return -1*r;default:return _(19790,{direction:e.dir})}}(i,t,n);if(0!==e)return e;r=r||i.field.isKeyField()}return 0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tR{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n){for(let[t,r]of n)if(this.equalsFn(t,e))return r}}has(e){return void 0!==this.get(e)}set(e,t){let n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let n=0;n<r.length;n++)if(this.equalsFn(r[n][0],e))return void(r[n]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){ed(this.inner,(t,n)=>{for(let[t,r]of n)e(t,r)})}isEmpty(){return ef(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tx=new em(j.comparator),tV=new em(j.comparator);function tL(...e){let t=tV;for(let n of e)t=t.insert(n.key,n);return t}function tO(e){let t=tV;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function tM(){return new tR(e=>e.toString(),(e,t)=>e.isEqual(t))}let tF=new em(j.comparator),tP=new ey(j.comparator);function tU(...e){let t=tP;for(let n of e)t=t.add(n);return t}let tq=new ey(F);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function t$(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:eh(t)?"-0":t}}function tz(e){return{integerValue:""+e}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tB{constructor(){this._=void 0}}function tK(e,t){return e instanceof tY?eY(t)||t&&"doubleValue"in t?t:{integerValue:0}:null}class tG extends tB{}class tj extends tB{constructor(e){super(),this.elements=e}}function tQ(e,t){let n=tX(t);for(let t of e.elements)n.some(e=>eB(e,t))||n.push(t);return{arrayValue:{values:n}}}class tH extends tB{constructor(e){super(),this.elements=e}}function tW(e,t){let n=tX(t);for(let t of e.elements)n=n.filter(e=>!eB(e,t));return{arrayValue:{values:n}}}class tY extends tB{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function tJ(e){return eI(e.integerValue||e.doubleValue)}function tX(e){return eJ(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}class tZ{constructor(e,t){this.version=e,this.transformResults=t}}class t0{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new t0}static exists(e){return new t0(void 0,e)}static updateTime(e){return new t0(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function t1(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class t2{}function t3(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new nt(e.key,t0.none()):new t9(e.key,e.data,t0.none());{let n=e.data,r=e4.empty(),i=new ey(G.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),i=i.add(e)}return new t5(e.key,r,new ew(i.toArray()),t0.none())}}function t4(e,t,n,r){return e instanceof t9?function(e,t,n,r){if(!t1(e.precondition,t))return n;let i=e.value.clone(),s=ne(e.fieldTransforms,r,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof t5?function(e,t,n,r){if(!t1(e.precondition,t))return n;let i=ne(e.fieldTransforms,r,t),s=t.data;return(s.setAll(t8(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===n)?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):t1(e.precondition,t)?(t.convertToNoDocument(t.version).setHasLocalMutations(),null):n}function t6(e,t){var n,r;return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||!(!n||!r)&&q(n,r,(e,t)=>{var n,r;return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof tj&&r instanceof tj||n instanceof tH&&r instanceof tH?q(n.elements,r.elements,eB):n instanceof tY&&r instanceof tY?eB(n.Ae,r.Ae):n instanceof tG&&r instanceof tG)})))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask))}class t9 extends t2{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class t5 extends t2{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function t8(e){let t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){let r=e.data.field(n);t.set(n,r)}}),t}function t7(e,t,n){let r=new Map;I(e.length===n.length,32656,{Ve:n.length,de:e.length});for(let s=0;s<n.length;s++){var i;let a=e[s],o=a.transform,l=t.data.field(a.field);r.set(a.field,(i=n[s],o instanceof tj?tQ(o,l):o instanceof tH?tW(o,l):i))}return r}function ne(e,t,n){let r=new Map;for(let i of e){let e=i.transform,s=n.data.field(i.field);r.set(i.field,e instanceof tG?function(e,t){let n={fields:{[eN]:{stringValue:eb},[ek]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&eD(t)&&(t=eR(t)),t&&(n.fields[eA]=t),{mapValue:n}}(t,s):e instanceof tj?tQ(e,s):e instanceof tH?tW(e,s):function(e,t){let n=tK(e,t),r=tJ(n)+tJ(e.Ae);return eY(n)&&eY(e.Ae)?tz(r):t$(e.serializer,r)}(e,s))}return r}class nt extends t2{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class nn extends t2{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){let n=t.mutationResults;for(let t=0;t<this.mutations.length;t++){let i=this.mutations[t];if(i.key.isEqual(e.key)){var r;r=n[t],i instanceof t9?function(e,t,n){let r=e.value.clone(),i=t7(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(i,e,r):i instanceof t5?function(e,t,n){if(!t1(e.precondition,t))return void t.convertToUnknownDocument(n.version);let r=t7(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(t8(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(i,e,r):function(e,t,n){t.convertToNoDocument(n.version).setHasCommittedMutations()}(0,e,r)}}}applyToLocalView(e,t){for(let n of this.baseMutations)n.key.isEqual(e.key)&&(t=t4(n,e,t,this.localWriteTime));for(let n of this.mutations)n.key.isEqual(e.key)&&(t=t4(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let n=tM();return this.mutations.forEach(r=>{let i=e.get(r.key),s=i.overlayedDocument,a=this.applyToLocalView(s,i.mutatedFields),o=t3(s,a=t.has(r.key)?null:a);null!==o&&n.set(r.key,o),s.isValidDocument()||s.convertToNoDocument(en.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),tU())}isEqual(e){return this.batchId===e.batchId&&q(this.mutations,e.mutations,(e,t)=>t6(e,t))&&q(this.baseMutations,e.baseMutations,(e,t)=>t6(e,t))}}class ni{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){I(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let r=tF,i=e.mutations;for(let e=0;e<i.length;e++)r=r.insert(i[e].key,n[e].version);return new ni(e,t,n,r)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class na{constructor(e,t){this.count=e,this.unchangedNames=t}}function no(e){if(void 0===e)return w("GRPC error has no .code"),C.UNKNOWN;switch(e){case r.OK:return C.OK;case r.CANCELLED:return C.CANCELLED;case r.UNKNOWN:return C.UNKNOWN;case r.DEADLINE_EXCEEDED:return C.DEADLINE_EXCEEDED;case r.RESOURCE_EXHAUSTED:return C.RESOURCE_EXHAUSTED;case r.INTERNAL:return C.INTERNAL;case r.UNAVAILABLE:return C.UNAVAILABLE;case r.UNAUTHENTICATED:return C.UNAUTHENTICATED;case r.INVALID_ARGUMENT:return C.INVALID_ARGUMENT;case r.NOT_FOUND:return C.NOT_FOUND;case r.ALREADY_EXISTS:return C.ALREADY_EXISTS;case r.PERMISSION_DENIED:return C.PERMISSION_DENIED;case r.FAILED_PRECONDITION:return C.FAILED_PRECONDITION;case r.ABORTED:return C.ABORTED;case r.OUT_OF_RANGE:return C.OUT_OF_RANGE;case r.UNIMPLEMENTED:return C.UNIMPLEMENTED;case r.DATA_LOSS:return C.DATA_LOSS;default:return _(39323,{code:e})}}(i=r||(r={}))[i.OK=0]="OK",i[i.CANCELLED=1]="CANCELLED",i[i.UNKNOWN=2]="UNKNOWN",i[i.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",i[i.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",i[i.NOT_FOUND=5]="NOT_FOUND",i[i.ALREADY_EXISTS=6]="ALREADY_EXISTS",i[i.PERMISSION_DENIED=7]="PERMISSION_DENIED",i[i.UNAUTHENTICATED=16]="UNAUTHENTICATED",i[i.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",i[i.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",i[i.ABORTED=10]="ABORTED",i[i.OUT_OF_RANGE=11]="OUT_OF_RANGE",i[i.UNIMPLEMENTED=12]="UNIMPLEMENTED",i[i.INTERNAL=13]="INTERNAL",i[i.UNAVAILABLE=14]="UNAVAILABLE",i[i.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let nl=new u.z8([4294967295,4294967295],0);function nu(e){let t=(new TextEncoder).encode(e),n=new u.V8;return n.update(t),new Uint8Array(n.digest())}function nh(e){let t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),i=t.getUint32(8,!0),s=t.getUint32(12,!0);return[new u.z8([n,r],0),new u.z8([i,s],0)]}class nc{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new nd(`Invalid padding: ${t}`);if(n<0||e.length>0&&0===this.hashCount)throw new nd(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new nd(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=u.z8.fromNumber(this.ge)}ye(e,t,n){let r=e.add(t.multiply(u.z8.fromNumber(n)));return 1===r.compare(nl)&&(r=new u.z8([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.ge)return!1;let[t,n]=nh(nu(e));for(let e=0;e<this.hashCount;e++){let r=this.ye(t,n,e);if(!this.we(r))return!1}return!0}static create(e,t,n){let r=new nc(new Uint8Array(Math.ceil(e/8)),e%8==0?0:8-e%8,t);return n.forEach(e=>r.insert(e)),r}insert(e){if(0===this.ge)return;let[t,n]=nh(nu(e));for(let e=0;e<this.hashCount;e++){let r=this.ye(t,n,e);this.Se(r)}}Se(e){this.bitmap[Math.floor(e/8)]|=1<<e%8}}class nd extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){let r=new Map;return r.set(e,nm.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new nf(en.min(),r,new em(F),tx,tU())}}class nm{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new nm(n,t,tU(),tU(),tU())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(e,t,n,r){this.be=e,this.removedTargetIds=t,this.key=n,this.De=r}}class np{constructor(e,t){this.targetId=e,this.Ce=t}}class ny{constructor(e,t,n=eT.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class nv{constructor(){this.ve=0,this.Fe=nT(),this.Me=eT.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return 0!==this.ve}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=tU(),t=tU(),n=tU();return this.Fe.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:_(38017,{changeType:i})}}),new nm(this.Me,this.xe,e,t,n)}Ke(){this.Oe=!1,this.Fe=nT()}qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,I(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class nw{constructor(e){this.Ge=e,this.ze=new Map,this.je=tx,this.Je=nE(),this.He=nE(),this.Ze=new em(F)}Xe(e){for(let t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(let t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{let n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.We(),n.Ne||n.Ke(),n.Le(e.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.Qe(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:_(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((e,n)=>{this.rt(n)&&t(n)})}st(e){let t=e.targetId,n=e.Ce.count,r=this.ot(t);if(r){let i=r.target;if(ty(i)){if(0===n){let e=new j(i.path);this.et(t,e,e6.newNoDocument(e,en.min()))}else I(1===n,20013,{expectedCount:n})}else{let r=this._t(t);if(r!==n){let n=this.ut(e),i=n?this.ct(n,e,r):1;0!==i&&(this.it(t),this.Ze=this.Ze.insert(t,2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch"))}}}}ut(e){let t,n;let r=e.Ce.unchangedNames;if(!r||!r.bits)return null;let{bits:{bitmap:i="",padding:s=0},hashCount:a=0}=r;try{t=eC(i).toUint8Array()}catch(e){if(e instanceof eE)return E("Decoding the base64 bloom filter in existence filter failed ("+e.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw e}try{n=new nc(t,s,a)}catch(e){return E(e instanceof nd?"BloomFilter error: ":"Applying bloom filter failed: ",e),null}return 0===n.ge?null:n}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){let n=this.Ge.getRemoteKeysForTarget(t),r=0;return n.forEach(n=>{let i=this.Ge.ht(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(s)||(this.et(t,n,null),r++)}),r}Tt(e){let t=new Map;this.ze.forEach((n,r)=>{let i=this.ot(r);if(i){if(n.current&&ty(i.target)){let t=new j(i.target.path);this.It(t).has(r)||this.Et(r,t)||this.et(r,t,e6.newNoDocument(t,e))}n.Be&&(t.set(r,n.ke()),n.Ke())}});let n=tU();this.He.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{let t=this.ot(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.je.forEach((t,n)=>n.setReadTime(e));let r=new nf(e,t,this.Ze,this.je,n);return this.je=tx,this.Je=nE(),this.He=nE(),this.Ze=new em(F),r}Ye(e,t){if(!this.rt(e))return;let n=this.Et(e,t.key)?2:0;this.nt(e).qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.Rt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;let r=this.nt(e);this.Et(e,t)?r.qe(t,1):r.Ue(t),this.He=this.He.insert(t,this.Rt(t).delete(e)),this.He=this.He.insert(t,this.Rt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){let t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new nv,this.ze.set(e,t)),t}Rt(e){let t=this.He.get(e);return t||(t=new ey(F),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new ey(F),this.Je=this.Je.insert(e,t)),t}rt(e){let t=null!==this.ot(e);return t||v("WatchChangeAggregator","Detected inactive target",e),t}ot(e){let t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new nv),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function nE(){return new em(j.comparator)}function nT(){return new em(j.comparator)}let n_={asc:"ASCENDING",desc:"DESCENDING"},nS={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},nI={and:"AND",or:"OR"};class nC{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function nb(e,t){return e.useProto3Json||null==t?t:{value:t}}function nN(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function nA(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function nk(e){return I(!!e,49232),en.fromTimestamp(function(e){let t=eS(e);return new et(t.seconds,t.nanos)}(e))}function nD(e,t){return nR(e,t).canonicalString()}function nR(e,t){let n=new B(["projects",e.projectId,"databases",e.database]).child("documents");return void 0===t?n:n.child(t)}function nx(e){let t=B.fromString(e);return I(n$(t),10190,{key:t.toString()}),t}function nV(e,t){return nD(e.databaseId,t.path)}function nL(e,t){let n=nx(t);if(n.get(1)!==e.databaseId.projectId)throw new b(C.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new b(C.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new j(nF(n))}function nO(e,t){return nD(e.databaseId,t)}function nM(e){return new B(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function nF(e){return I(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function nP(e,t,n){return{name:nV(e,t),fields:n.value.mapValue.fields}}function nU(e){return{fieldPath:e.canonicalString()}}function nq(e){return G.fromServerFormat(e.fieldPath)}function n$(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}function nz(e){return!!e&&"function"==typeof e._toProto&&"ProtoValue"===e._protoValueType}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nB{constructor(e,t,n,r,i=en.min(),s=en.min(),a=eT.EMPTY_BYTE_STRING,o=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=a,this.expectedCount=o}withSequenceNumber(e){return new nB(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new nB(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new nB(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new nB(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nK{constructor(e){this.yt=e}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nG{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(eI(e.integerValue));else if("doubleValue"in e){let n=eI(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),eh(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),"string"==typeof n&&(n=eS(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(eC(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){let n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?e3(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):e1(e)?this.kt(e.mapValue,t):(this.Kt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Nt(t)):_(19022,{Ut:e})}Ot(e,t){this.Ft(t,25),this.$t(e,t)}$t(e,t){t.xt(e)}Kt(e,t){let n=e.fields||{};for(let e of(this.Ft(t,55),Object.keys(n)))this.Ot(e,t),this.Ct(n[e],t)}kt(e,t){let n=e.fields||{};this.Ft(t,53);let r=n[e$].arrayValue?.values?.length||0;this.Ft(t,15),t.Mt(eI(r)),this.Ot(e$,t),this.Ct(n[e$],t)}qt(e,t){let n=e.values||[];for(let e of(this.Ft(t,50),n))this.Ct(e,t)}Lt(e,t){this.Ft(t,37),j.fromName(e).path.forEach(e=>{this.Ft(t,60),this.$t(e,t)})}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}nG.Wt=new nG;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nj{constructor(){this.bn=new nQ}addToCollectionParentIndex(e,t){return this.bn.add(t),eo.resolve()}getCollectionParents(e,t){return eo.resolve(this.bn.getEntries(t))}addFieldIndex(e,t){return eo.resolve()}deleteFieldIndex(e,t){return eo.resolve()}deleteAllFieldIndexes(e){return eo.resolve()}createTargetIndexes(e,t){return eo.resolve()}getDocumentsMatchingTarget(e,t){return eo.resolve(null)}getIndexType(e,t){return eo.resolve(0)}getFieldIndexes(e,t){return eo.resolve([])}getNextCollectionGroupToUpdate(e){return eo.resolve(null)}getMinOffset(e,t){return eo.resolve(ei.min())}getMinOffsetFromCollectionGroup(e,t){return eo.resolve(ei.min())}updateCollectionGroup(e,t,n){return eo.resolve()}updateIndexEntries(e,t){return eo.resolve()}}class nQ{constructor(){this.index={}}add(e){let t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new ey(B.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){let t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new ey(B.comparator)).toArray()}}new Uint8Array(0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let nH={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class nW{static withCacheSize(e){return new nW(e,nW.DEFAULT_COLLECTION_PERCENTILE,nW.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */nW.DEFAULT_COLLECTION_PERCENTILE=10,nW.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,nW.DEFAULT=new nW(41943040,nW.DEFAULT_COLLECTION_PERCENTILE,nW.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),nW.DISABLED=new nW(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nY{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new nY(0)}static ar(){return new nY(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let nJ="LruGarbageCollector";function nX([e,t],[n,r]){let i=F(e,n);return 0===i?F(t,r):i}class nZ{constructor(e){this.Pr=e,this.buffer=new ey(nX),this.Tr=0}Ir(){return++this.Tr}Er(e){let t=[e,this.Ir()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{let e=this.buffer.last();0>nX(t,e)&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class n0{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return null!==this.Rr}Ar(e){v(nJ,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){el(e)?v(nJ,"Ignoring IndexedDB error during garbage collection: ",e):await ea(e)}await this.Ar(3e5)})}}class n1{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return eo.resolve(eu.ce);let n=new nZ(t);return this.Vr.forEachTarget(e,e=>n.Er(e.sequenceNumber)).next(()=>this.Vr.mr(e,e=>n.Er(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return -1===this.params.cacheSizeCollectionThreshold?(v("LruGarbageCollector","Garbage collection skipped; disabled"),eo.resolve(nH)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(v("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),nH):this.gr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let n,r,i,s,a,o,l;let u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(v("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,s=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,a=Date.now(),this.removeTargets(e,n,t))).next(t=>(i=t,o=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(l=Date.now(),y()<=h.in.DEBUG&&v("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${s-u}ms
	Determined least recently used ${r} in `+(a-s)+"ms\n"+`	Removed ${i} targets in `+(o-a)+"ms\n"+`	Removed ${e} documents in `+(l-o)+"ms\n"+`Total Duration: ${l-u}ms`),eo.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:e})))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n2{constructor(){this.changes=new tR(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,e6.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let n=this.changes.get(t);return void 0!==n?eo.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n3{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n4{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&t4(n.mutation,e,ew.empty(),et.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,tU()).next(()=>t))}getLocalViewOfDocuments(e,t,n=tU()){let r=tM();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=tL();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){let n=tM();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,tU()))}populateOverlays(e,t,n){let r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let i=tx,s=tM(),a=tM();return t.forEach((e,t)=>{let a=n.get(t.key);r.has(t.key)&&(void 0===a||a.mutation instanceof t5)?i=i.insert(t.key,t):void 0!==a?(s.set(t.key,a.mutation.getFieldMask()),t4(a.mutation,t,a.mutation.getFieldMask(),et.now())):s.set(t.key,ew.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>a.set(e,new n3(t,s.get(e)??null))),a))}recalculateAndSaveOverlays(e,t){let n=tM(),r=new em((e,t)=>e-t),i=tU();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(let i of e)i.keys().forEach(e=>{let s=t.get(e);if(null===s)return;let a=n.get(e)||ew.empty();a=i.applyToLocalView(s,a),n.set(e,a);let o=(r.get(i.batchId)||tU()).add(e);r=r.insert(i.batchId,o)})}).next(()=>{let s=[],a=r.getReverseIterator();for(;a.hasNext();){let r=a.getNext(),o=r.key,l=r.value,u=tM();l.forEach(e=>{if(!i.has(e)){let r=t3(t.get(e),n.get(e));null!==r&&u.set(e,r),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,o,u))}return eo.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return j.isDocumentKey(t.path)&&null===t.collectionGroup&&0===t.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):tT(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r)}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{let s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):eo.resolve(tM()),a=-1,o=i;return s.next(t=>eo.forEach(t,(t,n)=>(a<n.largestBatchId&&(a=n.largestBatchId),i.get(t)?eo.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{o=o.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,o,t,tU())).next(e=>({batchId:a,changes:tO(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new j(t)).next(e=>{let t=tL();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){let i=t.collectionGroup,s=tL();return this.indexManager.getCollectionParents(e,i).next(a=>eo.forEach(a,a=>{let o=new tv(a.child(i),null,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,t.endAt);return this.getDocumentsMatchingCollectionQuery(e,o,n,r).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(e=>{i.forEach((t,n)=>{let r=n.getKey();null===e.get(r)&&(e=e.insert(r,e6.newInvalidDocument(r)))});let n=tL();return e.forEach((e,r)=>{let s=i.get(e);void 0!==s&&t4(s.mutation,r,ew.empty(),et.now()),tk(t,r)&&(n=n.insert(e,r))}),n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n6{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return eo.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,{id:t.id,version:t.version,createTime:nk(t.createTime)}),eo.resolve()}getNamedQuery(e,t){return eo.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,{name:t.name,query:function(e){let t=function(e){var t;let n,r=function(e){let t=nx(e);return 4===t.length?B.emptyPath():nF(t)}(e.parent),i=e.structuredQuery,s=i.from?i.from.length:0,a=null;if(s>0){I(1===s,65062);let e=i.from[0];e.allDescendants?a=e.collectionId:r=r.child(e.collectionId)}let o=[];i.where&&(o=function(e){var t;let n=function e(t){return void 0!==t.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":let t=nq(e.unaryFilter.field);return tt.create(t,"==",{doubleValue:NaN});case"IS_NULL":let n=nq(e.unaryFilter.field);return tt.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let r=nq(e.unaryFilter.field);return tt.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let i=nq(e.unaryFilter.field);return tt.create(i,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return _(61313);default:return _(60726)}}(t):void 0!==t.fieldFilter?tt.create(nq(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return _(58110);default:return _(50506)}}(t.fieldFilter.op),t.fieldFilter.value):void 0!==t.compositeFilter?tn.create(t.compositeFilter.filters.map(t=>e(t)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return _(1026)}}(t.compositeFilter.op)):_(30097,{filter:t})}(e);return n instanceof tn&&ti(t=n)&&tr(t)?n.getFilters():[n]}(i.where));let l=[];i.orderBy&&(l=i.orderBy.map(e=>new e7(nq(e.field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(e.direction))));let u=null;i.limit&&(u=null==(n="object"==typeof(t=i.limit)?t.value:t)?null:n);let h=null;i.startAt&&(h=function(e){let t=!!e.before;return new e9(e.values||[],t)}(i.startAt));let c=null;return i.endAt&&(c=function(e){let t=!e.before;return new e9(e.values||[],t)}(i.endAt)),new tv(r,a,l,o,u,"F",h,c)}({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?tC(t,t.limit,"L"):t}(t.bundledQuery),readTime:nk(t.readTime)}),eo.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n9{constructor(){this.overlays=new em(j.comparator),this.Lr=new Map}getOverlay(e,t){return eo.resolve(this.overlays.get(t))}getOverlays(e,t){let n=tM();return eo.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.St(e,t,r)}),eo.resolve()}removeOverlaysForBatchId(e,t,n){let r=this.Lr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.Lr.delete(n)),eo.resolve()}getOverlaysForCollection(e,t,n){let r=tM(),i=t.length+1,s=new j(t.child("")),a=this.overlays.getIteratorFrom(s);for(;a.hasNext();){let e=a.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return eo.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new em((e,t)=>e-t),s=this.overlays.getIterator();for(;s.hasNext();){let e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);null===t&&(t=tM(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}let a=tM(),o=i.getIterator();for(;o.hasNext()&&(o.getNext().value.forEach((e,t)=>a.set(e,t)),!(a.size()>=r)););return eo.resolve(a)}St(e,t,n){let r=this.overlays.get(n.key);if(null!==r){let e=this.Lr.get(r.largestBatchId).delete(n.key);this.Lr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new ns(t,n));let i=this.Lr.get(t);void 0===i&&(i=tU(),this.Lr.set(t,i)),this.Lr.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n5{constructor(){this.sessionToken=eT.EMPTY_BYTE_STRING}getSessionToken(e){return eo.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,eo.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n8{constructor(){this.kr=new ey(n7.Kr),this.qr=new ey(n7.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){let n=new n7(e,t);this.kr=this.kr.add(n),this.qr=this.qr.add(n)}$r(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Wr(new n7(e,t))}Qr(e,t){e.forEach(e=>this.removeReference(e,t))}Gr(e){let t=new j(new B([])),n=new n7(t,e),r=new n7(t,e+1),i=[];return this.qr.forEachInRange([n,r],e=>{this.Wr(e),i.push(e.key)}),i}zr(){this.kr.forEach(e=>this.Wr(e))}Wr(e){this.kr=this.kr.delete(e),this.qr=this.qr.delete(e)}jr(e){let t=new j(new B([])),n=new n7(t,e),r=new n7(t,e+1),i=tU();return this.qr.forEachInRange([n,r],e=>{i=i.add(e.key)}),i}containsKey(e){let t=new n7(e,0),n=this.kr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class n7{constructor(e,t){this.key=e,this.Jr=t}static Kr(e,t){return j.comparator(e.key,t.key)||F(e.Jr,t.Jr)}static Ur(e,t){return F(e.Jr,t.Jr)||j.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Hr=new ey(n7.Kr)}checkEmpty(e){return eo.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){let i=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let s=new nr(i,t,n,r);for(let t of(this.mutationQueue.push(s),r))this.Hr=this.Hr.add(new n7(t.key,i)),this.indexManager.addToCollectionParentIndex(e,t.key.path.popLast());return eo.resolve(s)}lookupMutationBatch(e,t){return eo.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){let n=this.Xr(t+1),r=n<0?0:n;return eo.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return eo.resolve(0===this.mutationQueue.length?-1:this.Yn-1)}getAllMutationBatches(e){return eo.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let n=new n7(t,0),r=new n7(t,Number.POSITIVE_INFINITY),i=[];return this.Hr.forEachInRange([n,r],e=>{let t=this.Zr(e.Jr);i.push(t)}),eo.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new ey(F);return t.forEach(e=>{let t=new n7(e,0),r=new n7(e,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([t,r],e=>{n=n.add(e.Jr)})}),eo.resolve(this.Yr(n))}getAllMutationBatchesAffectingQuery(e,t){let n=t.path,r=n.length+1,i=n;j.isDocumentKey(i)||(i=i.child(""));let s=new n7(new j(i),0),a=new ey(F);return this.Hr.forEachWhile(e=>{let t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(a=a.add(e.Jr)),!0)},s),eo.resolve(this.Yr(a))}Yr(e){let t=[];return e.forEach(e=>{let n=this.Zr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){I(0===this.ei(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Hr;return eo.forEach(t.mutations,r=>{let i=new n7(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Hr=n})}nr(e){}containsKey(e,t){let n=new n7(t,0),r=this.Hr.firstAfterOrEqual(n);return eo.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,eo.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Zr(e){let t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.ti=e,this.docs=new em(j.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let n=t.key,r=this.docs.get(n),i=r?r.size:0,s=this.ti(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let n=this.docs.get(t);return eo.resolve(n?n.document.mutableCopy():e6.newInvalidDocument(t))}getEntries(e,t){let n=tx;return t.forEach(e=>{let t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():e6.newInvalidDocument(e))}),eo.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=tx,s=t.path,a=new j(s.child("__id-9223372036854775808__")),o=this.docs.getIteratorFrom(a);for(;o.hasNext();){let{key:e,value:{document:a}}=o.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||0>=function(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:0!==(n=j.comparator(e.documentKey,t.documentKey))?n:F(e.largestBatchId,t.largestBatchId)}(new ei(a.readTime,a.key,-1),n)||(r.has(a.key)||tk(t,a))&&(i=i.insert(a.key,a.mutableCopy()))}return eo.resolve(i)}getAllFromCollectionGroup(e,t,n,r){_(9500)}ni(e,t){return eo.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new rn(this)}getSize(e){return eo.resolve(this.size)}}class rn extends n2{constructor(e){super(),this.Mr=e}applyChanges(e){let t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Mr.addEntry(e,r)):this.Mr.removeEntry(n)}),eo.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e){this.persistence=e,this.ri=new tR(e=>tg(e),tp),this.lastRemoteSnapshotVersion=en.min(),this.highestTargetId=0,this.ii=0,this.si=new n8,this.targetCount=0,this.oi=nY._r()}forEachTarget(e,t){return this.ri.forEach((e,n)=>t(n)),eo.resolve()}getLastRemoteSnapshotVersion(e){return eo.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return eo.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),eo.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ii&&(this.ii=t),eo.resolve()}lr(e){this.ri.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.oi=new nY(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,eo.resolve()}updateTargetData(e,t){return this.lr(t),eo.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,eo.resolve()}removeTargets(e,t,n){let r=0,i=[];return this.ri.forEach((s,a)=>{a.sequenceNumber<=t&&null===n.get(a.targetId)&&(this.ri.delete(s),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),r++)}),eo.waitFor(i).next(()=>r)}getTargetCount(e){return eo.resolve(this.targetCount)}getTargetData(e,t){let n=this.ri.get(t)||null;return eo.resolve(n)}addMatchingKeys(e,t,n){return this.si.$r(t,n),eo.resolve()}removeMatchingKeys(e,t,n){this.si.Qr(t,n);let r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(t=>{i.push(r.markPotentiallyOrphaned(e,t))}),eo.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),eo.resolve()}getMatchingKeysForTargetId(e,t){let n=this.si.jr(t);return eo.resolve(n)}containsKey(e,t){return eo.resolve(this.si.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri{constructor(e,t){this._i={},this.overlays={},this.ai=new eu(0),this.ui=!1,this.ui=!0,this.ci=new n5,this.referenceDelegate=e(this),this.li=new rr(this),this.indexManager=new nj,this.remoteDocumentCache=new rt(e=>this.referenceDelegate.hi(e)),this.serializer=new nK(t),this.Pi=new n6(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new n9,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this._i[e.toKey()];return n||(n=new re(t,this.referenceDelegate),this._i[e.toKey()]=n),n}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,n){v("MemoryPersistence","Starting transaction:",e);let r=new rs(this.ai.next());return this.referenceDelegate.Ti(),n(r).next(e=>this.referenceDelegate.Ii(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ei(e,t){return eo.or(Object.values(this._i).map(n=>()=>n.containsKey(e,t)))}}class rs extends es{constructor(e){super(),this.currentSequenceNumber=e}}class ra{constructor(e){this.persistence=e,this.Ri=new n8,this.Ai=null}static Vi(e){return new ra(e)}get di(){if(this.Ai)return this.Ai;throw _(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.di.delete(n.toString()),eo.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.di.add(n.toString()),eo.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),eo.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach(e=>this.di.add(e.toString()));let n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.di.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ti(){this.Ai=new Set}Ii(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return eo.forEach(this.di,n=>{let r=j.fromPath(n);return this.mi(e,r).next(e=>{e||t.removeEntry(r,en.min())})}).next(()=>(this.Ai=null,t.apply(e)))}updateLimboDocument(e,t){return this.mi(e,t).next(e=>{e?this.di.delete(t.toString()):this.di.add(t.toString())})}hi(e){return 0}mi(e,t){return eo.or([()=>eo.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class ro{constructor(e,t){this.persistence=e,this.fi=new tR(e=>(function(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t+="\x01\x01"),t=function(e,t){let n=t,r=e.length;for(let t=0;t<r;t++){let r=e.charAt(t);switch(r){case"\x00":n+="\x01\x10";break;case"\x01":n+="\x01\x11";break;default:n+=r}}return n}(e.get(n),t);return t+"\x01\x01"})(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=new n1(this,t)}static Vi(e,t){return new ro(e,t)}Ti(){}Ii(e){return eo.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){let t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}pr(e){let t=0;return this.mr(e,e=>{t++}).next(()=>t)}mr(e,t){return eo.forEach(this.fi,(n,r)=>this.wr(e,n,r).next(e=>e?eo.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0,r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ni(e,r=>this.wr(e,r,t).next(e=>{e||(n++,i.removeEntry(r,en.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),eo.resolve()}removeTarget(e,t){let n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),eo.resolve()}removeReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),eo.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),eo.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=function e(t){switch(ez(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:let n=eR(t);return n?16+e(n):16;case 5:return 2*t.stringValue.length;case 6:return eC(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return(t.arrayValue.values||[]).reduce((t,n)=>t+e(n),0);case 10:case 11:var r;let i;return r=t.mapValue,i=0,ed(r.fields,(t,n)=>{i+=t.length+e(n)}),i;default:throw _(13486,{value:t})}}(e.data.value)),t}wr(e,t,n){return eo.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let e=this.fi.get(t);return eo.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Ts=n,this.Is=r}static Es(e,t){let n=tU(),r=tU();for(let e of t.docChanges)switch(e.type){case 0:n=n.add(e.doc.key);break;case 1:r=r.add(e.doc.key)}return new rl(e,t.fromCache,n,r)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(0,l.G6)()?8:function(e){let t=e.match(/Android ([\d.]+)/i);return Number(t?t[1].split(".").slice(0,2).join("."):"-1")}((0,l.z$)())>0?6:4}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,r){let i={result:null};return this.gs(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.ps(e,t,r,n).next(e=>{i.result=e})}).next(()=>{if(i.result)return;let n=new ru;return this.ys(e,t,n).next(r=>{if(i.result=r,this.As)return this.ws(e,t,n,r.size)})}).next(()=>i.result)}ws(e,t,n,r){return n.documentReadCount<this.Vs?(y()<=h.in.DEBUG&&v("QueryEngine","SDK will not create cache indexes for query:",tA(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),eo.resolve()):(y()<=h.in.DEBUG&&v("QueryEngine","Query:",tA(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.ds*r?(y()<=h.in.DEBUG&&v("QueryEngine","The SDK decides to create cache indexes for query:",tA(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,tS(t))):eo.resolve())}gs(e,t){if(tE(t))return eo.resolve(null);let n=tS(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(n=tS(t=tC(t,null,"F"))),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{let i=tU(...r);return this.fs.getDocuments(e,i).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{let s=this.Ss(t,r);return this.bs(t,s,i,n.readTime)?this.gs(e,tC(t,null,"F")):this.Ds(e,s,t,n)}))})))}ps(e,t,n,r){return tE(t)||r.isEqual(en.min())?eo.resolve(null):this.fs.getDocuments(e,n).next(i=>{let s=this.Ss(t,i);return this.bs(t,s,n,r)?eo.resolve(null):(y()<=h.in.DEBUG&&v("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),tA(t)),this.Ds(e,s,t,function(e,t){let n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1;return new ei(en.fromTimestamp(1e9===r?new et(n+1,0):new et(n,r)),j.empty(),-1)}(r,0)).next(e=>e))})}Ss(e,t){let n=new ey(tD(e));return t.forEach((t,r)=>{tk(e,r)&&(n=n.add(r))}),n}bs(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;let i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}ys(e,t,n){return y()<=h.in.DEBUG&&v("QueryEngine","Using full collection scan to execute query:",tA(t)),this.fs.getDocumentsMatchingQuery(e,t,ei.min(),n)}Ds(e,t,n,r){return this.fs.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rc="LocalStore";class rd{constructor(e,t,n,r){this.persistence=e,this.Cs=t,this.serializer=r,this.vs=new em(F),this.Fs=new tR(e=>tg(e),tp),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(n)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new n4(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.vs))}}async function rf(e,t){return await e.persistence.runTransaction("Handle user change","readonly",n=>{let r;return e.mutationQueue.getAllMutationBatches(n).next(i=>(r=i,e.Os(t),e.mutationQueue.getAllMutationBatches(n))).next(t=>{let i=[],s=[],a=tU();for(let e of r)for(let t of(i.push(e.batchId),e.mutations))a=a.add(t.key);for(let e of t)for(let t of(s.push(e.batchId),e.mutations))a=a.add(t.key);return e.localDocuments.getDocuments(n,a).next(e=>({Ns:e,removedBatchIds:i,addedBatchIds:s}))})})}function rm(e){return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.li.getLastRemoteSnapshotVersion(t))}async function rg(e,t,n){let r=e.vs.get(t);try{n||await e.persistence.runTransaction("Release target",n?"readwrite":"readwrite-primary",t=>e.persistence.referenceDelegate.removeTarget(t,r))}catch(e){if(!el(e))throw e;v(rc,`Failed to update sequence numbers for target ${t}: ${e}`)}e.vs=e.vs.remove(t),e.Fs.delete(r.target)}function rp(e,t,n){let r=en.min(),i=tU();return e.persistence.runTransaction("Execute query","readwrite",s=>(function(e,t,n){let r=e.Fs.get(n);return void 0!==r?eo.resolve(e.vs.get(r)):e.li.getTargetData(t,n)})(e,s,tS(t)).next(t=>{if(t)return r=t.lastLimboFreeSnapshotVersion,e.li.getMatchingKeysForTargetId(s,t.targetId).next(e=>{i=e})}).next(()=>e.Cs.getDocumentsMatchingQuery(s,t,n?r:en.min(),n?i:tU())).next(n=>{var r;let s;return r=t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2)),s=e.Ms.get(r)||en.min(),n.forEach((e,t)=>{t.readTime.compareTo(s)>0&&(s=t.readTime)}),e.Ms.set(r,s),{documents:n,ks:i}}))}class ry{constructor(){this.activeTargetIds=tq}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){return JSON.stringify({activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()})}}class rv{constructor(){this.vo=new ry,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,n){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new ry,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rw{Mo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rE="ConnectivityMonitor";class rT{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){for(let e of(v(rE,"Network connectivity changed: AVAILABLE"),this.Lo))e(0)}Bo(){for(let e of(v(rE,"Network connectivity changed: UNAVAILABLE"),this.Lo))e(1)}static v(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let r_=null;function rS(){return null===r_?r_=268435456+Math.round(2147483648*Math.random()):r_++,"0x"+r_.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rI="RestConnection",rC={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class rb{get Ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Uo=`projects/${n}/databases/${r}`,this.$o=this.databaseId.database===eL?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Wo(e,t,n,r,i){let s=rS(),a=this.Qo(e,t.toUriEncodedString());v(rI,`Sending RPC '${e}' ${s}:`,a,n);let o={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(o,r,i);let{host:u}=new URL(a),h=(0,l.Xx)(u);return this.zo(e,a,o,n,h).then(t=>(v(rI,`Received RPC '${e}' ${s}: `,t),t),t=>{throw E(rI,`RPC '${e}' ${s} failed with error: `,t,"url: ",a,"request:",n),t})}jo(e,t,n,r,i,s){return this.Wo(e,t,n,r,i)}Go(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+m,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}Qo(e,t){let n=rC[e],r=`${this.qo}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(r=`${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),r}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rN{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rA="WebChannelConnection",rk=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(e){setTimeout(()=>{throw e},0)}})};class rD extends rb{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){rD.c_||(rk((0,c.FJ)(),c.ju.STAT_EVENT,e=>{e.stat===c.kN.PROXY?v(rA,"STAT_EVENT: detected buffering proxy"):e.stat===c.kN.NOPROXY&&v(rA,"STAT_EVENT: detected no buffering proxy")}),rD.c_=!0)}zo(e,t,n,r,i){let s=rS();return new Promise((i,a)=>{let o=new c.JJ;o.setWithCredentials(!0),o.listenOnce(c.tw.COMPLETE,()=>{try{switch(o.getLastErrorCode()){case c.jK.NO_ERROR:let t=o.getResponseJson();v(rA,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(t)),i(t);break;case c.jK.TIMEOUT:v(rA,`RPC '${e}' ${s} timed out`),a(new b(C.DEADLINE_EXCEEDED,"Request time out"));break;case c.jK.HTTP_ERROR:let n=o.getStatus();if(v(rA,`RPC '${e}' ${s} failed with status:`,n,"response text:",o.getResponseText()),n>0){let e=o.getResponseJson();Array.isArray(e)&&(e=e[0]);let t=e?.error;if(t&&t.status&&t.message){let e=function(e){let t=e.toLowerCase().replace(/_/g,"-");return Object.values(C).indexOf(t)>=0?t:C.UNKNOWN}(t.status);a(new b(e,t.message))}else a(new b(C.UNKNOWN,"Server responded with status "+o.getStatus()))}else a(new b(C.UNAVAILABLE,"Connection failed."));break;default:_(9055,{l_:e,streamId:s,h_:o.getLastErrorCode(),P_:o.getLastError()})}}finally{v(rA,`RPC '${e}' ${s} completed.`)}});let l=JSON.stringify(r);v(rA,`RPC '${e}' ${s} sending request:`,r),o.send(t,"POST",l,n,15)})}T_(e,t,n){let i=rS(),s=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),o={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;void 0!==l&&(o.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(o.useFetchStreams=!0),this.Go(o.initMessageHeaders,t,n),o.encodeInitMessageHeaders=!0;let u=s.join("");v(rA,`Creating RPC '${e}' stream ${i}: ${u}`,o);let h=a.createWebChannel(u,o);this.I_(h);let d=!1,f=!1,m=new rN({Jo:t=>{f?v(rA,`Not sending because RPC '${e}' stream ${i} is closed:`,t):(d||(v(rA,`Opening RPC '${e}' stream ${i} transport.`),h.open(),d=!0),v(rA,`RPC '${e}' stream ${i} sending:`,t),h.send(t))},Ho:()=>h.close()});return rk(h,c.ii.EventType.OPEN,()=>{f||(v(rA,`RPC '${e}' stream ${i} transport opened.`),m.i_())}),rk(h,c.ii.EventType.CLOSE,()=>{f||(f=!0,v(rA,`RPC '${e}' stream ${i} transport closed`),m.o_(),this.E_(h))}),rk(h,c.ii.EventType.ERROR,t=>{f||(f=!0,E(rA,`RPC '${e}' stream ${i} transport errored. Name:`,t.name,"Message:",t.message),m.o_(new b(C.UNAVAILABLE,"The operation could not be completed")))}),rk(h,c.ii.EventType.MESSAGE,t=>{if(!f){let n=t.data[0];I(!!n,16349);let s=n?.error||n[0]?.error;if(s){v(rA,`RPC '${e}' stream ${i} received error:`,s);let t=s.status,n=function(e){let t=r[e];if(void 0!==t)return no(t)}(t),a=s.message;"NOT_FOUND"===t&&a.includes("database")&&a.includes("does not exist")&&a.includes(this.databaseId.database)&&E(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),void 0===n&&(n=C.INTERNAL,a="Unknown error status: "+t+" with message "+s.message),f=!0,m.o_(new b(n,a)),h.close()}else v(rA,`RPC '${e}' stream ${i} received:`,n),m.__(n)}}),rD.u_(),setTimeout(()=>{m.s_()},0),m}terminate(){this.a_.forEach(e=>e.close()),this.a_=[]}I_(e){this.a_.push(e)}E_(e){this.a_=this.a_.filter(t=>t===e)}Go(e,t,n){super.Go(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return(0,c.UE)()}}function rR(){return"undefined"!=typeof document?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rx(e){return new nC(e,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */rD.c_=!1;class rV{constructor(e,t,n=1e3,r=1.5,i=6e4){this.Ci=e,this.timerId=t,this.R_=n,this.A_=r,this.V_=i,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();let t=Math.floor(this.d_+this.y_()),n=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-n);r>0&&v("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){null!==this.m_&&(this.m_.skipDelay(),this.m_=null)}cancel(){null!==this.m_&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rL="PersistentStream";class rO{constructor(e,t,n,r,i,s,a,o){this.Ci=e,this.S_=n,this.b_=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=a,this.listener=o,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new rV(e,t)}x_(){return 1===this.state||5===this.state||this.O_()}O_(){return 2===this.state||3===this.state}start(){this.F_=0,4!==this.state?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&null===this.C_&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}K_(e){this.q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.U_(),this.M_.cancel(),this.D_++,4!==e?this.M_.reset():t&&t.code===C.RESOURCE_EXHAUSTED?(w(t.toString()),w("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===C.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;let e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.D_===t&&this.G_(e,n)},t=>{e(()=>{let e=new b(C.UNKNOWN,"Fetching auth token failed: "+t.message);return this.z_(e)})})}G_(e,t){let n=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo(()=>{n(()=>this.listener.Zo())}),this.stream.Yo(()=>{n(()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.Yo()))}),this.stream.t_(e=>{n(()=>this.z_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.F_?this.J_(e):this.onNext(e))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return v(rL,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget(()=>this.D_===e?t():(v(rL,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class rM extends rO{constructor(e,t,n,r,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();let t=function(e,t){let n;if("targetChange"in t){var r,i;t.targetChange;let s="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:_(39313,{state:r}),a=t.targetChange.targetIds||[],o=(i=t.targetChange.resumeToken,e.useProto3Json?(I(void 0===i||"string"==typeof i,58123),eT.fromBase64String(i||"")):(I(void 0===i||i instanceof d||i instanceof Uint8Array,16193),eT.fromUint8Array(i||new Uint8Array))),l=t.targetChange.cause;n=new ny(s,a,o,l&&new b(void 0===l.code?C.UNKNOWN:no(l.code),l.message||"")||null)}else if("documentChange"in t){t.documentChange;let r=t.documentChange;r.document,r.document.name,r.document.updateTime;let i=nL(e,r.document.name),s=nk(r.document.updateTime),a=r.document.createTime?nk(r.document.createTime):en.min(),o=new e4({mapValue:{fields:r.document.fields}}),l=e6.newFoundDocument(i,s,a,o);n=new ng(r.targetIds||[],r.removedTargetIds||[],l.key,l)}else if("documentDelete"in t){t.documentDelete;let r=t.documentDelete;r.document;let i=nL(e,r.document),s=r.readTime?nk(r.readTime):en.min(),a=e6.newNoDocument(i,s);n=new ng([],r.removedTargetIds||[],a.key,a)}else if("documentRemove"in t){t.documentRemove;let r=t.documentRemove;r.document;let i=nL(e,r.document);n=new ng([],r.removedTargetIds||[],i,null)}else{if(!("filter"in t))return _(11601,{Vt:t});{t.filter;let e=t.filter;e.targetId;let{count:r=0,unchangedNames:i}=e,s=new na(r,i);n=new np(e.targetId,s)}}return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return en.min();let t=e.targetChange;return t.targetIds&&t.targetIds.length?en.min():t.readTime?nk(t.readTime):en.min()}(e);return this.listener.H_(t,n)}Z_(e){let t={};t.database=nM(this.serializer),t.addTarget=function(e,t){let n;let r=t.target;if((n=ty(r)?{documents:{documents:[nO(e,r.path)]}}:{query:function(e,t){var n,r;let i;let s={structuredQuery:{}},a=t.path;null!==t.collectionGroup?(i=a,s.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=a.popLast(),s.structuredQuery.from=[{collectionId:a.lastSegment()}]),s.parent=nO(e,i);let o=function(e){if(0!==e.length)return function e(t){return t instanceof tt?function(e){if("=="===e.op){if(eZ(e.value))return{unaryFilter:{field:nU(e.field),op:"IS_NAN"}};if(eX(e.value))return{unaryFilter:{field:nU(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(eZ(e.value))return{unaryFilter:{field:nU(e.field),op:"IS_NOT_NAN"}};if(eX(e.value))return{unaryFilter:{field:nU(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:nU(e.field),op:nS[e.op],value:e.value}}}(t):t instanceof tn?function(t){let n=t.getFilters().map(t=>e(t));return 1===n.length?n[0]:{compositeFilter:{op:nI[t.op],filters:n}}}(t):_(54877,{filter:t})}(tn.create(e,"and"))}(t.filters);o&&(s.structuredQuery.where=o);let l=function(e){if(0!==e.length)return e.map(e=>({field:nU(e.field),direction:n_[e.dir]}))}(t.orderBy);l&&(s.structuredQuery.orderBy=l);let u=nb(e,t.limit);return null!==u&&(s.structuredQuery.limit=u),t.startAt&&(s.structuredQuery.startAt={before:(n=t.startAt).inclusive,values:n.position}),t.endAt&&(s.structuredQuery.endAt={before:!(r=t.endAt).inclusive,values:r.position}),{ft:s,parent:i}}(e,r).ft}).targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=nA(e,t.resumeToken);let r=nb(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(en.min())>0){n.readTime=nN(e,t.snapshotVersion.toTimestamp());let r=nb(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);let n=function(e,t){let n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return _(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.K_(t)}X_(e){let t={};t.database=nM(this.serializer),t.removeTarget=e,this.K_(t)}}class rF extends rO{constructor(e,t,n,r,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return I(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,I(!e.writeResults||0===e.writeResults.length,55816),this.listener.ta()}onNext(e){var t,n;I(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();let r=(t=e.writeResults,n=e.commitTime,t&&t.length>0?(I(void 0!==n,14353),t.map(e=>{let t;return(t=e.updateTime?nk(e.updateTime):nk(n)).isEqual(en.min())&&(t=nk(n)),new tZ(t,e.transformResults||[])})):[]),i=nk(e.commitTime);return this.listener.na(i,r)}ra(){let e={};e.database=nM(this.serializer),this.K_(e)}ea(e){let t={streamToken:this.lastStreamToken,writes:e.map(e=>(function(e,t){var n;let r;if(t instanceof t9)r={update:nP(e,t.key,t.value)};else if(t instanceof nt)r={delete:nV(e,t.key)};else if(t instanceof t5)r={update:nP(e,t.key,t.data),updateMask:function(e){let t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}(t.fieldMask)};else{if(!(t instanceof nn))return _(16599,{dt:t.type});r={verify:nV(e,t.key)}}return t.fieldTransforms.length>0&&(r.updateTransforms=t.fieldTransforms.map(e=>(function(e,t){let n=t.transform;if(n instanceof tG)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof tj)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof tH)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof tY)return{fieldPath:t.field.canonicalString(),increment:n.Ae};throw _(20930,{transform:t.transform})})(0,e))),t.precondition.isNone||(r.currentDocument=void 0!==(n=t.precondition).updateTime?{updateTime:nN(e,n.updateTime.toTimestamp())}:void 0!==n.exists?{exists:n.exists}:_(27497)),r})(this.serializer,e))};this.K_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rP{}class rU extends rP{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new b(C.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Wo(e,nR(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new b(C.UNKNOWN,e.toString())})}jo(e,t,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.jo(e,nR(t,n),r,s,a,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new b(C.UNKNOWN,e.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class rq{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){0===this.oa&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){"Online"===this.state?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,"Online"===e&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(w(t),this.aa=!1):v("OnlineStateTracker",t)}Pa(){null!==this._a&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let r$="RemoteStore";class rz{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Map,this.Ra=new Map,this.Aa=new nY(1e3),this.Va=new nY(1001),this.da=new Set,this.ma=[],this.fa=i,this.fa.Mo(e=>{n.enqueueAndForget(async()=>{rX(this)&&(v(r$,"Restarting streams for network reachability change."),await async function(e){e.da.add(4),await rK(e),e.ga.set("Unknown"),e.da.delete(4),await rB(e)}(this))})}),this.ga=new rq(n,r)}}async function rB(e){if(rX(e))for(let t of e.ma)await t(!0)}async function rK(e){for(let t of e.ma)await t(!1)}function rG(e,t){return e.Ea.get(t)||void 0}function rj(e,t){let n=rG(e,t.targetId);if(void 0!==n&&e.Ia.has(n))return;let r=function(e,t){let n=rG(e,t);void 0!==n&&e.Ra.delete(n);let r=t%2!=0?e.Va.next():e.Aa.next();return e.Ea.set(t,r),e.Ra.set(r,t),r}(e,t.targetId);v(r$,"remoteStoreListen mapping SDK target ID to remote",t.targetId,r);let i=new nB(t.target,r,t.purpose,t.sequenceNumber,t.snapshotVersion,t.lastLimboFreeSnapshotVersion,t.resumeToken);e.Ia.set(r,i),rJ(e)?rY(e):is(e).O_()&&rH(e,i)}function rQ(e,t){let n=is(e),r=rG(e,t);v(r$,"remoteStoreUnlisten removing mapping of SDK target ID to remote",t,r),e.Ia.delete(r),e.Ea.delete(t),e.Ra.delete(r),n.O_()&&rW(e,r),0===e.Ia.size&&(n.O_()?n.L_():rX(e)&&e.ga.set("Unknown"))}function rH(e,t){if(e.pa.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(en.min())>0){let n=e.Ra.get(t.targetId);if(void 0===n)return void v(r$,"SDK target ID not found for remote ID: "+t.targetId);let r=e.remoteSyncer.getRemoteKeysForTarget(n).size;t=t.withExpectedCount(r)}is(e).Z_(t)}function rW(e,t){e.pa.$e(t),is(e).X_(t)}function rY(e){e.pa=new nw({getRemoteKeysForTarget:t=>{let n=e.Ra.get(t);return void 0!==n?e.remoteSyncer.getRemoteKeysForTarget(n):tU()},At:t=>e.Ia.get(t)||null,ht:()=>e.datastore.serializer.databaseId}),is(e).start(),e.ga.ua()}function rJ(e){return rX(e)&&!is(e).x_()&&e.Ia.size>0}function rX(e){return 0===e.da.size}async function rZ(e){e.ga.set("Online")}async function r0(e){e.Ia.forEach((t,n)=>{rH(e,t)})}async function r1(e,t){e.pa=void 0,rJ(e)?(e.ga.ha(t),rY(e)):e.ga.set("Unknown")}async function r2(e,t,n){if(e.ga.set("Online"),t instanceof ny&&2===t.state&&t.cause)try{await async function(e,t){let n=t.cause;for(let r of t.targetIds){if(e.Ia.has(r)){let t=e.Ra.get(r);void 0!==t&&(await e.remoteSyncer.rejectListen(t,n),e.Ea.delete(t),e.Ra.delete(r)),e.Ia.delete(r)}e.pa.removeTarget(r)}}(e,t)}catch(n){v(r$,"Failed to remove targets %s: %s ",t.targetIds.join(","),n),await r3(e,n)}else if(t instanceof ng?e.pa.Xe(t):t instanceof np?e.pa.st(t):e.pa.tt(t),!n.isEqual(en.min()))try{let t=await rm(e.localStore);n.compareTo(t)>=0&&await function(e,t){let n=e.pa.Tt(t);n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){let i=e.Ia.get(r);i&&e.Ia.set(r,i.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{let r=e.Ia.get(t);if(!r)return;e.Ia.set(t,r.withResumeToken(eT.EMPTY_BYTE_STRING,r.snapshotVersion)),rW(e,t);let i=new nB(r.target,t,n,r.sequenceNumber);rH(e,i)});let r=function(e,t){let n=new Map;t.targetChanges.forEach((t,r)=>{let i=e.Ra.get(r);void 0!==i&&n.set(i,t)});let r=new em(F);return t.targetMismatches.forEach((t,n)=>{let i=e.Ra.get(t);void 0!==i&&(r=r.insert(i,n))}),new nf(t.snapshotVersion,n,r,t.documentUpdates,t.resolvedLimboDocuments)}(e,n);return e.remoteSyncer.applyRemoteEvent(r)}(e,n)}catch(t){v(r$,"Failed to raise snapshot:",t),await r3(e,t)}}async function r3(e,t,n){if(!el(t))throw t;e.da.add(1),await rK(e),e.ga.set("Offline"),n||(n=()=>rm(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{v(r$,"Retrying IndexedDB access"),await n(),e.da.delete(1),await rB(e)})}function r4(e,t){return t().catch(n=>r3(e,n,t))}async function r6(e){let t=ia(e),n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:-1;for(;rX(e)&&e.Ta.length<10;)try{let r=await function(e,t){return e.persistence.runTransaction("Get next mutation batch","readonly",n=>(void 0===t&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(n,t)))}(e.localStore,n);if(null===r){0===e.Ta.length&&t.L_();break}n=r.batchId,function(e,t){e.Ta.push(t);let n=ia(e);n.O_()&&n.Y_&&n.ea(t.mutations)}(e,r)}catch(t){await r3(e,t)}r9(e)&&r5(e)}function r9(e){return rX(e)&&!ia(e).x_()&&e.Ta.length>0}function r5(e){ia(e).start()}async function r8(e){ia(e).ra()}async function r7(e){let t=ia(e);for(let n of e.Ta)t.ea(n.mutations)}async function ie(e,t,n){let r=e.Ta.shift(),i=ni.from(r,t,n);await r4(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await r6(e)}async function it(e,t){t&&ia(e).Y_&&await async function(e,t){var n;if(function(e){switch(e){case C.OK:return _(64938);case C.CANCELLED:case C.UNKNOWN:case C.DEADLINE_EXCEEDED:case C.RESOURCE_EXHAUSTED:case C.INTERNAL:case C.UNAVAILABLE:case C.UNAUTHENTICATED:return!1;case C.INVALID_ARGUMENT:case C.NOT_FOUND:case C.ALREADY_EXISTS:case C.PERMISSION_DENIED:case C.FAILED_PRECONDITION:case C.ABORTED:case C.OUT_OF_RANGE:case C.UNIMPLEMENTED:case C.DATA_LOSS:return!0;default:return _(15467,{code:e})}}(n=t.code)&&n!==C.ABORTED){let n=e.Ta.shift();ia(e).B_(),await r4(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await r6(e)}}(e,t),r9(e)&&r5(e)}async function ir(e,t){e.asyncQueue.verifyOperationInProgress(),v(r$,"RemoteStore received new credentials");let n=rX(e);e.da.add(3),await rK(e),n&&e.ga.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.da.delete(3),await rB(e)}async function ii(e,t){t?(e.da.delete(2),await rB(e)):t||(e.da.add(2),await rK(e),e.ga.set("Unknown"))}function is(e){var t,n,r;return e.ya||(e.ya=(t=e.datastore,n=e.asyncQueue,r={Zo:rZ.bind(null,e),Yo:r0.bind(null,e),t_:r1.bind(null,e),H_:r2.bind(null,e)},t.sa(),new rM(n,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,r)),e.ma.push(async t=>{t?(e.ya.B_(),rJ(e)?rY(e):e.ga.set("Unknown")):(await e.ya.stop(),e.pa=void 0)})),e.ya}function ia(e){var t,n,r;return e.wa||(e.wa=(t=e.datastore,n=e.asyncQueue,r={Zo:()=>Promise.resolve(),Yo:r8.bind(null,e),t_:it.bind(null,e),ta:r7.bind(null,e),na:ie.bind(null,e)},t.sa(),new rF(n,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,r)),e.ma.push(async t=>{t?(e.wa.B_(),await r6(e)):(await e.wa.stop(),e.Ta.length>0&&(v(r$,`Stopping write stream with ${e.Ta.length} pending writes`),e.Ta=[]))})),e.wa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new N,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){let s=new io(e,t,Date.now()+n,r,i);return s.start(n),s}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new b(C.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function il(e,t){if(w("AsyncQueue",`${t}: ${e}`),el(e))return new b(C.UNAVAILABLE,`${t}: ${e}`);throw e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iu{static emptySet(e){return new iu(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||j.comparator(t.key,n.key):(e,t)=>j.comparator(e.key,t.key),this.keyedMap=tL(),this.sortedSet=new em(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof iu)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){let e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){let e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){let n=new iu;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(){this.Sa=new em(j.comparator)}track(e){let t=e.doc.key,n=this.Sa.get(t);n?0!==e.type&&3===n.type?this.Sa=this.Sa.insert(t,e):3===e.type&&1!==n.type?this.Sa=this.Sa.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.Sa=this.Sa.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.Sa=this.Sa.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.Sa=this.Sa.remove(t):1===e.type&&2===n.type?this.Sa=this.Sa.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.Sa=this.Sa.insert(t,{type:2,doc:e.doc}):_(63341,{Vt:e,ba:n}):this.Sa=this.Sa.insert(t,e)}Da(){let e=[];return this.Sa.inorderTraversal((t,n)=>{e.push(n)}),e}}class ic{constructor(e,t,n,r,i,s,a,o,l){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=a,this.excludesMetadataChanges=o,this.hasCachedResults=l}static fromInitialDocuments(e,t,n,r,i){let s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new ic(e,t,iu.emptySet(t),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&tb(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let e=0;e<t.length;e++)if(t[e].type!==n[e].type||!t[e].doc.isEqual(n[e].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class id{constructor(){this.Ca=void 0,this.va=[]}Fa(){return this.va.some(e=>e.Ma())}}class im{constructor(){this.queries=ig(),this.onlineState="Unknown",this.xa=new Set}terminate(){!function(e,t){let n=e.queries;e.queries=ig(),n.forEach((e,n)=>{for(let e of n.va)e.onError(t)})}(this,new b(C.ABORTED,"Firestore shutting down"))}}function ig(){return new tR(e=>tN(e),tb)}async function ip(e,t){let n=3,r=t.query,i=e.queries.get(r);i?!i.Fa()&&t.Ma()&&(n=2):(i=new id,n=t.Ma()?0:1);try{switch(n){case 0:i.Ca=await e.onListen(r,!0);break;case 1:i.Ca=await e.onListen(r,!1);break;case 2:await e.onFirstRemoteStoreListen(r)}}catch(n){let e=il(n,`Initialization of query '${tA(t.query)}' failed`);return void t.onError(e)}e.queries.set(r,i),i.va.push(t),t.Oa(e.onlineState),i.Ca&&t.Na(i.Ca)&&iE(e)}async function iy(e,t){let n=t.query,r=3,i=e.queries.get(n);if(i){let e=i.va.indexOf(t);e>=0&&(i.va.splice(e,1),0===i.va.length?r=t.Ma()?0:1:!i.Fa()&&t.Ma()&&(r=2))}switch(r){case 0:return e.queries.delete(n),e.onUnlisten(n,!0);case 1:return e.queries.delete(n),e.onUnlisten(n,!1);case 2:return e.onLastRemoteStoreUnlisten(n);default:return}}function iv(e,t){let n=!1;for(let r of t){let t=r.query,i=e.queries.get(t);if(i){for(let e of i.va)e.Na(r)&&(n=!0);i.Ca=r}}n&&iE(e)}function iw(e,t,n){let r=e.queries.get(t);if(r)for(let e of r.va)e.onError(n);e.queries.delete(t)}function iE(e){e.xa.forEach(e=>{e.next()})}(a=s||(s={})).Ba="default",a.Cache="cache";class iT{constructor(e,t,n){this.query=e,this.La=t,this.ka=!1,this.Ka=null,this.onlineState="Unknown",this.options=n||{}}Na(e){if(!this.options.includeMetadataChanges){let t=[];for(let n of e.docChanges)3!==n.type&&t.push(n);e=new ic(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.ka?this.qa(e)&&(this.La.next(e),t=!0):this.Ua(e,this.onlineState)&&(this.$a(e),t=!0),this.Ka=e,t}onError(e){this.La.error(e)}Oa(e){this.onlineState=e;let t=!1;return this.Ka&&!this.ka&&this.Ua(this.Ka,e)&&(this.$a(this.Ka),t=!0),t}Ua(e,t){return!(e.fromCache&&this.Ma())||(!this.options.Wa||!("Offline"!==t))&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}qa(e){if(e.docChanges.length>0)return!0;let t=this.Ka&&this.Ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}$a(e){e=ic.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.ka=!0,this.La.next(e)}Ma(){return this.options.source!==s.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i_{constructor(e){this.key=e}}class iS{constructor(e){this.key=e}}class iI{constructor(e,t){this.query=e,this.tu=t,this.nu=null,this.hasCachedResults=!1,this.current=!1,this.ru=tU(),this.mutatedKeys=tU(),this.iu=tD(e),this.su=new iu(this.iu)}get ou(){return this.tu}_u(e,t){let n=t?t.au:new ih,r=t?t.su:this.su,i=t?t.mutatedKeys:this.mutatedKeys,s=r,a=!1,o="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,l="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{let u=r.get(e),h=tk(this.query,t)?t:null,c=!!u&&this.mutatedKeys.has(u.key),d=!!h&&(h.hasLocalMutations||this.mutatedKeys.has(h.key)&&h.hasCommittedMutations),f=!1;u&&h?u.data.isEqual(h.data)?c!==d&&(n.track({type:3,doc:h}),f=!0):this.uu(u,h)||(n.track({type:2,doc:h}),f=!0,(o&&this.iu(h,o)>0||l&&0>this.iu(h,l))&&(a=!0)):!u&&h?(n.track({type:0,doc:h}),f=!0):u&&!h&&(n.track({type:1,doc:u}),f=!0,(o||l)&&(a=!0)),f&&(h?(s=s.add(h),i=d?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){let e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{su:s,au:n,bs:a,mutatedKeys:i}}uu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){let i=this.su;this.su=e.su,this.mutatedKeys=e.mutatedKeys;let s=e.au.Da();s.sort((e,t)=>(function(e,t){let n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return _(20277,{Vt:e})}};return n(e)-n(t)})(e.type,t.type)||this.iu(e.doc,t.doc)),this.cu(n),r=r??!1;let a=t&&!r?this.lu():[],o=0===this.ru.size&&this.current&&!r?1:0,l=o!==this.nu;return(this.nu=o,0!==s.length||l)?{snapshot:new ic(this.query,e.su,i,s,e.mutatedKeys,0===o,l,!1,!!n&&n.resumeToken.approximateByteSize()>0),hu:a}:{hu:a}}Oa(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({su:this.su,au:new ih,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{hu:[]}}Pu(e){return!this.tu.has(e)&&!!this.su.has(e)&&!this.su.get(e).hasLocalMutations}cu(e){e&&(e.addedDocuments.forEach(e=>this.tu=this.tu.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.tu=this.tu.delete(e)),this.current=e.current)}lu(){if(!this.current)return[];let e=this.ru;this.ru=tU(),this.su.forEach(e=>{this.Pu(e.key)&&(this.ru=this.ru.add(e.key))});let t=[];return e.forEach(e=>{this.ru.has(e)||t.push(new iS(e))}),this.ru.forEach(n=>{e.has(n)||t.push(new i_(n))}),t}Tu(e){this.tu=e.ks,this.ru=tU();let t=this._u(e.documents);return this.applyChanges(t,!0)}Iu(){return ic.fromInitialDocuments(this.query,this.su,this.mutatedKeys,0===this.nu,this.hasCachedResults)}}let iC="SyncEngine";class ib{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class iN{constructor(e){this.key=e,this.Eu=!1}}class iA{constructor(e,t,n,r,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.Ru={},this.Au=new tR(e=>tN(e),tb),this.Vu=new Map,this.du=new Set,this.mu=new em(j.comparator),this.fu=new Map,this.gu=new n8,this.pu={},this.yu=new Map,this.wu=nY.ar(),this.onlineState="Unknown",this.Su=void 0}get isPrimaryClient(){return!0===this.Su}}async function ik(e,t,n=!0){let r;let i=iY(e),s=i.Au.get(t);return s?(i.sharedClientState.addLocalQueryTarget(s.targetId),r=s.view.Iu()):r=await iR(i,t,n,!0),r}async function iD(e,t){let n=iY(e);await iR(n,t,!0,!1)}async function iR(e,t,n,r){var i,s;let a;let o=await (i=e.localStore,s=tS(t),i.persistence.runTransaction("Allocate target","readwrite",e=>{let t;return i.li.getTargetData(e,s).next(n=>n?(t=n,eo.resolve(t)):i.li.allocateTargetId(e).next(n=>(t=new nB(s,n,"TargetPurposeListen",e.currentSequenceNumber),i.li.addTargetData(e,t).next(()=>t))))}).then(e=>{let t=i.vs.get(e.targetId);return(null===t||e.snapshotVersion.compareTo(t.snapshotVersion)>0)&&(i.vs=i.vs.insert(e.targetId,e),i.Fs.set(s,e.targetId)),e})),l=o.targetId,u=e.sharedClientState.addLocalQueryTarget(l,n);return r&&(a=await ix(e,t,l,"current"===u,o.resumeToken)),e.isPrimaryClient&&n&&rj(e.remoteStore,o),a}async function ix(e,t,n,r,i){e.bu=(t,n,r)=>(async function(e,t,n,r){let i=t.view._u(n);i.bs&&(i=await rp(e.localStore,t.query,!1).then(({documents:e})=>t.view._u(e,i)));let s=r&&r.targetChanges.get(t.targetId),a=r&&null!=r.targetMismatches.get(t.targetId),o=t.view.applyChanges(i,e.isPrimaryClient,s,a);return iG(e,t.targetId,o.hu),o.snapshot})(e,t,n,r);let s=await rp(e.localStore,t,!0),a=new iI(t,s.ks),o=a._u(s.documents),l=nm.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,i),u=a.applyChanges(o,e.isPrimaryClient,l);iG(e,n,u.hu);let h=new ib(t,n,a);return e.Au.set(t,h),e.Vu.has(n)?e.Vu.get(n).push(t):e.Vu.set(n,[t]),u.snapshot}async function iV(e,t,n){let r=e.Au.get(t),i=e.Vu.get(r.targetId);if(i.length>1)return e.Vu.set(r.targetId,i.filter(e=>!tb(e,t))),void e.Au.delete(t);e.isPrimaryClient?(e.sharedClientState.removeLocalQueryTarget(r.targetId),e.sharedClientState.isActiveQueryTarget(r.targetId)||await rg(e.localStore,r.targetId,!1).then(()=>{e.sharedClientState.clearQueryState(r.targetId),n&&rQ(e.remoteStore,r.targetId),iB(e,r.targetId)}).catch(ea)):(iB(e,r.targetId),await rg(e.localStore,r.targetId,!0))}async function iL(e,t){let n=e.Au.get(t),r=e.Vu.get(n.targetId);e.isPrimaryClient&&1===r.length&&(e.sharedClientState.removeLocalQueryTarget(n.targetId),rQ(e.remoteStore,n.targetId))}async function iO(e,t,n){var r;let i=(e.remoteStore.remoteSyncer.applySuccessfulWrite=iU.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=iq.bind(null,e),e);try{let e;let s=await function(e,t){let n,r;let i=et.now(),s=t.reduce((e,t)=>e.add(t.key),tU());return e.persistence.runTransaction("Locally write mutations","readwrite",a=>{let o=tx,l=tU();return e.xs.getEntries(a,s).next(e=>{(o=e).forEach((e,t)=>{t.isValidDocument()||(l=l.add(e))})}).next(()=>e.localDocuments.getOverlayedDocuments(a,o)).next(r=>{n=r;let s=[];for(let e of t){let t=function(e,t){let n=null;for(let r of e.fieldTransforms){let e=t.data.field(r.field),i=tK(r.transform,e||null);null!=i&&(null===n&&(n=e4.empty()),n.set(r.field,i))}return n||null}(e,n.get(e.key).overlayedDocument);null!=t&&s.push(new t5(e.key,t,function e(t){let n=[];return ed(t.fields,(t,r)=>{let i=new G([t]);if(e0(r)){let t=e(r.mapValue).fields;if(0===t.length)n.push(i);else for(let e of t)n.push(i.child(e))}else n.push(i)}),new ew(n)}(t.value.mapValue),t0.exists(!0)))}return e.mutationQueue.addMutationBatch(a,i,s,t)}).next(t=>{r=t;let i=t.applyToLocalDocumentSet(n,l);return e.documentOverlayCache.saveOverlays(a,t.batchId,i)})}).then(()=>({batchId:r.batchId,changes:tO(n)}))}(i.localStore,t);i.sharedClientState.addPendingMutation(s.batchId),r=s.batchId,(e=i.pu[i.currentUser.toKey()])||(e=new em(F)),e=e.insert(r,n),i.pu[i.currentUser.toKey()]=e,await iQ(i,s.changes),await r6(i.remoteStore)}catch(t){let e=il(t,"Failed to persist write");n.reject(e)}}async function iM(e,t){try{let n=await function(e,t){let n=t.snapshotVersion,r=e.vs;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{var s;let a,o;let l=e.xs.newChangeBuffer({trackRemovals:!0});r=e.vs;let u=[];t.targetChanges.forEach((s,a)=>{var o;let l=r.get(a);if(!l)return;u.push(e.li.removeMatchingKeys(i,s.removedDocuments,a).next(()=>e.li.addMatchingKeys(i,s.addedDocuments,a)));let h=l.withSequenceNumber(i.currentSequenceNumber);null!==t.targetMismatches.get(a)?h=h.withResumeToken(eT.EMPTY_BYTE_STRING,en.min()).withLastLimboFreeSnapshotVersion(en.min()):s.resumeToken.approximateByteSize()>0&&(h=h.withResumeToken(s.resumeToken,n)),r=r.insert(a,h),o=h,(0===l.resumeToken.approximateByteSize()||o.snapshotVersion.toMicroseconds()-l.snapshotVersion.toMicroseconds()>=3e8||s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size>0)&&u.push(e.li.updateTargetData(i,h))});let h=tx,c=tU();if(t.documentUpdates.forEach(n=>{t.resolvedLimboDocuments.has(n)&&u.push(e.persistence.referenceDelegate.updateLimboDocument(i,n))}),u.push((s=t.documentUpdates,a=tU(),o=tU(),s.forEach(e=>a=a.add(e)),l.getEntries(i,a).next(e=>{let t=tx;return s.forEach((n,r)=>{let i=e.get(n);r.isFoundDocument()!==i.isFoundDocument()&&(o=o.add(n)),r.isNoDocument()&&r.version.isEqual(en.min())?(l.removeEntry(n,r.readTime),t=t.insert(n,r)):!i.isValidDocument()||r.version.compareTo(i.version)>0||0===r.version.compareTo(i.version)&&i.hasPendingWrites?(l.addEntry(r),t=t.insert(n,r)):v(rc,"Ignoring outdated watch update for ",n,". Current version:",i.version," Watch version:",r.version)}),{Bs:t,Ls:o}})).next(e=>{h=e.Bs,c=e.Ls})),!n.isEqual(en.min())){let t=e.li.getLastRemoteSnapshotVersion(i).next(t=>e.li.setTargetsMetadata(i,i.currentSequenceNumber,n));u.push(t)}return eo.waitFor(u).next(()=>l.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,h,c)).next(()=>h)}).then(t=>(e.vs=r,t))}(e.localStore,t);t.targetChanges.forEach((t,n)=>{let r=e.fu.get(n);r&&(I(t.addedDocuments.size+t.modifiedDocuments.size+t.removedDocuments.size<=1,22616),t.addedDocuments.size>0?r.Eu=!0:t.modifiedDocuments.size>0?I(r.Eu,14607):t.removedDocuments.size>0&&(I(r.Eu,42227),r.Eu=!1))}),await iQ(e,n,t)}catch(e){await ea(e)}}function iF(e,t,n){var r;if(e.isPrimaryClient&&0===n||!e.isPrimaryClient&&1===n){let n;let i=[];e.Au.forEach((e,n)=>{let r=n.view.Oa(t);r.snapshot&&i.push(r.snapshot)}),(r=e.eventManager).onlineState=t,n=!1,r.queries.forEach((e,r)=>{for(let e of r.va)e.Oa(t)&&(n=!0)}),n&&iE(r),i.length&&e.Ru.H_(i),e.onlineState=t,e.isPrimaryClient&&e.sharedClientState.setOnlineState(t)}}async function iP(e,t,n){e.sharedClientState.updateQueryState(t,"rejected",n);let r=e.fu.get(t),i=r&&r.key;if(i){let n=new em(j.comparator);n=n.insert(i,e6.newNoDocument(i,en.min()));let r=tU().add(i),s=new nf(en.min(),new Map,new em(F),n,r);await iM(e,s),e.mu=e.mu.remove(i),e.fu.delete(t),ij(e)}else await rg(e.localStore,t,!1).then(()=>iB(e,t,n)).catch(ea)}async function iU(e,t){var n;let r=t.batch.batchId;try{let i=await (n=e.localStore).persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{let r=t.batch.keys(),i=n.xs.newChangeBuffer({trackRemovals:!0});return(function(e,t,n,r){let i=n.batch,s=i.keys(),a=eo.resolve();return s.forEach(e=>{a=a.next(()=>r.getEntry(t,e)).next(t=>{let s=n.docVersions.get(e);I(null!==s,48541),0>t.version.compareTo(s)&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),a.next(()=>e.mutationQueue.removeMutationBatch(t,i))})(n,e,t,i).next(()=>i.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=tU();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))});iz(e,r,null),i$(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await iQ(e,i)}catch(e){await ea(e)}}async function iq(e,t,n){var r;try{let i=await (r=e.localStore).persistence.runTransaction("Reject batch","readwrite-primary",e=>{let n;return r.mutationQueue.lookupMutationBatch(e,t).next(t=>(I(null!==t,37113),n=t.keys(),r.mutationQueue.removeMutationBatch(e,t))).next(()=>r.mutationQueue.performConsistencyCheck(e)).next(()=>r.documentOverlayCache.removeOverlaysForBatchId(e,n,t)).next(()=>r.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,n)).next(()=>r.localDocuments.getDocuments(e,n))});iz(e,t,n),i$(e,t),e.sharedClientState.updateMutationState(t,"rejected",n),await iQ(e,i)}catch(e){await ea(e)}}function i$(e,t){(e.yu.get(t)||[]).forEach(e=>{e.resolve()}),e.yu.delete(t)}function iz(e,t,n){let r=e.pu[e.currentUser.toKey()];if(r){let i=r.get(t);i&&(n?i.reject(n):i.resolve(),r=r.remove(t)),e.pu[e.currentUser.toKey()]=r}}function iB(e,t,n=null){for(let r of(e.sharedClientState.removeLocalQueryTarget(t),e.Vu.get(t)))e.Au.delete(r),n&&e.Ru.Du(r,n);e.Vu.delete(t),e.isPrimaryClient&&e.gu.Gr(t).forEach(t=>{e.gu.containsKey(t)||iK(e,t)})}function iK(e,t){e.du.delete(t.path.canonicalString());let n=e.mu.get(t);null!==n&&(rQ(e.remoteStore,n),e.mu=e.mu.remove(t),e.fu.delete(n),ij(e))}function iG(e,t,n){for(let r of n)r instanceof i_?(e.gu.addReference(r.key,t),function(e,t){let n=t.key,r=n.path.canonicalString();e.mu.get(n)||e.du.has(r)||(v(iC,"New document in limbo: "+n),e.du.add(r),ij(e))}(e,r)):r instanceof iS?(v(iC,"Document no longer in limbo: "+r.key),e.gu.removeReference(r.key,t),e.gu.containsKey(r.key)||iK(e,r.key)):_(19791,{Cu:r})}function ij(e){for(;e.du.size>0&&e.mu.size<e.maxConcurrentLimboResolutions;){let t=e.du.values().next().value;e.du.delete(t);let n=new j(B.fromString(t)),r=e.wu.next();e.fu.set(r,new iN(n)),e.mu=e.mu.insert(n,r),rj(e.remoteStore,new nB(tS(tw(n.path)),r,"TargetPurposeLimboResolution",eu.ce))}}async function iQ(e,t,n){let r=[],i=[],s=[];e.Au.isEmpty()||(e.Au.forEach((a,o)=>{s.push(e.bu(o,t,n).then(t=>{if((t||n)&&e.isPrimaryClient){let r=t?!t.fromCache:n?.targetChanges.get(o.targetId)?.current;e.sharedClientState.updateQueryState(o.targetId,r?"current":"not-current")}if(t){r.push(t);let e=rl.Es(o.targetId,t);i.push(e)}}))}),await Promise.all(s),e.Ru.H_(r),await async function(e,t){try{await e.persistence.runTransaction("notifyLocalViewChanges","readwrite",n=>eo.forEach(t,t=>eo.forEach(t.Ts,r=>e.persistence.referenceDelegate.addReference(n,t.targetId,r)).next(()=>eo.forEach(t.Is,r=>e.persistence.referenceDelegate.removeReference(n,t.targetId,r)))))}catch(e){if(!el(e))throw e;v(rc,"Failed to update sequence numbers: "+e)}for(let n of t){let t=n.targetId;if(!n.fromCache){let n=e.vs.get(t),r=n.snapshotVersion,i=n.withLastLimboFreeSnapshotVersion(r);e.vs=e.vs.insert(t,i)}}}(e.localStore,i))}async function iH(e,t){if(!e.currentUser.isEqual(t)){v(iC,"User change. New user:",t.toKey());let n=await rf(e.localStore,t);e.currentUser=t,e.yu.forEach(e=>{e.forEach(e=>{e.reject(new b(C.CANCELLED,"'waitForPendingWrites' promise is rejected due to a user change."))})}),e.yu.clear(),e.sharedClientState.handleUserChange(t,n.removedBatchIds,n.addedBatchIds),await iQ(e,n.Ns)}}function iW(e,t){let n=e.fu.get(t);if(n&&n.Eu)return tU().add(n.key);{let n=tU(),r=e.Vu.get(t);if(!r)return n;for(let t of r){let r=e.Au.get(t);n=n.unionWith(r.view.ou)}return n}}function iY(e){return e.remoteStore.remoteSyncer.applyRemoteEvent=iM.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=iW.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=iP.bind(null,e),e.Ru.H_=iv.bind(null,e.eventManager),e.Ru.Du=iw.bind(null,e.eventManager),e}class iJ{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=rx(e.databaseInfo.databaseId),this.sharedClientState=this.Mu(e),this.persistence=this.xu(e),await this.persistence.start(),this.localStore=this.Ou(e),this.gcScheduler=this.Nu(e,this.localStore),this.indexBackfillerScheduler=this.Bu(e,this.localStore)}Nu(e,t){return null}Bu(e,t){return null}Ou(e){var t;return t=this.persistence,new rd(t,new rh,e.initialUser,this.serializer)}xu(e){return new ri(ra.Vi,this.serializer)}Mu(e){return new rv}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}iJ.provider={build:()=>new iJ};class iX extends iJ{constructor(e){super(),this.cacheSizeBytes=e}Nu(e,t){return I(this.persistence.referenceDelegate instanceof ro,46915),new n0(this.persistence.referenceDelegate.garbageCollector,e.asyncQueue,t)}xu(e){let t=void 0!==this.cacheSizeBytes?nW.withCacheSize(this.cacheSizeBytes):nW.DEFAULT;return new ri(e=>ro.Vi(e,t),this.serializer)}}class iZ{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>iF(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=iH.bind(null,this.syncEngine),await ii(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new im}createDatastore(e){let t=rx(e.databaseInfo.databaseId),n=new rD(e.databaseInfo);return new rU(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){var t;return t=this.localStore,new rz(t,this.datastore,e.asyncQueue,e=>iF(this.syncEngine,e,0),rT.v()?new rT:new rw)}createSyncEngine(e,t){return function(e,t,n,r,i,s,a){let o=new iA(e,t,n,r,i,s);return a&&(o.Su=!0),o}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await async function(e){v(r$,"RemoteStore shutting down."),e.da.add(5),await rK(e),e.fa.shutdown(),e.ga.set("Unknown")}(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}iZ.provider={build:()=>new iZ};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i0{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.ku(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.ku(this.observer.error,e):w("Uncaught Error in snapshot listener:",e.toString()))}Ku(){this.muted=!0}ku(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let i1="FirestoreClient";class i2{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=r,this.user=f.UNAUTHENTICATED,this.clientId=M.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async e=>{v(i1,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(v(i1,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();let e=new N;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){let t=il(n,"Failed to shutdown persistence");e.reject(t)}}),e.promise}}async function i3(e,t){e.asyncQueue.verifyOperationInProgress(),v(i1,"Initializing OfflineComponentProvider");let n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await rf(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function i4(e,t){e.asyncQueue.verifyOperationInProgress();let n=await i6(e);v(i1,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>ir(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>ir(t.remoteStore,n)),e._onlineComponents=t}async function i6(e){if(!e._offlineComponents){if(e._uninitializedComponentsProvider){v(i1,"Using user provided OfflineComponentProvider");try{await i3(e,e._uninitializedComponentsProvider._offline)}catch(t){if(!("FirebaseError"===t.name?t.code===C.FAILED_PRECONDITION||t.code===C.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw t;E("Error using user provided cache. Falling back to memory cache: "+t),await i3(e,new iJ)}}else v(i1,"Using default OfflineComponentProvider"),await i3(e,new iX(void 0))}return e._offlineComponents}async function i9(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(v(i1,"Using user provided OnlineComponentProvider"),await i4(e,e._uninitializedComponentsProvider._online)):(v(i1,"Using default OnlineComponentProvider"),await i4(e,new iZ))),e._onlineComponents}async function i5(e){let t=await i9(e),n=t.eventManager;return n.onListen=ik.bind(null,t.syncEngine),n.onUnlisten=iV.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=iD.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=iL.bind(null,t.syncEngine),n}function i8(e,t,n,r){let i=new i0(r),s=new iT(t,i,n);return e.asyncQueue.enqueueAndForget(async()=>ip(await i5(e),s)),()=>{i.Ku(),e.asyncQueue.enqueueAndForget(async()=>iy(await i5(e),s))}}function i7(e,t,n={}){let r=new N;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,n,r,i){let s=new i0({next:n=>{s.Ku(),t.enqueueAndForget(()=>iy(e,a)),n.fromCache&&"server"===r.source?i.reject(new b(C.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:e=>i.reject(e)}),a=new iT(n,s,{includeMetadataChanges:!0,Wa:!0});return ip(e,a)})(await i5(e),e.asyncQueue,t,n,r)),r.promise}function se(e,t){let n=new N;return e.asyncQueue.enqueueAndForget(async()=>iO(await i9(e).then(e=>e.syncEngine),t,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sn=new Map,sr="firestore.googleapis.com";class si{constructor(e){if(void 0===e.host){if(void 0!==e.ssl)throw new b(C.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=sr,this.ssl=!0}else this.host=e.host,this.ssl=e.ssl??!0;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new b(C.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(e,t,n,r){if(!0===t&&!0===r)throw new b(C.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=st(e.experimentalLongPollingOptions??{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new b(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new b(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new b(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,n;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ss{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new si({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new b(C.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new b(C.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new si(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new k;switch(e.type){case"firstParty":return new V(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new b(C.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=sn.get(e);t&&(v("ComponentProvider","Removing Datastore"),sn.delete(e),t.terminate())}(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sa{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new sa(this.firestore,e,this._query)}}class so{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new sl(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new so(this.firestore,e,this._key)}toJSON(){return{type:so._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(ee(t,so._jsonSchema))return new so(e,n||null,new j(B.fromString(t.referencePath)))}}so._jsonSchemaVersion="firestore/documentReference/1.0",so._jsonSchema={type:Z("string",so._jsonSchemaVersion),referencePath:Z("string")};class sl extends sa{constructor(e,t,n){super(e,t,tw(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new so(this.firestore,null,new j(e))}withConverter(e){return new sl(this.firestore,e,this._path)}}function su(e,t,...n){if(e=(0,l.m9)(e),Q("collection","path",t),e instanceof ss){let r=B.fromString(t,...n);return W(r),new sl(e,null,r)}{if(!(e instanceof so||e instanceof sl))throw new b(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child(B.fromString(t,...n));return W(r),new sl(e.firestore,null,r)}}function sh(e,t,...n){if(e=(0,l.m9)(e),1==arguments.length&&(t=M.newId()),Q("doc","path",t),e instanceof ss){let r=B.fromString(t,...n);return H(r),new so(e,null,new j(r))}{if(!(e instanceof so||e instanceof sl))throw new b(C.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child(B.fromString(t,...n));return H(r),new so(e.firestore,e instanceof sl?e.converter:null,new j(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sc="AsyncQueue";class sd{constructor(e=Promise.resolve()){this.rc=[],this.sc=!1,this.oc=[],this._c=null,this.ac=!1,this.uc=!1,this.cc=[],this.M_=new rV(this,"async_queue_retry"),this.lc=()=>{let e=rR();e&&v(sc,"Visibility state changed to "+e.visibilityState),this.M_.w_()},this.hc=e;let t=rR();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this.lc)}get isShuttingDown(){return this.sc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Pc(),this.Tc(e)}enterRestrictedMode(e){if(!this.sc){this.sc=!0,this.uc=e||!1;let t=rR();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.lc)}}enqueue(e){if(this.Pc(),this.sc)return new Promise(()=>{});let t=new N;return this.Tc(()=>this.sc&&this.uc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.rc.push(e),this.Ic()))}async Ic(){if(0!==this.rc.length){try{await this.rc[0](),this.rc.shift(),this.M_.reset()}catch(e){if(!el(e))throw e;v(sc,"Operation failed with retryable error: "+e)}this.rc.length>0&&this.M_.p_(()=>this.Ic())}}Tc(e){let t=this.hc.then(()=>(this.ac=!0,e().catch(e=>{throw this._c=e,this.ac=!1,w("INTERNAL UNHANDLED ERROR: ",sf(e)),e}).then(e=>(this.ac=!1,e))));return this.hc=t,t}enqueueAfterDelay(e,t,n){this.Pc(),this.cc.indexOf(e)>-1&&(t=0);let r=io.createAndSchedule(this,e,t,n,e=>this.Ec(e));return this.oc.push(r),r}Pc(){this._c&&_(47125,{Rc:sf(this._c)})}verifyOperationInProgress(){}async Ac(){let e;do e=this.hc,await e;while(e!==this.hc)}Vc(e){for(let t of this.oc)if(t.timerId===e)return!0;return!1}dc(e){return this.Ac().then(()=>{for(let t of(this.oc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs),this.oc))if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Ac()})}mc(e){this.cc.push(e)}Ec(e){let t=this.oc.indexOf(e);this.oc.splice(t,1)}}function sf(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t}class sm extends ss{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new sd,this._persistenceKey=r?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new sd(e),this._firestoreClient=void 0,await e}}}function sg(e,t){let n="object"==typeof e?e:(0,o.Mq)(),r=(0,o.qX)(n,"firestore").getImmediate({identifier:"string"==typeof e?e:t||eL});if(!r._initialized){let e=(0,l.P0)("firestore");e&&function(e,t,n,r={}){e=X(e,ss);let i=(0,l.Xx)(t),s=e._getSettings(),a={...s,emulatorOptions:e._getEmulatorOptions()},o=`${t}:${n}`;i&&(0,l.Uo)(`https://${o}`),s.host!==sr&&s.host!==o&&E("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let u={...s,host:o,ssl:i,emulatorOptions:r};if(!(0,l.vZ)(u,a)&&(e._setSettings(u),r.mockUserToken)){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=f.MOCK_USER;else{t=(0,l.Sg)(r.mockUserToken,e._app?.options.projectId);let i=r.mockUserToken.sub||r.mockUserToken.user_id;if(!i)throw new b(C.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new f(i)}e._authCredentials=new D(new A(t,n))}}(r,...e)}return r}function sp(e){if(e._terminated)throw new b(C.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||function(e){var t,n,r,i;let s=e._freezeSettings(),a=(t=e._databaseId,n=e._app?.options.appId||"",r=e._persistenceKey,i=e._app?.options.apiKey,new eV(t,n,r,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,st(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,i));e._componentsProvider||s.localCache?._offlineComponentProvider&&s.localCache?._onlineComponentProvider&&(e._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),e._firestoreClient=new i2(e._authCredentials,e._appCheckCredentials,e._queue,a,e._componentsProvider&&function(e){let t=e?._online.build();return{_offline:e?._offline.build(t),_online:t}}(e._componentsProvider))}(e),e._firestoreClient}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(e){this._byteString=e}static fromBase64String(e){try{return new sy(eT.fromBase64String(e))}catch(e){throw new b(C.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new sy(eT.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:sy._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ee(e,sy._jsonSchema))return sy.fromBase64String(e.bytes)}}sy._jsonSchemaVersion="firestore/bytes/1.0",sy._jsonSchema={type:Z("string",sy._jsonSchemaVersion),bytes:Z("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sv{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new b(C.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new G(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sw{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sE{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new b(C.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new b(C.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return F(this._lat,e._lat)||F(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:sE._jsonSchemaVersion}}static fromJSON(e){if(ee(e,sE._jsonSchema))return new sE(e.latitude,e.longitude)}}sE._jsonSchemaVersion="firestore/geoPoint/1.0",sE._jsonSchema={type:Z("string",sE._jsonSchemaVersion),latitude:Z("number"),longitude:Z("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:sT._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ee(e,sT._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new sT(e.vectorValues);throw new b(C.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}sT._jsonSchemaVersion="firestore/vectorValue/1.0",sT._jsonSchema={type:Z("string",sT._jsonSchemaVersion),vectorValues:Z("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let s_=/^__.*__$/;class sS{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new t5(e,this.data,this.fieldMask,t,this.fieldTransforms):new t9(e,this.data,t,this.fieldTransforms)}}class sI{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new t5(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function sC(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw _(40011,{dataSource:e})}}class sb{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.fc(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new sb({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}yc(e){let t=this.path?.child(e),n=this.i({path:t,arrayElement:!1});return n.wc(e),n}Sc(e){let t=this.path?.child(e),n=this.i({path:t,arrayElement:!1});return n.fc(),n}bc(e){return this.i({path:void 0,arrayElement:!0})}Dc(e){return s$(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}fc(){if(this.path)for(let e=0;e<this.path.length;e++)this.wc(this.path.get(e))}wc(e){if(0===e.length)throw this.Dc("Document fields must not be empty");if(sC(this.dataSource)&&s_.test(e))throw this.Dc('Document fields cannot begin and end with "__"')}}class sN{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||rx(e)}V(e,t,n,r=!1){return new sb({dataSource:e,methodName:t,targetDoc:n,path:G.emptyPath(),arrayElement:!1,hasConverter:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function sA(e){let t=e._freezeSettings(),n=rx(e._databaseId);return new sN(e._databaseId,!!t.ignoreUndefinedProperties,n)}function sk(e,t,n,r,i,s={}){let a,o;let l=e.V(s.merge||s.mergeFields?2:0,t,n,i);sF("Data must be an object, but it was:",l,r);let u=sO(r,l);if(s.merge)a=new ew(l.fieldMask),o=l.fieldTransforms;else if(s.mergeFields){let e=[];for(let r of s.mergeFields){let i=sP(t,r,n);if(!l.contains(i))throw new b(C.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);sz(e,i)||e.push(i)}a=new ew(e),o=l.fieldTransforms.filter(e=>a.covers(e.field))}else a=null,o=l.fieldTransforms;return new sS(new e4(u),a,o)}class sD extends sw{_toFieldTransform(e){if(2!==e.dataSource)throw 1===e.dataSource?e.Dc(`${this._methodName}() can only appear at the top level of your update data`):e.Dc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof sD}}function sR(e,t,n,r){let i=e.V(1,t,n);sF("Data must be an object, but it was:",i,r);let s=[],a=e4.empty();return ed(r,(e,r)=>{let o=sq(t,e,n);r=(0,l.m9)(r);let u=i.Sc(o);if(r instanceof sD)s.push(o);else{let e=sL(r,u);null!=e&&(s.push(o),a.set(o,e))}}),new sI(a,new ew(s),i.fieldTransforms)}function sx(e,t,n,r,i,s){let a=e.V(1,t,n),o=[sP(t,r,n)],u=[i];if(s.length%2!=0)throw new b(C.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<s.length;e+=2)o.push(sP(t,s[e])),u.push(s[e+1]);let h=[],c=e4.empty();for(let e=o.length-1;e>=0;--e)if(!sz(h,o[e])){let t=o[e],n=u[e];n=(0,l.m9)(n);let r=a.Sc(t);if(n instanceof sD)h.push(t);else{let e=sL(n,r);null!=e&&(h.push(t),c.set(t,e))}}return new sI(c,new ew(h),a.fieldTransforms)}function sV(e,t,n,r=!1){return sL(n,e.V(r?4:3,t))}function sL(e,t){if(sM(e=(0,l.m9)(e)))return sF("Unsupported field value:",t,e),sO(e,t);if(e instanceof sw)return function(e,t){if(!sC(t.dataSource))throw t.Dc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Dc(`${e._methodName}() is not currently supported inside arrays`);let n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.arrayElement&&4!==t.dataSource)throw t.Dc("Nested arrays are not supported");return function(e,t){let n=[],r=0;for(let i of e){let e=sL(i,t.bc(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){var n,r,i,s;if(null===(e=(0,l.m9)(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return n=t.serializer,"number"==typeof(i=r=e)&&Number.isInteger(i)&&!eh(i)&&i<=Number.MAX_SAFE_INTEGER&&i>=Number.MIN_SAFE_INTEGER?tz(r):t$(n,r);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){let n=et.fromDate(e);return{timestampValue:nN(t.serializer,n)}}if(e instanceof et){let n=new et(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:nN(t.serializer,n)}}if(e instanceof sE)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof sy)return{bytesValue:nA(t.serializer,e._byteString)};if(e instanceof so){let n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.Dc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:nD(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof sT)return{mapValue:{fields:{[eF]:{stringValue:eq},[e$]:{arrayValue:{values:((s=e)instanceof sT?s.toArray():s).map(e=>{if("number"!=typeof e)throw t.Dc("VectorValues must only contain numeric values.");return t$(t.serializer,e)})}}}}};if(nz(e))return e._toProto(t.serializer);throw t.Dc(`Unsupported field value: ${J(e)}`)}(e,t)}function sO(e,t){let n={};return ef(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):ed(e,(e,r)=>{let i=sL(r,t.yc(e));null!=i&&(n[e]=i)}),{mapValue:{fields:n}}}function sM(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof et||e instanceof sE||e instanceof sy||e instanceof so||e instanceof sw||e instanceof sT||nz(e))}function sF(e,t,n){if(!sM(n)||!Y(n)){let r=J(n);throw"an object"===r?t.Dc(e+" a custom object"):t.Dc(e+" "+r)}}function sP(e,t,n){if((t=(0,l.m9)(t))instanceof sv)return t._internalPath;if("string"==typeof t)return sq(e,t);throw s$("Field path arguments must be of type string or ",e,!1,void 0,n)}let sU=RegExp("[~\\*/\\[\\]]");function sq(e,t,n){if(t.search(sU)>=0)throw s$(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new sv(...t.split("."))._internalPath}catch(r){throw s$(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function s$(e,t,n,r,i){let s=r&&!r.isEmpty(),a=void 0!==i,o=`Function ${t}() called with invalid data`;n&&(o+=" (via `toFirestore()`)"),o+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${r}`),a&&(l+=` in document ${i}`),l+=")"),new b(C.INVALID_ARGUMENT,o+e+l)}function sz(e,t){return e.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sB{convertValue(e,t="none"){switch(ez(e)){case 0:return null;case 1:return e.booleanValue;case 2:return eI(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(eC(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw _(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let n={};return ed(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){return new sT(e.fields?.[e$].arrayValue?.values?.map(e=>eI(e.doubleValue)))}convertGeoPoint(e){return new sE(eI(e.latitude),eI(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":let n=eR(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(ex(e));default:return null}}convertTimestamp(e){let t=eS(e);return new et(t.seconds,t.nanos)}convertDocumentKey(e,t){let n=B.fromString(e);I(n$(n),9688,{name:e});let r=new eO(n.get(1),n.get(3)),i=new j(n.popFirst(5));return r.isEqual(t)||w(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sK extends sB{constructor(e){super(),this.firestore=e}convertBytes(e){return new sy(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new so(this.firestore,null,t)}}}}]);