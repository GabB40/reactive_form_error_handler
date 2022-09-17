import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from './../directives/directives.module';
import { FormErrorHandlerModule } from './../form-error-handler/form-error-handler.module';

import { Child2Component } from './child2/child2.component';


@NgModule({
  declarations: [
    Child2Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorHandlerModule,
    DirectivesModule
  ]
})
export class Child2Module { }
