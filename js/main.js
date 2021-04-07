const mySwiper = new Swiper('.swiper-container', {
   loop: true,

   // Navigation arrows
   navigation: {
      nextEl: '.slider-button-next',
      prevEl: '.slider-button-prev',
   },
});

//cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
// const modalClose = document.querySelector('.modal-close');
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');
const longGoodsList = document.querySelector('.long-goods-list');
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');
const modalClearBtn = document.querySelector('.modal-clear__btn');

//получение данных с сервера=====================================
const getGoods = async () => {
   const result = await fetch('db/db.json');
   if (!result.ok) {
      throw 'Ошибка: ' + result.status
   }
   return await result.json();
};
//================================================================



const cart = {
   cartGoods: [],
   getCountCartGoods() {
      return this.cartGoods.length
   },
   countQuantity() {
      const count = this.cartGoods.reduce((sum, item) => {
         return sum + item.count
      }, 0)
      cartCount.textContent = count ? count : '';
   },
   clearCart() {
      this.cartGoods.length = 0;
      this.countQuantity();
      this.renderCart();
   },
   renderCart() {
      cartTableGoods.textContent = '';
      this.cartGoods.forEach(({ id, name, price, count }) => {
         const trGood = document.createElement('tr');
         trGood.className = 'cart-item';
         trGood.dataset.id = id;
         trGood.innerHTML = `
            <td>${name}</td>
            <td>${price}$</td>
            <td><button class="cart-btn-minus">-</button></td>
            <td>${count}</td>
            <td><button class="cart-btn-plus">+</button></td>
            <td>${price * count}$</td>
            <td><button class="cart-btn-delete">x</button></td>
         `;
         cartTableGoods.append(trGood);
      });

      const totalPrice = this.cartGoods.reduce((sum, item) => {
         return sum + item.price * item.count;
      }, 0);

      cardTableTotal.textContent = totalPrice + "$"
   },

   deleteGood(id) {
      this.cartGoods = this.cartGoods.filter(item => id !== item.id);
      this.countQuantity();
      this.renderCart();
   },

   minusGood(id) {
      for (const item of this.cartGoods) {
         if (item.id === id) {
            if (item.count <= 1) {
               this.deleteGood(id);
            } else {
               item.count--;
            }
            break;
         }
      }
      this.countQuantity();
      this.renderCart();
   },

   plusGood(id) {
      for (const item of this.cartGoods) {
         if (item.id === id) {
            item.count++;
            break;
         }
      }
      this.countQuantity();
      this.renderCart();
   },

   addCartGoods(id) {
      const goodItem = this.cartGoods.find(item => item.id === id);
      if (goodItem) {
         this.plusGood(id);
      } else {
         getGoods()
            .then(data => data.find(item => item.id === id))
            .then(({ id, name, price }) => {
               this.cartGoods.push({
                  id,
                  name,
                  price,
                  count: 1
               });
               this.countQuantity();
            });
      }
   },
}

modalClearBtn.addEventListener('click', () => {
   cart.clearCart();
});

document.body.addEventListener('click', event => {
   const addToCart = event.target.closest('.add-to-cart');

   if (addToCart) {
      cart.addCartGoods(addToCart.dataset.id);
   }
});

cartTableGoods.addEventListener('click', event => {
   const target = event.target;

   if (target.tagName === 'BUTTON') {
      const id = target.closest('.cart-item').dataset.id;
      if (target.classList.contains('cart-btn-delete')) {
         cart.deleteGood(id);
      };
      if (target.classList.contains('cart-btn-minus')) {
         cart.minusGood(id);
      }
      if (target.classList.contains('cart-btn-plus')) {
         cart.plusGood(id);
      }
   }
})

const openModal = () => {
   cart.renderCart();
   modalCart.classList.add('show');
};
const closeModal = () => {
   modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);
// modalClose.addEventListener('click', closeModal);

modalCart.addEventListener('click', (event) => {
   const target = event.target;
   if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
      closeModal();
   }
})

//scroll smooth
// фигурные скобки это обявление функции , необходимо прописать в html необходимый класс .scroll-link
/*
{
   const scrollLinks = document.querySelectorAll('a.scroll-link');

   for (let i = 0; i < scrollLinks.length; i++) {
      scrollLinks[i].addEventListener('click', (event) => {
         event.preventDefault(); //запрещает браузеру обрабатывать события
         const id = scrollLinks[i].getAttribute('href'); //находим атрибут href
         document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
         })
      });
   }
}
*/

{
   const scrollLinks = document.querySelectorAll('a.scroll-link');

   for (const scrollLink of scrollLinks) {
      scrollLink.addEventListener('click', (event) => {
         event.preventDefault(); //запрещает браузеру обрабатывать события
         const id = scrollLink.getAttribute('href'); //находим атрибут href
         document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
         });
      });
   };
}

// goods

//создаем карточку товара
const createCard = function (objCard) {
   const card = document.createElement('div'); //создаем новый элемент html
   card.className = 'col-lg-3 col-sm-6'; //добавляем к новосозданному элементу класс

   /*
   const label = objCard.label;
   const name = objCard.name;
   */

   const { label, name, img, description, id, price } = objCard;

   card.innerHTML = `
               <div class="goods-card">
                  ${label ? `<span class="label">${label}</span>` : ''}
                  <img class="goods-image" src="db/${img}" alt="${name}">
                  <h3 class="goods-title">${name}</h3>
                  <p class="goods-description">${description}</p>
                  <button class="button goods-card-btn add-to-cart" data-id="${id}">
                     <span class="button-price">$${price}</span>
                  </button>
               </div>
               `;

   return card;
};

//показать карточку товара на странице
const renderCards = function (data) {
   longGoodsList.textContent = ''; //удаляем весь контент из long-goods-list
   const cards = data.map(createCard);
   // cards.forEach(function (card) {
   //    longGoodsList.append(card);
   // }) или проще через 
   longGoodsList.append(...cards);
   document.body.classList.add('show-goods');
};

const showAll = (event) => {
   event.preventDefault();
   getGoods().then(renderCards);
};

viewAll.forEach((elem) => {
   elem.addEventListener('click', showAll);
});

// фильтр карточек

const filterCards = function (field, value) {
   getGoods()
      .then(data => data.filter(good => good[field] === value))
      .then(renderCards);
};

navigationLink.forEach((link) => {
   link.addEventListener('click', (event) => {
      event.preventDefault();
      const field = link.dataset.field; //получение дата-атрибута
      const value = link.textContent; //получение значения внтутри тега
      filterCards(field, value);
   })
});

showAcsessories.forEach(item => {
   item.addEventListener('click', event => {
      event.preventDefault();
      filterCards('category', 'Accessories');
   });
});
showClothing.forEach(item => {
   item.addEventListener('click', event => {
      event.preventDefault();
      filterCards('category', 'Clothing');
   });
});

//работа с сервером (MAMP PRO)

const modalForm = document.querySelector('.modal-form');

const postData = dataUser => fetch('server.php', {
   method: 'POST',
   body: dataUser,
});

const validForm = (formData) => {
   let valid = false;

   for (const [, value] of formData) {
      if (value.trim()) {
         valid = true;
      } else {
         valid = false;
         break;
      }
   }
   return valid;
}

modalForm.addEventListener('submit', event => {
   event.preventDefault();
   const formData = new FormData(modalForm);

   if (validForm(formData) && cart.getCountCartGoods()) {
      formData.append('cart', JSON.stringify(cart.cartGoods));

      postData(formData)
         .then(response => {
            if (!response.ok) {
               throw new Error(response.status);
            }
            alert('Ваш заказ успешно отпревлен, с Вами свяжутся в ближайшее время!');
            console.log(response.statusText);
         })
         .catch(err => {
            alert('К сожалению произошла ошибка, повторите попытку позже');
            console.log(err);
         })
         .finally(() => {
            closeModal();
            modalForm.reset();
            // cart.cartGoods.length = 0;
            cart.clearCart();
         });
   } else {
      if (!cart.getCountCartGoods()) {
         alert('Добавьте товары в корзину');
      }
      if (!validForm(formData)) {
         alert('Неправильно заполнены поля');
      }

   }

});
