const apiKey = "AIzaSyBhpxIKnA38KREG_9X5xiOvrhLN9TSkPjE";
const searchEngineId = "c577d09cc3c534e27";

function getImagesLinks(query) {
  url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&searchType=image`;
  let images;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      images = data.items.map((item) => item.link); // Image URLs
    })
    .catch((error) => console.error("Error:", error));
  return images;
}
console.log(getImagesLinks("New York"));
