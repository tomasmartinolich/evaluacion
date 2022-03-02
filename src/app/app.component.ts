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

  constructor(private electronStoreService: ElectronStoreService) { }

  ngOnInit(): void {

    var dropdown = document.querySelector('.dropdown');
    dropdown!.addEventListener('click', function(event) {
      event.stopPropagation();
      dropdown!.classList.toggle('is-active');
    });

    for (let index = 7; index <= 42; index++) {
      this.semanas.push(index.toString());
      this.sobrepeso.push(26.081 + 0.153 * index);
      this.normal.push(19 + 0.137 * index);
      this.obesidad.push(35.12 + 0.105 * index);
    }
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
            fill: true
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
            pointRadius: 0,
            fill: false
          },
          {
            data: this.normal,
            label: "normal",
            borderColor: "#48c78e",
            pointRadius: 0,
            fill: false
          },
        ],
          labels: this.semanas
      }
    });
  }

  calcularIMC(){
    this.paciente.IMC = this.paciente.inputPeso / Math.pow(this.paciente.inputTalla,2);
  }

  agregar(){
    this.myChart.data.datasets[0].data.push(this.paciente.IMC.toFixed(2));
    this.myChart.update();
  }

  guardar(){
    if(this.paciente.nombre === '') {return false;}
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
    this.myChart.update();
  }

  cargarPaciente(paciente: Paciente){
    this.paciente = paciente;
    this.myChart.data.datasets[0].data = this.paciente.listaIMC;
    this.myChart.update();
  }

}