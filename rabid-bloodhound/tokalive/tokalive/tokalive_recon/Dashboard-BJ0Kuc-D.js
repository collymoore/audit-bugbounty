import{r as i,j as e,h as Le,L as Fe}from"./react-vendor-EdJM3XXU.js";import{q as O,c as S,w as T,l as ue,e as K,d as y,o as ne,h as Me,u as A,b as $,f as _,j as Ge}from"./fb-firestore-AmJ3MB_X.js";import{d as p,u as Oe}from"./index-D70ncfSl.js";import{a as Qe,C as xe}from"./BrandIcons-Dis4tMzP.js";import{L as Ve}from"./Logo-BDLK0u7M.js";import{S as Ue}from"./SEO-BdFakiDG.js";import{u as He,a as be,D as Ye,c as We,S as _e,v as Ke,b as Je,s as Xe,K as Ze,P as ea,d as aa,C as ta}from"./vendor-dnd-DKBYVLfu.js";import{Q as sa}from"./vendor-qrcode-B2_uTMqr.js";import{u as na}from"./usePresence-BJy4D1xq.js";import{A as ra}from"./vendor-driver-Bqothgl5.js";import{P as ia}from"./PilotRibbon-ooy5ZUcU.js";import{g as oa}from"./accountLabels-0-tyWJPI.js";import{a as la,b as ca,A as da,c as ga}from"./activityLifecycle-DSXc19Fb.js";import{p as ve,E as pa,P as ma,X as ha}from"./vendor-icons-Dn77n0aV.js";import"./fb-core-C5Q99qy-.js";import"./vendor-_yQiqF6F.js";import"./fb-auth-BRLnzcC0.js";function ua({orchestraId:l}){const[I,Q]=i.useState([]),[g,c]=i.useState([]),[z,L]=i.useState(!0),[h,F]=i.useState("requests");if(i.useEffect(()=>{l&&(async()=>{try{const b=O(S(p,"requests"),T("eventId","==",l),T("status","==","completed"),ue(50)),w=O(S(p,"challenges"),T("eventId","==",l),T("status","==","completed"),ue(50)),[x,E]=await Promise.all([K(b),K(w)]),v=x.docs.map(u=>({id:u.id,...u.data()})),M=E.docs.map(u=>({id:u.id,...u.data()}));v.sort((u,C)=>(C.completedAt?.seconds||0)-(u.completedAt?.seconds||0)),M.sort((u,C)=>(C.completedAt?.seconds||0)-(u.completedAt?.seconds||0)),Q(v),c(M)}catch(b){console.error("Error fetching history:",b)}finally{L(!1)}})()},[l]),z)return e.jsx("div",{className:"p-4 text-center",children:"Cargando historial..."});const D=d=>d?new Date(d.seconds*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"-";return e.jsxs("div",{className:"history-tab animate-fadeIn",children:[e.jsxs("div",{className:"history-tabs-nav",children:[e.jsxs("button",{className:`nav-btn ${h==="requests"?"active":""}`,onClick:()=>F("requests"),children:[e.jsx(Qe,{size:18})," Solicitudes"]}),e.jsxs("button",{className:`nav-btn ${h==="challenges"?"active":""}`,onClick:()=>F("challenges"),children:[e.jsx(xe,{size:18})," Challenges"]})]}),h==="requests"?e.jsxs("div",{className:"history-section",children:[e.jsx("h3",{className:"section-title",children:"Solicitudes Completadas (Últimas 50)"}),I.length===0?e.jsx("div",{className:"glass-card p-4 text-center text-gray-400",children:"No hay solicitudes completadas aún."}):e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"history-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Hora"}),e.jsx("th",{children:"Canción"}),e.jsx("th",{children:"Usuario"}),e.jsx("th",{children:"Dedicatoria"})]})}),e.jsx("tbody",{children:I.map(d=>e.jsxs("tr",{children:[e.jsx("td",{className:"time-col",children:D(d.completedAt)}),e.jsx("td",{className:"song-col",children:d.songTitle}),e.jsx("td",{className:"user-col",children:d.userName||"Anónimo"}),e.jsxs("td",{className:"dedication-col",children:[d.dedicationEmoji," ",d.dedication||"-"]})]},d.id))})]})})]}):e.jsxs("div",{className:"history-section",children:[e.jsx("h3",{className:"section-title",children:"Challenges Finalizados (Últimos 50)"}),g.length===0?e.jsx("div",{className:"glass-card p-4 text-center text-gray-400",children:"No hay challenges pasados."}):e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"history-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Hora"}),e.jsx("th",{children:"Ganador"}),e.jsx("th",{children:"Votos"}),e.jsx("th",{children:"Versus"})]})}),e.jsx("tbody",{children:g.map(d=>{const b=d.type==="genre",w=b?d.genreA:d.songA,x=b?d.genreB:d.songB;if(!w||!x)return null;const E=b?`${w.emoji||""} ${w.name}`.trim():w.title,v=b?`${x.emoji||""} ${x.name}`.trim():x.title,M=(w.votes||0)+(x.votes||0),u=b?d.winner===w.name:d.winner===w.id,C=d.winner==null?"—":u?E:v;return e.jsxs("tr",{children:[e.jsx("td",{className:"time-col",children:D(d.completedAt)}),e.jsxs("td",{className:"winner-col",children:["🏆 ",C]}),e.jsxs("td",{className:"votes-col",children:[M," votos"]}),e.jsxs("td",{className:"versus-col",children:[E," ",e.jsx("span",{className:"vs",children:"vs"})," ",v]})]},d.id)})})]})})]}),e.jsx("style",{children:`
                .history-tabs-nav {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 0.5rem;
                }

                .nav-btn {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 1rem;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .nav-btn:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }

                .nav-btn.active {
                    color: #00F2FE;
                    background: rgba(0, 242, 254, 0.1);
                }

                .history-section {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: var(--radius-xl);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1.5rem;
                    backdrop-filter: blur(10px);
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    color: white;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .history-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .history-table th {
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.6);
                    padding: 0.75rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .history-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.9);
                }

                .history-table tr:hover td {
                    background: rgba(255, 255, 255, 0.03);
                }

                .time-col { color: rgba(255, 255, 255, 0.5) !important; font-size: 0.85rem !important; }
                .song-col { font-weight: 600; }
                .email-sub { display: block; font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); }
                .dedication-col { font-style: italic; color: #FFD700 !important; }
                
                .winner-col { color: #FFD700 !important; font-weight: 700; }
                .votes-col { font-weight: 700; }
                .versus-col { color: rgba(255, 255, 255, 0.6) !important; font-size: 0.85rem !important; }
                .vs { color: rgba(255, 255, 255, 0.4); margin: 0 4px; font-size: 0.75rem; }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `})]})}const ba=()=>{ra({showProgress:!0,steps:[{element:"#dashboard-title",popover:{title:"👋 ¡Bienvenido a tu Panel!",description:"Aquí puedes controlar todo lo que ocurre en tu evento en tiempo real.",side:"bottom",align:"start"}},{element:"#profile-info",popover:{title:"👤 Tu Cuenta",description:"Usuario conectado actualmente. Asegúrate de que sea la cuenta correcta de la orquesta.",side:"bottom",align:"start"}},{element:"#connected-badge",popover:{title:"👥 Usuarios Conectados",description:"Este contador te dice cuántas personas tienen abierta la app ahora mismo. ¡Esperando para interactuar!",side:"bottom",align:"start"}},{element:"#revenue-stats",popover:{title:"📊 Tu Noche en Números",description:"El pulso de tu evento en vivo: personas conectadas, canciones en cola, pedidos recibidos y canciones tocadas. Se actualiza al instante.",side:"bottom",align:"start"}},{element:"#qr-button",popover:{title:"🖨️ Código QR",description:"Genera y descarga el QR para que el público lo escanee. Imprímelo o ponlo en las pantallas.",side:"bottom",align:"start"}},{element:"#tv-mode-btn",popover:{title:"📺 Modo TV",description:"Abre esta vista en una pantalla grande o proyector. Mostrará la canción actual y los ganadores de los challenges.",side:"bottom",align:"start"}},{element:"#pause-btn",popover:{title:"⏯️ Pausar/Reanudar",description:"¿Necesitas un descanso o terminó el set? Pausa las peticiones para que nadie pueda pedir mientas no tocas.",side:"bottom",align:"start"}},{element:"#settings-btn",popover:{title:"⚙️ Configuración",description:"Personaliza tu perfil, cambia tu logo, gestiona tu repertorio de canciones, crea listas especiales y verifica tu historial de actividades.",side:"bottom",align:"start"}},{element:"#challenge-btn",popover:{title:"🏆 Lanzar Challenge",description:"¡La función estrella! Pon a competir dos canciones y deja que el público vote (y pague) para ganar.",side:"top",align:"start"}},{element:"#dashboard-tabs",popover:{title:"📋 Gestión de Cola",description:'Alterna entre la "Cola Activa" (pedidos pendientes) y el "Historial" (lo que ya tocaste).',side:"top",align:"start"}}]}).drive()},re=[{name:"Merengue",emoji:"💃"},{name:"Bachata",emoji:"❤️"},{name:"Salsa",emoji:"🔥"},{name:"Reggaetón",emoji:"🎧"},{name:"Dembow",emoji:"⚡"},{name:"Pop Latino",emoji:"🎤"},{name:"Baladas",emoji:"🌹"},{name:"Rock",emoji:"🎸"},{name:"Pop",emoji:"🎙️"},{name:"Electrónica",emoji:"🎛️"},{name:"Hip-Hop",emoji:"🧢"},{name:"Jazz",emoji:"🎷"}];function xa({request:l,onReject:I,onSetPlaying:Q,onComplete:g}){const{attributes:c,listeners:z,setNodeRef:L,transform:h,transition:F}=aa({id:l.id}),D={transform:ta.Transform.toString(h),transition:F};return e.jsxs("div",{ref:L,style:D,className:"queue-item-orchestra glass-card",children:[e.jsx("div",{className:"drag-handle",...c,...z,children:e.jsx(pa,{size:20})}),e.jsxs("div",{className:"queue-item-content",children:[e.jsxs("div",{className:"queue-item-details",children:[e.jsx("h4",{children:l.songTitle}),e.jsxs("div",{className:"queue-item-meta",children:[l.requestType==="challenge"&&e.jsxs("span",{className:"badge badge-gold",children:[e.jsx(xe,{size:14})," Challenge ",l.votes?`(${l.votes})`:""]}),(l.requestType==="challenge"||l.tipAmount>0)&&e.jsxs("span",{className:"badge badge-gold",children:["💰 RD$",l.tipAmount||0]}),l.requestType==="priority"&&l.requestType!=="challenge"&&e.jsx("span",{className:"badge badge-primary",children:"⚡ Prioridad"}),l.dedication&&e.jsxs("div",{className:"dedication-preview",style:{display:"flex",alignItems:"center",gap:"5px",fontSize:"0.85rem",color:"#FFD700",marginTop:"5px",fontStyle:"italic"},children:[e.jsx("span",{children:l.dedicationEmoji||"💌"}),' "',l.dedication,'"']})]})]}),e.jsxs("div",{className:"queue-item-actions",children:[l.status==="pending"&&e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:"btn btn-sm btn-primary",onClick:()=>Q(l),children:[e.jsx(ma,{size:16})," Tocar"]}),e.jsx("button",{className:"btn btn-sm btn-outline",onClick:()=>I(l.id),children:e.jsx(ha,{size:16})})]}),l.status==="playing"&&e.jsxs("button",{className:"btn btn-sm btn-success",onClick:()=>g(l.id),children:[e.jsx(ve,{size:16})," Completar"]})]})]})]})}function Pa(){const{eventId:l}=Le(),{currentUser:I,logout:Q,orchestra:g}=Oe(),c=g?.id||l,[z,L]=i.useState([]),[h,F]=i.useState(null),[D,d]=i.useState({requests:0,played:0}),[b,w]=i.useState(null),[x,E]=i.useState(!1),[v,M]=i.useState([]),[u,C]=i.useState(!1),[B,ie]=i.useState("song"),[f,V]=i.useState({songA:null,songB:null}),[k,J]=i.useState({genreA:"",genreB:""}),[X,fe]=i.useState(120),[t,oe]=i.useState(null),[G,Z]=i.useState(0),[H,je]=i.useState(!1),q=g?.currentActivityId||null,[ye,le]=i.useState(!1),[ce,we]=i.useState(""),[U,ee]=i.useState("queue"),[P,ae]=i.useState(null),[Y,Ne]=i.useState(""),W=na(c,null),Ae=async()=>{try{const a=`${window.location.origin}/e/${c}`,s=await sa.toDataURL(a,{width:1e3,margin:2,color:{dark:"#000000",light:"#ffffff"}});we(s),le(!0)}catch(a){console.error("Error generating QR:",a),alert("Error al generar QR")}},Ce=()=>{const a=document.createElement("a");a.download=`qr-${g?.name||"tokalive"}.png`,a.href=ce,document.body.appendChild(a),a.click(),document.body.removeChild(a)},ke=He(be(ea),be(Ze,{coordinateGetter:Xe}));i.useEffect(()=>{if(!g?.currentActivityId)return;const a=y(p,"activities",g.currentActivityId),s=ne(a,n=>{if(n.exists()){const r=n.data();je(r.isRequestsPaused||!1),d({requests:r.revenue?.requests||0,played:Array.isArray(r.songsPlayed)?r.songsPlayed.length:0}),w(r.startedAt||null),ca(c,{id:n.id,...r})}});return()=>s()},[g,c]),i.useEffect(()=>{const a=O(S(p,"requests"),T("eventId","==",c),T("status","in",["pending","playing"]),Me("priority","desc")),s=ne(a,n=>{const r=n.docs.map(m=>({id:m.id,...m.data()})),o=r.find(m=>m.status==="playing"),j=r.filter(m=>m.status==="pending");F(o),L(j)});return()=>s()},[c]),i.useEffect(()=>{(async()=>{let s=O(S(p,"songs"),T("orchestraId","==",c)),n=await K(s);n.empty&&(console.log("Dashboard: No songs found with orchestraId, trying eventId (legacy)"),s=O(S(p,"songs"),T("eventId","==",c)),n=await K(s));const r=n.docs.map(o=>({id:o.id,...o.data()})).filter(o=>o.isActive!==!1);console.log(`Dashboard: Loaded ${r.length} songs for challenges`),M(r)})()},[c]),i.useEffect(()=>{const a=O(S(p,"challenges"),T("eventId","==",c),T("status","==","active")),s=ne(a,n=>{if(n.empty)oe(null),Z(0);else{const r=n.docs[0],o={id:r.id,...r.data()};if(oe(o),o.endsAt){const j=o.endsAt.toDate?o.endsAt.toDate():new Date(o.endsAt),m=Math.max(0,Math.floor((j-new Date)/1e3));Z(m)}}});return()=>s()},[c]);const te=i.useCallback(async()=>{if(t)try{const a=t.type||"song";let s,n;if(a==="song"?(s=t.songA.votes+t.songA.tipTotal/100,n=t.songB.votes+t.songB.tipTotal/100):a==="genre"&&(s=t.genreA.votes+t.genreA.tipTotal/100,n=t.genreB.votes+t.genreB.tipTotal/100),Math.abs(s-n)<.01&&!t.isOvertime){const N=new Date;N.setSeconds(N.getSeconds()+30),await A(y(p,"challenges",t.id),{endsAt:N,isOvertime:!0}),alert("⚖️ ¡EMPATE! Se han activado 30 segundos de MUERTE SÚBITA.");return}let r,o,j;const m=Math.abs(s-n)<.01?Math.random()>=.5:s>n;if(a==="song"){r=m?t.songA:t.songB,o=m?t.songA.votes:t.songB.votes,j=r.title;const N=t.songA.tipTotal+t.songB.tipTotal;await A(y(p,"challenges",t.id),{status:"completed",completedAt:$(),winner:r.id,winnerVotes:o}),await _(S(p,"requests"),{eventId:c,songId:r.id,songTitle:r.title,artist:r.artist||"",requestedAt:$(),status:"pending",priority:2e3,tipAmount:N,requestType:"challenge",challengeId:t.id,votes:o})}else a==="genre"&&(r=m?t.genreA:t.genreB,o=m?t.genreA.votes:t.genreB.votes,j=`${r.emoji} ${r.name}`,await A(y(p,"challenges",t.id),{status:"completed",completedAt:$(),winner:r.name,winnerVotes:o}),ae({genre:r.name,emoji:r.emoji,votes:o,timestamp:new Date}));a==="song"&&alert(`✅ Challenge finalizado! 🏆 Ganó: ${j}`)}catch(a){console.error("Error ending challenge:",a),alert("Error al finalizar challenge")}},[t,c]);i.useEffect(()=>{if(G>0){const a=setTimeout(()=>Z(G-1),1e3);return()=>clearTimeout(a)}else if(G===0&&t){const a=setTimeout(()=>te(),0);return()=>clearTimeout(a)}},[G,t,te]),i.useEffect(()=>{if(P){const a=setTimeout(()=>{ae(null)},3e4);return()=>clearTimeout(a)}},[P]);const Se=a=>{const{active:s,over:n}=a;s.id!==n.id&&L(r=>{const o=r.findIndex(N=>N.id===s.id),j=r.findIndex(N=>N.id===n.id),m=Je(r,o,j);return m.forEach((N,$e)=>{A(y(p,"requests",N.id),{priority:1e3-$e})}),m})},de=async a=>{const s=a.id;if(g?.type==="venue"){const n=a.spotifyId?`https://open.spotify.com/track/${a.spotifyId}`:`https://open.spotify.com/search/${encodeURIComponent(`${a.songTitle||""} ${a.artist||""}`.trim())}`;window.open(n,"_blank","noopener")}try{h&&await A(y(p,"requests",h.id),{status:"played"}),await A(y(p,"requests",s),{status:"playing"})}catch(n){console.error("Error setting playing:",n),alert("Error al cambiar canción")}},Te=async a=>{if(confirm("¿Rechazar esta solicitud?"))try{await A(y(p,"requests",a),{status:"rejected"})}catch(s){console.error("Error rejecting:",s)}},ge=async a=>{try{if(await A(y(p,"requests",a),{status:"completed",completedAt:$()}),g?.currentActivityId&&h){const s=y(p,"activities",g.currentActivityId);await A(s,{songsPlayed:Ge(h.songTitle||"Desconocida")}).catch(n=>console.error("Error updating activity songs:",n))}}catch(s){console.error("Error completing:",s),alert("Error al completar solicitud")}},ze=async a=>{try{await _(S(p,"requests"),{eventId:c,activityId:q,songId:a.id,songTitle:a.title,artist:a.artist||"",requestedAt:$(),status:"pending",priority:0,tipAmount:0,requestType:"orchestra"}),alert("✅ Canción añadida a la cola")}catch(s){console.error("Error adding song to queue:",s),alert("Error al añadir canción")}},Ee=async a=>{if(confirm(`¿Tocar "${a.title}" ahora mismo?`))try{h&&await A(y(p,"requests",h.id),{status:"played"}),await _(S(p,"requests"),{eventId:c,activityId:q,songId:a.id,songTitle:a.title,artist:a.artist||"",requestedAt:$(),status:"playing",priority:3e3,tipAmount:0,requestType:"orchestra"}),alert("▶️ Interpretando ahora: "+a.title)}catch(s){console.error("Error playing song immediately:",s),alert("Error al reproducir canción")}},Be=async()=>{if(B==="song"){if(!f.songA||!f.songB){alert("Selecciona 2 canciones para el challenge");return}}else if(B==="genre"){if(!k.genreA||!k.genreB){alert("Selecciona 2 géneros para el challenge");return}if(k.genreA===k.genreB){alert("Los géneros deben ser diferentes");return}}try{const a=new Date;a.setSeconds(a.getSeconds()+X);const s={eventId:c,type:B,startedAt:$(),endsAt:a,duration:X,status:"active"};if(B==="song")s.songA={id:f.songA.id,title:f.songA.title,artist:f.songA.artist||"",votes:0,tipTotal:0},s.songB={id:f.songB.id,title:f.songB.title,artist:f.songB.artist||"",votes:0,tipTotal:0};else if(B==="genre"){const n=r=>re.find(o=>o.name===r)?.emoji||"🎵";s.genreA={name:k.genreA,emoji:n(k.genreA),votes:0,tipTotal:0},s.genreB={name:k.genreB,emoji:n(k.genreB),votes:0,tipTotal:0}}await _(S(p,"challenges"),s),alert("🏆 Challenge lanzado!"),C(!1),V({songA:null,songB:null}),J({genreA:"",genreB:""})}catch(a){console.error("Error launching challenge:",a),alert("Error al lanzar challenge")}},qe=a=>{const s=Math.floor(a/60),n=a%60;return`${s}:${n.toString().padStart(2,"0")}`},se=a=>new Intl.NumberFormat("es-DO",{style:"currency",currency:"DOP",minimumFractionDigits:0,maximumFractionDigits:0}).format(a).replace("DOP","RD$"),pe=a=>{if(!t)return 50;const s=t.type||"song";let n,r,o;s==="song"?(n=t.songA,r=t.songB,o=t[a]):s==="genre"&&(n=t.genreA,r=t.genreB,o=t[a]);const j=n.votes+n.tipTotal/100+(r.votes+r.tipTotal/100);if(j===0)return 50;const m=o.votes+o.tipTotal/100;return Math.round(m/j*100)},Ie=async()=>{if(!q)return alert("No hay actividad activa");try{await A(y(p,"activities",q),{isRequestsPaused:!H})}catch(a){console.error("Error toggling pause:",a),alert("Error al actualizar estado")}},R=g?.type==="venue",De=oa(g?.type),me=R||!!q,he=b?la({startedAt:b}):0,Pe=!R&&!!q&&he>=da,Re=async()=>{if(confirm("¿Cerrar la noche? Se completará la actividad actual."))try{await ga(c,q)}catch(a){console.error("Error closing activity:",a),alert("Error al cerrar la actividad")}};return e.jsxs("div",{className:"dashboard-container",children:[e.jsx(ia,{text:"PILOTO",variant:"warning"}),e.jsx(Ue,{title:g?`Panel - ${g.name} | TokaLive`:"Panel de Orquesta - TokaLive",description:"Gestiona tu orquesta, eventos y repertorio en tiempo real.",type:"website"}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"dashboard-header",children:[e.jsxs("div",{className:"header-left",children:[e.jsxs("div",{className:"brand-row",children:[e.jsx(Ve,{size:"medium",variant:"text"}),e.jsx("span",{className:"panel-tag",children:R?"Panel de Local":"Panel de Orquesta"})]}),e.jsxs("div",{className:"orchestra-identity",children:[g?.logoUrl?e.jsx("img",{src:g.logoUrl,alt:g.name,className:"identity-logo"}):e.jsx("div",{className:"identity-logo identity-logo-fallback",children:R?"🏪":"🎶"}),e.jsxs("div",{className:"identity-info",children:[e.jsx("h1",{className:"dashboard-title",id:"dashboard-title",children:g?.name||`Mi ${De.entity}`}),e.jsxs("div",{className:"identity-badges",children:[e.jsx("span",{className:"id-badge id-type",children:R?"🏪 Local Comercial":"🎶 Orquesta / Artista"}),e.jsx("span",{className:`id-badge id-status ${me?"is-live":"is-idle"}`,children:me?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"live-dot"})," EN VIVO"]}):"○ Sin evento activo"}),e.jsxs("span",{id:"connected-badge",className:"id-badge id-online",children:[e.jsx("span",{className:"online-dot",style:{background:W>0?"#00f2fe":"#666",boxShadow:W>0?"0 0 8px #00f2fe":"none"}}),W," en línea"]})]}),I&&e.jsxs("p",{className:"user-info",id:"profile-info",children:["👤 ",I.email]})]}),e.jsx("button",{className:"help-btn",onClick:ba,title:"Iniciar Tour de Ayuda",children:"❓"})]})]}),e.jsxs("div",{className:"header-actions-wrap",children:[e.jsx("button",{className:"actions-toggle btn btn-outline",onClick:()=>E(a=>!a),"aria-expanded":x,title:"Acciones del panel",children:x?"✕ Cerrar":"⋯ Acciones"}),x&&e.jsx("div",{className:"actions-backdrop",onClick:()=>E(!1)}),e.jsxs("div",{className:`header-actions ${x?"open":""}`,onClick:()=>E(!1),children:[e.jsx("button",{id:"qr-button",className:"btn btn-primary",onClick:Ae,children:"🖨️ Descargar QR"}),e.jsx(Fe,{to:`/orchestra/${c}/settings`,className:"btn btn-outline",id:"settings-btn",children:"⚙️ Configuración"}),e.jsx("a",{id:"tv-mode-btn",href:`/tv/${c}`,target:"_blank",rel:"noopener noreferrer",className:"btn btn-outline",title:"Abrir Modo TV para proyectar",children:"📺 Modo TV"}),q&&e.jsx("button",{id:"pause-btn",className:`btn ${H?"btn-danger":"btn-success"}`,onClick:Ie,title:H?"Reanudar peticiones":"Pausar peticiones",children:H?"⛔ Peticiones Pausadas":"✅ Peticiones Activas"}),e.jsx("button",{id:"challenge-btn",className:"btn btn-gold",onClick:()=>C(!0),children:"🏆 Lanzar Challenge"}),e.jsx("button",{className:"btn btn-outline btn-logout",onClick:Q,children:"🚪 Salir"})]})]})]}),Pe&&e.jsxs("div",{className:"close-reminder",children:[e.jsxs("span",{children:["🔴 Llevas ",e.jsxs("strong",{children:[Math.floor(he),"h"]})," en vivo. ¿Ya terminó la noche?"]}),e.jsx("button",{className:"btn btn-sm",onClick:Re,children:"✅ Cerrar la noche"})]}),e.jsxs("div",{className:"revenue-grid",id:"revenue-stats",children:[e.jsxs("div",{className:"revenue-card glass-card",children:[e.jsx("span",{className:"stat-emoji",children:"👥"}),e.jsxs("div",{children:[e.jsx("p",{className:"revenue-label",children:"Conectados"}),e.jsx("p",{className:"revenue-value",children:W})]})]}),e.jsxs("div",{className:"revenue-card glass-card",children:[e.jsx("span",{className:"stat-emoji",children:"🎵"}),e.jsxs("div",{children:[e.jsx("p",{className:"revenue-label",children:"En cola"}),e.jsx("p",{className:"revenue-value",children:z.length})]})]}),e.jsxs("div",{className:"revenue-card glass-card",children:[e.jsx("span",{className:"stat-emoji",children:"📨"}),e.jsxs("div",{children:[e.jsx("p",{className:"revenue-label",children:"Pedidos hoy"}),e.jsx("p",{className:"revenue-value",children:D.requests})]})]}),e.jsxs("div",{className:"revenue-card glass-card",children:[e.jsx("span",{className:"stat-emoji",children:"✅"}),e.jsxs("div",{children:[e.jsx("p",{className:"revenue-label",children:"Tocadas hoy"}),e.jsx("p",{className:"revenue-value",children:D.played})]})]})]}),P&&e.jsxs("div",{className:"genre-winner-banner glass-card animate-slideDown",children:[e.jsx("button",{className:"banner-close",onClick:()=>ae(null),title:"Cerrar",children:"✕"}),e.jsxs("div",{className:"banner-content",children:[e.jsx("div",{className:"winner-icon",children:P.emoji}),e.jsxs("div",{className:"winner-info",children:[e.jsx("h3",{children:"🏆 Género Ganador del Challenge"}),e.jsx("p",{className:"winner-genre",children:P.genre}),e.jsxs("p",{className:"winner-stats",children:[P.votes," votos"]})]})]}),e.jsx("div",{className:"banner-actions",children:e.jsxs("p",{className:"action-hint",children:["Selecciona una canción de ",P.genre," para tocar"]})})]}),t&&e.jsxs("div",{className:"active-challenge-section glass-card",children:[e.jsxs("div",{className:"challenge-header",children:[e.jsxs("div",{children:[e.jsxs("h2",{children:["🏆 Challenge Activo ",t.type==="genre"?"(Género)":"(Canción)"]}),t.isOvertime&&e.jsx("span",{className:"badge badge-danger animate-pulse",style:{fontSize:"0.8rem",marginLeft:"10px"},children:"🔥 MUERTE SÚBITA"})]}),e.jsxs("div",{className:`challenge-timer ${G<30?"urgent":""}`,children:["⏱️ ",qe(G)]})]}),e.jsxs("div",{className:"challenge-battle",children:[e.jsxs("div",{className:"challenge-song",children:[e.jsx("h3",{className:"song-title",children:t.type==="genre"?`${t.genreA.emoji} ${t.genreA.name}`:t.songA.title}),e.jsxs("div",{className:"song-stats",children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-value",children:t.type==="genre"?t.genreA.votes:t.songA.votes}),e.jsx("span",{className:"stat-label",children:"Votos"})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-value",children:se(t.type==="genre"?t.genreA.tipTotal:t.songA.tipTotal)}),e.jsx("span",{className:"stat-label",children:"Propinas"})]})]}),e.jsxs("div",{className:"win-percentage",children:[pe(t.type==="genre"?"genreA":"songA"),"%"]})]}),e.jsx("div",{className:"challenge-vs",children:"VS"}),e.jsxs("div",{className:"challenge-song",children:[e.jsx("h3",{className:"song-title",children:t.type==="genre"?`${t.genreB.emoji} ${t.genreB.name}`:t.songB.title}),e.jsxs("div",{className:"song-stats",children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-value",children:t.type==="genre"?t.genreB.votes:t.songB.votes}),e.jsx("span",{className:"stat-label",children:"Votos"})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-value",children:se(t.type==="genre"?t.genreB.tipTotal:t.songB.tipTotal)}),e.jsx("span",{className:"stat-label",children:"Propinas"})]})]}),e.jsxs("div",{className:"win-percentage",children:[pe(t.type==="genre"?"genreB":"songB"),"%"]})]})]}),e.jsx("button",{className:"btn btn-outline btn-full",onClick:te,style:{marginTop:"var(--space-4)"},children:"Finalizar Challenge"})]}),h&&e.jsxs("div",{className:"now-playing-section glass-card",children:[e.jsx("div",{className:"now-playing-header",children:e.jsxs("div",{children:[e.jsx("h2",{children:"🎵 Sonando Ahora"}),e.jsx("h3",{children:h.songTitle}),h.tipAmount>0&&e.jsxs("span",{className:"badge badge-gold",children:["💰 ",se(h.tipAmount)]})]})}),e.jsxs("button",{className:"btn btn-success",onClick:()=>ge(h.id),children:[e.jsx(ve,{size:16})," Completar"]})]}),e.jsx("div",{className:"dashboard-tabs-container",id:"dashboard-tabs",children:e.jsxs("div",{className:"dashboard-tabs",children:[e.jsx("button",{className:`tab-btn ${U==="queue"?"active":""}`,onClick:()=>ee("queue"),children:"📋 Cola Activa"}),e.jsx("button",{className:`tab-btn ${U==="history"?"active":""}`,onClick:()=>ee("history"),children:"📜 Historial"}),e.jsx("button",{className:`tab-btn ${U==="repertoire"?"active":""}`,onClick:()=>ee("repertoire"),children:"🎶 Repertorio"})]})}),U==="queue"?e.jsxs("div",{className:"queue-section",children:[e.jsx("h2",{children:"📋 Cola de Solicitudes"}),e.jsx("p",{className:"section-subtitle",children:"Arrastra para reordenar"}),z.length===0?e.jsx("div",{className:"empty-state glass-card",children:e.jsx("p",{children:"No hay solicitudes pendientes"})}):e.jsx(Ye,{sensors:ke,collisionDetection:We,onDragEnd:Se,children:e.jsx(_e,{items:z.map(a=>a.id),strategy:Ke,children:e.jsx("div",{className:"queue-list-orchestra",children:z.map(a=>e.jsx(xa,{request:a,onAccept:de,onReject:Te,onSetPlaying:de,onComplete:ge},a.id))})})})]}):U==="history"?e.jsx(ua,{orchestraId:c}):e.jsxs("div",{className:"repertoire-section",children:[e.jsxs("div",{className:"section-header-flex",children:[e.jsx("h2",{children:"🎶 Repertorio"}),e.jsx("div",{className:"search-box",children:e.jsx("input",{type:"text",className:"input",placeholder:"Buscar canción o artista...",value:Y,onChange:a=>Ne(a.target.value)})})]}),e.jsxs("div",{className:"orchestra-repertoire-list",children:[v.filter(a=>a.title.toLowerCase().includes(Y.toLowerCase())||a.artist?.toLowerCase().includes(Y.toLowerCase())||a.genre?.toLowerCase().includes(Y.toLowerCase())).slice(0,50).map(a=>e.jsxs("div",{className:"repertoire-item-orchestra glass-card",children:[e.jsxs("div",{className:"song-info",children:[e.jsx("span",{className:"song-genre-tag",children:a.genre||"S/G"}),e.jsxs("div",{className:"song-text",children:[e.jsx("h4",{children:a.title}),e.jsx("p",{children:a.artist||"Artista desconocido"})]})]}),e.jsxs("div",{className:"song-actions",children:[e.jsx("button",{className:"btn btn-sm btn-outline",onClick:()=>ze(a),children:"➕ Cola"}),e.jsx("button",{className:"btn btn-sm btn-primary",onClick:()=>Ee(a),children:"▶️ Tocar"})]})]},a.id)),v.length===0&&e.jsx("p",{className:"empty-msg",children:"No hay canciones cargadas."})]})]})]}),u&&e.jsx("div",{className:"modal-overlay",onClick:()=>C(!1),children:e.jsxs("div",{className:"modal-content glass-card",onClick:a=>a.stopPropagation(),children:[e.jsx("h2",{children:"🏆 Crear Challenge"}),e.jsxs("div",{className:"challenge-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Tipo de Challenge"}),e.jsxs("div",{className:"challenge-type-selector",children:[e.jsx("button",{className:`type-btn ${B==="song"?"active":""}`,onClick:()=>ie("song"),children:"🎵 Canción vs Canción"}),e.jsx("button",{className:`type-btn ${B==="genre"?"active":""}`,onClick:()=>ie("genre"),children:"🎸 Género vs Género"})]})]}),B==="song"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Canción A"}),R?e.jsx("input",{className:"input",placeholder:"Escribe la canción A (ej: Obsesión)",value:f.songA?.title||"",onChange:a=>{const s=a.target.value;V(n=>({...n,songA:s.trim()?{id:"a",title:s,artist:""}:null}))}}):e.jsxs("select",{className:"input",value:f.songA?.id||"",onChange:a=>{const s=v.find(n=>n.id===a.target.value);V(n=>({...n,songA:s}))},children:[e.jsx("option",{value:"",children:"Seleccionar..."}),v.map(a=>e.jsx("option",{value:a.id,children:a.title},a.id))]})]}),e.jsx("div",{className:"vs-label",children:"VS"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Canción B"}),R?e.jsx("input",{className:"input",placeholder:"Escribe la canción B (ej: Propuesta Indecente)",value:f.songB?.title||"",onChange:a=>{const s=a.target.value;V(n=>({...n,songB:s.trim()?{id:"b",title:s,artist:""}:null}))}}):e.jsxs("select",{className:"input",value:f.songB?.id||"",onChange:a=>{const s=v.find(n=>n.id===a.target.value);V(n=>({...n,songB:s}))},children:[e.jsx("option",{value:"",children:"Seleccionar..."}),v.map(a=>e.jsx("option",{value:a.id,children:a.title},a.id))]})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Género A"}),e.jsxs("select",{className:"input",value:k.genreA,onChange:a=>J(s=>({...s,genreA:a.target.value})),children:[e.jsx("option",{value:"",children:"Seleccionar..."}),re.map(a=>e.jsxs("option",{value:a.name,children:[a.emoji," ",a.name]},a.name))]})]}),e.jsx("div",{className:"vs-label",children:"VS"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Género B"}),e.jsxs("select",{className:"input",value:k.genreB,onChange:a=>J(s=>({...s,genreB:a.target.value})),children:[e.jsx("option",{value:"",children:"Seleccionar..."}),re.map(a=>e.jsxs("option",{value:a.name,children:[a.emoji," ",a.name]},a.name))]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Duración"}),e.jsxs("select",{className:"input",value:X,onChange:a=>fe(parseInt(a.target.value)),children:[e.jsx("option",{value:"60",children:"1 minuto"}),e.jsx("option",{value:"120",children:"2 minutos"}),e.jsx("option",{value:"180",children:"3 minutos"}),e.jsx("option",{value:"300",children:"5 minutos"}),e.jsx("option",{value:"600",children:"10 minutos"})]})]}),e.jsxs("div",{className:"modal-actions",children:[e.jsx("button",{className:"btn btn-gold btn-full",onClick:Be,children:"🚀 Lanzar Challenge"}),e.jsx("button",{className:"btn btn-outline btn-full",onClick:()=>C(!1),children:"Cancelar"})]})]})]})}),e.jsx("style",{children:`
        .dashboard-container {
          min-height: 100vh;
          background: var(--brand-deep-velvet);
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 242, 254, 0.1) 0%, transparent 50%);
          padding: var(--space-6);
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-8);
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .dashboard-title {
            font-size: 2rem;
            font-weight: 800;
            font-family: var(--font-heading);
            color: white;
            margin: 0;
            line-height: 1.1;
            background: none;
            -webkit-text-fill-color: initial;
        }

        /* --- Orchestra identity header --- */
        .brand-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .panel-tag {
            font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
            color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.12); padding: 4px 10px; border-radius: 999px;
        }

        .orchestra-identity { display: flex; align-items: center; gap: 16px; }
        .identity-logo {
            width: 64px; height: 64px; border-radius: 16px; object-fit: cover; flex-shrink: 0;
            border: 2px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05);
        }
        .identity-logo-fallback {
            display: flex; align-items: center; justify-content: center; font-size: 2rem;
        }
        .identity-info { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .identity-badges { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .id-badge {
            display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 600;
            padding: 5px 11px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85);
        }
        .id-status.is-live { color: #ff6b8a; border-color: rgba(255,59,107,0.35); background: rgba(255,59,107,0.12); }
        .id-status.is-idle { color: rgba(255,255,255,0.55); }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #ff3b6b; box-shadow: 0 0 0 0 rgba(255,59,107,0.7); animation: idPing 1.6s infinite; }
        @keyframes idPing { 0% { box-shadow: 0 0 0 0 rgba(255,59,107,0.6); } 70% { box-shadow: 0 0 0 7px rgba(255,59,107,0); } 100% { box-shadow: 0 0 0 0 rgba(255,59,107,0); } }
        .online-dot { width: 8px; height: 8px; border-radius: 50%; }
        .user-info { font-size: 0.82rem; color: rgba(255,255,255,0.55); margin: 0; }
        .help-btn {
            align-self: flex-start; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
            color: white; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center; font-size: 0.95rem;
        }
        .help-btn:hover { background: rgba(255,255,255,0.12); }

        .stat-emoji { font-size: 2rem; line-height: 1; flex-shrink: 0; }

        /* --- Header actions (responsive) --- */
        .header-actions-wrap { position: relative; }
        .actions-toggle { display: none; }
        .header-actions {
            display: flex; flex-wrap: wrap; gap: var(--space-3); justify-content: flex-end; align-items: center;
        }
        .actions-backdrop { display: none; }

        .close-reminder {
          display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
          background: rgba(255, 159, 10, 0.12); border: 1px solid rgba(255, 159, 10, 0.4);
          color: #ffd9a0; border-radius: 14px; padding: 12px 16px; margin-bottom: var(--space-6); font-size: 0.95rem;
        }
        .close-reminder strong { color: #fff; }
        .close-reminder .btn { background: #ff9f0a; color: #1a1305; border: none; font-weight: 700; padding: 8px 14px; border-radius: 10px; cursor: pointer; flex-shrink: 0; }

        .revenue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        .revenue-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-5);
        }

        .revenue-icon {
          font-size: 2.5rem;
        }

        .revenue-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin: 0 0 var(--space-1) 0;
        }

        .revenue-value {
          font-size: var(--text-2xl);
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .now-playing-section {
          padding: var(--space-6);
          margin-bottom: var(--space-8);
          background: var(--brand-electric-magenta);
          background: linear-gradient(135deg, #FF0080 0%, #7928CA 100%);
          border-radius: var(--radius-xl);
          border: none;
          text-align: center;
          box-shadow: 0 10px 30px rgba(255, 0, 128, 0.3);
        }

        .now-playing-section h2 {
          font-size: var(--text-base);
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: var(--space-2);
        }

        .now-playing-section h3 {
          font-size: var(--text-3xl);
          color: white;
          margin-bottom: var(--space-3);
        }

        .queue-section h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-2);
        }

        .section-subtitle {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .queue-list-orchestra {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .queue-item-orchestra {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          cursor: move;
        }

        .drag-handle {
          font-size: var(--text-2xl);
          color: var(--text-tertiary);
          cursor: grab;
          user-select: none;
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .queue-item-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
        }

        .queue-item-details h4 {
          font-size: var(--text-lg);
          margin: 0 0 var(--space-2) 0;
          color: var(--text-primary);
        }

        .queue-item-meta {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .queue-item-actions {
          display: flex;
          gap: var(--space-2);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-4);
        }

        .modal-content {
          max-width: 600px;
          width: 100%;
          padding: var(--space-8);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content h2 {
          margin-bottom: var(--space-6);
        }

        .challenge-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .form-group label {
          display: block;
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .challenge-type-selector {
          display: flex;
          gap: var(--space-3);
        }

        .type-btn {
          flex: 1;
          padding: var(--space-4);
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .type-btn.active {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%);
          border-color: rgba(255, 215, 0, 0.5);
          color: #FFD700;
        }

        .vs-label {
          text-align: center;
          font-size: var(--text-2xl);
          font-weight: 800;
          background: var(--gradient-gold);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        /* Genre Winner Notification Banner */
        .genre-winner-banner {
          position: relative;
          padding: var(--space-6);
          margin-bottom: var(--space-6);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%);
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
        }

        .banner-close {
          position: absolute;
          top: var(--space-3);
          right: var(--space-3);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: var(--text-lg);
          transition: all 0.2s;
        }

        .banner-close:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }

        .winner-icon {
          font-size: 4rem;
          filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
        }

        .winner-info h3 {
          margin: 0 0 var(--space-2) 0;
          font-size: var(--text-xl);
          background: var(--gradient-gold);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .winner-genre {
          font-size: var(--text-2xl);
          font-weight: 800;
          color: #FFD700;
          margin: 0;
        }

        .winner-stats {
          font-size: var(--text-sm);
          color: rgba(255, 255, 255, 0.7);
          margin: var(--space-2) 0 0 0;
        }

        .banner-actions {
          padding-top: var(--space-4);
          border-top: 1px solid rgba(255, 215, 0, 0.2);
        }

        .action-hint {
          margin: 0;
          font-size: var(--text-base);
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        /* Active Challenge Section */
        .active-challenge-section {
          padding: var(--space-6);
          margin-bottom: var(--space-8);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          border: 2px solid rgba(139, 92, 246, 0.3);
        }

        .challenge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .challenge-header h2 {
          font-size: var(--text-2xl);
          margin: 0;
        }

        .challenge-timer {
          font-size: var(--text-xl);
          font-weight: 700;
          padding: var(--space-2) var(--space-4);
          background: var(--glass-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
        }

        .challenge-timer.urgent {
          background: rgba(239, 68, 68, 0.2);
          border-color: var(--color-error);
          color: var(--color-error);
          animation: pulse 1s infinite;
        }

        .challenge-battle {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--space-6);
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .challenge-song {
          text-align: center;
          padding: var(--space-4);
          background: var(--glass-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
        }

        .challenge-song .song-title {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: var(--space-4);
          color: var(--text-primary);
        }

        .challenge-song .song-stats {
          display: flex;
          justify-content: space-around;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }

        .challenge-song .stat {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .challenge-song .stat-value {
          font-size: var(--text-2xl);
          font-weight: 800;
          color: var(--text-primary);
        }

        .challenge-song .stat-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .challenge-song .win-percentage {
          font-size: var(--text-3xl);
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .challenge-vs {
          font-size: var(--text-3xl);
          font-weight: 800;
          background: var(--gradient-gold);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }


        @media (max-width: 768px) {
          .revenue-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-header { align-items: flex-start; }

          /* Collapse the action buttons into a "⋯ Acciones" dropdown */
          .actions-toggle { display: inline-flex; }
          .header-actions {
            display: none;
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            z-index: 50;
            flex-direction: column;
            align-items: stretch;
            width: 250px;
            background: rgba(20, 16, 34, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 14px;
            padding: 10px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
          }
          .header-actions.open { display: flex; }
          .header-actions .btn { width: 100%; justify-content: center; }
          .actions-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 40;
          }

          .queue-item-content {
            flex-direction: column;
            align-items: stretch; /* Stretch to fill width */
            gap: 15px;
          }

          .queue-item-actions {
            display: grid;
            grid-template-columns: 1fr 1fr; /* Two big buttons side by side */
            gap: 10px;
            width: 100%;
          }

          .queue-item-actions .btn {
            padding: 12px; /* Bigger touch target */
            font-size: 1rem;
            justify-content: center;
          }

          .drag-handle {
             padding: 10px; /* Easier to grab */
           }

          .challenge-battle {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }

          .challenge-vs {
            font-size: var(--text-2xl);
            margin: 10px 0;
          }
        }

        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          max-width: 400px;
        }

        .orchestra-repertoire-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 5px;
        }

        .repertoire-item-orchestra {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          animation: fadeIn 0.3s ease-out;
        }

        .song-info {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .song-genre-tag {
          padding: 4px 10px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #FFD700;
          letter-spacing: 0.5px;
        }

        .song-text h4 {
          margin: 0;
          font-size: 1.1rem;
          color: white;
        }

        .song-text p {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .song-actions {
          display: flex;
          gap: var(--space-2);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .orchestra-repertoire-list::-webkit-scrollbar {
          width: 5px;
        }
        .orchestra-repertoire-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .orchestra-repertoire-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}),ye&&e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-content glass-card",style:{textAlign:"center",maxWidth:"400px"},children:[e.jsx("h2",{style:{marginBottom:"20px",color:"white"},children:"📱 Código QR para Clientes"}),e.jsx("p",{style:{color:"rgba(255,255,255,0.7)",marginBottom:"20px"},children:"Imprime este código y colócalo en las mesas para que el público pueda pedir canciones."}),e.jsx("div",{style:{background:"white",padding:"20px",borderRadius:"10px",marginBottom:"20px"},children:e.jsx("img",{src:ce,alt:"QR Code",style:{width:"100%",height:"auto"}})}),e.jsxs("p",{style:{fontFamily:"monospace",background:"rgba(0,0,0,0.3)",padding:"10px",borderRadius:"5px",marginBottom:"20px",color:"#00F2FE"},children:[window.location.origin,"/e/",c]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx("button",{className:"btn btn-primary btn-block",onClick:Ce,children:"⬇️ Descargar PNG"}),e.jsx("button",{className:"btn btn-outline btn-block",onClick:()=>le(!1),children:"Cerrar"})]})]})}),e.jsx("style",{children:`
                .btn-block { flex: 1; }
                /* Reuse existing modal styles from other components if available, else inline is fine */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    width: 90%;
                    padding: 30px;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: #1a1a2e;
                }
                .dashboard-tabs-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 2rem;
                }
                .dashboard-tabs {
                    display: inline-flex;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 6px;
                    border-radius: 50px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    gap: 5px;
                }
                .tab-btn {
                    padding: 10px 24px;
                    border-radius: 50px;
                    border: none;
                    background: transparent;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }
                .tab-btn:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }
                .tab-btn.active {
                    background: linear-gradient(135deg, #00F2FE 0%, #4facfe 100%);
                    color: #000;
                    box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
                    font-weight: 800;
                }
            `})]})}export{Pa as default};
