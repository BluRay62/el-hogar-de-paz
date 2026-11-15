/* El Hogar de Paz — interacciones del sitio (sin backend) */
(function () {
  "use strict";

  var BRAND = "El Hogar de Paz";

  var header = document.getElementById("encabezado");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("menu-principal");
  var yearEl = document.getElementById("anio");
  var form = document.getElementById("formulario");
  var feedback = document.getElementById("form-feedback");
  var quoteEl = document.getElementById("cita-del-dia");
  var quoteSource = document.getElementById("cita-fuente");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!toggle || !nav || !header) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("is-open");
    header.classList.remove("menu-open");
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
    nav.classList.add("is-open");
    header.classList.add("menu-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) closeMenu();
      else openMenu();
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll("[data-open]").forEach(function (button) {
    var targetId = button.getAttribute("data-open");
    var panel = document.getElementById(targetId);
    if (!panel) return;

    button.addEventListener("click", function () {
      var isHidden = panel.hasAttribute("hidden");
      panel.toggleAttribute("hidden", !isHidden);
      button.setAttribute("aria-expanded", isHidden ? "true" : "false");
      button.textContent = isHidden ? "Ocultar ejercicio" : "Ver ejercicio guiado";
    });
  });

  var programLabels = {
    gratitud: "7 días · Camino de la gratitud",
    oracion: "21 días · Oración y reflexión",
    paz: "30 días · Paz interior"
  };

  document.querySelectorAll("[data-interest]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-interest");
      var select = document.getElementById("programa");
      var contacto = document.getElementById("contacto");
      if (select && value) select.value = value;
      if (contacto) contacto.scrollIntoView({ behavior: "smooth" });
      var nameField = document.getElementById("nombre");
      if (nameField) nameField.focus({ preventScroll: true });
    });
  });

  var reflexiones = [
    "La paz no siempre llega como un silencio perfecto. A veces llega como un paso más corto, una palabra más amable, una respiración que decide no huir.",
    "No hace falta tener el corazón en orden para orar. Basta con presentarlo tal como está, y dejarlo un rato en buenas manos.",
    "La gratitud no niega lo difícil: simplemente se niega a que lo difícil sea lo único que veamos.",
    "Hay una sabiduría callada en volver al cuerpo, en sentir el aire que entra y sale, y en no pedirle al día más de lo que puede dar.",
    "Leer despacio es una forma de respeto: hacia el texto, hacia quien lo escribió y hacia la parte de ti que todavía sabe escuchar.",
    "Un hogar interior se construye con gestos pequeños: una pausa, una oración, una mano que se abre en vez de apretarse.",
    "Si hoy solo puedes dar cinco minutos de presencia, que sean cinco minutos enteros. Eso también es camino."
  ];

  if (quoteEl) {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var day = Math.floor((now - start) / 86400000);
    var text = reflexiones[day % reflexiones.length];
    quoteEl.innerHTML = "<p>" + text + "</p>";
    if (quoteSource) {
      quoteSource.textContent = "Una reflexión para hoy · " + BRAND;
    }
  }

  if (form && feedback) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      feedback.hidden = false;
      feedback.classList.remove("is-error");

      var nombre = (form.nombre.value || "").trim();
      var correo = (form.correo.value || "").trim();
      var mensaje = (form.mensaje.value || "").trim();
      var programa = form.programa.value;
      var novedades = form.novedades.checked;

      if (!nombre || !correo || !mensaje) {
        feedback.classList.add("is-error");
        feedback.textContent = "Por favor, completa tu nombre, correo y mensaje para preparar el resumen.";
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        feedback.classList.add("is-error");
        feedback.textContent = "Revisa el correo electrónico; parece incompleto.";
        return;
      }

      var interes = programa ? programLabels[programa] || programa : "Sin preferencia por ahora";
      var resumen =
        "Nombre: " + nombre + "\n" +
        "Correo: " + correo + "\n" +
        "Programa: " + interes + "\n" +
        "Novedades: " + (novedades ? "Sí" : "No") + "\n\n" +
        mensaje;

      feedback.innerHTML =
        "<p><strong>Mensaje preparado.</strong> Este formulario no envía datos a un servidor. Aquí tienes un resumen que puedes copiar y compartir por el medio que prefieras.</p>" +
        "<pre></pre>";
      feedback.querySelector("pre").textContent = resumen;
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Compra: un solo origen, el atributo data-buy-url en el botón .book-buy.
     Si está vacío, se muestra «Próximamente disponible» y no se usa un enlace vacío. */
  document.querySelectorAll(".book-buy").forEach(function (el) {
    var url = (el.getAttribute("data-buy-url") || "").trim();
    if (!url) {
      el.removeAttribute("href");
      el.setAttribute("role", "button");
      el.setAttribute("aria-disabled", "true");
      el.classList.add("is-soon");
      el.textContent = "Próximamente disponible";
      el.addEventListener("click", function (event) {
        event.preventDefault();
      });
    } else {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.removeAttribute("aria-disabled");
      el.classList.remove("is-soon");
    }
  });

})();
