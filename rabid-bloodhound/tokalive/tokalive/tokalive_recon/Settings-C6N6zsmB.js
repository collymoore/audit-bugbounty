const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/fb-storage-Cs-_tWFR.js","assets/fb-core-C5Q99qy-.js","assets/vendor-_yQiqF6F.js","assets/react-vendor-EdJM3XXU.js"])))=>i.map(i=>d[i]);
import{r as o,j as e,a as te,h as pe,L as me}from"./react-vendor-EdJM3XXU.js";import{L as ue}from"./Logo-BDLK0u7M.js";import{u as Q,d as b,b as ge,_ as he}from"./index-D70ncfSl.js";import{a as xe,d as P,u as R,b as q,s as be,q as Y,c as _,w as J,e as oe,k as le,f as K,o as G,j as ve,m as fe}from"./fb-firestore-AmJ3MB_X.js";import{a as je,T as ye,S as Ne,b as X,P as re,C as ie}from"./BrandIcons-Dis4tMzP.js";import{e as we,q as ke,r as Ce,s as Se,t as ce,u as Ae,v as de,U as De,w as Ee,x as ze,y as Pe,b as Le,z as Me,B as Fe,D as Te}from"./vendor-icons-Dn77n0aV.js";import{g as Ie}from"./accountLabels-0-tyWJPI.js";import"./fb-auth-BRLnzcC0.js";import"./fb-core-C5Q99qy-.js";import"./vendor-_yQiqF6F.js";function qe(){const{changePassword:l,orchestra:i}=Q(),[L]=o.useState(!1),[A,I]=o.useState(!1),[v,C]=o.useState(""),[D,N]=o.useState(""),[n,h]=o.useState(""),[c,f]=o.useState(""),[F,M]=o.useState(!1),[p,u]=o.useState(null),[j,S]=o.useState(null),[E,r]=o.useState(!1),[y,z]=o.useState(!1),[a,d]=o.useState({name:"",description:"",logoUrl:"",contact:{email:"",phone:"",address:"",website:""},socialMedia:{facebook:"",instagram:"",tiktok:"",youtube:""},companyData:{companyName:"",rnc:"",address:"",phone:"",contactName:""}});o.useEffect(()=>{i&&w()},[i]);const w=()=>{d({name:i.name||"",description:i.description||"",logoUrl:i.logoUrl||"",contact:i.contact||{email:"",phone:"",address:"",website:""},socialMedia:i.socialMedia||{facebook:"",instagram:"",tiktok:"",youtube:""},companyData:{companyName:"",rnc:"",address:"",phone:"",contactName:""}}),i.logoUrl&&S(i.logoUrl),xe(P(b,"orchestras",i.id,"private","company")).then(s=>{s.exists()&&d(m=>({...m,companyData:{...m.companyData,...s.data()}}))}).catch(s=>console.error("Error loading private company data:",s))},O=async s=>{s.preventDefault(),I(!0);try{if(!i?.id)throw new Error("No orchestra ID found");await R(P(b,"orchestras",i.id),{description:a.description,contact:a.contact,socialMedia:a.socialMedia,updatedAt:q()}),await be(P(b,"orchestras",i.id,"private","company"),{...a.companyData,updatedAt:q()},{merge:!0}),alert("✅ Perfil actualizado exitosamente")}catch(m){console.error("Error saving profile:",m),alert("❌ Error al guardar el perfil")}finally{I(!1)}},B=async s=>{if(s.preventDefault(),h(""),f(""),v!==D)return h("Las contraseñas no coinciden");if(v.length<6)return h("La contraseña debe tener al menos 6 caracteres");M(!0);try{await l(v),f("Contraseña actualizada correctamente"),C(""),N("")}catch(m){console.error("Error changing password:",m),m.code==="auth/requires-recent-login"?h("Por seguridad, debes cerrar sesión y volver a entrar para cambiar tu contraseña."):h("Error al cambiar contraseña: "+m.message)}finally{M(!1)}},V=s=>{const m=s.target.files[0];if(!m)return;if(!m.type.startsWith("image/")){alert("Por favor selecciona un archivo de imagen");return}if(m.size>2*1024*1024){alert("La imagen debe ser menor a 2MB");return}u(m);const g=new FileReader;g.onloadend=()=>{S(g.result)},g.readAsDataURL(m)},x=async()=>{if(!p||!i?.id){console.error("Missing logoFile or orchestra.id");return}r(!0);try{const s=new FileReader,g=await new Promise((k,U)=>{s.onloadend=()=>k(s.result),s.onerror=U,s.readAsDataURL(p)});if(g.length>9e5)throw new Error("La imagen es demasiado grande. Por favor usa una imagen menor a 500KB");await R(P(b,"orchestras",i.id),{logoUrl:g,updatedAt:q()}),d(k=>({...k,logoUrl:g})),S(g),u(null),alert("✅ Logo actualizado exitosamente")}catch(s){console.error("Error uploading logo:",s),console.error("Error details:",{code:s.code,message:s.message,name:s.name}),alert("❌ Error al subir el logo: "+s.message)}finally{r(!1)}},$=async()=>{if(!(!i?.id||!a.logoUrl)&&confirm("¿Estás seguro de eliminar el logo?")){z(!0);try{const s=await ge(),{ref:m,deleteObject:g}=await he(async()=>{const{ref:U,deleteObject:W}=await import("./fb-storage-Cs-_tWFR.js");return{ref:U,deleteObject:W}},__vite__mapDeps([0,1,2,3])),k=m(s,`orchestras/${i.id}/logo.jpg`);await g(k).catch(()=>{}),await R(P(b,"orchestras",i.id),{logoUrl:"",updatedAt:q()}),d(U=>({...U,logoUrl:""})),S(null),u(null),alert("✅ Logo eliminado")}catch(s){console.error("Error deleting logo:",s),alert("❌ Error al eliminar el logo")}finally{z(!1)}}},T=o.useMemo(()=>{const s=a.companyData||{},m=a.socialMedia||{},g=[{label:"Logo",done:!!a.logoUrl},{label:"Descripción",done:!!a.description?.trim()},{label:"Nombre de contacto",done:!!s.contactName?.trim()},{label:"Teléfono",done:!!s.phone?.trim()},{label:"Dirección",done:!!s.address?.trim()},{label:"Una red social",done:!!(m.instagram||m.facebook||m.tiktok||m.youtube)}],k=g.filter(U=>U.done).length;return{checks:g,done:k,total:g.length,pct:Math.round(k/g.length*100)}},[a]),t=(s,m,g)=>{d(s?k=>({...k,[s]:{...k[s],[m]:g}}):k=>({...k,[m]:g}))};return L?e.jsx("div",{className:"loading",children:"Cargando perfil..."}):e.jsxs("div",{className:"profile-tab",children:[e.jsx("h2",{children:"👤 Perfil de la Orquesta"}),e.jsx("p",{className:"section-description",children:"Configura la información básica de tu orquesta que se mostrará en las páginas públicas"}),e.jsxs("div",{className:"profile-progress",children:[e.jsxs("div",{className:"pp-head",children:[e.jsxs("span",{children:["Tu perfil está al ",e.jsxs("strong",{children:[T.pct,"%"]})]}),e.jsxs("span",{className:"pp-count",children:[T.done,"/",T.total]})]}),e.jsx("div",{className:"pp-track",children:e.jsx("div",{className:"pp-fill",style:{width:`${T.pct}%`}})}),T.pct<100?e.jsxs("p",{className:"pp-hint",children:["Te falta: ",T.checks.filter(s=>!s.done).map(s=>s.label).join(" · ")]}):e.jsx("p",{className:"pp-hint done",children:"🎉 ¡Perfil completo! Tu público te identifica mejor."})]}),e.jsxs("form",{onSubmit:O,children:[e.jsxs("div",{className:"form-section",children:[e.jsx("h3",{children:"📋 Información Básica"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nombre de la Orquesta *"}),e.jsx("input",{type:"text",value:a.name,disabled:!0,className:"input disabled"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Descripción"}),e.jsx("textarea",{className:"input",rows:"4",value:a.description,onChange:s=>t(null,"description",s.target.value),placeholder:"Una breve descripción de tu orquesta..."})]})]}),e.jsxs("div",{className:"form-section",children:[e.jsx("h3",{children:"🖼️ Logo / Imagen de Perfil"}),e.jsx("p",{className:"section-hint",children:"Sube el logo de tu orquesta. Se mostrará en las páginas públicas para que tu audiencia te identifique fácilmente."}),e.jsxs("div",{className:"logo-upload-container",children:[e.jsx("div",{className:"logo-preview",children:j?e.jsx("img",{src:j,alt:"Logo preview",className:"logo-image"}):e.jsxs("div",{className:"logo-placeholder",children:[e.jsx("span",{children:"🎵"}),e.jsx("p",{children:"Sin logo"})]})}),e.jsxs("div",{className:"logo-actions",children:[e.jsx("input",{type:"file",id:"logo-input",accept:"image/*",onChange:V,disabled:E,style:{display:"none"}}),e.jsx("label",{htmlFor:"logo-input",className:`btn btn-outline ${E?"disabled":""}`,style:{cursor:E?"not-allowed":"pointer"},children:"📁 Seleccionar Imagen"}),p&&e.jsx("button",{type:"button",className:"btn btn-primary",onClick:x,disabled:E,children:E?"⏳ Subiendo...":"⬆️ Subir Logo"}),a.logoUrl&&!p&&e.jsx("button",{type:"button",className:"btn btn-danger",onClick:$,disabled:y,children:y?"⏳ Eliminando...":"🗑️ Eliminar Logo"})]}),e.jsx("p",{className:"upload-hint",children:"💡 Recomendado: Imagen cuadrada, máximo 2MB, formato JPG o PNG"}),E&&e.jsxs("div",{className:"upload-overlay",children:[e.jsx("div",{className:"upload-spinner"}),e.jsx("p",{children:"Subiendo logo..."})]})]})]}),e.jsxs("div",{className:"form-section",children:[e.jsx("h3",{children:"🏢 Datos para Facturación"}),e.jsx("p",{className:"section-hint",children:"Solo los necesitas cuando vayas a recibir pagos. Puedes completarlos más adelante."}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Razón Social (Nombre Empresa)"}),e.jsx("input",{type:"text",className:"input",value:a.companyData?.companyName||"",onChange:s=>t("companyData","companyName",s.target.value),placeholder:"Ej: Inversiones Musicales SRL"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"RNC / Cédula"}),e.jsx("input",{type:"text",className:"input",value:a.companyData?.rnc||"",onChange:s=>t("companyData","rnc",s.target.value),placeholder:"Ej: 101-00000-0"})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nombre de Contacto"}),e.jsx("input",{type:"text",className:"input",value:a.companyData?.contactName||"",onChange:s=>t("companyData","contactName",s.target.value),placeholder:"Persona responsable"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Teléfono (Registro)"}),e.jsx("input",{type:"tel",className:"input",value:a.companyData?.phone||"",onChange:s=>t("companyData","phone",s.target.value)})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Dirección Fiscal"}),e.jsx("input",{type:"text",className:"input",value:a.companyData?.address||"",onChange:s=>t("companyData","address",s.target.value)})]})]}),e.jsxs("div",{className:"form-section",children:[e.jsx("h3",{children:"📞 Información de Contacto (Público)"}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Email"}),e.jsx("span",{className:"badge-readonly",children:"Solo Lectura"}),e.jsx("input",{type:"email",value:a.contact.email,disabled:!0,className:"input disabled",placeholder:"contacto@orquesta.com"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Teléfono"}),e.jsx("input",{type:"tel",className:"input",value:a.contact.phone,onChange:s=>t("contact","phone",s.target.value),placeholder:"+1-809-555-1234"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Dirección"}),e.jsx("input",{type:"text",className:"input",value:a.contact.address,onChange:s=>t("contact","address",s.target.value),placeholder:"Santo Domingo, República Dominicana"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Sitio Web"}),e.jsx("input",{type:"url",className:"input",value:a.contact.website,onChange:s=>t("contact","website",s.target.value),placeholder:"https://www.tuorquesta.com"})]})]}),e.jsxs("div",{className:"form-section",children:[e.jsx("h3",{children:"🌐 Redes Sociales"}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"📘 Facebook"}),e.jsx("input",{type:"url",className:"input",value:a.socialMedia.facebook,onChange:s=>t("socialMedia","facebook",s.target.value),placeholder:"https://facebook.com/tuorquesta"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"📸 Instagram"}),e.jsx("input",{type:"text",className:"input",value:a.socialMedia.instagram,onChange:s=>t("socialMedia","instagram",s.target.value),placeholder:"@tuorquesta"})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"🎵 TikTok"}),e.jsx("input",{type:"text",className:"input",value:a.socialMedia.tiktok,onChange:s=>t("socialMedia","tiktok",s.target.value),placeholder:"@tuorquesta"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"▶️ YouTube"}),e.jsx("input",{type:"url",className:"input",value:a.socialMedia.youtube,onChange:s=>t("socialMedia","youtube",s.target.value),placeholder:"https://youtube.com/@tuorquesta"})]})]})]}),e.jsxs("div",{className:"form-section security-section",children:[e.jsx("h3",{children:"🔒 Seguridad"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nueva Contraseña"}),e.jsx("input",{type:"password",className:"input",value:v,onChange:s=>C(s.target.value),placeholder:"••••••••",autoComplete:"new-password"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Confirmar Nueva Contraseña"}),e.jsx("input",{type:"password",className:"input",value:D,onChange:s=>N(s.target.value),placeholder:"••••••••",autoComplete:"new-password"})]}),n&&e.jsx("div",{className:"error-message",children:n}),c&&e.jsx("div",{className:"success-message",children:c}),e.jsx("button",{className:"btn btn-outline",onClick:B,disabled:F||!v,style:{marginTop:"1rem"},children:F?"⏳ Actualizando...":"🔑 Cambiar Contraseña"})]}),e.jsx("div",{className:"form-actions",children:e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:A,children:A?"💾 Guardando...":"💾 Guardar Cambios"})})]}),e.jsx("style",{children:`
                .profile-tab h2 {
                    font-size: 2rem;
                    color: white;
                    margin-bottom: var(--space-2);
                }

                .section-description {
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: var(--space-4);
                }

                .profile-progress {
                    background: rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: var(--radius-lg);
                    padding: 14px 16px;
                    margin-bottom: var(--space-6);
                }
                .pp-head {
                    display: flex; justify-content: space-between; align-items: baseline;
                    color: white; font-size: 0.95rem; margin-bottom: 8px;
                }
                .pp-head strong { color: #00F2FE; font-size: 1.05rem; }
                .pp-count { color: rgba(255,255,255,0.5); font-size: 0.82rem; }
                .pp-track {
                    height: 8px; background: rgba(255,255,255,0.1);
                    border-radius: 999px; overflow: hidden;
                }
                .pp-fill {
                    height: 100%; border-radius: 999px;
                    background: linear-gradient(90deg, #00F2FE, #FF0080);
                    transition: width 0.4s ease;
                }
                .pp-hint { color: rgba(255,255,255,0.6); font-size: 0.82rem; margin: 8px 0 0; }
                .pp-hint.done { color: #4ade80; }

                .form-section {
                    background: rgba(0, 0, 0, 0.2);
                    padding: var(--space-5);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--space-4);
                }

                .form-section h3 {
                    color: white;
                    font-size: 1.3rem;
                    margin-bottom: var(--space-4);
                    border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                    padding-bottom: var(--space-2);
                }

                .form-group {
                    margin-bottom: var(--space-4);
                }

                .form-group label {
                    display: block;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 500;
                    margin-bottom: var(--space-2);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: var(--space-6);
                    padding-top: var(--space-4);
                    border-top: 2px solid rgba(139, 92, 246, 0.2);
                }

                .form-actions .btn {
                    min-width: 200px;
                }

                .loading {
                    text-align: center;
                    padding: var(--space-8);
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 1.2rem;
                }

                    .form-section {
                        padding: var(--space-4);
                    }
                }

                .input.disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    background: rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.5);
                }

                .badge-readonly {
                    display: inline-block;
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    font-size: 0.7rem;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-left: 8px;
                    vertical-align: middle;
                    text-transform: uppercase;
                }

                .error-message {
                    color: #fca5a5;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .success-message {
                    color: #4ade80;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .section-hint {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.9rem;
                    margin-bottom: var(--space-4);
                }

                .logo-upload-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-4);
                }

                .logo-preview {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid rgba(139, 92, 246, 0.3);
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .logo-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .logo-placeholder {
                    text-align: center;
                    color: rgba(255, 255, 255, 0.5);
                }

                .logo-placeholder span {
                    font-size: 3rem;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .logo-placeholder p {
                    margin: 0;
                    font-size: 0.9rem;
                }

                .logo-actions {
                    display: flex;
                    gap: var(--space-3);
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .logo-actions label {
                    cursor: pointer;
                    margin: 0;
                }

                .upload-hint {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.85rem;
                    text-align: center;
                    margin: 0;
                }

                .btn-danger {
                    background: rgba(220, 38, 38, 0.2);
                    border: 1px solid rgba(220, 38, 38, 0.4);
                    color: #fca5a5;
                }

                .btn-danger:hover:not(:disabled) {
                    background: rgba(220, 38, 38, 0.3);
                    border-color: rgba(220, 38, 38, 0.6);
                }

                .upload-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-3);
                    z-index: 10;
                }

                .upload-overlay p {
                    color: white;
                    font-weight: 600;
                    margin: 0;
                }

                .upload-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 255, 255, 0.2);
                    border-top-color: var(--brand-cyan-pulse, #00F2FE);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .logo-upload-container {
                    position: relative;
                }
            `})]})}function $e(){const{orchestra:l}=Q(),i=l?.id,[L,A]=o.useState([]),[I,v]=o.useState(!0),[C,D]=o.useState(""),[N,n]=o.useState(!1),[h,c]=o.useState(!1),[f,F]=o.useState(""),[M,p]=o.useState(!1),[u,j]=o.useState(null),[S,E]=o.useState({title:"",artist:"",genre:"",durationMinutes:"",isActive:!0}),r=`Suavemente - Elvis Crespo - Merengue
Obsesión - Aventura - Bachata
Vivir Mi Vida - Marc Anthony - Salsa
Propuesta Indecente - Romeo Santos - Bachata
La Bilirrubina - Juan Luis Guerra - Merengue
El Perdedor - Maluma ft. Yandel - Urbano
Bailando - Enrique Iglesias - Pop
Darte un Beso - Prince Royce - Bachata
La Gozadera - Gente de Zona - Salsa
El Tiburón - Proyecto Uno - Merengue
Te Extraño - Xtreme - Bachata
A Pedir Su Mano - Juan Luis Guerra - Merengue
Eres Tú - Carla Morrison - Pop
La Jumba - Omega - Mambo
Échame la Culpa - Luis Fonsi & Demi Lovato - Pop`;o.useEffect(()=>{y()},[i]);const y=async()=>{try{const t=Y(_(b,"songs"),J("orchestraId","==",i)),m=(await oe(t)).docs.map(g=>({id:g.id,...g.data()}));A(m.sort((g,k)=>g.title.localeCompare(k.title)))}catch(t){console.error("Error loading songs:",t)}finally{v(!1)}},z=()=>{j(null),E({title:"",artist:"",genre:"",durationMinutes:"",isActive:!0}),n(!0)},a=t=>{j(t),E({title:t.title,artist:t.artist,genre:t.genre||"",durationMinutes:t.durationMinutes||"",isActive:t.isActive!==!1}),n(!0)},d=async t=>{t.preventDefault();try{const s={...S,durationMinutes:parseFloat(S.durationMinutes)||0,orchestraId:i,eventId:i,updatedAt:q()};u?await R(P(b,"songs",u.id),s):await K(_(b,"songs"),{...s,createdAt:q()}),n(!1),y()}catch(s){console.error("Error saving song:",s),alert("Error al guardar la canción")}},w=async t=>{if(confirm(`¿Eliminar "${t.title}"?`))try{await le(P(b,"songs",t.id)),y()}catch(s){console.error("Error deleting song:",s),alert("Error al eliminar la canción")}},O=async t=>{try{await R(P(b,"songs",t.id),{isActive:!t.isActive}),y()}catch(s){console.error("Error toggling song:",s)}},B=async()=>{if(f.trim()){p(!0);try{const t=f.split(`
`);let s=0;const m=[];for(const g of t){if(!g.trim())continue;const k=g.toLowerCase();if((k.includes("titulo")||k.includes("título"))&&k.includes("artista"))continue;let U=g.trim(),W="Orquesta",ae="";const se=g.includes(",")?",":g.includes("-")?"-":null;if(se){const H=g.split(se);U=H[0].trim(),H.length>=2&&H[1].trim()&&(W=H[1].trim()),H.length>=3&&(ae=H[2].trim())}U&&(m.push(K(_(b,"songs"),{orchestraId:i,eventId:i,title:U,artist:W,genre:ae,durationMinutes:0,isActive:!0,createdAt:q(),updatedAt:q()})),s++)}await Promise.all(m),alert(`✅ Se agregaron ${s} canciones exitosamente.`),c(!1),F(""),y()}catch(t){console.error("Error in bulk upload:",t),alert("Error al procesar la lista.")}finally{p(!1)}}},V=()=>{F(r)},x=()=>{const s="\uFEFF"+["Titulo,Artista,Genero","La Bilirrubina,Juan Luis Guerra,Merengue","Vivir Mi Vida,Marc Anthony,Salsa","Propuesta Indecente,Romeo Santos,Bachata"].join(`
`)+`
`,m=new Blob([s],{type:"text/csv;charset=utf-8;"}),g=URL.createObjectURL(m),k=document.createElement("a");k.href=g,k.download="plantilla_repertorio_tokalive.csv",document.body.appendChild(k),k.click(),document.body.removeChild(k),URL.revokeObjectURL(g)},$=t=>{const s=t.target.files?.[0];if(!s)return;const m=new FileReader;m.onload=g=>{F(String(g.target?.result||""))},m.onerror=()=>alert("No se pudo leer el archivo."),m.readAsText(s),t.target.value=""},T=L.filter(t=>t.title.toLowerCase().includes(C.toLowerCase())||t.artist.toLowerCase().includes(C.toLowerCase()));return I?e.jsx("div",{className:"loading",children:"Cargando repertorio..."}):e.jsxs("div",{className:"repertoire-tab",children:[e.jsxs("div",{className:"repertoire-header",children:[e.jsxs("div",{children:[e.jsx("h2",{children:"🎵 Gestión de Repertorio"}),e.jsx("p",{className:"section-description",children:"Administra las canciones disponibles para tus eventos"})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx("button",{className:"btn btn-outline",onClick:()=>c(!0),children:"📤 Carga Masiva"}),e.jsx("button",{className:"btn btn-primary",onClick:z,children:"➕ Agregar Canción"})]})]}),e.jsx("div",{className:"search-bar",children:e.jsx("input",{type:"text",className:"input",placeholder:"🔍 Buscar por título o artista...",value:C,onChange:t=>D(t.target.value)})}),e.jsx("div",{className:"songs-list",children:T.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("p",{children:"No hay canciones en el repertorio"}),e.jsx("button",{className:"btn btn-outline",onClick:z,children:"➕ Agregar Primera Canción"})]}):T.map(t=>e.jsxs("div",{className:`song-card ${t.isActive?"":"inactive"}`,children:[e.jsxs("div",{className:"song-info",children:[e.jsx("h3",{children:t.title}),e.jsx("p",{className:"artist",children:t.artist}),e.jsxs("div",{className:"song-meta",children:[t.genre&&e.jsx("span",{className:"badge",children:t.genre}),t.durationMinutes&&e.jsxs("span",{className:"duration",children:["⏱️ ",t.durationMinutes," min"]})]})]}),e.jsxs("div",{className:"song-actions",children:[e.jsx("button",{className:`btn btn-sm ${t.isActive?"btn-success":"btn-outline"}`,onClick:()=>O(t),title:t.isActive?"Desactivar":"Activar",children:t.isActive?"✓ Activa":"✗ Inactiva"}),e.jsx("button",{className:"btn btn-sm btn-primary",onClick:()=>a(t),children:"✏️ Editar"}),e.jsx("button",{className:"btn btn-sm btn-outline",onClick:()=>w(t),children:"🗑️ Eliminar"})]})]},t.id))}),N&&te.createPortal(e.jsx("div",{className:"modal-overlay",onClick:()=>n(!1),children:e.jsxs("div",{className:"modal-content",onClick:t=>t.stopPropagation(),children:[e.jsx("h3",{children:u?"✏️ Editar Canción":"➕ Agregar Canción"}),e.jsxs("form",{onSubmit:d,children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Título *"}),e.jsx("input",{type:"text",className:"input",value:S.title,onChange:t=>E({...S,title:t.target.value}),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Artista *"}),e.jsx("input",{type:"text",className:"input",value:S.artist,onChange:t=>E({...S,artist:t.target.value}),required:!0})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Género"}),e.jsx("input",{type:"text",className:"input",value:S.genre,onChange:t=>E({...S,genre:t.target.value}),placeholder:"Merengue, Bachata, Salsa..."})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Duración (min)"}),e.jsx("input",{type:"number",step:"0.1",className:"input",value:S.durationMinutes,onChange:t=>E({...S,durationMinutes:t.target.value}),placeholder:"3.5"})]})]}),e.jsx("div",{className:"form-group",children:e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",checked:S.isActive,onChange:t=>E({...S,isActive:t.target.checked})}),e.jsx("span",{children:"Canción activa (disponible para solicitudes)"})]})}),e.jsxs("div",{className:"modal-actions",children:[e.jsx("button",{type:"button",className:"btn btn-outline",onClick:()=>n(!1),children:"Cancelar"}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"💾 Guardar"})]})]})]})}),document.body),h&&te.createPortal(e.jsx("div",{className:"modal-overlay",onClick:()=>c(!1),children:e.jsxs("div",{className:"modal-content",onClick:t=>t.stopPropagation(),children:[e.jsx("h3",{children:"📤 Carga Masiva de Canciones"}),e.jsxs("p",{style:{color:"rgba(255,255,255,0.7)",marginBottom:"1rem"},children:["Pega tu lista, o descarga la plantilla, llénala y súbela. Formato por línea:",e.jsx("br",{}),e.jsx("code",{children:"Título - Artista - Género"}),"  o  ",e.jsx("code",{children:"Título,Artista,Género"})]}),e.jsxs("div",{className:"template-actions",children:[e.jsx("button",{className:"btn btn-outline btn-sm",onClick:x,disabled:M,children:"📥 Descargar Plantilla (CSV)"}),e.jsxs("label",{className:`btn btn-outline btn-sm ${M?"disabled":""}`,style:{cursor:M?"not-allowed":"pointer",margin:0},children:["📂 Subir Archivo",e.jsx("input",{type:"file",accept:".csv,.txt",onChange:$,disabled:M,style:{display:"none"}})]})]}),e.jsx("textarea",{className:"input",rows:"10",value:f,onChange:t=>F(t.target.value),placeholder:`La Bilirrubina - Juan Luis Guerra - Merengue
Vivir Mi Vida - Marc Anthony - Salsa`,style:{fontFamily:"monospace",fontSize:"0.9rem"}}),e.jsxs("div",{className:"modal-actions",children:[e.jsx("button",{className:"btn btn-outline",onClick:()=>c(!1),disabled:M,children:"Cancelar"}),e.jsx("button",{className:"btn btn-outline",onClick:V,disabled:M,title:"Cargar lista de ejemplo",children:"📝 Cargar Ejemplo"}),e.jsx("button",{className:"btn btn-primary",onClick:B,disabled:M||!f.trim(),children:M?"Procesando...":"🚀 Cargar Canciones"})]})]})}),document.body),e.jsx("style",{children:`
                .template-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 12px;
                }

                .repertoire-tab h2 {
                    font-size: 2rem;
                    color: white;
                    margin-bottom: var(--space-2);
                }

                .repertoire-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-6);
                }

                .section-description {
                    color: rgba(255, 255, 255, 0.7);
                }

                .search-bar {
                    margin-bottom: var(--space-4);
                }

                .songs-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .song-card {
                    background: rgba(0, 0, 0, 0.2);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                }

                .song-card.inactive {
                    opacity: 0.6;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .song-card:hover {
                    background: rgba(0, 0, 0, 0.3);
                    border-color: var(--primary);
                }

                .song-info h3 {
                    color: white;
                    font-size: 1.2rem;
                    margin-bottom: var(--space-1);
                }

                .song-info .artist {
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: var(--space-2);
                }

                .song-meta {
                    display: flex;
                    gap: var(--space-2);
                    align-items: center;
                }

                .song-meta .badge {
                    background: rgba(139, 92, 246, 0.3);
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-sm);
                    font-size: 0.85rem;
                    color: white;
                }

                .song-meta .duration {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .song-actions {
                    display: flex;
                    gap: var(--space-2);
                }

                .empty-state {
                    text-align: center;
                    padding: var(--space-8);
                    color: rgba(255, 255, 255, 0.7);
                }

                .empty-state p {
                    font-size: 1.2rem;
                    margin-bottom: var(--space-4);
                }

                /* Modal */
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
                    background: var(--bg-dark-card);
                    padding: var(--space-6);
                    border-radius: var(--radius-lg);
                    max-width: 500px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-content h3 {
                    color: white;
                    font-size: 1.5rem;
                    margin-bottom: var(--space-4);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-3);
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: rgba(255, 255, 255, 0.9);
                    cursor: pointer;
                }

                .checkbox-label input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                .modal-actions {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: var(--space-3);
                    margin-top: var(--space-4);
                    padding-top: var(--space-4);
                    border-top: 2px solid rgba(139, 92, 246, 0.2);
                }

                @media (max-width: 768px) {
                    .repertoire-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-3);
                    }

                    .song-card {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .song-actions {
                        width: 100%;
                        justify-content: flex-start;
                        flex-wrap: wrap;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `})]})}function Re(){const{orchestra:l}=Q(),[i,L]=o.useState(null),[A,I]=o.useState([]),[v,C]=o.useState(!0),[D,N]=o.useState(!1),[n,h]=o.useState({name:"",venue:"",location:"",date:new Date().toISOString().split("T")[0],accessPin:""});o.useEffect(()=>{if(!l?.id)return;const r=P(b,"orchestras",l.id),y=G(r,z=>{if(z.exists()){const a=z.data();if(a.currentActivityId){const d=P(b,"activities",a.currentActivityId);G(d,w=>{w.exists()&&L({id:w.id,...w.data()}),C(!1)})}else L(null),C(!1)}});return()=>y()},[l?.id]),o.useEffect(()=>{if(!l?.id)return;const r=Y(_(b,"activities"),J("orchestraId","==",l.id)),y=G(r,z=>{const a=z.docs.map(d=>({id:d.id,...d.data()}));a.sort((d,w)=>{const O=d.createdAt?.toDate?d.createdAt.toDate():new Date(d.createdAt||0);return(w.createdAt?.toDate?w.createdAt.toDate():new Date(w.createdAt||0))-O}),I(a)},z=>{console.error("Error fetching activities history:",z)});return()=>y()},[l?.id]);const c=A.find(r=>r.id!==i?.id),f=async({name:r,venue:y,location:z,date:a,accessPin:d})=>{C(!0);try{const w=await K(_(b,"activities"),{orchestraId:l.id,name:r,venue:y,location:z,date:a instanceof Date?a:new Date(a+"T12:00:00"),accessPin:d||null,status:"active",startedAt:q(),completedAt:null,revenue:{total:0,tips:0,priority:0,challenges:0,requests:0},songsPlayed:[],createdAt:q(),updatedAt:q()});return await R(P(b,"orchestras",l.id),{currentActivityId:w.id,updatedAt:q()}),!0}catch(w){return console.error("Error creating activity:",w),alert("❌ Error al crear actividad"),!1}finally{C(!1)}},F=async r=>{if(r.preventDefault(),i){alert("⚠️ Ya existe una actividad activa. Complétala primero.");return}await f(n)&&(alert("✅ Actividad creada exitosamente"),N(!1),h({name:"",venue:"",location:"",date:new Date().toISOString().split("T")[0],accessPin:""}))},M=async()=>{if(i)return;const r=new Date().toISOString().split("T")[0];await f({name:`Show ${new Date().toLocaleDateString("es-DO",{day:"numeric",month:"short"})}`,venue:c?.venue||"En vivo",location:c?.location||"",date:r,accessPin:""})&&alert("🔴 ¡Show iniciado! Ya puedes recibir pedidos.")},p=()=>{h(r=>({...r,venue:r.venue||c?.venue||"",location:r.location||c?.location||""})),N(!0)},u=async()=>{if(i&&confirm("¿Completar esta actividad? No podrás reactivarla.")){C(!0);try{await R(P(b,"activities",i.id),{status:"completed",completedAt:q(),updatedAt:q()}),await R(P(b,"orchestras",l.id),{currentActivityId:null,updatedAt:q()}),alert("✅ Actividad completada")}catch(r){console.error("Error completing activity:",r),alert("❌ Error al completar actividad")}finally{C(!1)}}},j=r=>new Intl.NumberFormat("es-DO",{style:"currency",currency:"DOP",minimumFractionDigits:0}).format(r).replace("DOP","RD$"),S=r=>r?(r.toDate?r.toDate():new Date(r)).toLocaleDateString("es-DO",{year:"numeric",month:"long",day:"numeric"}):"",E=r=>r?(r.toDate?r.toDate():new Date(r)).toLocaleString("es-DO",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"";return v&&!i?e.jsx("div",{className:"loading",children:"⏳ Cargando..."}):e.jsxs("div",{className:"activities-tab",children:[e.jsxs("div",{className:"tab-header",children:[e.jsxs("h2",{children:[e.jsx(je,{size:28})," Actividades y Shows"]}),e.jsx("p",{children:"Gestiona tus presentaciones en vivo y visualiza el historial"})]}),i?e.jsxs("div",{className:"current-activity glass-card",children:[e.jsxs("div",{className:"activity-header",children:[e.jsxs("div",{children:[e.jsx("span",{className:"activity-badge badge-success",children:"🔴 EN VIVO"}),e.jsx("h3",{children:i.name}),e.jsxs("p",{className:"activity-meta",children:[e.jsx(we,{size:16,className:"inline-icon"})," ",i.venue," • ",i.location]}),e.jsxs("p",{className:"activity-meta",children:[e.jsx(ye,{size:16,className:"inline-icon"})," Inicio: ",E(i.startedAt)]}),i.accessPin&&e.jsxs("p",{className:"activity-meta",style:{color:"var(--brand-gold)"},children:["🔒 PIN: ",e.jsx("strong",{children:i.accessPin})]})]}),e.jsxs("div",{className:"activity-actions",style:{display:"flex",gap:"0.5rem"},children:[e.jsxs("button",{className:"btn btn-outline btn-sm",onClick:()=>{const r=`${window.location.origin}/e/${l.id}`;window.open(r,"_blank")},title:"Ver página pública",children:[e.jsx(ke,{size:18})," Ver Página"]}),e.jsx("button",{className:"btn btn-outline btn-sm",onClick:()=>{const r=`${window.location.origin}/e/${l.id}`;navigator.clipboard.writeText(r),alert("Link copiado al portapapeles")},title:"Copiar enlace",children:e.jsx(Ce,{size:18})}),e.jsxs("button",{className:"btn btn-success",onClick:u,disabled:v,children:[e.jsx(Ne,{size:18})," Completar Actividad"]})]})]}),e.jsxs("div",{className:"revenue-grid",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx(X,{size:24,className:"stat-icon"}),e.jsxs("div",{children:[e.jsx("p",{className:"stat-label",children:"Total"}),e.jsx("p",{className:"stat-value",children:j(i.revenue?.total||0)})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx(X,{size:24,className:"stat-icon"}),e.jsxs("div",{children:[e.jsx("p",{className:"stat-label",children:"Propinas"}),e.jsx("p",{className:"stat-value",children:j(i.revenue?.tips||0)})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx(re,{size:24,className:"stat-icon"}),e.jsxs("div",{children:[e.jsx("p",{className:"stat-label",children:"Prioridad"}),e.jsx("p",{className:"stat-value",children:j(i.revenue?.priority||0)})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx(ie,{size:24,className:"stat-icon"}),e.jsxs("div",{children:[e.jsx("p",{className:"stat-label",children:"Challenges"}),e.jsx("p",{className:"stat-value",children:j(i.revenue?.challenges||0)})]})]})]}),e.jsxs("div",{className:"activity-stats",children:[e.jsxs("p",{children:["🎵 Canciones tocadas: ",e.jsx("strong",{children:i.songsPlayed?.length||0})]}),e.jsxs("p",{children:["📝 Solicitudes: ",e.jsx("strong",{children:i.revenue?.requests||0})]})]})]}):e.jsxs("div",{className:"no-activity glass-card",children:[e.jsx("h3",{children:"🎸 ¿Listo para tocar?"}),e.jsx("p",{children:"Inicia tu show para empezar a recibir pedidos. Lo puedes cerrar al terminar la noche."}),!D&&e.jsxs("div",{style:{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center",marginTop:"var(--space-3)"},children:[e.jsxs("button",{className:"btn btn-primary",onClick:M,disabled:v,children:["🔴 ",v?"Iniciando…":c?.venue?`Iniciar Show en ${c.venue}`:"Iniciar Show ahora"]}),e.jsx("button",{className:"btn btn-outline",onClick:p,disabled:v,children:"➕ Crear con detalles"})]}),c?.venue&&!D&&e.jsx("p",{style:{fontSize:"0.8rem",color:"var(--text-secondary)",marginTop:"var(--space-2)"},children:"Se reutilizará el lugar de tu último show. Puedes cambiarlo en “Crear con detalles”."})]}),D&&!i&&e.jsxs("div",{className:"create-activity-form glass-card",children:[e.jsx("h3",{children:"🎸 Nueva Actividad"}),e.jsxs("form",{onSubmit:F,children:[e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nombre de la Actividad *"}),e.jsx("input",{type:"text",className:"input",value:n.name,onChange:r=>h({...n,name:r.target.value}),placeholder:"Ej: Show en La Romana",required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Lugar/Venue *"}),e.jsx("input",{type:"text",className:"input",value:n.venue,onChange:r=>h({...n,venue:r.target.value}),placeholder:"Ej: Hotel Bahía Príncipe",required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Ubicación *"}),e.jsx("input",{type:"text",className:"input",value:n.location,onChange:r=>h({...n,location:r.target.value}),placeholder:"Ej: La Romana, RD",required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Fecha"}),e.jsx("input",{type:"date",className:"input",value:n.date,onChange:r=>h({...n,date:r.target.value})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"PIN de Acceso (Opcional)"}),e.jsx("input",{type:"text",className:"input",value:n.accessPin,onChange:r=>h({...n,accessPin:r.target.value}),placeholder:"Ej: 1234 (Dejar vacío para público)",maxLength:8}),e.jsx("small",{style:{color:"var(--text-secondary)",fontSize:"0.8rem"},children:"Si agregas un PIN, los usuarios deberán ingresarlo para pedir canciones."})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"button",className:"btn btn-outline",onClick:()=>N(!1),children:"Cancelar"}),e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:v,children:v?"⏳ Creando...":"🎸 Iniciar Actividad"})]})]})]}),e.jsxs("div",{className:"activities-history",children:[e.jsx("h3",{children:"📜 Historial de Actividades"}),A.length===0?e.jsx("p",{className:"empty-state",children:"No hay actividades registradas aún"}):e.jsx("div",{className:"activities-list",children:A.map(r=>e.jsxs("div",{className:"activity-item compact glass-card",children:[e.jsxs("div",{className:"activity-main-info",children:[e.jsxs("div",{className:"activity-date-badge",children:[e.jsx("span",{className:"day",children:S(r.date).split(" ")[0]}),e.jsx("span",{className:"month",children:S(r.date).split(" ")[2]?.substring(0,3)})]}),e.jsxs("div",{className:"activity-details",children:[e.jsx("h4",{children:r.name}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{children:["📍 ",r.venue]}),e.jsx("span",{className:"separator",children:"•"}),e.jsxs("span",{children:["🎵 ",r.revenue?.requests||0,"/",r.songsPlayed?.length||0," songs"]}),r.status==="active"&&e.jsx("span",{className:"badge badge-success tiny",children:"En vivo"})]})]})]}),e.jsxs("div",{className:"activity-compact-stats",children:[e.jsx("div",{className:"c-stat",title:"Total",children:e.jsx("span",{className:"value highlight",children:j(r.revenue?.total||0)})}),e.jsxs("div",{className:"c-stat-group",children:[e.jsxs("div",{className:"c-stat small",title:"Propinas",children:[e.jsx(X,{size:12})," ",j(r.revenue?.tips||0)]}),e.jsxs("div",{className:"c-stat small",title:"Prioridad",children:[e.jsx(re,{size:12})," ",j(r.revenue?.priority||0)]}),e.jsxs("div",{className:"c-stat small",title:"Challenges",children:[e.jsx(ie,{size:12})," ",j(r.revenue?.challenges||0)]})]})]})]},r.id))})]}),e.jsx("style",{children:`
                .activities-tab {
                    padding: var(--space-6);
                }

                .tab-header {
                    margin-bottom: var(--space-6);
                }

                .tab-header h2 {
                    margin-bottom: var(--space-2);
                }

                .tab-header p {
                    color: var(--text-secondary);
                    margin: 0;
                }

                .current-activity {
                    margin-bottom: var(--space-6);
                }

                .activity-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: var(--space-4);
                    gap: var(--space-4);
                }

                .activity-header h3 {
                    margin: var(--space-2) 0;
                }

                .activity-badge {
                    font-size: var(--text-sm);
                    animation: pulse 2s infinite;
                }

                .activity-meta {
                    color: var(--text-secondary);
                    margin: var(--space-1) 0;
                    font-size: var(--text-sm);
                }

                .revenue-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-4);
                    margin: var(--space-4) 0;
                }

                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: var(--radius-lg);
                }

                .stat-icon {
                    font-size: 2rem;
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: var(--text-sm);
                    margin: 0;
                }

                .stat-value {
                    font-size: var(--text-xl);
                    font-weight: 700;
                    margin: 0;
                }

                .activity-stats {
                    display: flex;
                    gap: var(--space-6);
                    padding-top: var(--space-4);
                    border-top: 1px solid var(--glass-border);
                }

                .activity-stats p {
                    margin: 0;
                    color: var(--text-secondary);
                }

                .no-activity {
                    text-align: center;
                    padding: var(--space-8);
                }

                .no-activity h3 {
                    color: var(--color-warning);
                }

                .create-activity-form {
                    margin-bottom: var(--space-6);
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--space-4);
                    margin: var(--space-4) 0;
                }

                .form-group label {
                    display: block;
                    margin-bottom: var(--space-2);
                    font-weight: 500;
                }

                .form-actions {
                    display: flex;
                    gap: var(--space-3);
                    justify-content: flex-end;
                    margin-top: var(--space-6);
                }

                .activities-history {
                    margin-top: var(--space-8);
                }

                .activities-history h3 {
                    margin-bottom: var(--space-4);
                }

                .empty-state {
                    text-align: center;
                    color: var(--text-secondary);
                    padding: var(--space-8);
                }

                .activities-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .activity-item.compact {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-3) var(--space-4);
                    gap: var(--space-4);
                }

                .activity-main-info {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }

                .activity-date-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 4px 8px;
                    border-radius: var(--radius-md);
                    min-width: 45px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .activity-date-badge .day {
                    font-size: 1.1rem;
                    font-weight: 700;
                    line-height: 1;
                }

                .activity-date-badge .month {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    color: var(--text-secondary);
                }

                .activity-details h4 {
                    margin: 0;
                    font-size: 1rem;
                    color: var(--text-primary);
                }

                .meta-row {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-top: 2px;
                }

                .meta-row .separator {
                    opacity: 0.3;
                }

                .badge.tiny {
                    font-size: 0.65rem;
                    padding: 2px 6px;
                }

                .activity-compact-stats {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 4px;
                    text-align: right;
                }

                .c-stat .value.highlight {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--brand-gold);
                }

                .c-stat-group {
                    display: flex;
                    gap: var(--space-3);
                }

                .c-stat.small {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                @media (max-width: 768px) {
                    .activity-item.compact {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .activity-compact-stats {
                        width: 100%;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        padding-top: var(--space-3);
                        border-top: 1px solid rgba(255, 255, 255, 0.05);
                        margin-top: var(--space-2);
                    }

                    .c-stat-group {
                        gap: var(--space-2);
                    }
                }

                .inline-icon {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 4px;
                }
                
                .stat-icon {
                    flex-shrink: 0;
                }
            `})]})}function Oe({orchestraId:l}){const[i,L]=o.useState([]),[A,I]=o.useState([]),[v,C]=o.useState(!1),[D,N]=o.useState(""),[n,h]=o.useState(null),[c,f]=o.useState(new Set),[F,M]=o.useState(""),[p,u]=o.useState(null);o.useEffect(()=>{if(!l)return;const a=Y(_(b,"setlists"),J("orchestraId","==",l));return G(a,d=>{L(d.docs.map(w=>({id:w.id,...w.data()})))})},[l]),o.useEffect(()=>{if(l)return G(P(b,"orchestras",l),a=>{a.exists()&&u(a.data().activeSetlistId)})},[l]),o.useEffect(()=>{if(!l)return;const a=Y(_(b,"songs"),J("orchestraId","==",l));return G(a,d=>{I(d.docs.map(w=>({id:w.id,...w.data()})))})},[l]);const j=async()=>{if(D.trim())try{await K(_(b,"setlists"),{orchestraId:l,name:D,songIds:[],createdAt:new Date}),N(""),C(!1)}catch(a){console.error(a),alert("Error creating setlist")}},S=async a=>{confirm("Eliminar lista?")&&await le(P(b,"setlists",a))},E=a=>{h(a.id),f(new Set(a.songIds||[])),M("")},r=a=>{const d=new Set(c);d.has(a)?d.delete(a):d.add(a),f(d)},y=async()=>{if(n)try{await R(P(b,"setlists",n),{songIds:Array.from(c)}),h(null)}catch(a){console.error(a),alert("Error saving")}},z=async a=>{if(confirm(`¿Activar "${a.name}"?
Esto ocultará las canciones que no estén en esta lista.`))try{await R(P(b,"orchestras",l),{activeSetlistId:a.id});const d=new Set(a.songIds),w=A.map(O=>{const B=d.has(O.id);return O.isActive!==B?R(P(b,"songs",O.id),{isActive:B}):Promise.resolve()});await Promise.all(w),alert(`Lista "${a.name}" ACTIVA!`)}catch(d){console.error(d),alert("Error al activar lista")}};return n?e.jsxs("div",{className:"setlist-editor glass-card",children:[e.jsxs("div",{className:"editor-header",children:[e.jsx("h3",{children:"Editando Lista"}),e.jsxs("div",{className:"actions",children:[e.jsx("button",{className:"btn btn-outline btn-sm",onClick:()=>h(null),children:"Cancelar"}),e.jsx("button",{className:"btn btn-success btn-sm",onClick:y,children:"Guardar Cambios"})]})]}),e.jsxs("div",{className:"song-selector",children:[e.jsxs("p",{children:["Selecciona las canciones para esta lista (",c.size,")"]}),e.jsx("input",{type:"text",className:"input search-input",placeholder:"🔍 Buscar canción...",value:F,onChange:a=>M(a.target.value)}),e.jsx("div",{className:"song-grid",children:A.filter(a=>{if(!F)return!0;const d=F.toLowerCase();return a.title.toLowerCase().includes(d)||a.artist?.toLowerCase().includes(d)}).map(a=>e.jsx("div",{className:`song-chip ${c.has(a.id)?"selected":""}`,onClick:()=>r(a.id),children:a.title},a.id))})]}),e.jsx("style",{children:`
                    .search-input { width: 100%; margin: 10px 0; background: rgba(0,0,0,0.4); }
                    .song-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 20px; max-height: 60vh; overflow-y: auto; }
                    .song-chip { padding: 10px; background: rgba(255,255,255,0.05); cursor: pointer; border-radius: 8px; font-size: 0.9rem; transition: all 0.2s; border: 1px solid transparent; }
                    .song-chip.selected { background: rgba(0, 242, 254, 0.2); border-color: #00F2FE; color: white; }
                    .editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                 `})]}):e.jsxs("div",{className:"setlists-tab",children:[e.jsxs("div",{className:"tab-header",children:[e.jsx("h2",{children:"Mis Setlists"}),e.jsxs("button",{className:"btn btn-gold btn-sm",onClick:()=>C(!0),children:[e.jsx(Se,{size:18})," Nueva Lista"]})]}),v&&e.jsxs("div",{className:"create-form glass-card",children:[e.jsx("input",{className:"input",placeholder:"Nombre de la lista (ej. Bodas, Merengue)",value:D,onChange:a=>N(a.target.value)}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{className:"btn btn-success btn-sm",onClick:j,children:"Crear"}),e.jsx("button",{className:"btn btn-outline btn-sm",onClick:()=>C(!1),children:"Cancelar"})]})]}),e.jsx("div",{className:"setlists-grid",children:i.map(a=>{const d=a.id===p;return e.jsxs("div",{className:`setlist-card glass-card ${d?"active-card":""}`,children:[e.jsxs("div",{className:"card-top",children:[e.jsx(ce,{size:24,className:`icon ${d?"text-neon":""}`}),e.jsxs("h3",{children:[a.name," ",d&&e.jsx("span",{className:"active-badge",children:"● ACTIVA"})]}),e.jsxs("span",{className:"count-badge",children:[a.songIds?.length||0," canciones"]}),e.jsxs("div",{className:"card-actions",children:[e.jsx("button",{className:"btn-icon",onClick:()=>E(a),title:"Editar canciones",children:e.jsx(Ae,{size:18})}),e.jsx("button",{className:"btn-icon text-danger",onClick:()=>S(a.id),children:e.jsx(de,{size:18})})]})]}),e.jsx("button",{className:`btn btn-full mt-4 ${d?"btn-success":"btn-primary"}`,onClick:()=>z(a),disabled:d,children:d?"En Uso":"Activar Ahora"})]},a.id)})}),e.jsx("style",{children:`
                .setlists-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 20px; }
                .setlist-card { padding: 20px; position: relative; border: 1px solid transparent; transition: all 0.3s ease; }
                .setlist-card.active-card { 
                    border-color: #00F2FE; 
                    background: rgba(0, 242, 254, 0.05);
                    box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
                }
                .active-badge { color: #00F2FE; font-size: 0.7rem; vertical-align: middle; margin-left: 5px; }
                .text-neon { color: #00F2FE; }
                .card-top { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
                .card-actions { position: absolute; top: 15px; right: 15px; display: flex; gap: 5px; }
                .btn-icon { background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; padding: 5px; transition: color 0.2s; }
                .btn-icon:hover { color: white; }
                .text-danger:hover { color: #ff4d4f; }
                .count-badge { font-size: 0.8rem; opacity: 0.7; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; }
                .tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .create-form { padding: 20px; margin-bottom: 20px; display: flex; gap: 10px; align-items: center; }
                .input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; color: white; flex: 1; }
                .mt-4 { margin-top: 1rem; }
            `})]})}function Ue(){return e.jsxs("div",{className:"payments-tab glass-card",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",textAlign:"center",minHeight:"400px"},children:[e.jsx("div",{style:{fontSize:"4rem",marginBottom:"20px",animation:"float 3s ease-in-out infinite"},children:"🚧"}),e.jsx("h2",{style:{fontSize:"2rem",marginBottom:"10px",color:"white"},children:"Próximamente"}),e.jsx("p",{style:{color:"rgba(255,255,255,0.7)",fontSize:"1.1rem",maxWidth:"400px"},children:"Estamos trabajando en un nuevo sistema de pagos y propinas digitales más rápido y seguro."}),e.jsx("div",{style:{marginTop:"30px",padding:"10px 20px",background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.3)",borderRadius:"10px",color:"#FFD700"},children:"👑 Prioridad y 💰 Propinas estarán disponibles pronto."}),e.jsx("style",{children:`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `})]})}function Be({orchestraId:l}){const[i,L]=o.useState([]),[A,I]=o.useState(""),[v,C]=o.useState(!1),[D,N]=o.useState("");o.useEffect(()=>{const c=G(P(b,"orchestras",l),f=>{if(f.exists()){const F=f.data();L(F.moderatorEmails||[])}});return()=>c()},[l]);const n=async c=>{c.preventDefault(),N("");const f=A.trim().toLowerCase();if(!f)return;if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f)){N("Ingresa un email válido");return}if(i.includes(f)){N("Este usuario ya es moderador");return}try{C(!0),await R(P(b,"orchestras",l),{moderatorEmails:ve(f)}),I(""),alert(`✅ Invitación envida a ${f}.

Pide al usuario que se registre o inicie sesión con este correo para acceder.`)}catch(M){console.error("Error adding moderator:",M),N("Error al agregar moderador. Verifica tus permisos.")}finally{C(!1)}},h=async c=>{if(confirm(`¿Estás seguro de quitar acceso a ${c}?`))try{await R(P(b,"orchestras",l),{moderatorEmails:fe(c)})}catch(f){console.error("Error removing moderator:",f),alert("Error al eliminar moderador")}};return e.jsxs("div",{className:"team-tab",children:[e.jsxs("div",{className:"team-header",children:[e.jsx("h2",{children:"👮‍♂️ Gestión de Equipo (Stage Managers)"}),e.jsx("p",{className:"tab-description",children:"Designa personas para que gestionen el show (repertorio, mensajes, challenges) sin darles tu contraseña ni acceso a pagos."})]}),e.jsxs("div",{className:"add-moderator-card glass-card",children:[e.jsx("h3",{children:"Agregar Nuevo Moderador"}),e.jsx("form",{onSubmit:n,className:"add-form",children:e.jsxs("div",{className:"input-group",children:[e.jsx("input",{type:"email",placeholder:"correo@ejemplo.com",value:A,onChange:c=>I(c.target.value),className:"form-input",disabled:v}),e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:v||!A,children:v?"Agregando...":e.jsxs(e.Fragment,{children:[e.jsx(De,{size:18})," Agregar"]})})]})}),D&&e.jsxs("p",{className:"error-msg",children:[e.jsx(Ee,{size:16})," ",D]}),e.jsxs("div",{className:"info-box",children:[e.jsx("strong",{children:"ℹ️ ¿Cómo funciona?"}),e.jsx("p",{children:"Al agregar un correo, si esa persona se registra (o ya está registrada) en Tokalive, verá automáticamente el acceso a tu orquesta en su cuenta, pero con funciones limitadas (Solo Operación)."})]})]}),e.jsxs("div",{className:"moderators-list",children:[e.jsxs("h3",{children:["Moderadores Activos (",i.length,")"]}),i.length===0?e.jsx("p",{className:"empty-state",children:"No tienes moderadores asignados."}):e.jsx("div",{className:"list-grid",children:i.map(c=>e.jsxs("div",{className:"moderator-item glass-card",children:[e.jsxs("div",{className:"mod-info",children:[e.jsx("span",{className:"mod-avatar",children:"👤"}),e.jsx("span",{className:"mod-email",children:c})]}),e.jsx("button",{className:"btn-icon delete",onClick:()=>h(c),title:"Revocar acceso",children:e.jsx(de,{size:18})})]},c))})]}),e.jsx("style",{children:`
                .team-header {
                    margin-bottom: var(--space-6);
                }
                .tab-description {
                    color: rgba(255,255,255,0.7);
                    max-width: 800px;
                }
                .add-moderator-card {
                    padding: var(--space-6);
                    margin-bottom: var(--space-6);
                    background: rgba(255, 255, 255, 0.03);
                }
                .add-form {
                    margin: var(--space-4) 0;
                }
                .input-group {
                    display: flex;
                    gap: var(--space-2);
                    max-width: 500px;
                }
                .form-input {
                    flex: 1;
                    padding: 10px 15px;
                    border-radius: var(--radius-md);
                    border: 1px solid rgba(255,255,255,0.2);
                    background: rgba(0,0,0,0.3);
                    color: white;
                }
                .error-msg {
                    color: #ff4d4f;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 10px;
                    font-size: 0.9rem;
                }
                .info-box {
                    margin-top: var(--space-4);
                    padding: var(--space-3);
                    background: rgba(0, 242, 254, 0.1);
                    border: 1px solid rgba(0, 242, 254, 0.2);
                    border-radius: var(--radius-md);
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.9);
                }
                .list-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--space-4);
                    margin-top: var(--space-4);
                }
                .moderator-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-4);
                    background: rgba(255,255,255,0.05);
                }
                .mod-info {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }
                .mod-avatar {
                    font-size: 1.5rem;
                }
                .mod-email {
                    font-weight: 500;
                }
                .btn-icon.delete {
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.4);
                    cursor: pointer;
                    transition: color 0.2s;
                    padding: 5px;
                }
                .btn-icon.delete:hover {
                    color: #ff4d4f;
                }
            `})]})}const _e=["playing","played","completed"],Z=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],ne=l=>l?.toDate?l.toDate():l?.seconds?new Date(l.seconds*1e3):null,ee=l=>{const i=l<12;return`${l%12===0?12:l%12}${i?"am":"pm"}`};function Ge({orchestraId:l}){const[i,L]=o.useState([]),[A,I]=o.useState(!0),[v,C]=o.useState("30"),[D]=o.useState(()=>Date.now());o.useEffect(()=>{let p=!0;return oe(Y(_(b,"requests"),J("eventId","==",l))).then(u=>{p&&L(u.docs.map(j=>({id:j.id,...j.data()})))}).catch(()=>{}).finally(()=>{p&&I(!1)}),()=>{p=!1}},[l]);const N=o.useMemo(()=>{if(v==="all")return i;const p=D-Number(v)*864e5;return i.filter(u=>{const j=ne(u.requestedAt);return j&&j.getTime()>=p})},[i,v,D]),n=o.useMemo(()=>{const p=N.length,u=N.filter(x=>_e.includes(x.status)).length,j=N.filter(x=>x.dedication&&x.dedication.trim()).length,S=new Set(N.map(x=>x.songId||x.songTitle)).size,E={},r={},y=Array(24).fill(0),z=Array(7).fill(0),a={};N.forEach(x=>{const $=x.songTitle||"Desconocida";E[$]=(E[$]||0)+1,x.artist&&x.artist.trim()&&(r[x.artist]=(r[x.artist]||0)+1);const T=ne(x.requestedAt);if(T){y[T.getHours()]+=1,z[T.getDay()]+=1;const t=T.toISOString().slice(0,10);a[t]=(a[t]||0)+1}});const d=Object.entries(E).sort((x,$)=>$[1]-x[1]).slice(0,10),w=Object.entries(r).sort((x,$)=>$[1]-x[1]).slice(0,5),O=y.some(x=>x>0)?y.indexOf(Math.max(...y)):null,B=z.some(x=>x>0)?z.indexOf(Math.max(...z)):null,V=[];for(let x=13;x>=0;x--){const $=new Date(D-x*864e5),T=$.toISOString().slice(0,10);V.push({key:T,day:$.getDate(),count:a[T]||0})}return{total:p,played:u,dedications:j,uniqueSongs:S,topSongs:d,topArtists:w,hours:y,dow:z,peakHour:O,peakDow:B,trend:V}},[N,D]),h=n.total?Math.round(n.played/n.total*100):0,c=Math.max(1,...n.hours),f=Math.max(1,...n.dow),F=Math.max(1,...n.trend.map(p=>p.count)),M=n.topSongs.length?n.topSongs[0][1]:1;return A?e.jsxs("div",{className:"an-empty",children:[e.jsx("div",{className:"an-spinner"}),e.jsx("p",{children:"Cargando estadísticas…"})]}):e.jsxs("div",{className:"analytics-tab",children:[e.jsxs("div",{className:"an-head",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"an-title",children:"📊 Analítica"}),e.jsx("p",{className:"an-sub",children:"El pulso de tu público a lo largo del tiempo."})]}),e.jsx("div",{className:"an-period",children:[["7","7 días"],["30","30 días"],["all","Todo"]].map(([p,u])=>e.jsx("button",{className:`an-period-btn ${v===p?"active":""}`,onClick:()=>C(p),children:u},p))})]}),n.total===0?e.jsxs("div",{className:"an-empty",children:[e.jsx("div",{className:"an-empty-icon",children:"📭"}),e.jsx("p",{className:"an-empty-title",children:"Aún no hay datos en este periodo"}),e.jsx("p",{className:"an-empty-sub",children:"Cuando tu público empiece a pedir canciones, verás aquí sus tendencias."})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"an-kpis",children:[e.jsxs("div",{className:"an-kpi",children:[e.jsx("span",{className:"an-kpi-emoji",children:"📨"}),e.jsxs("div",{children:[e.jsx("p",{className:"an-kpi-val",children:n.total}),e.jsx("p",{className:"an-kpi-label",children:"Pedidos"})]})]}),e.jsxs("div",{className:"an-kpi",children:[e.jsx("span",{className:"an-kpi-emoji",children:"🎵"}),e.jsxs("div",{children:[e.jsx("p",{className:"an-kpi-val",children:n.uniqueSongs}),e.jsx("p",{className:"an-kpi-label",children:"Canciones únicas"})]})]}),e.jsxs("div",{className:"an-kpi",children:[e.jsx("span",{className:"an-kpi-emoji",children:"💌"}),e.jsxs("div",{children:[e.jsx("p",{className:"an-kpi-val",children:n.dedications}),e.jsx("p",{className:"an-kpi-label",children:"Dedicatorias"})]})]}),e.jsxs("div",{className:"an-kpi",children:[e.jsx("span",{className:"an-kpi-emoji",children:"✅"}),e.jsxs("div",{children:[e.jsxs("p",{className:"an-kpi-val",children:[h,"%"]}),e.jsx("p",{className:"an-kpi-label",children:"Tocadas"})]})]})]}),e.jsxs("div",{className:"an-card",children:[e.jsx("h3",{className:"an-card-title",children:"🔥 Canciones más pedidas"}),e.jsx("div",{className:"an-barlist",children:n.topSongs.map(([p,u],j)=>e.jsxs("div",{className:"an-bar-row",children:[e.jsx("span",{className:"an-bar-rank",children:j+1}),e.jsxs("div",{className:"an-bar-main",children:[e.jsxs("div",{className:"an-bar-label",children:[e.jsx("span",{className:"an-bar-name",children:p}),e.jsx("span",{className:"an-bar-count",children:u})]}),e.jsx("div",{className:"an-bar-track",children:e.jsx("div",{className:"an-bar-fill",style:{width:`${u/M*100}%`}})})]})]},p))})]}),e.jsxs("div",{className:"an-grid-2",children:[e.jsxs("div",{className:"an-card",children:[e.jsx("h3",{className:"an-card-title",children:"🕐 Horas pico"}),n.peakHour!==null&&e.jsxs("p",{className:"an-highlight",children:["Tu hora más activa: ",e.jsx("strong",{children:ee(n.peakHour)})]}),e.jsx("div",{className:"an-hours",children:n.hours.map((p,u)=>e.jsxs("div",{className:"an-hour-col",title:`${ee(u)}: ${p} pedidos`,children:[e.jsx("div",{className:"an-hour-bar-wrap",children:e.jsx("div",{className:`an-hour-bar ${u===n.peakHour?"peak":""}`,style:{height:`${p/c*100}%`}})}),u%6===0&&e.jsx("span",{className:"an-hour-label",children:ee(u)})]},u))})]}),e.jsxs("div",{className:"an-card",children:[e.jsx("h3",{className:"an-card-title",children:"📅 Días más activos"}),n.peakDow!==null&&e.jsxs("p",{className:"an-highlight",children:["Tu mejor día: ",e.jsx("strong",{children:Z[n.peakDow]})]}),e.jsx("div",{className:"an-dow",children:n.dow.map((p,u)=>e.jsxs("div",{className:"an-dow-col",title:`${Z[u]}: ${p}`,children:[e.jsx("div",{className:"an-dow-bar-wrap",children:e.jsx("div",{className:`an-dow-bar ${u===n.peakDow?"peak":""}`,style:{height:`${p/f*100}%`}})}),e.jsx("span",{className:"an-dow-label",children:Z[u]})]},u))})]})]}),e.jsxs("div",{className:"an-card",children:[e.jsx("h3",{className:"an-card-title",children:"📈 Pedidos por día (últimos 14 días)"}),e.jsx("div",{className:"an-trend",children:n.trend.map(p=>e.jsxs("div",{className:"an-trend-col",title:`${p.key}: ${p.count}`,children:[e.jsx("div",{className:"an-trend-bar-wrap",children:e.jsx("div",{className:"an-trend-bar",style:{height:`${p.count/F*100}%`}})}),e.jsx("span",{className:"an-trend-label",children:p.day})]},p.key))})]}),n.topArtists.length>0&&e.jsxs("div",{className:"an-card",children:[e.jsx("h3",{className:"an-card-title",children:"🎤 Artistas más pedidos"}),e.jsx("div",{className:"an-chips",children:n.topArtists.map(([p,u])=>e.jsxs("span",{className:"an-chip",children:[p," ",e.jsx("strong",{children:u})]},p))})]})]}),e.jsx("style",{children:`
        .analytics-tab { color: white; }
        .an-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 22px; }
        .an-title { font-size: 1.5rem; font-weight: 800; margin: 0; }
        .an-sub { color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 0.9rem; }
        .an-period { display: flex; gap: 6px; background: rgba(0,0,0,0.25); padding: 4px; border-radius: 999px; }
        .an-period-btn { background: transparent; border: none; color: rgba(255,255,255,0.7); padding: 7px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
        .an-period-btn.active { background: var(--brand-primary, #00F2FE); color: #04121a; }

        .an-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 22px; }
        .an-kpi { display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; }
        .an-kpi-emoji { font-size: 1.8rem; }
        .an-kpi-val { font-size: 1.7rem; font-weight: 800; margin: 0; line-height: 1; }
        .an-kpi-label { font-size: 0.78rem; color: rgba(255,255,255,0.6); margin: 4px 0 0; }

        .an-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin-bottom: 18px; }
        .an-card-title { font-size: 1.05rem; font-weight: 700; margin: 0 0 14px; }
        .an-highlight { font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: -6px 0 14px; }
        .an-highlight strong { color: var(--brand-primary, #00F2FE); }
        .an-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }

        .an-barlist { display: flex; flex-direction: column; gap: 12px; }
        .an-bar-row { display: flex; align-items: center; gap: 12px; }
        .an-bar-rank { width: 22px; text-align: center; font-weight: 800; color: rgba(255,255,255,0.4); flex-shrink: 0; }
        .an-bar-main { flex: 1; min-width: 0; }
        .an-bar-label { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 5px; }
        .an-bar-name { font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .an-bar-count { font-size: 0.85rem; font-weight: 700; color: var(--brand-primary, #00F2FE); flex-shrink: 0; }
        .an-bar-track { height: 8px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
        .an-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #00F2FE, #FF0080); }

        .an-hours { display: flex; align-items: flex-end; gap: 2px; height: 120px; }
        .an-hour-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
        .an-hour-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
        .an-hour-bar { width: 100%; min-height: 2px; background: rgba(0,242,254,0.35); border-radius: 3px 3px 0 0; transition: height 0.3s; }
        .an-hour-bar.peak { background: var(--brand-primary, #00F2FE); box-shadow: 0 0 10px rgba(0,242,254,0.6); }
        .an-hour-label { font-size: 0.6rem; color: rgba(255,255,255,0.45); margin-top: 4px; }

        .an-dow { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
        .an-dow-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
        .an-dow-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
        .an-dow-bar { width: 100%; min-height: 2px; background: rgba(255,0,128,0.4); border-radius: 4px 4px 0 0; transition: height 0.3s; }
        .an-dow-bar.peak { background: #FF0080; box-shadow: 0 0 10px rgba(255,0,128,0.6); }
        .an-dow-label { font-size: 0.7rem; color: rgba(255,255,255,0.55); margin-top: 5px; }

        .an-trend { display: flex; align-items: flex-end; gap: 5px; height: 110px; }
        .an-trend-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
        .an-trend-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
        .an-trend-bar { width: 100%; min-height: 2px; background: linear-gradient(180deg, #8B5CF6, #00F2FE); border-radius: 3px 3px 0 0; transition: height 0.3s; }
        .an-trend-label { font-size: 0.62rem; color: rgba(255,255,255,0.45); margin-top: 4px; }

        .an-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .an-chip { font-size: 0.85rem; padding: 7px 13px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
        .an-chip strong { color: var(--brand-primary, #00F2FE); margin-left: 4px; }

        .an-empty { text-align: center; padding: 50px 20px; color: rgba(255,255,255,0.6); }
        .an-empty-icon { font-size: 3rem; margin-bottom: 10px; }
        .an-empty-title { font-size: 1.15rem; color: white; font-weight: 700; margin: 0 0 6px; }
        .an-empty-sub { margin: 0; font-size: 0.9rem; }
        .an-spinner { width: 40px; height: 40px; margin: 0 auto 14px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #00F2FE; border-radius: 50%; animation: anSpin 1s linear infinite; }
        @keyframes anSpin { to { transform: rotate(360deg); } }
      `})]})}function aa(){const{eventId:l}=pe(),{userRole:i,orchestra:L}=Q(),A=L?.type==="venue",I=Ie(L?.type),[v,C]=o.useState("activities"),D=[{id:"activities",label:"Actividades",icon:e.jsx(ze,{size:20}),roles:["orchestra_owner","moderator","super_admin"]},{id:"analytics",label:"Analítica",icon:e.jsx(Pe,{size:20}),roles:["orchestra_owner","moderator","super_admin"]},{id:"setlists",label:"Setlists",icon:e.jsx(ce,{size:20}),roles:["orchestra_owner","moderator","super_admin"]},{id:"repertoire",label:"Repertorio",icon:e.jsx(Le,{size:20}),roles:["orchestra_owner","moderator","super_admin"]},{id:"profile",label:"Perfil",icon:e.jsx(Me,{size:20}),roles:["orchestra_owner","super_admin"]},{id:"payments",label:"Pagos",icon:e.jsx(Fe,{size:20}),roles:["orchestra_owner","super_admin"]},{id:"team",label:"Equipo",icon:e.jsx(Te,{size:20}),roles:["orchestra_owner","super_admin"]}],N=["repertoire","setlists","activities"],n=D.filter(c=>A&&N.includes(c.id)?!1:!c.roles||c.roles.includes(i||"audience")),h=n.some(c=>c.id===v)?v:n[0]?.id;return e.jsxs("div",{className:"settings-page",children:[e.jsx("div",{className:"settings-header",children:e.jsxs("div",{className:"header-content",children:[e.jsxs("div",{className:"brand-row",children:[e.jsx(me,{to:`/orchestra/${l}`,className:"btn btn-outline back-btn",children:"← Volver al Dashboard"}),e.jsx(ue,{size:"medium",variant:"text"}),e.jsx("span",{className:"panel-tag",children:A?"Configuración del Local":"Configuración de Orquesta"})]}),e.jsxs("div",{className:"orchestra-identity",children:[L?.logoUrl?e.jsx("img",{src:L.logoUrl,alt:L.name,className:"identity-logo"}):e.jsx("div",{className:"identity-logo identity-logo-fallback",children:A?"🏪":"🎶"}),e.jsxs("div",{className:"identity-info",children:[e.jsx("h1",{className:"settings-title",children:L?.name||`Mi ${I.entity}`}),e.jsx("div",{className:"identity-badges",children:e.jsx("span",{className:"id-badge id-type",children:A?"🏪 Local Comercial":"🎶 Orquesta / Artista"})}),e.jsx("p",{className:"subtitle",children:A?"Gestiona tu perfil, cola de canciones y configuraciones":"Gestiona tu perfil, repertorio y configuraciones"})]})]})]})}),e.jsxs("div",{className:"settings-container",children:[e.jsx("div",{className:"tabs-navigation",children:n.map(c=>e.jsxs("button",{className:`tab-button ${h===c.id?"active":""}`,onClick:()=>C(c.id),children:[e.jsx("span",{className:"tab-icon",children:c.icon}),e.jsx("span",{className:"tab-label",children:c.label})]},c.id))}),e.jsxs("div",{className:"tab-content",children:[h==="activities"&&e.jsx(Re,{}),h==="analytics"&&e.jsx(Ge,{orchestraId:l}),h==="setlists"&&e.jsx(Oe,{orchestraId:l}),h==="profile"&&e.jsx(qe,{eventId:l}),h==="repertoire"&&e.jsx($e,{}),h==="payments"&&e.jsx(Ue,{eventId:l}),h==="team"&&e.jsx(Be,{orchestraId:l})]})]}),e.jsx("style",{children:`
                .settings-page {
                    min-height: 100vh;
                    background: var(--brand-deep-velvet);
                    background-image: 
                        radial-gradient(circle at 20% 50%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(0, 242, 254, 0.1) 0%, transparent 50%);
                    padding: var(--space-6) var(--space-4);
                }

                .settings-header {
                    max-width: 1200px;
                    margin: 0 auto var(--space-6);
                }

                .header-content .subtitle {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 1rem;
                    margin: 0;
                }

                /* --- Orchestra identity header (matches Dashboard) --- */
                .brand-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
                .back-btn { margin: 0; }
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
                .identity-logo-fallback { display: flex; align-items: center; justify-content: center; font-size: 2rem; }
                .identity-info { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
                .identity-badges { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
                .id-badge {
                    display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 600;
                    padding: 5px 11px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85);
                }

                .settings-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                
                .settings-title {
                    font-size: 2rem;
                    color: white;
                    margin: 0;
                    line-height: 1.1;
                    font-family: var(--font-heading);
                    font-weight: 800;
                }

                .tabs-navigation {
                    display: flex;
                    background: rgba(0, 0, 0, 0.2);
                    border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                    overflow-x: auto;
                }

                .tab-button {
                    flex: 1;
                    min-width: 150px;
                    padding: var(--space-4);
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-2);
                    position: relative;
                }

                .tab-button:hover {
                    background: rgba(139, 92, 246, 0.1);
                    color: white;
                }

                .tab-button.active {
                    color: white;
                    background: rgba(139, 92, 246, 0.2);
                }

                .tab-button.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: var(--brand-electric-magenta);
                    box-shadow: 0 0 10px rgba(255, 0, 128, 0.5);
                }

                .tab-icon {
                    font-size: 1.5rem;
                }

                .tab-label {
                    font-weight: 500;
                }

                .tab-content {
                    padding: var(--space-6);
                    min-height: 500px;
                }

                @media (max-width: 768px) {
                    .settings-page {
                        padding: var(--space-4) var(--space-2);
                    }

                    .settings-title {
                        font-size: 1.6rem;
                    }

                    .identity-logo {
                        width: 52px;
                        height: 52px;
                        border-radius: 13px;
                    }

                    .tab-button {
                        min-width: 120px;
                        padding: var(--space-3);
                        flex-direction: column;
                        gap: var(--space-1);
                    }

                    .tab-label {
                        font-size: 0.85rem;
                    }

                    .tab-content {
                        padding: var(--space-4);
                    }
                }
            `})]})}export{aa as default};
