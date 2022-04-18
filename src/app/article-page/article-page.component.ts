import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ArticlesService } from 'src/app/shared/articles.service';
import { Article } from 'src/app/shared/models/article-interface';
import { Comments } from 'src/app/shared/models/comments-interface';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent implements OnInit {
  article$!: Observable<Article>;
  comments$!: Observable<Comments[]>;
  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.article$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.articlesService.getBySlug(params['slug']);
      })
    );
    this.comments$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.articlesService.getComments(params['slug']);
      })
    );
  }
}