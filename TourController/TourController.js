const myTemplate = document.createElement('template');
const sortingTypes = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  LENGTH_ASC: 'length_asc',
  LENGTH_DESC: 'length_desc',
};
const years = ['2017', '2018'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
myTemplate.innerHTML=`
  <style>
  @import "./TourController/TourController.css";
  @import "./TourController/Selectors.css";
  </style>
  <div id="tour-controller-template">
    <div class="selector-container">
      <div id="sortSelector" class="selector-container__selector">
        <div class="selector-container__selector__title">
          Sort by
        </div>
        <select>
          <option value="" disabled selected hidden>Please Choose...</option>
          <option value=${sortingTypes.PRICE_DESC}>highest price</option>
          <option value=${sortingTypes.PRICE_ASC}>lowest price</option>
          <option value=${sortingTypes.LENGTH_DESC}>longest tour</option>
          <option value=${sortingTypes.LENGTH_ASC}>shortest tour</option>
        </select>
      </div>
      <div id="filterSelector" class="selector-container__selector">
        <div class="selector-container__selector__title">
          Filter by
        </div>
        <select id="monthSelector">
        <option value="" disabled selected hidden>Departure Date</option>
        </select>
      </div>
    </div>
    <ul id="tourList" class="tour-list">
    </ul>
  </div>
  `;

/**
 * When filter by option is selected
 * @param {array} tours The tours object.
 * @param {string} month Month selected.
 * @param {string} year Year selected.
 * @return {array} The modified tours array.
 */
function filterByMonth(tours, month, year) {
  return tours.filter((tour) => tour.dates.some((date) =>
    (date.start.split('-')[0]=== year &&
    parseInt(date.start.split('-')[1].replace(/^0+/, '')) == month)));
}

/**
 * Sorts by price low first
 * @param {array} tours The tours array.
 */
function sortByPriceAsc(tours) {
  tours.sort((a, b) => {
    return Math.min(...a.dates.map((date) => date.eur)) -
    Math.min(...b.dates.map((date) => date.eur));
  });
}

/**
 * Sorts by price high first
 * @param {array} tours The tours array.
 */
function sortByPriceDesc(tours) {
  tours.sort((a, b) => {
    if (!a.dates.length) return 1;
    if (!b.dates.length) return -1;
    if (a === b) return 0;
    return Math.min(...b.dates.map((date) => date.eur)) -
    Math.min(...a.dates.map((date) => date.eur));
  });
}

/**
 * Sorts by tour length short first
 * @param {array} tours The tours array.
 */
function sortyByLengthAsc(tours) {
  tours.sort((a, b) => {
    return a.length - b.length;
  });
}

/**
 * Sorts by tour length long first
 * @param {array} tours The tours array.
 */
function sortyByLengthDesc(tours) {
  tours.sort((a, b) => {
    return b.length - a.length;
  });
}

/**
 * Fills the rating star component
 * @param {int} rating Rating of the tour.
 * @return {string} The HTML code to add the stars to the DOM.
 */
function getStars(rating) {
  rating = Math.round(rating * 2) / 2;
  const output = [];
  for (let i = rating; i >= 1; i--) {
    output.push(
        '<i class="fa-solid fa-star" aria-hidden="true"' +
        'style="color: gold;"></i>&nbsp;');
    if (i == .5) {
      output.push(
          '<i class="fa-regular fa-star-half-stroke" aria-hidden="true"' +
          'style="color: gold;"></i>&nbsp;',
      );
    }
  }
  for (let i = (5 - rating); i >= 1; i--) {
    output.push(
        '<class="fa-regular fa-star" aria-hidden="true"' +
        'style="color: gold;"></i>&nbsp;',
    );
  }
  return output.join('');
}

/**
 * Parses the tour dates to a more friendly format
 * @param {string} inputDate Tour date from the API.
 * @return {string} Tour date ready to use.
 */
function getDates(inputDate) {
  const date = new Date(inputDate);
  date.toDateString();
  const dateArray = date.toDateString().split(' ').slice(1);
  const temp = dateArray[0];
  dateArray[0] = dateArray[1];
  dateArray[1] = temp;
  return dateArray.join(' ');
}

/**
 * Sorts
 * @param {object} tour Single tour object.
 * @return {object} HTML of the tour li element.
 */
function createTourListElement(tour) {
  const minOfferAvailable = tour.dates.filter((offer) =>
    offer.availability).sort((a, b) => a.eur - b.eur);
  const orderedByDates = tour.dates.filter((date) =>
    date.availability).sort((a, b) => a.start - b.start);
  const filteredSlots = orderedByDates.map((item) =>
    `<li class="tour-list__item__container__text-container__bottom__slots__item">
      <span class="tour-list__item__container__text-container__bottom__slots__item__dates">
        ${getDates(item.start)}
      </span>
      <span class="tour-list__item__container__text-container__bottom__slots__item__availability
        ${item.availability < 5 ? '-less-available' : ''}">
        ${item.availability > 10 ? '10+' : item.availability} spaces left
      </span>
    </li>`).join('');
  const li = document.createElement('LI');

  li.innerHTML = `
    <div class="tour-list__item__container">
      <img class="tour-list__item__container__img" src=${tour.images[0]?.url}
        onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1658951279624-196e3a907f45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60';"    
        alt="Tour image" 
      >
      <div class="tour-list__item__container__text-container">
        <div class="tour-list__item__container__text-container__top">
          <div class="tour-list__item__container__text-container__top__title">
            ${tour.name} (${tour.length} days)
          </div>
          <div class="tour-list__item__container__text-container__top__reviews">
            <div class="tour-list__item__container__text-container__top__reviews__stars">
            ${getStars(tour.rating)}
            </div>
            <div class="tour-list__item__container__text-container__top__reviews__number">
              ${tour.reviews} reviews
            </div>
          </div>
          <div class="tour-list__item__container__text-container__top__description">
            ${tour.description}
          </div>
          <ul class="tour-list__item__container__text-container__top__info">
            <div class="tour-list__item__container__text-container__top__info__item">
              <span class="tour-list__item__container__text-container__top__info__item__title">
                DESTINATIONS
              </span>
              <span class="tour-list__item__container__text-container__top__info__item__content">
                ${tour.cities.slice(0, 3).map((city) => city.name).join(', ')}
                <a class="see-more">+${tour.cities.length - 3} more</a>
              </span>
            </div>
            <div class="tour-list__item__container__text-container__top__info__item">
              <span class="tour-list__item__container__text-container__top__info__item__title">
                STARTS/ENDS IN
              </span>
              <span class="tour-list__item__container__text-container__top__info__item__content">
                ${tour.cities[0].name}/${tour.cities[tour.cities.length - 1].name}
              </span>
            </div>
            <div class="tour-list__item__container__text-container__top__info__item">
              <span class="tour-list__item__container__text-container__top__info__item__title">
                OPERATOR
              </span>
              <span class="tour-list__item__container__text-container__top__info__item__content">
                ${tour.operator_name}
              </span>
            </div>
          </ul>
        </div>
        <div class="tour-list__item__container__text-container__bottom">
          <div class="tour-list__item__container__text-container__bottom__duration-price">
            <div class="tour-list__item__container__text-container__bottom__duration-price__duration">
              <span class="tour-list__item__container__text-container__bottom__duration-price__duration__title">
                DURATION
              </span>
              <span class="tour-list__item__container__text-container__bottom__duration-price__duration__content">
              ${tour.length} days
              </span>
            </div>
            ${minOfferAvailable[0]?.eur ?
            `<div class="tour-list__item__container__text-container__bottom__duration-price__price">
              <span class="tour-list__item__container__text-container__bottom__duration-price__price__title">
                FROM
              </span>
              <span class="tour-list__item__container__text-container__bottom__duration-price__price__content">
                &euro;${minOfferAvailable[0]?.eur}
              </span>
            </div>`: ``
            }
          </div>
          <ul class="tour-list__item__container__text-container__bottom__slots">
            ${filteredSlots}
          </ul>
          <button class="tour-list__item__container__text-container__bottom__button">
            View Tour
          </button>
        </div>
      </div>
    </div>`;

  li.className = 'tour-list__item';
  return li;
}

/**
 * Class
 */
class TourController extends HTMLElement {
  /**
   * Creates and initializes an object instance of the class
  */
  constructor() {
    super();
    this.tourList = [];
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(myTemplate.content.cloneNode(true));
  }
  /**
   * Called once each time the web component is attached to the DOM
  */
  connectedCallback() {
    const filtering = this.shadowRoot.getElementById('monthSelector');
    years.forEach((year) => {
      monthNames.forEach((monthName, i) => {
        const monthElem = document.createElement('option');
        monthElem.value = [i + 1, year];
        monthElem.textContent = monthName + ' ' + year;
        filtering.append(monthElem);
      });
    });

    fetch(`https://mocki.io/v1/11356aa2-6371-41d4-9d49-77a5e9e9924f`)
        .then((response) => response.text())
        .then((responseText) => {
          const list = JSON.parse(responseText);
          this.originalList = list;
          this.tourList = list;
          this.render();
        })
        .catch((error) => {
          console.error(error);
        });
  }

  /**
 * Our render function
 */
  render() {
    const sorting = this.shadowRoot.getElementById('sortSelector');
    const filtering = this.shadowRoot.getElementById('monthSelector');
    filtering.addEventListener('change', (e) => {
      this.tourList = this.originalList;
      const valueToArray = e.composedPath()[0].value.split(',');
      const month = valueToArray[0];
      const year = valueToArray[1];
      this.tourList = filterByMonth(this.tourList, month, year);
      this.render();
    });
    sorting.addEventListener('change', (e) => {
      switch (e.composedPath()[0].value) {
        case sortingTypes.PRICE_DESC:
          sortByPriceDesc(this.tourList);
          this.render();
          break;
        case sortingTypes.PRICE_ASC:
          sortByPriceAsc(this.tourList);
          this.render();
          break;
        case sortingTypes.LENGTH_DESC:
          sortyByLengthDesc(this.tourList);
          this.render();
          break;
        case sortingTypes.LENGTH_ASC:
          sortyByLengthAsc(this.tourList);
          this.render();
          break;
        default:
          break;
      }
    });

    const ulElement = this.shadowRoot.querySelector('#tourList');
    ulElement.innerHTML = '';
    this.tourList.forEach((tour) => {
      const li = createTourListElement(tour);
      ulElement.appendChild(li);
    });
  }
}

customElements.define('tour-controller', TourController);
