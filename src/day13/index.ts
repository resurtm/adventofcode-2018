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
    direction: State;
    crosses: { [coord: string]: Turn }; // coord is for example '12_5' i.e. 'x_y'
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
                    direction: s,
                    crosses: {},
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

async function calculatePart1(fileName: string): Promise<number> {
    const state: State[][] = await prepareInput(fileName);
    const carts: Cart[] = findCarts(await prepareInput(fileName, false));

    let tick = 0;
    while (tick < 50) {
        console.log(tick);
        debug(state, carts);

        for (const idx in carts) {
            let {position: {x, y}, direction, crosses} = carts[idx];

            if (state[x][y] === State.TrackCross) {
                const coord = `${x}_${y}`;
                let turn: Turn;
                if (coord in crosses) {
                    turn = crosses[coord];
                    crosses[coord] = (crosses[coord] + 1) % 3;
                } else {
                    turn = Turn.Left;
                    crosses[coord] = Turn.Direct;
                }
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
            carts[idx].crosses = crosses;
        }

        for (let i = 0; i < carts.length; i++) {
            for (let j = 0; j < carts.length; j++) {
                if (i === j) {
                    continue;
                }
                if (carts[i].position.x === carts[j].position.x && carts[i].position.y === carts[j].position.y) {
                    break;
                }
            }
        }

        tick++;
    }

    return Promise.resolve(tick);
}

(async () => {
    console.log(await calculatePart1('input-2.txt'));
    // console.log(await calculatePart2('input-1.txt'));
})();
