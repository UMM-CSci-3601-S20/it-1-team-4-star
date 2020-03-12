import {NotePage} from './note-list.po';
import {browser, protractor, by, element} from 'protractor';

describe('Note list', () => {
  let page: NotePage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new NotePage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getNoteTitle()).toEqual('Notes - This is displaying all notes.');
  });

  it('Should click add note and go to the right URL', async () => {
    await page.clickAddNoteFAB();

    // Wait until the URL contains 'notes/new'
    await browser.wait(EC.urlContains('notes/new'), 10000);

    // When the view profile button on the first note card is clicked, we should be sent to the right URL
    const url = await page.getUrl();
    expect(url.endsWith('/notes/new')).toBe(true);

    // On this profile page we were sent to, We should see the right title
    expect(element(by.className('add-note-title')).getText()).toEqual('New Note');
  });

});
