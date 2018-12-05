import {readFile as readFileCallback} from 'fs';
import {promisify} from 'util';
import {filter} from 'ramda';

const readFile = promisify(readFileCallback);

function calculatePart1(lines: string[]): number {
    const areaX = 10000;
    const areaY = 10000;

    const area: number[][] = [];
    for (let i = 0; i < areaX; i++) {
        const column: number[] = [];
        for (let j = 0; j < areaY; j++) {
            column.push(0);
        }
        area.push(column);
    }


    for (const line of lines) {
        let num: number = 0, posX: number = 0, posY: number = 0, sizeX: number = 0, sizeY: number = 0;
        const regExp = new RegExp('^#(\\d+) @ (\\d+),(\\d+): (\\d+)x(\\d+)$', 'gm');
        let match;
        do {
            match = regExp.exec(line);
            if (match) {
                num = Number(match[1]);
                posX = Number(match[2]);
                posY = Number(match[3]);
                sizeX = Number(match[4]);
                sizeY = Number(match[5]);

                for (let i = posX; i < posX + sizeX; i++) {
                    for (let j = posY; j < posY + sizeY; j++) {
                        area[i][j] += 1;
                    }
                }

                break;
            }
        } while (match);
    }

    let result = 0;
    for (let i = 0; i < areaX; i++) {
        for (let j = 0; j < areaY; j++) {
            if (area[i][j] >= 2) {
                result += 1;
            }
        }
    }
    return result;
}

function calculatePart2(lines: string[]): number {
    const areaX = 10000;
    const areaY = 10000;

    const area: number[][] = [];
    for (let i = 0; i < areaX; i++) {
        const column: number[] = [];
        for (let j = 0; j < areaY; j++) {
            column.push(0);
        }
        area.push(column);
    }


    for (const line of lines) {
        let num: number = 0, posX: number = 0, posY: number = 0, sizeX: number = 0, sizeY: number = 0;
        const regExp = new RegExp('^#(\\d+) @ (\\d+),(\\d+): (\\d+)x(\\d+)$', 'gm');
        let match;
        do {
            match = regExp.exec(line);
            if (match) {
                num = Number(match[1]);
                posX = Number(match[2]);
                posY = Number(match[3]);
                sizeX = Number(match[4]);
                sizeY = Number(match[5]);

                for (let i = posX; i < posX + sizeX; i++) {
                    for (let j = posY; j < posY + sizeY; j++) {
                        area[i][j] += 1;
                    }
                }

                break;
            }
        } while (match);
    }

    for (const line of lines) {
        let num: number = 0, posX: number = 0, posY: number = 0, sizeX: number = 0, sizeY: number = 0;
        const regExp = new RegExp('^#(\\d+) @ (\\d+),(\\d+): (\\d+)x(\\d+)$', 'gm');
        let match;
        do {
            match = regExp.exec(line);
            if (match) {
                num = Number(match[1]);
                posX = Number(match[2]);
                posY = Number(match[3]);
                sizeX = Number(match[4]);
                sizeY = Number(match[5]);

                let allOne = true;
                for (let i = posX; i < posX + sizeX; i++) {
                    for (let j = posY; j < posY + sizeY; j++) {
                        if (area[i][j] !== 1) {
                            allOne = false;
                            break;
                        }
                    }
                }
                if (allOne) {
                    return num;
                }

                break;
            }
        } while (match);
    }
    return -1;
}

(async () => {
    const inputData = await readFile(`${__dirname}/input-1.txt`);
    const inputLines = filter((line) => line.length > 0, inputData.toString().split('\n'));

    console.log(calculatePart1(inputLines));
    console.log(calculatePart2(inputLines));
})();
