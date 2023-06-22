import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ppl-solver';

  vari: number = 0;

  rest: number = 0;

  last: number = 0;

  table: Array<Array<string>> = new Array();

  solved: boolean = false;

  map: Array<string> = new Array();

  optimal: Array<string> = new Array();

  deltas: string[] = [];

  error: boolean = false;

  foundDelta: boolean = false;

  newRevenue: string = "";

  setVar(value: string) {
    this.vari = Number.parseInt(value);
  }


  setRest(value: string) {
    this.rest = Number.parseInt(value);
  }

  init() {
    this.table = new Array(this.rest);

    for (let i = 0; i < this.rest + 2; i++) {
      this.table[i] = new Array<string>(this.rest + this.vari + 2).fill("");
    }
  }

  setLabels() {
    this.table[0][0] = "base";

    for (let i = 2; i < this.rest + 2; i++) {
      this.table[i][0] = "x" + ((i + this.vari - 1));
    }

    for (let i = 1; i < (this.rest + this.vari + 1); i++) {
      this.table[0][i] = "x" + (i);
    }
  }

  setZ() {
    this.table[1][0] = "z";
    for (let i = 0; i < this.vari + this.rest + 1; i++) {
      if (i < this.vari)
        this.table[1][i + 1] = (-1 * Number.parseFloat((<HTMLInputElement>document.getElementById("fo-" + i)).value)).toString();
      else
        this.table[1][i + 1] = "0";
    }
  }

  setTableRest() {
    for (let i = 0; i < this.rest; i++) {
      for (let j = 0; j < this.vari; j++) {
        let value = (<HTMLInputElement>document.getElementById("rest-" + i + "-" + j)).value;
        this.table[i + 2][j + 1] = value;
      }
    }

    for (let i = 1; i < (this.rest + this.vari + 1); i++) {
      this.table[0][i] = "x" + (i);
    }

  }

  createIdMatrix() {
    for (let i = 0; i < this.rest; i++) {
      for (let j = 0; j < this.rest; j++) {
        if (i == j)
          this.table[i + 2][this.vari + 1 + j] = '1';
        else
          this.table[i + 2][this.vari + 1 + j] = '0';
      }
    }
  }

  setResults() {
    for (let i = 0; i < this.rest; i++) {
      this.table[i + 2][this.table[i].length - 1] =
        (<HTMLInputElement>document.getElementById("result-" + i)).value;
    }
  }

  getDeltas() {
    for (let i = 0; i < this.rest; i++) {
      this.deltas.push((<HTMLInputElement>document.getElementById("d-" + i)).value);
      console.log((<HTMLInputElement>document.getElementById("d-" + i)).value);
    }
  }

  solve() {
    let selectedRow: number = 0;
    let selectedColumn: number = 0;
    let pivot: number = 0;

    this.init();

    this.setLabels();

    this.setZ();

    this.setTableRest();

    this.createIdMatrix();

    this.setResults();

    let rowToCheck = this.table[1];

    while (rowToCheck.filter(e => Number.parseInt(e) < 0).length > 0) {
      //for (let kk = 0; kk < 3; kk++) {

      // while objective contains negatives

      let smallest = Number.MAX_VALUE;
      for (let j = 1; j < (this.vari + this.rest + 2); j++) {
        if (Number.parseFloat(this.table[1][j]) < smallest) {
          smallest = Number.parseFloat(this.table[1][j]);
          selectedColumn = j;
        }
      }

      let smallestDivision = Number.MAX_VALUE;
      for (let i = 2; i < this.rest + 2; i++) {
        if (Number.parseFloat(this.table[i][selectedColumn]) <= 0) {
          continue;
        }
        let result = Number.parseFloat(this.table[i][this.table[i].length - 1]);
        let division = result / Number.parseFloat(this.table[i][selectedColumn]);
        if (division < smallestDivision) {
          smallestDivision = division;
          selectedRow = i;
        }
      }

      this.table[selectedRow][0] = this.table[0][selectedColumn];

      pivot = Number.parseFloat(this.table[selectedRow][selectedColumn])


      // multiplica pelo inverso a linha do pivo
      for (let j = 1; j < this.table[selectedRow].length; j++) {
        this.table[selectedRow][j] =
          (Number.parseFloat(this.table[selectedRow][j]) * (1 / pivot)).toFixed(3);
      }

      for (let i = 1; i < (this.rest + 2); i++) {

        let hold = Number.parseFloat((-1 * Number.parseFloat(this.table[i][selectedColumn])).toString());

        if (hold == Number.parseFloat("0")) {
          continue;
        }

        if (i == selectedRow) {
          console.log(i + " etbm " + selectedRow)
          continue;
        }

        for (let j = 1; j < (this.rest + this.vari + 2); j++) {
          // linha pivo * -1 * coluna pra zera + valor da linha

          let sum = (Number.parseFloat(this.table[selectedRow][j]) * (hold)) + Number.parseFloat(this.table[i][j]);

          this.table[i][j] = sum.toFixed(3);

        }

      }

    }

    console.log(this.table)
    this.solved = true;

    this.map = this.table.map((index) => index[0]);

  }

  new() {
    let increment = 2;
    let allCofs: Array<Array<string>> = [];

    this.getDeltas();

    for (let i = 1; i < this.vari + 1; i++) {
      let array: Array<string> = [];
      for (let j = 1; j < this.vari + 1; j++) {
        let deltaCof = this.table[i][this.table[i].length - increment];
        increment++;
        array.push(deltaCof);
      }
      increment = 2;
      allCofs.push(array);
    }

    console.log(allCofs)


    let deltaCof = 0;
    for (let i = 0; i < this.rest + 1; i++) {
      deltaCof = 0;
      for (let j = 0; j < allCofs[i].length - 1; j++) {
        deltaCof += (Number.parseFloat(allCofs[i][j]) * Number.parseFloat(this.deltas[j])) + Number.parseFloat(this.table[i][this.table[i].length - 1]);

        increment++;
        console.log(allCofs[i][j] + " " + this.deltas[j])
      }
      if (deltaCof < 0) {
        this.error = true;
        this.foundDelta = true;
        break;
      }
    }
    this.foundDelta = true;

    if (!this.error) {
      let slice = this.table[1].slice(this.vari+1, (1 + this.vari + this.rest));
      let sum = 0;
      console.log(slice)
      for (let i = 0; i < slice.length; i++) {
        sum += (Number.parseFloat(slice[i]) * Number.parseFloat(this.deltas[i]));
      }
      sum += + Number.parseFloat(this.table[1][this.table[1].length - 1]); 
      this.newRevenue = sum.toString();
    }

  }

}
