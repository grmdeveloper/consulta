import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public http:HttpClient, public alertCtrl:AlertController) {}

  API_URL="https://cors-anywhere.herokuapp.com/http://farmaciaonline.mesquita.rj.gov.br/SisHos/";
  unidades=[];
  uniSelected:string;
  espSelected:string;

  especialidades=[];
  vg_abertas:number=0; vg_ocupadas:number=0; vg_total:number=0;

  vagas=[];
  seted:boolean=false;
  erro:string;


  map:any;  options:any;  latlng:any;  
  locations:any=[];  latitude:any;  longitude:any;
  endereco:string;
  centerLat:number =-22.7919;  centerLng:number =-43.4293;
  markers=[]; marks=[]; marker:any;
  
  ngOnInit(){ 
    this.getUnidades();
    this.locations.push([1,'ubs',-22.7819,-43.4242,'centro de mesquita']);
    this.locations.push([1,'ubs',-22.7329,-43.4892,'centro de mesquita']);
    this.locations.push([1,'ubs',-22.7519,-43.4692,'centro de mesquita']);
    this.locations.push([1,'ubs',-22.7719,-43.4192,'centro de mesquita']);
    this.initMap();
    this.doMarks();
  }

  initMap(){
    var latlng = new google.maps.LatLng(-22.7819, -43.4293);
    var options = {
      zoom: 13.6,
      center: latlng,
    };
    this.map = new google.maps.Map(document.getElementById('mapa'), options);
  }


  doMarks(){
    var location:any;
    for(let i=0; i<=this.locations.length; i++){
      location = this.locations[i];
      var latlng = new google.maps.LatLng(location[2],location[3]);
      
      var contentString =location[1];

      let marker = new google.maps.Marker({
        "position": latlng,
        "map": this.map,
        "title": location[1],
        "icon": 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(this.map,marker);
      console.log(marker);
    });

    }

  }




  async logErrConsole() {
    const alert = await this.alertCtrl.create({
      header: 'status',
      subHeader: 'message',
      message: this.erro,
      buttons: ['OK']
    });
    await alert.present();
  }

	getDados($event){
		console.log($event.detail.value);
    this.uniSelected=$event.detal.value;
		this.http.get(this.API_URL+'getDados/'+this.uniSelected).subscribe(
			(data:any)=>{
				this.vagas=data;
			},
			erro=>{
        this.erro=JSON.stringify(erro);
				this.logErrConsole();
			}
		);
	}

  getUnidades(){
    this.http.get(this.API_URL+'getUnidades/').subscribe(
      (data:any)=>{
        this.unidades=data;
      },
      erro=>{
        this.erro=JSON.stringify(erro);
        this.logErrConsole();
      }
    );
  }

  getEspecialidades($event){
    this.uniSelected = $event.detail.value;
    this.http.get(this.API_URL+"getEspecialidades/"+this.uniSelected).subscribe(
      (data:any)=>{
        console.log(data);
        this.especialidades=data.especialidades; 
        this.seted=true;
      },
      erro =>{
        this.erro=JSON.stringify(erro);
        this.logErrConsole();
      }
      );
  }

  async descVagas($event){
    let esp=($event.srcElement.innerText);
    this.espSelected=esp;
    await this.http.get(this.API_URL+'getVagas/'+this.uniSelected+"/"+esp).subscribe(
      (data:any)=>{
        console.log(data);
        this.vagas=data;
        this.showVacancies();
      },
      erro=>{
        this.erro=JSON.stringify(erro);
        this.logErrConsole();
      }
    );
  }

  async showVacancies() {
    const alert = await this.alertCtrl.create({
      header: this.espSelected,
      subHeader: 'Vagas',
      message: await this.qntVagas()+""+this.detalhes(),
      buttons: ['OK']
    });

    await alert.present();
  }

  qntVagas(){
    let abertas:number=0, ocupadas:number=0, total:number=0;
    this.vagas.forEach(function(vaga){
      if(vaga.status){ 
        ocupadas++;
      }
      else{
        abertas++;
      }
      total++;
    });

      return "<ion-item class='ion-text-sm'>Disponiveis: "
      +abertas+"<ion-icon name='checkmark' slot='end'></ion-icon></ion-item>"
      +"<ion-item>Ocupadas: "
      +ocupadas+"<ion-icon name='close' slot='end'></ion-icon></ion-item>";
  }

  detalhes(){
    //organizar array vagas
    let vagasString:string="";
    let status:string="";

    let abertas:number=0, ocupadas:number=0, total:number=0;
    this.vagas.forEach(function(vaga){
      if(vaga.status){ 
        status ="<ion-badge slot='start'>Ocupada</ion-badge>";
      }
      else{
        status = "<ion-badge slot='start'>Aberta</ion-badge>";
      }
      vagasString=vagasString+"<br>"+
      "<ion-item>"+status+" "+vaga.descricao+"</ion-item>";

    });
     return vagasString;
  }

}
