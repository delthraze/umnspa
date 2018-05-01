import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { BadgesPage } from '../pages/badges/badges';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { SettingPage } from '../pages/setting/setting';
import { AuthService } from '../service/AuthService';
import { DatabaseService } from '../service/DBService';
import { SweetAlertService } from 'ng2-sweetalert2';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';
import { StorePage } from '../pages/store/store';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  $isLogin = 0;

  $rootPage = LoginPage;
  rootPage: any = this.$rootPage;
  tabsPage:any = TabsPage;
  profilePage:any = ProfilePage;
  badgesPage:any = BadgesPage;
  leaderboardPage:any = LeaderboardPage;
  storePage:any = StorePage;
  settingPage:any = SettingPage;
  loginPage:any = LoginPage;
  loading:any;

  @ViewChild('sideMenuContent') nav: NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, 
    private menuCtrl: MenuController, private dbSvc:DatabaseService, 
    private authService: AuthService, private storage: Storage,
    private oneSignal: OneSignal, public loadingCtrl: LoadingController) {
      setTimeout(() => {
        platform.ready().then(() => {
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          statusBar.styleDefault();
          splashScreen.hide();

          /*
          * Start One Signal
          */
          this.oneSignal.startInit('864a2d88-43c4-4989-91f6-dda2a6451225', '671939219863');
          this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
          this.oneSignal.setSubscription(true);
          this.oneSignal.handleNotificationReceived().subscribe((data) => {
            console.log('dapat data dari onesignal');
            console.log(data);
          });
          
          this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
            let data = JSON.parse(JSON.stringify(jsonData)).notification.payload.additionalData;
            
          });
          this.oneSignal.endInit();
          /*
          * End One Signal
          */

          this.presentLoading();
          
          //sessions
          this.storage.get('sessions').then((value) => {
            //jika sessions terisi, maka sudah login
            if (value != null && value.nim !== '' && value.email !== '' && value.id_moodle !== '') {
              this.authService.nim = value.nim;
              this.authService.email = value.email;
              this.authService.id_moodle = value.id_moodle;
              this.authService.notification = value.notification;
              this.$isLogin = 1;
              this.nav.setRoot(TabsPage);
            } else {
              this.nav.setRoot(LoginPage);
              this.$isLogin = 0;
            }
            console.log('login',this.$isLogin);

            this.dismissLoading();
          });
        });
      })
    
  }

  onLoad(page: any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();

    // setTimeout(() => {
    //   loading.dismiss();
    // }, 5000);
  }

  dismissLoading(){
    this.loading.dismiss();
  }
}

