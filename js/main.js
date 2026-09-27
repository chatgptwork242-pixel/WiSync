(function () {
  "use strict";
  var W = window.WISYNC, ct = W.contactos;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function wa(msg) { return "https://wa.me/" + ct.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : ""); }

  /* ---------- Menu móvel ---------- */
  var toggle = $(".menu-toggle"), nav = $(".nav");
  if (toggle) {
    toggle.addEventListener("click", function () { toggle.setAttribute("aria-expanded", nav.classList.toggle("open")); });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); } });
  }

  /* ---------- Logótipo animado: injecta o SVG para animar cada parte ---------- */
  var hl = $("#heroLogo");
  if (hl && window.fetch) {
    fetch("assets/wisync-icon.svg").then(function (r) { return r.text(); }).then(function (svg) {
      hl.innerHTML = svg;
      var s = hl.querySelector("svg"); if (s) { s.removeAttribute("fill"); s.setAttribute("aria-hidden", "true"); }
    }).catch(function () {});
  }

  /* ---------- Contactos ---------- */
  var ano = $("#ano"); if (ano) ano.textContent = new Date().getFullYear();
  var waMsg = "Olá WiSync! Gostaria de saber mais sobre os vossos serviços.";
  var ico = {
    tel: '<svg class="ico" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    wa: '<svg class="ico" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.5 8.5 0 1 1 21 11.5z"/></svg>',
    mail: '<svg class="ico" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    pin: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 22s8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>',
    clock: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
  };
  var cl = $("#contactList");
  if (cl) {
    var h = [];
    ct.telefones.forEach(function (t) { h.push('<li><a href="tel:' + t.replace(/\s/g, "") + '">' + ico.tel + t + "</a></li>"); });
    h.push('<li><a href="' + wa(waMsg) + '" target="_blank" rel="noopener">' + ico.wa + "WhatsApp</a></li>");
    h.push('<li><a href="mailto:' + ct.email + '">' + ico.mail + ct.email + "</a></li>");
    h.push("<li><span>" + ico.pin + ct.morada + "</span></li>");
    h.push("<li><span>" + ico.clock + ct.horario + "</span></li>");
    cl.innerHTML = h.join("");
  }
  var fc = $("#footerContactos");
  if (fc) fc.innerHTML = ct.telefones.map(function (t) { return "<li>" + t + "</li>"; }).join("") +
    '<li><a href="mailto:' + ct.email + '">' + ct.email + "</a></li><li>" + ct.morada + "</li>";
  ["waFloat", "mbarWa"].forEach(function (id) { var el = document.getElementById(id); if (el) el.href = wa(waMsg); });
  [["lnkLinkedin", "linkedin"], ["lnkFacebook", "facebook"], ["lnkInstagram", "instagram"]].forEach(function (p) {
    var el = document.getElementById(p[0]); if (el) el.href = ct[p[1]];
  });

  /* ---------- Botões "Pedir proposta" → pré-preenche o formulário ---------- */
  $$("[data-servico]").forEach(function (b) {
    b.addEventListener("click", function () {
      var sel = $("#servico"); if (!sel) return;
      $$("option", sel).forEach(function (o) { if (o.textContent === b.dataset.servico) sel.value = o.textContent; });
    });
  });

  /* ---------- Diagnóstico rápido → diagnóstico preliminar ---------- */
  var PROD = {
    proc: ["WiSync Process", "Mapear processos, escrever procedimentos e definir responsabilidades."],
    plan: ["Diagnóstico empresarial e Business Plan", "Clarificar a estratégia, os números e as prioridades antes de investir."],
    dig: ["WiSync Flow", "Digitalizar pedidos, aprovações e registos com formulários e fluxos."],
    auto: ["WiSync Flow", "Automatizar relatórios e tarefas repetitivas."],
    form: ["Formação da equipa", "Formação prática em Excel e Office com os processos reais da empresa."],
    data: ["WiSync Data", "Juntar a informação numa base única e criar indicadores para a direcção."],
    ai: ["WiSync AI", "Assistentes de IA que analisam, resumem e apoiam decisões."]
  };
  var ORDER = ["plan", "proc", "dig", "form", "auto", "data", "ai"];
  var LADDER = ["WiSync Process", "WiSync Flow", "WiSync Data", "WiSync AI"];
  var box = $("#diagChecks");
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function diag() {
    var sel = $$("input:checked", box), keys = sel.map(function (i) { return i.value; });
    var probs = sel.filter(function (i) { return i.value !== "ai"; }).map(function (i) { return i.dataset.label; });
    var lvl, pct, start, next;
    if (!sel.length) { lvl = "—"; pct = 0; }
    else if (!probs.length) { lvl = "Pronta para IA"; pct = 90; }
    else if (probs.length >= 5) { lvl = "Inicial"; pct = 18; }
    else if (probs.length >= 3) { lvl = "Em organização"; pct = 38; }
    else { lvl = "Em crescimento"; pct = 62; }
    $("#diagLvl").textContent = lvl;
    $("#diagBar").style.width = pct + "%";
    var body = $("#diagBody"), cta = $("#diagCta");
    if (!sel.length) {
      body.innerHTML = "<p>Marque as opções ao lado para ver o diagnóstico.</p>";
      cta.dataset.msg = ""; return;
    }
    for (var i = 0; i < ORDER.length; i++) if (keys.indexOf(ORDER[i]) > -1) { start = PROD[ORDER[i]]; break; }
    var li = LADDER.indexOf(start[0]);
    next = li > -1 && li < LADDER.length - 1 ? LADDER[li + 1] : (start[0] === "WiSync AI" ? "Acompanhamento contínuo" : "WiSync Process");
    var h = "";
    if (probs.length) h += "<p class=\"result__k\">Principais problemas identificados</p><ul class=\"result__list\">" + probs.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>";
    h += "<p class=\"result__k\">Ponto de partida recomendado</p><p class=\"result__start\"><b>" + start[0] + "</b> — " + start[1] + "</p>";
    h += "<p class=\"result__k\">Etapa seguinte</p><p class=\"result__next\">" + next + "</p>";
    body.innerHTML = h;
    cta.dataset.msg = "Diagnóstico preliminar feito no site.\nMaturidade: " + lvl +
      (probs.length ? "\nProblemas: " + probs.join("; ") : "") +
      "\nPonto de partida recomendado: " + start[0] + "\nEtapa seguinte: " + next +
      "\n\nGostaria de agendar o diagnóstico completo.";
  }
  if (box) {
    box.addEventListener("change", diag);
    $("#diagCta").addEventListener("click", function () {
      var s = $("#servico"), m = $("#mensagem");
      if (s) s.value = "Diagnóstico empresarial completo";
      if (m && this.dataset.msg) m.value = this.dataset.msg;
    });
  }

  /* ---------- Formulário → WhatsApp ou email ---------- */
  var form = $("#contactForm"), via = "wa";
  if (form) {
    $$("button[data-via]", form).forEach(function (b) { b.addEventListener("click", function () { via = b.dataset.via; }); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements, ok = true;
      ["nome", "telefone"].forEach(function (n) { var bad = !f[n].value.trim(); f[n].classList.toggle("invalid", bad); if (bad) ok = false; });
      if (!f.consent.checked) ok = false;
      $("#formErro").hidden = ok;
      if (!ok) return;
      var linhas = ["Nome: " + f.nome.value.trim()];
      if (f.empresa.value.trim()) linhas.push("Empresa: " + f.empresa.value.trim());
      linhas.push("Telefone: " + f.telefone.value.trim());
      if (f.email.value.trim()) linhas.push("Email: " + f.email.value.trim());
      linhas.push("Serviço: " + f.servico.value);
      if (f.mensagem.value.trim()) linhas.push("", f.mensagem.value.trim());
      var corpo = "Olá WiSync!\n\n" + linhas.join("\n");
      if (via === "email") location.href = "mailto:" + ct.email + "?subject=" + encodeURIComponent("Pedido: " + f.servico.value) + "&body=" + encodeURIComponent(corpo);
      else window.open(wa(corpo), "_blank", "noopener");
      track(via === "email" ? "contacto-email" : "contacto-whatsapp-form");
    });
  }

  /* ---------- Casos práticos: separadores e conversa animada ---------- */
  function playChat(panel) {
    $$(".msg", panel).forEach(function (m, i) {
      m.classList.remove("show");
      setTimeout(function () { m.classList.add("show"); }, reduce ? 0 : 150 + i * 800);
    });
  }
  var tabs = $$(".tabs [role=tab]");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) {
        var on = x === t, p = document.getElementById(x.getAttribute("aria-controls"));
        x.setAttribute("aria-selected", on); p.hidden = !on;
        if (on) playChat(p);
      });
    });
  });

  /* ---------- Projectos reais (só aparecem se existirem em config.js) ---------- */
  var PJ = W.projectos || [], pl = $("#projList");
  if (pl && PJ.length) {
    pl.innerHTML = PJ.map(function (p) {
      return '<article class="project"><span class="course__tag">' + esc(p.area || "Projecto") + "</span><h3>" + esc(p.titulo) + "</h3>" +
        (p.situacao ? "<p><b>Situação inicial:</b> " + esc(p.situacao) + "</p>" : "") +
        (p.solucao ? "<p><b>Solução:</b> " + esc(p.solucao) + "</p>" : "") +
        (p.resultado ? '<p class="project__res"><b>Resultado:</b> ' + esc(p.resultado) + "</p>" : "") + "</article>";
    }).join("");
    $("#projectos").hidden = false;
  }

  /* ---------- Dados institucionais (só os preenchidos) ---------- */
  var L = W.legal || {}, fi = $("#footerInst");
  if (fi) {
    var it = [];
    if (L.razaoSocial) it.push("<li>" + esc(L.razaoSocial) + "</li>");
    if (L.nuit) it.push("<li>NUIT: " + esc(L.nuit) + "</li>");
    if (L.registoComercial) it.push("<li>" + esc(L.registoComercial) + "</li>");
    if (L.moradaCompleta) it.push("<li>" + esc(L.moradaCompleta) + "</li>");
    else if (ct.morada) it.push("<li>" + esc(ct.morada) + "</li>");
    if (it.length) fi.innerHTML = it.join("");
  }

  /* ---------- Animações ao descer ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        if (en.target.id === "case-cont") playChat(en.target); else en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    $$(".section__head, .pain, .service, .bp__card, .step, .prod, .course, .level, .values div, .faq details, .check, .project").forEach(function (t, i) {
      t.classList.add("reveal"); t.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(t);
    });
    var ch = $("#case-cont"); if (ch) io.observe(ch);
  } else $$(".case .msg").forEach(function (m) { m.classList.add("show"); });

  /* ---------- Medição de visitas (GoatCounter, sem cookies) ---------- */
  function track(name) { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true }); }
  var gc = W.analytics && W.analytics.goatcounter;
  if (gc) {
    var s = document.createElement("script");
    s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + gc + ".goatcounter.com/count");
    document.head.appendChild(s);
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a) return;
      if (a.id === "waFloat" || a.id === "mbarWa") track("whatsapp-botao");
      else if (a.dataset.servico) track("interesse-" + a.dataset.servico.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    });
  }
})();
