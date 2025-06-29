let leftSide = document.querySelector('.left-side-content');
let dataArray = [];
let elementsInCart = new Array(9).fill(0);

fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    dataArray = data;
    showData();
    addToCart();
  });

function showData() {
  leftSide.innerHTML = '';
  showElementInCart();
  
  const isMobile = window.innerWidth < 400;

  dataArray.forEach((element, idx) => {
    const imageSrc = isMobile ? element.image.mobile : element.image.desktop;

    leftSide.innerHTML += `
      <div class="box">
        <div class="box-img">
          <img
            src="${imageSrc}"
            style="height: 250px"
            class="box-img"
          />
          <button class="add-to-cart" id=${idx}>
            <i><img src="assets/images/icon-add-to-cart.svg" alt=""></i>
            Add To Cart
          </button>
        </div>
        <div class="box-content">
          <h3>${element.name}</h3>
          <h2>${element.category}</h2>
          <p class="price">$${element.price.toFixed(2)}</p>
        </div>
      </div>`;
  });
}
window.addEventListener('resize', () => {
  showData();  
  addToCart(); 
});

function addToCart() {
  let addToCartBtn = document.querySelectorAll('.add-to-cart');

  addToCartBtn.forEach((element, idx) => {
    if (elementsInCart[idx] > 0) {
      element.innerHTML = `
        <i class="fa-solid fa-minus minus"></i>
        ${elementsInCart[idx]}
        <i class="fa-solid fa-plus plus"></i>`;
      element.classList.add('active');
    } else {
      element.innerHTML = `<i><img src="assets/images/icon-add-to-cart.svg" alt=""></i>Add To Cart`;
      element.classList.remove('active');
    }

    let minusBtn = element.querySelector('.minus');
    if (minusBtn) {
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (elementsInCart[idx] > 0) {
          elementsInCart[idx] -= 1;
          addToCart();
          showElementInCart();
        }
      });
    }

    let plusBtn = element.querySelector('.plus');
    if (plusBtn) {
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elementsInCart[idx] += 1;
        addToCart();
        showElementInCart();
      });
    }

    element.addEventListener('click', () => {
      if (elementsInCart[idx] === 0) {
        elementsInCart[idx] = 1;
        addToCart();
        showElementInCart();
      }
    });
  });
}

function showElementInCart() {
  const rightSide = document.querySelector('.right-side');
  const divTotal = document.querySelector('.total-order');
  const headerCart = document.querySelector('.header-cart');

  document.querySelectorAll('.element-selected').forEach((e) => e.remove());

  let totalPrice = 0;
  let numberOfElement = 0;
  elementsInCart.forEach((element, idx) => {
    if (element > 0) {
      numberOfElement += 1;
      totalPrice += dataArray[idx].price * element;

      const item = document.createElement('div');
      item.className = 'element-selected';
      item.innerHTML = `
        <h1>${dataArray[idx].name}</h1>
        <div class="price">
          <p>${element}x</p>
          <p>@$${dataArray[idx].price.toFixed(2)}</p>
          <p>$${(element * dataArray[idx].price).toFixed(2)}</p>
        </div>
        <i class="fa-solid fa-xmark"></i>`;

      item.querySelector('.fa-xmark').addEventListener('click', () => {
        elementsInCart[idx] = 0;
        addToCart();
        showElementInCart();
      });

      rightSide.insertBefore(item, divTotal);
    }
    toggleCartView();
  });

  headerCart.innerHTML = `Your Cart (${numberOfElement})`;
  divTotal.innerHTML = `
    <p>Order Total</p>
    <p class="total-price">$${totalPrice.toFixed(2)}</p>`;
}

function addElementToConfirm() {
  const alertContent = document.querySelector('.alert-content');
  const totalSummary = document.querySelector('.total-summary');

  document.querySelectorAll('.alert-item').forEach((e) => e.remove());

  let total = 0;

  elementsInCart.forEach((qty, idx) => {
    if (qty > 0) {
      const item = document.createElement('div');
      item.className = 'alert-item';
      const price = dataArray[idx].price;
      total += qty * price;

      item.innerHTML = `
        <div class="img-content">
          <img src="${dataArray[idx].image.thumbnail || dataArray[idx].image.desktop}" alt="" />
          <div class="content">
            <h3>${dataArray[idx].name}</h3>
            <p>${qty}x</p>
            <p>@$${price.toFixed(2)}</p>
          </div>
        </div>
        <p class="total-price">$${(qty * price).toFixed(2)}</p>`;

      alertContent.insertBefore(item, totalSummary);
    }
  });

  totalSummary.innerHTML = `
    <p>Order Total</p>
    <p>$${total.toFixed(2)}</p>`;
}

function confirmOrder() {
  const confirmBtn = document.querySelector('.confirm-btn');
  const alertBox = document.querySelector('.alert');
  const overlay = document.querySelector('.overlay');
  const startNewOrderBtn = document.querySelector('.start-new');

  confirmBtn.addEventListener('click', () => {
    if (elementsInCart.some(qty => qty > 0)) {
      addElementToConfirm();
      alertBox.classList.add('active');
      overlay.classList.add('active');
    }
  });

  startNewOrderBtn.addEventListener('click', () => {
    elementsInCart.fill(0);
    addToCart();
    showElementInCart();
    alertBox.classList.remove('active');
    overlay.classList.remove('active');
  });
}

function toggleCartView() {
  const rightSide = document.querySelector(".right-side");
  const rightSideEmpty = document.querySelector(".right-side-empty");

  const isEmpty = elementsInCart.every(qty => qty === 0);

  if (isEmpty) {
    rightSide.classList.remove("active");
    rightSideEmpty.classList.add("active");
  } else {
    rightSide.classList.add("active");
    rightSideEmpty.classList.remove("active");
  }
}

confirmOrder();
