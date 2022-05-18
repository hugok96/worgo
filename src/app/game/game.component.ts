import {Component, OnInit} from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {

    constructor(public gameService: GameService) {
    }

    public reset(): void {
        this.gameService.reset();
    }

    get guesses(): string[] {
        return this.padArray(this.gameService.guesses, "", GameService.maxGuesses);
    }

    public getRowGuessState(index: number) {
        return this.gameService.guessesStates[index] ?? "0".repeat(GameService.maxLength).split("").map(t => undefined)
    }

    private padArray(input: string[], _default: any, length: number): any {
        let result: string[] = [];
        for (let i = 0; i < length; i++)
            result.push(input[i] ?? _default);
        return result;
    }

    ngOnInit(): void {
    }
}
