import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private webService: WebService, private authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BadgesPage');
  }

  ionViewWillEnter(){
    this.getBadgeInfo();
  }

  getBadgeInfo(){
    //console.log(this.authService.nim);
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_badges.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      // console.log(JSON.stringify(responseData))
      if(responseData){
        this.badgeInfo = responseData;
        //console.log(this.classInfo);
      }
    }, error =>{
      console.log(error);
    })
  }

  cobaClaim(){
    console.log("babi")
  }

}
