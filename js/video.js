const videosWrapper = document.querySelector(".videos");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".inpu-box input");

const apiKEY = "YOUR_PEXELS_API_KEY"; // Replace with your Pexels API key
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const generateHTML = (videos) => {
    return videos.map((vid) => {
        return `<li class="card">
        <video autoplay loop src="${vid.video_files[0].link}"></video>
        <div class="details d-flex align-content-center justify-content-between position-absolute">
            <div class="photographer d-flex align-items-center">
                <i class="fa-solid fa-camera"></i>
                <span>${vid.user.name}</span>
            </div>
            <button><i class="fa-solid fa-download"></i></button>
        </div>
    </li>`;
    }).join('');
};

const getVideos = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKEY },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            const generatedHTML = generateHTML(data.videos);
            videosWrapper.innerHTML += generatedHTML;
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
        })
        .catch(() => alert("Failed to load videos!"));
};

const loadMoreVideos = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/videos/popular?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm
        ? `https://api.pexels.com/videos/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
        : apiURL;
    getVideos(apiURL);
};

const loadSearchVideos = (e) => {
    if (e.target.value === "") return (searchTerm = null);
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        videosWrapper.innerHTML = "";
        let apiURL = `https://api.pexels.com/videos/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;
        getVideos(apiURL);
    }
};

getVideos(`https://api.pexels.com/videos/popular?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener("click", loadMoreVideos);
searchInput.addEventListener("keyup", loadSearchVideos);
