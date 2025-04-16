import { Component } from '@angular/core';
import { DocsExampleComponent } from '@docs-components/public-api';

import { TablesComponent } from '../base/tables/tables.component';
import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  TableColorDirective,
  TableActiveDirective,
  BorderDirective,
  ButtonDirective,
} from '@coreui/angular';

@Component({
  selector: 'app-users-list',
  // imports: [TablesComponent],
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    DocsExampleComponent,
    TableDirective,
    TableColorDirective,
    TableActiveDirective,
    BorderDirective,

    ButtonDirective,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {}
