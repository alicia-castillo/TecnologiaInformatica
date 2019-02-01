class Raiz{

	constructor(num){
		this.numero = num;
	}

	getRaiz(){
		return Math.sqrt(this.numero);
	}
}

let raiz = new Raiz(81);
console.log("La raíz de "+ raiz.numero + " es: " + raiz.getRaiz());