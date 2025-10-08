
let offset = 0;
let limit = 10;

const pokemonList = document.getElementById('pokemonsList');
const loadMoreButton = document.getElementById('LoadMoreButton');

const customSelects = document.querySelectorAll('.custom-select-wrapper');
const loadingIndicator = document.getElementById('loading-indicator');

const generations = {
    '1': { offset: 0,   limit: 151 },
    '2': { offset: 151, limit: 100 },
    '3': { offset: 251, limit: 135 },
    '4': { offset: 386, limit: 107 },
    '5': { offset: 493, limit: 156 },
    '6': { offset: 649, limit: 72 },
    '7': { offset: 721, limit: 88 },
    '8': { offset: 809, limit: 96 },
    '9': { offset: 905, limit: 120 }
};

let maxPokemons = generations['1'].offset + generations['1'].limit; 

function convertPokemonToLi(pokemon){
    
    return `
        <li class="pokemonLi ${pokemon.type}" data-id="${pokemon.number}">
            <div class = "header">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${String(pokemon.number).padStart(3, '0')}</span>
            </div>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type)=> `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src=${pokemon.photo} alt="${pokemon.name}"/>
            </div>

        </li>
    `
}


function loadPokemonItens(offset, limit){
    pokeApi.getPokemons(offset, limit).then((pokemons) =>{
        pokemonList.innerHTML += pokemons.map(convertPokemonToLi).join('');
        hideLoader();
        
    })
}




loadMoreButton.addEventListener("click", ()=>{
    showLoader();
    offset+=limit;
    if(limit >= maxPokemons - offset ){  
        limit = maxPokemons - offset;
        loadPokemonItens(offset, limit);
        loadMoreButton.remove();
    }
    else
        loadPokemonItens(offset, limit);
    
})


function changeGeneration(gen) {
    showLoader();
    pokemonList.innerHTML = '';
    const generation = generations[gen];
    offset = generation.offset;
    maxPokemons = generation.offset + generation.limit;
    limit = 10;
    loadPokemonItens(offset, limit);
    if (!document.getElementById('LoadMoreButton')) {
        document.querySelector('.pagination').appendChild(loadMoreButton);
    }
}


customSelects.forEach(wrapper => {
    const select = wrapper.querySelector('.custom-select');
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const options = wrapper.querySelector('.custom-options');

    
    select.addEventListener('click', () => {
        wrapper.classList.toggle('open');
    });

    
    window.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('open');
        }
    });

    
    options.addEventListener('click', (e) => {
        const clickedOption = e.target.closest('.custom-option');
        if (!clickedOption || clickedOption.classList.contains('selected')) {
            
            wrapper.classList.remove('open');
            return;
        }

        const oldSelectedOption = options.querySelector('.custom-option.selected');
        if (oldSelectedOption) {
            oldSelectedOption.classList.remove('selected');
        }
        
       
        clickedOption.classList.add('selected');

        
        trigger.textContent = clickedOption.textContent;

        const selectedValue = clickedOption.dataset.value;
   
        wrapper.classList.remove('open');

        changeGeneration(selectedValue);
    });
});


function showLoader() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoader() {
    loadingIndicator.classList.add('hidden');
}

showLoader();
loadPokemonItens(offset, limit);