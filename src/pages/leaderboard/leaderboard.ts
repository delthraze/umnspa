import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AuthService } from '../../service/AuthService';
import { WebService } from '../../service/WebService';
import { UserProfilePage } from '../user-profile/user-profile';

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
  nim: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private authService: AuthService, private webService: WebService,
    private alertCtrl: AlertController, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaderboardPage');
  }

  ionViewWillEnter(){
    this.getByLevel();
  }

  getByLevel(){

    console.log('nim kita',this.authService.nim);
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "leaderboard_level.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.byLevelInfo = responseData;
        this.nim = this.authService.nim;
        console.log('nim ..',this.nim);
      }
    }, error =>{
    })
  }

  createModal(user){
    console.log(user);
    let modal = this.modalCtrl.create(UserProfilePage, {user: user});
    modal.present();
  }

}
