import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {GameComponent} from './game/game.component';
import {KeyboardComponent} from './keyboard/keyboard.component';
import {SplitPipe} from './pipes/split.pipe';
import {StatsComponent} from './stats/stats.component';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        KeyboardComponent,
        SplitPipe,
        StatsComponent
    ],
    imports: [
        BrowserModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
