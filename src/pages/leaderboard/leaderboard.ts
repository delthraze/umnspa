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

    //console.log(this.authService.nim);
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "leaderboard_level.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.byLevelInfo = responseData;
        this.nim = this.authService.nim;;
      }
    }, error =>{
    })
  }

  createModal(user){
    console.log(user);
    let modal = this.modalCtrl.create(UserProfilePage, {user: user});
    modal.present();
  }

  to_profile(user){
    const alert = this.alertCtrl.create({ 
      title: 'Already Submit Assignment?',
      message: user.nama + '<br>'+ user.title,
      buttons: [ 
        { 
          text: 'Yes', 
          handler: data => { 
            // let req = {
            //   "nim" : this.authService.nim,
            //   "id_elearning" : assignInfo.id_elearning,
            //   "kode_mk" : assignInfo.kode_mk,
            //   "name" : assignInfo.name,
            //   "startdate" : assignInfo.startdate,
            //   "enddate" : assignInfo.enddate
            // }
            // console.log(JSON.stringify(req))
        
            // this.webService.post(this.webService.url + "add_assignment.php", JSON.stringify(req), null).subscribe(response => {
            //   //console.log(response["_body"]);
            //   let responseData = JSON.parse(response["_body"]);
            //   //console.log(responseData)
            //   if(responseData['success']){
            //     //this.navCtrl.push(TabEventPage);
            //     //harusnya apus
            //     let ctr = 0;

            //     for(let selected of this.assignInfo){
            //       if(assignInfo.id_elearning == selected.id_elearning){
            //           this.assignInfo.splice(ctr,1);
            //           break;
            //       }
            //       else {
            //           ctr++;
            //       }
            //     }
            //   }
            //   else{
            //     let alert = this.alertCtrl.create({
            //       title: 'Add Event Failed',
            //       subTitle: 'Add Event ',
            //       buttons: [
            //         {
            //           text: 'Ok',
            //           handler: data => {
            //             //this.navCtrl.push(TabEventPage)
            //           }
            //         }
            //       ]
            //     });
            //     alert.present();
            //   }
            // }, error =>{
            // })
            alert.present();
          } 
        },
        { 
          text: 'Cancel',
          handler: data => { 
            // let req = {
            //   "nim" : this.authService.nim,
            //   "id_kelas" : classInfo.id_kelas,
            //   "kode_mk" : classInfo.kode_mk,
            //   "nama_mk" : classInfo.nama_mk,
            //   "absensi" : 'N'
            // }
            //console.log(req['nim'])
        
            // this.webService.post("http://localhost/umnspa/add_class.php", JSON.stringify(req), null).subscribe(response => {
            //   let responseData = JSON.parse(response["_body"]);
            //   console.log(responseData)
            //   if(responseData['success']){
            //     //this.navCtrl.push(TabEventPage);
            //     //harusnya apus
            //     let ctr = 0;

            //     for(let selected of this.classInfo){
            //       if(classInfo.kode_mk == selected.kode_mk && classInfo.kelas == selected.kelas){
            //           this.classInfo.splice(ctr,1);
            //           break;
            //       }
            //       else {
            //           ctr++;
            //       }
            //     }
            //   }
            //   else{
            //     let alert = this.alertCtrl.create({
            //       title: 'Add Event Failed',
            //       subTitle: 'Add Event ',
            //       buttons: [
            //         {
            //           text: 'Ok',
            //           handler: data => {
            //             //this.navCtrl.push(TabEventPage)
            //           }
            //         }
            //       ]
            //     });
            //     alert.present();
            //   }
            // // }, error =>{
            // })
          } 
        }
      ]
      });
      alert.present();
  }

}
