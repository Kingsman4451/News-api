// =========CALL FORM ELEMENTS=======
let elFilterForm = $(".js-filter-form");
let elSearchInput = $(".js-news-search", elFilterForm);
let elSortSelect = $(".js-sort-select", elFilterForm);
let elFoudedArticlesNumber = $(".js-founded-articles-number", elFilterForm);

// =========CALL PAGINATION BOX===========
let paginationBox = $(".pagination")


// ==========GET FORM VALUES FROM LOCAL STORAGE============
elSearchInput.value = localStorage.getItem("search-value") || ""
elSortSelect.value = localStorage.getItem("sort-value") || "newest"

// ==========Call news list=============
let elNewsList = $(".js-news-list");

// =============CALL TEMPLATES=============
let elCardTemplate = $("#news-card").content;
let elModalTemplate = $("#news-modal").content;


// =============CALL FETCH API============
let FETCH_API = "";
let fetchFunction = function(search = "tesla", sort = "publishedAt", page = 1){
  FETCH_API = `https://newsapi.org/v2/everything?q=${search}&from=2022-05-02&language=en&sortBy=${sort}&page=${page}&apiKey=07716a2a69e8430ea7777488ccf106bc`;

  return FETCH_API
}



// ===========FILTER FUNCTION=============
let filterArticles = function(api, page){
  if(elSearchInput.value !== "" && !isNaN(elSearchInput.value)) {
    api = fetchFunction(elSearchInput.value.toLowerCase().trim())
  }
  else (
    api = fetchFunction("tesla")
  )
  
  if(elSortSelect.value == "newest" && elSearchInput.value !== ""){
    api =  fetchFunction(elSearchInput.value.toLowerCase().trim(), "publishedAt", page)
  }
  else if(elSortSelect.value == "newest" && elSearchInput.value == ""){
    api =  fetchFunction("tesla", "publishedAt", page)
  }

  if(elSortSelect.value == "popular"&& elSearchInput.value !== ""){
    api = fetchFunction(elSearchInput.value.toLowerCase().trim(), "popularity",page)
  }
  else if(elSortSelect.value == "popular" && elSearchInput.value == ""){
    api =  fetchFunction("tesla", "popularity", page)
  }

  if(elSortSelect.value == "relevency"&& elSearchInput.value !== ""){
    api = fetchFunction(elSearchInput.value.toLowerCase().trim(), "relevancy", page)
  }
  else if(elSortSelect.value == "relevency" && elSearchInput.value == ""){
    api =  fetchFunction("tesla", "relevency", page)
  }


  return api
}


//================ PAGINATION FUNCTION ================
let pagenumber = 1
paginationBox.addEventListener("click", (evt)=>{
  pagenumber = Number(evt.target.textContent)
  getNews(pagenumber)
	if (!evt.target.classList.contains('btn')) return;
	evt.target.classList.add('active');
	var btns = document.querySelectorAll('.btn');

	for (var i = 0; i < btns.length; i++) {
		if (btns[i] === evt.target) continue;
		btns[i].classList.remove('active');
	}

}, false);

let paginationFunction = function(pagenumber){
  api = filterArticles(fetchFunction(), pagenumber);
  return api
}




// ============ GET NEWS FROM API FUNCTION ===========
let getNews = function(pagenumber){
  fetch(paginationFunction(pagenumber))
  .then(response => response.json())
  .then(data => {
    let bookmarksArray = []
    renderArticleCards(data.articles);
    elFoudedArticlesNumber.textContent = `Founded ${data.totalResults.toString()} articles`
  })
}
getNews()


//=========== MAKE NEWS CARD================
let makeNewsCard = function(article){
  let newArticleCard = elCardTemplate.cloneNode(true);
  let newModalCard = elModalTemplate.cloneNode(true);

  $(".card", newArticleCard).dataset.newsId = `#exampleModal${article.publishedAt.split(":").join("").split("-").join("")}`;
  $(".news-img", newArticleCard).src = article.urlToImage;
  $(".news-img", newArticleCard).alt = article.title
  $(".card-title", newArticleCard).textContent = article.title;
  $(".card-text", newArticleCard).textContent = article.description;
  $(".news-data", newArticleCard).textContent = article.publishedAt.split("T").splice(0, 1).join();
  $(".js-modal-btn", newArticleCard).setAttribute("data-bs-target", `#exampleModal${article.publishedAt.split(":").join("").split("-").join("")}`);


  $(".js-modal", newModalCard).id = `exampleModal${article.publishedAt.split(":").join("").split("-").join("")}`;
  $(".modal-img", newModalCard).src = article.urlToImage;
  $(".modal-img", newModalCard).alt = article.title;
  $(".modal-title", newModalCard).textContent = article.title;
  $(".modal-title", newModalCard).textContent = article.title;
  $(".modal-description", newModalCard).textContent = article.description;
  $(".modal-text", newModalCard).textContent = article.content;
  $(".article-author", newModalCard).textContent = article.author;
  newArticleCard.appendChild(newModalCard)

  return newArticleCard
}


//============ DISPLAY NEWS LIST================
let renderArticleCards = function(articles){
  let newArticlesFragment = document.createDocumentFragment();
  elNewsList.innerHTML = ""

  articles.forEach(article => {
    newArticlesFragment.append(makeNewsCard(article))
  })

  elNewsList.append(newArticlesFragment)
}


//============= LISTEN SEARCH FORM================
elFilterForm.addEventListener("submit", (evt)=>{
  evt.preventDefault()
})


//============= LISTEN SEARCH INPUT===============
elSearchInput.addEventListener("change" ,(evt)=>{
  evt.preventDefault();

  localStorage.setItem("search-value", elSearchInput.value.trim())
  getNews()
})

//================ LISTEN SORT SELLECT===============
elSortSelect.addEventListener("change" ,(evt)=>{
  evt.preventDefault();

  localStorage.setItem("sort-value", elSortSelect.value)
  getNews()
})
