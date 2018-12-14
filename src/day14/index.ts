function calculatePart1(max: number): string {
    const recipes: number[] = [3, 7];
    const accum: number[] = [];
    let first = 0;
    let second = 1;
    let created = 0;
    while (true) {
        // console.log(`${gen}: ${recipes.join(',')}`);
        const chars = (recipes[first] + recipes[second]).toString();
        for (const char of chars) {
            created += 1;
            recipes.push(parseInt(char));
            if (created >= max - 1) {
                accum.push(parseInt(char));
            }
            if (created >= max + 8) {
                return accum.join('');
            }
        }
        first = (first + recipes[first] + 1) % recipes.length;
        second = (second + recipes[second] + 1) % recipes.length;
    }
}

function calculatePart2(max: number): number {
    const recipes: number[] = [3, 7];
    let first = 0;
    let second = 1;
    let created = 0;
    while (true) {
        // console.log(`${gen}: ${recipes.join('')}`);
        const chars = (recipes[first] + recipes[second]).toString().split('').map(x => parseInt(x));
        for (const char of chars) {
            created += 1;
            recipes.push(char);
            const rec = recipes.slice(recipes.length - max.toString().length);
            if (rec.join('') === max.toString()) {
                return created - max.toString().length + 2;
            }
        }
        first = (first + recipes[first] + 1) % recipes.length;
        second = (second + recipes[second] + 1) % recipes.length;
    }
}

// console.log(calculatePart1(9));
// console.log(calculatePart1(5));
// console.log(calculatePart1(18));
// console.log(calculatePart1(2018));
// console.log(calculatePart1(598701));

console.log('---');

console.log(calculatePart2(9));
console.log(calculatePart2(5));
console.log(calculatePart2(18));
console.log(calculatePart2(2018));
console.log(calculatePart2(598701));

// 77614
// 27761
