import { Component } from '@angular/core';
// import { DocsExampleComponent } from '@docs-components/public-api';

import { TablesComponent } from '../base/tables/tables.component';
import {
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
} from '@coreui/angular';
@Component({
  selector: 'app-tasks-list',
  imports: [
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {}
