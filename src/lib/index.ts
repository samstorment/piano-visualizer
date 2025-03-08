export const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
}

export const throttle = (fn: Function, ms = 300) => {
    let lastTime = 0;
    return function (this: any, ...args: any[]) {
        const now = Date.now();
        if (now - lastTime >= ms) {
            fn.apply(this, args);
            lastTime = now;
        }
    };
}

export function ordinalize(num: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return num + suffixes[0]; // for numbers like 11th, 12th, 13th
    }

    return num + (suffixes[lastDigit] || suffixes[0]);
}

// chat gpt wrote this and then I didn't test it! I am the king of programming! 
// it works for one through seven though that's all I really need!
export function roman_numeral(num: number) {
    if (num < 1 || num > 3999) return "Invalid number";

    const romanNumerals = [
        { value: 1000, numeral: "M" },
        { value: 900, numeral: "CM" },
        { value: 500, numeral: "D" },
        { value: 400, numeral: "CD" },
        { value: 100, numeral: "C" },
        { value: 90, numeral: "XC" },
        { value: 50, numeral: "L" },
        { value: 40, numeral: "XL" },
        { value: 10, numeral: "X" },
        { value: 9, numeral: "IX" },
        { value: 5, numeral: "V" },
        { value: 4, numeral: "IV" },
        { value: 1, numeral: "I" }
    ];

    let result = "";

    for (const { value, numeral } of romanNumerals) {
        while (num >= value) {
            result += numeral;
            num -= value;
        }
    }

    return result;
}


export function swap<T>(array: Array<T>, i: number, j: number) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}