import{c as r,b as l,j as a,L as i,d as n}from"./main-BRkQNSw8.js";import{L as d}from"./layout-dashboard-DApaAsIm.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]],h=r("user-round",x);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2",key:"4125el"}],["path",{d:"M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21",key:"1dpki6"}]],p=r("wallet-cards",m),g=[{href:"/account/dashboard",label:"Dashboard",icon:d},{href:"/account/bookings",label:"My Bookings",icon:p},{href:"/account/profile",label:"Profile",icon:h}];function y({title:o,description:c,children:s}){const t=l();return a.jsx("div",{className:"bg-[var(--color-gray-100)] pb-20 pt-28",children:a.jsxs("div",{className:"mx-auto max-w-7xl px-4",children:[a.jsxs("div",{className:"mb-8",children:[a.jsx("div",{className:"text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]",children:"Customer Portal"}),a.jsx("h1",{className:"mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]",children:o}),a.jsx("p",{className:"mt-3 text-[var(--color-gray-600)]",children:c})]}),a.jsxs("div",{className:"grid gap-8 lg:grid-cols-[280px_1fr]",children:[a.jsx("aside",{className:"rounded-[32px] border border-[var(--color-gray-200)] bg-white p-4 shadow-[0_20px_70px_rgba(10,22,40,0.08)]",children:g.map(e=>a.jsxs(i,{to:e.href,className:n("mb-2 flex items-center gap-3 rounded-[24px] px-4 py-4 text-sm font-medium transition",t.pathname===e.href?"bg-[var(--color-primary)] text-white":"text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]"),children:[a.jsx(e.icon,{className:"h-4 w-4"}),e.label]},e.href))}),a.jsx("div",{children:s})]})]})})}export{y as A};
