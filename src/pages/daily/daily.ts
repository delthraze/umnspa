import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, LoadingController, Refresher } from 'ionic-angular';
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
  @ViewChild(Refresher) refresher: Refresher;

  myDate: String = new Date().toISOString();
  classInfo: any;
  assignInfo: any;
  quizInfo: any;
  loading: any;
  limit : 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private authService: AuthService, private webService: WebService,
    private alertCtrl: AlertController, private menuCtrl: MenuController,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyPage');
    // this.myDate = moment().format();
    // this.getClassInfo();
    // console.log(this.myDate);
  }

  ionViewWillEnter(){
    this.myDate = moment().format();
    this.menuCtrl.close();
    this.menuCtrl.enable(true, 'myMenu');
    this.menuCtrl.swipeEnable(true, 'myMenu');
    this.getClassInfo();
    this.getAssignmentInfo();
    this.getQuizInfo();
    this.getLevelInfo();
    //this.tes_time();
    //console.log(this.myDate); 
  }

  getClassInfo(){
    //console.log(this.authService.nim);
    let req = {
      'nim' : this.authService.nim
    }
    this.presentLoading();
    this.webService.post(this.webService.url + "get_today_class.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
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
      'nim' : this.authService.nim,
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
      console.log('assign error', error);

    })
  }

  getQuizInfo(){
    
    let req = {
      'id_moodle' : this.authService.id_moodle,
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_quiz2.php", JSON.stringify(req), null).subscribe(response => {
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

    this.dismissLoading();
  }

  do_assignments(assignInfo){
    swal({
      title: "Are you sure?",
      text: "Are you sure that you have already submit the assignment?",
      icon: 'warning',
      buttons: ["Cancel", "Click me!"],
    })
    .then(willDelete => {
      if (willDelete) {
        let req = {
          "nim" : this.authService.nim,
          "id_elearning" : assignInfo.id_elearning,
          "kode_mk" : assignInfo.kode_mk,
          "name" : assignInfo.name,
          "startdate" : assignInfo.startdate,
          "enddate" : assignInfo.enddate
        }
        //console.log(JSON.stringify(req))
    
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
                  this.getLevelInfo();
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
          }
          swal("Submited!", "You have submited your assignment", "success");
        }, error =>{
          swal("Unsuccessful", "Please try again", "failed");
        })        
      }
    });
  }
  
  do_class(classInfo){
    swal({
      title: "Are you sure?",
      text: "Are you sure that you already at " + classInfo.ruangan + " ?",
      icon : 'warning',
      buttons: ["Cancel", "Click me!"],
    })
    .then(willDelete => {
      if (willDelete) {
        let req = {
          "nim" : this.authService.nim,
          "id_kelas" : classInfo.id_kelas,
          "kode_mk" : classInfo.kode_mk,
          "nama_mk" : classInfo.nama_mk,
          "absensi" : 'Y'
        }
        console.log(req.id_kelas);
    
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
          // else{
          //   let alert = this.alertCtrl.create({
          //     title: 'Add Event Failed',
          //     subTitle: 'Add Event ',
          //     buttons: [
          //       {
          //         text: 'Ok',
          //         handler: data => {
          //           //this.navCtrl.push(TabEventPage)
          //         }
          //       }
          //     ]
          //   });
          // }
          swal("Attended!", "You have attend your class", "success");
        }, error =>{
          swal("Unsuccessful", "Please try again", "failed");
        })        
      }
    });
  }

  do_quiz(quizInfo){
    swal({
      title: "Are you sure?",
      text: "Are you sure that you do your quiz?",
      icon: "warning",
      buttons: ["Cancel", "Sure!"],
    })
    .then(willDelete => {
      if (willDelete) {
        let req = {
          "nim" : this.authService.nim,
          "id_elearning" : quizInfo.id_elearning,
          "kode_mk" : quizInfo.kode_mk,
          "startdate" : quizInfo.startdate,
          "enddate" : quizInfo.enddate
        }
        //console.log(JSON.stringify(req))
    
        this.webService.post(this.webService.url + "add_quiz.php", JSON.stringify(req), null).subscribe(response => {
          //console.log(response["_body"]);
          let responseData = JSON.parse(response["_body"]);
          //console.log(responseData)
          if(responseData['success']){
            //this.navCtrl.push(TabEventPage);
            //harusnya apus
            let ctr = 0;

            for(let selected of this.quizInfo){
              if(quizInfo.id_elearning == selected.id_elearning){
                  this.quizInfo.splice(ctr,1);
                  this.getLevelInfo();
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
          }
          swal("Done!", "You have do your quiz", "success");
        }, error =>{
          swal("Unsuccessful", "Please try again", "failed");
        })        
      }
    });
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

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  tes_time(){
    var nowtime = new Date().getTime();
    var testime = new Date('2018-04-20').getTime();;

    console.log('now',nowtime);
    console.log('testime',testime);

    var difftime = testime - nowtime;

    console.log('diff',difftime);

    var interval = 1000;

    setInterval(function() {
      var duration = moment.duration(difftime, 'milliseconds');
      difftime -= 1000;
      console.log(duration.days() + ':' + duration.hours() + ":" + duration.minutes() + ":" + duration.seconds())
    }, interval);
  
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
            //console.log(JSON.stringify(req))
        
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
                      this.getLevelInfo();
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
          text: 'Cancel',
          handler: data => { 
            
          } 
        }
      ]
      });
      alert.present(); 
    console.log(assignInfo.kode_mk)
  }

  do_class1(classInfo) {
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
            console.log(req.id_kelas);
        
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
              //console.log(responseData)
              if(responseData['success']){
                //this.navCtrl.push(TabEventPage);
                //harusnya apus
                let ctr = 0;

                for(let selected of this.classInfo){
                  if(classInfo.kode_mk == selected.kode_mk && classInfo.kelas == selected.kelas){
                      this.classInfo.splice(ctr,1);
                      this.getLevelInfo();
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

  do_quiz1(quizInfo) {
    // swal({
    //   title: "Are you sure?",
    //   text: classInfo.kode_mk + ' - ' + classInfo.nama_mk + '\n' +
    //       "Are you sure that you want to attend this class?",
    //   icon: "warning",
    // })
    const alert = this.alertCtrl.create({ 
      title: 'Already Finish Your Quiz?',
      message: quizInfo.kode_mk + '<br>'+ quizInfo.name,
      buttons: [ 
        { 
          text: 'Yes', 
          handler: data => { 
            let req = {
              "nim" : this.authService.nim,
              "id_elearning" : quizInfo.id_elearning,
              "kode_mk" : quizInfo.kode_mk,
              "startdate" : quizInfo.startdate,
              "enddate" : quizInfo.enddate
            }
            //console.log(JSON.stringify(req))
        
            this.webService.post(this.webService.url + "add_quiz.php", JSON.stringify(req), null).subscribe(response => {
              //console.log(response["_body"]);
              let responseData = JSON.parse(response["_body"]);
              //console.log(responseData)
              if(responseData['success']){
                //this.navCtrl.push(TabEventPage);
                //harusnya apus
                let ctr = 0;

                for(let selected of this.quizInfo){
                  if(quizInfo.id_elearning == selected.id_elearning){
                      this.quizInfo.splice(ctr,1);
                      this.getLevelInfo();
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
          text: 'Cancel',
          handler: data => { 
            
          } 
        }
      ]
      });
      alert.present(); 
    console.log(quizInfo.kode_mk)
  }

}
