const productosStock = [
  'Empanada de pollo', 'Empanada de lomo', 'Empanada hawaiana', 'Empanada jamón y queso',
  'Tres leches', 'Torta de chocolate', 'Tartaleta', 'César',
  'Pye de limón', 'Pye de manzana', 'Crema volteada', 'Tiramisú',
  'Carrot cake', 'Red velvet', 'Cake imperial',
  'Cake de vainilla', 'Cake de naranja', 'Cake de yogurt',
  'Leche asada', 'Suspiro limeño', 'Torta helada', 'Combinado',
  'Budín', 'Brownie', 'Galleta de Nutella', 'Galleta de manjar',
  'Galletón', 'Galleta de pistacho', 'Galleta Red Velvet', 'Muffin de manzana', 'Mazamorra', 'Arroz con leche',

  // NUEVOS
  'Gelatina', 'Gelaflan', 'Flan', 'Pudín', 'Chicha', 'Papa rellena', 'Bruselina'
];

const productosCheck = [
  'Cheesecake',
  'Delicia de maracuyá', 'Delicia de lúcuma', 'Gaseosas',
  'Cuchara', 'Cucharitas', 'Tenedor',
  'Taper 1L', 'Taper 1/2L', 'Taper 8oz',
  'Vasos', 'Bolsas de papel',
  'Alfajor grande', 'Alfajor pequeño', 'Café', 'Agua'
];

const bolsasOpciones = ['#20', '#12', '#8', '#6', '#4'];
const inventario = document.getElementById('inventario');

/* Productos con stock */
productosStock.forEach(p => {
  inventario.innerHTML += `
    <div class="col-6 col-md-4">
      <label class="form-label">${p}</label>
      <input type="number" min="0" class="form-control" data-nombre="${p}">
    </div>
  `;
});

/* Productos con check */
productosCheck.forEach(p => {
  if (p === 'Bolsas de papel') {
    inventario.innerHTML += `
      <div class="col-12">
        <label class="form-label">${p}</label>
        <div class="d-flex flex-wrap gap-3">
          ${bolsasOpciones.map(o => `
            <div class="form-check">
              <input class="form-check-input" type="checkbox" data-nombre="${p} ${o}">
              <label class="form-check-label">${o}</label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    inventario.innerHTML += `
      <div class="col-6 col-md-4">
        <div class="form-check mt-4">
          <input class="form-check-input" type="checkbox" data-nombre="${p}">
          <label class="form-check-label">${p}</label>
        </div>
      </div>
    `;
  }
});

/* Generar resultado */
function generarResultado() {
  let texto = '';
  const fecha = new Date().toLocaleDateString('es-PE');

  texto += `Fecha: ${fecha}\n\n`;

  // Stock (SIEMPRE salen, incluso en 0)
  document.querySelectorAll('input[type="number"]').forEach(i => {
    const valor = i.value === '' ? 0 : Number(i.value);

    if (i.dataset.nombre === 'Chicha') {
      texto += `Chicha: ${valor} ${valor === 1 ? 'litro' : 'litros'}\n`;
    } else {
      texto += `${i.dataset.nombre}: ${valor}\n`;
    }
  });



  // Checks (SIEMPRE salen)
  document.querySelectorAll('input[type="checkbox"]').forEach(c => {
    texto += `${c.dataset.nombre}: ${c.checked ? '✅' : '❌'}\n`;
  });

  document.getElementById('resultado').value = texto.trim();

  const boton = document.getElementById('btnCopiar');
  boton.disabled = false;
  boton.innerText = 'Copiar resultado';
}

/* Copiar */
function copiarResultado() {
  const texto = document.getElementById('resultado').value;
  const boton = document.getElementById('btnCopiar');

  if (!texto) {
    alert('Primero genera el resultado');
    return;
  }

  navigator.clipboard.writeText(texto).then(() => {
    const msg = document.getElementById('copiado');
    msg.style.display = 'block';
    msg.style.color = '#28a745'; // verde satisfacción 😌

    // deshabilitar botón
    boton.disabled = true;
    boton.innerText = 'Copiado ✔';

    setTimeout(() => msg.style.display = 'none', 2000);
  }).catch(() => {
    alert('No se pudo copiar');
  });
}



function enviarWhatsApp() {
  const texto = document.getElementById('resultado').value;

  if (!texto) {
    alert('Primero genera el resultado');
    return;
  }

  const textoCodificado = encodeURIComponent(texto);
  const url = `https://wa.me/?text=${textoCodificado}`;

  window.open(url, '_blank');
}

async function generarImagen() {

  const tabla1 = document.getElementById('tabla1');
  const tabla2 = document.getElementById('tabla2');

  tabla1.innerHTML = '';
  tabla2.innerHTML = '';

  // FECHA
  document.getElementById('fechaImagen').innerText =
    'Fecha: ' + new Date().toLocaleDateString('es-PE');

  // STOCK
  document.querySelectorAll('input[type="number"]').forEach(i => {

    const valor = i.value === '' ? 0 : i.value;

    tabla1.innerHTML += `
    <tr>

      <td style="
        border:1px solid black;
        padding:2px 6px;
        color:black;
        font-size:14px;
        line-height:1.1;
      ">
        ${i.dataset.nombre}
      </td>

      <td style="
        border:1px solid black;
        padding:2px 6px;
        color:black;
        text-align:center;
        font-size:14px;
        line-height:1.1;
      ">
        ${valor}
      </td>

    </tr>
  `;
  });

  // CHECKS
  document.querySelectorAll('input[type="checkbox"]').forEach(c => {

    tabla2.innerHTML += `
    <tr>

      <td style="
        border:1px solid black;
        padding:2px 6px;
        color:black;
        font-size:14px;
        line-height:1.1;
      ">
        ${c.dataset.nombre}
      </td>

      <td style="
        border:1px solid black;
        padding:2px 6px;
        font-weight:bold;
        color:${c.checked ? 'green' : 'red'};
        text-align:center;
        font-size:14px;
        line-height:1.1;
      ">
        ${c.checked ? '✔' : '✘'}
      </td>

    </tr>
  `;
  });

  // CAPTURA
  const elemento = document.getElementById('plantillaImagen');

  const canvas = await html2canvas(elemento);

  // DESCARGAR
  const link = document.createElement('a');
  link.download = 'inventario.png';
  link.href = canvas.toDataURL();
  link.click();
}
