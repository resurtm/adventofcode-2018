// const serialNumber = 18;
// const serialNumber = 42;
const serialNumber = 1308;
const cellsSize = 300;

function getHundreds(x: number): number {
    const str = Math.abs(x).toString().split('').reverse().join('');
    return str.length >= 3 ? parseInt(str[2], 10) : 0;
}

function cellsPower(cells: number[][], x: number, y: number, sizeX: number, sizeY: number): number {
    let result = 0;
    for (let i = x; i < x + sizeX; i++) {
        for (let j = y; j < y + sizeY; j++) {
            result += cells[i][j];
        }
    }
    return result;
}

function fillCells(serNum: number): number[][] {
    const cells: number[][] = [];
    for (let i = 0; i < cellsSize; i++) {
        const temp: number[] = [];
        for (let j = 0; j < cellsSize; j++) {
            temp.push(0);
        }
        cells.push(temp);
    }
    for (let i = 0; i < cellsSize; i++) {
        for (let j = 0; j < cellsSize; j++) {
            const x = i + 1;
            const y = j + 1;
            const rackID = x + 10;
            const powerLevelTemp = (rackID * y + serNum) * rackID;
            cells[i][j] = getHundreds(powerLevelTemp) - 5;
        }
    }
    return cells;
}

function calculatePart1(): string {
    const cells = fillCells(serialNumber);
    let maxI = 0, maxJ = 0, max = cellsPower(cells, maxI, maxJ, 3, 3);
    for (let i = 0; i < cellsSize - 2; i++) {
        for (let j = 0; j < cellsSize - 2; j++) {
            const power = cellsPower(cells, i, j, 3, 3);
            if (power > max) {
                max = power;
                maxI = i;
                maxJ = j;
            }
        }
    }
    return [maxI + 1, maxJ + 1, max].join(',');
}

function calculatePart2(): string {
    const cells = fillCells(serialNumber);
    let maxSize = 1, maxI = 0, maxJ = 0, max = cellsPower(cells, maxI, maxJ, maxSize, maxSize);
    for (let size = 1; size <= 300; size++) {
        for (let i = 0; i < cellsSize - (size - 1); i++) {
            for (let j = 0; j < cellsSize - (size - 1); j++) {
                const power = cellsPower(cells, i, j, size, size);
                if (power > max) {
                    maxSize = size;
                    maxI = i;
                    maxJ = j;
                    max = power;
                }
            }
        }
    }
    return [maxI + 1, maxJ + 1, maxSize, max].join(',');
}

(function run() {
    console.log(calculatePart1());
    console.log(calculatePart2());
})();
