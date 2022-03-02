import { Injectable } from '@angular/core';
import * as ElectronStore from 'electron-store';
import { Paciente } from './paciente.model';

@Injectable({
  providedIn: 'root'
})
export class ElectronStoreService {
  private store: any;
  constructor() {
    if (window.require) {
      try {
        const storeClass = window.require("electron-store");
        this.store = new storeClass();
      } catch (e) {
        throw e;
      }
    } else {
      console.warn("electron-store was not loaded");
    }
   }

   get = (key: string): any => {
    return this.store.get(key);
   }

   set = (key: string, value: any): void => {
     this.store.set(key, value);
   }

}