

const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon();
    pokemon.name = pokeDetail.name;
    pokemon.number = pokeDetail.id;
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
    return pokemon
}



pokeApi.getPokemonDetail = (pokemon)=>{
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5)=>{
    const URL = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    
    return fetch(URL)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .catch((error) => console.error(error))

}





function convertPokeApisToPokemonOverlay(pokeData, speciesData, evolutionChainData){
    const pokemon = new PokemonOverlay;
    pokemon.name = pokeData.name;
    pokemon.number = pokeData.id;
    pokemon.types = pokeData.types.map((typeSlot)=>typeSlot.type.name);
    pokemon.type = pokemon.types[0];
    pokemon.photo = pokeData.sprites.other.dream_world.front_default;
    pokemon.weight = pokeData.weight / 10;
    pokemon.height = pokeData.height / 10;
    pokemon.abilities = pokeData.abilities.map((abilitySlot)=>abilitySlot.ability.name);

    pokeData.stats.forEach((statInfo)=>{
        const statName = statInfo.stat.name.replace('-', '');
        if(pokemon.stats[statName] !== undefined){
            pokemon.stats[statName] = statInfo.base_stat;
        }
    });

    const entry =
        speciesData.flavor_text_entries.find(entry => entry.language.name === 'pt') ||
        speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    
    pokemon.pokedexEntry = entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Descrição não disponível';

    const genusLanguage =
        speciesData.genera.find(g => g.language.name === 'pt') ||
        speciesData.genera.find(g => g.language.name === 'en');
    
    pokemon.genus = genusLanguage ? genusLanguage.genus : '';

    pokemon.genderRate = speciesData.gender_rate;
    pokemon.eggGroups = speciesData.egg_groups.map(group => group.name);
    
    pokemon.evolutionChain = evolutionChainData ? parseEvolutionChain(evolutionChainData.chain):[];

    return pokemon;
}

function parseEvolutionChain(chain) {
    const evolutionArray = [];
    let currentStage = chain;

    while (currentStage) {
        const speciesName = currentStage.species.name;

        const urlParts = currentStage.species.url.split('/');
        const speciesId = urlParts[urlParts.length - 2];
        
        let trigger = 'null';
        if (currentStage.evolution_details && currentStage.evolution_details.length > 0) {
            const details = currentStage.evolution_details[0];
            const triggerName = details.trigger.name.replace('-', ' ');
            
            if (details.min_level) {
                trigger = `Level ${details.min_level}`;
            } else if (details.item) {
                trigger = `${details.item.name}`;
            } else {
                trigger = triggerName;
            }
        }
        evolutionArray.push({
            id: speciesId,
            name: speciesName,
            photo: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${speciesId}.svg`,
            trigger: trigger 
        });

        
        currentStage = currentStage.evolves_to[0];
    }

    return evolutionArray;
}


pokeApi.getPokemonById = async(id)=>{
    const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

    try{
        
        const [pokemonData, speciesData] = await Promise.all([
            fetch(urlPokemon).then((resposta)=>resposta.json()),
            fetch(urlSpecies).then((resposta)=>resposta.json())
            
        ]);

        const evolutionUrl = speciesData.evolution_chain?.url;
        let evolutionChainData = null;
        if(evolutionUrl){
            evolutionChainData = await fetch(evolutionUrl).then((res)=>res.json());
        }

        return convertPokeApisToPokemonOverlay(pokemonData, speciesData, evolutionChainData);
    }
    catch(erro){
        console.log('Erro ao dar fetch:', erro);
    }
    
            
}