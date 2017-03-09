import { Pipe , PipeTransform, Injectable} from '@angular/core'

@Pipe({
    name: 'filter'
})

@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any, value : string[]): any[] { 
   
       let values : string[];
        values = value;
        if (!items) return [];        
        return items.filter(function(item){

        if(values.length == 2)
         {
              
            return (item.Status.toLowerCase().includes(values[0].toLowerCase()) ||
                     item.Status.toLowerCase().includes(values[1].toLowerCase()));
         }
        else
         {
               
              return (item.Status.toLowerCase().includes(values[0].toLowerCase()));
         }
          
         
        
        });
    }
}