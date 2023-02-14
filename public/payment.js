
function printDates() {
  var checkinDate = document.getElementById("checkin").value;
  var checkoutDate = document.getElementById("checkout").value;
  var outputElement = document.getElementById("output");
  outputElement.innerHTML =  checkinDate + "/ " + checkoutDate;
}
function printGuests() {
  var Adults =  parseInt(document.getElementById("numberOfAdults").value);
  var Children =  parseInt(document.getElementById("numberOfChildren").value);
  var Infants =  parseInt(document.getElementById("numberOfInfants").value);
  var Pets =  parseInt(document.getElementById("numberOfPets").value);
  var Guests=Adults + Children;
  var outputElement = document.getElementById("output2");
  outputElement.innerHTML = Guests+" guests," +Infants+" infant,"+Pets+" pet" ;
}
function getDateDifference() {
  var checkinDate = new Date(document.getElementById("checkin").value);
  var checkoutDate = new Date(document.getElementById("checkout").value);
  var diffDays;
  if (checkinDate && checkoutDate) {
    var timeDiff = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  var outputElement = document.getElementById("output3");
  outputElement.innerHTML = diffDays;
}



function validatePaymentForm() {

  var form = document.getElementById("payment-form");
  var cvv = form.elements["cardCVV"].value;
  var cardNumber = form.elements["cardNumber"].value;
  var expirationDate = form.elements["cardExpiration"].value;
    if (cardNumber.length == 0) {
      alert('Please enter a card number');
      return;
    }
    if (expirationDate.length == 0) {
      alert('Please enter an expiration date');
      return;
    }
    if (cvv.length == 0) {
      alert('Please enter a security code');
      return;
    }
    alert('Payment submitted successfully!');

 
}


function validateCardNumber(cardNumber) {
  
  var cardNumberPattern = /^\d{16}$/;
  return cardNumberPattern.test(cardNumber);
}

function validateCVV(cvv) {
  var cvvPattern = /^\d{3,4}$/;
  if (cvv == "") {
    return false;
  }
  return cvvPattern.test(cvv);
}




