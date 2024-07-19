import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { User } from "../../model/user.model";
import { constants } from "../../model/constants";
import { ApiService } from "../../service/api.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogBoxComponent } from "../../dialog-box/dialog-box.component";
import { faUserPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"]
})
export class EditUserComponent implements OnInit {
  faUserPen = faUserPen;

  authorities: string = constants.ROLE_USER;
  isUser: Boolean = false;
  isAdmin: Boolean = false;

  editForm = this.formBuilder.group({
    _id: [""],
    username: ["", Validators.required],
    password: ["", Validators.required],
    authorities: ["", Validators.required],
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    age: ["", Validators.min(1)],
    salary: ["", Validators.min(1)]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if (localStorage.getItem(constants.TOKEN)) {
      let userId = localStorage.getItem(constants.ID);
      if (!userId) {
        alert("Invalid action.");
        this.router.navigate(["list-user"]);
        return;
      }

      this.apiService.getUserById(+userId).subscribe(data => {
        this.authorities = data.result.authorities;
        this.isUser = (constants.ROLE_USER == this.authorities);
        this.isAdmin = (constants.ROLE_ADMIN == this.authorities);
        this.editForm.setValue(data.result);
      });
    }
    else {
      this.router.navigate(["login"]);
      return;
    }
  }

  onChange(e: any) {    
    this.authorities = e.target.value;
  }

  onSubmit() {
    this.editForm.value.authorities = this.authorities;

    if (this.editForm.invalid) {
      return;
    }
    
    const obj: any = <User> <unknown> this.editForm.value;
    this.apiService
      .updateUser(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.openDialog(true, "User updated successfully.", obj);
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
