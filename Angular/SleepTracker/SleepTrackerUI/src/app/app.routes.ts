import { Routes } from '@angular/router';
import { AddSleepRecordComponent } from "./add-sleep-record/add-sleep-record.component";
import { SleepDataTableComponent } from "./sleep-data-table/sleep-data-table.component";
import { SleepTimerComponent } from "./sleep-timer/sleep-timer.component";

export const routes: Routes = [
  { path: '', redirectTo:'/menu', pathMatch: 'full'},
  { path: 'menu', component: SleepDataTableComponent },
  { path: 'listrecords', component: SleepDataTableComponent },
  { path: 'addrecords', component: AddSleepRecordComponent },
  { path: 'timer', component: SleepTimerComponent }
];
