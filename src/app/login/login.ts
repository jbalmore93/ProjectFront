import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-login',
  standalone: true,             
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  usuario: string = '';
  pass: string = '';

  login(form: any) {
    if (form.valid) {
      console.log("Usuario:", this.usuario);
      console.log("Password:", this.pass);
    }
  }

}
