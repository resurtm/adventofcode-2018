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

async function prepareInput(fileName: string): Promise<{ initialState: string, changeRules: string[][], originPos: number }> {
    const lines: string[] = await readInput(fileName);
    const initialState: string = lines[0].split(' ')[2];
    const changeRules: string[][] = [];
    lines.shift();
    for (const line of lines) {
        const splitted: string[] = line.split(' ');
        changeRules.push([splitted[0], splitted[2]])
    }
    const padLeft = 1000;
    const padRight = 1000;
    return {
        initialState:
            '.'.padStart(padLeft, '.') + initialState + '.'.padStart(padRight, '.'),
        changeRules,
        originPos: padLeft,
    };
}

function quoteRegExp(str: string) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}

function trim(s: string, c: string): string {
    if (c === "]") c = "\\]";
    if (c === "\\") c = "\\\\";
    return s.replace(new RegExp(
        "^[" + c + "]+|[" + c + "]+$", "g"
    ), "");
}

async function calculatePart1(fileName: string): Promise<number> {
    let {initialState: state, changeRules: rules, originPos} = await prepareInput(fileName);
    let generation = 0;
    while (generation < 20) {
        // console.log(`${generation.toString().padStart(2, ' ')}: ${state}`);
        generation++;

        let newState = state.replace(/[#.]{1}/g, '.');
        for (let i = 0; i < state.length - 5; i++) {
            const sub = state.substr(i, 5);
            for (const [wasBefore, shoudBe] of rules) {
                if (wasBefore === sub) {
                    newState = newState.substring(0, i + 2) + shoudBe + newState.substring(i + 3);
                }
            }
        }

        state = newState;
    }
    return Promise.resolve(stateSum(state, originPos));
}

function stateSum(ctxState: string, originPos: number): number {
    let sum = 0;
    for (let idx = 0; idx < ctxState.length; idx++) {
        if (ctxState[idx] === '#') {
            sum += idx - originPos;
        }
    }
    return sum;
}

async function calculatePart2(fileName: string): Promise<number> {
    let {initialState: state, changeRules: rules, originPos} = await prepareInput(fileName);
    let generation = 0;
    const cache = new Set();
    const cache2: string[] = [];
    while (generation < 50000000000) {
        // console.log(`${generation.toString().padStart(2, ' ')}: ${state}`);
        generation++;

        let newState = state.replace(/[#.]{1}/g, '.');
        for (let i = 0; i < state.length - 5; i++) {
            const sub = state.substr(i, 5);
            for (const [wasBefore, shoudBe] of rules) {
                if (wasBefore === sub) {
                    newState = newState.substring(0, i + 2) + shoudBe + newState.substring(i + 3);
                }
            }
        }

        state = newState;

        const trimmed = trim(state, '4300000002500.');
        if (cache.has(trimmed)) {
            break;
        }
        cache.add(trimmed);
        cache2.push(state);
    }
    // console.log(cache2[generation - 1]);
    // console.log(cache2[generation - 2]);
    // console.log(cache2[generation - 3]);
    const result = (50000000000 - generation - 2) * (stateSum(cache2[generation - 2], originPos) - stateSum(cache2[generation - 3], originPos));
    // const diff = stateSum(cache2[cache2.length - 1], originPos) - stateSum(cache2[0], originPos);
    // const times = Math.floor(50000000000 / cache2.length);
    // let gen = times * cache2.length;
    // let gen2 = 0;
    // while (gen <= 50000000100) {
    //     gen++;
    //     gen2++;
    //     console.log(times * diff + stateSum(cache2[gen2], originPos));
    // }
    // return Promise.resolve(stateSum(cache2[gen], originPos));
    return Promise.resolve(result);
}

(async () => {
    console.log(await calculatePart1('input-2.txt'));
    console.log(await calculatePart2('input-2.txt'));
})();
