import { Component } from "@angular/core";
import {Router} from "@angular/router";
import {ApiService} from "./service/api.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { constants } from "./model/constants";
import { DialogBoxComponent } from "./dialog-box/dialog-box.component";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent {
  title = "User Management Web Application";
  currentUser: any | undefined;
  faRightFromBracket = faRightFromBracket;

  constructor(private router: Router, private apiService: ApiService, private modalService: NgbModal, public dialog: MatDialog) { }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  doLogout() {
    this.currentUser = localStorage.getItem(constants.CURRENT_USER);
    if (this.currentUser) {
       this.apiService.logout().subscribe(data => {
          if (data.status === 200) {
             let obj: any = JSON.parse(localStorage.getItem(constants.CURRENT_USER)!);             
             this.currentUser = undefined;    
             localStorage.removeItem(constants.CURRENT_USER);
             localStorage.removeItem(constants.TOKEN);

             this.openDialog(data.message, obj);
          }
        });
    }
    
    return false;
  } 

  openDialog(okMessage: string, obj: any) {        
    obj.action = "Ok";
    obj.okMessage = okMessage;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "350px",
      data: obj,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['login']);
    });
  }  
}
