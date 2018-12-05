import {readFile as readFileCallback} from 'fs';
import {promisify} from 'util';
import {filter, map, reduce, values, max} from 'ramda';

const readFile = promisify(readFileCallback);

async function readInput(fileName: string): Promise<string[]> {
    const data: Buffer = await readFile(`${__dirname}/${fileName}`);
    const lines: string[] = filter(
        (line: string): boolean => line.length > 0,
        data.toString().split('\n')
    );
    return Promise.resolve(lines);
}

interface TimeEntry {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}

enum State {
    Start,
    SleepStart,
    SleepEnd
}

interface TimeEntryParseResult {
    guard?: number;
    state: State;
    timeEntry: TimeEntry;
}

function parseTimeEntry(timeEntry: string): TimeEntryParseResult {
    const regExp = /^\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})\] (Guard #(\d+) begins shift|falls asleep|wakes up)$/g;
    let matches;
    while (matches = regExp.exec(timeEntry)) {
        const [_, year, month, day, hour, minute] = matches;
        const timeEntry: TimeEntry = {
            year: Number(year),
            month: Number(month),
            day: Number(day),
            hour: Number(hour),
            minute: Number(minute)
        };
        if (matches[7] != null) {
            const result: TimeEntryParseResult = {timeEntry, guard: Number(matches[7]), state: State.Start};
            return result;
        } else if (matches[6] === 'wakes up') {
            const result: TimeEntryParseResult = {timeEntry, state: State.SleepEnd};
            return result;
        } else if (matches[6] === 'falls asleep') {
            const result: TimeEntryParseResult = {timeEntry, state: State.SleepStart};
            return result;
        }
    }
    throw new Error(`Unable to parse the time entry: ${timeEntry}`);
}

function generateMinutesMap(results: TimeEntryParseResult[]): { [key: number]: { [key: number]: number } } {
    const map: { [key: number]: { [key: number]: number } } = {};
    let guard: number = 0;
    let sleepStart: TimeEntry = {minute: 0, day: 0, hour: 0, month: 0, year: 0};
    let sleepEnd: TimeEntry = {minute: 0, day: 0, hour: 0, month: 0, year: 0};
    for (const result of results) {
        if (result.state === State.Start && result.guard != null) {
            guard = result.guard;
            if (!(result.guard in map)) {
                map[result.guard] = {};
            }
        } else if (result.state === State.SleepStart) {
            sleepStart = result.timeEntry;
        } else if (result.state === State.SleepEnd) {
            sleepEnd = result.timeEntry;
            if (sleepEnd.minute >= sleepStart.minute) {
                for (let i = sleepStart.minute; i < sleepEnd.minute; i++) {
                    if (!(i in map[guard])) {
                        map[guard][i] = 0;
                    }
                    map[guard][i] += 1;
                }
            } else if (sleepEnd.minute < sleepStart.minute) {
                for (let i = 0; i < sleepEnd.minute; i++) {
                    if (!(i in map[guard])) {
                        map[guard][i] = 0;
                    }
                    map[guard][i] += 1;
                }
                for (let i = sleepStart.minute; i < 60; i++) {
                    if (!(i in map[guard])) {
                        map[guard][i] = 0;
                    }
                    map[guard][i] += 1;
                }
            }
        }
    }
    return map;
}

async function calculatePart1(fileName: string): Promise<number> {
    const lines: string[] = await readInput(fileName);
    lines.sort();
    const timeEntries: TimeEntryParseResult[] = map(
        (line: string): TimeEntryParseResult => parseTimeEntry(line),
        lines
    );
    const minutesMap = generateMinutesMap(timeEntries);

    let maxGuard = -1, maxGuardMinutes = -1;
    for (const guard in minutesMap) {
        const minutes = minutesMap[guard];
        const totalMinutes = reduce((acc, elem) => acc + elem, 0, values(minutes));
        if (totalMinutes > maxGuardMinutes) {
            maxGuardMinutes = totalMinutes;
            maxGuard = Number(guard);
        }
    }

    let maxMinuteIdx = -1, maxMinuteVal = -1;
    for (const minuteIdx in minutesMap[maxGuard]) {
        const minuteVal = minutesMap[maxGuard][minuteIdx];
        if (minuteVal > maxMinuteVal) {
            maxMinuteIdx = Number(minuteIdx);
            maxMinuteVal = minuteVal;
        }
    }

    return Promise.resolve(maxMinuteIdx * maxGuard);
}

async function calculatePart2(fileName: string): Promise<number> {
    const lines: string[] = await readInput(fileName);
    lines.sort();
    const timeEntries: TimeEntryParseResult[] = map(
        (line: string): TimeEntryParseResult => parseTimeEntry(line),
        lines
    );
    const minutesMap = generateMinutesMap(timeEntries);

    const allGuards: number[] = map((x) => Number(x), Object.keys(minutesMap));
    let maxMinute = -1, maxGuard = -1, maxMinuteIdx = -1;
    for (let minute = 0; minute < 60; minute++) {
        let maxGuardIdx = -1, maxGuardVal = -1;
        for (const guardIdx in minutesMap) {
            const guardVal = minutesMap[guardIdx][minute];
            if (guardVal > maxGuardVal) {
                maxGuardVal = guardVal;
                maxGuardIdx = Number(guardIdx);
            }
        }
        if (maxGuardVal > maxMinute) {
            maxMinute = maxGuardVal;
            maxMinuteIdx = minute;
            maxGuard = maxGuardIdx;
        }
    }

    return Promise.resolve(maxMinuteIdx * maxGuard);
}

(async () => {
    console.log(await calculatePart1('input-1.txt'));
    console.log(await calculatePart2('input-1.txt'));
})();
