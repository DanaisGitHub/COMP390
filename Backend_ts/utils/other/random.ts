export const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const randomDateRange = (start: Date, end: Date, ): {min:Date,max:Date} => {
    let min = randomDate(start, end);
    let max = randomDate(start, end);;
    if (min > max) {
        [min, max] = [max, min];
    }
    return {min,max};
}





export const randomNumber = (min: number, max: number, real = false): number => {
    const number = Math.random() * (max - min) + min;
    return real?  number : Math.round(number);
}

export const randomRange = (min: number, max: number, real = false): { min: number, max: number } => {
    const ran1 = randomNumber(min, max, real);
    const ran2 = randomNumber(min, max, real);
    if (ran1 > ran2) {
        [min, max] = [ran2, ran1];
    }
    else {
        [min, max] = [ran1, ran2];
    }
    return { min, max }
}


