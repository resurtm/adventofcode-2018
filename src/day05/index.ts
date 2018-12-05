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

function reactPolymer(input: string) {
    let prevInput = '';
    while (prevInput !== input) {
        prevInput = input;
        let i = 0;
        while (i < input.length - 1) {
            if (
                input[i] !== input[i + 1] &&
                input[i].toUpperCase() === input[i + 1].toUpperCase() &&
                input[i].toLowerCase() === input[i + 1].toLowerCase()
            ) {
                input = input.substring(0, i) + input.substring(i + 2);
            }
            i++;
        }
    }
    return input;
}

async function calculatePart1(fileName: string): Promise<number> {
    const lines: string[] = await readInput(fileName);
    let input: string = lines[0];
    input = reactPolymer(input);
    return Promise.resolve(input.length);
}

async function calculatePart2(fileName: string): Promise<number> {
    const lines: string[] = await readInput(fileName);
    let input: string = lines[0];
    let min: number = -1;
    for (let i = 65; i <= 90; i++) {
        const toRemove = String.fromCharCode(i);
        console.log(toRemove);
        let str = input;
        str = str.replace(new RegExp(`${toRemove.toLowerCase()}`, 'g'), '');
        str = str.replace(new RegExp(`${toRemove.toUpperCase()}`, 'g'), '');
        str = reactPolymer(str);
        if (min === -1 || str.length < min) {
            min = str.length;
        }
    }
    return Promise.resolve(min);
}

(async () => {
    console.log(await calculatePart1('input-2.txt'));
    console.log(await calculatePart2('input-2.txt'));
})();

// 45957, too high
