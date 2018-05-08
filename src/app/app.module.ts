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
import { IonicStorageModule } from '@ionic/storage';
import { SettingsService } from '../service/SettingService';
import { OneSignal } from '@ionic-native/onesignal';
import { StorePage } from '../pages/store/store';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { ProfileSettingsPage } from '../pages/profile-settings/profile-settings';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InformationPage } from '../pages/information/information';
import { HowToUsePage } from '../pages/how-to-use/how-to-use';
import { AboutUsPage } from '../pages/about-us/about-us';

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
    StorePage,
    UserProfilePage,
    ProgressBarComponent,
    ProfileSettingsPage,
    InformationPage,
    HowToUsePage,
    AboutUsPage
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    FormsModule,
    HttpModule,
    TooltipsModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
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
    StorePage,
    UserProfilePage,
    ProgressBarComponent,
    ProfileSettingsPage,
    InformationPage,
    HowToUsePage,
    AboutUsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    WebService,
    DatabaseService,
    SettingsService,
    SQLite,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
