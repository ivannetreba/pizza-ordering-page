// Constants
const ASIDE_ICON_ID = 'aside-icon';
const ICON_CLOSE_ID = 'icon-close';
const ASIDE_ID = 'aside';
const ASIDE_SHADOW_ID = 'aside-shadow';
const MINUS_ID = 'minus';
const PLUS_ID = 'plus';
const QUANTITY_FIELD_ID = 'quantityField';
const FORM_ADD_TO_CART_ID = 'form-addtocart';
const CART_CLASS = 'cart';
const BADGE_CLASS = 'badge';
const CONTAINER_CLASS = 'container';
const CART_BOX_CLASS = 'cart__box';
const CART_TITLE_CLASS = 'cart__title';
const CART_BODY_CLASS = 'cart__body';
const DELETE_BTN_CLASS = 'deleteBtn';

// Selectors
const asideIcon = document.getElementById(ASIDE_ICON_ID);
const iconClose = document.getElementById(ICON_CLOSE_ID);
const aside = document.getElementById(ASIDE_ID);
const asideShadow = document.getElementById(ASIDE_SHADOW_ID);
const minus = document.getElementById(MINUS_ID);
const plus = document.getElementById(PLUS_ID);
const quantityField = document.getElementById(QUANTITY_FIELD_ID);
const formAddToCart = document.getElementById(FORM_ADD_TO_CART_ID);
const cart = document.querySelector(`.${CART_CLASS}`);
const badge = document.querySelector(`.${BADGE_CLASS}`);
const container = document.querySelector(`.${CONTAINER_CLASS}`);
const thumbnail = document.querySelectorAll('.thumbnail');
const thumbnailBorder = document.querySelectorAll('.thumbnail-border');
const productImg = document.querySelector('.product__img');
const arrow = document.querySelectorAll('.arrow');
const imageContainer = document.querySelector('.image-container')
const productImages = document.querySelector('.product__images');

// Other variables
let count = 1;
let clickCounter = 1;
let allProductsInCart = [];
let quantityProducts = allProductsInCart.length;
let cartBox;
const pizzas = [
  {
    id: 1,
    name: "Маргарита",
    description: "Настоящий вкус Италии в каждом куске! Классическая пицца Маргарита с нежным томатным соусом, богатой моцареллой и ароматным базиликом. Эта пицца представляет собой гармоничное сочетание цветов итальянского флага. Идеальный выбор для ценителей простоты и изысканности. Основные ингредиенты: Томатный соус, моцарелла, свежий базилик.",
    src: "images/1-pizza.png",
    price: 500
  },
  {
    id: 2,
    name: "Пепперони",
    description: "Пицца Пепперони - это пикантное удовольствие в американском стиле. Насыщенная моцареллой и острой сушеной колбаской пепперони на тонком тесте с томатным соусом. Этот выбор подходит для любителей острых вкусов и является фаворитом на любой вечеринке. Основные ингредиенты: Томатный соус, моцарелла, пепперони.",
    src: "images/2-pizza.png",
    price: 600
  },
  {
    id: 3,
    name: "Гавайская",
    description: "Экзотическая гавайская пицца с уникальным сочетанием ветчины и сладких ананасов на фоне томатного соуса и моцареллы. Сладкий и соленый вкусы гармонично переплетаются, создавая неповторимый гастрономический опыт. Идеальный выбор для искателей новых вкусовых ощущений. Основные ингредиенты: Томатный соус, моцарелла, ветчина, ананасы.",
    src: "images/3-pizza.png",
    price: 650
  },
  {
    id: 4,
    name: "Четыре сыра",
    description: "Настоящий рай для любителей сыра. Сочетание мягкой моцареллы, пикантного пармезана, ароматной горгонзолы и камамбера создает богатый и насыщенный вкус. Этот выбор идеально подходит для гурманов, предпочитающих сырные деликатесы. Основные ингредиенты: Моцарелла, пармезан, горгонзола, камамбера.",
    src: "images/4-pizza.png",
    price: 700
  },
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initQuantityField();
  highlightThumbnailDefault();
  countTotalPrice();
});
asideIcon.addEventListener('click', toggleAside);
iconClose.addEventListener('click', closeAside);
minus.addEventListener('click', decreaseCount);
plus.addEventListener('click', increaseCount);
cart.addEventListener('click', toggleCartBoxVisibility);
formAddToCart.addEventListener('submit', addToCart);
productImg.addEventListener('click', bigPicture);

// Coun total price
const pizzaSizes = [
  {
    size: "Большая",
    rate: 1.2
  },
  {
    size: "Средняя",
    rate: 1.1
  },
  {
    size: "Маленькая",
    rate: 1
  },
]

const productTitle = document.querySelector('.product__title');
const productText = document.querySelector('.product__text');
const dropdownPizzaSize = document.getElementById('dropdownPizzaSize');
const dropdownDoughThickness = document.getElementById('dropdownDoughThickness');
const totalPrice = document.getElementById('totalPrice');
let totalPriceValue = 0;
let pizzaIndex = 0;
let pizzaSize = pizzaSizes[dropdownPizzaSize.value].size; 
let pizzaSizeRate = pizzaSizes[dropdownPizzaSize.value].rate;
const toppingsCheckbox = document.querySelectorAll("input[type='checkbox']");
let toppingsPrice = 0;
let toppingsInOrder = [];
let doughThickness = "Толстый корж";
//let productInCart = {};
let allProductsInCartHTML = [];

dropdownPizzaSize.addEventListener('change', changePizzaSize);
toppingsCheckbox.forEach(chexbox => {
  chexbox.addEventListener("change", changeToppingsCheckboxes);})
dropdownDoughThickness.addEventListener('change', changeDoughThickness);

function submitCheckout() {
  allProductsInCart = [];
  allProductsInCartHTML = [];
  quantityProducts = 0;
  showProductInCart();
  showBadgeQuantity();
  location.reload();
}

function countTotalPrice() {
  totalPriceValue = ((pizzas[pizzaIndex].price * pizzaSizeRate + toppingsPrice) * count).toFixed(0);
  totalPrice.innerText = totalPriceValue;
} 

function changePizzaSize() {
  pizzaSize = pizzaSizes[dropdownPizzaSize.value].size; 
  pizzaSizeRate = pizzaSizes[dropdownPizzaSize.value].rate;
  countTotalPrice()
}

function changeDoughThickness() {
  doughThickness = dropdownDoughThickness.value;
}

function changeToppingsCheckboxes(e) {
  if (e.target.checked) {
    toppingsPrice += parseFloat(e.target.dataset.price);
    toppingsInOrder.push(e.target.value);
  } else {
    toppingsPrice -= parseFloat(e.target.dataset.price);
    toppingsInOrder = toppingsInOrder.filter(topping => topping !== e.target.value);
  }
  countTotalPrice();
}


// Open and close aside menu
function toggleAside() {
  aside.classList.toggle('aside-show');
  asideShadow.classList.toggle('aside-show');

  document.addEventListener('click', (e) => {
    const clickedArrea = e.target;
    if (clickedArrea === asideShadow) {
      closeAside();
    }
  })
}

function closeAside() {
  aside.classList.remove('aside-show');
  asideShadow.classList.remove('aside-show');
}

function initQuantityField() {
  quantityField.value = count;
}

// Form work
function decreaseCount() {
  count = Math.max(count - 1, 1);
  quantityField.value = count;
  countTotalPrice();
}

function increaseCount() {
  count = Math.min(count + 1, 10);
  quantityField.value = count;
  countTotalPrice();
}

function addToCart(e) {
  e.preventDefault();
  if (count > 0) {
    const title = productTitle.textContent;
    const productInCart = {
      id: pizzaIndex + 1, 
      title, 
      count, 
      totalPriceValue, 
      pizzaSize, 
      doughThickness, 
      toppingsInOrder: [...toppingsInOrder], };
    quantityProducts++;
    allProductsInCart.push(productInCart);
    showBadgeQuantity();
    showProductInCart();
  }
}

// Cart work
function showBadgeQuantity() {
  badge.classList.toggle('show-badge', quantityProducts > 0);
  badge.innerText = quantityProducts;
}

function toggleCartBoxVisibility() {
  if (!cartBox) {
    createCartBox();
  }
  cartBox.classList.toggle('cart-box__show');
}

function createCartBox() {
  cartBox = document.createElement('div');
  cartBox.classList.add(CART_BOX_CLASS);
  cartBox.innerHTML = `
    <h3 class="${CART_TITLE_CLASS}">Cart</h3>
    <div class="${CART_BODY_CLASS}"></div>`;
  container.appendChild(cartBox);
  showProductInCart();
}

function showProductInCart() {
  const cartBody = document.querySelector(`.${CART_BODY_CLASS}`);
  if (quantityProducts > 0) {
    cartBody.innerHTML = makeHTMLProductsInCart().join('');
    const deleteBtn = document.querySelectorAll(`.${DELETE_BTN_CLASS}`);
    deleteBtn.forEach((d) => {
      d.addEventListener('click', deleteProductInCart);
    });
    const btnCheckout = document.querySelector('.btn--checkout');
    btnCheckout.addEventListener('click', submitCheckout);
  } else {
    cartBody.innerHTML = `<p class="cart__empty">Your cart is empty.</p>`;
  }
}

function makeHTMLProductsInCart() {
  allProductsInCartHTML = allProductsInCart.map((p, i) => `
    <div class="product-in-cart">
      <img class="product-in-cart-img" src="/images/${p.id}-pizza.png" alt="">
      <div class="cartbox__order">
        <p class="bold">${p.title}, ${p.count}, ${p.totalPriceValue} руб.</p>
        <p>${p.pizzaSize}, ${p.doughThickness}</p> 
        <p>${p.toppingsInOrder.join(", ")}</p>
      </div>
      <div class="${DELETE_BTN_CLASS}" data-index="${i}">
        <img src="../images/icon-delete.svg" alt="">
      </div>
    </div>`
  );
  allProductsInCartHTML.push(`<button type="submit" class="btn product__add btn--checkout">Заказать</button>`);
  return allProductsInCartHTML;
}

function deleteProductInCart(e) {
  const clickedElement = e.currentTarget;
  const elementIndex = clickedElement.dataset.index;
  allProductsInCart.splice(elementIndex, 1);
  quantityProducts--;
  //toggleCartBoxVisibility(cartBox);
  showBadgeQuantity();
  showProductInCart();
}

// Pick a photo
thumbnail.forEach((th, i) => {
  th.addEventListener('click', e => {
    const thClicked = e.currentTarget; 
    productImg.src = `images/${i + 1}-pizza.png`;
    pizzaIndex = i;
    highlightThumbnail(i);
    fillTitleText(i);
    countTotalPrice()
  })
})

function highlightThumbnail(iClicked) {
  thumbnailBorder.forEach((thB, i) => {
    const child = thB.querySelector('.thumbnail');
    if (i === iClicked) {
      thB.classList.add('thumbnail-picked-border');
      child.classList.add('thumbnail-picked');
    } else {
      thB.classList.remove('thumbnail-picked-border');
      child.classList.remove('thumbnail-picked');
    }
  });
}

function highlightThumbnailDefault() {
  const highlightThumbnail = thumbnail[0];
  const highlightThumbnailBorder = thumbnailBorder[0];
  highlightThumbnail.classList.add('thumbnail-picked');
  highlightThumbnailBorder.classList.add('thumbnail-picked-border');
}

function fillTitleText(index) {
  productTitle.innerText = pizzas[index].name;
  productText.innerText = pizzas[index].description;
}

// Make picture bigger
function bigPicture() {
  if (window.innerWidth >= 1160) {
    imageContainer.classList.add('big-picture');
    asideShadow.classList.add('aside-show');
    productImages.classList.add('big-picture');

    document.addEventListener('click', (e) => {
      const clickedArrea = e.target;
      if (clickedArrea === asideShadow) {
        imageContainer.classList.remove('big-picture');
        asideShadow.classList.remove('aside-show');
        productImages.classList.remove('big-picture');
      }
    })
  }  
}

// Slider using arrow
arrow.forEach(arr => {
  arr.addEventListener('click', e => {
    const clickeArrow = e.target;
    if (clickeArrow.classList.contains("next")) {
      clickCounter++;
    } else if (clickeArrow.classList.contains("previous")) {
      clickCounter--;
    }
    slideImages();
  })
})

function slideImages() {
  clickCounter = (clickCounter < 1) ? 4 : clickCounter;
  clickCounter = (clickCounter > 4) ? 1 : clickCounter;
  productImg.src = `images/${clickCounter}-pizza.png`;
  fillTitleText(clickCounter-1);
}





