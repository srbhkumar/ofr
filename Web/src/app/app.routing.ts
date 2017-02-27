import{Routes,RouterModule} from '@angular/router';
import{LoggedInGuard} from './shared/guards/auth.guard';
import{DefaultComponent} from '../app/shared/layouts/default.component';
import{LayoutComponent} from '../app/shared/layouts/layout.component';
import{PUBLIC_ROUTES} from '../app/shared/public/public.routes';
import{SECURE_ROUTES} from '../app/shared/secure/secure.routes';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full', },
    { path: '', component: DefaultComponent, data: { title: 'Public Views' }, children: PUBLIC_ROUTES },
    { path: '', component: LayoutComponent, canActivate: [LoggedInGuard], data: { title: 'Secure Views' }, children: SECURE_ROUTES }
];

export const routing = RouterModule.forRoot(appRoutes);