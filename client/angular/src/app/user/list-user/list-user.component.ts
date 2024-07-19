import { Component, ViewChild, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../model/user.model";
import { constants } from './../../model/constants';
import { ApiService } from "../../service/api.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { DialogBoxComponent } from "../../dialog-box/dialog-box.component";
import { faPlus, faPen, faTrash, faDoorOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-list-user",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.css"]
})
export class ListUserComponent implements OnInit {
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  faDoorOpen = faDoorOpen;

  currentUser: any | undefined;

  isUser: Boolean = false;

  displayedColumns: string[] = [
    constants.ID,
    "firstName",
    "lastName",
    "username",
    "age",
    "salary",
    "action"
  ];

  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (localStorage.getItem(constants.TOKEN)) {
       let currentUser: any = JSON.parse(localStorage.getItem(constants.CURRENT_USER)!);
       this.currentUser = currentUser.firstName + " " + currentUser.lastName + " (" + currentUser.username +")";
       if (currentUser.authorities != null) {          
          this.isUser = (constants.ROLE_USER == currentUser.authorities);
       }
    }
    else {
      this.router.navigate(["login"]);
      return;
    }

    this.apiService.getUsers().subscribe(data => {
      this.dataSource.data = data.result;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(user: User): void {
    this.apiService.deleteUser(user._id).subscribe(data => {
      this.dataSource.data = this.dataSource.data.filter(u => u !== user);
    });
  }

  editUser(user: User): void {
    localStorage.removeItem(constants.ID);
    localStorage.setItem(constants.ID, user._id.toString());
    this.router.navigate(["edit-user"]);
  }

  addUser(): void {
    this.router.navigate(["add-user"]);
  }

  openDialog(action: any, obj: { action: any; }) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "250px",
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == "Delete") {
        this.deleteUser(result.data);
      }
    });
  }
}
