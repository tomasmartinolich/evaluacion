export class Paciente {
    public nombre: string;
    public inputPeso: number;
    public inputTalla: number;
    public IMC: number;
    public listaIMC: [];

    constructor() {
        this.nombre = '',
        this.inputPeso = 0,
        this.inputTalla = 0,
        this.IMC = 0,
        this.listaIMC = []
    }
   }