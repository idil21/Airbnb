function checkDateFormat(input, input2) {
  // The regular expression for the YYYY/MM/DD pattern
  const datePattern = /^\d{4}\/\d{2}\/\d{2}$/;

  // Check if the input matches the date pattern
  if (datePattern.test(input) && datePattern.test(input2)) {
    // If the input matches the pattern, return true
    document.getElementById("rezerveEtButonu").removeAttribute("disabled");
    console.log(true);
  } else {
    // If the input does not match the pattern, return false
    document.getElementById("rezerveEtButonu").setAttribute("disabled",true);

    console.log(false);
    return false;
  }
}
