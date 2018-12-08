import {readFile as readFileCallback} from 'fs';
import {promisify} from 'util';
import {filter, map} from 'ramda';

const readFile = promisify(readFileCallback);

async function readInput(fileName: string): Promise<string[]> {
    const data: Buffer = await readFile(`${__dirname}/${fileName}`);
    const lines: string[] = filter(
        (line: string): boolean => line.length > 0,
        data.toString().split('\n')
    );
    return Promise.resolve(lines);
}

async function calculatePart1(fileName: string): Promise<number> {
    const lines: string[] = await readInput(fileName);
    const rootNode: number[] = map((x: string): number => +x, lines[0].split(' '));

    function parseNode(node: number[]): number {
        const childrenCount: number = node.shift() as number;
        const metadataCount: number = node.shift() as number;
        let sum = 0;
        for (let i = 0; i < childrenCount; i++) {
            sum += parseNode(node);
        }
        for (let i = 0; i < metadataCount; i++) {
            const metadata = node.shift() as number;
            sum += metadata;
        }
        return sum;
    }

    const sum: number = parseNode(rootNode);

    return Promise.resolve(sum);
}

async function calculatePart2(fileName: string): Promise<number> {
    const lines: string[] = await readInput(fileName);
    const rootNode: number[] = map((x: string): number => +x, lines[0].split(' '));

    function parseNode(node: number[]): number {
        const childrenCount: number = node.shift() as number;
        const metadataCount: number = node.shift() as number;
        const sums: { [key: string]: number } = {};
        for (let i = 0; i < childrenCount; i++) {
            sums[i.toString()] = parseNode(node);
        }
        let sum: number = 0;
        for (let i = 0; i < metadataCount; i++) {
            const metadata = node.shift() as number;
            if (childrenCount === 0) {
                sum += metadata;
            } else if ((metadata - 1) in sums) {
                sum += sums[metadata - 1];
            }
        }
        return sum;
    }

    const sum: number = parseNode(rootNode);

    return Promise.resolve(sum);
}

(async () => {
    console.log(await calculatePart1('input-2.txt'));
    console.log(await calculatePart2('input-2.txt'));
})();
