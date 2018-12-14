import {readFile as readFileCallback} from 'fs';
import {promisify} from 'util';
import {filter, forEachObjIndexed, reduce} from 'ramda';

enum Turn {
    Left = 0,
    Direct = 1,
    Right = 2,
}

enum State {
    Empty = 0, // ' '
    CartUp = 1, // '^'
    CartRight = 2, // '>'
    CartDown = 3, // 'v'
    CartLeft = 4, // '<'
    TrackUpDown = 5, // '|'
    TrackRightLeft = 6, // '-'
    TrackCross = 7, // '+'
    TurnTopRight = 8, // '\'
    TurnRightBottom = 9, // '/'
    TrackCrash = 10, // 'X'
}

type StateMap = { [key: string]: State };

const stateMap: StateMap = {
    ' ': State.Empty,
    '^': State.CartUp,
    '>': State.CartRight,
    'v': State.CartDown,
    '<': State.CartLeft,
    '|': State.TrackUpDown,
    '-': State.TrackRightLeft,
    '+': State.TrackCross,
    '\\': State.TurnTopRight,
    '/': State.TurnRightBottom,
    'X': State.TrackCrash,
};

interface Vector {
    x: number;
    y: number;
}

interface Cart {
    position: Vector;
    prevPos: Vector;
    direction: State;
    turn: Turn;
    crashed: boolean;
}

const stateReverseMap: string[] = [];
forEachObjIndexed<StateMap>(
    (v: State, k: string | number, _: StateMap) => stateReverseMap[v] = k as string,
    stateMap,
);

const readFile = promisify(readFileCallback);

async function readInput(fileName: string): Promise<string[]> {
    const data: Buffer = await readFile(`${__dirname}/${fileName}`);
    const lines: string[] = filter(
        (line: string): boolean => line.length > 0,
        data.toString().split('\n')
    );
    return Promise.resolve(lines);
}

function replaceCartOnMap(state: State): State {
    switch (state) {
        case State.CartUp:
        case State.CartDown:
            return State.TrackUpDown;
        case State.CartRight:
        case State.CartLeft:
            return State.TrackRightLeft;
        default:
            return state;
    }
}

async function prepareInput(fileName: string, replaceCarts: boolean = true): Promise<State[][]> {
    const lines: string[] = await readInput(fileName);
    const maxLen = reduce<string, number>(
        (acc: number, elem: string) => acc < elem.length ? elem.length : acc,
        0,
        lines,
    );
    const cells: State[][] = [];
    for (let x = 0; x < maxLen; x++) {
        const col: State[] = [];
        for (let y = 0; y < lines.length; y++) {
            if (x < lines[y].length) {
                col.push(
                    replaceCarts
                        ? replaceCartOnMap(stateMap[lines[y][x]])
                        : stateMap[lines[y][x]],
                );
            } else {
                col.push(State.Empty);
            }
        }
        cells.push(col);
    }
    return Promise.resolve(cells);
}

function findCarts(state: State[][]): Cart[] {
    const carts: Cart[] = [];
    for (let x in state) {
        for (let y in state[x]) {
            const s = state[x][y];
            if (s === State.CartUp || s === State.CartRight || s === State.CartDown || s === State.CartLeft) {
                carts.push({
                    position: {
                        x: Number(x),
                        y: Number(y),
                    },
                    prevPos: {
                        x: -1,
                        y: -1,
                    },
                    direction: s,
                    turn: Turn.Left,
                    crashed: false,
                });
            }
        }
    }
    return carts;
}

function debug(state: State[][], carts: Cart[]): void {
    let out: string = '';
    for (let y = 0; y < state[0].length; y++) {
        for (let x = 0; x < state.length; x++) {
            let cartFound = false;
            for (const cart of carts) {
                if (cart.position.x === x && cart.position.y === y) {
                    cartFound = true;
                    out += stateReverseMap[cart.direction];
                    break;
                }
            }
            if (!cartFound) {
                out += stateReverseMap[state[x][y]];
            }
        }
        out += '\n';
    }
    console.log(out);
}

function debugCarts(carts: Cart[]): void {
    let out: string = '';
    for (const cart of carts) {
        out += `[${cart.position.x},${cart.position.y},${cart.direction}]`;
    }
    console.log(out);
}

async function calculatePart1(fileName: string): Promise<Vector> {
    const state: State[][] = await prepareInput(fileName);
    const carts: Cart[] = findCarts(await prepareInput(fileName, false));
    let firstCrash: Vector | null = null;

    let tick = 0;
    // while (tick < 10) {
    while (true) {
        tick++;

        // if (tick === 136) {
        //     debug(state, carts);
        //     break;
        // }

        // console.log(tick);
        // debug(state, carts);
        // debugCarts(carts);

        for (const idx in carts) {
            if (carts[idx].crashed) {
                continue;
            }

            let {position: {x, y}, direction, turn} = carts[idx];
            carts[idx].prevPos = {x, y};

            if (state[x][y] === State.TrackCross) {
                switch (turn) {
                    case Turn.Left:
                        switch (direction) {
                            case State.CartUp:
                                x--;
                                direction = State.CartLeft;
                                break;
                            case State.CartRight:
                                y--;
                                direction = State.CartUp;
                                break;
                            case State.CartDown:
                                x++;
                                direction = State.CartRight;
                                break;
                            case State.CartLeft:
                                y++;
                                direction = State.CartDown;
                                break;
                        }
                        break;
                    case Turn.Direct:
                        switch (direction) {
                            case State.CartUp:
                                y--;
                                break;
                            case State.CartRight:
                                x++;
                                break;
                            case State.CartDown:
                                y++;
                                break;
                            case State.CartLeft:
                                x--;
                                break;
                        }
                        break;
                    case Turn.Right:
                        switch (direction) {
                            case State.CartUp:
                                x++;
                                direction = State.CartRight;
                                break;
                            case State.CartRight:
                                y++;
                                direction = State.CartDown;
                                break;
                            case State.CartDown:
                                x--;
                                direction = State.CartLeft;
                                break;
                            case State.CartLeft:
                                y--;
                                direction = State.CartUp;
                                break;
                        }
                        break;
                }
                turn = (turn + 1) % 3;
            } else if (state[x][y] === State.TurnRightBottom) {
                switch (direction) {
                    case State.CartUp:
                        x++;
                        direction = State.CartRight;
                        break;
                    case State.CartRight:
                        y--;
                        direction = State.CartUp;
                        break;
                    case State.CartDown:
                        x--;
                        direction = State.CartLeft;
                        break;
                    case State.CartLeft:
                        y++;
                        direction = State.CartDown;
                        break;
                }
            } else if (state[x][y] === State.TurnTopRight) {
                switch (direction) {
                    case State.CartUp:
                        x--;
                        direction = State.CartLeft;
                        break;
                    case State.CartRight:
                        y++;
                        direction = State.CartDown;
                        break;
                    case State.CartDown:
                        x++;
                        direction = State.CartRight;
                        break;
                    case State.CartLeft:
                        y--;
                        direction = State.CartUp;
                        break;
                }
            } else {
                switch (direction) {
                    case State.CartUp:
                        y--;
                        break;
                    case State.CartRight:
                        x++;
                        break;
                    case State.CartDown:
                        y++;
                        break;
                    case State.CartLeft:
                        x--;
                        break;
                }
            }

            carts[idx].position = {x, y};
            carts[idx].direction = direction;
            carts[idx].turn = turn;

            for (let i = 0; i < carts.length; i++) {
                for (let j = 0; j < carts.length; j++) {
                    if (i === j || carts[i].crashed || carts[j].crashed) {
                        continue;
                    }
                    if (equalPos(carts[i].position, carts[j].position)) {
                        if (firstCrash === null) {
                            firstCrash = carts[j].position;
                        }
                        // console.log(tick);
                        return Promise.resolve(carts[j].position);
                        carts[i].crashed = true;
                        carts[j].crashed = true;
                    }
                }
            }
        }

        let crashedCount = 0;
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].crashed) {
                crashedCount++;
            }
        }
        if (carts.length - 1 === crashedCount) {
            for (let i = 0; i < carts.length; i++) {
                if (!carts[i].crashed) {
                    console.log(carts[i].position)
                }
            }
            break;
        }

        carts.sort((a, b): number => (a.position.x * 10000 + a.position.y) < (b.position.x * 10000 + b.position.y) ? -1 : 1);
    }

    console.log(firstCrash);
    return Promise.resolve({x: -1, y: -1});
}

function equalPos(a: Vector, b: Vector): boolean {
    return a.x === b.x && a.y === b.y;
}

(async () => {
    console.log(await calculatePart1('input-5.txt'));
    // console.log(await calculatePart2('input-1.txt'));
})();

// 123,41, not right
// 18,48, not right
