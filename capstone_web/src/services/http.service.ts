import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { ServerAddr } from './server.addr';

@Injectable()
export class HttpService {
    constructor(private http: Http, private server:ServerAddr) { }
    public server_addr = ServerAddr.getServerAddr();

    headers = new Headers({ 'Content-Type': 'application/json', user_no:1});
    options = new RequestOptions({ headers: this.headers });

    public post(url: string, body = {}, params = {}): Observable<Response> {
        var parameters = new URLSearchParams();
        for (var key in params) {
            parameters.set(key, params[key] + "");
        }
        this.options.search = parameters;
        return this.http.post(this.server_addr + url, body, this.options);
    }

    public put(url: string, body = {}, params = {}): Observable<Response> {
        var parameters = new URLSearchParams();
        for (var key in params) {
            parameters.set(key, params[key] + "");
        }
        this.options.search = parameters;
        return this.http.put(this.server_addr + url, body, this.options);
    }

    public delete(url: string, params = {}): Observable<Response> {
        var parameters = new URLSearchParams();
        for (var key in params) {
            parameters.set(key, params[key] + "");
        }
        this.options.search = parameters;
        return this.http.delete(this.server_addr + url, this.options);
    }

    public get(url: String, params = {}): Observable<Response> {
        var parameters = new URLSearchParams();
        for (var key in params) {
            parameters.set(key, params[key] + "");
        }
        this.options.search = parameters;
        return this.http.get(this.server_addr + url, this.options);
    }
}