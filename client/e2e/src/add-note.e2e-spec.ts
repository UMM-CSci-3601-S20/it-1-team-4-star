import { browser, protractor, by, element, utils } from 'protractor';
import { AddNotePage, TestNote } from './add-note.po';
import { E2EUtil } from './e2e.util';

describe('Add Note', () => {
  let page: AddNotePage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AddNotePage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getTitle()).toEqual('New Note');
  });


  it('Should enable and disable the add note button with good input', async () => {
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.typeInput('bodyField', 'Hello, this is a note');
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.selectMatSelectValue('reuseField', 'true');
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.selectMatSelectValue('draftField', 'true');
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.selectMatSelectValue('toDeleteField', 'true');
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(true);

  });
  it('Should enable and disable the add note button with bad input', async () => {
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.typeInput('bodyField', ''); // Blank message shouldn't pass validation.
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.selectMatSelectValue('reuseField', 'true');
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.selectMatSelectValue('draftField', 'true');
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);
    await page.selectMatSelectValue('toDeleteField', 'true');
    expect(element(by.buttonText('ADD NOTE')).isEnabled()).toBe(false);

  });

  it('Should add a new note and go to the right page', async () => {
    const note: TestNote = {
      body: E2EUtil.randomText(20),
      reuse: true,
      draft: true,
      toDelete: true,
    };

    await page.addNote(note);

    // Wait until the URL does not contain 'users/new'
    await browser.wait(EC.not(EC.urlContains('notes/new')), 2000);

    const url = await page.getUrl();
    //expect(RegExp('.*\/notes\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);
    expect(url.endsWith('/notes/new')).toBe(false);

    expect(element(by.id('note-card-body')).getText()).toEqual(note.body);
    expect(element(by.className('note-card-reusable')).getText()).toEqual(note.reuse.valueOf());
    expect(element(by.className('note-card-draft')).getText()).toEqual(note.draft.valueOf());
    expect(element(by.className('note-card-toDelete')).getText()).toEqual(note.toDelete.valueOf());
  });

});
