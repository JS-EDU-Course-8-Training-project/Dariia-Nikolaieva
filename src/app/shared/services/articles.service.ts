import { ResponseArticle } from '../models/response-article-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Article } from 'src/app/shared/models/article-interface';
import { ResponseMultiArticles } from 'src/app/shared/models/response-multi-articles-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private http: HttpClient) {}

  public articles$: BehaviorSubject<Article[]> = new BehaviorSubject<Article[]>([]);
  public articlesBySlug$: Subject<Article> = new Subject<Article>();

  getAll(limit: number = 5, offset: number = 0): Observable<ResponseMultiArticles> {
    return this.http.get<ResponseMultiArticles>(`${environment.apiUrl}articles?limit=${limit}&offset=${offset}`).pipe(
      map((response: ResponseMultiArticles) => {
        this.articles$.next(response.articles);
        return response;
      })
    );
  }

  getByAuthor(author: string, limit: number = 5, offset: number = 0): Observable<ResponseMultiArticles> {
    return this.http
      .get<ResponseMultiArticles>(`${environment.apiUrl}articles?author=${author}&limit=${limit}&offset=${offset}`)
      .pipe(
        map((response: ResponseMultiArticles) => {
          this.articles$.next(response.articles);
          return response;
        })
      );
  }

  getByTag(tag: string): Observable<Article[]> {
    return this.http.get<ResponseMultiArticles>(`${environment.apiUrl}articles?tag=${tag}`).pipe(
      map((response: ResponseMultiArticles) => {
        return response.articles;
      })
    );
  }

  getFavoriteArticles(username: string, limit: number = 5, offset: number = 0): Observable<ResponseMultiArticles> {
    return this.http
      .get<ResponseMultiArticles>(`${environment.apiUrl}articles?favorited=${username}&limit=${limit}&offset=${offset}`)
      .pipe(
        map((response: ResponseMultiArticles) => {
          this.articles$.next(response.articles);
          return response;
        })
      );
  }

  getBySlug(slug: string): Observable<Article> {
    return this.http.get<ResponseArticle>(`${environment.apiUrl}articles/${slug}`).pipe(
      map((response: ResponseArticle) => {
        this.articlesBySlug$.next(response.article);
        return response.article;
      })
    );
  }

  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(`${environment.apiUrl}articles`, { article }).pipe(
      map((response: Article) => {
        return response;
      })
    );
  }
  updateArticle(article: Article, slug: string) {
    return this.http.put(`${environment.apiUrl}articles/${slug}`, { article });
  }

  deleteArticle(slug: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}articles/${slug}`);
  }
  favouriteArticle(slug: string) {
    return this.http.post(`${environment.apiUrl}articles/${slug}/favorite`, {});
  }

  unFavouriteArticle(slug: string) {
    return this.http.delete(`${environment.apiUrl}articles/${slug}/favorite`);
  }
}
