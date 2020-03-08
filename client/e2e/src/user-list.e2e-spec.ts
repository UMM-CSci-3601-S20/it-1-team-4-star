import {UserPage} from './user-list.po';
import {browser, protractor, by, element} from 'protractor';

describe('User list', () => {
  let page: UserPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new UserPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getUserTitle()).toEqual('Users');
  });

  it('Should type something in the name filter and check that it returned correct elements', async () => {
    await page.typeInput('user-name-input', 'Rachel Johnson');

    // All of the user cards should have the name we are filtering by
    page.getUserCards().each(e => {
      expect(e.element(by.className('user-card-name')).getText()).toEqual('Rachel Johnson');
    });
  });

  it('Should type something in the building filter and check that it returned correct elements', async () => {
    await page.typeInput('user-building-input', 'science');

    // All of the user cards should have the company we are filtering by
    page.getUserCards().each(e => {
      expect(e.element(by.className('user-card-building')).getText()).toEqual('science');
    });
  });

/*

  it('Should type something partial in the building filter and check that it returned correct elements', async () => {
    await page.typeInput('user-building-input', 'sci');

    // Go through each of the cards that are being shown and get the buildings
    const buildings = await page.getUserCards().map(e => e.element(by.className('user-card-building')).getText());

    // We should see these buildings
    expect(buildings).toContain('science');

    // We shouldn't see these buildings
    expect(buildings).not.toContain('imholte');
  });

  it('Should type something in the email filter and check that it returned correct elements', async () => {
    await page.typeInput('user-email-input', 'jb');

    // Go through each of the cards that are being shown and get the names
    const names = await page.getUserCards().map(e => e.element(by.className('user-card-name')).getText());

    // We should see these users whose email has jb
    expect(names).toContain('Joe Beaver');

    // We shouldn't see these users
    expect(names).not.toContain('Rachel Johnson');
    expect(names).not.toContain('Nic McPhee');

  });

  */

  it('Should change the view', async () => {
    await page.changeView('list');

    expect(page.getUserCards().count()).toEqual(0); // There should be no cards
    expect(page.getUserListItems().count()).toBeGreaterThan(0); // There should be list items
  });

  it('Should click view profile on a user and go to the right URL', async () => {
    const firstUserName = await page.getUserCards().first().element(by.className('user-card-name')).getText();
    const firstUserBuilding = await page.getUserCards().first().element(by.className('user-card-building')).getText();
    await page.clickViewProfile(page.getUserCards().first());

    // Wait until the URL contains 'users/' (note the ending slash)
    await browser.wait(EC.urlContains('users/'), 10000);

    // When the view profile button on the first user card is clicked, the URL should have a valid mongo ID
    const url = await page.getUrl();
    expect(RegExp('.*\/users\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);

    // On this profile page we were sent to, the name and building should be correct
    expect(element(by.className('user-card-name')).getText()).toEqual(firstUserName);
    expect(element(by.className('user-card-building')).getText()).toEqual(firstUserBuilding);
  });

  it('Should click add user and go to the right URL', async () => {
    await page.clickAddUserFAB();

    // Wait until the URL contains 'users/new'
    await browser.wait(EC.urlContains('users/new'), 10000);

    // When the view profile button on the first user card is clicked, we should be sent to the right URL
    const url = await page.getUrl();
    expect(url.endsWith('/users/new')).toBe(true);

    // On this profile page we were sent to, We should see the right title
    expect(element(by.className('add-user-title')).getText()).toEqual('New User');
  });

});
