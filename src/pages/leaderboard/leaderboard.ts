import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../service/AuthService';
import { WebService } from '../../service/WebService';

/**
 * Generated class for the LeaderboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
  byLevelInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private authService: AuthService, private webService: WebService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaderboardPage');
  }

  ionViewWillEnter(){
    this.getByLevel();
  }

  getByLevel(){

    //console.log(this.authService.nim);
    let req = {
      //'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "leaderboard_level.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      //console.log(JSON.stringify(responseData))
      if(responseData){
        this.byLevelInfo = responseData;
      }
    }, error =>{
    })

}

}
