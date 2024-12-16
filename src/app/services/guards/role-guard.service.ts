import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // Obter o token armazenado no localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      // Se não houver token, redireciona para a página de login
      this.router.navigate(['/login']);
      return false;
    }

    try {
      // Decodificar o JWT
      const decodedToken: any = jwtDecode(token);

      // Verificar se o token possui a role necessária
      const userRole = decodedToken.role; // A role deve estar presente no JWT
      const allowedRoles = route.data['roles'] as Array<string>;

      if (allowedRoles.includes(userRole)) {
        return true; // Role permitida, acesso autorizado
      } else {
        // Role não permitida, redireciona para a página inicial ou outra rota
        this.router.navigate(['/']);
        return false;
      }
    } catch (error) {
      // Token inválido ou erro ao decodificar
      console.error('Token inválido:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
