
let offset = 0;
let limit = 10;
const pokemonList = document.getElementById('pokemonsList');
const loadMoreButton = document.getElementById('LoadMoreButton');

const maxPokemons = 151;



function convertPokemonToLi(pokemon){
    
    return `
        <li class="pokemonLi ${pokemon.type} ${pokemon.number}">

            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

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
    })
}




loadMoreButton.addEventListener("click", ()=>{
    offset+=limit;
    if(limit >= maxPokemons - offset ){  
        limit = maxPokemons - offset;
        loadPokemonItens(offset, limit);
        loadMoreButton.remove();
    }
    else
        loadPokemonItens(offset, limit);
    
})
    
loadPokemonItens(offset, limit);