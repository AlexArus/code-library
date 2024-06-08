/**
 * Always delay execution of function till threshold
 * @param fn - function to execute after delay
 * @param ms - milliseconds to delay function execution
 * @returns 
 */
export const debounce = <Fn extends (...arg: any) => void>(fn: Fn, ms: number): Fn => {
    let timerId: number;
    return ((...args: Parameters<Fn>) => {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), ms);
    }) as Fn;
};