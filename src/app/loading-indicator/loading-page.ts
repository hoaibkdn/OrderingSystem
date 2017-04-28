export class LoadingPage {
  public loading: boolean;
  constructor(value: boolean) {
      this.loading = value;
  }
  standby(): void {
      this.loading = true;
  }

  ready(): void {
      this.loading = false;
  }
}
