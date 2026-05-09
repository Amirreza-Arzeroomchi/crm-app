const form = document.getElementById("customerForm");

if(form){

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const customer = {

      firstName:
        document.getElementById("firstName").value,

      lastName:
        document.getElementById("lastName").value,

      phone:
        document.getElementById("phone").value,

      email:
        document.getElementById("email").value,

      address:
        document.getElementById("address").value,

      city:
        document.getElementById("city").value,

      description:
        document.getElementById("description").value

    };

    try {

      const response = await fetch("/save", {

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          "Authorization":
            "Bearer " +
            localStorage.getItem("token")
        },

        body: JSON.stringify(customer)

      });

      const result = await response.text();

      if(response.ok){

        alert("Customer Saved");

        form.reset();

      } else {

        alert(result);

      }

    } catch(err){

      console.log(err);

      alert("Save Error");

    }

  });

}