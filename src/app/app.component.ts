import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  inputPeso = 74;
  inputTalla = 1.84;
  inputSemana = 0;
  IMC = 0;

  graphVisible = 'block';

  semanas: string[] = [];
  listaIMC = [];

  myChart: any;

  //lineas
  obesidad: number[] = [];
  sobrepeso: number[] = [];
  normal: number[] = [];

  ngOnInit(): void {
    for (let index = 7; index <= 42; index++) {
      this.semanas.push(index.toString());
      this.sobrepeso.push(26.081 + 0.153 * index);
      this.normal.push(19 + 0.137 * index);
      this.obesidad.push(35.12 + 0.105 * index);
    }
    this.crearGrafico();
  }

  crearGrafico(){
    this.myChart = new Chart("myChart", {
      type: 'line',
      data: {
          datasets: [
            {
            //data: [45, 15],
            label: "IMC",
            data: this.listaIMC,
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
    this.IMC = this.inputPeso / Math.pow(this.inputTalla,2);
  }

  agregar(){
    //if(this.inputSemana < 7) alert('El valor mínimo de semana es 7');
    this.myChart.data.datasets[0].data.push(this.IMC.toFixed(2));
    this.myChart.update();
  }

}