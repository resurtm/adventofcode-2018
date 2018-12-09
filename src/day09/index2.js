const {DoubleLinkedList} = require('double-linkedlist');

// const players = 9;
// const finalMarble = 25;

const players = 30;
const finalMarble = 5807;

// const players = 13;
// const finalMarble = 146373;

const list = new DoubleLinkedList();
let current = 0;
let player = 0;
let index = 0;
let iterations = 0;
let skip = false;
const scores = {};

function getAtPosition(list, position) {
    let curr = list.getHead();
    for (let i = 0; i < position; i++) {
        curr = curr.getNext();
    }
    return curr;
}

while (true) {
    if (skip) {
        skip = false;
    } else {
        list.insertAtPosition({x: current}, index + 1);
    }
    // console.log(`[${player}] ` + map(x => x.x, list.toArray()).join(' '));

    current++;
    index += 2;
    index %= list.getSize();
    iterations++;

    player++;
    if (player > players) {
        player = 1;
    }

    if (current % 23 === 0) {
        let indexBack = index;
        let node = getAtPosition(list, index);
        for (let i = 0; i <= 7; i++) {
            if (node.getPrevious() == null) {
                indexBack = list.getSize() - 1;
                node = list.getTail();
            } else {
                indexBack--;
                node = node.getPrevious();
            }
        }

        if (player in scores) {
            scores[player] += current;
        } else {
            scores[player] = current;
        }
        scores[player] += node.x;

        list.deleteAtPosition(indexBack);

        index = indexBack - 1;
        skip = true;
    }

    if (current >= finalMarble) {
        // console.log(player);
        // console.log(scores);

        console.log(Math.max(...Object.values(scores)));
        break;
    }

    // if (iterations === 26) {
    //     break;
    // }
}
