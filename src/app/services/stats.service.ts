import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StatsService implements StatsSave {
    static readonly localstorageIndex : string = "worgo.stats";
    public shown: boolean = false;

    // Save Data
    public gamesPlayed: number = 0;
    public gameResults: number[] = [0, 0, 0, 0, 0, 0];
    public gamesWon: number = 0;
    public currentStreak: number = 0;
    public bestStreak: number = 0;


    constructor() {
        this.load();
    }

    public addGame(wonGame: boolean, guesses: number) {
        this.gamesPlayed++;
        if (wonGame) {
            this.gamesWon++;
            this.currentStreak++;
            this.gameResults[guesses - 1]++;

            if (this.currentStreak > this.bestStreak)
                this.bestStreak = this.currentStreak;
        } else
            this.currentStreak = 0;

        this.shown = true;
        this.save();
    }

    private save() {
        localStorage.setItem(StatsService.localstorageIndex, JSON.stringify({
            gamesPlayed: this.gamesPlayed,
            gameResults: this.gameResults,
            gamesWon: this.gamesWon,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
        } as StatsSave));
    }

    private load() {
        const item: StatsSave = JSON.parse(localStorage.getItem(StatsService.localstorageIndex) ?? "{}");
        if (item === undefined || item === null || item.gamesPlayed === undefined)
            return;

        this.gamesPlayed = item.gamesPlayed;
        this.gameResults = item.gameResults;
        this.gamesWon = item.gamesWon;
        this.currentStreak = item.currentStreak;
        this.bestStreak = item.bestStreak;
    }
}

interface StatsSave {
    gamesPlayed: number;
    gameResults: number[];
    gamesWon: number;
    currentStreak: number;
    bestStreak: number;
}
