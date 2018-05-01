import { Injectable } from '@angular/core';
import { WebService } from './WebService';
import { Headers } from '@angular/http';
import { DatabaseService } from './DBService';
import { AlertController } from 'ionic-angular';
import swal from 'sweetalert';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';

@Injectable()
export class AuthService{
    email = "";
    id_moodle = "";
    token_onesignal = "";
    nim: any;
    notification: "";

    constructor(private webSvc:WebService, private dbSvc:DatabaseService, 
        private alertCtrl: AlertController, private storage: Storage,
        private webService: WebService, private oneSignal: OneSignal){}

    login(email:string, password:string, onSuccess:Function){
        //let url = "http://delthraze.esy.es/Boopang/API/sign_in.php";
        //let url = "http://localhost/umnspa/login.php";
        let url = this.webService.url + "login.php";
        this.oneSignal.getIds().then((ids) => {
            this.token_onesignal = ids.userId;
            console.log('token_onesignal',this.token_onesignal);

            let requestData = {
                "email" : email,
                "password" : password,
                "token_onesignal" : this.token_onesignal
            };
    
            let header = new Headers({
                'Content-Type': 'application/json'
            });
    
            this.webSvc.post(url, JSON.stringify(requestData), header)
            .subscribe(response => {
                console.log(response);
                if(response == null){
                }
                else{
                    console.log(response["_body"]);
                    let responseData:any = JSON.parse(response["_body"]);
                    //console.log(JSON.stringify(responseData));
                    if(responseData == null){
                        this.presentAlert();
                    }
                    else if(responseData['success'] == true){
                        this.nim = responseData['nim']
                        this.email = email;
                        this.id_moodle = responseData['id_moodle'];
                        this.notification = responseData['notification'];
                
                        const session = {
                            nim: this.nim,
                            email: this.email,
                            id_moodle: this.id_moodle,
                            notification: this.notification
                        }
                        this.storage.set('sessions', session);
                        onSuccess();
                    }
                    else{
                        this.presentAlert();
                    }
                }
            }, error => {

            });
        });
    }

    logout(onSuccess:Function){
        let url = this.webService.url + "logout.php";

        let requestData = {
            "nim" : this.nim
        };

        console.log(this.nim);

        let header = new Headers({
            'Content-Type': 'application/json'
        });

        this.webSvc.post(url, JSON.stringify(requestData), header)
        .subscribe(response => {
            console.log(response["_body"]);
            if(response == null){
                console.log('asd');
            }
            else{
                let responseData:any = JSON.parse(response["_body"]);
                //console.log(JSON.stringify(responseData));
                if(responseData == null){
                    //this.presentAlert();
                }
                else if(responseData['success'] == true){
                    this.email = "";
                    this.nim = "";
                    this.id_moodle = "";
                    this.token_onesignal = "";

                    const session = {
                        nim: this.nim,
                        email: this.email,
                        id_moodle: this.id_moodle
                    }
                    this.storage.set('sessions', session);
                    onSuccess();
                }
                else{
                    // this.presentAlert();
                    console.log('gagal keluar');
                }
            }
        }, error => {
        });
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
    
}