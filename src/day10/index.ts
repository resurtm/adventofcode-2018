import {readFile as readFileCallback} from 'fs';
import {promisify} from 'util';
import {filter} from 'ramda';

interface Vector {
    x: number;
    y: number;
}

interface Point {
    pos: Vector;
    vel: Vector;
}

const readFile = promisify(readFileCallback);

async function readInput(fileName: string): Promise<string[]> {
    const data: Buffer = await readFile(`${__dirname}/${fileName}`);
    const lines: string[] = filter(
        (line: string): boolean => line.length > 0,
        data.toString().split('\n')
    );
    return Promise.resolve(lines);
}

async function parseInput(fileName: string): Promise<Point[]> {
    const result: Point[] = [];
    const lines: string[] = await readInput(fileName);
    for (const line of lines) {
        const regExp = /^position=<([\d\s-]+),([\d\s-]+)> velocity=<([\d\s-]+),([\d\s-]+)>$/gm;
        let matches: RegExpExecArray | null;
        let point: Point = {pos: {x: 0, y: 0}, vel: {x: 0, y: 0}};
        while (matches = regExp.exec(line)) {
            point.pos.x = Number(matches[1].trim());
            point.pos.y = Number(matches[2].trim());
            point.vel.x = Number(matches[3].trim());
            point.vel.y = Number(matches[4].trim());
            result.push(point);
        }
    }
    return Promise.resolve(result);
}

function printPoints(points: Point[]): void {
    const maxX = Math.max(...points.map((point: Point) => point.pos.x));
    const minX = Math.min(...points.map((point: Point) => point.pos.x));
    const maxY = Math.max(...points.map((point: Point) => point.pos.y));
    const minY = Math.min(...points.map((point: Point) => point.pos.y));
    const arr: string[][] = [];
    for (let j = minY - 10; j < maxY + 10; j++) {
        const col: string[] = [];
        for (let i = minX - 10; i < maxX + 10; i++) {
            col.push('.');
        }
        arr.push(col);
    }
    for (const point of points) {
        arr[point.pos.y - Math.abs(minY)][point.pos.x - Math.abs(minX)] = '#';
    }
    for (const col of arr) {
        console.log(col.join(''));
    }
}

async function calculatePart1(fileName: string): Promise<string> {
    const points: Point[] = await parseInput(fileName);
    let second: number = 0;
    const seconds: Vector[] = [];
    while (second <= 20000) {
        for (const point of points) {
            point.pos.x += point.vel.x;
            point.pos.y += point.vel.y;
        }
        const maxX = Math.max(...points.map((point: Point) => point.pos.x));
        const minX = Math.min(...points.map((point: Point) => point.pos.x));
        const maxY = Math.max(...points.map((point: Point) => point.pos.y));
        const minY = Math.min(...points.map((point: Point) => point.pos.y));
        seconds.push({
            x: Math.abs(maxX) + Math.abs(minX),
            y: Math.abs(maxY) + Math.abs(minY)
        });
        second++;
        // if (second > 10140 && second < 10150) {
        if (second === 10144) {
            console.log(second);
            printPoints(points);
        }
    }
    let sec = 0, minX = seconds[sec].x, minY = seconds[sec].y;
    for (const idx in seconds) {
        const item = seconds[idx];
        if (minX > item.x || minY > item.y) {
            sec = Number(idx);
            minX = item.x;
            minY = item.y;
        }
    }
    console.log(sec);
    console.log(minX);
    console.log(minY);
    return Promise.resolve('');
}

(async () => {
    console.log(await calculatePart1('input-2.txt'));
})();
