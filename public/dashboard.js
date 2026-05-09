let customers = [];

function loadCustomers() {
  fetch("/customers")
    .then(res => res.json())
    .then(data => {
      customers = data;
      renderTable(customers);
    })
    .catch(err => console.error(err));
}

function renderTable(data) {
  const table = document.getElementById("customerTable");

  // clear table before render
  table.innerHTML = "";

  let rows = "";
  data.forEach((c, index) => {
    rows += `
      <tr>
        <td>${c.firstName || ""}</td>
        <td>${c.lastName || ""}</td>
        <td>${c.email || ""}</td>
        <td>${c.phone || ""}</td>
        <td>${c.city || ""}</td>
          <button onclick="deleteCustomer('${c.id}')">Delete</button>
          <button onclick="deleteCustomer(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
  table.innerHTML = rows;
}

// delete
function deleteCustomer(id) {
  fetch("/delete/" + id, {
    method: "DELETE"
  })
  .then(() => loadCustomers());
}

// search
document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = customers.filter(c =>
    (c.firstName || "").toLowerCase().includes(value) ||
    (c.lastName || "").toLowerCase().includes(value) ||
    (c.email || "").toLowerCase().includes(value) ||
    (c.city || "").toLowerCase().includes(value)
  );

  renderTable(filtered);
});

// init
loadCustomers();
/* ================= CLOSE ================= */

document
.getElementById("closeModal")
.onclick = () => {

  document
  .getElementById("customerModal")
  .style.display = "none";
};

/* ================= MINIMIZE ================= */

document
.getElementById("minimizeBtn")
.onclick = () => {

  document
  .getElementById("modalBox")
  .classList.toggle("minimized");
};

/* ================= DRAGGABLE ================= */

const modalBox =
document.getElementById("modalBox");

const dragHeader =
document.getElementById("dragHeader");

let isDragging = false;

let offsetX = 0;
let offsetY = 0;

dragHeader.addEventListener(
  "mousedown",
  (e) => {

    isDragging = true;

    offsetX =
      e.clientX -
      modalBox.offsetLeft;

    offsetY =
      e.clientY -
      modalBox.offsetTop;
  }
);

document.addEventListener(
  "mousemove",
  (e) => {

    if(!isDragging) return;

    modalBox.style.left =
      e.clientX - offsetX + "px";

    modalBox.style.top =
      e.clientY - offsetY + "px";
  }
);

document.addEventListener(
  "mouseup",
  () => {

    isDragging = false;
  }
);