//Normal
// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from './auth.service';
//
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const token = authService.getToken();
//
//   if (token) {
//     req = req.clone({
//       setHeaders: { Authorization: `Bearer ${token}` }
//     });
//   }
//
//   return next(req);
// };

//Firebase
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return from(authService.getIdToken()).pipe(
    switchMap((token) => {
      if (token) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
      return next(req);
    })
  );
};
