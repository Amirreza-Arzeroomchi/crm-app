let customers = [];

async function loadCustomers() {

  try {

    const response = await fetch("/customers");

    const data = await response.json();

    customers = data;

    renderTable(customers);

  } catch (err) {

    console.log(err);

  }

}

function renderTable(data) {

  const table = document.getElementById("customerTable");

  table.innerHTML = "";

  data.forEach((c) => {

    table.innerHTML += `

      <tr>

        <td>${c.firstName || ""}</td>

        <td>${c.lastName || ""}</td>

        <td>${c.email || ""}</td>

        <td>${c.phone || ""}</td>

        <td>${c.city || ""}</td>

        <td>

          <button
            class="delete-btn"
            onclick="deleteCustomer('${c._id}')"
          >
            Delete
          </button>

        </td>

      </tr>

    `;

  });

}

async function deleteCustomer(id){

  try {

    await fetch("/delete/" + id, {

      method:"DELETE"

    });

    loadCustomers();

  } catch(err){

    console.log(err);

  }

}

document
.getElementById("search")
.addEventListener("input", function(){

  const value = this.value.toLowerCase();

  const filtered = customers.filter(c =>

    (c.firstName || "")
    .toLowerCase()
    .includes(value)

    ||

    (c.lastName || "")
    .toLowerCase()
    .includes(value)

    ||

    (c.email || "")
    .toLowerCase()
    .includes(value)

    ||

    (c.city || "")
    .toLowerCase()
    .includes(value)

  );

  renderTable(filtered);

});

loadCustomers();