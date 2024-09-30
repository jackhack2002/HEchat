import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

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

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  ]
};
