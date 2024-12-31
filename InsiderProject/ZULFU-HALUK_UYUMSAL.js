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
                <span>${product.price} TRY</span>
                <button class="favorite-btn" data-id="${product.id}">&#10084;</button>
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
         .carousel-container {
    margin: 20px 0;
    overflow: hidden;
    position: relative;
}

.carousel {
    display: flex;
    overflow: hidden;
    scroll-behavior: smooth;
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
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 2; 
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
    font-size: 20px;
    cursor: pointer;
    z-index: 1; 
}

.favorite-btn.favorited {
    color: blue;
}

        /* Responsive Design */
        @media (max-width: 1200px) {
            .carousel-item {
                flex: 0 0 calc(100% / 5); 
            }
        }

        @media (max-width: 992px) {
            .carousel-item {
                flex: 0 0 calc(100% / 4); 
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

      if (target.classList.contains("favorite-btn")) {
        const id = target.dataset.id;
        toggleFavorite(id, target);
      }

      if (target.classList.contains("carousel-control")) {
        const direction = target.classList.contains("left") ? -1 : 1;
        slideCarousel(direction);
      }
    });
  };

  const toggleFavorite = (id, button) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(id)) {
      favorites = favorites.filter((fav) => fav !== id);
      button.classList.remove("favorited");
    } else {
      favorites.push(id);
      button.classList.add("favorited");
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
