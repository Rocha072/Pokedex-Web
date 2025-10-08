
class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;
}

class PokemonOverlay extends Pokemon{
    pokedexEntry;
    genus;
    height;
    weight;
    abilities = [];

    genderRate;
    eggGroups = [];

    stats = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0
    }
   
    evolutionChain = [];

}