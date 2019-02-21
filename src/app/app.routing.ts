
import { AppLayoutComponent } from './layout';

import { Routes } from '@angular/router';
import { BidRevealedComponent } from './pages/events/bidrevealed/bidrevealed.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'events/unsealedbids', pathMatch: 'full' },
      { path: 'events/unsealedbids', component: BidRevealedComponent, data: { title: 'Unsealed Bids' } },
    ]
  },
];
