export const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
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