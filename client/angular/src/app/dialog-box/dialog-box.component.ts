//dialog-box.component.ts
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from "../model/user.model";
import { faXmark, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
 
@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent {
  faXmark = faXmark;
  faTrash = faTrash;
  faCheck = faCheck;
  action: string;
  local_data: any;
  okMessage: any | undefined;
 
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {    
    this.local_data = data;
    this.action = this.local_data.action;
  }
 
  doAction(){
    this.dialogRef.close({event:this.action, data:this.local_data});
  }
 
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
 
}
 