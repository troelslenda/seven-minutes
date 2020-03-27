import { Component, OnInit } from '@angular/core';
import { ExerciseService, State } from './exercise.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  currentExercise$: Observable<State>;

  constructor(public exerciseService: ExerciseService) {}
  title = 'seven-min';

  ngOnInit() {
    this.currentExercise$ = this.exerciseService.currentExercise();
  }
}
