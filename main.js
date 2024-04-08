// -_-

// global declarations
let container = document.querySelector('.container');
let initialSelect = document.createElement('select');

class Pokemon {
  constructor(name, imageUrl, types, weight, height, stats) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
  }

  //   Compare stats and color the "winner" between two pokemon
  static ComparePokemon(pokemon1, pokemon2) {
    console.log(pokemon1, pokemon2);
  }
}

let getData = async (url) => {
  let response = await axios.get(url);
  return response.data;
};

let renderSelect = async (pokeListPromise) => {
  let pokeListItitial = await pokeListPromise;
  let pokeList = pokeListItitial.results;
  let option = document.createElement('option');
  option.innerText = 'Choose a pokemon';
  option.value = false;
  initialSelect.append(option);
  pokeList.forEach((pokemon) => {
    let option = document.createElement('option');
    option.innerText = pokemon.name;
    option.value = pokemon.url;
    option.style.textTransform = 'capitalize';
    initialSelect.append(option);
  });
  initialSelect.style.textTransform = 'capitalize';

  container.append(initialSelect);
};

let initial = getData('https://pokeapi.co/api/v2/pokemon?limit=151');

let renderPokemon = async (pokemonURL) => {
  let pokemon = await getData(pokemonURL);
  console.log(pokemon, pokemon.forms[0].name);
};

initialSelect.addEventListener('change', () => {
  let selected = initialSelect.value;
  if (selected != 'false') {
    renderPokemon(selected);
  } else {
    alert('no poke choosen...:(');
  }
});

renderSelect(initial);
