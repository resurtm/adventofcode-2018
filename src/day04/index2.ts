import {readFile as readFileCallback} from 'fs';
import {promisify} from 'util';
import {filter} from 'ramda';
import moment from 'moment';

const readFile = promisify(readFileCallback);

function calculatePart1(lines: string[]): number {
    const guards: { [key: number]: { [key: string]: number } } = {};
    let currentGuard = -1;
    let sleepStart = moment();

    for (const line of lines) {
        const regExp = /^\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})\] (Guard #(\d+) begins shift|falls asleep|wakes up)$/g;
        let matches;
        while (matches = regExp.exec(line)) {
            const [_, year, month, day, hour, minute] = matches;
            if (matches[7] != null) {
                currentGuard = Number(matches[7]);
                if (!(currentGuard in guards)) {
                    guards[currentGuard] = {};
                }
            } else if (matches[6] === 'wakes up') {
                const sleepEnd = moment(`${year}-${month}-${day} ${hour}:${minute}`);
                for (sleepStart; sleepStart.isBefore(sleepEnd); sleepStart.add(1, 'minutes')) {
                    const formatted = sleepStart.format('mm');
                    if (!(formatted in guards[currentGuard])) {
                        guards[currentGuard][formatted] = 0;
                    }
                    guards[currentGuard][formatted] += 1;
                }
            } else if (matches[6] === 'falls asleep') {
                sleepStart = moment(`${year}-${month}-${day} ${hour}:${minute}`);
            }
        }
    }

    let maxGuard = -1, maxGuardVal = -1;
    for (const guard in guards) {
        let len = 0;
        for (const minute in guards[guard]) {
            len += Number(guards[guard][minute]);
        }
        if (maxGuardVal < len) {
            maxGuard = Number(guard);
            maxGuardVal = len;
        }
    }

    let maxValTime = '', maxVal = -1;
    for (const time in guards[maxGuard]) {
        const val = guards[maxGuard][time];
        if (maxVal < Number(val)) {
            maxVal = val;
            maxValTime = time;
        }
    }

    console.log(guards[maxGuard]);

    console.log(Number(maxValTime));
    console.log(maxGuard);
    console.log(maxGuardVal);

    return Number(maxValTime) * maxGuard;
}

(async () => {
    const inputData = await readFile(`${__dirname}/input-1.txt`);
    const inputLines = filter((line) => line.length > 0, inputData.toString().split('\n'));

    console.log(calculatePart1(inputLines));
    // console.log(calculatePart2(inputLines));
})();

// 4064, too low
// 102517, too high
// 77941, answer
