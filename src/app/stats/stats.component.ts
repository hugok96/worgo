import {Component, OnInit} from '@angular/core';
import {GameService} from "../services/game.service";
import {StatsService} from "../services/stats.service";

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.sass']
})
export class StatsComponent implements OnInit {
    constructor(private game: GameService, public stats: StatsService) {
    }

    ngOnInit(): void {
    }

    get bestAverageResult(): number {
        // create method clones without reference, then sort, revese, take highest or zero
        return Object.create(this.stats.gameResults).sort().reverse()[0] ?? 0;
    }

    public close() {
        this.stats.shown = false;
    }

}
