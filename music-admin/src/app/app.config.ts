import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // אם יש לך קובץ ראוטים

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
// אם יש לך קובץ ראוטים, תוודא לייבא אותו כראוי
// אם אין לך קובץ ראוטים, תוכל להוסיף את הראוטים ישירות כאן