import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { AuthService } from '../../service/AuthService';
import { WebService } from '../../service/WebService';
import swal from 'sweetalert'

/**
 * Generated class for the DailyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-daily',
  templateUrl: 'daily.html',
})
export class DailyPage {
  myDate: String = new Date().toISOString();
  classInfo: any;
  assignInfo: any;
  quizInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private authService: AuthService, private webService: WebService,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyPage');
    // this.myDate = moment().format();
    // this.getClassInfo();
    // console.log(this.myDate);
  }

  ionViewWillEnter(){
    this.myDate = moment().format();
    this.getClassInfo();
    this.getAssignmentInfo();
    this.getQuizInfo();
    //console.log(this.myDate); 
  }

  getClassInfo(){
    //console.log(this.authService.nim);
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_today_class.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      //console.log(JSON.stringify(responseData))
      if(responseData){
        this.classInfo = responseData;
        console.log('kelas');
        //console.log(this.classInfo);
      }
    }, error =>{
    })
  }

  getAssignmentInfo(){

    //console.log(this.authService.id_moodle);
    
    let req = {
      'id_moodle' : this.authService.id_moodle
    }

    this.webService.post(this.webService.url + "get_assignment.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.assignInfo = responseData;
        console.log('tugas');
        //console.log(this.classInfo);
      }
    }, error =>{
      console.log('assign error');

    })
  }

  getQuizInfo(){
    
    let req = {
      'id_moodle' : this.authService.id_moodle
    }

    this.webService.post(this.webService.url + "get_quiz.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.quizInfo = responseData;
        console.log('kuis');
        //console.log(this.classInfo);
      }
    }, error =>{
    })
  }

  do_class(classInfo) {
    // swal({
    //   title: "Are you sure?",
    //   text: classInfo.kode_mk + ' - ' + classInfo.nama_mk + '\n' +
    //       "Are you sure that you want to attend this class?",
    //   icon: "warning",
    // })
    const alert = this.alertCtrl.create({ 
      title: 'Attend Class',
      message: classInfo.kode_mk + '-' + classInfo.kelas + '<br>'+ classInfo.nama_mk,
      buttons: [ 
        { 
          text: 'Attend', 
          handler: data => { 
            let req = {
              "nim" : this.authService.nim,
              "id_kelas" : classInfo.id_kelas,
              "kode_mk" : classInfo.kode_mk,
              "nama_mk" : classInfo.nama_mk,
              "absensi" : 'Y'
            }
            //console.log(req['nim'])
        
            this.webService.post(this.webService.url + "add_class.php", JSON.stringify(req), null).subscribe(response => {
              let responseData = JSON.parse(response["_body"]);
              console.log(responseData)
              if(responseData['success']){
                //this.navCtrl.push(TabEventPage);
                //harusnya apus
                let ctr = 0;

                for(let selected of this.classInfo){
                  if(classInfo.kode_mk == selected.kode_mk && classInfo.kelas == selected.kelas){
                      this.classInfo.splice(ctr,1);
                      break;
                  }
                  else {
                      ctr++;
                  }
                }
              }
              else{
                let alert = this.alertCtrl.create({
                  title: 'Add Event Failed',
                  subTitle: 'Add Event ',
                  buttons: [
                    {
                      text: 'Ok',
                      handler: data => {
                        //this.navCtrl.push(TabEventPage)
                      }
                    }
                  ]
                });
                alert.present();
              }
            }, error =>{
            })
          } 
        },
        { 
          text: 'Not Attend',
          handler: data => { 
            let req = {
              "nim" : this.authService.nim,
              "id_kelas" : classInfo.id_kelas,
              "kode_mk" : classInfo.kode_mk,
              "nama_mk" : classInfo.nama_mk,
              "absensi" : 'N'
            }
            //console.log(req['nim'])
        
            this.webService.post(this.webService.url + "add_class.php", JSON.stringify(req), null).subscribe(response => {
              let responseData = JSON.parse(response["_body"]);
              console.log(responseData)
              if(responseData['success']){
                //this.navCtrl.push(TabEventPage);
                //harusnya apus
                let ctr = 0;

                for(let selected of this.classInfo){
                  if(classInfo.kode_mk == selected.kode_mk && classInfo.kelas == selected.kelas){
                      this.classInfo.splice(ctr,1);
                      break;
                  }
                  else {
                      ctr++;
                  }
                }
              }
              else{
                let alert = this.alertCtrl.create({
                  title: 'Add Event Failed',
                  subTitle: 'Add Event ',
                  buttons: [
                    {
                      text: 'Ok',
                      handler: data => {
                        //this.navCtrl.push(TabEventPage)
                      }
                    }
                  ]
                });
                alert.present();
              }
            }, error =>{
            })
          } 
        }
      ]
      });
      alert.present(); 
    console.log(classInfo.kode_mk)
  }

  do_assignment(assignInfo) {
    // swal({
    //   title: "Are you sure?",
    //   text: classInfo.kode_mk + ' - ' + classInfo.nama_mk + '\n' +
    //       "Are you sure that you want to attend this class?",
    //   icon: "warning",
    // })
    const alert = this.alertCtrl.create({ 
      title: 'Already Submit Assignment?',
      message: assignInfo.kode_mk + '<br>'+ assignInfo.name,
      buttons: [ 
        { 
          text: 'Yes', 
          handler: data => { 
            let req = {
              "nim" : this.authService.nim,
              "id_elearning" : assignInfo.id_elearning,
              "kode_mk" : assignInfo.kode_mk,
              "name" : assignInfo.name,
              "startdate" : assignInfo.startdate,
              "enddate" : assignInfo.enddate
            }
            console.log(JSON.stringify(req))
        
            this.webService.post(this.webService.url + "add_assignment.php", JSON.stringify(req), null).subscribe(response => {
              //console.log(response["_body"]);
              let responseData = JSON.parse(response["_body"]);
              //console.log(responseData)
              if(responseData['success']){
                //this.navCtrl.push(TabEventPage);
                //harusnya apus
                let ctr = 0;

                for(let selected of this.assignInfo){
                  if(assignInfo.id_elearning == selected.id_elearning){
                      this.assignInfo.splice(ctr,1);
                      break;
                  }
                  else {
                      ctr++;
                  }
                }
              }
              else{
                let alert = this.alertCtrl.create({
                  title: 'Add Event Failed',
                  subTitle: 'Add Event ',
                  buttons: [
                    {
                      text: 'Ok',
                      handler: data => {
                        //this.navCtrl.push(TabEventPage)
                      }
                    }
                  ]
                });
                alert.present();
              }
            }, error =>{
            })
          } 
        },
        // { 
        //   text: 'Cancel',
        //   handler: data => { 
        //     let req = {
        //       "nim" : this.authService.nim,
        //       "id_kelas" : classInfo.id_kelas,
        //       "kode_mk" : classInfo.kode_mk,
        //       "nama_mk" : classInfo.nama_mk,
        //       "absensi" : 'N'
        //     }
        //     //console.log(req['nim'])
        
        //     this.webService.post("http://localhost/umnspa/add_class.php", JSON.stringify(req), null).subscribe(response => {
        //       let responseData = JSON.parse(response["_body"]);
        //       console.log(responseData)
        //       if(responseData['success']){
        //         //this.navCtrl.push(TabEventPage);
        //         //harusnya apus
        //         let ctr = 0;

        //         for(let selected of this.classInfo){
        //           if(classInfo.kode_mk == selected.kode_mk && classInfo.kelas == selected.kelas){
        //               this.classInfo.splice(ctr,1);
        //               break;
        //           }
        //           else {
        //               ctr++;
        //           }
        //         }
        //       }
        //       else{
        //         let alert = this.alertCtrl.create({
        //           title: 'Add Event Failed',
        //           subTitle: 'Add Event ',
        //           buttons: [
        //             {
        //               text: 'Ok',
        //               handler: data => {
        //                 //this.navCtrl.push(TabEventPage)
        //               }
        //             }
        //           ]
        //         });
        //         alert.present();
        //       }
        //     }, error =>{
        //     })
        //   } 
        // }
      ]
      });
      alert.present(); 
    console.log(assignInfo.kode_mk)
  }

}
