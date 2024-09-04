import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { damfRouteConfig, LoginComponent } from '@usnistgov/ngx-dam-framework';
import { RegisterComponent } from './core/components/register/register.component';
import { ForgotPasswordComponent } from './core/components/forgot-password/forgot-password.component';
import { EntityListComponent, EntityListState } from './entity/components/entity-list/entity-list.component';
import { ErrorPageComponent } from './core/components/error-page/error-page.component';
import { ENTITY_WIDGET_ID, EntityState, EntityWidgetComponent, SectionLinkDisplayState } from './entity/components/entity-widget/entity-widget.component';
import { EntityTextEditorComponent, SECTION_TEXT_EDITOR_INITIALIZER } from './entity/components/entity-text-editor/entity-text-editor.component';
import { EntityCreateComponent } from './entity/components/entity-create/entity-create.component';
import { EntityFormEditorComponent, SECTION_FORM_EDITOR_INITIALIZER } from './entity/components/entity-form-editor/entity-form-editor.component';

const DEFAULT_ERROR_URL = () => ({ command: ['/', 'error'] });

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    ...damfRouteConfig()
      .useNotAuthenticated()
      .useMessaging({
        tags: ['LOGIN_ISSUES']
      }),
    component: LoginComponent,
  },
  {
    path: 'register',
    ...damfRouteConfig()
      .useNotAuthenticated()
      .useMessaging({
        tags: ['REGISTER_ISSUES']
      }).build(),
    component: RegisterComponent,
  },
  {
    path: 'forgot-password',
    ...damfRouteConfig()
      .useNotAuthenticated()
      .useMessaging({
        tags: ['FP_ISSUES']
      }).build(),
    component: ForgotPasswordComponent,
  },
  {
    path: 'entity',
    children: [
      {
        path: 'list',
        ...damfRouteConfig()
          .useAuthenticated()
          .useLoadData(EntityListState)
          .useErrorURL(DEFAULT_ERROR_URL)
          .useMessaging({})
          .build(),
        component: EntityListComponent,
      },
      {
        path: 'create',
        ...damfRouteConfig()
          .useAuthenticated()
          .useMessaging({
            tags: ['CREATE_ENTITY_ISSUES']
          }).build(),
        component: EntityCreateComponent,
      },
      {
        path: ':entityId',
        ...damfRouteConfig()
          .useWidget({
            widgetId: ENTITY_WIDGET_ID,
            component: EntityWidgetComponent,
          })
          .useAuthenticated()
          .useLoadManyData([
            EntityState,
            SectionLinkDisplayState
          ])
          .useErrorURL(DEFAULT_ERROR_URL)
          .useMessaging({})
          .withChildren([
            {
              path: 'text/:textSectionId',
              ...damfRouteConfig()
                .useAuthenticated()
                .useEditor({
                  component: EntityTextEditorComponent,
                  initializer: SECTION_TEXT_EDITOR_INITIALIZER,
                  saveOnRouteExit: true,
                })
                .useErrorURL(DEFAULT_ERROR_URL)
                .useMessaging({})
                .build(),
            },
            {
              path: 'form/:formSectionId',
              ...damfRouteConfig()
                .useAuthenticated()
                .useEditor({
                  component: EntityFormEditorComponent,
                  initializer: SECTION_FORM_EDITOR_INITIALIZER,
                  saveOnRouteExit: true,
                })
                .useErrorURL(DEFAULT_ERROR_URL)
                .useMessaging({})
                .build(),
            },
          ]),
      }
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
];
