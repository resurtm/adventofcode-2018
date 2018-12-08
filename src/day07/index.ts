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

async function calculatePart1(fileName: string): Promise<string> {
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

    let startLetters: string[] = [], endLetters: string[] = [];
    for (const letter in tree2) {
        if (tree2[letter].length === 0) {
            startLetters.push(letter);
        }
    }
    for (const letter in tree1) {
        if (tree1[letter].length === 0) {
            endLetters.push(letter);
        }
    }
    startLetters.sort();
    endLetters.sort();

    const letters = startLetters.slice();
    const result = [];

    while (true) {
        letters.sort();

        const chosenLetter = letters[0];
        letters.splice(0, 1);

        let found = '';
        const indices = Object.keys(tree2);
        indices.sort();
        for (const idx of indices) {
            if (result.indexOf(idx) !== -1) {
                continue;
            }
            let found2 = true;
            for (const idx2 in tree2[idx]) {
                if (result.indexOf(tree2[idx][idx2]) === -1) {
                    found2 = false;
                }
            }
            if (found2) {
                found = idx;
                break;
            }
        }
        if (found === '') {
            break;
        }
        result.push(found);
    }

    return Promise.resolve(result.join(''));
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

    let startLetters: string[] = [], endLetters: string[] = [];
    for (const letter in tree2) {
        if (tree2[letter].length === 0) {
            startLetters.push(letter);
        }
    }
    for (const letter in tree1) {
        if (tree1[letter].length === 0) {
            endLetters.push(letter);
        }
    }
    startLetters.sort();
    endLetters.sort();

    const letters = startLetters.slice();
    const result = [];

    while (true) {
        letters.sort();

        const chosenLetter = letters[0];
        letters.splice(0, 1);

        let found = '';
        const indices = Object.keys(tree2);
        indices.sort();
        for (const idx of indices) {
            if (result.indexOf(idx) !== -1) {
                continue;
            }
            let found2 = true;
            for (const idx2 in tree2[idx]) {
                if (result.indexOf(tree2[idx][idx2]) === -1) {
                    found2 = false;
                }
            }
            if (found2) {
                found = idx;
                break;
            }
        }
        if (found === '') {
            break;
        }
        result.push(found);
    }

    return Promise.resolve(0);
}


(async () => {
    console.log(await calculatePart1('input-1.txt'));
    console.log(await calculatePart2('input-1.txt'));
})();

// not right, JABRUKUUIFABRUKUUDBRUKURUUWBRUWBRUGABRUKUUFABRUKUUDBRUKURUUWBRUWBRUNABRUKUUKUOABRUKUUBRUDBRUKURUUWBRUWBRURUWBRURUSBRUKUOABRUKUUBRUDBRUKURUUWBRUWBRUOABRUKUUBRUDBRUKURUUWBRUWBRUPHBRUFABRUKUUDBRUKURUUWBRUWBRUSBRUKUOABRUKUUBRUDBRUKURUUWBRUWBRUNABRUKUUKUOABRUKUUBRUDBRUKURUUWBRUWBRURUWBRURUWBRUSBRUKUOABRUKUUBRUDBRUKURUUWBRUWBRUNABRUKUUKUOABRUKUUBRUDBRUKURUUWBRUWBRURUWBRURUSBRUKUOABRUKUUBRUDBRUKURUUWBRUWBRUWBRUC
// not right, JABRUKIFDWGNOSPHC
// not right, JABIFDGKNOPHRSUWC
// not right, JABIFDGKNOPHRRRSSUUUWWWC
// not right, JABCIFDGKMNOPHQRSTUWZELVXYC
