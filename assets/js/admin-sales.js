
function $id(x){ return document.getElementById(x); }

let mesaActual = null;
let confirmationModal, successModal;
document.addEventListener('DOMContentLoaded', () => {
  confirmationModal = new bootstrap.Modal($id('confirmationModal'));
  successModal = new bootstrap.Modal($id('successModal'));
});

function mostrarModal(mesaNro, total) {
  mesaActual = mesaNro;
  $id('modalMesa').textContent = `Mesa Nro. ${mesaNro}`;
  $id('modalTotal').textContent = total;
  confirmationModal.show();
}

function confirmarVenta() {
  confirmationModal.hide();
  const filas = document.querySelectorAll('tbody tr');
  filas.forEach(fila => {
    const mesaTd = fila.querySelector('td:first-child');
    if (mesaTd && parseInt(mesaTd.textContent) === mesaActual) {
      fila.classList.add('d-none');
    }
  });
  successModal.show();
}
