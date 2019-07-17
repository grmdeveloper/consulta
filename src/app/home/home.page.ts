import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}
  unidades = [
  	{	'nome':'São Jose',
  		'especialidades':[
  			{'nome':'Enfermeiro','d':10,'o':11},
  			{'nome':'Clínico Geral','d':10,'o':11},
  		],
  	},
  	{
  		'nome':'Jacutinga',
  		'especialidades':[
  			{'nome':'Enfermeiro','d':11,'o':16},
  			{'nome':'Clínico Geral','d':6,'o':14},
  		],
  	}
  ];


/*  especialidade:string = "Médico Cardiologista";
  leitos_disponiveis:number = 12;
  leitos_ocupados:number = 17;*/
}
