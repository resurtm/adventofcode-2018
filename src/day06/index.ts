import {readFile as readFileCallback} from 'fs';
import {promisify} from 'util';
import {filter, map, values, reduce} from 'ramda';

interface Point {
    x: number;
    y: number;
}

interface MinMax {
    min: {
        x: number;
        y: number;
    };
    max: {
        x: number;
        y: number;
    };
}

type Distances = { [key: string]: number };

const fieldPaddingBase = 50;

const fieldPadding2Base = 50;
const distanceCap = 10000;

const readFile = promisify(readFileCallback);

async function readInput(fileName: string): Promise<string[]> {
    const data: Buffer = await readFile(`${__dirname}/${fileName}`);
    const lines: string[] = filter(
        (line: string): boolean => line.length > 0,
        data.toString().split('\n')
    );
    return Promise.resolve(lines);
}

function parseLines(lines: string[]): Point[] {
    const items: Point[] = map((line: string): Point => {
        const parts = map(
            (part: string): Number => Number(part.trim()),
            line.split(',')
        );
        return <Point>{x: parts[0], y: parts[1]};
    }, lines);
    return items;
}

function findMinMax(items: Point[]): MinMax {
    const minMax: MinMax = <MinMax>{
        min: {x: -1, y: -1},
        max: {x: -1, y: -1}
    };
    for (const item of items) {
        if (minMax.max.x === -1 || item.x > minMax.max.x) {
            minMax.max.x = item.x;
        }
        if (minMax.min.x === -1 || item.x < minMax.min.x) {
            minMax.min.x = item.x;
        }
        if (minMax.max.y === -1 || item.y > minMax.max.y) {
            minMax.max.y = item.y;
        }
        if (minMax.min.y === -1 || item.y < minMax.min.y) {
            minMax.min.y = item.y;
        }
    }
    return minMax;
}

function calcDistance(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

async function calculatePart1(fileName: string): Promise<number> {
    const lines = await readInput(fileName);
    const items = parseLines(lines);
    const minMax = findMinMax(items);

    const nearestItems: Distances[] = [];
    for (let fieldPadding: number = fieldPaddingBase; fieldPadding < fieldPaddingBase + 2; fieldPadding += 1) {
        const nearest: Distances = {};
        for (let x = minMax.min.x - fieldPadding; x < minMax.max.x + fieldPadding; x += 1) {
            for (let y = minMax.min.y - fieldPadding; y < minMax.max.y + fieldPadding; y += 1) {
                const distances: Distances = {};
                for (const itemIdx in items) {
                    const item = items[itemIdx];
                    distances[itemIdx] = calcDistance(item, <Point>{x, y});
                }

                let minDistance = -1, minDistanceIdx = -1;
                for (const distanceIdx in distances) {
                    const distance = distances[distanceIdx];
                    if (minDistance === -1 || distance < minDistance) {
                        minDistance = distance;
                        minDistanceIdx = Number(distanceIdx);
                    }
                }

                let minDistancesCount = 0;
                for (const distanceIdx in distances) {
                    const distance = distances[distanceIdx];
                    if (minDistance === distance) {
                        minDistancesCount += 1;
                    }
                }
                if (minDistancesCount === 1) {
                    if (!(minDistanceIdx in nearest)) {
                        nearest[minDistanceIdx] = 0;
                    }
                    nearest[minDistanceIdx] += 1;
                }
            }
        }
        nearestItems.push(nearest);
    }

    let maxCells = 0;
    for (const i in nearestItems[0]) {
        for (const j in nearestItems[1]) {
            if (nearestItems[0][i] === nearestItems[1][j] && maxCells < nearestItems[0][i]) {
                maxCells = nearestItems[0][i];
            }
        }
    }

    return Promise.resolve(maxCells);
}

async function calculatePart2(fileName: string): Promise<number> {
    const lines = await readInput(fileName);
    const items = parseLines(lines);
    const minMax = findMinMax(items);

    let result = 0;
    for (let x = minMax.min.x - fieldPadding2Base; x < minMax.max.x + fieldPadding2Base; x += 1) {
        for (let y = minMax.min.y - fieldPadding2Base; y < minMax.max.y + fieldPadding2Base; y += 1) {
            const distances: Distances = {};
            for (const itemIdx in items) {
                const item = items[itemIdx];
                distances[itemIdx] = calcDistance(item, <Point>{x, y});
            }
            const sum = reduce<number, number>((acc: number, elem: number): number => acc + elem, 0, values(distances));
            if (sum < distanceCap) {
                result += 1;
            }
        }
    }

    return Promise.resolve(result);
}

(async () => {
    // console.log(await calculatePart1('input-2.txt'));
    console.log(await calculatePart2('input-2.txt'));
})();
