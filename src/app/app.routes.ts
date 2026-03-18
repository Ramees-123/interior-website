import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Services } from './components/services/services';
import { Portfolio } from './components/portfolio/portfolio';
import { Contact } from './components/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'services', component: Services },
  { path: 'portfolio', component: Portfolio },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' }
];
