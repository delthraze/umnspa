import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController } from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  isLogin = false;

  $rootPage = LoginPage;
  rootPage: any = this.$rootPage;
  tabsPage:any = TabsPage;
  profilePage:any = ProfilePage;
  badgesPage:any = BadgesPage;
  leaderboardPage:any = LeaderboardPage;
  settingPage:any = SettingPage;
  loginPage:any = LoginPage;

  @ViewChild('sideMenuContent') nav: NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController, private dbSvc:DatabaseService, private authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.dbSvc.initDatabase();
      this.dbSvc.testDB();

        let query = "SELECT id FROM tbl_user";
        //console.log(query);
        this.dbSvc.query(query, (data:any)=>
        {
          let len = data.rows.length;
          let asd = data.rows.item[0].id;
          if(len > 0){
            // Uda pernah login
            console.log(asd)
            this.isLogin = true;
            this.nav.setRoot(TabsPage);
            //console.log("ada data");
          }
          else{
            // Belom pernah login
            this.isLogin = false;
            this.nav.setRoot(LoginPage);
            //console.log("ga ada data");
          }
          console.log(this.isLogin);
        }, ()=>
        {
          // Kalo gagal,
          //console.log("gagal"); 
        })
    });
  }

  onLoad(page: any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }
}

