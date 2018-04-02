import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NgCalendarModule } from 'ionic2-calendar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MonthlyPage } from '../pages/monthly/monthly';
import { DailyPage } from '../pages/daily/daily';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { BadgesPage } from '../pages/badges/badges';
import { SettingPage } from '../pages/setting/setting';
import { DatabaseService } from '../service/DBService';
import { AuthService } from '../service/AuthService';
import { WebService } from '../service/WebService';
import { SQLite } from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    DailyPage,
    MonthlyPage,
    LoginPage,
    ProfilePage,
    LeaderboardPage,
    BadgesPage,
    SettingPage,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    FormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    DailyPage,
    MonthlyPage,
    LoginPage,
    ProfilePage,
    LeaderboardPage,
    BadgesPage,
    SettingPage,
    ProgressBarComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    WebService,
    DatabaseService,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
