import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

// interfaces
import { IPokemon } from '../interface/pokemon.interface'
import { Type } from '../models/type.model';
import { MessagesService } from './messages.service';

// enumerator
import { MessageType } from '../enum/message-type.enum';

@Injectable()
export class PokemonService {

    myPokemonUpdated: EventEmitter<any> = new EventEmitter();

    searchedPokemon: IPokemon[] = [];

    myPokemon: IPokemon[] = [];

    constructor(private _http: Http, private _message: MessagesService) {

    }

    addSearchedPokemon(pokemon: IPokemon) {
        for(let i = 0; i < this.searchedPokemon.length; i++){
            if(pokemon.id == this.searchedPokemon[i].id){
                return;
            }
        }
        if(this.searchedPokemon.length == 3){
            this.searchedPokemon.shift();
        }
        this.searchedPokemon.push(pokemon);
    }

    addMyPokemon(pokemon: IPokemon){
        for(let i = 0; i < this.myPokemon.length; i++){
            if(pokemon.id == this.myPokemon[i].id){
                // already exists!
                this._message.addMessage({
                    message: pokemon.name + ' is already in your pokedex!',
                    type: MessageType.error
                });
                return;
            }
        }
        this.myPokemon.push(pokemon);
        this._message.addMessage({
            message: pokemon.name + ' is added to your pokedex!',
            type: MessageType.success
        });
        this.myPokemonUpdated.emit(this.myPokemon);
    }

    removeMyPokemon(pokemon: IPokemon){
        if(this.myPokemon.indexOf(pokemon) > -1){
            this.myPokemon.splice(this.myPokemon.indexOf(pokemon), 1);
            console.log('obrisan:');
            console.log(pokemon);
            this._message.addMessage({
                message: pokemon.name + ' is now released!',
                type: MessageType.success
            });
        }
    }

    getMyPokemon(){
        return Observable.of(this.myPokemon);
    }

    getSearchedPokemon() {
        return Observable.of(this.searchedPokemon);
    }

    getPokemons() {
        // Returns an array of pokemon (IPokemon interface)
        return this._http.get('data/api/pokemon.json').map(res => <IPokemon[]>res.json());
    }

    getTypes() {
        // Returns an array of types (Type class - model)
        return this._http.get('data/api/types.json').map(res => <Type[]>res.json());
    }

    /// GETTING POKEMON FROM API AND STRINGIFY ///
    // this._pokemon.getPokemons().subscribe(res => {
    //     let keys = Object.keys(res);
    //     let test = res['name'];
    //     this.kalup['id'] = res['id'];
    //     this.kalup['name'] = res['name'];
    //     this.kalup['height'] = res['height'];
    //     this.kalup['weight'] = res['weight'];
    //     this.kalup['order'] = res['order'];
    //     this.kalup['abilities'] = res['abilities'];
    //     this.kalup['sprites'] = res['sprites'];
    //     this.kalup['types'] = res['types'];
    //     this.pokemonStringify = JSON.stringify(this.kalup);
    //     this.pokemons = JSON.stringify(res);
    //     console.log(this.pokemons);
    // })
    // return this._http.get('https://pokeapi.co/api/v2/pokemon/100/')
    // .map(res => res.json());
} 