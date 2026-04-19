import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPage } from './src/main-page/main-page/main-page';

@Component({
  selector: 'app-root',
  imports: [MainPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('strona-artura');
}
