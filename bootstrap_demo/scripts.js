// Global variable to store the location name
let LocationName = localStorage.getItem("LocationName") || "England";
let autocompleteService = null;

// JavaScript to load the navbar content
function loadNavbar() {
  fetch("exampleNavBar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;

      // Add event listener to the form after the navbar content is loaded
      const form = document.querySelector("form");
      if (form) {
        form.addEventListener("submit", function (event) {
          event.preventDefault(); // Prevent the default form submission
          const searchInput = form.querySelector("input[name='search']");
          if (searchInput) {
            LocationName = searchInput.value; // Update the LocationName variable
            updateNavbarTitle(); // Update the navbar title
          }
        });
      }
      const randomButton = document.getElementById("random-button");

      if (randomButton) {
        console.log("Random Button: ", randomButton);
        randomButton.addEventListener("click", function () {
          const locations = [
            "England",
            "Scotland",
            "Wales",
            "Ireland",
            "France",
            "Germany",
            "Spain",
            "Italy",
          ];
          const randomIndex = Math.floor(Math.random() * locations.length);
          LocationName = locations[randomIndex];
          console.log("NewLocation: ", LocationName);
          localStorage.setItem("LocationName", LocationName);
          //   newLoc = google.maps.places.AutocompleteService();
          updateNavbarTitle();
          updateCarousel();
        });
      }

      // Set the initial title in the navbar
      updateNavbarTitle();

      // Dynamically load the scripts from the navbar file in the correct order
      loadScript("https://code.jquery.com/jquery-3.5.1.slim.min.js", () => {
        loadScript(
          "https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js",
          () => {
            loadScript(
              "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js",
              () => {
                loadScript(
                  "https://maps.googleapis.com/maps/api/js?key=AIzaSyBhpxIKnA38KREG_9X5xiOvrhLN9TSkPjE&libraries=places&callback=initAutocompleteService",
                  null,
                  true
                );
              }
            );
          }
        );
      });
    });
}

// Function to initialize the autocomplete service
function initAutocompleteService() {
  autocompleteService = new google.maps.places.AutocompleteService();
}

// Function to update the navbar title
function updateNavbarTitle() {
  console.log("LocationName: ", LocationName);
  const locationElement = document.getElementById("location-title");
  if (locationElement) {
    locationElement.innerHTML = `Exploring ${LocationName}!`;
  }
}

// Helper function to load scripts dynamically
function loadScript(src, callback, async = false) {
  const script = document.createElement("script");
  script.src = src;
  if (async) {
    script.async = true;
  }
  script.onload = callback;
  document.body.appendChild(script);
}

// JavaScript to load the cards content
function addCards(data) {
  const cardContainer = document.querySelector("#card-container .row");
  const cardTemplate = document.getElementById("card-template");

  // Clear existing cards
  cardContainer.innerHTML = "";

  data.forEach((item) => {
    const card = cardTemplate.content.cloneNode(true);
    card.querySelector(".card-img-top").src = item.image;
    card.querySelector(".card-title").textContent = item.title;
    card.querySelector(".card-text").textContent = item.description; // Update card description

    // Add event listener to reset scroll position on mouse leave
    const cardElement = card.querySelector(".card");
    cardElement.addEventListener("mouseleave", function () {
      const cardBody = cardElement.querySelector(".card-body");
      if (cardBody) {
        cardBody.scrollTop = 0; // Reset scroll to top when hover ends
      }
    });

    cardContainer.appendChild(card);
  });
}

function refreshHome() {
  fetch("exampleCards.json")
    .then((response) => response.json())
    .then((data) => {
      addCards(data);
    });
}

async function updateCarousel() {
  console.log("LocationName: ", LocationName);
  //   const data = [
  //     {
  //       title: "Card 1",
  //       description: "Some quick example text to build on the card title.",
  //       imageUrl:
  //         "https://wallpapers.com/images/hd/malta-1332-x-850-picture-hats4tazne9hb21j.jpg",
  //     },
  //     {
  //       title: "Card 2",
  //       description: "Another example text for the second card.",
  //       imageUrl:
  //         "https://c1.wallpaperflare.com/preview/559/761/312/malta-harbor-sunset-sky.jpg",
  //     },
  //     {
  //       title: "Card 3",
  //       description: "More information for the third card.",
  //       imageUrl:
  //         "https://www.celebritycruises.com/blog/content/uploads/2021/08/malta-beaches-balluta-bay-1024x682.jpg",
  //     },
  //   ];
  const linkdata = await getImagesLinks(LocationName);
  data = [];
  console.log("LinkData: ", linkdata);
  linkdata.forEach((element) => {
    data.push({
      title: "Card 1",
      description: "Some quick example text to build on the card title.",
      imageUrl: element,
    });
  });

  const carouselInner = document.querySelector(".carousel-inner");
  const carouselIndicators = document.querySelector(".carousel-indicators");
  carouselInner.innerHTML = "";
  carouselIndicators.innerHTML = "";
  data.forEach((element, index) => {
    // Create carousel item
    const carouselItem = document.createElement("div");
    carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
    carouselItem.innerHTML = `
          <img src="${element.imageUrl}" class="d-block w-100" alt="${element.title}" />
        `;
    carouselInner.appendChild(carouselItem);

    // Create indicator
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.setAttribute("data-bs-target", "#carouselExampleIndicators");
    indicator.setAttribute("data-bs-slide-to", index);
    indicator.className = index === 0 ? "active" : "";
    indicator.setAttribute("aria-current", index === 0 ? "true" : "false");
    indicator.setAttribute("aria-label", `Slide ${index + 1}`);
    carouselIndicators.appendChild(indicator);
  });
}

const apiKey = "AIzaSyBhpxIKnA38KREG_9X5xiOvrhLN9TSkPjE";
const searchEngineId = "c577d09cc3c534e27";

async function getImagesLinks(query) {
  const enhancedQuery = `${query} landmarks travel`;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${enhancedQuery}&searchType=image`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const images = data.items.map((item) => item.link); // Image URLs
    return images;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
