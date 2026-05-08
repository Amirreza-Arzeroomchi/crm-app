const form = document.getElementById("customerForm");

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const customer = {

      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      description: document.getElementById("description").value

    };

    try {

      const response = await fetch("/save", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "Authorization": localStorage.getItem("token")

        },

        body: JSON.stringify(customer)

      });

      await response.text();

      alert("Customer saved successfully");

      form.reset();

    } catch (error) {

      console.error(error);

      alert("Error saving customer");

    }

  });

}



const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    try {

      const response = await fetch("/login", {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          email,
          password

        })

      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("token", data.token);

        alert("Login Success");

        window.location.href = "/dashboard.html";

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.log(err);

      alert("Login Error");

    }

  });

}