import { AppPage } from './app.po';

describe('ens-angular-truffle-drizzle App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getHeader()).toContain('Angular Truffle Box');
  });
});
