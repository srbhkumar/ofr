import{Routes,RouterModule} from '@angular/router';
import{LoggedInGuard} from '../guards/auth.guard';
import{DashboardComponent} from '../../dashboard/dashboard.component';
import{ProtectedComponent} from '../../protected/protected.component';
import{CaseComponent} from '../../case/case.view.component';

export const SECURE_ROUTES: Routes = [    
    {  path: 'protected', component: ProtectedComponent,canActivate: [LoggedInGuard] },
    {  path: 'dashboard', component: DashboardComponent,canActivate: [LoggedInGuard] },
    {  path: 'case', component: CaseComponent,canActivate: [LoggedInGuard] }    
];