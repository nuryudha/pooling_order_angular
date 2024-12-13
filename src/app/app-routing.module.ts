import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoolingOrderComponent } from './pages/pooling-order/pooling-order.component';
import { DetailOrderComponent } from './pages/detail-order/detail-order.component';
import { InternalSalesComponent } from './pages/internal-sales/internal-sales.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthCheckComponent } from './pages/auth-check/auth-check.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

const routes: Routes = [
  { path: '', redirectTo: 'pooling-order', pathMatch: 'full'},
  { path: 'pooling-order/:token/:params', component: AuthCheckComponent},
  { path: 'pooling', component: PoolingOrderComponent},
  { path: 'detail-order', canActivate:[AuthGuard], component: DetailOrderComponent },
  { path: 'claim-page', component: InternalSalesComponent },
  { path: 'unauthorized', component: UnauthorizedComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
