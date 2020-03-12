import {browser, by, element, Key, ElementFinder} from 'protractor';

export class NotePage {
  navigateTo() {
    return browser.get('/notes');
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  getNoteTitle() {
    const title = element(by.className('note-list-title')).getText();
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

  getNoteCards() {
    return element(by.className('note-cards-container')).all(by.tagName('app-note-card'));
  }

  getNoteListItems() {
    return element(by.className('note-nav-list')).all(by.className('note-list-item'));
  }

  changeView(viewType: 'card' | 'list') {
    return element(by.id('view-type-radio')).element(by.css('mat-radio-button[value="' + viewType + '"]')).click();
  }

  clickAddNoteFAB() {
    return element(by.className('add-note-fab')).click();
  }
}
