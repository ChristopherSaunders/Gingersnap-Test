import { test, expect } from '@playwright/test';
import {iScenario} from "./scenario-interface.ts";
import JSONdata from "./gingersnap-login.json";

test.describe("Gingersnap Tests", () =>{
  JSONdata.forEach(async (scenario: iScenario)  =>{
    test(scenario.testname, async ({ page }) => {

      //login
      await page.goto(scenario.url);
      await page.fill('#username', scenario.username);
      await page.fill('#password', scenario.password);
      await page.getByRole('button', {name:'Sign In'}).click();

      //Navigation select
      await page.getByRole('button', {name: scenario.project}).click();

      const task = await page.getByRole('heading', {name: scenario.task}).locator("//parent::div");
      const statusLane = await page.locator(`//h2[text()="${scenario.status}"]//parent::div`);
      
      //Check for tags in task
      await scenario.tags.forEach(async(tag: string) =>{
        await expect(task).toContainText(tag);
      });
      
      //Verify Task is in correct Lane
      await expect(statusLane.filter({has: task})).toHaveCount(1);
    });
  });
});