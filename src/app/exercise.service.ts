import { Injectable } from '@angular/core';
import { Observable, Subject, interval, NEVER, BehaviorSubject, of } from 'rxjs';
import { tap, startWith, scan, switchMap, map } from 'rxjs/operators';


export interface Step {
  title: string;
  animation?: string;
  duration: number;
  next?: Step;
}

export interface State {
  tick: number;
  stepsCompleted: number;
  currentCountdown: number;
  running: boolean;
  step: Step;
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  controls$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private steps: Step[] = [
    {title: 'Gør klar!', duration: 10},
    {title: 'Sprællemand', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Sid op af væg', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Armbøjninger', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Mavebøjninger', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Træd op på stol', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Squat', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Triceps dips på en stol', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Planke', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Høje knæløftninger, løb på stedet', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Lunges', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Armbøjninger med rotation', duration: 30},
    {title: 'Pause', duration: 10},
    {title: 'Sideplanke - en side', duration: 15},
    {title: 'Sideplanke - den anden side', duration: 15},
    {title: 'Færdig!', duration: 0},
  ]

  private initialValue = {
    tick: 0,
    running: false,
    step: this.steps[0],
    currentCountdown: this.steps[0].duration
  }

  constructor() { }

  findExercise = (tick: number) => this.steps.map((step, index) => {
    if (this.steps[index + 1] && this.steps[index + 1].title !== 'Pause') {
      step = {...step, next : this.steps[index + 1]};
    }
    return step;
  }).find(exercise => {
    tick -= exercise.duration;
    return tick <= 0;
  })

  currentExercise(): Observable<State> {
    return this.controls$.pipe(
      startWith(this.initialValue),
      scan((state: State, curr): State => ({ ...state, ...curr }), {}),
      switchMap((state: State) => state.running ? interval(1000).pipe(tap(_ => {
        state.tick++;

        if (state.step !== this.findExercise(state.tick)) {
          state.step = this.findExercise(state.tick);
        }

        if (state.currentCountdown <= 0) {
          state.currentCountdown = state.step.duration;
        }
        state.currentCountdown--;
      }), map(_ => state)) : of(state)));
  }

  start() {
    this.controls$.next({running: true});
  }
  pause() {
    this.controls$.next({running: false});
  }
  reset() {
    this.controls$.next(this.initialValue);
  }
}
