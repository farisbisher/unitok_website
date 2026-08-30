import { Component } from '@angular/core';
import { RevealDirective } from '../../core/reveal.directive';
import { HeroComponent } from '../../sections/hero/hero.component';
import { ProofComponent } from '../../sections/proof/proof.component';
import { AiFeedComponent } from '../../sections/ai-feed/ai-feed.component';
import { CommunitiesComponent } from '../../sections/communities/communities.component';
import { ProgramsComponent } from '../../sections/programs/programs.component';
import { AmbassadorsComponent } from '../../sections/ambassadors/ambassadors.component';
import { BusinessComponent } from '../../sections/business/business.component';
import { TeamComponent } from '../../sections/team/team.component';
import { FaqComponent } from '../../sections/faq/faq.component';
import { FinalCtaComponent } from '../../sections/final-cta/final-cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RevealDirective,
    HeroComponent,
    ProofComponent,
    AiFeedComponent,
    CommunitiesComponent,
    ProgramsComponent,
    AmbassadorsComponent,
    BusinessComponent,
    TeamComponent,
    FaqComponent,
    FinalCtaComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
