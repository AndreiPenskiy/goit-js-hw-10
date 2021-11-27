import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');




input.addEventListener('input', debounce(inputCheck, DEBOUNCE_DELAY));

function inputCheck() {
    clearAll();
    if (input.value.trim() === '') {
        return clearAll()
    };

    fetchCountries(input.value.trim())
        .then((countries) => {
             if (countries.length > 10) {
               return Notify.info("Too many matches found. Please enter a more specific name.")
            }
            if (countries.length >= 2 && countries.length <= 10) {
                renderSomeCountries(countries);
            }
             else {
                renderCountry(countries);
             }
        })
        .catch(error => { Notify.failure("Oops, there is no country with that name") })
}
 
function clearAll() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

//несколько стран
function renderSomeCountries(countries) {
    const render = countries.map(
        ({ flags, name }) =>
      `<li class="country-list__item">
             <img class="country-list__img" src="${flags.svg}" alt="" width="50" >
              <p class="country-list__name">${name.official}</p>
      </li>`
        ).join('');
         countryList.insertAdjacentHTML('beforeend', render);
}

//одна страна
function renderCountry(countries) {
    const render = countries.map(
        ({ flags, name, capital, population, languages }) => 
            `<div class="country-info__container">
              <img class="country-info__img" src="${flags.svg}" alt="" width="40" height="40" >
              <p class="country-info__name">${name.official}</p>
            </div>
              <p class="country-info__item"><span class="country-info__text">Capital:</span>${capital[0]}</p>
              <p class="country-info__item"><span class="country-info__text">Population:</span>${population}</p>
              <p class="country-info__item"><span class="country-info__text">Languages:</span>${Object.values(languages)}</p>`
        ).join('');
         countryInfo.insertAdjacentHTML('beforeend', render);
};

