import { Pipe , PipeTransform, Injectable} from '@angular/core'

@Pipe({
    name: 'filter'
})

@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any, value : string): any[] {  
        if (!items) return [];        
        return items.filter(function(item){
            return item.Status.toLowerCase().includes(value.toLowerCase());
        });
    }
}