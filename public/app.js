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

        // redirect to customer page
        window.location.href = "/customer.html";

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.log(err);

      alert("Login Error");

    }

  });

}