"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomRange = exports.randomNumber = exports.randomDateRange = exports.randomDate = void 0;
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
exports.randomDate = randomDate;
const randomDateRange = (start, end) => {
    let min = (0, exports.randomDate)(start, end);
    let max = (0, exports.randomDate)(start, end);
    ;
    if (min > max) {
        [min, max] = [max, min];
    }
    return { min, max };
};
exports.randomDateRange = randomDateRange;
const randomNumber = (min, max, real = false) => {
    const number = Math.random() * (max - min) + min;
    return real ? number : Math.round(number);
};
exports.randomNumber = randomNumber;
const randomRange = (min, max, real = false) => {
    const ran1 = (0, exports.randomNumber)(min, max, real);
    const ran2 = (0, exports.randomNumber)(min, max, real);
    if (ran1 > ran2) {
        [min, max] = [ran2, ran1];
    }
    else {
        [min, max] = [ran1, ran2];
    }
    return { min, max };
};
exports.randomRange = randomRange;
