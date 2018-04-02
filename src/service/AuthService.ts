import { Injectable } from '@angular/core';
import { WebService } from './WebService';
import { Headers } from '@angular/http';
import { DatabaseService } from './DBService';
import { AlertController } from 'ionic-angular';
import swal from 'sweetalert'

@Injectable()
export class AuthService{
    email = "";
    id_moodle = "";
    nim: any;

    constructor(private webSvc:WebService, private dbSvc:DatabaseService, private alertCtrl: AlertController){}

    login(email:string, password:string, onSuccess:Function){
        //let url = "http://delthraze.esy.es/Boopang/API/sign_in.php";
        let url = "http://localhost/umnspa/login.php";
        let requestData = {
            "email" : email,
            "password" : password
        };
        let header = new Headers({
            'Content-Type': 'application/json'
        });

        this.webSvc.post(url, JSON.stringify(requestData), header)
        .subscribe(response => {
            //console.log(response);
            if(response == null){
            }
            else{
                let responseData:any = JSON.parse(response["_body"]);
                console.log(JSON.stringify(responseData));
                if(responseData == null){
                    this.presentAlert();
                }
                else if(responseData['success'] == true){
                    this.nim = responseData['nim']
                    // let query = "INSERT INTO tbl_user(id) VALUES ('"+responseData['nim']+"')"
                    // console.log(query);
                    // this.dbSvc.query(query, ()=>{
                    //     onSuccess();
                    // }, ()=>{})
                    this.email = email;
                    this.id_moodle = responseData['id_moodle'];
                    onSuccess();
                }
                else{
                    this.presentAlert();
                }
            }
        }, error => {
        });
    }

    logout(){
        this.email = "";
        this.nim = "";
        
    }

    presentAlert2() {
        let alert = this.alertCtrl.create({
            //title: 'Invalid E-mail or Password',
            subTitle: 'Invalid E-mail or Password',
            buttons: ['Dismiss']
        });
        alert.present();
    }

    presentAlert(){
        swal({
            text: "Invalid E-mail or Password",
            icon: "warning",
        })
    }

    // signup(first_name:string, last_name:string,email: string, no_hp:string, password: string, onSuccess:Function){
    //     let url = "http://delthraze.esy.es/Boopang/API/sign_up.php";
    //     let requestData = {
    //         "first_name": first_name,
    //         "last_name":last_name,
    //         "email" : email,
    //         "phone_number" : no_hp,
    //         "password" : password,
    //         "type" : "OWNER"
    //     };
    //     let header = new Headers({
    //         'Content-Type': 'application/json'
    //     });

    //     this.webSvc.post(url, JSON.stringify(requestData), header)
    //     .subscribe(response => {
    //         if(response == null){
    //         }
    //         else{
    //             let responseData:any = JSON.parse(response["_body"]);
    //             console.log(JSON.stringify(responseData));
    //             this.login(email, password, onSuccess)
    //         }
    //     }, error => {
    //     });
    // }


    //logout(){
    //     let url = "http://delthraze.esy.es/Boopang/API/sign_in.php";
    //     let requestData = {
    //     };
    //     let header = new Headers({
    //         'Content-Type': 'application/json'
    //     });

    //     this.webSvc.post(url, JSON.stringify(requestData), header)
    //     .subscribe(response => {
    //         if(response == null){
    //         }
    //         else{
    //             let responseData:any = JSON.parse(response["_body"]);
    //             console.log(JSON.stringify(responseData));
    //             let query = "DELETE FROM tbl_user WHERE 1";
    //             this.dbSvc.query(query, ()=>{
    //                 // Kalo uda sukses logout ngapain
    //                 console.log("logout");
    //                 //return true;
    //             }, ()=>{})
    //         }
    //     }, error => {
    //     });
    // }
    // getActiveUser(){
    //     return firebase.auth().currentUser;
    // }
    //}
    
}