import React, { useState, useRef, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════
// THEME & STYLES
// ═══════════════════════════════════════════
const C = {
  bg:"#fafafa",bg2:"#fff",bg3:"#f5f5f7",bgDark:"#1d1d1f",
  text:"#1d1d1f",text2:"#6e6e73",text3:"#86868b",
  accent:"#e8550f",accent2:"#ff6b2b",
  blue:"#0066cc",green:"#1d7d34",purple:"#6e27c5",red:"#d30000",
  border:"#d2d2d7",borderLight:"#e8e8ed",
  card:"#fff",cardHover:"#fbfbfd",
};
const F="'SF Pro Display','SF Pro Text','Noto Sans SC',-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif";
const M="'SF Mono','JetBrains Mono','Menlo',monospace";

// ═══════════════════════════════════════════
// SITEMAP — all pages & hierarchy
// ═══════════════════════════════════════════
const SITEMAP = {
  home:{title:"首页",nav:"首页"},
  // -- 快速开始 --
  overview:{title:"什么是 Claude Code",nav:"认识",group:"快速开始",icon:"📖"},
  where:{title:"在哪里打开和使用",nav:"在哪里用",group:"快速开始",icon:"🖥️"},
  install:{title:"安装和配置",nav:"安装",group:"快速开始",icon:"📦"},
  // -- 核心概念 --
  howworks:{title:"工作原理",nav:"原理",group:"核心概念",icon:"⚙️"},
  commands:{title:"命令和快捷键在哪用",nav:"命令",group:"核心概念",icon:"⌨️"},
  memory:{title:"记忆系统 CLAUDE.md",nav:"记忆",group:"核心概念",icon:"🧠"},
  // -- 日常使用 --
  prompts:{title:"怎么跟它说话（提示词）",nav:"提示词",group:"日常使用",icon:"💬"},
  workflows:{title:"常见工作流程",nav:"工作流",group:"日常使用",icon:"🔄"},
  // -- 进阶 --
  think:{title:"Think 深度思考模式",nav:"Think",group:"进阶功能",icon:"🧠",parent:"advanced"},
  plan:{title:"Plan 规划模式",nav:"Plan",group:"进阶功能",icon:"🗺️",parent:"advanced"},
  subagents:{title:"子代理 SubAgents",nav:"子代理",group:"进阶功能",icon:"🤝",parent:"advanced"},
  mcp:{title:"MCP 扩展连接",nav:"MCP",group:"进阶功能",icon:"🔌",parent:"advanced"},
  skills:{title:"Skills 技能包",nav:"Skills",group:"进阶功能",icon:"⚡",parent:"advanced"},
  hooks:{title:"Hooks 自动化钩子",nav:"Hooks",group:"进阶功能",icon:"🪝",parent:"advanced"},
  // -- 更多 --
  practice:{title:"官方最佳实践",nav:"最佳实践",group:"最佳实践",icon:"✨"},
  platforms:{title:"平台与团队集成",nav:"平台",group:"更多",icon:"🔗"},
  exercises:{title:"动手练习",nav:"练习",group:"更多",icon:"🛠️"},
};
const PAGE_ORDER=["home","overview","where","install","howworks","commands","memory","prompts","workflows","think","plan","subagents","mcp","skills","hooks","practice","platforms","exercises"];
const TOP_GROUPS=["快速开始","核心概念","日常使用","进阶功能","最佳实践","更多"];

// ═══════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════
function Link({to,children,goTo,style:{...s}={}}){
  return <a href="#" onClick={e=>{e.preventDefault();goTo(to)}} style={{color:C.blue,textDecoration:"none",fontWeight:500,cursor:"pointer",...s}}>{children} <span style={{fontSize:"85%"}}>›</span></a>;
}

function WhereTag({items}){
  const map={"终端":"⌨️","VS Code":"💻","桌面App":"🖥️","网页版":"🌐","JetBrains":"🔧","全部":"✅"};
  return <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>{items.map((t,i)=><span key={i} style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:12,background:"#e8f4fd",color:"#0066cc"}}>{map[t]||"•"} {t}</span>)}</div>;
}

function CodeBox({title,children}){
  const [copied,setCopied]=useState(false);
  const preRef=useRef(null);
  const copy=()=>{
    if(!preRef.current)return;
    try{
      // Method: Select the pre element text and copy via Selection API
      const range=document.createRange();
      range.selectNodeContents(preRef.current);
      const sel=window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("copy");
      sel.removeAllRanges();
      setCopied(true);
      setTimeout(()=>setCopied(false),2000);
    }catch(e){
      // Fallback: textarea method
      try{
        const ta=document.createElement("textarea");
        ta.value=preRef.current.textContent||"";
        ta.style.cssText="position:fixed;top:-9999px;left:-9999px;opacity:0";
        document.body.appendChild(ta);
        ta.focus();ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(()=>setCopied(false),2000);
      }catch(e2){}
    }
  };
  return <div style={{background:C.bgDark,borderRadius:12,overflow:"hidden",margin:"12px 0",position:"relative"}}>
    <div style={{padding:"8px 14px",borderBottom:"1px solid #333",display:"flex",alignItems:"center",gap:6}}>
      <span style={{width:10,height:10,borderRadius:5,background:"#ff5f57"}}/><span style={{width:10,height:10,borderRadius:5,background:"#febc2e"}}/><span style={{width:10,height:10,borderRadius:5,background:"#28c840"}}/>
      {title&&<span style={{fontSize:12,color:"#999",marginLeft:8,fontFamily:M}}>{title}</span>}
      <button onClick={copy} style={{marginLeft:"auto",padding:"4px 12px",borderRadius:6,border:"1px solid #444",background:copied?"#22c55e":"#333",color:copied?"#fff":"#aaa",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F,transition:".2s",display:"flex",alignItems:"center",gap:4}}>{copied?"✓ 已复制":"📋 复制"}</button>
    </div>
    <pre ref={preRef} style={{margin:0,padding:16,fontFamily:M,fontSize:13,color:"#a5f3fc",lineHeight:1.7,overflowX:"auto",whiteSpace:"pre-wrap",userSelect:"text",WebkitUserSelect:"text"}}>{children}</pre>
  </div>;
}

function Tip({type="tip",children}){
  const cfg={tip:{bg:"#f0faf0",border:"#1d7d34",icon:"💡",color:"#15572a"},warn:{bg:"#fffbeb",border:"#d97706",icon:"⚠️",color:"#92400e"},info:{bg:"#eff6ff",border:"#2563eb",icon:"💬",color:"#1e40af"},key:{bg:"#fef3f2",border:C.accent,icon:"🔑",color:"#7c2d12"}};
  const c=cfg[type]||cfg.tip;
  return <div style={{padding:"14px 18px",borderRadius:12,background:c.bg,borderLeft:`3px solid ${c.border}`,margin:"16px 0",fontSize:15,lineHeight:1.7,color:c.color}}>{c.icon} {children}</div>;
}

function Card({children,onClick,style:s={}}){
  return <div onClick={onClick} style={{padding:24,borderRadius:16,background:C.card,border:`1px solid ${C.borderLight}`,transition:".2s",cursor:onClick?"pointer":"default",...s}} onMouseEnter={e=>{if(onClick){e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.06)"}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.borderLight;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>{children}</div>;
}

function Quiz({q,opts,ans,exp}){
  const [sel,setSel]=useState(null);const done=sel!==null;
  return <div style={{background:C.bg3,borderRadius:16,padding:24,margin:"24px 0"}}>
    <div style={{fontSize:12,fontWeight:700,color:C.accent,letterSpacing:1,marginBottom:8}}>📝 小测验</div>
    <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:14,lineHeight:1.5}}>{q}</div>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>{opts.map((o,i)=>{
      const ok=i===ans,me=i===sel;
      let bg="#fff",bd=C.borderLight,cl=C.text;
      if(done&&ok){bg="#ecfdf5";bd="#10b981";cl="#065f46"}
      else if(done&&me&&!ok){bg="#fef2f2";bd="#ef4444";cl="#991b1b"}
      return <button key={i} onClick={()=>{if(!done)setSel(i)}} style={{padding:"10px 14px",borderRadius:10,background:bg,border:`1.5px solid ${bd}`,color:cl,fontSize:14,textAlign:"left",cursor:done?"default":"pointer",fontFamily:F,lineHeight:1.4,display:"flex",alignItems:"center",gap:8,transition:".15s"}}>
        <span style={{width:22,height:22,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",background:done&&ok?"#10b981":done&&me?"#ef4444":"#e5e7eb",color:"#fff",fontSize:11,fontWeight:700,flexShrink:0}}>{done&&ok?"✓":done&&me?"✗":String.fromCharCode(65+i)}</span>{o}</button>;
    })}</div>
    {done&&<div style={{marginTop:14,padding:14,borderRadius:10,background:sel===ans?"#ecfdf5":"#fffbeb",fontSize:13,color:C.text2,lineHeight:1.7}}>{sel===ans?"🎉 正确！":"💡 解析："}{exp}</div>}
  </div>;
}

function Grid({cols=2,gap=12,children}){return <div style={{display:"grid",gridTemplateColumns:`repeat(auto-fit,minmax(${cols===3?240:300}px,1fr))`,gap}}>{children}</div>}

function SectionTitle({children,sub}){return <div style={{marginBottom:28}}><h2 style={{fontSize:32,fontWeight:800,color:C.text,lineHeight:1.2,letterSpacing:"-.02em",margin:0}}>{children}</h2>{sub&&<p style={{fontSize:17,color:C.text2,marginTop:8,lineHeight:1.6}}>{sub}</p>}</div>}

function Breadcrumb({items,goTo}){
  return <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:C.text3,marginBottom:16,flexWrap:"wrap"}}>{items.map((b,i)=><span key={i}>{i>0&&<span style={{margin:"0 4px"}}>/</span>}{b.link?<a href="#" onClick={e=>{e.preventDefault();goTo(b.link)}} style={{color:C.blue,textDecoration:"none"}}>{b.label}</a>:<span style={{color:C.text2}}>{b.label}</span>}</span>)}</div>;
}

// ═══════════════════════════════════════════
// PAGE CONTENTS
// ═══════════════════════════════════════════

function HomePage({goTo}){
  return <div style={{maxWidth:800,margin:"0 auto",textAlign:"center",padding:"60px 20px"}}>
    <h1 style={{fontSize:"clamp(36px,6vw,56px)",fontWeight:900,lineHeight:1.1,letterSpacing:"-.03em",margin:"0 auto 16px",color:C.text,textAlign:"center"}}>用自然语言，驾驭代码世界</h1>
    <p style={{fontSize:17,color:C.text2,maxWidth:700,margin:"0 auto 40px",lineHeight:1.6,fontWeight:300}}>零基础也能看懂，覆盖官方文档所有核心内容，每个功能都标注「在哪里用」</p>
    <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
      <button onClick={()=>goTo("overview")} style={{padding:"12px 28px",borderRadius:980,background:C.text,color:"#fff",border:"none",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:F}}>开始学习</button>
      <button onClick={()=>goTo("where")} style={{padding:"12px 28px",borderRadius:980,background:"transparent",color:C.blue,border:`1px solid ${C.blue}`,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:F}}>在哪里使用？</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginTop:64,textAlign:"left"}}>
      {[
        {icon:"📖",title:"认识 Claude Code",desc:"了解它能做什么",to:"overview"},
        {icon:"🖥️",title:"在哪里打开",desc:"5种方式逐个详解",to:"where"},
        {icon:"📦",title:"安装配置",desc:"三步安装指南",to:"install"},
        {icon:"⌨️",title:"命令在哪里用",desc:"彻底搞清楚",to:"commands"},
        {icon:"🧠",title:"记忆系统",desc:"CLAUDE.md怎么用",to:"memory"},
        {icon:"💬",title:"怎么跟它说话",desc:"普通人也会的提示词",to:"prompts"},
        {icon:"🔄",title:"工作流程",desc:"5个万能模式",to:"workflows"},
        {icon:"🎯",title:"进阶技巧",desc:"Think/Plan/MCP等",to:"think"},
        {icon:"🛠️",title:"动手练习",desc:"4级难度项目",to:"exercises"},
      ].map((c,i)=><Card key={i} onClick={()=>goTo(c.to)}>
        <div style={{fontSize:24,marginBottom:8}}>{c.icon}</div>
        <div style={{fontSize:15,fontWeight:700,color:C.text}}>{c.title}</div>
        <div style={{fontSize:13,color:C.text2,marginTop:2}}>{c.desc}</div>
      </Card>)}
    </div>
  </div>;
}

function OverviewPage({goTo}){return <div>
  <SectionTitle sub="简单来说：它是住在你电脑里的AI程序员搭档">什么是 Claude Code？</SectionTitle>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:24}}>你用中文告诉它「我想做什么」，它就自动帮你读代码、写代码、运行测试、提交到Git。它不是只能补全一行代码的小插件——它能看懂你整个项目，自己做完整的任务。</p>
  <Tip type="key">它叫「代理」不叫「助手」，因为它不只给建议——<strong>它直接动手干活</strong>。你说「帮我加个登录功能」，它会自己创建文件、写代码、跑测试。</Tip>
  <Grid cols={3}>{[
    {icon:"💬",t:"自然语言编程",d:"用日常说话的方式描述需求，它帮你写代码"},
    {icon:"📁",t:"看懂整个项目",d:"不只看当前文件，能理解几百个文件的项目结构"},
    {icon:"🤖",t:"自己动手干活",d:"直接改文件、跑命令，不用你复制粘贴"},
    {icon:"🔀",t:"帮你管Git",d:"提交代码、创建分支、推送——一句话搞定"},
    {icon:"🧪",t:"自己测试验证",d:"写完代码自动跑测试，有Bug自己修"},
    {icon:"🔌",t:"连接外部工具",d:"数据库、浏览器、GitHub等都能连"},
  ].map((f,i)=><Card key={i}><div style={{fontSize:24,marginBottom:8}}>{f.icon}</div><div style={{fontSize:15,fontWeight:700}}>{f.t}</div><div style={{fontSize:14,color:C.text2,marginTop:4,lineHeight:1.6}}>{f.d}</div></Card>)}</Grid>
  <div style={{marginTop:32,padding:20,background:C.bg3,borderRadius:16,fontSize:14,color:C.text2,lineHeight:1.7}}>
    <strong style={{color:C.text}}>接下来：</strong>了解了它是什么，下一步看看 <Link to="where" goTo={goTo}>在哪里打开和使用</Link>，或者直接去 <Link to="install" goTo={goTo}>安装配置</Link>。
  </div>
</div>}

function WherePage({goTo}){
  const [tab,setTab]=useState(0);
  const envs=[
    {n:"终端 CLI",icon:"⌨️",diff:"需要一点命令行基础",who:"会用终端的开发者",open:<span>打开你电脑的<strong>终端程序</strong>（Mac 叫「终端」在启动台里，Windows 叫「PowerShell」在开始菜单里），然后输入 <code style={{fontFamily:M,background:C.bg3,padding:"2px 6px",borderRadius:4}}>claude</code> 按回车</span>,look:"一个黑色/白色的文字窗口，你打字问它，它打字回答你",best:"功能最完整，所有特性都支持"},
    {n:"VS Code",icon:"💻",diff:"推荐新手",who:"大多数人（强烈推荐）",open:<span>先安装 <strong>VS Code</strong>（一个免费的代码编辑器，去 code.visualstudio.com 下载）→ 打开它 → 点左边的积木图标（扩展市场）→ 搜索「Claude Code」→ 点安装</span>,look:"在VS Code编辑器的侧边栏里，和Claude聊天的窗口",best:"边看代码边聊天，有代码对比视图"},
    {n:"桌面App",icon:"🖥️",diff:"最简单",who:"不想折腾的人",open:<span>去 <strong>claude.ai</strong> 或应用商店下载安装 Claude 桌面应用 → 打开 → 登录 → 点顶部的「Code」标签</span>,look:"就像一个普通的电脑软件，有好看的图形界面",best:"可视化操作、实时预览、最好上手"},
    {n:"网页版",icon:"🌐",diff:"最简单",who:"想随时用的人",open:<span>打开浏览器 → 访问 <strong>claude.ai/code</strong> → 登录即可</span>,look:"在网页里操作，跟平时上网一样",best:"不用装任何东西，任何电脑都能用"},
    {n:"JetBrains",icon:"🔧",diff:"需要IDE基础",who:"用IntelliJ/PyCharm的人",open:<span>打开你的JetBrains IDE → 设置 → 插件 → 搜索「Claude Code」→ 安装</span>,look:"在IDE的侧栏面板中",best:"和你的开发环境深度集成"},
  ];
  return <div>
    <SectionTitle sub="5种打开方式，选最适合你的">在哪里打开和使用 Claude Code？</SectionTitle>
    <Tip type="key"><strong>核心概念：</strong>不管用哪种方式打开，背后的AI能力完全一样。区别只是界面。就像同一个App可以在手机和电脑上用。</Tip>
    <div style={{display:"flex",gap:4,flexWrap:"wrap",margin:"20px 0",borderBottom:`1px solid ${C.border}`,paddingBottom:12}}>
      {envs.map((e,i)=><button key={i} onClick={()=>setTab(i)} style={{padding:"8px 16px",borderRadius:980,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F,background:i===tab?C.text:"transparent",color:i===tab?"#fff":C.text2}}>{e.icon} {e.n}</button>)}
    </div>
    <Card>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><span style={{fontSize:32}}>{envs[tab].icon}</span><div><div style={{fontSize:20,fontWeight:800,color:C.text}}>{envs[tab].n}</div><div style={{fontSize:13,color:C.text3}}>{envs[tab].diff}</div></div></div>
      {[{label:"适合谁",val:envs[tab].who,color:C.accent},{label:"怎么打开",val:envs[tab].open,color:C.green},{label:"打开后长什么样",val:envs[tab].look,color:C.purple},{label:"最大优势",val:envs[tab].best,color:C.blue}].map((r,i)=><div key={i} style={{padding:"12px 0",borderBottom:i<3?`1px solid ${C.borderLight}`:"none"}}>
        <div style={{fontSize:11,fontWeight:700,color:r.color,letterSpacing:.5,marginBottom:4}}>{r.label}</div>
        <div style={{fontSize:14,color:C.text,lineHeight:1.7}}>{r.val}</div>
      </div>)}
    </Card>
    <div style={{marginTop:32}}><h3 style={{fontSize:18,fontWeight:700,marginBottom:12}}>各平台功能支持情况</h3>
    <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13,background:"#fff",borderRadius:12,overflow:"hidden",border:`1px solid ${C.borderLight}`}}>
      <thead><tr style={{background:C.bg3}}>{["功能","终端","VS Code","桌面App","网页版"].map((h,i)=><th key={i} style={{padding:"10px 12px",textAlign:i?"center":"left",fontWeight:600,color:C.text2,fontSize:11,borderBottom:`1px solid ${C.borderLight}`}}>{h}</th>)}</tr></thead>
      <tbody>{[
        ["斜杠命令（如 /help）","✅","✅","✅","✅"],
        ["快捷键 Shift+Tab","✅","✅","✅","❌"],
        ["CLAUDE.md 记忆","✅","✅","✅","✅"],
        ["@ 引用文件","✅","✅","✅","✅"],
        ["检查点回退 Esc×2","✅","✅","✅","❌"],
        ["MCP 扩展","✅","✅","✅","❌"],
        ["粘贴图片","✅","✅","✅","✅"],
      ].map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} style={{padding:"8px 12px",textAlign:j?"center":"left",borderBottom:`1px solid ${C.borderLight}`,color:j?undefined:C.text,fontWeight:j?undefined:500}}>{c}</td>)}</tr>)}</tbody>
    </table></div></div>
    <div style={{marginTop:24,fontSize:14,color:C.text2}}>想知道这些命令具体怎么用？看 <Link to="commands" goTo={goTo}>命令和快捷键详解</Link></div>
  </div>;
}

function InstallPage({goTo}){return <div>
  <SectionTitle sub="三步完成，最快5分钟">安装和配置</SectionTitle>
  <Tip type="warn"><strong>前提：</strong>需要 Claude 付费账号（Pro $20/月起）。去 <strong>claude.ai</strong> 注册并订阅。</Tip>
  <Tip type="tip">如果你不想折腾命令行，可以直接用<strong>桌面App</strong>（下载安装即可）或<strong>网页版</strong>（打开 claude.ai/code）。以下安装步骤是给想用「终端CLI」的人看的。</Tip>
  {[
    {s:1,t:"安装",d:<div><p>打开你电脑的终端程序，复制粘贴下面的命令：</p><CodeBox title="安装命令">{`# Mac 电脑 / Linux 系统
curl -fsSL https://claude.ai/install.sh | bash

# Windows 电脑（打开 PowerShell）
irm https://claude.ai/install.ps1 | iex`}</CodeBox><p style={{fontSize:13,color:C.text2}}>这行命令的意思是：从Claude官网下载安装程序并自动安装。</p></div>},
    {s:2,t:"启动",d:<div><p>安装好后，在终端中进入你的项目文件夹，然后输入 <code style={{fontFamily:M,background:C.bg3,padding:"2px 6px",borderRadius:4}}>claude</code>：</p><CodeBox title="启动">{`cd 你的项目文件夹    # cd 的意思是「进入文件夹」
claude               # 启动 Claude Code！`}</CodeBox></div>},
    {s:3,t:"登录",d:<div><p>首次启动会自动弹出浏览器让你登录 Claude 账号。按提示操作即可。登录成功后就可以开始用中文和它对话了！</p></div>},
  ].map(s=><div key={s.s} style={{display:"flex",gap:16,margin:"20px 0",padding:20,background:"#fff",borderRadius:16,border:`1px solid ${C.borderLight}`}}>
    <div style={{width:32,height:32,borderRadius:16,background:C.text,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:800,flexShrink:0}}>{s.s}</div>
    <div style={{flex:1}}><h3 style={{fontSize:16,fontWeight:700,margin:"0 0 8px"}}>{s.t}</h3><div style={{fontSize:14,color:C.text,lineHeight:1.7}}>{s.d}</div></div>
  </div>)}
  <div style={{marginTop:16,fontSize:14,color:C.text2}}>安装好了？接下来了解 <Link to="howworks" goTo={goTo}>Claude Code 的工作原理</Link>，或直接看 <Link to="prompts" goTo={goTo}>怎么跟它说话</Link>。</div>
</div>}

function HowWorksPage({goTo}){return <div>
  <SectionTitle sub="理解原理才能用得更顺手">工作原理</SectionTitle>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:24}}>当你给Claude Code一个任务，它会进入一个「循环」：接收指令 → 思考 → 用工具执行 → 看结果 → 继续或完成。这个循环在<Link to="where" goTo={goTo}>所有平台</Link>上都一样。</p>
  <Card><div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",justifyContent:"center",padding:"12px 0"}}>
    {["👂 听你说","🤔 想方案","🔧 用工具干活","📊 看结果","🔄 继续/完成"].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8}}>{i>0&&<span style={{color:C.text3}}>→</span>}<div style={{padding:"10px 16px",background:C.bg3,borderRadius:10,fontSize:14,fontWeight:600,textAlign:"center"}}>{s}</div></div>)}
  </div></Card>
  <h3 style={{fontSize:18,fontWeight:700,margin:"32px 0 12px"}}>它有哪些「工具」？</h3>
  <Grid cols={3}>{[
    {t:"📖 读文件",d:"看你项目里任何代码文件"},
    {t:"✏️ 改文件",d:"直接创建或修改你的代码"},
    {t:"⌨️ 跑命令",d:"像你在终端打字一样运行命令"},
    {t:"🌐 搜网络",d:"查文档、找解决方案"},
    {t:"🔌 连外部",d:"通过MCP连数据库等"},
    {t:"🛡️ 自动备份",d:"每次改动前存档，可以撤回"},
  ].map((t,i)=><Card key={i}><div style={{fontWeight:700,fontSize:14}}>{t.t}</div><div style={{fontSize:14,color:C.text2,marginTop:4}}>{t.d}</div></Card>)}</Grid>
  <Tip type="info">想了解安全机制？Claude Code 有 <strong>检查点</strong>（改错了可以撤回，按两次 Esc）和 <strong>权限控制</strong>（危险操作会先问你）。详见 <Link to="commands" goTo={goTo}>命令和快捷键</Link>。</Tip>
</div>}

function CommandsPage({goTo}){return <div>
  <SectionTitle sub="新手最困惑的问题：这些命令到底在哪里输入？">命令和快捷键在哪用</SectionTitle>
  <Card style={{background:"#fef3f2",border:`1px solid ${C.accent}33`,marginBottom:24}}>
    <h3 style={{fontSize:18,fontWeight:800,color:C.accent,marginBottom:12}}>🔑 先搞清楚两个地方</h3>
    <Grid><Card>
      <div style={{fontWeight:700,color:C.blue,marginBottom:6}}>① 你电脑的终端</div>
      <p style={{fontSize:13,color:C.text2,lineHeight:1.6}}>就是 Mac 的「终端」或 Windows 的「PowerShell」。你在这里输入 <code style={{fontFamily:M,fontSize:12}}>claude</code> 来启动 Claude Code。</p>
    </Card><Card>
      <div style={{fontWeight:700,color:C.green,marginBottom:6}}>② Claude Code 的对话框</div>
      <p style={{fontSize:13,color:C.text2,lineHeight:1.6}}>启动 claude 之后进入的界面。<strong>所有斜杠命令、@引用、快捷键都在这里面用</strong>。</p>
    </Card></Grid>
  </Card>
  <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>斜杠命令（在 Claude Code 对话框中输入）</h3>
  <WhereTag items={["终端","VS Code","桌面App","网页版"]}/>
  <div style={{marginTop:12,background:"#fff",borderRadius:12,border:`1px solid ${C.borderLight}`,overflow:"hidden"}}>
    {[{c:"/help",d:"查看所有命令",w:"刚上手时"},{c:"/clear",d:"清空对话",w:"换新任务"},{c:"/compact",d:"压缩对话（节省空间）",w:"聊太久时"},{c:"/init",d:"初始化项目（自动生成CLAUDE.md）",w:"第一次用"},{c:"/cost",d:"看花了多少钱",w:"想省钱"},{c:"/model",d:"切换AI模型",w:"想用更强的模型"},{c:"/permissions",d:"管理安全权限",w:"配置什么能做什么不能做"},{c:"/resume",d:"恢复之前的对话",w:"接着上次聊"}].map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderBottom:i<7?`1px solid ${C.borderLight}`:"none",background:i%2?C.bg3:"#fff"}}>
      <code style={{fontFamily:M,fontSize:13,color:C.accent,fontWeight:600,width:120}}>{c.c}</code>
      <span style={{fontSize:13,color:C.text,flex:1}}>{c.d}</span>
      <span style={{fontSize:11,color:C.text3}}>{c.w}</span>
    </div>)}
  </div>
  <h3 style={{fontSize:18,fontWeight:700,margin:"32px 0 8px"}}>特殊符号（在对话框中使用）</h3>
  <Grid>{[
    {sym:"@文件名",d:"引用项目中的文件",ex:"@src/App.jsx 请检查这个文件"},
    {sym:"#内容",d:"往CLAUDE.md里添加记忆",ex:"#记住：这个项目用pnpm"},
    {sym:"!命令",d:"直接执行终端命令",ex:"!git status"},
  ].map((s,i)=><Card key={i}><code style={{fontFamily:M,fontSize:16,color:C.green,fontWeight:700}}>{s.sym}</code><p style={{fontSize:13,color:C.text2,marginTop:6}}>{s.d}</p><div style={{marginTop:6,padding:"6px 10px",background:C.bg3,borderRadius:6,fontSize:12,color:C.text3,fontFamily:M}}>示例：{s.ex}</div></Card>)}</Grid>
  <h3 style={{fontSize:18,fontWeight:700,margin:"32px 0 8px"}}>快捷键</h3>
  <Tip type="info">快捷键主要在<strong>终端CLI和VS Code</strong>中使用。桌面App部分支持。</Tip>
  <div style={{background:"#fff",borderRadius:12,border:`1px solid ${C.borderLight}`,overflow:"hidden"}}>
    {[{k:"Shift+Tab × 2",d:"进入Plan模式（先规划后动手）",to:"plan"},{k:"Esc × 2",d:"撤回Claude的修改（检查点回退）",to:null},{k:"Ctrl+C",d:"中止当前操作",to:null},{k:"Ctrl+V",d:"粘贴图片让Claude分析",to:null}].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderBottom:i<3?`1px solid ${C.borderLight}`:"none",gap:12}}>
      <code style={{fontFamily:M,fontSize:13,color:"#7c3aed",fontWeight:600,minWidth:130}}>{s.k}</code>
      <span style={{fontSize:13,color:C.text,flex:1}}>{s.d} {s.to&&<Link to={s.to} goTo={goTo}>详情</Link>}</span>
    </div>)}
  </div>
</div>}

function MemoryPage({goTo}){return <div>
  <SectionTitle sub="让Claude记住你的项目信息，每次启动自动读取">记忆系统：CLAUDE.md</SectionTitle>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:20}}>CLAUDE.md 就是一个<strong>普通的文本文件</strong>。你在里面写上项目信息，Claude Code 每次启动时会自动读取，就像给新同事一份项目入门手册。</p>
  <h3 style={{fontSize:18,fontWeight:700,marginBottom:12}}>放在哪里？怎么创建？</h3>
  {[
    {icon:"📁",path:"你的项目文件夹/CLAUDE.md",effect:"只对这一个项目生效",how:<span>最简单的方式：在 Claude Code 对话中输入 <code style={{fontFamily:M,fontSize:12,background:C.bg3,padding:"1px 4px",borderRadius:3}}>/init</code>，它会自动分析你的项目并生成这个文件。也可以自己手动创建。</span>,explain:<span>比如你的项目在 <code style={{fontFamily:M,fontSize:12}}>/Users/小明/my-website/</code> 文件夹里，就把 CLAUDE.md 放在这个文件夹的根目录下。</span>},
    {icon:"📂",path:"项目子文件夹/CLAUDE.md",effect:"只对这个子模块生效",how:"手动创建。比如你的项目有个 src/api/ 文件夹专门放接口代码，可以在这里放一个CLAUDE.md写API相关的规范。",explain:"适合大项目，不同模块可以有不同的规范。"},
    {icon:"🌐",path:<span>用户主目录下的 <strong>.claude</strong> 文件夹里的 CLAUDE.md</span>,effect:"对你所有项目都生效（全局）",how:"手动创建。适合放通用偏好，比如「我喜欢简洁的代码风格」「请用中文回复」。",explain:<div>
      <Tip type="key"><strong>什么是「用户主目录」？</strong><br/>
      • <strong>Mac 电脑：</strong>就是 /Users/你的用户名/ 这个文件夹（比如 /Users/xiaoming/）<br/>
      • <strong>Windows 电脑：</strong>就是 C:\Users\你的用户名\ 这个文件夹<br/><br/>
      所以完整路径就是：<br/>
      Mac: <code style={{fontFamily:M,fontSize:12}}>/Users/xiaoming/.claude/CLAUDE.md</code><br/>
      Windows: <code style={{fontFamily:M,fontSize:12}}>C:\Users\xiaoming\.claude\CLAUDE.md</code><br/><br/>
      注意 .claude 前面有个点（.），这是一个「隐藏文件夹」。Mac 按 Cmd+Shift+. 可以显示隐藏文件，Windows 在文件夹选项中勾选「显示隐藏的文件」。</Tip>
    </div>},
  ].map((m,i)=><Card key={i} style={{marginBottom:12}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:24}}>{m.icon}</span><code style={{fontFamily:M,fontSize:14,color:C.accent,fontWeight:600}}>{m.path}</code></div>
    <p style={{fontSize:14,color:C.text,fontWeight:600,marginBottom:4}}>{m.effect}</p>
    <p style={{fontSize:13,color:C.text2,lineHeight:1.6,marginBottom:4}}>怎么创建：{m.how}</p>
    <div style={{fontSize:13,color:C.text2,lineHeight:1.6}}>{m.explain}</div>
    <WhereTag items={["终端","VS Code","桌面App","网页版"]}/>
  </Card>)}
  <h3 style={{fontSize:18,fontWeight:700,margin:"24px 0 8px"}}>CLAUDE.md 里面写什么？</h3>
  <CodeBox title="CLAUDE.md 模板">{`# 我的网站项目

## 技术栈（告诉Claude你用了什么技术）
- 前端: React, Tailwind CSS
- 后端: Node.js

## 常用命令（告诉Claude怎么运行项目）
npm run dev    # 启动项目
npm test       # 跑测试

## 规矩（告诉Claude你的偏好）
- 用中文写注释
- 变量名用英文
- 不要碰 .env 文件`}</CodeBox>
  <div style={{marginTop:16,fontSize:14,color:C.text2}}>学会了记忆系统，接下来看 <Link to="prompts" goTo={goTo}>怎么更好地跟Claude说话</Link>。</div>
</div>}

function PromptsPage({goTo}){return <div>
  <SectionTitle sub="不需要懂技术术语，用正常说话的方式就行">怎么跟 Claude Code 说话</SectionTitle>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:20}}>你不需要用专业术语。但<strong>说得越具体，效果越好</strong>。下面用真实场景对比，教你怎么说。</p>
  {[
    {scene:"你想做个新网页",bad:"做个网页",good:"帮我做一个个人介绍网页，要有我的名字、照片、自我介绍、联系方式四个部分，用蓝色和白色为主色调，手机上也能正常看",why:"说清楚要什么内容、什么颜色、什么要求"},
    {scene:"代码报错了",bad:"有个错误",good:"我双击打开网页后，页面一片空白。浏览器控制台显示红字错误 'Uncaught TypeError'。请帮我找到原因并修好",why:"描述你看到了什么、错误信息是什么"},
    {scene:"想修改现有的东西",bad:"改一下样式",good:"请把首页标题的字体改大一号，颜色从黑色改成深蓝色。标题下面的段落文字行间距太紧了，请加大一些",why:"具体说改什么、改成什么样"},
    {scene:"想理解代码",bad:"这代码干嘛的",good:"请阅读 @src/App.jsx 这个文件，用大白话解释每个部分在做什么，我是编程新手",why:"指定文件、说明你的水平"},
  ].map((e,i)=><Card key={i} style={{marginBottom:12}}>
    <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:10}}>场景：{e.scene}</div>
    <Grid><div style={{padding:14,borderRadius:10,background:"#fef2f2",border:"1px solid #fecaca"}}><div style={{fontSize:11,fontWeight:700,color:C.red}}>❌ 不好的说法</div><div style={{fontSize:14,color:C.text2,marginTop:4,fontFamily:M}}>"{e.bad}"</div></div>
    <div style={{padding:14,borderRadius:10,background:"#f0fdf4",border:"1px solid #bbf7d0"}}><div style={{fontSize:11,fontWeight:700,color:C.green}}>✅ 好的说法</div><div style={{fontSize:14,color:"#166534",marginTop:4,fontFamily:M}}>"{e.good}"</div></div></Grid>
    <div style={{fontSize:12,color:C.accent,marginTop:8}}>💡 {e.why}</div>
  </Card>)}
  <Tip type="tip"><strong>核心原则：</strong>想象你在跟一个新来的同事说话——他很聪明但不了解你的项目。你需要告诉他：做什么、在哪里做、做成什么样、有什么注意事项。</Tip>
  <div style={{fontSize:14,color:C.text2}}>学会说话后，看看 <Link to="workflows" goTo={goTo}>最常用的工作流程</Link>，或者了解 <Link to="think" goTo={goTo}>Think深度思考</Link>让Claude回答更精准。</div>
</div>}

function WorkflowsPage({goTo}){
  const [open,setOpen]=useState(0);
  const flows=[
    {t:"🗺️ 探索→规划→编码→提交（万能流程）",c:<div><p>Anthropic官方最推荐的四步法：</p>{["① 探索：让Claude先读代码，不要动手\n→ \"请先看一下 @src/auth/ 的代码，理解现在登录是怎么实现的，先不要改\"","② 规划：让Claude想方案（用 think hard）\n→ \"请 think hard，想一个加上微信登录的方案\"","③ 编码：确认后让它动手\n→ \"方案不错，请开始写代码，每写完一步跑一下测试\"","④ 提交：让它保存工作\n→ \"请提交代码并写一个说明\""].map((s,i)=><CodeBox key={i}>{s}</CodeBox>)}<p style={{fontSize:13,color:C.text2}}>详细了解：<Link to="plan" goTo={goTo}>Plan规划模式</Link> | <Link to="think" goTo={goTo}>Think深度思考</Link></p></div>},
    {t:"🧪 先写测试再写代码（TDD）",c:<div><CodeBox>{`"请先为用户注册功能写测试：\n- 正常注册应该成功\n- 邮箱重复应该报错\n- 密码太短应该报错\n先别写实现代码。"\n\n→ 确认测试写好后：\n"现在写代码让所有测试通过"`}</CodeBox></div>},
    {t:"🐛 修Bug",c:<div><CodeBox>{`"我打开网站看到一片空白，浏览器控制台有红字报错：\nTypeError: Cannot read property 'map' of undefined\n请帮我找到原因并修好"`}</CodeBox><p style={{fontSize:13,color:C.text2}}>你也可以截图然后 Ctrl+V 粘贴给Claude看。</p></div>},
    {t:"📝 Git版本管理",c:<div><CodeBox>{`"我改了哪些文件？"\n"帮我把改动保存提交，写个清楚的说明"\n"创建一个新的分支叫 feature/login"`}</CodeBox></div>},
    {t:"📚 学习新项目",c:<div><CodeBox>{`"这个项目是做什么的？帮我解释整体结构"\n"@src/api/user.js 这个文件在做什么？用大白话说"\n"最近谁改过登录相关的代码？"`}</CodeBox></div>},
  ];
  return <div>
    <SectionTitle sub="直接拿来用的常见场景模板">常见工作流程</SectionTitle>
    {flows.map((f,i)=><div key={i} style={{borderBottom:`1px solid ${C.borderLight}`}}>
      <button onClick={()=>setOpen(open===i?-1:i)} style={{width:"100%",padding:"16px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",color:C.text,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:F,textAlign:"left"}}>{f.t}<span style={{color:C.text3,fontSize:18,flexShrink:0}}>{open===i?"−":"+"}</span></button>
      {open===i&&<div style={{paddingBottom:20,fontSize:14,color:C.text,lineHeight:1.7}}>{f.c}</div>}
    </div>)}
  </div>;
}

// ═══════════════════════════════════════════
// ADVANCED SUB-PAGES (with detailed content)
// ═══════════════════════════════════════════
function ThinkPage({goTo}){return <div>
  <Breadcrumb items={[{label:"进阶功能"},{label:"Think 深度思考"}]} goTo={goTo}/>
  <SectionTitle sub="让Claude花更多时间思考，回答更准确">Think 深度思考模式</SectionTitle>
  <WhereTag items={["终端","VS Code","桌面App","网页版"]}/>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,margin:"16px 0"}}>就像你做数学题，简单的口算就行，难的要拿笔算一样。Claude也有不同的「思考深度」。在你的话里加上关键词就能触发。</p>
  <Card style={{marginBottom:16}}>
    <h3 style={{fontWeight:700,marginBottom:12}}>四个级别，越难的问题用越高级别</h3>
    {[{kw:"think",lv:"💭 基础思考",when:"一般问题（函数优化、简单Bug）",ex:"请 think，帮我优化这个函数的性能"},
      {kw:"think hard",lv:"🧠 深度思考",when:"复杂问题（架构设计、性能分析）",ex:"请 think hard，分析这个系统的性能瓶颈在哪里"},
      {kw:"think harder",lv:"🧠🧠 更深度",when:"很复杂的问题（跨模块重构、安全审计）",ex:"请 think harder，设计一个高并发的消息队列系统"},
      {kw:"ultrathink",lv:"🧠🧠🧠 最大算力",when:"最难的问题（整体架构重构、复杂算法）",ex:"请 ultrathink，重构整个项目的认证和权限架构"},
    ].map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<3?`1px solid ${C.borderLight}`:"none",flexWrap:"wrap"}}>
      <code style={{fontFamily:M,fontSize:14,color:C.accent,fontWeight:700,minWidth:110}}>{t.kw}</code>
      <div style={{flex:1,minWidth:180}}><div style={{fontWeight:600,fontSize:13}}>{t.lv}</div><div style={{fontSize:12,color:C.text3}}>适合：{t.when}</div></div>
    </div>)}
  </Card>
  <h3 style={{fontSize:18,fontWeight:700,margin:"24px 0 12px"}}>实际使用示例</h3>
  <CodeBox title="Think模式使用场景">{`# 场景1：分析代码问题
"请 think hard，分析为什么这个API接口有时候会返回空数据。
检查 @src/api/users.js 和 @src/db/queries.js"

# 场景2：规划架构方案
"请 ultrathink，我们的网站现在用户越来越多，
首页加载要5秒。请分析所有可能的优化方案，
包括前端、后端、数据库各个层面。"

# 场景3：代码审查
"请 think hard，审查 @src/auth/ 目录中的所有文件，
重点检查安全漏洞，特别是密码处理和token验证。"

# 场景4：配合Plan模式使用（推荐！）
"请 think hard，制定一个添加微信登录的方案。
先不要写代码，只输出方案。"  ← Plan + Think 联合使用`}</CodeBox>
  <Tip type="tip"><strong>什么时候不需要Think模式？</strong>简单的任务不需要。比如「帮我在页面上加一个按钮」「把这个颜色改成蓝色」，这些Claude直接做就行，不用多想。</Tip>
  <Tip type="info">Think模式配合 <Link to="plan" goTo={goTo}>Plan规划模式</Link> 一起用效果最好。也是 <Link to="practice" goTo={goTo}>官方最佳实践</Link> 中推荐的「探索→规划→编码」工作流的核心。</Tip>
</div>}

function PlanPage({goTo}){return <div>
  <Breadcrumb items={[{label:"进阶功能"},{label:"Plan 规划模式"}]} goTo={goTo}/>
  <SectionTitle sub="让Claude先想好再动手，减少返工">Plan 规划模式</SectionTitle>
  <WhereTag items={["终端","VS Code","桌面App"]}/>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,margin:"16px 0"}}>默认情况下，Claude收到你的指令就直接开始写代码。但复杂任务最好<strong>先让它想好方案，你确认后再动手</strong>。Anthropic团队说他们 90% 的时间都在用Plan模式。</p>
  <Card style={{marginBottom:16}}>
    <h3 style={{fontWeight:700,marginBottom:12}}>怎么进入Plan模式？</h3>
    <div style={{display:"grid",gap:10}}>
      {[{method:"按两次 Shift+Tab",desc:"最快的方式，按快捷键切换"},
        {method:"输入 /plan",desc:"斜杠命令方式"},
        {method:"在话里说「先别动手」",desc:"直接用语言表达，比如「请先制定方案，不要写代码」"},
      ].map((m,i)=><div key={i} style={{padding:12,background:C.bg3,borderRadius:8}}><code style={{fontFamily:M,color:C.accent,fontWeight:600}}>{m.method}</code><span style={{fontSize:13,color:C.text2,marginLeft:8}}>{m.desc}</span></div>)}
    </div>
  </Card>
  <h3 style={{fontSize:16,fontWeight:700,marginBottom:8}}>实际使用示例</h3>
  <CodeBox>{`# 第一步：进入Plan模式后说需求
"我想给网站加一个用户评论功能，需要：
- 用户可以发表评论
- 评论显示用户名和时间
- 可以删除自己的评论
请先制定方案。"

# 第二步：Claude会输出方案（不写代码）
# 你看完后如果满意就说：
"方案不错，请开始实施。"

# 如果不满意就说：
"我觉得不需要删除功能，其他都行。请修改方案。"`}</CodeBox>
  <Tip type="info">Plan模式非常适合和 <Link to="think" goTo={goTo}>Think深度思考</Link> 一起用：先Plan让它规划方案，用 think hard 让它深入思考。</Tip>
</div>}

function SubagentsPage({goTo}){return <div>
  <Breadcrumb items={[{label:"进阶功能"},{label:"子代理 SubAgents"}]} goTo={goTo}/>
  <SectionTitle sub="让多个AI同时干活，速度翻倍">子代理 SubAgents</SectionTitle>
  <WhereTag items={["终端","VS Code","桌面App"]}/>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,margin:"16px 0"}}>想象你是老板，可以同时派3个员工分别去做不同的事。SubAgents就是这个概念——Claude可以「分身」，多个子代理并行处理不同任务。</p>
  <Tip type="key"><strong>为什么用子代理？</strong>子代理在自己独立的「记忆空间」中运行，不会占用你主对话的上下文。这是官方推荐的管理上下文空间的重要方法。详见 <Link to="practice" goTo={goTo}>最佳实践</Link>。</Tip>
  <h3 style={{fontSize:18,fontWeight:700,margin:"20px 0 8px"}}>怎么用？</h3>
  <CodeBox title="基本用法">{`# 最简单：在话后面加 "use subagents"
"请帮我完成用户认证功能，use subagents：
1. 一个负责写代码
2. 一个负责写测试
3. 一个负责更新文档"

# 让Claude自己决定是否用子代理
"请审查这个项目的所有组件的性能问题。
如果任务太多，请用子代理并行处理。"

# 用 /agents 命令管理子代理
/agents   ← 交互式创建、编辑、删除子代理`}</CodeBox>
  <h3 style={{fontSize:18,fontWeight:700,margin:"24px 0 8px"}}>自定义子代理（进阶）</h3>
  <p style={{fontSize:14,color:C.text2,lineHeight:1.7,marginBottom:12}}>你可以预先定义专门的子代理，放在项目的 <code style={{fontFamily:M,background:C.bg3,padding:"1px 4px",borderRadius:3}}>.claude/agents/</code> 文件夹中。每个子代理是一个 .md 文件。</p>
  <CodeBox title=".claude/agents/security-reviewer.md">{`---
name: security-reviewer
description: 审查代码中的安全漏洞
tools: Read, Grep, Glob, Bash
model: opus
---
你是一个高级安全工程师。请审查代码中的：
- 注入漏洞（SQL注入、XSS、命令注入）
- 认证和授权问题
- 代码中硬编码的密钥或密码
- 不安全的数据处理
请给出具体的行号和修复建议。`}</CodeBox>
  <CodeBox title="使用自定义子代理">{`# 在Claude Code对话中：
"请用 security-reviewer 子代理审查 src/api/ 的安全问题"

# 或者让Claude自动选择
"请用合适的子代理审查代码安全"   ← Claude会自动找到你定义的子代理`}</CodeBox>
  <Tip type="tip">子代理适合复杂的大任务。小任务直接和Claude对话就行。配合 <Link to="plan" goTo={goTo}>Plan模式</Link> 效果极佳：先Plan规划方案，再用SubAgents并行执行。</Tip>
</div>}

function MCPPage({goTo}){return <div>
  <Breadcrumb items={[{label:"进阶功能"},{label:"MCP 扩展连接"}]} goTo={goTo}/>
  <SectionTitle sub="让Claude Code连接外部工具和服务">MCP 扩展连接</SectionTitle>
  <WhereTag items={["终端","VS Code","桌面App"]}/>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,margin:"16px 0"}}>MCP全称是「模型上下文协议」，听起来很复杂，其实就是<strong>让Claude Code能用更多工具</strong>。比如让它能操作浏览器、连数据库、读取GitHub信息等。</p>
  <Tip type="info">Claude Code 既是MCP的<strong>客户端</strong>（可以连接别的MCP工具），也是MCP的<strong>服务器</strong>（可以被别的程序调用）。作为新手，你主要用到的是客户端功能——连接外部工具。</Tip>
  <h3 style={{fontSize:18,fontWeight:700,margin:"24px 0 12px"}}>常用的MCP工具</h3>
  <Grid cols={3}>{[
    {t:"🌐 Puppeteer",d:"控制浏览器，帮你自动化测试网页、截图、填表单"},
    {t:"🐙 GitHub",d:"读取Issue、创建PR、查看代码评论、管理仓库"},
    {t:"🐛 Sentry",d:"查看线上错误监控数据，帮你定位生产环境Bug"},
    {t:"💾 数据库",d:"直接查询和操作你的数据库，分析数据"},
    {t:"🎨 Figma",d:"读取设计稿，帮你将设计还原为代码"},
    {t:"📓 Notion",d:"读取和更新Notion文档，管理项目知识库"},
  ].map((m,i)=><Card key={i}><div style={{fontWeight:700,fontSize:14}}>{m.t}</div><div style={{fontSize:14,color:C.text2,marginTop:4,lineHeight:1.6}}>{m.d}</div></Card>)}</Grid>
  <h3 style={{fontSize:18,fontWeight:700,margin:"24px 0 12px"}}>怎么添加和管理？</h3>
  <CodeBox title="MCP管理命令（在终端或Claude Code中输入）">{`# 添加GitHub MCP工具（最常用）
claude mcp add github npx -y @modelcontextprotocol/server-github

# 添加Puppeteer（浏览器自动化）
claude mcp add puppeteer npx -y @modelcontextprotocol/server-puppeteer

# 查看已安装的MCP工具
/mcp

# 删除一个MCP工具
claude mcp remove github

# 调试MCP连接问题（加 --mcp-debug 启动）
claude --mcp-debug`}</CodeBox>
  <h3 style={{fontSize:18,fontWeight:700,margin:"24px 0 12px"}}>三种配置方式</h3>
  <div style={{display:"grid",gap:10}}>
    {[{t:"项目级配置",d:"只在当前项目中可用。用 claude mcp add 命令添加。",f:"项目/.claude/settings.json"},
      {t:"全局配置",d:"所有项目都可用。用 claude mcp add --global 添加。",f:"~/.claude/settings.json"},
      {t:"团队共享配置",d:"提交到代码仓库，团队每个人都能用。",f:"项目/.mcp.json"},
    ].map((c,i)=><Card key={i}><div style={{fontWeight:700,fontSize:14}}>{c.t}</div><div style={{fontSize:14,color:C.text2,marginTop:4}}>{c.d}</div><code style={{display:"block",marginTop:6,fontSize:12,fontFamily:M,color:C.text3,background:C.bg3,padding:"4px 8px",borderRadius:4}}>{c.f}</code></Card>)}
  </div>
  <Tip type="tip"><strong>小贴士：</strong>如果你用GitHub，强烈建议安装 <code style={{fontFamily:M}}>gh</code> 命令行工具（不是MCP，是普通的CLI工具）。Claude可以直接用它创建Issue、开PR、读评论。CLI工具比MCP更省上下文空间。详见 <Link to="practice" goTo={goTo}>最佳实践</Link>。</Tip>
</div>}

function SkillsPage({goTo}){return <div>
  <Breadcrumb items={[{label:"进阶功能"},{label:"Skills 技能包"}]} goTo={goTo}/>
  <SectionTitle sub="可重复使用的工作流模板">Skills 技能包</SectionTitle>
  <WhereTag items={["终端","VS Code","桌面App"]}/>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,margin:"16px 0"}}>Skills就像是Claude的「技能书」。每个Skill是一套预设好的工作流程。比如有人做了一个「代码审查Skill」，安装后你输入 <code style={{fontFamily:M,background:C.bg3,padding:"1px 4px",borderRadius:3}}>/review</code> 就能一键审查代码。</p>
  <h3 style={{fontSize:16,fontWeight:700,margin:"20px 0 8px"}}>怎么用？</h3>
  <CodeBox>{`# 查看可用的Skills
/skills

# Skill文件放在这里：
# 项目级：.claude/skills/你的skill/SKILL.md
# 全局级：~/.claude/skills/你的skill/SKILL.md`}</CodeBox>
  <Tip type="tip">Skill的核心是一个 SKILL.md 文件（类似 <Link to="memory" goTo={goTo}>CLAUDE.md</Link>），里面写着Claude应该怎么执行这个技能。</Tip>
</div>}

function HooksPage({goTo}){return <div>
  <Breadcrumb items={[{label:"进阶功能"},{label:"Hooks 自动化钩子"}]} goTo={goTo}/>
  <SectionTitle sub="特定时机自动执行操作">Hooks 自动化钩子</SectionTitle>
  <WhereTag items={["终端","VS Code","桌面App"]}/>
  <p style={{fontSize:16,color:C.text,lineHeight:1.8,margin:"16px 0"}}>Hooks就像「自动触发器」。你设定好规则，当某件事发生时自动执行脚本。比如：Claude每次编辑完代码，自动帮你格式化。</p>
  <Card style={{marginBottom:16}}>
    <h3 style={{fontWeight:700,marginBottom:8}}>和 <Link to="memory" goTo={goTo}>CLAUDE.md</Link> 的区别</h3>
    <Grid><div style={{padding:12,background:C.bg3,borderRadius:8}}><div style={{fontWeight:700,color:C.blue,fontSize:13}}>CLAUDE.md = 建议</div><div style={{fontSize:12,color:C.text2,marginTop:4}}>Claude会<strong>尽量</strong>遵守，但不是100%保证每次都执行</div></div>
    <div style={{padding:12,background:"#f0fdf4",borderRadius:8,border:"1px solid #bbf7d0"}}><div style={{fontWeight:700,color:C.green,fontSize:13}}>Hooks = 强制执行</div><div style={{fontSize:12,color:C.text2,marginTop:4}}>100%确定会执行，由系统自动触发，不依赖Claude的「理解」</div></div></Grid>
  </Card>
  <h3 style={{fontSize:18,fontWeight:700,margin:"24px 0 8px"}}>可以在什么时机触发？</h3>
  <div style={{display:"grid",gap:8}}>
    {[{event:"PreToolUse",d:"在Claude使用工具之前",ex:"执行危险命令前二次确认、阻止删除操作"},
      {event:"PostToolUse",d:"在Claude使用工具之后",ex:"编辑文件后自动格式化、自动跑lint"},
      {event:"Stop",d:"在Claude完成回答时",ex:"任务完成后发送通知、自动跑测试"},
      {event:"WorktreeCreate",d:"创建新的工作区时",ex:"自动安装依赖"},
    ].map((h,i)=><div key={i} style={{padding:12,background:"#fff",borderRadius:10,border:`1px solid ${C.borderLight}`,display:"flex",gap:12,alignItems:"flex-start"}}>
      <code style={{fontFamily:M,fontSize:12,color:C.accent,fontWeight:600,minWidth:110,padding:"2px 6px",background:C.bg3,borderRadius:4}}>{h.event}</code>
      <div><div style={{fontSize:13,color:C.text}}>{h.d}</div><div style={{fontSize:12,color:C.text3,marginTop:2}}>用途：{h.ex}</div></div>
    </div>)}
  </div>
  <h3 style={{fontSize:18,fontWeight:700,margin:"24px 0 8px"}}>怎么配置？</h3>
  <CodeBox title="配置方法">{`# 方法1：在Claude Code中用命令管理
/hooks   ← 打开交互式Hook管理界面

# 方法2：手动编辑配置文件
# 文件位置：.claude/settings.json
# 在里面添加 hooks 配置：
{
  "hooks": {
    "PostToolUse": [{
      "event": "PostToolUse",
      "pattern": "Edit|Write",
      "command": "prettier --write $FILE"
    }]
  }
}`}</CodeBox>
  <Tip type="tip">刚开始用Claude Code？Hooks 可以稍后再学。先掌握 <Link to="prompts" goTo={goTo}>提示词技巧</Link> 和 <Link to="memory" goTo={goTo}>CLAUDE.md</Link> 就够了。Hooks是给想要更自动化的用户准备的。</Tip>
</div>}

function PlatformsPage({goTo}){return <div>
  <SectionTitle sub="Claude Code不只是个人工具，还能融入团队">平台与团队集成</SectionTitle>
  <Grid cols={3}>{[
    {icon:"🐙",t:"GitHub Actions",d:"在代码仓库中 @claude 自动审查代码、修复PR评论。输入 /install-github-app 安装。"},
    {icon:"💬",t:"Slack集成",d:"团队成员在Slack频道里直接和Claude对话。"},
    {icon:"🔄",t:"CI/CD自动化",d:"用命令行模式（claude -p '任务'）嵌入自动化流程。"},
    {icon:"🌐",t:"Chrome扩展",d:"在浏览器中使用Claude能力，分析网页和UI。"},
    {icon:"🏗️",t:"Agent SDK",d:"把Claude Code的能力封装成自己的产品。"},
    {icon:"📊",t:"远程控制",d:"从其他程序远程操控Claude Code。"},
  ].map((p,i)=><Card key={i}><span style={{fontSize:28}}>{p.icon}</span><h4 style={{fontSize:15,fontWeight:700,marginTop:8,marginBottom:4}}>{p.t}</h4><p style={{fontSize:13,color:C.text2,lineHeight:1.6}}>{p.d}</p></Card>)}</Grid>
  <div style={{marginTop:20,fontSize:14,color:C.text2}}>这些都是进阶功能。先把 <Link to="prompts" goTo={goTo}>基础用法</Link> 和 <Link to="workflows" goTo={goTo}>工作流</Link> 学好，再来探索这些。</div>
</div>}

function PracticePage({goTo}){
  const [openSec,setOpenSec]=useState(0);
  const sections=[
    {t:"🏆 第一原则：让Claude能验证自己的工作",c:<div>
      <p style={{fontSize:15,lineHeight:1.8}}>这是<strong>最重要的一条</strong>。当Claude能看到自己代码的运行结果（报错、测试通过/失败），代码质量提升 2-3 倍。</p>
      <Tip type="key"><strong>没有验证 = 你是唯一的反馈来源。</strong>Claude可能写出「看起来对」但实际不能用的代码，每个错误都需要你来发现。</Tip>
      <h4 style={{fontWeight:700,margin:"16px 0 8px"}}>怎么做？</h4>
      <Grid>{[
        {t:"让Claude跑测试",d:"写完代码后说「请运行测试验证」",ex:"请实现登录功能，然后运行 npm test 验证"},
        {t:"让Claude看结果",d:"让它运行代码并检查输出是否正确",ex:"请运行这个脚本，检查输出是否符合预期"},
        {t:"给预期结果",d:"告诉Claude你期望什么结果",ex:"这个函数应该返回 [1,2,3]，请验证"},
        {t:"用截图验证",d:"让Claude用浏览器看页面效果",ex:"请打开网页检查登录按钮是否正常显示"},
      ].map((m,i)=><Card key={i}><div style={{fontWeight:700,fontSize:14}}>{m.t}</div><div style={{fontSize:14,color:C.text2,marginTop:4}}>{m.d}</div><div style={{marginTop:6,padding:"6px 10px",background:C.bg3,borderRadius:6,fontSize:12,fontFamily:M,color:C.text3}}>{m.ex}</div></Card>)}</Grid>
      <CodeBox title="验证示例">{`# 好的做法：写完代码 + 验证
"请实现用户注册功能，然后：
1. 运行 npm test 检查是否通过
2. 如果有失败的测试，修复后再次运行
3. 直到所有测试通过为止"

# 不好的做法：只让它写代码
"请实现用户注册功能"  ← 没有验证步骤`}</CodeBox>
    </div>},
    {t:"🗺️ 先探索、再规划、最后编码",c:<div>
      <p style={{fontSize:15,lineHeight:1.8}}>让Claude直接写代码可能会解决<strong>错误的问题</strong>。正确做法是分三步走：</p>
      <div style={{display:"grid",gap:10,margin:"16px 0"}}>
        {[{s:"① 探索",d:"让Claude读代码、了解现状。明确告诉它「先不要改代码」",ex:"请先阅读 @src/auth/ 目录，理解现在登录怎么实现的，先不要改代码",color:C.blue},
          {s:"② 规划",d:"用 think hard 让Claude制定方案。可以让它把方案写成文档",ex:"请 think hard，制定一个加上微信登录的方案。列出要改哪些文件，每步做什么",color:C.purple},
          {s:"③ 编码",d:"确认方案没问题后，让Claude开始实现。每步都验证",ex:"方案确认，请开始实施。每完成一步就运行测试验证",color:C.green},
        ].map((s,i)=><div key={i} style={{padding:16,borderRadius:12,background:"#fff",border:`2px solid ${s.color}22`}}>
          <div style={{fontWeight:800,color:s.color,fontSize:15,marginBottom:6}}>{s.s}</div>
          <div style={{fontSize:14,color:C.text,marginBottom:8}}>{s.d}</div>
          <div style={{padding:"8px 12px",background:C.bg3,borderRadius:8,fontSize:12,fontFamily:M,color:C.text2}}>{s.ex}</div>
        </div>)}
      </div>
      <Tip type="info">步骤①②至关重要——没有它们，Claude往往直接跳到写代码。详见 <Link to="plan" goTo={goTo}>Plan 模式</Link> 和 <Link to="think" goTo={goTo}>Think 深度思考</Link>。</Tip>
    </div>},
    {t:"💬 提示要具体、要丰富",c:<div>
      <p style={{fontSize:15,lineHeight:1.8}}>Claude的成功率随着更具体的指令<strong>显著提高</strong>。预先给出清晰方向，减少后续返工。</p>
      <h4 style={{fontWeight:700,margin:"16px 0 8px"}}>怎样才算「具体」？</h4>
      <ul style={{fontSize:14,color:C.text,lineHeight:2.2,paddingLeft:20}}>
        <li><strong>指定文件：</strong>「检查 src/auth/middleware.ts 第45行」而不是「修复这个」</li>
        <li><strong>给约束：</strong>「不引入新的第三方依赖」「保持和现有代码风格一致」</li>
        <li><strong>说明原因：</strong>「需要加缓存，因为这个接口响应时间2秒」比「加个缓存」好</li>
        <li><strong>给例子：</strong>模糊的需求 + 一个示例 = 清晰的需求</li>
        <li><strong>贴截图：</strong>用 Ctrl+V 粘贴截图，比文字描述更直观</li>
        <li><strong>用 @ 引用文件：</strong> <code style={{fontFamily:M,fontSize:12}}>@src/App.jsx</code> 让Claude直接看到代码</li>
      </ul>
      <Tip type="warn">Claude能推断意图，但<strong>读不了你的心思</strong>。一次精准的指令胜过三次模糊的修正。详见 <Link to="prompts" goTo={goTo}>提示词技巧</Link>。</Tip>
    </div>},
    {t:"📦 上下文窗口是最宝贵的资源",c:<div>
      <p style={{fontSize:15,lineHeight:1.8}}>这是理解Claude Code行为的关键：它有一个约 200K token 的「上下文窗口」，存储了对话中的所有内容。<strong>填满后，性能会下降。</strong></p>
      <Card style={{marginBottom:16,background:"#fef3f2",border:`1px solid ${C.accent}33`}}>
        <h4 style={{fontWeight:700,color:C.accent,marginBottom:8}}>什么是上下文窗口？</h4>
        <p style={{fontSize:14,color:C.text,lineHeight:1.7}}>想象Claude有一个「记忆本」，你说的每句话、它读的每个文件、运行的每个命令都会写在上面。这个本子大约能写 200K 个「字」（token）。一次调试就可能用掉几万个。当本子快写满时，Claude可能开始「遗忘」前面的内容，犯更多错误。</p>
      </Card>
      <h4 style={{fontWeight:700,margin:"16px 0 8px"}}>怎么管理？</h4>
      <div style={{display:"grid",gap:8}}>
        {[{cmd:"/compact",d:"压缩对话。Claude会把当前对话总结成摘要，释放空间继续工作",when:"上下文快满时（右下角有警告）"},
          {cmd:"/clear",d:"清空对话。开始一个全新的干净会话",when:"换了完全不同的任务时"},
          {cmd:"/cost",d:"查看当前消耗了多少token和费用",when:"想监控使用量时"},
        ].map((c,i)=><div key={i} style={{padding:12,background:"#fff",borderRadius:10,border:`1px solid ${C.borderLight}`,display:"flex",gap:12,alignItems:"center"}}>
          <code style={{fontFamily:M,fontSize:13,color:C.accent,fontWeight:600,minWidth:80}}>{c.cmd}</code>
          <div><div style={{fontSize:13,color:C.text}}>{c.d}</div><div style={{fontSize:11,color:C.text3,marginTop:2}}>使用时机：{c.when}</div></div>
        </div>)}
      </div>
      <Tip type="key"><strong>关键规则：</strong>如果你已经纠正了Claude两次以上，上下文已经被失败方案「污染」了。运行 <code style={{fontFamily:M}}>/clear</code> 重新开始 + 用更好的提示词，几乎总是比继续在长对话里修修补补更好。<br/><br/>详见 <Link to="commands" goTo={goTo}>命令速查</Link>。</Tip>
    </div>},
    {t:"⚙️ 配置你的环境（长期投资）",c:<div>
      <p style={{fontSize:15,lineHeight:1.8}}>在配置上花的时间，每次使用都在回报你。这些是一次性设置，长期受益。</p>
      <Grid>{[
        {t:"CLAUDE.md",d:"项目记忆文件，告诉Claude你的项目信息、规范、常用命令",to:"memory",icon:"🧠"},
        {t:"权限设置",d:"用 /permissions 预批准常用命令（如 npm test），而不是关掉所有安全检查",to:"commands",icon:"🔒"},
        {t:"CLI 工具",d:"安装 gh（GitHub）、docker 等命令行工具，Claude能直接使用",to:null,icon:"🛠️"},
        {t:"MCP 扩展",d:"连接外部工具如浏览器、数据库、监控系统",to:"mcp",icon:"🔌"},
        {t:"Hooks 自动化",d:"编辑后自动格式化、提交前自动检查",to:"hooks",icon:"🪝"},
        {t:"Skills 技能包",d:"封装重复的工作流为一键操作",to:"skills",icon:"⚡"},
        {t:"子代理",d:"定义专门的助手处理特定任务（安全审查、测试编写等）",to:"subagents",icon:"🤝"},
      ].map((p,i)=><Card key={i} onClick={p.to?()=>goTo(p.to):undefined} style={{cursor:p.to?"pointer":"default"}}>
        <div style={{fontSize:20,marginBottom:6}}>{p.icon}</div>
        <div style={{fontWeight:700,fontSize:14}}>{p.t}</div>
        <div style={{fontSize:14,color:C.text2,marginTop:4}}>{p.d}</div>
        {p.to&&<div style={{fontSize:12,color:C.blue,marginTop:6}}>了解详情 ›</div>}
      </Card>)}</Grid>
    </div>},
    {t:"🔄 有效沟通和管理对话",c:<div>
      <p style={{fontSize:15,lineHeight:1.8,marginBottom:16}}>Claude Code 是对话式的，不是一次性命令。掌握这些沟通技巧。</p>
      <div style={{display:"grid",gap:12}}>
        {[{t:"及时纠正",d:"Claude走偏了？直接输入新指示按回车，它立刻停下来调整。按 Esc 可以中途停止它。最好的结果来自紧密的反馈循环。",icon:"🎯"},
          {t:"尽早纠正",d:"一旦注意到Claude偏离轨道，立即改正。不要等它做完再说。越早纠正，浪费的上下文越少。",icon:"⏱️"},
          {t:"恢复对话",d:"用 /resume 恢复之前的对话。对话是持久的、可逆的。",icon:"💾"},
          {t:"分离规划和实现",d:"复杂任务可以分两个会话：第一个会话用来规划（生成方案文档），第二个干净的会话来实现。新会话有完整的上下文空间。",icon:"📋"},
          {t:"犯错后更新规则",d:"每个错误都是改进 CLAUDE.md 的机会。把「这次学到的教训」写进去，避免下次再犯。在对话中输入 # 可以快速添加记忆。",icon:"📝"},
        ].map((t,i)=><Card key={i}><div style={{display:"flex",gap:10}}><span style={{fontSize:20}}>{t.icon}</span><div><div style={{fontWeight:700,fontSize:14}}>{t.t}</div><div style={{fontSize:13,color:C.text2,marginTop:4,lineHeight:1.6}}>{t.d}</div></div></div></Card>)}
      </div>
    </div>},
    {t:"📋 7条黄金法则速查",c:<div>
      <div style={{display:"grid",gap:8}}>
        {[{n:"1",t:"验证 > 信任",d:"给Claude验证手段，不要盲目信任输出"},
          {n:"2",t:"上下文是最贵的资源",d:"/clear 是你最好的朋友，子代理是上下文防火墙"},
          {n:"3",t:"具体 > 模糊",d:"一次精准的指令胜过三次模糊的修正"},
          {n:"4",t:"先探索再编码",d:"Plan Mode 不是开销，是投资"},
          {n:"5",t:"配置是长期杠杆",d:"在 CLAUDE.md/Hooks/Skills 上花的时间，每次会话都在回报你"},
          {n:"6",t:"预批准 ≠ 跳过权限",d:"/permissions 白名单 > --dangerously-skip-permissions"},
          {n:"7",t:"犯错后更新规则",d:"每个错误都是改进 CLAUDE.md 的机会"},
        ].map((r,i)=><div key={i} style={{display:"flex",gap:12,padding:"12px 16px",background:"#fff",borderRadius:10,border:`1px solid ${C.borderLight}`,alignItems:"center"}}>
          <div style={{width:28,height:28,borderRadius:14,background:C.text,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{r.n}</div>
          <div><div style={{fontWeight:700,fontSize:14}}>{r.t}</div><div style={{fontSize:13,color:C.text2}}>{r.d}</div></div>
        </div>)}
      </div>
      <Tip type="info">这些法则不是一成不变的。有时你应该让上下文积累（深入复杂问题时）；有时应该跳过规划直接动手（探索性任务）。关键是理解原理，灵活运用。</Tip>
    </div>},
  ];
  return <div>
    <SectionTitle sub="来自Anthropic团队和Claude Code创始人Boris Cherny的实战经验">官方最佳实践</SectionTitle>
    <p style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:8}}>几乎所有最佳实践都围绕一个核心约束：<strong>Claude的上下文窗口（记忆空间）会填满，填满后性能下降。</strong>理解这一点，你就理解了为什么要这样做。</p>
    <div style={{marginBottom:24,padding:16,background:C.bg3,borderRadius:12,fontSize:13,color:C.text2}}>本页内容基于 <a href="https://code.claude.com/docs/zh-CN/best-practices" target="_blank" style={{color:C.blue,textDecoration:"none"}}>Claude Code 官方最佳实践文档</a>，用通俗语言重新整理。点击各小节展开详细内容。</div>
    {sections.map((s,i)=><div key={i} style={{borderBottom:`1px solid ${C.borderLight}`}}>
      <button onClick={()=>setOpenSec(openSec===i?-1:i)} style={{width:"100%",padding:"16px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",color:C.text,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:F,textAlign:"left",lineHeight:1.4}}>
        {s.t}<span style={{color:C.text3,fontSize:20,flexShrink:0,marginLeft:12}}>{openSec===i?"−":"+"}</span>
      </button>
      {openSec===i&&<div style={{paddingBottom:24,fontSize:14,color:C.text,lineHeight:1.7}}>{s.c}</div>}
    </div>)}
  </div>;
}

function ExercisesPage({goTo}){return <div>
  <SectionTitle sub="直接复制提示词到Claude Code中试试">动手练习</SectionTitle>
  {[
    {lv:"入门",color:C.green,t:"个人介绍网页",p:`帮我做一个个人介绍网页：\n- 我叫小明，是一名大学生\n- 要有头像位置、自我介绍、爱好列表\n- 用蓝色和白色为主\n- 手机上也能正常看`,note:"练习：基本对话"},
    {lv:"基础",color:C.blue,t:"待办事项App",p:`帮我做一个待办事项应用，请先 think 制定方案：\n- 可以添加新任务\n- 可以标记完成和删除\n- 关掉浏览器再打开数据还在\n- 界面要好看\n确认方案后再写代码。`,note:"练习：Plan模式"},
    {lv:"进阶",color:"#d97706",t:"天气查询App",p:`请 think hard，然后做一个天气查询网页：\n- 输入城市名显示今天的天气\n- 调用免费的天气接口\n- 手机电脑都能用\n- 完成后帮我测试一下能不能正常用`,note:"练习：Think模式 + 自动验证"},
    {lv:"挑战",color:C.red,t:"个人博客",p:`请先阅读项目结构，不要写代码。\n然后 ultrathink，规划一个个人博客：\n- 可以写文章（用Markdown格式）\n- 有分类和搜索功能\n- 深色/浅色模式切换\n规划好等我确认，分步实施，use subagents。`,note:"练习：完整工作流"},
  ].map((e,i)=><Card key={i} style={{marginBottom:12,borderLeft:`4px solid ${e.color}`}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
      <span style={{fontSize:11,fontWeight:800,color:"#fff",background:e.color,padding:"2px 10px",borderRadius:20}}>{e.lv}</span>
      <span style={{fontWeight:700,fontSize:16}}>{e.t}</span>
    </div>
    <CodeBox>{e.p}</CodeBox>
    <div style={{fontSize:12,color:C.text3,marginTop:6}}>🏷️ {e.note}</div>
  </Card>)}
  <Quiz q="做项目时最重要的习惯？" opts={["让AI一口气全做完","先规划→再编码→每步验证","给越模糊的指令越好","跳过所有安全检查"]} ans={1} exp="「探索→规划→编码→验证」是官方推荐流程。每步让Claude验证结果，代码质量高2-3倍。"/>
</div>}

// ═══════════════════════════════════════════
// PAGE COMPONENT MAP
// ═══════════════════════════════════════════
const PAGES={home:HomePage,overview:OverviewPage,where:WherePage,install:InstallPage,howworks:HowWorksPage,commands:CommandsPage,memory:MemoryPage,prompts:PromptsPage,workflows:WorkflowsPage,think:ThinkPage,plan:PlanPage,subagents:SubagentsPage,mcp:MCPPage,skills:SkillsPage,hooks:HooksPage,practice:PracticePage,platforms:PlatformsPage,exercises:ExercisesPage};

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("home");
  const [menuOpen,setMenuOpen]=useState(false);
  const [dropdown,setDropdown]=useState(null);
  const contentRef=useRef(null);
  const [showTop,setShowTop]=useState(false);
  const [history,setHistory]=useState([]);
  const goTo=useCallback((id)=>{setHistory(prev=>[...prev.slice(-10),page]);setPage(id);setMenuOpen(false);setDropdown(null);contentRef.current?.scrollTo(0,0)},[page]);
  const goBack=useCallback(()=>{if(history.length>0){const prev=history[history.length-1];setHistory(h=>h.slice(0,-1));setPage(prev);setMenuOpen(false);setDropdown(null);contentRef.current?.scrollTo(0,0)}},[history]);
  const scrollToTop=useCallback(()=>{contentRef.current?.scrollTo({top:0,behavior:"smooth"})},[]);
  const pi=PAGE_ORDER.indexOf(page);
  const prev=pi>1?PAGE_ORDER[pi-1]:null;
  const next=pi<PAGE_ORDER.length-1?PAGE_ORDER[pi+1]:null;
  const pg=SITEMAP[page];
  const PageComp=PAGES[page];

  return <div style={{fontFamily:F,color:C.text,background:C.bg,height:"100vh",display:"flex",flexDirection:"column",WebkitFontSmoothing:"antialiased",fontSize:16}}>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>

    {/* ══ TOP NAV BAR ══ */}
    <nav style={{background:"rgba(251,251,253,.95)",backdropFilter:"saturate(180%) blur(20px)",WebkitBackdropFilter:"saturate(180%) blur(20px)",borderBottom:`1px solid ${C.borderLight}`,position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:860,margin:"0 auto",padding:"0 32px",height:48,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <a href="#" onClick={e=>{e.preventDefault();goTo("home")}} style={{fontSize:16,fontWeight:800,color:C.text,textDecoration:"none",display:"flex",alignItems:"center",gap:8,letterSpacing:"-.01em"}}>
          <span style={{fontSize:20}}>⚡</span>
          <span>Claude Code <span style={{fontWeight:400,color:C.text2}}>完全指南</span></span>
        </a>
        {/* Desktop nav */}
        <div style={{display:"flex",gap:2,position:"relative",alignItems:"center"}}>
          {TOP_GROUPS.map(g=>{
            const items=Object.entries(SITEMAP).filter(([k,v])=>v.group===g);
            const isActive=items.some(([k])=>k===page);
            const isSingle=items.length===1;
            const isOpen=dropdown===g&&!isSingle;
            return <div key={g} style={{position:"relative"}} onMouseEnter={()=>{if(!isSingle)setDropdown(g)}} onMouseLeave={()=>setDropdown(null)}>
              <button onClick={()=>{if(isSingle)goTo(items[0][0])}} style={{padding:"8px 14px",fontSize:14,fontWeight:isActive?600:400,color:isActive?C.text:C.text2,background:isActive?"rgba(0,0,0,.04)":"none",border:"none",cursor:"pointer",fontFamily:F,borderRadius:8,transition:".15s"}}>{g}</button>
              {isOpen&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:"50%",transform:"translateX(-50%)",background:"#fff",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,.12)",border:`1px solid ${C.borderLight}`,padding:8,minWidth:220,zIndex:200}}>
                {items.map(([k,v])=><a key={k} href="#" onClick={e=>{e.preventDefault();goTo(k)}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,textDecoration:"none",color:k===page?C.accent:C.text,background:k===page?`${C.accent}08`:"transparent",fontSize:14,fontWeight:k===page?600:400,transition:".15s"}}>
                  <span style={{fontSize:18}}>{v.icon}</span><span>{v.title}</span>
                </a>)}
              </div>}
            </div>;
          })}
        </div>
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:"none",background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.text,padding:4}} className="mob-btn">☰</button>
      </div>
    </nav>

    {/* Mobile menu */}
    {menuOpen&&<div style={{position:"fixed",inset:0,zIndex:150,background:"rgba(0,0,0,.3)"}} onClick={()=>setMenuOpen(false)}/>}
    {menuOpen&&<div style={{position:"fixed",top:44,right:0,width:280,bottom:0,background:"#fff",zIndex:200,overflowY:"auto",padding:16,borderLeft:`1px solid ${C.borderLight}`}}>
      {TOP_GROUPS.map(g=><div key={g}>
        <div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.5,padding:"12px 0 4px",textTransform:"uppercase"}}>{g}</div>
        {Object.entries(SITEMAP).filter(([,v])=>v.group===g).map(([k,v])=><a key={k} href="#" onClick={e=>{e.preventDefault();goTo(k)}} style={{display:"block",padding:"8px 0",fontSize:14,color:k===page?C.accent:C.text,textDecoration:"none",fontWeight:k===page?600:400}}>{v.icon} {v.title}</a>)}
      </div>)}
    </div>}

    {/* ══ CONTENT ══ */}
    <div ref={contentRef} style={{flex:1,overflow:"auto"}} onScroll={e=>{setShowTop(e.target.scrollTop>400)}}>
      <div style={{maxWidth:860,margin:"0 auto",padding:page==="home"?"0":"40px 32px 80px"}}>
        {page!=="home"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,paddingBottom:14,borderBottom:`1px solid ${C.borderLight}`}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {history.length>0&&<button onClick={goBack} style={{fontSize:13,color:C.blue,background:"none",border:`1px solid ${C.blue}33`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:3}}>← 返回</button>}
            {prev?<button onClick={()=>goTo(prev)} style={{fontSize:13,color:C.text3,background:"none",border:"none",cursor:"pointer",fontFamily:F}}>‹ {SITEMAP[prev]?.nav||"上一页"}</button>:<div/>}
          </div>
          {next&&<button onClick={()=>goTo(next)} style={{fontSize:13,color:"#fff",background:C.text,border:"none",borderRadius:980,padding:"8px 20px",cursor:"pointer",fontFamily:F,fontWeight:600}}>{SITEMAP[next]?.nav||"下一页"} →</button>}
        </div>}
        <PageComp goTo={goTo}/>
        {page!=="home"&&next&&<div style={{marginTop:48,padding:24,background:C.bg3,borderRadius:16,textAlign:"center"}}>
          <p style={{fontSize:14,color:C.text3,marginBottom:12}}>继续学习 👇</p>
          <button onClick={()=>goTo(next)} style={{padding:"10px 28px",borderRadius:980,background:C.text,color:"#fff",border:"none",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F}}>{SITEMAP[next]?.icon} {SITEMAP[next]?.title} →</button>
        </div>}
      </div>
      {/* Footer */}
      <div style={{marginTop:48,padding:"24px 20px",borderTop:`1px solid ${C.borderLight}`,textAlign:"center",fontSize:12,color:C.text3}}>
        Claude Code 完全指南 · 基于<a href="https://code.claude.com/docs/zh-CN/overview" target="_blank" style={{color:C.blue,textDecoration:"none"}}> 官方文档 </a>通俗改编 · 2026年3月更新
      </div>
    </div>

    <style>{`
      @media(max-width:768px){.mob-btn{display:block!important} nav > div > div:nth-child(2){display:none!important}}
      @media(min-width:1024px){
        .content-area p,.content-area li,.content-area td,.content-area span:not(code){font-size:inherit}
      }
      ::selection{background:${C.accent};color:#fff}
      ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}
    `}</style>

    {/* ══ FLOATING BUTTONS ══ */}
    {page!=="home"&&<div style={{position:"fixed",bottom:24,right:24,display:"flex",flexDirection:"column",gap:8,zIndex:80}}>
      {showTop&&<button onClick={scrollToTop} style={{width:40,height:40,borderRadius:20,background:"#fff",border:`1px solid ${C.border}`,boxShadow:"0 2px 12px rgba(0,0,0,.1)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.text,transition:".2s"}} title="回到顶部">↑</button>}
      <button onClick={()=>goTo("home")} style={{width:40,height:40,borderRadius:20,background:C.text,border:"none",boxShadow:"0 2px 12px rgba(0,0,0,.15)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff",transition:".2s"}} title="回到首页">⚡</button>
    </div>}
  </div>;
}
