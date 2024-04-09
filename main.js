// -_-

// global declarations
let container = document.querySelector('.container');
let pokemonContainer = document.querySelector('.pokemonContainer');
pokemonContainer.classList.add('pokemonContainer');

let initialSelect = document.createElement('select');

let pokeHolder = [];

class Pokemon {
  constructor(name, imageUrl, types, weight, height, stats, moves) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
    this.moves = moves;
  }

  //   Compare stats and color the "winner" between two pokemon
  static ComparePokemon() {
    pokeHolder.forEach((pokemon) => {
      console.log(pokemon);
    });

    // getting all the stats
    let stats = [];
    pokeHolder.forEach((pokemon) => {
      console.log(pokemon.stats);
      stats.push(pokemon.stats);
    });

    // filtering all thge stats
    let filterdStats = [];
    for (i = 0; i < stats[0].length; i++) {
      if (stats[0][i].base_stat > stats[1][i].base_stat) {
        filterdStats.push(stats[0][i].base_stat);
      } else if (stats[0][i].base_stat < stats[1][i].base_stat) {
        filterdStats.push(stats[1][i].base_stat);
      }
    }

    // nesting loops too find matching values, and adding a class to the matches
    let statDivs = document.querySelectorAll('.stats');
    console.log(statDivs);
    statDivs.forEach((div) => {
      div.childNodes.forEach((node) => {
        filterdStats.forEach((stat) => {
          if (node.innerHTML.includes(stat)) {
            node.classList.add('winner');
          }
        });
      });
    });
  }
}

// Function for calling api and gettting info
let getData = async (url) => {
  let response = await axios.get(url);
  return response.data;
};

// Renders the select list to the dom
let renderSelect = async (pokeListPromise) => {
  let pokeListItitial = await getData(pokeListPromise);
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

// Get the specific pokemon and send its info to an instance inside Pokemon class
let gatherPokeInfo = async (pokemonURL) => {
  if (pokemonURL) {
    let pokemon = await getData(pokemonURL);

    //   Create an instance from api Call
    createPokeInstance(pokemon);
  }

  //   Print to the dom
  if (pokeHolder.length === 2) {
    pokemonContainer.innerHTML = '';
  }
  pokeHolder.forEach((pokemon) => {
    renderPokemon(pokemon);
  });
  addCompareBtn();
};

// listen for change on the pokemon list, get the url associated and send to gatherPokeInfo()
// so the specific pokemon can get extracted from the getData();
initialSelect.addEventListener('change', () => {
  let selected = initialSelect.value;
  if (selected != 'false') {
    gatherPokeInfo(selected);
  } else {
    alert('no poke choosen...:(');
  }
});

// takes a pokemon and creates the instance of it, and pushes the value into an arary
let createPokeInstance = (pokemon) => {
  let pokeInstance = new Pokemon(
    pokemon.species.name,
    pokemon.sprites.front_default,
    pokemon.types,
    pokemon.weight,
    pokemon.height,
    pokemon.stats,
    pokemon.moves
  );

  //   console.log(pokeInstance);
  if (pokeHolder.length < 2) {
    pokeHolder.push(pokeInstance);
  } else {
    pokeHolder.shift();
    pokeHolder.push(pokeInstance);
  }
  console.log(pokeHolder);
};

// Prints the pokemon in the DOM
let renderPokemon = (pokemon) => {
  // Create the holder for the card and stats
  let pokemonHolder = document.createElement('div');
  pokemonHolder.classList.add('pokemon');
  // Second level container might be unneccesary?
  let pokeCard = document.createElement('div');
  pokeCard.classList.add('pokeCard');
  // the card
  let card = document.createElement('div');
  card.classList.add('card');

  console.log(pokemon.types[0].type.name);
  if (pokemon.types[0].type.name == 'water') {
    card.classList.add('water');
  } else if (pokemon.types[0].type.name == 'fire') {
    card.classList.add('fire');
  } else if (pokemon.types[0].type.name == 'grass') {
    card.classList.add('grass');
  } else if (pokemon.types[0].type.name == 'electric') {
    card.classList.add('electric');
  } else if (pokemon.types[0].type.name == 'normal') {
    card.classList.add('normal');
  } else {
    card.classList.add('generic');
  }

  //   adding the top info
  let info = document.createElement('div');
  info.classList.add('info');

  let name = document.createElement('p');
  name.innerText = pokemon.name;
  let types = document.createElement('p');
  pokemon.types.forEach((type) => {
    types.innerText += type.type.name + ' / ';
  });
  let hp = document.createElement('p');
  hp.innerText = 'HP: ' + pokemon.stats[0].base_stat;

  info.append(name, types, hp);

  //   adding the image
  let imgBox = document.createElement('div');
  imgBox.classList.add('img');
  let img = document.createElement('img');
  img.src = `${pokemon.imageUrl}`;
  imgBox.append(img);

  // Adding the attacks
  let attacks = document.createElement('div');
  attacks.classList.add('attacks');

  // setting a fixed loop to two so that only two attacks are showing on the card
  for (i = 0; i < 2; i++) {
    if (pokemon.moves[i]) {
      let attack = document.createElement('div');
      attack.classList.add('attack');
      let attackName = document.createElement('p');
      attackName.innerText = pokemon.moves[i].move.name;
      attack.append(attackName);
      attacks.append(attack);
    }
  }

  // Adding the measurments
  let measurments = document.createElement('div');
  measurments.classList.add('measurments');

  let height = document.createElement('p');
  height.innerText = 'Height: ' + pokemon.height + ' inches';
  let weight = document.createElement('p');
  weight.innerText = 'Weight: ' + pokemon.weight + ' pounds';

  measurments.append(height, weight);

  //   adding all to card
  card.append(info, imgBox, attacks, measurments);
  pokeCard.append(card);
  // the stats
  let stats = document.createElement('div');
  stats.classList.add('stats');

  //   Cycling the stats and rendering to the DOM
  pokemon.stats.forEach((stat) => {
    let label = document.createElement('label');
    label.setAttribute('for', `${stat.stat.name}`);
    label.innerText = stat.stat.name + ': ' + stat.base_stat + ' / 200';
    let progress = document.createElement('progress');
    progress.value = stat.base_stat;
    progress.max = '200';
    progress.id = stat.stat.name;
    stats.append(label, progress);
  });

  //   Adding a deletebtn to the cards
  let deleteBtn = document.createElement('button');
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.innerText = 'X';

  deleteBtn.addEventListener('click', () => {
    deleteCard(pokemon);
  });

  card.append(deleteBtn);
  pokeCard.append(stats);

  pokemonHolder.append(pokeCard);
  pokemonContainer.append(pokemonHolder);
};

// Delete function, finding the index of the pokemon and removing from the list, clearing the DOM and re-rendering
let deleteCard = (pokemon) => {
  console.log(pokeHolder);
  pokeHolder.splice(pokeHolder.indexOf(pokemon), 1);
  console.log(pokeHolder);
  clearTheDOM();
  addCompareBtn();
  gatherPokeInfo();
};

let addCompareBtn = () => {
  let compareBtn = document.querySelector('.compareBtn');

  if (pokeHolder.length === 2) {
    if (!compareBtn) {
      compareBtn = document.createElement('button');
      compareBtn.classList.add('btn', 'compareBtn');
      compareBtn.innerText = 'Compare';
      compareBtn.addEventListener('click', () => {
        Pokemon.ComparePokemon();
      });
      container.append(compareBtn);
    }
  } else {
    if (compareBtn) {
      compareBtn.remove();
    }
  }
};

let clearTheDOM = () => {
  pokemonContainer.innerHTML = '';
};

// Initial api call to get all options for the select
renderSelect('https://pokeapi.co/api/v2/pokemon?limit=151');
