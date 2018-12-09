// const players = 9;
// const finalMarble = 25;

// const players = 30;
// const finalMarble = 5807;

const players = 441;
const finalMarble = 71032;

const chain = [0];
let position = 0;
let current = 0;
let player = 0;
const scores = {};
let iterations = 0;

function previousElement(itemsBack) {
    let idx = position;
    for (let i = 0; i < itemsBack; i++) {
        idx--;
        if (idx === 0) {
            idx = chain.length;
        }
    }
    return [idx, chain[idx]];
}

while (true) {
    // console.log(`[${player}] ${chain.join(' ')}`);

    position += 2;
    position %= chain.length;

    current++;

    player++;
    if (player > players) {
        player = 1;
    }

    if (current % 23 === 0) {
        const prev9 = previousElement(9);
        const prev8 = previousElement(8);

        if (player in scores) {
            scores[player] += prev8[1];
        } else {
            scores[player] = prev8[1];
        }
        scores[player] += current;

        position = prev9[0];

        chain.splice(prev8[0], 1);
    } else {
        chain.splice(position + 1, 0, current);
    }

    if (current > finalMarble) {
        console.log(Math.max(...Object.values(scores)));
        break;
    }

    iterations++;
    // if (iterations === 26) {
    //     break;
    // }
}
