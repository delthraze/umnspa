import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, LoadingController, Refresher, ToastCmp, ToastController } from 'ionic-angular';
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
  countday: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private authService: AuthService, private webService: WebService,
    private alertCtrl: AlertController, private menuCtrl: MenuController,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
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
    this.getClassInfo(null, false);
    this.getAssignmentInfo();
    this.getQuizInfo(null, false);
    this.getLevelInfo();
    //this.tes_time();
    //console.log(this.myDate); 
  }

  getClassInfo(refresher, isRefresh){
    //console.log(this.authService.nim);
    let req = {
      'nim' : this.authService.nim
    }
    if (!isRefresh) this.presentLoading();
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
        var nowtime = new Date().getTime();
        // for(var i = 0; i < responseData.length; i++){
        //   var endtime = new Date(this.assignInfo[i]['enddate']).getTime();
        //   this.assignInfo[i]['waktu'] = new Date(endtime - nowtime).toISOString();
        //   console.log('enddate',this.assignInfo[i]['waktu']);
        // }
        //console.log('ini respon',responseData[0]['enddate']);
        //this.assignInfo['countdown'] = this.tes_time(responseData['enddate']);
        console.log('tugas');
        //console.log(this.classInfo);
      }
    }, error =>{
      console.log('assign error', error);

    })
  }

  intervaltime(id,enddate){
    var datenow = new Date();
    var nowtime = new Date().getTime();
    var endday = (enddate.substring(0, 2));
    var endmonth = (enddate.substring(3, 5));
    var endyear = (enddate.substring(6, 10));
    var endhour = (enddate.substring(11, 16));
    //var endtime = new Date(enddate.substring(0, 11)).getTime();
    //var endtime = new Date("05-05-2018 05:00").getTime();
    var endtime = new Date(endmonth + "-" + endday + "-" + endyear + " " + endhour).getTime();
    console.log('id ',id);

    // console.log("\tnow date: "+datenow);
    // console.log("\tend date: "+enddate);
    // console.log("\tend day: "+endday);
    // console.log("\tend mon: "+endmonth);
    // console.log("\tend year: "+endyear);
    // console.log("\tend hour: "+endhour);
    // console.log("\tnow time: "+nowtime);
    // console.log("\tend time: "+endtime);
    var intervaltime = new Date(endtime - nowtime).toISOString();
    console.log('beda',intervaltime);
    this.countday = intervaltime.substring(8,10);
    if(this.countday > 1){
      var countday2 = this.countday - 1;
      var intervaltime_ = '(' + countday2 + 'd ' + intervaltime.substring(11,13) + 'h ' + intervaltime.substring(14,16) + 'm left)';  
    } else{
      var intervaltime_ = '(0d ' + intervaltime.substring(11,13) + 'h ' + intervaltime.substring(14,16) + 'm left)';
    }
    //masih kurang bulan

    return intervaltime_;
  }

  getQuizInfo(refresher, isRefresh){
    
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
        
        if (isRefresh){
          refresher.complete();
        }
      }
    }, error =>{
    })
    if (!isRefresh) this.dismissLoading();

  }

  do_assignment(assignInfo){
    swal({
      title: "Submit Assignment",
      text: "Are you already submit "+ assignInfo.name +" ?",
      icon: 'warning',
      buttons: ["Cancel", "Yes!"],
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
                  this.presentToast(responseData['exp']);
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
          swal("Success!", "You have submited your assignment", "success");
        }, error =>{
          swal("Unsuccessful", "Please try again", "failed");
        })        
      }
    });
  }
  
  do_class(classInfo){
    swal({
      title: "Attend Class",
      text: "Are you already at " + classInfo.ruangan + " ?",
      icon : 'warning',
      buttons: ["Cancel", "Yes!"],
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
                  this.getLevelInfo();
                  this.presentToast(responseData['exp']);
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
          swal("Success!", "You have attended your class", "success");
        }, error =>{
          swal("Unsuccessful", "Please try again", "failed");
        })        
      }
    });
  }

  do_quiz(quizInfo){
    swal({
      title: "Attempt Quiz",
      text: "Are you already finish "+ quizInfo.name +" ?",
      icon: "warning",
      buttons: ["Cancel", "Yes!"],
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
                  this.presentToast(responseData['exp']);
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
          swal("Success!", "You have finished your quiz", "success");
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

    this.myDate = moment().format();
    this.getClassInfo(refresher, true);
    this.getAssignmentInfo();
    this.getQuizInfo(refresher, true);
    this.getLevelInfo();
  }

  tes_time(waktu){

    var nowtime = new Date().getTime();
     var testime = new Date('2018-05-10').getTime();
    //var testime = new Date(waktu).getTime();

    //console.log('now',nowtime);
    //console.log('testime',testime);
    //console.log('waktu',waktu);

    var difftime = testime - nowtime;

    // console.log('diff',difftime);

    var interval = 1000;
    

    // setInterval(function() {
    //   var duration = moment.duration(difftime, 'milliseconds');
    //   difftime -= 1000;
    // //   console.log(duration.days() + ' Days ' + duration.hours() + " Hours " + duration.minutes() + " Minutes " + duration.seconds() + " Seconds Left")
    // // }, interval);
    console.log('difftime',difftime);
    //return "hai janssen "+difftime;
  }

  presentToast(exp) {
    let toast = this.toastCtrl.create({
      message: "Exp +"+exp,
      duration: 3000,
      position: "bottom",
      cssClass: "toast-style"
    });
    toast.present();
  }

}
