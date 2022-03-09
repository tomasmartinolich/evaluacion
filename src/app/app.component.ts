import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ElectronStoreService } from './electron-store.service';
import { Paciente } from './paciente.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pacientes: Paciente[] = [];
  paciente = new Paciente();

  graphVisible = 'block';

  semanas: string[] = [];

  myChart: any;

  //lineas
  obesidad: number[] = [];
  sobrepeso: number[] = [];
  normal: number[] = [];
  bajoPeso: number[] = [];

  colores: string[] = [];

  semanaEmbarazo: number = 0;

  constructor(private electronStoreService: ElectronStoreService) { }

  ngOnInit(): void {

    var dropdown = document.querySelector('.dropdown');
    dropdown!.addEventListener('click', function(event) {
      event.stopPropagation();
      dropdown!.classList.toggle('is-active');
    });

    for (let index = 7; index < 42; index++) {
      this.semanas.push(index.toString());
    }
    this.normal = [19.8,19.9,19.99,20,20.1,20.25,20.4,20.5,20.6,20.7,20.9,21,21.15,21.45,21.6,21.8,21.9,22.1,22.3,22.5,22.65,22.8,23,23.15,23.4,23.55,23.7,23.9,24,24.1,24.25,24.45,24.53,24.7,24.85];
    this.sobrepeso = [27,27.1,27.15,27.2,27.35,27.5,27.6,27.7,27.95,28,28.15,28.5,28.75,28.95,29.1,29.35,29.5,29.8,30,30.2,30.4,30.65,30.85,31,31.15,31.45,31.65,31.80,31.97,32.05,32.1,32.35,32.4,32.5,32.6];
    this.obesidad = [35.85,35.8,35.74,35.69,35.71,35.74,35.8,35.96,36,36.07,36.2,36.43,36.6,36.9,37,37.15,37.35,37.55,37.7,37.98,38.02,38.1,38.3,38.55,38.7,38.93,39,39.1,39.2,39.3,39.46,39.5,39.5,39.5,39.55];
    this.bajoPeso = this.normal.map(num => num - 2);
    this.crearGrafico();
    this.cargarPacientes();
  }

  crearGrafico(){
    this.myChart = new Chart("myChart", {
      type: 'line',
      data: {
          datasets: [
            {
            label: "IMC",
            data: this.paciente.listaIMC,
            borderColor: "#3e95cd",
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: this.colores
          },
          {
            data: this.obesidad,
            label: "Obesidad",
            borderColor: "#f14668",
            fill: false,
            pointRadius: 0
          },
          {
            data: this.sobrepeso,
            label: "Sobrepeso",
            borderColor: "#ffe08a",
            fill: false,
            pointRadius: 0
          },
          {
            data: this.normal,
            label: "Normal",
            borderColor: "#48c78e",
            fill: false,
            pointRadius: 0
          },
          {
            data: this.bajoPeso,
            label: "Bajo peso",
            borderColor: "#272727",
            fill: false,
            pointRadius: 0
          }
        ],
          labels: this.semanas
      }
    });
  }

  calcularIMC(){
    this.paciente.IMC = this.paciente.inputPeso / Math.pow(this.paciente.inputTalla,2);
  }

  calcularColor(i: number){

    console.log('index ',i);
    console.log('IMC: ', this.paciente.listaIMC[i]);
    console.log('obesidad: ', this.obesidad[i]);
    if(this.paciente.listaIMC[i] >= this.obesidad[i]){ return "#f14668"; }
    if(this.paciente.listaIMC[i] < this.obesidad[i] && this.paciente.listaIMC[i] >= this.sobrepeso[i]){ return "#ffe08a"; }
    if(this.paciente.listaIMC[i] < this.sobrepeso[i] && this.paciente.listaIMC[i] >= this.normal[i]){ return "#48c78e"; }
    return "#272727";

    // let i = 0;
    // this.paciente.listaIMC.forEach(IMC => {

      // if(IMC >= this.obesidad[i]){ this.colores.push("#f14668"); }
      // if(IMC < this.obesidad[i] && IMC >= this.sobrepeso[i]){ this.colores.push("#ffe08a"); }
      // if(IMC < this.sobrepeso[i] && IMC >= this.normal[i]){ this.colores.push("#48c78e"); }
      // if(IMC < this.normal[i]){ this.colores.push("#272727"); }
    //   i++;
    // })
  }

  agregar(){
    this.paciente.listaIMC.push(this.paciente.IMC);
    this.myChart.data.datasets[0].data = this.paciente.listaIMC;
    const index = this.myChart.data.datasets[0].data.length - 1;
    this.colores.push(this.calcularColor(index));
    this.myChart.update();
    console.log(this.colores);
  }

  guardar(){
    //if(this.paciente.nombre === '') {return false;}
    this.paciente.listaIMC = this.myChart.data.datasets[0].data;
    if(this.pacientes.find(p => p.nombre === this.paciente.nombre)){
      const i = this.pacientes.findIndex(p => p.nombre === this.paciente.nombre);
      this.pacientes[i] = this.paciente;
    }else{
      this.pacientes.push(this.paciente);
    }

    this.electronStoreService.set('pacientes', this.pacientes);

  }

  cargarPacientes(){
    if(this.electronStoreService.get('pacientes')) {
      this.pacientes = this.electronStoreService.get('pacientes');
    };
  }

  nuevoPaciente(){
    this.paciente = new Paciente();
    this.myChart.data.datasets[0].data = [];
    this.colores = [];
    this.myChart.update();
  }

  cargarPaciente(paciente: Paciente){
    this.paciente = paciente;
    this.colores = [];
    this.myChart.data.datasets[0].data = this.paciente.listaIMC;
    for (let index = 0; index < this.paciente.listaIMC.length; index++) {
      let color = this.calcularColor(this.paciente.listaIMC[index]);
      this.colores.push(color);
    }
    this.myChart.update();
  }

  diferenciaSemanas(fecha: Date){
    const fechaHoy = new Date();

    let prueba2 = new Date(fecha);
    prueba2.setDate(prueba2.getDate()+1);
    prueba2.setMonth(prueba2.getMonth() +1);
    // const pruebaDia = prueba2.getDate();
    // const pruebaMes = prueba2.getMonth();
    // const pruebaAnio = prueba2.getFullYear();
    // let prueba = `${pruebaDia}/${pruebaMes}/${pruebaAnio}`;
    console.log('fecha ingresada: ', prueba2);
    console.log('fecha hoy: ', fechaHoy);

    let diferencia = (fechaHoy.getTime() - new Date(fecha).getTime()) / 1000;
    diferencia /= (60 * 60 * 24 * 7);

    console.log('diferencia: ', diferencia);

    this.semanaEmbarazo = Math.abs(Math.round(diferencia));
  }

}