import {Injectable, NgZone} from '@angular/core';
import {DataService} from './data.service';
import {GameState} from '../states/game-state';
import {GuessState} from '../states/guess-state';
import {StatsService} from "./stats.service";
import {Key} from "../keyboard/key";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private static validAnswers: string[] = [];
    private static validGuesses: string[] = [];
    public static maxLength: number = 5;
    public static maxGuesses: number = 6;

    private currentWord = "";

    public guesses: string[] = [""];
    public guessesStates: GuessState[][] = [];
    public keyStates: { [key: string]: GuessState } = {};
    public gameState: GameState = GameState.Running;
    public invalidGuess: number = -1;
    public invalidGuessTimeout : any = null;

    constructor(public zone: NgZone, private dataService: DataService, private stats: StatsService) {
        GameService.validAnswers = dataService.getAnswerList();
        GameService.validGuesses = GameService.validAnswers.concat(dataService.getGuessList());
        this.reset();
    }

    public reset() {
        this.zone.run(() => {
            this.stats.shown = false;
            this.guesses = [""];
            this.guessesStates = [];
            this.keyStates = {};
            this.gameState = GameState.Running;
            this.currentWord = GameService.validAnswers[Math.floor(Math.random() * (GameService.validAnswers.length))];
        });
    }

    get currentGuess(): string {
        return this.guesses[this.guesses.length - 1]
    };

    set currentGuess(value: string) {
        this.guesses[this.guesses.length - 1] = value;
    }

    get validGuess(): boolean {
        return this.validLength && this.validWord;
    }

    get validLength(): boolean {
        return this.currentGuess.length === GameService.maxLength
    }

    get validWord(): boolean {
        return -1 !== GameService.validGuesses.indexOf(this.currentGuess);
    }

    public inputKey(key: string): void {
        // If the game is not running, only allow the use of escape to reset
        if (this.gameState !== GameState.Running) {
            if (key === Key.Escape)
                this.reset();
            return;
        }

        // check for special cases
        switch (key) {
            case Key.Return:
                // remove last character
                this.currentGuess = this.currentGuess.split("", this.currentGuess.length - 1).join('');
                break;
            case Key.Enter:
                this.performGuess();
                break;
            default:
                if (null !== key.match(/^[a-z]$/i) && !this.validLength)
                    this.currentGuess += key;
        }
    }

    public performGuess(): void {
        if (!this.validGuess) {
            if(null === this.invalidGuessTimeout) {
                this.invalidGuess = this.guessesStates.length;
                this.invalidGuessTimeout = setTimeout(() => {
                    this.invalidGuess = -1;
                    this.invalidGuessTimeout = null;
                }, 500); // this value unfortunately has to be in sync with the css animation-duration
            }
            return;
        }

        let correctLetters = this.currentGuess.split('').map((v, k) => this.currentWord[k] === v);

        if (-1 === correctLetters.indexOf(false)) {
            this.gameState = GameState.Won;
            this.guessesStates.push(correctLetters.map(v => GuessState.Correct));
            this.currentWord.split('').forEach(v => this.keyStates[v] = GuessState.Correct)
            this.guesses.push("")

            setTimeout(() => this.stats.addGame(true, this.guessesStates.length), 1500)
            return;
        }

        let presentLetters = this.currentGuess.split('').map((v, k) => -1 !== this.currentWord.indexOf(v) && !correctLetters[k]);

        let guessState: GuessState[] = Array.apply(null, Array(5)).map(p => GuessState.Absent);

        let letterOccurrence: { [key: string]: number } = {}

        let letterMaxOccurrence: { [key: string]: number } = {}
        this.currentWord.split('').forEach(v => letterMaxOccurrence[v] = (letterMaxOccurrence[v] === undefined) ? 1 : letterMaxOccurrence[v] + 1);

        correctLetters.forEach((v, k) => {
            if (v) {
                guessState[k] = GuessState.Correct;
                letterOccurrence[this.currentGuess[k]] = letterOccurrence[this.currentGuess[k]] === undefined ? 1 : letterOccurrence[this.currentGuess[k]] + 1;
            }
        });

        presentLetters.forEach((v, k) => {
            if (v && (letterOccurrence[this.currentGuess[k]] === undefined || (letterOccurrence[this.currentGuess[k]] < letterMaxOccurrence[this.currentGuess[k]]))) {
                guessState[k] = GuessState.Present;
                letterOccurrence[this.currentGuess[k]]++;
            }
        });

        guessState.forEach((v, k) => {
            let key = this.currentGuess[k];
            if (v === GuessState.Correct)
                this.keyStates[key] = v;
            else if (this.keyStates[key] !== GuessState.Present && this.keyStates[key] !== GuessState.Correct) {
                this.keyStates[key] = v;
            }
        });

        this.guessesStates.push(guessState);
        this.guesses.push("")

        // more guesses than max guesses -> lose state
        if (this.guesses.length > GameService.maxGuesses) {
            this.gameState = GameState.Lost;
            setTimeout(() => this.stats.addGame(false, GameService.maxGuesses), 1500)
        }
    }
}
