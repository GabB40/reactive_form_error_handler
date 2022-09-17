import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormErrorHandlerModule } from '../form-error-handler/form-error-handler.module';
import { DirectivesModule } from './../directives/directives.module';
import { Child1Component } from './child1/child1.component';


@NgModule({
  declarations: [
    Child1Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorHandlerModule,
    DirectivesModule
  ]
})
export class Child1Module { }
