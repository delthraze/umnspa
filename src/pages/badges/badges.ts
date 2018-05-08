import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { WebService } from '../../service/WebService';
import { AuthService } from '../../service/AuthService';

/**
 * Generated class for the BadgesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-badges',
  templateUrl: 'badges.html',
})

export class BadgesPage {
  badgeInfo: any;
  loadProgress = 50;
  imgurl = this.webService.url + "src/badges/test.png";
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private webService: WebService, private authService: AuthService,
  private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BadgesPage');
  }

  ionViewWillEnter(){
    this.getBadgeInfo(null, false);
  }

  getBadgeInfo(refresher, isRefresh){
    //console.log(this.authService.nim);
    if (!isRefresh) this.presentLoading();

    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_badges.php", JSON.stringify(req), null).subscribe(response => {
      console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.badgeInfo = responseData;
        //console.log(this.classInfo);
        this.getLevelInfo();
        if (!isRefresh) this.dismissLoading();
        else {
          refresher.complete();
        }
      }
    }, error =>{
      console.log(error);
    })
  }

  cobaClaim(badge){
    //console.log("badge.id_bc",badge.id_bc);
    //console.log("badge.id_badges",badge.id_badge);
    let req = {
      'nim' : this.authService.nim,
      'id_badge' : badge.id_badge
    }

    console.log(req.id_badge);

    this.webService.post(this.webService.url + "claim_badge.php", JSON.stringify(req), null).subscribe(response => {
      console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.getBadgeInfo(null, false);
      }
    }, error =>{
      console.log(error);
    })

  }

  getLevelInfo(){

    let req = {
      'nim' : this.authService.nim
    }
    //this.presentLoading();
    this.webService.post(this.webService.url + "update_level.php", JSON.stringify(req), null).subscribe(response => {
      console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      
      if(responseData){
        // this.exp_req = responseData;
        // this.getUserInfo();
        //console.log("exp",this.exp_req);
      }
    }, error =>{
    })

  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.getBadgeInfo(refresher, true);
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
