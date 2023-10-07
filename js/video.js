const videosWrapper = document.querySelector(".videos");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");

const apiKEY = "VP29sp0n1JS84DgIhIwO35HLaMjxqWN9KAbNK8ByhU1hZOzgcIkD9ux3"; // Replace with your Pexels API key
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const generateHTML = (videos) => {
    return videos.map((vid) => {
        return `<li class="card">
        <video class="play" loop muted src="${vid.video_files[0].link}"></video>
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
        .then((res) => {
            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            const generatedHTML = generateHTML(data.videos);
            videosWrapper.innerHTML += generatedHTML;
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");

            // Add event listeners to play videos on hover and pause on mouse leave
            const videoElements = videosWrapper.querySelectorAll("video.play");
            videoElements.forEach((video) => {
                video.addEventListener("mouseenter", () => {
                    video.play();
                });
                video.addEventListener("mouseleave", () => {
                    video.pause();
                });
            });
        })
        .catch((error) => {
            console.error("Error loading videos:", error);
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
        });
};

const loadMoreVideos = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/videos/popular?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm
        ? `https://api.pexels.com/videos/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
        : apiURL;
    getVideos(apiURL);
};

const loadSearchVideos = () => {
    // Update the searchTerm in real-time
    searchTerm = searchInput.value.trim();
    currentPage = 1;
    videosWrapper.innerHTML = "";
    let apiURL = `https://api.pexels.com/videos/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;
    getVideos(apiURL);
};

getVideos(`https://api.pexels.com/videos/popular?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener("click", loadMoreVideos);
searchInput.addEventListener("input", loadSearchVideos);
