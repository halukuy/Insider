(() => {
  const init = () => {
    buildHTML();
    buildCSS();
    setEvents();
    fetchProducts();
  };

  const fetchProducts = async () => {
    const storedProducts = JSON.parse(localStorage.getItem("products"));
    if (storedProducts) {
      renderCarousel(storedProducts);
    } else {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
        );
        const products = await response.json();
        localStorage.setItem("products", JSON.stringify(products));
        renderCarousel(products);
      } catch (error) {
        console.error("Ürün hatası:", error);
      }
    }
  };

  const renderCarousel = (products) => {
    const carouselItems = products
      .map(
        (product) => `
            <div class="carousel-item">
                <a href="${product.url}" target="_blank">
                    <img src="${product.img}" alt="${product.name}" />
                </a>
                <p>${product.name}</p>
                <span class="product-price" style="color: #428bca; font-weight: bold;">${product.price} TRY</span>
                <button class="favorite-btn" data-id="${product.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
                    <path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path>
                  </svg>
                </button>
            </div>
        `
      )
      .join("");

    document.querySelector(".carousel").innerHTML = `
            <button class="carousel-control left">&lt;</button>
            <div class="carousel-track">
                ${carouselItems}
            </div>
            <button class="carousel-control right">&gt;</button>
        `;

    highlightFavorites();
  };

  const highlightFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach((id) => {
      const favoriteButton = document.querySelector(
        `.favorite-btn[data-id="${id}"]`
      );
      if (favoriteButton) {
        favoriteButton.classList.add("favorited");
        const path = favoriteButton.querySelector("svg path");
        path.setAttribute("stroke", "blue");
        path.setAttribute("fill", "blue");
      }
    });
  };

  const buildHTML = () => {
    let productDetail = document.querySelector(".product-detail");
    if (!productDetail) {
      productDetail = document.createElement("div");
      productDetail.classList.add("product-detail");
      document.body.appendChild(productDetail);
    }

    const html = `
            <div class="carousel-container">
                <h1>You Might Also Like</h1>
                <div class="carousel"></div>
            </div>
        `;

    productDetail.insertAdjacentHTML("beforeend", html);
  };

  const buildCSS = () => {
    const css = `
      .carousel-container h1 {
        font-family: "Open Sans", sans-serif;
        font-size: 32px;
        font-weight: 100;
        margin: 0 0 15px;
        padding: 15px 0;
        text-align: center;  
        display: flex;
        justify-content: center;  
        width: 100%;
        
      }

      .carousel {
        display: flex;
        overflow: hidden;
        position: relative; 
      }

      .carousel-track {
        display: flex;
        transition: transform 0.3s ease-in-out;
      }

      .carousel-item {
        flex: 0 0 calc(100% / 6.5);
        box-sizing: border-box;
        padding: 10px;
        text-align: center;
      }

      .carousel img {
        max-width: 100%;
        border-radius: 10px;
      }

      .carousel-control {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: black;
        color: black;
        border: none;
        padding: 10px 15px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        z-index: 2;
        border-radius: 5px; 
      }

      .carousel-control.left {
        left: 0;
      }

      .carousel-control.right {
        right: 0;
      }

      .favorite-btn {
        background: none;
        border: none;
        cursor: pointer;
        z-index: 1; 
        padding: 10px; 
      }

      .favorite-btn.favorited svg {
        stroke: blue;
        fill: blue;
      }

       .product-price {
      color: #428bca; 
      }

      @media (max-width: 1200px) {
        .carousel-item {
          flex: 0 0 calc(100% / 5); 
        }
      }

      @media (max-width: 992px) {
        .carousel-item {
          flex: 0 0 calc(100% / 4); 
        }
      }

      @media (max-width: 768px) {
        .carousel-item {
          flex: 0 0 calc(100% / 3); 
        }
      }

      @media (max-width: 576px) {
        .carousel-item {
          flex: 0 0 calc(100% / 2); 
        }
      }

      @media (max-width: 375px) {
        .carousel-item {
          flex: 0 0 100%; 
        }
      }
    `;

    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  };

  const setEvents = () => {
    document.body.addEventListener("click", (event) => {
      const target = event.target;

      if (target.closest(".favorite-btn")) {
        const button = target.closest(".favorite-btn");
        const id = button.dataset.id;
        toggleFavorite(id, button);
      }

      if (target.classList.contains("carousel-control")) {
        const direction = target.classList.contains("left") ? -1 : 1;
        slideCarousel(direction);
      }
    });
  };

  const toggleFavorite = (id, button) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const svgPath = button.querySelector("svg path");
    if (favorites.includes(id)) {
      favorites = favorites.filter((fav) => fav !== id);
      button.classList.remove("favorited");
      svgPath.setAttribute("stroke", "#555");
      svgPath.setAttribute("fill", "none");
    } else {
      favorites.push(id);
      button.classList.add("favorited");
      svgPath.setAttribute("stroke", "blue");
      svgPath.setAttribute("fill", "blue");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const slideCarousel = (direction) => {
    const track = document.querySelector(".carousel-track");
    const itemWidth = track.firstElementChild.offsetWidth;
    const currentTransform =
      parseFloat(getComputedStyle(track).transform.split(",")[4]) || 0;
    const newTransform = currentTransform - direction * itemWidth;

    track.style.transform = `translateX(${newTransform}px)`;
  };

  init();
})();
