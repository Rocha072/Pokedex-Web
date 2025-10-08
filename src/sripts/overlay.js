
const overlay = document.getElementById('poke-overlay');
const closeBtn = document.getElementById('close-button');

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

let currentPokemonType = '';

overlay.addEventListener('click', (event)=>{
    const clicked = event.target.closest('#modal');
    if(clicked) return;
    overlay.classList.remove('show');
})

modalContent.addEventListener('click', (event)=>{
    
    const clicked = event.target.closest('.topic');
    if(!clicked || clicked.classList.contains('selected')){
        return;
    }

    const oldSelected = modalContent.querySelector('.topic.selected');
    const oldActivated = modalContent.querySelector('.desc-content.active');
    
    oldSelected.classList.remove('selected');
    oldActivated.classList.remove('active');

    const targetContentId = clicked.dataset.tab;
    const newActivated = modalContent.querySelector(`#${targetContentId}`);

    clicked.classList.add('selected');
    newActivated.classList.add('active');

})

pokemonList.addEventListener('click', (event)=>{
    
    const clickedCard = event.target.closest('.pokemonLi');
    
    if(!clickedCard){
        return;
    }
    
    const pokemonId = clickedCard.dataset.id;
    
    openOverlay(pokemonId);
    
})

closeBtn.addEventListener('click', ()=>{
    overlay.classList.remove('show');
})



async function openOverlay(pokemonId) {
     const pokemon = await pokeApi.getPokemonById(pokemonId);

    if(pokemon){
        
        if(currentPokemonType)
            modal.classList.remove(currentPokemonType);
        
        
        currentPokemonType = pokemon.type;
        modal.classList.add(currentPokemonType);
        
        htmlPokemon = createOverlayHtml(pokemon);

        modalContent.innerHTML = htmlPokemon;
        

        overlay.classList.add('show');    
    }
}


function generateGenderHtml(genderRate){
    if (genderRate === -1) {
        return '<span class="value">Genderless</span>';
    }

    const femalePercentage = (genderRate / 8) * 100;
    const malePercentage = 100 - femalePercentage;

    let html = '<span class="value gender">';
    if (malePercentage > 0) {
        html += `<span class="gender-male">♂ ${malePercentage}%</span>`;
    }
    if (femalePercentage > 0) {
        html += `<span class="gender-female">♀ ${femalePercentage}%</span>`;
    }
    html += '</span>';

    return html;
}

function generateBarLevel(value){
    if(value < 50) return 'low'
    if(value < 90) return 'medium'
    return 'high';
}

function generateBarWidth(value){
    return Math.min((value / 180) * 100, 100)
}

function generateStats(stats){

    const statNameMapping = {
        hp: 'HP',
        attack: 'Attack',
        defense: 'Defense',
        specialattack: 'Sp. Atk',
        specialdefense: 'Sp. Def',
        speed: 'Speed'
    };

    return Object.entries(stats).map(([statName, statValue]) => {
        return `
            <li>
                <span class="stat-name">${statNameMapping[statName]}</span>
                <span class="stat-value">${String(statValue).padStart(3, '0')}</span>
                <div class="stat-bar">
                    <div class="bar ${generateBarLevel(statValue)}" style="width: ${generateBarWidth(statValue)}%;"></div>
                </div>
            </li>
        `;
    }).join('');
}


function generateEvolutionHTML(chain){
    if (chain.length <= 1) {
        return `
            <p>This Pokémon does not evolve.</p>
        `;
    }

    const chainHtml = chain.map((pokemon,index,array)=>{
        const pokemonBlock = `
            <div class="pokemon-evolution">
                <div class="img-container">
                    <img src=${pokemon.photo} alt="${pokemon.name}">
                </div>
                <span class="pokemon-name">${pokemon.name}</span>
                <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
            </div>
        `;

        let triggerBlock = '';
        if(index < array.length - 1){
            const nextPokemon = array[index+1];
            triggerBlock =  `
                <div class="evolution-trigger">
                    <span class="trigger-level">${nextPokemon.trigger}</span>
                </div>
                `;
             
        }
        return pokemonBlock + triggerBlock;
    }).join('');

    return chainHtml;
}

function createOverlayHtml(poke){
    return `<div id="pokemon">

                <div id="headerPokemon">

                    <div id="name-and-types">
                        <span class="name"> ${poke.name}</span>
                        <ul class="types">
                            ${poke.types.map((type)=> `<li class="type ${type}">${type}</li>`).join('')}
                        </ul>
                    </div>
                    
                    
                    <span id="num"> #${poke.number}</span>
                    
                    
                </div>
                
                
                <div id="poke-img">
                    
                    <img src=${poke.photo} alt="${poke.name}">
                </div>
                
                <div id="container-desc">
                    <div id="topics">

                        <h3 class="topic selected" data-tab="about-content">About</h3>
                        <h3 class="topic" data-tab="base-status-content">Base Stats</h3>
                        <h3 class="topic" data-tab="evolution-content">Evolution</h3>

                    </div>

                    <div id="about-content" class="desc-content active">
                        <p class="pokedex-entry">
                            ${poke.pokedexEntry}
                        </p>
                        <ul class="pokemon-data">
                            <li>
                                <span class="title">Species</span> 
                                <span class="value">${poke.genus}</span>
                            </li>
                            <li>
                                <span class="title">Height</span> 
                                <span class="value">${poke.height}</span>
                            </li>
                            <li>
                                <span class="title">Weight</span>
                                <span class="value">${poke.weight}</span>
                            </li>
                            <li>
                                <span class="title">Abilities</span>
                                <span class="value">${poke.abilities.join(', ')}</span>
                            </li>
                            
                        </ul>

                        <h4>Breeding</h4>
                        <ul class="pokemon-data">
                            <li>
                                <span class="title">Gender</span>
                                ${generateGenderHtml(poke.genderRate)} 
                            </li>
                            <li>
                                <span class="title">Egg Groups</span>
                                <span class="value">${poke.eggGroups.join(', ')}</span>
                            </li>
                        </ul>

                    </div>

                    <div id="base-status-content" class="desc-content">
                        <ul class="stats-list">
                            ${generateStats(poke.stats)}
                        </ul>
                    </div>

                    <div id="evolution-content" class="desc-content">
                        <div class="evolution-chain">
                            ${generateEvolutionHTML(poke.evolutionChain)}
                                            
                        </div>

                    </div>
                    
                </div>
            </div>
            `
}