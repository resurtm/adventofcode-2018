// const players = 9;
// const finalMarble = 100;

// const players = 30;
// const finalMarble = 5807;

// const players = 10;
// const finalMarble = 1618;

const players = 441;
const finalMarble = 71032 * 100;

let node = {prev: null, next: null, value: 0};
let head = node;
let tail = node;

let player = 0;
const scores = {};
let iterations = 0;

function toArray() {
    let iter = head;
    const items = [];
    while (true) {
        items.push(iter.value);
        if (iter.next == null) {
            break;
        }
        iter = iter.next;
    }
    return items;
}

function proceed() {
    if (node.next == null) {
        node = head;
    } else {
        node = node.next;
    }
}

function backTo(num) {
    // let iter = Object.assign({}, node);
    let iter = node;
    while (num > 0) {
        if (iter.prev == null) {
            iter = tail;
        } else {
            iter = iter.prev;
        }
        num--;
    }
    return iter;
}

while (true) {
    // console.log(`[${player}] ${toArray().join(' ')}`);

    proceed();
    proceed();

    iterations++;

    player++;
    if (player > players) {
        player = 1;
    }

    if (iterations % 23 === 0) {
        const back8 = backTo(8);

        if (back8.prev != null) {
            back8.next.prev = back8.prev;
            back8.prev.next = back8.next;
        } else {
            back8.next.prev = null;
        }

        if (player in scores) {
            scores[player] += back8.value;
        } else {
            scores[player] = back8.value;
        }
        scores[player] += iterations;

        node = back8.prev != null ? back8.prev : tail;

        // console.log('---');
        // console.log(back8.prev.value);
        // console.log(back8.value);
        // console.log(back8.next.value);
    } else {
        // insert new node
        let newNode = {value: iterations};
        newNode.next = node.next;
        node.next = newNode;
        newNode.prev = node;
        if (newNode.next != null) {
            newNode.next.prev = newNode;
        } else {
            tail = newNode;
        }
    }

    if (iterations >= finalMarble) {
        console.log(Math.max(...Object.values(scores)));
        break;
    }

    // if (iterations === 60) {
    //     break;
    // }
}
