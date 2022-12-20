import {Pipe, PipeTransform} from '@angular/core';

// déclare un pipe nommé "unique"
@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  // implémente la méthode "transform" de l'interface PipeTransform
  transform(items: any[], field: string): any[] {
    // si items est null ou undefined, renvoie un tableau vide
    if (!items) {
      return [];
    }
    // utilise la méthode filter de l'objet Array pour enlever les éléments dupliqués
    // de items en comparant les valeurs de l'élément courant (item) et de tous les autres éléments (self)
    // pour la clé spécifiée par field
    return items.filter((item, index, self) => self.findIndex(t => t[field] === item[field]) === index);
  }
}
