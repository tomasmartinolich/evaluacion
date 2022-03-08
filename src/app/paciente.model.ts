export class Paciente {
    public DNI?: number;
    public nombre: string;
    public inputPeso: number;
    public inputTalla: number;
    public IMC: number;
    public listaIMC: number[];
    public FUM: Date;

    constructor() {
        this.nombre = '',
        this.inputPeso = 0,
        this.inputTalla = 0,
        this.IMC = 0,
        this.listaIMC = []
        this.FUM = new Date();
    }
   }