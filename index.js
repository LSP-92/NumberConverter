const fs = require("fs");

const valores = [
  { decimal: 1000, roman: "M" },
  { decimal: 900, roman: "CM" },
  { decimal: 500, roman: "D" },
  { decimal: 400, roman: "CD" },
  { decimal: 100, roman: "C" },
  { decimal: 90, roman: "XC" },
  { decimal: 50, roman: "L" },
  { decimal: 40, roman: "XL" },
  { decimal: 10, roman: "X" },
  { decimal: 9, roman: "IX" },
  { decimal: 5, roman: "V" },
  { decimal: 4, roman: "IV" },
  { decimal: 1, roman: "I" },
];

/**
 * Read File and return string.
 *
 * @param {string} path - The path file.
 * @returns {promise} resolve (string) reject(err)
 *
 */

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer);
    });
  });
};

/**
 *  Filtra el array de numeros separando numeros y strings.
 *
 * @param {array} array - The path file.
 * @returns {object} {arab, romans}
 *
 */

const filterData = (array) => {
  const numeros = {};
  numeros.arab = array.filter((element) => typeof element === "number");
  numeros.romans = array.filter((element) => typeof element === "string");
  return numeros;
};

const romanRegExp = /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/;
const arabRegExp = /\d{1,4}/;

/**
 *  Filtra usado expresiones regulares .
 *
 * @param {array} array - The path file.
 * @returns {object} {arab, romans}
 *
 */

const testData = (obj) => {
  const { arab, romans } = obj;
  const arabic = arab.filter((element) => arabRegExp.test(element));
  const roman = romans.filter((element) => romanRegExp.test(element));
  return { arabic, roman };
};

// Validador de entrada de numeros

async function validator() {
  return readFile("./numeros.json").then((data) => {
    const a = JSON.parse(data);
    const filter = filterData(a);
    return testData(filter);
  });
}

/**
 * Recibe un String de numeros romanos y devulve un array con cada una de las letras
 *
 * @param {array} array - The path file.
 * @returns {array}
 *
 */

const num = (romans) => {
  let z = [];
  for (let l = 0; l < romans.length; l++) {
    for (let i = 0; i < valores.length; i++) {
      if (valores[i].roman === romans[l]) {
        z.push(valores[i].decimal);
      }
    }
  }
  return z;
};

// Conversor de numeros romanos a decimales

const calcRoman = (numeros) => {
  let aux = 0;
  numeros.forEach((element, idx) => {
    if (idx === 0 && numeros.length > 1) {
      if (element > numeros[idx + 1]) {
        aux = element;
      } else {
        aux = -element;
      }
      return;
    }
    if (idx < numeros.length - 1) {
      if (element < numeros[idx + 1]) {
        aux = aux - element;
        return;
      }

      if (element >= numeros[idx + 1]) {
        aux = element + aux;
        return;
      }
    } else {
      if (idx === numeros.length - 1) {
        aux = aux + element;
      }
    }
  });
  return aux;
};

// Conversor de numeros Decimales a Romanos
const calcArabic = (numero) => {
  if (numero > 3999) {
    throw new Error("Numero mayor de 3999");
  }

  let roman = "";
  let h = numero;

  for (let i = 0; i < valores.length; i++) {
    while (h >= valores[i].decimal) {
      roman += valores[i].roman;
      h -= valores[i].decimal;
    }

    if (h === 0) break;
  }
  return roman;
};

const toArabic = (obj) => {
  const decodeArray = obj.map((element) => calcRoman(num(element)));
  return decodeArray;
};

const toRoman = (obj) => {
  const decodeArray = obj.map((element) => calcArabic(element));
  return decodeArray;
};

/**
 * Funcion que decodifica y crea fichero numeros.txt con resultado
 *
 * @returns {void}
 *
 */

const decode = async () => {
  const { arabic, roman } = await validator();
  const value = `
  Numeros Romanos ${roman} -> ${toArabic(roman)}
  Numeros Decimales ${arabic} -> ${toRoman(arabic)}
  `;
  console.log("Creando fichero con los resultados");
  fs.writeFileSync("numeros.txt", value.toString(), (err) => {
    if (err) throw err;
  });
  console.log("Fichero creado");
};

decode();
