import{r as l,j as a}from"./react-vendor-EdJM3XXU.js";import{e as h,c as b,s as ta,d as u,u as H,n as Z,p as ra,q as k,h as B,a as M,b as ia,k as oa}from"./fb-firestore-AmJ3MB_X.js";import{d,u as na,c as la}from"./index-D70ncfSl.js";import{L as ca}from"./Logo-BDLK0u7M.js";import{O as da,R as pa,D as O,V as ga,p as G,N as Y,W as _,Y as ma,d as xa}from"./vendor-icons-Dn77n0aV.js";import"./fb-core-C5Q99qy-.js";import"./vendor-_yQiqF6F.js";import"./fb-auth-BRLnzcC0.js";async function ha(p=console.log){const i=await h(b(d,"orchestras"));let o=0,c=0;for(const n of i.docs){const g=n.data();if(!g.companyData){c++;continue}await ta(u(d,"orchestras",n.id,"private","company"),g.companyData,{merge:!0}),await H(u(d,"orchestras",n.id),{companyData:Z()}),o++,p(`  ✅ ${g.name||n.id}: companyData → private/company`)}return p(`🏛️  Orquestas: ${o} migradas, ${c} sin datos fiscales.`),{moved:o,skipped:c}}async function ba(p=console.log){const i=await h(b(d,"requests")),o=i.docs.filter(n=>n.data().userEmail!==void 0);let c=0;for(let n=0;n<o.length;n+=400){const g=ra(d);for(const f of o.slice(n,n+400))g.update(u(d,"requests",f.id),{userEmail:Z()});await g.commit(),c+=Math.min(400,o.length-n),p(`  ✅ ${c}/${o.length} requests limpiados…`)}return p(`📋 Requests: ${c} emails eliminados (de ${i.size} totales).`),{cleaned:c,total:i.size}}async function ua(p=console.log){p("🔒 Iniciando migración de privacidad…");const i=await ha(p),o=await ba(p);return p("✅ Migración de privacidad completada."),{orch:i,reqs:o}}function Ra(){const{logout:p}=na(),[i,o]=l.useState("orchestras"),[c,n]=l.useState([]),[g,f]=l.useState([]),[E,J]=l.useState([]),[A,R]=l.useState([]),[y,V]=l.useState(""),[z,w]=l.useState(!0),[x,D]=l.useState("all"),[j,W]=l.useState({totalOrchestras:0,activeOrchestras:0,totalRevenue:0,totalSongs:0,totalUsers:0}),[C,L]=l.useState(!1),[q,I]=l.useState([]),K=async()=>{if(!confirm("¿Ejecutar la migración de privacidad? Mueve los datos fiscales a una subcolección privada y elimina los emails de los pedidos."))return;L(!0),I([]);const e=t=>I(r=>[...r,t]);try{await ua(e),await S()}catch(t){console.error("PII migration failed:",t),e(`❌ Error: ${t.message}`)}finally{L(!1)}},S=async()=>{w(!0);try{const e=k(b(d,"orchestras"),B("createdAt","desc")),r=(await h(e)).docs.map(s=>({id:s.id,...s.data()}));await Promise.all(r.map(async s=>{try{const N=await M(u(d,"orchestras",s.id,"private","company"));N.exists()&&(s.companyData=N.data())}catch{}}));const m=k(b(d,"users"),B("createdAt","desc")),F=(await h(m)).docs.map(s=>({id:s.id,...s.data()})),ea=k(b(d,"requests")),sa=(await h(ea)).docs.map(s=>s.data());let T=0,$=0;const v={};sa.forEach(s=>{if(["completed","playing","pending"].includes(s.status)){$++;const N=parseFloat(s.tipAmount)||0;T+=N,s.eventId&&(v[s.eventId]||(v[s.eventId]={revenue:0,songs:0}),v[s.eventId].revenue+=N,v[s.eventId].songs+=1)}});const P=r.map(s=>({...s,stats:v[s.id]||{revenue:0,songs:0}}));n(P),f(P),J(F),R(F),W({totalOrchestras:r.length,activeOrchestras:r.filter(s=>(s.status||"").toLowerCase()==="active").length,totalRevenue:T,totalSongs:$,totalUsers:F.length})}catch(e){console.error("Error fetching admin data:",e)}finally{w(!1)}};l.useEffect(()=>{S()},[]),l.useEffect(()=>{f(x==="all"?c:c.filter(e=>e.status===x))},[x,c]),l.useEffect(()=>{if(!y.trim())R(E);else{const e=y.toLowerCase();R(E.filter(t=>(t.email||"").toLowerCase().includes(e)||(t.displayName||"").toLowerCase().includes(e)||(t.name||"").toLowerCase().includes(e)))}},[y,E]);const Q=async(e,t)=>{if(confirm(`¿Aprobar a la orquesta "${t}"?`))try{await H(u(d,"orchestras",e),{status:"active",approvedAt:ia()});try{const r=c.find(m=>m.id===e);if(r?.ownerId){const m=await M(u(d,"users",r.ownerId));m.exists()&&await la({user_name:r.companyData?.contactName||"Partner",user_email:m.data().email,orchestra_name:t})}}catch(r){console.error("Email error:",r)}alert(`✅ Orquesta "${t}" aprobada.`),S()}catch(r){console.error("Error approving:",r),alert("❌ Error al aprobar.")}},X=async()=>{if(!confirm("⚠️ ¿ESTÁS SEGURO? ESTO BORRARÁ TODOS LOS DATOS DEL SISTEMA."))return;if(prompt("Para confirmar, escribe 'BORRAR TODO' en mayúsculas:")!=="BORRAR TODO")return alert("❌ Cancelado.");w(!0);try{const t=["requests","activities","challenges","payments","songs","orchestras"];for(const r of t){const m=await h(b(d,r));await Promise.all(m.docs.map(U=>oa(U.ref))),console.log(`Deleted ${r}`)}alert("✅ PILOTO REINICIADO."),S()}catch(t){alert("Error: "+t.message)}finally{w(!1)}},aa=e=>{const t=(e||"").toLowerCase();return t==="active"?a.jsx("span",{className:"badge badge-success",children:"Activa"}):t==="pending"?a.jsx("span",{className:"badge badge-warning",children:"Pendiente"}):a.jsx("span",{className:"badge badge-secondary",children:e})};return a.jsxs("div",{className:"page-container deep-velvet-bg",children:[a.jsxs("div",{className:"page-content",children:[a.jsxs("div",{className:"page-header center",style:{position:"relative"},children:[a.jsx("button",{onClick:p,style:{position:"absolute",top:0,right:0,background:"rgba(255,255,255,0.1)",border:"none",color:"white",padding:"8px 15px",borderRadius:"20px",cursor:"pointer",fontSize:"0.9rem"},children:"🚪 Salir"}),a.jsx(ca,{size:"large",variant:"text"}),a.jsxs("h1",{children:[a.jsx(da,{className:"inline-icon"})," Super Admin"]})]}),a.jsxs("div",{className:"admin-tabs",children:[a.jsxs("button",{className:`tab-btn ${i==="dashboard"?"active":""}`,onClick:()=>o("dashboard"),children:[a.jsx(pa,{size:18})," Dashboard"]}),a.jsxs("button",{className:`tab-btn ${i==="orchestras"?"active":""}`,onClick:()=>o("orchestras"),children:[a.jsx(O,{size:18})," Orquestas"]}),a.jsxs("button",{className:`tab-btn ${i==="users"?"active":""}`,onClick:()=>o("users"),children:[a.jsx(O,{size:18})," Usuarios"]}),a.jsxs("button",{className:`tab-btn ${i==="system"?"active":""}`,onClick:()=>o("system"),children:[a.jsx(ga,{size:18})," Sistema"]})]}),a.jsxs("div",{className:"admin-body",children:[i==="dashboard"&&a.jsxs("div",{className:"dashboard-grid",children:[a.jsxs("div",{className:"stat-card glass-card",children:[a.jsx(O,{className:"stat-icon",color:"#00F2FE"}),a.jsx("h3",{children:"Total Orquestas"}),a.jsx("p",{className:"stat-value",children:j.totalOrchestras})]}),a.jsxs("div",{className:"stat-card glass-card",children:[a.jsx(G,{className:"stat-icon",color:"#10B981"}),a.jsx("h3",{children:"Activas"}),a.jsx("p",{className:"stat-value",children:j.activeOrchestras})]}),a.jsxs("div",{className:"stat-card glass-card",children:[a.jsx(Y,{className:"stat-icon",color:"#FFD700"}),a.jsx("h3",{children:"Revenue Total"}),a.jsxs("p",{className:"stat-value text-gold",children:["RD$ ",j.totalRevenue.toLocaleString()]})]}),a.jsxs("div",{className:"stat-card glass-card",children:[a.jsx(_,{className:"stat-icon",color:"#FF0080"}),a.jsx("h3",{children:"Canciones"}),a.jsx("p",{className:"stat-value",children:j.totalSongs})]}),a.jsxs("div",{className:"stat-card glass-card",children:[a.jsx(O,{className:"stat-icon",color:"#A855F7"}),a.jsx("h3",{children:"Usuarios"}),a.jsx("p",{className:"stat-value",children:j.totalUsers})]})]}),i==="orchestras"&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"admin-controls glass-card",children:a.jsxs("div",{className:"filter-group",children:[a.jsx(ma,{size:18,className:"text-secondary"}),a.jsx("span",{className:"filter-label",children:"Estado:"}),a.jsxs("div",{className:"filter-pills",children:[a.jsx("button",{className:`filter-pill ${x==="all"?"active":""}`,onClick:()=>D("all"),children:"Todas"}),a.jsx("button",{className:`filter-pill ${x==="pending"?"active":""}`,onClick:()=>D("pending"),children:"Pendientes"}),a.jsx("button",{className:`filter-pill ${x==="active"?"active":""}`,onClick:()=>D("active"),children:"Activas"})]})]})}),a.jsxs("div",{className:"orchestra-grid",children:[g.map(e=>a.jsxs("div",{className:`approval-card glass-card ${e.status}`,children:[a.jsxs("div",{className:"card-header",children:[a.jsxs("div",{className:"header-title",children:[e.logoUrl&&a.jsx("img",{src:e.logoUrl,alt:"Logo",className:"mini-logo"}),a.jsxs("div",{children:[a.jsx("h3",{style:{margin:0},children:e.name}),a.jsx("small",{style:{color:"rgba(255,255,255,0.5)"},children:e.companyData?.city||"RD"})]})]}),aa(e.status)]}),a.jsxs("div",{className:"card-body",children:[a.jsxs("div",{className:"info-row",children:[a.jsx("span",{className:"label",children:"Contacto:"})," ",a.jsx("span",{children:e.companyData?.contactName||"N/A"})]}),a.jsxs("div",{className:"info-row",children:[a.jsx("span",{className:"label",children:"Tel:"})," ",a.jsx("span",{children:e.companyData?.phone||"N/A"})]}),a.jsxs("div",{className:"info-row",children:[a.jsx("span",{className:"label",children:"ID:"})," ",a.jsx("span",{className:"code",children:e.id})]}),a.jsxs("div",{className:"mini-stats",children:[a.jsxs("div",{className:"ms-item",children:[a.jsx(_,{size:14,color:"#00F2FE"}),a.jsxs("span",{children:[e.stats?.songs||0," Songs"]})]}),a.jsxs("div",{className:"ms-item",children:[a.jsx(Y,{size:14,color:"#FFD700"}),a.jsxs("span",{children:["RD$ ",e.stats?.revenue?.toLocaleString()||0]})]})]})]}),(e.status||"").toLowerCase()==="pending"&&a.jsx("div",{className:"card-actions",children:a.jsxs("button",{className:"btn btn-success btn-full",onClick:()=>Q(e.id,e.name),children:[a.jsx(G,{size:18})," Aprobar"]})})]},e.id)),g.length===0&&a.jsx("div",{className:"empty-state",children:"No hay orquestas."})]})]}),i==="users"&&a.jsxs("div",{className:"users-section glass-card",children:[a.jsxs("div",{className:"search-bar",children:[a.jsx(xa,{size:20,color:"rgba(255,255,255,0.5)"}),a.jsx("input",{type:"text",placeholder:"Buscar por nombre o email...",value:y,onChange:e=>V(e.target.value)})]}),a.jsxs("div",{className:"table-responsive",children:[a.jsxs("table",{className:"admin-table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"Usuario"}),a.jsx("th",{children:"Email"}),a.jsx("th",{children:"Rol"}),a.jsx("th",{children:"Registro"})]})}),a.jsx("tbody",{children:A.map(e=>a.jsxs("tr",{children:[a.jsx("td",{children:a.jsxs("div",{className:"user-cell",children:[a.jsx("div",{className:"user-avatar-small",style:{background:e.photoURL?`url(${e.photoURL}) center/cover`:"#333"},children:!e.photoURL&&(e.displayName?.[0]||"U")}),a.jsx("span",{children:e.displayName||e.name||"Sin Nombre"})]})}),a.jsx("td",{children:e.email}),a.jsx("td",{children:a.jsx("span",{className:`role-badge ${e.role||"fan"}`,children:e.role||"Fan"})}),a.jsx("td",{children:e.createdAt?.seconds?new Date(e.createdAt.seconds*1e3).toLocaleDateString():"N/A"})]},e.id))})]}),A.length===0&&a.jsx("div",{className:"empty-table",children:"No se encontraron usuarios."})]})]}),i==="system"&&a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"privacy-zone glass-card",children:[a.jsx("h3",{children:"🔒 Migración de Privacidad (ejecutar una vez)"}),a.jsxs("p",{children:["Mueve los ",a.jsx("strong",{children:"datos fiscales"})," (RNC, razón social, dirección, teléfono) del documento público de cada orquesta a una ",a.jsx("strong",{children:"subcolección privada"}),", y elimina los ",a.jsx("strong",{children:"emails"})," guardados en los pedidos (la cola es de lectura pública). El código nuevo ya no los escribe; esto limpia los documentos existentes."]}),a.jsx("button",{className:"btn btn-primary btn-full",onClick:K,disabled:C,children:C?"⏳ Migrando…":"🔒 Ejecutar migración de privacidad"}),q.length>0&&a.jsx("pre",{className:"migration-log",children:q.join(`
`)})]}),a.jsxs("div",{className:"danger-zone glass-card",children:[a.jsx("h3",{children:"⚠️ Zona de Peligro"}),a.jsx("p",{children:"Esta acción borrará TODOS los datos de la base de datos (Orquestas, Pagos, Solicitudes) para reiniciar el piloto."}),a.jsx("button",{className:"btn btn-danger btn-full",onClick:X,disabled:z,children:z?"Borrando...":"🗑️ REINICIAR PILOTO"})]})]})]})]}),a.jsx("style",{children:`
                .privacy-zone { padding: 20px; margin-bottom: 20px; border: 1px solid rgba(0,242,254,0.3); }
                .privacy-zone h3 { color: #00F2FE; margin-bottom: 8px; }
                .privacy-zone p { color: rgba(255,255,255,0.75); font-size: 0.9rem; margin-bottom: 14px; line-height: 1.5; }
                .migration-log {
                    margin-top: 14px; padding: 12px; background: rgba(0,0,0,0.4);
                    border-radius: 8px; color: #a7f3d0; font-size: 0.78rem;
                    max-height: 220px; overflow-y: auto; white-space: pre-wrap;
                }

                .deep-velvet-bg { background: linear-gradient(135deg, #1a0b2e 0%, #000000 100%); min-height: 100vh; }
                .page-header.center { text-align: center; margin-bottom: 25px; padding-top: 20px;}
                .page-header.center h1 { font-size: 1.8rem; margin-top: 10px; font-weight: 700; color: white; }
                .inline-icon { vertical-align: middle; margin-right: 10px; color: #00F2FE; }
                
                /* TABS */
                .admin-tabs {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.6);
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                }
                .tab-btn:hover { background: rgba(255,255,255,0.1); color: white; transform: translateY(-2px); }
                .tab-btn.active {
                    background: linear-gradient(90deg, #FF0080, #7928CA);
                    color: white;
                    border-color: transparent;
                    box-shadow: 0 4px 15px rgba(255,0,128,0.4);
                }

                /* DASHBOARD GRID */
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .stat-card {
                    padding: 25px;
                    text-align: center;
                    background: rgba(20, 15, 45, 0.6);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 20px;
                    transition: transform 0.2s;
                }
                .stat-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.2); }
                .stat-icon { width: 40px; height: 40px; margin-bottom: 15px; }
                .stat-value { font-size: 2.5rem; font-weight: 800; margin: 10px 0 0; line-height: 1; }
                .text-gold { color: #FFD700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }

                /* ORCHESTRA LIST */
                .orchestra-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
                    gap: 20px; 
                    max-width: 1200px; 
                    margin: 0 auto; 
                }
                .approval-card { 
                    padding: 20px; 
                    background: rgba(20, 15, 45, 0.6); 
                    border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 20px;
                    display: flex; flex-direction: column;
                }
                .approval-card.pending { border-left: 5px solid #F59E0B; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(0,0,0,0)); }
                
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
                .header-title { display: flex; align-items: center; gap: 12px; }
                .mini-logo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2); }
                
                .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: rgba(255,255,255,0.7); }
                .code { font-family: 'JetBrains Mono', monospace; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; color: #00F2FE; }
                
                .mini-stats {
                    display: flex;
                    gap: 15px;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px dashed rgba(255,255,255,0.1);
                }
                .ms-item { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: 600; }

                /* USERS TABLE */
                .users-section {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                    background: rgba(20, 15, 45, 0.6);
                }
                .search-bar {
                    display: flex;
                    align-items: center;
                    background: rgba(0,0,0,0.3);
                    padding: 12px 20px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                    margin-bottom: 20px;
                    gap: 10px;
                }
                .search-bar input {
                    background: none; border: none; outline: none; color: white; width: 100%; font-size: 1rem;
                }
                
                .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
                .admin-table th { padding: 15px; color: rgba(255,255,255,0.5); font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .admin-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.9); }
                .user-cell { display: flex; align-items: center; gap: 12px; }
                .user-avatar-small { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; }
                
                .role-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
                .role-badge.admin { background: rgba(0, 242, 254, 0.2); color: #00F2FE; }
                .role-badge.superadmin { background: rgba(255, 0, 128, 0.2); color: #FF0080; }
                .role-badge.fan { background: rgba(255, 255, 255, 0.1); color: rgba(255,255,255,0.6); }

                /* DANGER ZONE */
                .danger-zone {
                    max-width: 600px;
                    margin: 40px auto;
                    padding: 40px;
                    text-align: center;
                    border: 1px solid rgba(220, 38, 38, 0.3);
                    background: linear-gradient(180deg, rgba(220, 38, 38, 0.05), rgba(0,0,0,0));
                }

                /* COMMON */
                .btn-full { width: 100%; margin-top: 15px; justify-content: center; padding: 12px; font-weight: 600; }
                .badge-success { background: #10B981; color: white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.3); }
                .badge-warning { background: #F59E0B; color: black; }
                
                .filter-pill { 
                    background: rgba(255,255,255,0.05); 
                    border: 1px solid rgba(255,255,255,0.1); 
                    color: rgba(255,255,255,0.6); 
                    padding: 8px 20px; 
                    border-radius: 20px; 
                    cursor: pointer; 
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .filter-pill:hover { background: rgba(255,255,255,0.1); color: white; }
                .filter-pill.active { 
                    background: #00F2FE; 
                    color: black; 
                    border-color: #00F2FE;
                    font-weight: 600;
                    box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
                }
            `})]})}export{Ra as default};
