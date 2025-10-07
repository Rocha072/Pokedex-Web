


pokemonList.addEventListener('click', (event)=>{
    
    const clickedCard = event.target.closest('.pokemonLi');
    
    if(!clickedCard){
        return;
    }

    const pokemonId = clickedCard.dataset.id;

    console.log(`clicado ${pokemonId}`);
})