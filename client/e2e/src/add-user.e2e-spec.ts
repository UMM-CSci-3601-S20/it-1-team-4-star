import {browser, protractor, by, element, utils} from 'protractor';
import { AddUserPage, TestUser } from './add-user.po';
import { E2EUtil } from './e2e.util';

describe('Add user', () => {
  let page: AddUserPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AddUserPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getTitle()).toEqual('New User');
  });


  it('Should enable and disable the add user button', async () => {
    expect(element(by.buttonText('ADD USER')).isEnabled()).toBe(false);
    await page.typeInput('nameField', 'test');
    expect(element(by.buttonText('ADD USER')).isEnabled()).toBe(false);
    await page.typeInput('buildingField', 'test building');
    expect(element(by.buttonText('ADD USER')).isEnabled()).toBe(false);
    await page.typeInput('officeNumberField', '345');
    expect(element(by.buttonText('ADD USER')).isEnabled()).toBe(false);
    await page.typeInput('emailField', 'test77@example.com');
    expect(element(by.buttonText('ADD USER')).isEnabled()).toBe(true);
  });

  it('Should add a new user and go to the right page', async () => {
    const user: TestUser = {
      name: E2EUtil.randomText(20),
      email: E2EUtil.randomText(5) + '@gmail.com',
      building: E2EUtil.randomText(25),
      officeNumber: '777'
    };

    await page.addUser(user);

    // Wait until the URL does not contain 'users/new'
    await browser.wait(EC.not(EC.urlContains('users/new')), 2000);

    const url = await page.getUrl();
    expect(RegExp('.*\/users\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);
    expect(url.endsWith('/users/new')).toBe(false);

    expect(element(by.className('user-card-name')).getText()).toEqual(user.name);
    expect(element(by.className('user-card-email')).getText()).toEqual(user.email);
    expect(element(by.className('user-card-building')).getText()).toEqual(user.building);
    expect(element(by.className('user-card-officeNumber')).getText()).toEqual(user.officeNumber);
  });

});
