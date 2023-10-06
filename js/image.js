const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");

const apiKEY = "VP29sp0n1JS84DgIhIwO35HLaMjxqWN9KAbNK8ByhU1hZOzgcIkD9ux3";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images.map((img) =>
    `<li class="card">
      <img src="${img.src.large2x}" alt="">
      <div class="details d-flex align-content-center justify-content-between position-absolute">
        <div class="photographer d-flex align-items-center">
          <i class="fa-solid fa-camera"></i>
          <span>${img.photographer}</span>
        </div>
        <button><i class="fa-solid fa-download"></i></button>
      </div>
    </li>`
  ).join(''); // Join the array of HTML strings into one string
};

const getImages = (apiURL) => {
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKEY },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      generateHTML(data.photos);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!"));
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const loadSearchImages = (e) => {
  if (e.target.value === "") return (searchTerm = null);
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    let apiURL = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
  }
};

// Initial load without a search term
getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
