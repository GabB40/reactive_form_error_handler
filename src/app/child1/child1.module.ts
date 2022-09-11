import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormErrorHandlerModule } from '../form-error-handler/form-error-handler.module';
import { AsyncFormDataDirective } from './../directives/async-form-data.directive';
import { Child1Component } from './child1/child1.component';


@NgModule({
  declarations: [
    Child1Component,
    AsyncFormDataDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorHandlerModule
  ]
})
export class Child1Module { }
