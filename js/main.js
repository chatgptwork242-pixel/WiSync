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

  /* ---------- Diagnóstico rápido ---------- */
  var RECS = {
    none: ["—", 0, "Marque as opções ao lado", "Vamos sugerir o ponto de partida mais adequado para a sua empresa.", "Diagnóstico da empresa"],
    proc: ["Nível 1", 20, "Comece pela consultoria de processos", "O primeiro passo é mapear como a empresa trabalha e escrever procedimentos claros. Sem isso, qualquer sistema vai herdar a desorganização.", "Consultoria empresarial"],
    dig: ["Nível 1", 30, "Digitalize pedidos e aprovações", "Formulários e fluxos digitais acabam com o WhatsApp e o papel, e criam histórico. É uma melhoria rápida e de baixo custo.", "Criação de sistemas"],
    form: ["Nível 1", 25, "Invista na formação da equipa", "Uma formação prática em Excel e Office costuma libertar horas por semana a cada colaborador, com as ferramentas que já têm.", "Formação: Excel"],
    auto: ["Nível 2", 45, "Automatize relatórios e tarefas repetitivas", "Os seus processos já existem, mas consomem tempo. Relatórios automáticos e integração de ficheiros dão ganhos imediatos.", "Criação de sistemas"],
    data: ["Nível 3", 60, "Organize os dados e crie indicadores", "Juntar a informação numa base única e criar dashboards dá à direcção controlo em tempo real sobre o negócio.", "Criação de sistemas"],
    ai: ["Nível 4", 85, "Está pronto para a Inteligência Artificial", "Com processos e dados organizados, assistentes de IA podem analisar, resumir e apoiar decisões no dia-a-dia.", "Inteligência Artificial para a empresa"]
  };
  var box = $("#diagChecks");
  function diag() {
    var v = $$("input:checked", box).map(function (i) { return i.value; });
    var order = ["proc", "dig", "form", "auto", "data", "ai"], key = "none";
    if (v.length) {
      if (v.indexOf("ai") > -1 && v.length === 1) key = "ai";
      else for (var i = 0; i < order.length; i++) { if (v.indexOf(order[i]) > -1 && order[i] !== "ai") { key = order[i]; break; } }
    }
    var r = RECS[key];
    $("#diagLvl").textContent = r[0];
    $("#diagBar").style.width = r[1] + "%";
    $("#diagTitle").textContent = r[2];
    $("#diagText").textContent = r[3] + (v.length > 1 ? " Depois, avançamos para os restantes pontos que marcou." : "");
    var cta = $("#diagCta");
    cta.dataset.servico = r[4];
    cta.dataset.msg = v.length ? "Fiz o diagnóstico no site. Recomendação: " + r[2] + ". Pontos marcados: " +
      $$("input:checked", box).map(function (i) { return i.parentNode.textContent.trim(); }).join(" | ") : "";
  }
  if (box) {
    box.addEventListener("change", diag);
    $("#diagCta").addEventListener("click", function () {
      var sel = $("#servico"), m = $("#mensagem"), d = this.dataset;
      if (sel && d.servico) sel.value = d.servico;
      if (m && d.msg) m.value = d.msg;
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

  /* ---------- Conversa do caso prático (aparece ao chegar) ---------- */
  var msgs = $$("#chat .msg");
  function playChat() { msgs.forEach(function (m, i) { setTimeout(function () { m.classList.add("show"); }, reduce ? 0 : i * 900); }); }

  /* ---------- Animações ao descer ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        if (en.target.id === "chat") playChat(); else en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    $$(".section__head, .pain, .service, .step, .prod, .course, .level, .values div, .faq details, .check").forEach(function (t, i) {
      t.classList.add("reveal"); t.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(t);
    });
    var ch = $("#chat"); if (ch) io.observe(ch);
  } else playChat();

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
