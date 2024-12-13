import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions: Object = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  observe: 'response',
  responseType: 'json',
};

@Injectable({
  providedIn: 'root',
})
export class AppsService {
  constructor(private http: HttpClient) {}

  public getDetailUser(
    endPoint: string,
    parameter: any,
    httpHeaders: any,
    catchError: any
  ): Observable<HttpResponse<any>> {
    // /authentication/
    return this.http
      .post<any>(environment.getUrlGateway() + endPoint, parameter, httpHeaders)
      .pipe(catchError);
  }

  public getPoolingOrder(
    endPoint: string,
    parameter: any,
    catchError: any
  ): Observable<HttpResponse<any>> {
    // /todolist-pooling-order/
    return this.http
      .post<any>(environment.getUrlGateway() + endPoint, parameter, httpOptions)
      .pipe(catchError);
  }

  public getDetailPoolingOrder(
    endPoint: string,
    parameter: any,
    catchError: any
  ): Observable<HttpResponse<any>> {
    // /detail-pooling-order/
    return this.http
      .post<any>(environment.getUrlGateway() + endPoint, parameter, httpOptions)
      .pipe(catchError);
  }

  public getIamJobMap(
    endPoint: string,
    parameter: any,
    catchError: any
  ): Observable<HttpResponse<any>> {
    // /mobile-job-mapping/
    return this.http
      .post<any>(environment.getUrlGateway() + endPoint, parameter, httpOptions)
      .pipe(catchError);
  }

  public getInternalForce(
    endPoint: string,
    parameter: any,
    catchError: any
  ): Observable<HttpResponse<any>> {
    // /internal-sales/
    return this.http
      .post<any>(environment.getUrlGateway() + endPoint, parameter, httpOptions)
      .pipe(catchError);
  }

  public getClaimPoolingOrder(
    endPoint: string,
    parameter: any,
    catchError: any
  ): Observable<HttpResponse<any>> {
    // /claim-pooling-pub/
    return this.http
      .post<any>(environment.getUrlGateway() + endPoint, parameter, httpOptions)
      .pipe(catchError);
  }

  public postTrackingUpdatePooling(
    endPoint: string,
    parameter: any,
    catchError: any
  ): Observable<HttpResponse<any>> {
    // /api/updateCMO/
    return this.http
      .post<any>(
        environment.urlTranslatorNodeJs + endPoint,
        parameter,
        httpOptions
      )
      .pipe(catchError);
  }
}
