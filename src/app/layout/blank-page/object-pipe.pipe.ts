import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keys'})
export class ObjectPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    console.log("**value : "+value);
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}