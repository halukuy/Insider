# Product Carousel
This project implements a responsive carousel feature that meets specific requirements, such as running only on product pages, storing user preferences in local storage, and offering smooth interactions.
![first](https://github.com/user-attachments/assets/b3ecc850-c03a-4e36-9a34-e4cc04c70334)
![second](https://github.com/user-attachments/assets/16885b31-ca2b-475f-a6b4-e5629c3bf1d0)
![third](https://github.com/user-attachments/assets/8f5f6663-3757-430c-8d88-ad81e7c5de13)

## Features

1. **The code runs only on the product pages and is appended after the element with the `.product-detail` class:**
   - The script first checks if `.product-detail` exists on the page. If it does not, it creates it and appends the carousel structure after it.
   - Code:
     ```javascript
     let productDetail = document.querySelector(".product-detail");
     if (!productDetail) {
       productDetail = document.createElement("div");
       productDetail.classList.add("product-detail");
       document.body.appendChild(productDetail);
     }
     ```

2. **Users can view six and a half products, and by clicking the arrow buttons, the carousel smoothly slides one product to the right or left:**
   - The carousel items are displayed using flex layout, and the sliding functionality is implemented using the `slideCarousel` function.
   - Code:
     ```javascript
     .carousel-item {
       flex: 0 0 calc(100% / 6.5);
     }
     ```
     Arrow button click event:
     ```javascript
     if (target.classList.contains("carousel-control")) {
       const direction = target.classList.contains("left") ? -1 : 1;
       slideCarousel(direction);
     }
     ```

3. **Clicking on a product opens the respective product page in a new tab:**
   - Each product in the carousel is wrapped in an `<a>` tag with the `target="_blank"` attribute.
   - Code:
     ```javascript
     <a href="${product.url}" target="_blank">
       <img src="${product.img}" alt="${product.name}" />
     </a>
     ```

4. **Clicking on the heart icon fills it with a blue color, and this preference is stored in local storage:**
   - The heart icon toggles its filled state when clicked and stores the state in local storage.
   - Code:
     ```javascript
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
     ```

5. **Upon running the code for the second time after refreshing the page, it retrieves the product list from local storage and highlights favorited products:**
   - The `fetchProducts` function checks if the products are in local storage. If they are, it skips the fetch request and directly renders the carousel, highlighting the favorited products.
   - Code:
     ```javascript
     const storedProducts = JSON.parse(localStorage.getItem("products"));
     if (storedProducts) {
       renderCarousel(storedProducts);
     } else {
       // Fetch products and store in localStorage
     }
     ```
     Highlighting favorites:
     ```javascript
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
     ```

6. **The design is responsive and suitable for all platforms (mobile, tablet, desktop). The number of products displayed varies according to the screen resolution:**
   - The carousel layout adjusts using media queries, ensuring responsiveness across different screen sizes.
   - Code:
     ```css
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
     ```

7. **The project is developed using only JavaScript and jQuery. No third-party libraries like Swiper or Bootstrap are used:**


## How to Use

1. **Open the Product Page**: Navigate to the product page where you want the carousel to appear.

2. **Open Chrome Developer Tools**:  
   - Right-click and select **Inspect** or press `Ctrl + Shift + I` (Windows/Linux) or `Cmd + Option + I` (Mac).
   - Go to the **Console** tab.

3. **Paste the JavaScript Code**: Copy the JavaScript code and paste it into the **Console** tab.

4. **Run the Code**: After pasting the code, press **Enter** to execute it.

5. **Interact with the Carousel**:  
   - The carousel will automatically load on the product page.
   - Users can navigate through the carousel by clicking the arrow buttons.
   - Users can favorite products and visit the respective product pages.
