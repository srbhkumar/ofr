import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {KeysPipe} from "./key.pipe";

@NgModule({
  declarations:[KeysPipe],
  imports:[CommonModule],
  exports:[KeysPipe]
})

export class MainPipe{}