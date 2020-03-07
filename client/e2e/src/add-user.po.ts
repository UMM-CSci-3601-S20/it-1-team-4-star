import {browser, by, element, Key, ElementFinder} from 'protractor';

export interface TestUser {
  name: string;
  email?: string;
  building: string;
  officeNumber: string;
}

export class AddUserPage {
  navigateTo() {
    return browser.get('/users/new');
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  getTitle() {
    const title = element(by.className('add-user-title')).getText();
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

  clickAddUser() {
    return element(by.buttonText('ADD USER')).click();
  }

  async addUser(newUser: TestUser) {
    await this.typeInput('nameField', newUser.name);
    await this.typeInput('buildingField', newUser.building);
    await this.typeInput('emailField', newUser.email);
    await this.typeInput('officeNumberField',newUser.officeNumber);
    return this.clickAddUser();
  }

}
