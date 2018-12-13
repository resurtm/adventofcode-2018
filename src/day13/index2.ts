import {readFile as readFileCallback} from 'fs';
import {promisify} from 'util';
import {filter} from 'ramda';

const readFile = promisify(readFileCallback);

async function readInput(fileName: string): Promise<string[]> {
    const data: Buffer = await readFile(`${__dirname}/${fileName}`);
    const lines: string[] = filter(
        (line: string): boolean => line.length > 0,
        data.toString().split('\n')
    );
    return Promise.resolve(lines);
}

const directionsMap: { [direction: string]: string } = {
    '^/': '>',
    '^\\': '<',
    'v/': '<',
    'v\\': '>',
    '</': 'v',
    '<\\': '^',
    '>/': '^',
    '>\\': 'v',
    '^L': '<',
    '^R': '>',
    'vL': '>',
    'vR': '<',
    '<L': 'v',
    '<R': '^',
    '>L': '^',
    '>R': 'v',
};

const crosses: { [k: string]: string } = {
    'L': 'S',
    'S': 'R',
    'R': 'L',
};

const cells: Cell[][] = [];

class Cart {
    cross: string = 'L';

    constructor(public id: number, public dir: string, public x: number, public y: number) {
    }

    tick() {
        const oldX = this.x;
        const oldY = this.y;
        let value = cells[this.y][this.x].value;
        if (cells[this.y][this.x].value === '+') {
            value = this.cross;
            this.cross = crosses[this.cross];
        }
        const mapKey = `${this.dir}${value}`;
        if (mapKey in directionsMap) {
            this.dir = directionsMap[mapKey];
        }
        if (this.dir === '^') {
            this.y--;
        }
        if (this.dir === 'v') {
            this.y++;
        }
        if (this.dir === '<') {
            this.x--;
        }
        if (this.dir === '>') {
            this.x++;
        }
        cells[this.y][this.x].carts.push(this);
        const idx = cells[oldY][oldX].carts.findIndex((cart) => cart.id === this.id);
        cells[oldY][oldX].carts.splice(idx, 1);
        if (cells[this.y][this.x].carts.length >= 2) {
            console.log(this.x, this.y);
            process.exit(0);
        }
    }
}

class Cell {
    carts: Cart[] = [];

    constructor(public value: string) {
    }
}

function debug(cells: Cell[][]): void {
    for (let y = 0; y < cells.length; y++) {
        let line: string = '';
        for (let x = 0; x < cells[y].length; x++) {
            const cell = cells[y][x];
            const carts = cell.carts;
            if (carts.length !== 0) {
                line += carts[0].dir;
            } else {
                line += cell.value;
            }
        }
        console.log(line);
    }
}

async function calculatePart1(fileName: string): Promise<string[]> {
    const input: string[] = await readInput(fileName);
    for (let y = 0; y < input.length; y++) {
        const items: Cell[] = [];
        for (let x = 0; x < input[y].length; x++) {
            items.push(new Cell(input[y][x]));
        }
        cells.push(items);
    }
    const carts: Cart[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            if ('^v'.indexOf(cells[y][x].value) !== -1) {
                const cart = new Cart(Math.round(Math.random() * 10000), cells[y][x].value, x, y);
                cells[y][x].carts = [cart];
                cells[y][x].value = '|';
                carts.push(cart);
            }
            if ('<>'.indexOf(cells[y][x].value) !== -1) {
                const cart = new Cart(Math.round(Math.random() * 10000), cells[y][x].value, x, y);
                cells[y][x].carts = [cart];
                cells[y][x].value = '-';
                carts.push(cart);
            }
        }
    }
    let tick = 0;
    while (tick <= 40000) {
        debug(cells);
        for (const cart of carts) {
            cart.tick();
        }
        tick++;
    }
    return Promise.resolve([]);
}

(async () => {
    console.log(await calculatePart1('input-3.txt'));
    // console.log(await calculatePart2('input-1.txt'));
})();
