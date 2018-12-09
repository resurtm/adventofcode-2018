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

async function parseInput(fileName: string): Promise<{ players: number, points: number }> {
    const lines: string[] = await readInput(fileName);
    const input: string = lines[0];
    const matches = input.match(/(\d+) players; last marble is worth (\d+) points/);
    if (matches == null) {
        throw new Error('Invalid input');
    }
    return Promise.resolve({players: +matches[1], points: +matches[2]});
}

async function calculatePart1(fileName: string): Promise<number> {
    const {players, points} = await parseInput(fileName);

    const chain: number[] = [];
    let current: number = 0;
    let index: number = 0;
    let player: number = 0;
    const scores: { [key: string]: number } = {};
    let times = 0;
    let skip = false;

    while (true) {
        if (skip) {
            skip = false;
        } else {
            chain.splice(index + 1, 0, current);
        }
        console.log(player + ': ' + chain.join(' '));

        player++;
        if (player > players) {
            player = 1;
        }

        times++;
        current++;
        index += 2;
        index %= chain.length;

        if (current % 23 === 0) {
            if (player in scores) {
                scores[player] += current;
            } else {
                scores[player] = current;
            }

            let prev = index;
            prev -= 7;
            prev %= chain.length;
            prev = Math.abs(prev);

            // chain.splice(prev, 0, chain[prev]);
            index = prev;

            skip = true;

            index -= 8;
            index %= chain.length;
            index = Math.abs(index);

            chain.splice(index, 1);
        }

        if (times === 26) {
            break;
        }
    }

    return Promise.resolve(0);
}

(async () => {
    console.log(await calculatePart1('input-1.txt'));
})();
