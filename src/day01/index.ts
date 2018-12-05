import {readFile as readFileCallback} from 'fs';
import {promisify} from "util";
import {filter, reduce} from 'ramda';

const readFile = promisify(readFileCallback);

// const calc1 = (input: string[]): number => reduce((acc, elem: string): number => {
//     const op = elem[0];
//     const delta = Number(elem.slice(1));
//     switch (op) {
//         case '-':
//             acc -= delta;
//             break;
//         case '+':
//             acc += delta;
//             break;
//     }
//     return acc;
// }, 0, input);

const calc1 = (input: string[]): number =>
    reduce((acc, elem: string): number =>
        elem[0] === '+' ? acc + Number(elem.slice(1)) : acc - Number(elem.slice(1)),
        0, input);

const calc2 = (input: string[]): number => {
    const freq = new Set();
    let curPos = 0;
    let curIdx = 0;
    while (true) {
        const elem = input[curIdx];

        const delta = Number(elem.slice(1));
        switch (elem[0]) {
            case '-':
                curPos -= delta;
                break;
            case '+':
                curPos += delta;
                break;
            default:
                throw new Error('Unknown operation');
        }

        if (freq.has(curPos)) {
            break;
        }
        freq.add(curPos);

        curIdx += 1;
        if (curIdx === input.length) {
            curIdx = 0;
        }
    }
    return curPos;
};

(async () => {
    const inputData = await readFile(`${__dirname}/input.txt`);
    const input = filter((line) => line.length > 0, inputData.toString().split('\n'));

    console.log(calc1(input));
    console.log(calc2(input));
})();
