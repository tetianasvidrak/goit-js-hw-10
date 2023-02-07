import debounce from 'lodash.debounce';
import './css/styles.css';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';

const inputRef = document.getElementById('search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

const clearData = () => {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
};

const onRenderData = countries => {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length >= 2 && countries.length <= 10) {
    const readyToRender = countries.map(country => {
      return `<li><img src=${country.flags.svg} alt=${country.flags.alt}/><span>${country.name.official}</span></li>`;
    });
    clearData();
    countryListRef.insertAdjacentHTML('beforeend', readyToRender.join(''));
  } else {
    const readyToRender = countries.map(country => {
      return `<div>
      <div class="country-info__header">
      <img src=${country.flags.svg} alt=${country.flags.alt}/>
      <span class="title">${country.name.official}</span>
      </div>
      <p><span>Capital:</span>${country.capital}</p>
      <p><span>Population:</span>${country.population}</p>
      <p><span>Languages:</span>${Object.values(country.languages).map(
        language => language
      )}</p>
      </div>`;
    });
    clearData();
    countryInfoRef.insertAdjacentHTML('beforeend', readyToRender.join(''));
  }
};

const onInputHandler = event => {
  const countryName = event.target.value.trim();
  if (!countryName) {
    clearData();
    return;
  }
  fetchCountries(countryName)
    .then(response => onRenderData(response))
    .catch(e =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
};

inputRef.addEventListener('input', debounce(onInputHandler, DEBOUNCE_DELAY));
