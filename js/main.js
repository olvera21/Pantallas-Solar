/* =========================================================
   SOLAR — interacciones de interfaz (mockup estático)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sesión (mockup con localStorage) ---------- */
  function leerUsuario() {
    try { return JSON.parse(localStorage.getItem('solarUser')) || null; }
    catch (e) { return null; }
  }
  function guardarUsuario(usuario) {
    try { localStorage.setItem('solarUser', JSON.stringify(usuario)); localStorage.setItem('solarAuth', '1'); }
    catch (e) { /* almacenamiento no disponible */ }
  }
  function estaAutenticado() {
    try { return localStorage.getItem('solarAuth') === '1'; } catch (e) { return false; }
  }
  function cerrarSesion() {
    try { localStorage.removeItem('solarAuth'); } catch (e) { /* ignorado */ }
  }

  /* Páginas de publicación: exigen sesión iniciada */
  if (document.body.hasAttribute('data-requires-auth') && !estaAutenticado()) {
    window.location.href = 'login.html';
    return;
  }

  /* ---------- Menú móvil ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.style.display === 'flex';
      mainNav.style.display = open ? 'none' : 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '70px';
      mainNav.style.left = '20px';
      mainNav.style.right = '20px';
      mainNav.style.borderRadius = 'var(--radius)';
      mainNav.style.padding = '10px';
    });
  }

  /* ---------- Tabs (iniciar sesión / registro) ---------- */
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = Array.from(group.querySelectorAll('.tab-btn'));
    const panels = Array.from(group.querySelectorAll('.tab-panel'));
    function activarTab(nombre) {
      buttons.forEach((b) => b.classList.toggle('active', b.dataset.tab === nombre));
      panels.forEach((p) => {
        const activo = p.dataset.panel === nombre;
        p.classList.toggle('active', activo);
        p.style.display = activo ? 'block' : 'none';
      });
    }
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => activarTab(btn.dataset.tab));
    });
    const nombreDesdeHash = window.location.hash.replace('#', '');
    const inicial = buttons.find((b) => b.dataset.tab === nombreDesdeHash)
      || buttons.find((b) => b.classList.contains('active'))
      || buttons[0];
    if (inicial) activarTab(inicial.dataset.tab);
  });

  /* ---------- Filtros de catálogo (mostrar/ocultar en móvil) ---------- */
  const filterToggle = document.querySelector('[data-filter-toggle]');
  const filters = document.querySelector('.filters');
  if (filterToggle && filters) {
    filterToggle.addEventListener('click', () => {
      filters.classList.toggle('open');
    });
  }

  /* ---------- Galería de fotos en detalle ---------- */
  const mainPhotoImg = document.getElementById('gallery-main-img');
  const galleryThumbs = document.querySelectorAll('.gallery-thumbs [data-thumb]');
  galleryThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (!mainPhotoImg) return;
      const newSrc = thumb.dataset.src;
      const oldSrc = mainPhotoImg.src;
      mainPhotoImg.src = newSrc;
      thumb.dataset.src = oldSrc;
      const thumbImg = thumb.querySelector('img');
      if (thumbImg) thumbImg.src = oldSrc;
      galleryThumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  /* ---------- Pantalla de estimación IA ---------- */
  const loadingBlock = document.querySelector('.estimation-loading');
  const resultBlock = document.querySelector('.estimation-result');
  if (loadingBlock && resultBlock) {
    setTimeout(() => {
      loadingBlock.classList.add('hidden');
      resultBlock.classList.add('active');
    }, 1400);
  }

  const choiceCards = document.querySelectorAll('.choice-card');
  choiceCards.forEach((card) => {
    const radio = card.querySelector('input[type="radio"]');
    card.addEventListener('click', () => {
      choiceCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      if (radio) radio.checked = true;
    });
  });

  /* ---------- Rol comprador / vendedor (registro) ---------- */
  const rolInputs = document.querySelectorAll('input[name="rol"]');
  const rolHint = document.getElementById('rol-hint');
  function actualizarRolHint() {
    const seleccionado = document.querySelector('input[name="rol"]:checked');
    if (!rolHint || !seleccionado) return;
    rolHint.textContent = seleccionado.value === 'vendedor'
      ? 'Podrás registrar inmuebles y solicitar la estimación con IA.'
      : 'Verás el catálogo y podrás contactar vendedores.';
  }
  rolInputs.forEach((input) => input.addEventListener('change', actualizarRolHint));
  actualizarRolHint();

  /* ---------- Formulario de inicio de sesión ---------- */
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    const btn = document.getElementById('btn-login');
    const error = document.getElementById('login-error');
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!formLogin.checkValidity()) {
        error.classList.add('visible');
        formLogin.reportValidity();
        return;
      }
      error.classList.remove('visible');
      const existente = leerUsuario();
      guardarUsuario(existente || { nombre: 'Cuenta Solar', email: document.getElementById('login-email').value, rol: 'comprador' });
      btn.disabled = true;
      btn.textContent = 'Entrando…';
      setTimeout(() => { window.location.href = 'catalogo.html'; }, 500);
    });
  }

  /* ---------- Formulario de registro ---------- */
  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) {
    const btn = document.getElementById('btn-registro');
    const error = document.getElementById('registro-error');
    const pass = document.getElementById('reg-pass');
    const passConfirm = document.getElementById('reg-pass-confirm');
    function validarCoincidenciaPass() {
      if (!pass || !passConfirm) return;
      passConfirm.setCustomValidity(pass.value !== passConfirm.value ? 'Las contraseñas no coinciden' : '');
    }
    if (pass && passConfirm) {
      pass.addEventListener('input', validarCoincidenciaPass);
      passConfirm.addEventListener('input', validarCoincidenciaPass);
    }
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      validarCoincidenciaPass();
      if (!formRegistro.checkValidity()) {
        error.classList.add('visible');
        formRegistro.reportValidity();
        return;
      }
      error.classList.remove('visible');
      const seleccionado = document.querySelector('input[name="rol"]:checked');
      const rol = (seleccionado && seleccionado.value === 'vendedor') ? 'vendedor' : 'comprador';
      const nombreCompleto = [document.getElementById('reg-nombre').value, document.getElementById('reg-apellidos').value]
        .filter(Boolean).join(' ') || 'Cuenta Solar';
      guardarUsuario({
        nombre: nombreCompleto,
        email: document.getElementById('reg-email').value,
        telefono: document.getElementById('reg-tel').value,
        municipio: document.getElementById('reg-municipio').value,
        alertas: document.getElementById('reg-alertas').checked,
        rol: rol,
      });
      const destino = rol === 'vendedor' ? 'vendedor.html' : 'comprador.html';
      btn.disabled = true;
      btn.textContent = 'Creando cuenta…';
      setTimeout(() => { window.location.href = destino; }, 500);
    });
  }

  /* ---------- Filtrado funcional del catálogo ---------- */
  const propertyGrid = document.querySelector('.property-grid');
  if (propertyGrid) {
    const cards = Array.from(propertyGrid.querySelectorAll('.property-card'));
    const tipoChecks = document.querySelectorAll('[data-filter="tipo"]');
    const construccionChecks = document.querySelectorAll('[data-filter="construccion"]');
    const searchInput = document.querySelector('.search-input input');
    const resultsCount = document.getElementById('results-count');
    const applyBtn = document.getElementById('btn-aplicar-filtros');
    const clearBtn = document.getElementById('btn-limpiar-filtros');

    function aplicarFiltros() {
      const tiposActivos = Array.from(tipoChecks).filter((c) => c.checked).map((c) => c.value);
      const construccionActiva = Array.from(construccionChecks).filter((c) => c.checked).map((c) => c.value);
      const texto = searchInput ? searchInput.value.trim().toLowerCase() : '';
      let visibles = 0;
      cards.forEach((card) => {
        const tipo = card.dataset.tipo || '';
        const construccion = card.dataset.construccion || '';
        const textoCard = card.textContent.toLowerCase();
        const pasaTipo = tiposActivos.length === 0 || tiposActivos.includes(tipo);
        const pasaConstruccion = construccionActiva.length === 0 || construccionActiva.includes(construccion);
        const pasaTexto = texto === '' || textoCard.includes(texto);
        const visible = pasaTipo && pasaConstruccion && pasaTexto;
        card.style.display = visible ? '' : 'none';
        if (visible) visibles++;
      });
      if (resultsCount) resultsCount.textContent = visibles;
    }

    tipoChecks.forEach((c) => c.addEventListener('change', aplicarFiltros));
    construccionChecks.forEach((c) => c.addEventListener('change', aplicarFiltros));
    if (searchInput) searchInput.addEventListener('input', aplicarFiltros);
    if (applyBtn) applyBtn.addEventListener('click', aplicarFiltros);
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        tipoChecks.forEach((c) => { c.checked = false; });
        construccionChecks.forEach((c) => { c.checked = false; });
        if (searchInput) searchInput.value = '';
        aplicarFiltros();
      });
    }
    aplicarFiltros();
  }

  /* ---------- Flujo de publicación: datos guardados entre páginas ---------- */
  function leerDatosFormulario() {
    try { return JSON.parse(localStorage.getItem('solarForm')) || {}; }
    catch (e) { return {}; }
  }
  function guardarDatosFormulario(datos) {
    try { localStorage.setItem('solarForm', JSON.stringify(datos)); }
    catch (e) { /* almacenamiento no disponible, se ignora en este ejemplo */ }
  }
  function valorCampo(id) {
    const el = document.getElementById(id);
    return el ? el.value : undefined;
  }
  function fijarValorCampo(id, valor) {
    const el = document.getElementById(id);
    if (el && valor !== undefined) el.value = valor;
  }

  /* Botón "Comenzar registro": inicia un formulario limpio */
  const btnComenzar = document.getElementById('btn-comenzar-publicacion');
  if (btnComenzar) {
    btnComenzar.addEventListener('click', () => guardarDatosFormulario({}));
  }

  /* Paso 1: Ubicación y tipo */
  const pTipo = document.getElementById('p-tipo');
  if (pTipo) {
    const datos = leerDatosFormulario();
    fijarValorCampo('p-tipo', datos.tipo);
    fijarValorCampo('p-direccion', datos.direccion);
    fijarValorCampo('p-municipio', datos.municipio);
    fijarValorCampo('p-zona', datos.zona);
    fijarValorCampo('p-acceso', datos.acceso);

    const continuar = document.getElementById('link-continuar');
    if (continuar) {
      continuar.addEventListener('click', () => {
        guardarDatosFormulario(Object.assign(leerDatosFormulario(), {
          tipo: valorCampo('p-tipo'),
          direccion: valorCampo('p-direccion'),
          municipio: valorCampo('p-municipio'),
          zona: valorCampo('p-zona'),
          acceso: valorCampo('p-acceso'),
        }));
      });
    }
  }

  /* Paso 2: Dimensiones — si es "solo terreno" se ocultan campos de construcción */
  const camposConstruccion = document.querySelectorAll('input[name="construccion"]');
  const campoConstruido = document.getElementById('campo-construido');
  const campoAntiguedad = document.getElementById('campo-antiguedad');
  if (camposConstruccion.length && campoConstruido && campoAntiguedad) {
    const datos = leerDatosFormulario();
    fijarValorCampo('p-terreno', datos.terreno);
    fijarValorCampo('p-construido', datos.construido);
    fijarValorCampo('p-frente', datos.frente);
    fijarValorCampo('p-fondo', datos.fondo);
    fijarValorCampo('p-antiguedad', datos.antiguedad);
    fijarValorCampo('p-topografia', datos.topografia);
    fijarValorCampo('p-colinda-norte', datos.colindaNorte);
    fijarValorCampo('p-colinda-sur', datos.colindaSur);
    fijarValorCampo('p-colinda-este', datos.colindaEste);
    fijarValorCampo('p-colinda-oeste', datos.colindaOeste);

    function tieneConstruccion() {
      const seleccionado = document.querySelector('input[name="construccion"]:checked');
      return seleccionado ? seleccionado.value : 'si';
    }
    function actualizarVisibilidadConstruccion() {
      const visible = tieneConstruccion() === 'si';
      campoConstruido.style.display = visible ? '' : 'none';
      campoAntiguedad.style.display = visible ? '' : 'none';
    }

    /* Pre-selecciona "Solo terreno" si el tipo capturado en el paso 1 fue Terreno */
    if (datos.construccion) {
      camposConstruccion.forEach((r) => { r.checked = (r.value === datos.construccion); });
    } else if (datos.tipo === 'Terreno') {
      camposConstruccion.forEach((r) => { if (r.value === 'no') r.checked = true; });
    }
    actualizarVisibilidadConstruccion();
    camposConstruccion.forEach((r) => r.addEventListener('change', actualizarVisibilidadConstruccion));

    ['link-anterior', 'link-continuar'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          guardarDatosFormulario(Object.assign(leerDatosFormulario(), {
            terreno: valorCampo('p-terreno'),
            construido: tieneConstruccion() === 'si' ? valorCampo('p-construido') : '',
            frente: valorCampo('p-frente'),
            fondo: valorCampo('p-fondo'),
            construccion: tieneConstruccion(),
            antiguedad: tieneConstruccion() === 'si' ? valorCampo('p-antiguedad') : '',
            topografia: valorCampo('p-topografia'),
            colindaNorte: valorCampo('p-colinda-norte'),
            colindaSur: valorCampo('p-colinda-sur'),
            colindaEste: valorCampo('p-colinda-este'),
            colindaOeste: valorCampo('p-colinda-oeste'),
          }));
        });
      }
    });
  }

  /* Paso 3: Situación legal y precio */
  const propiedadTipo = document.getElementById('p-propiedad-tipo');
  if (propiedadTipo) {
    const datos = leerDatosFormulario();
    fijarValorCampo('p-propiedad-tipo', datos.propiedadTipo);
    fijarValorCampo('p-escritura-numero', datos.escrituraNumero);
    fijarValorCampo('p-uso-suelo', datos.usoSuelo);
    fijarValorCampo('p-precio', datos.precio);

    function marcarRadio(nombre, valor) {
      if (!valor) return;
      document.querySelectorAll(`input[name="${nombre}"]`).forEach((r) => { r.checked = (r.value === valor); });
    }
    function valorRadio(nombre) {
      const seleccionado = document.querySelector(`input[name="${nombre}"]:checked`);
      return seleccionado ? seleccionado.value : '';
    }
    marcarRadio('escritura', datos.escritura);
    marcarRadio('predial', datos.predial);
    marcarRadio('gravamen', datos.gravamen);

    const hintPropiedadTipo = document.getElementById('hint-propiedad-tipo');
    const labelEscritura = document.getElementById('label-escritura');
    function actualizarHintPropiedad() {
      const esEjidal = propiedadTipo.value === 'ejidal';
      if (hintPropiedadTipo) {
        hintPropiedadTipo.textContent = esEjidal
          ? 'Al ser ejidal, el trámite se hace con certificado parcelario y el Registro Agrario Nacional (RAN), no con escritura pública.'
          : 'Si aún está en trámite de escrituración, indícalo abajo; muchos compradores igual consideran estos predios.';
      }
      if (labelEscritura) {
        labelEscritura.textContent = esEjidal
          ? '¿Cuentas con certificado parcelario o constancia del comisariado ejidal?'
          : '¿Cuentas con escritura pública o título de propiedad?';
      }
    }
    propiedadTipo.addEventListener('change', actualizarHintPropiedad);
    actualizarHintPropiedad();

    const sinPrecio = document.getElementById('p-sin-precio');
    const campoPrecio = document.getElementById('campo-precio');
    const inputPrecio = document.getElementById('p-precio');
    function actualizarCampoPrecio() {
      const oculto = sinPrecio && sinPrecio.checked;
      if (inputPrecio) inputPrecio.disabled = oculto;
      if (campoPrecio) campoPrecio.style.opacity = oculto ? '0.45' : '1';
    }
    if (sinPrecio) {
      sinPrecio.checked = !!datos.sinPrecio;
      sinPrecio.addEventListener('change', actualizarCampoPrecio);
    }
    const negociable = document.getElementById('p-negociable');
    if (negociable) negociable.checked = !!datos.negociable;
    actualizarCampoPrecio();

    if (Array.isArray(datos.formasPago)) {
      [['pago1', 'Contado'], ['pago2', 'Crédito bancario'], ['pago3', 'Crédito Infonavit / Fovissste']].forEach(([id, etiqueta]) => {
        const el = document.getElementById(id);
        if (el) el.checked = datos.formasPago.includes(etiqueta);
      });
    }

    ['link-anterior', 'link-continuar'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          const formasPago = [['pago1', 'Contado'], ['pago2', 'Crédito bancario'], ['pago3', 'Crédito Infonavit / Fovissste']]
            .filter(([id2]) => { const c = document.getElementById(id2); return c && c.checked; })
            .map(([, etiqueta]) => etiqueta);
          guardarDatosFormulario(Object.assign(leerDatosFormulario(), {
            propiedadTipo: valorCampo('p-propiedad-tipo'),
            escritura: valorRadio('escritura'),
            escrituraNumero: valorCampo('p-escritura-numero'),
            predial: valorRadio('predial'),
            gravamen: valorRadio('gravamen'),
            usoSuelo: valorCampo('p-uso-suelo'),
            sinPrecio: !!(sinPrecio && sinPrecio.checked),
            precio: (sinPrecio && sinPrecio.checked) ? '' : valorCampo('p-precio'),
            negociable: !!(negociable && negociable.checked),
            formasPago: formasPago,
          }));
        });
      }
    });
  }

  /* Paso 4: Características — se ocultan si el inmueble no tiene construcción */
  const campoHabitabilidad = document.getElementById('campo-habitabilidad');
  const notaTerreno = document.getElementById('nota-terreno');
  if (campoHabitabilidad) {
    const datos = leerDatosFormulario();
    const sinConstruccion = datos.construccion === 'no';
    campoHabitabilidad.style.display = sinConstruccion ? 'none' : '';
    if (notaTerreno) notaTerreno.style.display = sinConstruccion ? '' : 'none';

    fijarValorCampo('p-rec', datos.recamaras);
    fijarValorCampo('p-banos', datos.banos);
    fijarValorCampo('p-estac', datos.estacionamiento);
    fijarValorCampo('p-estado', datos.estado);
    fijarValorCampo('p-desc', datos.descripcion);
    if (Array.isArray(datos.servicios)) {
      ['s1', 's2', 's3', 's4'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.checked = datos.servicios.includes(el.nextElementSibling ? el.nextElementSibling.textContent : '');
      });
    }

    ['link-anterior', 'link-continuar'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          const servicios = Array.from(document.querySelectorAll('.checkbox-row input[type="checkbox"]:checked'))
            .map((c) => c.nextElementSibling ? c.nextElementSibling.textContent : '')
            .filter(Boolean);
          guardarDatosFormulario(Object.assign(leerDatosFormulario(), {
            recamaras: sinConstruccion ? '' : valorCampo('p-rec'),
            banos: sinConstruccion ? '' : valorCampo('p-banos'),
            estacionamiento: sinConstruccion ? '' : valorCampo('p-estac'),
            estado: sinConstruccion ? '' : valorCampo('p-estado'),
            servicios: servicios,
            descripcion: valorCampo('p-desc'),
          }));
        });
      }
    });
  }

  /* Paso 5: Fotografías — el texto de ayuda cambia si es un terreno */
  const zonaCarga = document.querySelector('.upload-zone [data-hint]');
  if (zonaCarga) {
    const datos = leerDatosFormulario();
    zonaCarga.textContent = datos.construccion === 'no'
      ? 'Se recomienda incluir el terreno completo, colindancias y accesos'
      : 'Se recomienda incluir fachada, interiores y el terreno completo';

    const continuar = document.getElementById('link-continuar');
    if (continuar) {
      continuar.addEventListener('click', () => {
        guardarDatosFormulario(Object.assign(leerDatosFormulario(), { fotos: 2 }));
      });
    }
  }

  /* Paso 6: Revisión — resumen construido solo con los campos que aplican */
  const resumenBody = document.getElementById('resumen-body');
  if (resumenBody) {
    const datos = leerDatosFormulario();
    if (Object.keys(datos).length > 0) {
      const filas = [];
      filas.push(['Tipo de inmueble', datos.tipo || '—']);
      const zonaTexto = [datos.zona, datos.municipio].filter(Boolean).join(', ');
      filas.push(['Zona', zonaTexto || '—']);
      if (datos.terreno) filas.push(['Superficie de terreno', datos.terreno + ' m²']);
      if (datos.construccion !== 'no') {
        if (datos.construido) filas.push(['Superficie construida', datos.construido + ' m²']);
        if (datos.recamaras || datos.banos) filas.push(['Recámaras / baños', (datos.recamaras || '—') + ' / ' + (datos.banos || '—')]);
        if (datos.estacionamiento) filas.push(['Estacionamiento', datos.estacionamiento + ' autos']);
        if (datos.estado) filas.push(['Estado general', datos.estado]);
        if (datos.antiguedad) filas.push(['Antigüedad', datos.antiguedad]);
      } else {
        filas.push(['Construcción', 'Terreno sin construcción']);
      }
      if (datos.topografia) filas.push(['Topografía', datos.topografia]);
      const colindancias = [
        datos.colindaNorte ? 'N: ' + datos.colindaNorte : '',
        datos.colindaSur ? 'S: ' + datos.colindaSur : '',
        datos.colindaEste ? 'E: ' + datos.colindaEste : '',
        datos.colindaOeste ? 'O: ' + datos.colindaOeste : '',
      ].filter(Boolean);
      if (colindancias.length) filas.push(['Colindancias', colindancias.join(' · ')]);
      filas.push(['Servicios', (datos.servicios && datos.servicios.length) ? datos.servicios.join(', ') : 'Sin especificar']);

      const propiedadEtiquetas = { privada: 'Propiedad privada', ejidal: 'Ejidal o comunal', tramite: 'En trámite de escrituración' };
      if (datos.propiedadTipo) {
        const partesLegal = [propiedadEtiquetas[datos.propiedadTipo] || datos.propiedadTipo];
        partesLegal.push(datos.escritura === 'no' ? 'sin escritura/título aún' : 'con escritura/título');
        partesLegal.push(datos.predial === 'no' ? 'predial pendiente' : 'predial al corriente');
        partesLegal.push(datos.gravamen === 'no' ? 'con gravamen' : 'libre de gravamen');
        filas.push(['Situación legal', partesLegal.join(', ')]);
      }
      if (datos.usoSuelo) filas.push(['Uso de suelo', datos.usoSuelo]);
      if (datos.sinPrecio) {
        filas.push(['Precio', 'Pendiente de la estimación con IA']);
      } else if (datos.precio) {
        const condiciones = [datos.negociable ? 'Negociable' : ''].concat(datos.formasPago || []).filter(Boolean);
        filas.push(['Precio', '$' + datos.precio + (condiciones.length ? ' · ' + condiciones.join(', ') : '')]);
      }
      filas.push(['Fotografías cargadas', String(datos.fotos || 0)]);

      resumenBody.innerHTML = filas.map(([label, valor]) => `<tr><td>${label}</td><td>${valor}</td></tr>`).join('');
    }
  }

  /* ---------- Página de perfil ---------- */
  const perfilGuardado = document.getElementById('perfil-guardado');
  const perfilActivo = document.getElementById('perfil-activo');
  if (perfilGuardado && perfilActivo) {
    const usuario = leerUsuario();
    if (estaAutenticado() && usuario) {
      perfilGuardado.style.display = 'none';
      perfilActivo.style.display = '';

      const nombre = usuario.nombre || 'Cuenta Solar';
      const iniciales = nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
      const avatar = document.getElementById('perfil-avatar');
      if (avatar) avatar.textContent = iniciales || 'S';
      const nombreEl = document.getElementById('perfil-nombre');
      if (nombreEl) nombreEl.textContent = nombre;
      const emailEl = document.getElementById('perfil-email');
      if (emailEl) emailEl.textContent = usuario.email || '';
      const rolEl = document.getElementById('perfil-rol');
      if (rolEl) rolEl.textContent = usuario.rol === 'vendedor' ? 'Vendedor' : 'Comprador';

      const linkComprador = document.getElementById('perfil-link-comprador');
      const linkVendedor = document.getElementById('perfil-link-vendedor');
      const esVendedor = usuario.rol === 'vendedor';
      if (linkComprador) linkComprador.style.opacity = esVendedor ? '0.6' : '1';
      if (linkVendedor) linkVendedor.style.opacity = esVendedor ? '1' : '0.6';
    } else {
      perfilGuardado.style.display = '';
      perfilActivo.style.display = 'none';
    }
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      cerrarSesion();
      window.location.href = 'index.html';
    });
  }

});
