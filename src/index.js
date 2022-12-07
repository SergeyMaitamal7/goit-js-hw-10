import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(findCountry, DEBOUNCE_DELAY));

function findCountry() {
  const nameCountryInput = refs.searchBox.value.trim();
  if (nameCountryInput === '') {
    console.log('write the country');
  }

  fetchCountries(nameCountryInput)
    .then(data => {
      console.dir(data);

      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';

      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          createMarkupManyCountry(data)
        );
      } else if (data.length === 1) {
        refs.countryInfo.insertAdjacentHTML(
          'beforeend',
          createMarkupOneCountry(data)
        );
      } else {
        return;
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = ' ';
      refs.countryList.innerHTML = ' ';
    });
}

function createMarkupManyCountry(arr) {
  return arr
    .map(
      ({ flags, name }) =>
        `<li>
        <img  src="${flags.svg}" 
      alt="flag ${name.official}"  width="30">
      <span >${name.common}</span></li>`
    )
    .join('');
}

function createMarkupOneCountry(arr) {
  return arr
    .map(
      ({ flags, name, capital, population, languages }) =>
        ` <div>
      <img src="${flags.svg}" alt='flag ${name.official}' width="250" />
      <h2>${name.common}</h2>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${languages.aym}, ${languages.que}, ${languages.spa}</p>
  </div>`
    )
    .join('');
}
