import "./style.css";

window.__gcse || (window.__gcse = {});
window.__gcse.searchCallbacks = {
  web: {
    ready: resultsReadyCallback,
  },
};

function resultsReadyCallback(gname, query, promos, results, div) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (results) {
    for (const result of results) {
      console.log(result);
      createResultElement(result, resultsContainer);
    }
    document.querySelector(".gsib_b").innerHTML =
      '<img src="/search.svg" alt="" />';
  }
}

let videoUrl = "";
const modal = document.querySelector(".modal");
const visitButton = document.querySelector(".modal-button:first-of-type");
const closeButton = document.querySelector(".modal-button:last-of-type");

visitButton.addEventListener("click", () => {
  window.open(videoUrl, "_blank");
  modal.style.display = "none";
});

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

function createResultElement(result, resultsContainer) {
  const resultDiv = document.createElement("div");
  resultDiv.className = "result";

  const details = document.createElement("div");
  details.classList = "result__details";

  const title = document.createElement("span");
  title.innerHTML = result.title;
  title.classList = "result__details-title";

  const artist = document.createElement("span");
  artist.innerText = result.richSnippet.person?.name;
  artist.className = "result__details-artist";

  const views = document.createElement("span");
  views.innerText = shortenNumber(
    result?.richSnippet?.videoobject?.interactioncount
  );

  const websiteAndViewsWrapper = document.createElement("div");
  websiteAndViewsWrapper.className = "result__details-extra";
  const website = document.createElement("div");
  website.innerHTML = `
        <img src="/yt.svg" alt="" style="width:10px; height: 10px"/>
        ${result.richSnippet.metatags.ogSiteName}.com
      `;
  websiteAndViewsWrapper.appendChild(website);
  websiteAndViewsWrapper.appendChild(views);

  const thumbnail = document.createElement("img");
  thumbnail.src = result.thumbnailImage.url;

  details.appendChild(title);
  details.appendChild(artist);
  details.appendChild(websiteAndViewsWrapper);

  resultDiv.appendChild(thumbnail);
  resultDiv.appendChild(details);

  resultsContainer.appendChild(resultDiv);

  const formContainer = document.querySelector("form.gsc-search-box");
  formContainer.insertAdjacentElement("afterend", resultsContainer);

  resultDiv.addEventListener("click", () => {
    modal.style.display = "flex";
    const iframe = modal.querySelector("iframe");
    const embedUrl = result.richSnippet.metatags.ogVideoUrl ?? "/no-url.html";
    videoUrl = result.url;

    iframe.setAttribute("src", embedUrl);
    const infoDiv = document.querySelector(".modal-info");
    const title = document.createElement("span");
    title.innerHTML = result.title;
    infoDiv.appendChild(title);
  });
}

function shortenNumber(number) {
  if (number === undefined) return "N / A";

  const suffixes = ["", "k", "m", "b", "t"];

  const numString = String(number);
  const numLength = numString.length;

  if (numLength <= 3) {
    return numString;
  } else {
    const magnitudeIndex = Math.floor((numLength - 1) / 3);

    const shortValue = parseFloat(
      (number / Math.pow(1000, magnitudeIndex)).toFixed(1)
    );

    return shortValue + suffixes[magnitudeIndex];
  }
}
