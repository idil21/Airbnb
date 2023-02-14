$(document).ready(() => {
  $("#login-btn").click((event) => {
    event.preventDefault();

    const email = $("#defaultForm-email").val();
    const password = $("#defaultForm-pass").val();

    $.ajax({
      type: "POST",
      url: "/login",
      data: { email: email, password: password },
      dataType: "json",
      success: (response) => {
        if (response.success) {
          window.location.href = "/";
        } else {
          $("#login-error").text(response.message);
          setTimeout(() => {
            $("#login-error").text("");
          }, 3000);
        }
      },
      error: (error) => {
        console.error(error);
        $("#login-error").text("An error occurred. Please try again later.");
      },
    });
  });
});

$(document).ready(() => {
  $("#signup-btn").click((event) => {
    event.preventDefault();
    const name = $("#orangeForm-name").val();
    const email = $("#orangeForm-email").val();
    const password = $("#orangeForm-pass").val();
    $.ajax({
      type: "POST",
      url: "/register",
      data: { name: name, email: email, password: password },
      dataType: "json",
      success: (response) => {
        if (response.success) {
          window.location.href = "/";
        } else {
          $("#signup-error").text(response.message);
          setTimeout(() => {
            $("#signup-error").text("");
          }, 3000);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  });
});

// reset sign up modal after clicked close button
$(document).ready(function () {
  $(".modal").on("hidden.bs.modal", function () {
    $("#orangeForm-name").val("");
    $("#orangeForm-email").val("");
    $("#orangeForm-pass").val("");
    $("#signup-error").text("");
  });
});

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function () {
  axios
    .get("/logout")
    .then((response) => {
      alert(response.data.message);
      window.location.href = "/";
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
});

const button = document.getElementById("trash-button");

// button.addEventListener("click", function (event) {
//   // event.preventDefault();
//   const advert_id = button.getAttribute("data-user-id");
//   console.log("advert_id", advert_id);
//   $.ajax({
//     type: "DELETE",
//     url: `/delete/${advert_id}`,
//     data: { id: advert_id },
//     dataType: "json",
//     success: (response) => {
//       if (response.success) {
//         window.location.href = "/evsahibi";
//       }
//     },
//     error: (error) => {
//       console.error(error);
//       alert("YETO");
//     },
//   });
// });
