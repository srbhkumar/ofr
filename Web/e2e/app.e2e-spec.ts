import { OFRPage } from './app.po';

describe('ofr App', function() {
  let page: OFRPage;

  beforeEach(() => {
    page = new OFRPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
