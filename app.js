let chart;
const boton = document.getElementById("buscar");
const resultado = document.getElementById("resultado");
const ctx = document.getElementById("grafico").getContext("2d");

boton.addEventListener("click", async () => {
  const monto = document.getElementById("monto").value;
  const moneda = document.getElementById("moneda").value;

  try {
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    if (!res.ok) throw new Error("API no disponible");
    const data = await res.json();
    procesarDatos(data, monto, moneda);
  } catch {
    const resOffline = await fetch("offline.json");
    const dataOffline = await resOffline.json();
    procesarDatos(dataOffline[moneda], monto, moneda);
  }
});

function procesarDatos(data, monto, moneda) {
  const valorActual = data.serie[0].valor;
  const conversion = (monto / valorActual).toFixed(2);
  resultado.textContent = `Resultado: ${conversion} ${moneda.toUpperCase()}`;

  const ultimosDiez = data.serie.slice(0, 10).reverse();
  const labels = ultimosDiez.map(d => d.fecha.substring(0, 10));
  const valores = ultimosDiez.map(d => d.valor);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Historial últimos 10 días (${moneda})`,
        data: valores,
        borderColor: "#0077b6",
        backgroundColor: "rgba(144, 224, 239, 0.4)",
        fill: true,
        tension: 0.3
      }]
    }
  });
}