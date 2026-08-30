import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProgramsPageComponent } from './pages/programs-page/programs-page.component';
import { AmbassadorsPageComponent } from './pages/ambassadors-page/ambassadors-page.component';
import { BusinessContentPageComponent } from './pages/business-content-page/business-content-page.component';
import { BusinessCampaignsPageComponent } from './pages/business-campaigns-page/business-campaigns-page.component';
import { BusinessProgramsPageComponent } from './pages/business-programs-page/business-programs-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'programs', component: ProgramsPageComponent },
  { path: 'ambassadors', component: AmbassadorsPageComponent },
  { path: 'business/content', component: BusinessContentPageComponent },
  { path: 'business/campaigns', component: BusinessCampaignsPageComponent },
  { path: 'business/programs', component: BusinessProgramsPageComponent },
  { path: '**', redirectTo: '' },
];
