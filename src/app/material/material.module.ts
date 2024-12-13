import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs'; 

const materialComponent = [
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  OverlayModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatTabsModule
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    materialComponent
  ],
  exports: [
    materialComponent
  ]
})
export class MaterialModule { }
