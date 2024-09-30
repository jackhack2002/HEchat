import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
// import { ApplicationConfig } from '@angular/core';


const firebaseConfig = {
  apiKey: "AIzaSyC_sOa4k-noUsXoLuR4gPiiCQhGn40PrGE",
  authDomain: "hechat-2d0aa.firebaseapp.com",
  databaseURL: "https://hechat-2d0aa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hechat-2d0aa",
  storageBucket: "hechat-2d0aa.appspot.com",
  messagingSenderId: "876293332177",
  appId: "1:876293332177:web:96216eeaac9fbd43abb9f0",
  measurementId: "G-KF6RSRWHF0"
};

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
