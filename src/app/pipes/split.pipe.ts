import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'split'
})
export class SplitPipe implements PipeTransform {
    transform(value: string, ...args: number[]): string[] {
        let split = value.split('');
        if (args[0] !== undefined) {
            let result: string[] = [];
            for (let i = 0; i < args[0]; i++)
                result.push(split[i] ?? "");

            split = result;
        }
        return split;
    }
}
