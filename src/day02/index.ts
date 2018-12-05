import {readFile as readFileCallback} from 'fs';
import {promisify} from "util";
import {filter, reduce} from 'ramda';
import levenshtein from 'fast-levenshtein';

const readFile = promisify(readFileCallback);

function hasCount(str: string, num: number): boolean {
    const map: { [key: string]: number } = {};
    for (const char of str.split('')) {
        if (!(char in map)) {
            map[char] = 0;
        }
        map[char] += 1;
    }
    for (const times in map) {
        if (map[times] === num) {
            return true;
        }
    }
    return false
}

function calc1(input: string[]): number {
    let twoTimes = 0, threeTimes = 0;
    for (const line of input) {
        if (hasCount(line, 2)) {
            twoTimes += 1;
        }
        if (hasCount(line, 3)) {
            threeTimes += 1;
        }
    }
    return twoTimes * threeTimes;
}

function calc2(input: string[]): string {
    let min = 9999, imin = -1, jmin = -1;
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            const dist = levenshtein.get(input[i], input[j]);
            if (dist < min) {
                min = dist;
                imin = i;
                jmin = j;
            }
        }
    }
    const sa = input[imin].split('');
    const sb = input[jmin].split('');
    const res = [];
    for (let i = 0; i < sa.length; i++) {
        if (sa[i] === sb[i]) {
            res.push(sa[i]);
        }
    }
    return res.join('');
}


(async () => {
    const inputData = await readFile(`${__dirname}/input2.txt`);
    const input = filter((line) => line.length > 0, inputData.toString().split('\n'));

    console.log(calc1(input));
    console.log(calc2(input));
})();
