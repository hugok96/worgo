import {Component, HostListener} from '@angular/core';
import {GameService} from './services/game.service';
import {StatsService} from "./services/stats.service";
import {Key} from "./keyboard/key";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})

export class AppComponent {
    title = 'worgo';

    constructor(private gameService: GameService, public stats: StatsService) {
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // ignore any case where a special key is pressed
        if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey)
            return;

        let key = event.key.toLowerCase();
        this.gameService.inputKey(key === Key.Backspace || key === Key.Delete ? Key.Return : key);
    }
}
