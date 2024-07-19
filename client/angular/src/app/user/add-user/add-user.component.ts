import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";
import { User } from "../../model/user.model";
import { constants } from "../../model/constants";
import { MatDialog } from "@angular/material/dialog";
import { DialogBoxComponent } from "../../dialog-box/dialog-box.component";
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"],
})
export class AddUserComponent implements OnInit {
  faUserPlus = faUserPlus;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {}

  authorities: string = constants.ROLE_USER;

  addForm = this.formBuilder.group({
    _id: [],
    username: ["", Validators.required],
    password: ["", Validators.required],
    authorities: [this.authorities, Validators.required],    
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    age: ["", Validators.min(1)],
    salary: ["", Validators.min(1)],
  });

  ngOnInit() {
    if (!localStorage.getItem(constants.TOKEN)) {
       this.router.navigate(["login"]);
       return;
    }
    else {
      let currentUser: any = JSON.parse(localStorage.getItem(constants.CURRENT_USER)!);      
      if (currentUser.authorities != null && constants.ROLE_USER == currentUser.authorities) {          
         this.router.navigate(["login"]);
         return;
      }
    }
  }

  onChange(e: any) {    
    this.authorities = e.target.value;
  }  

  onSubmit() {
    this.addForm.value.authorities = this.authorities;

    if (this.addForm.invalid) {
      return;
    }

    const obj: any = <User> <unknown> this.addForm.value;
    this.apiService
      .createUser(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {          
          if (data.status === 200) {
            this.openDialog(true, "User added successfully.", obj);
          } else {
            this.openDialog(false, data.message, obj);
          }
        },
        error: (e) => {
          this.openDialog(false, e, obj);
        }
      });
  }

  openDialog(navigate: boolean, okMessage: string, obj: any) {        
    obj.action = "Ok";
    obj.okMessage = okMessage;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "300px",
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (navigate) {
         this.router.navigate(["list-user"]);
      }
    });
  }  
}
