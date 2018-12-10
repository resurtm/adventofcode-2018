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

async function calculatePart2(fileName: string): Promise<number> {
    const lines: string[] = await readInput(fileName);

    const tree1: { [key: string]: string[] } = {};
    const tree2: { [key: string]: string[] } = {};

    for (const line of lines) {
        const regExp = /Step (\w{1}) must be finished before step (\w{1}) can begin./g;
        let matches, step1, step2;
        while (matches = regExp.exec(line)) {
            step1 = matches[1];
            step2 = matches[2];
        }
        if (step1 == null || step2 == null) {
            continue;
        }
        if (!(step1 in tree1)) {
            tree1[step1] = [];
        }
        if (!(step2 in tree1)) {
            tree1[step2] = [];
        }
        if (!(step1 in tree2)) {
            tree2[step1] = [];
        }
        if (!(step2 in tree2)) {
            tree2[step2] = [];
        }
        tree1[step1].push(step2);
        tree2[step2].push(step1);
    }

    interface Worker {
        letter: string;
        seconds: number;
    }

    const workerCount = 2;
    const workers: Worker[] = [];
    for (let i = 0; i < workerCount; i++) {
        workers.push({letter: '-', seconds: -1});
    }

    let seconds = 0;
    const resolved: string[] = [];
    let iters = 0;
    const assigned: string[] = [];

    function isResolved(toTest: string[]) {
        let result = true;
        toTest.forEach((value) => {
            if (resolved.indexOf(value) === -1) {
                result = false;
            }
        });
        return result;
    }

    function getResolvedCount() {
        const keys = Object.keys(tree2);
        let result = 0;
        for (const key of keys) {
            if (isResolved(tree2[key]) && assigned.indexOf(key) === -1) {
                result++;
            }
        }
        return result;
    }

    function getFreeWorker(): Worker {
        for (let i = 0; i < workers.length; i++) {
            if (workers[i].letter === '-') {
                return workers[i];
            }
        }
        return {letter: 'x', seconds: -1};
        // const freeWorkers = workers.filter((worker: Worker): boolean => {
        //     return worker.letter === '-';
        // });
        // return freeWorkers.length === 0 ? {letter: 'x', seconds: -1} : freeWorkers[0];
    }

    while (true) {
        const keys = Object.keys(tree2);
        keys.sort();

        let freeWorker: Worker;
        let resolvedCount = getResolvedCount();
        while (true) {
            freeWorker = getFreeWorker();
            if (freeWorker.letter === 'x' || resolvedCount === 0) {
                break;
            }

            for (const key of keys) {
                if (isResolved(tree2[key]) && assigned.indexOf(key) === -1 && resolved.indexOf(key) === -1) {
                    assigned.push(key);
                    freeWorker.letter = key;
                    freeWorker.seconds = 0;
                    resolvedCount--;
                }
            }
        }

        console.log(workers);

        for (let i = 0; i < workers.length; i++) {
            if (workers[i].letter === '-') {
                continue;
            }
            const finishSeconds = workers[i].letter.charCodeAt(0) - 64;
            if (workers[i].seconds === finishSeconds) {
                resolved.push(workers[i].letter);
                workers[i] = {letter: '-', seconds: -1};
            }
            workers[i].seconds++;
        }

        iters++;
        if (iters === 7) {
            break;
        }
    }

    return Promise.resolve(0);
}


(async () => {
    console.log(await calculatePart2('input-1.txt'));
})();
