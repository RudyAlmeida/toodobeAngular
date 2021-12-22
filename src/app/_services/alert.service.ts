import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: "root" })
export class AlertService {
  private keepAfterNavigationChange = false;

  constructor(private router: Router, private snackBar: MatSnackBar) {
    // clear alert message on route change
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        }
      }
    });
  }

  success(
    message: string,
    timer: number = 5000,
    keepAfterNavigationChange = false
  ) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.showMessage({ type: "success", text: message, timer });
  }

  error(
    message: string,
    timer: number = 5000,
    keepAfterNavigationChange = false
  ) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.showMessage({ type: "error", text: message, timer });
  }

  showMessage({ text, type, timer }) {
    this.snackBar.open(text, "x", {
      duration: timer,
    });
  }
}
