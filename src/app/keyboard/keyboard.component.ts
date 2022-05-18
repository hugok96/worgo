import {Component, OnInit} from '@angular/core';
import {GameService} from '../services/game.service';
import {Key} from "./key";

@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.sass']
})

export class KeyboardComponent implements OnInit {
    public keys: string[][] = [
        [Key.Q, Key.W, Key.E, Key.R, Key.T, Key.Y, Key.U, Key.I, Key.O, Key.P],
        [Key.A, Key.S, Key.D, Key.F, Key.G, Key.H, Key.J, Key.K, Key.L],
        [Key.Enter, Key.Z, Key.X, Key.C, Key.V, Key.B, Key.N, Key.M, Key.Return],
    ];

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
    }

    get keyState(): any {
        return this.gameService.keyStates;
    }

    public inputKey(key: string) {
        this.gameService.inputKey(key);
    }
}
