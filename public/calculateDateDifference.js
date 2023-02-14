function calculateDateDifference(date1, date2) {
  // Parse the dates using the Date object
  const date1Object = new Date(date1);
  const date2Object = new Date(date2);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = date1Object - date2Object;

  // Convert the difference from milliseconds to the desired unit of time
  const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24;

  document.getElementById("nightCount").innerHTML = `${differenceInDays} gece`;
  document.getElementById("prices").style.display = "block";
  const gunlukPrice = document.getElementById("34_asaf").innerHTML.split(" ")[0] ;
  document.getElementById("kalmaBedeliToplam").innerHTML = `${gunlukPrice * differenceInDays} ₺`;
  // get temizlik bedeli
  const temizlikBedeli = document.getElementById("temizlikBedeli").innerHTML.split(" ")[0];
  //get hizmet bedeli
  console.log(temizlikBedeli);

  const hizmetBedeli = document.getElementById("hizmetBedeli").innerHTML.split(" ")[0];
  console.log(hizmetBedeli);
  // set toplamBedel to hizmetBedeli + temizlikBedeli + gunlukPrice * differenceInDays
  document.getElementById("toplamBedel").innerHTML = `${Number(temizlikBedeli) + Number(hizmetBedeli) + Number(gunlukPrice * differenceInDays)} ₺`;

  document.getElementById("output").innerHTML =  `${document.getElementById("girisTarihi").value} - ${document.getElementById("cikisTarihi").value}`
  document.getElementById("output2").innerHTML = `${document.getElementById("floatingTextarea").value} Misafir`;
  document.getElementById("output3").innerHTML = `${differenceInDays} Gece`;
  document.getElementById("output4").innerHTML = `${
    Number(temizlikBedeli) +
    Number(hizmetBedeli) +
    Number(gunlukPrice * differenceInDays)
  } ₺`;
}
