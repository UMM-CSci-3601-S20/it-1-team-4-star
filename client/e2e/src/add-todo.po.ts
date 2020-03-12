import {browser, by, element, Key, ElementFinder} from 'protractor';

export interface TestNote {
  body: string;
  reusable: boolean;
  draft: boolean;
  toDelete: boolean;
}

export class AddNotePage {
  navigateTo() {
    return browser.get('/notes/new');
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  getTitle() {
    const title = element(by.className('add-note-title')).getText();
    return title;
  }

  async typeInput(inputId: string, text: string) {
    const input = element(by.id(inputId));
    await input.click();
    await input.sendKeys(text);
  }

  selectMatSelectValue(selectID: string, value: string) {
    const sel = element(by.id(selectID));
    return sel.click().then(() => {
      return element(by.css('mat-option[value="' + value + '"]')).click();
    });
  }

  clickAddNote() {
    return element(by.buttonText('ADD NOTE')).click();
  }

  async addNote(newNote: TestNote) {
    await this.typeInput('bodyField', newNote.body);
    await this.typeInput('reusableField', newNote.reusable.toString());
    await this.typeInput('draftField', newNote.draft.toString());
    await this.typeInput('toDeleteField',newNote.toDelete.toString());
    return this.clickAddNote();
  }

}
