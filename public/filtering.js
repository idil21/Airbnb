const chipContainer = document.querySelector(".chip-container");
chipContainer.addEventListener("click", (event) => {
  const chip = event.target;
  if (chip.classList.contains("chip")) {
    const houseType = chip.getAttribute('data-house-type');
    console.log(houseType);
    axios
      .get(`/adverts/${houseType}`)
      .then((response) => {
        const data = response.data;
        const adverts = data.adverts;
        const advertList = document.querySelector(".row");
        advertList.innerHTML = "";
        for (const advert of adverts) {
          const advertCard = createAdvertCard(advert);
          advertList.appendChild(advertCard);
        }
      
      })
      .catch((error) => {
        console.log(error);
      });
  }
});


const formElement = document.querySelector('#city-form');  
formElement.addEventListener('submit', (event) => {  
  event.preventDefault();  
  const cityName = document.getElementById('city-name').value;
  console.log(cityName); 
  axios.get(`/city/${cityName}`)  
    .then((response) => { 
      document.getElementById('city-form').reset();
      const data = response.data;
        const adverts = data.adverts;
        const advertList = document.querySelector(".row");
        advertList.innerHTML = "";
        for (const advert of adverts) {
          const advertCard = createAdvertCard(advert);
          advertList.appendChild(advertCard);
        }
    })
    .catch((error) => {  
      console.log(error);
    });
});


function createAdvertCard(advert) {
  const advertCard = document.createElement("div");
  advertCard.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3");

  const link = document.createElement("a");
  link.href = `/ilan/${advert.id}`;
  link.classList.add("card", "card-video", "border-0", "bg-transparent", "mb-4");
  advertCard.appendChild(link);

  const carousel = createCarousel(advert);
  link.appendChild(carousel);

  const details = createDetails(advert);
  link.appendChild(details);

  return advertCard;
}

function createCarousel(advert) {
  const carousel = document.createElement("div");
  carousel.id = `carouselExampleControlsNoTouching${advert.id}`;
  carousel.classList.add("carousel", "slide");
  carousel.setAttribute("data-bs-touch", "false");
  carousel.setAttribute("data-bs-interval", "false");

  const carouselInner = document.createElement("div");
  carouselInner.classList.add("carousel-inner");
  carousel.appendChild(carouselInner);

  for (let i = 0; i < advert.images.length; i++) {
    const imageUrl = advert.images[i];
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (i === 0) {
      carouselItem.classList.add("active");
    }

    const image = document.createElement("img");
    image.src = imageUrl;
    image.classList.add("_6tbg2q", "d-block", "w-100");
    image.setAttribute("aria-hidden", "true");
    image.setAttribute("elementtiming", "LCP-target");
    image.setAttribute("fetchpriority", "high");
    image.setAttribute("id", "FMP-target");
    image.setAttribute("loading", "eager");
    image.style.height = "250px";
    image.style.borderRadius = "30px";
    image.style.objectFit = "cover";
    image.style.verticalAlign = "bottom";
    carouselItem.appendChild(image);
    carouselInner.appendChild(carouselItem);
  }
  const prevButton = document.createElement("button");
  prevButton.classList.add("carousel-control-prev");
  prevButton.type = "button";
  prevButton.setAttribute("data-bs-target", `#carouselExampleControlsNoTouching${advert.id}`);
  prevButton.setAttribute("data-bs-slide", "prev");
  carousel.appendChild(prevButton);

  const prevIcon = document.createElement("span");
  prevIcon.classList.add("carousel-control-prev-icon");
  prevIcon.setAttribute("aria-hidden", "true");
  prevButton.appendChild(prevIcon);

  const prevText = document.createElement("span");
  prevText.classList.add("visually-hidden");
  prevText.textContent = "Previous";
  prevButton.appendChild(prevText);

  const nextButton = document.createElement("button");
  nextButton.classList.add("carousel-control-next");
  nextButton.type = "button";
  nextButton.setAttribute("data-bs-target", `#carouselExampleControlsNoTouching${advert.id}`);
  nextButton.setAttribute("data-bs-slide", "next");
  carousel.appendChild(nextButton);

  const nextIcon = document.createElement("span");
  nextIcon.classList.add("carousel-control-next-icon");
  nextIcon.setAttribute("aria-hidden", "true");
  nextButton.appendChild(nextIcon);

  const nextText = document.createElement("span");
  nextText.classList.add("visually-hidden");
  nextText.textContent = "Next";
  nextButton.appendChild(nextText);

  return carousel;
}

function createDetails(advert) {
  const details = document.createElement("div");
  details.classList.add("card-video-details", "d-flex", "mt-2");

  const div = document.createElement("div");
  div.classList.add("card-video-div");
  details.appendChild(div);

  const h4 = document.createElement("h4");
  h4.classList.add("card-video-h4");
  h4.textContent = advert.description;
  div.appendChild(h4);

  const address = document.createElement("div");
  address.textContent = advert.address;
  div.appendChild(address);

  const price = document.createElement("div");
  const strong = document.createElement("strong");
  price.textContent = advert.price_per_day;
  price.appendChild(strong);
  div.appendChild(price);

  return details;
}