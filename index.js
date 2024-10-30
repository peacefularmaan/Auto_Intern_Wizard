// // const puppeteer = require("puppeteer");
// // const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// // const { executablePath } = require("puppeteer");
// // puppeteer.use(StealthPlugin());

// const puppeteer = require("puppeteer-extra"); 
// const pluginStealth = require("puppeteer-extra-plugin-stealth"); 
 
// //save to executable path
// const { executablePath } = require("puppeteer"); 
 
// // use stealth 
// puppeteer.use(pluginStealth());
// let { id, pass } = require("./secret");
// let tab;
// let dataFile = require("./data");

// function getRandomDelay(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// async function main() {

//     let browser = await puppeteer.launch({
//         executablePath: executablePath(),
//         headless: false,
//         defaultViewport: false,
//         args: ["--start-maximized"]
//     });


//     let pages = await browser.pages();
//     tab = pages[0];
//     await tab.goto("https://internshala.com/");
//     await tab.click("button.login-cta");
//     await tab.type("#modal_email", id, { delay: 50 });
//     await tab.type("#modal_password", pass, { delay: 50 });
//     await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 3000))); // Add random delay
//     await tab.click("#modal_login_submit");
//     await tab.waitForNavigation({ waitUntil: "networkidle2" });
//     await tab.click(".nav-link.dropdown-toggle.profile_container.is_icon_header.ic-24-filled-down-arrow");

//     let profile_options = await tab.$$(".profile_options a");
//     let app_urls = [];
//     for (let i = 0; i < 11; i++) {
//         let url = await tab.evaluate(function (ele) {
//             return ele.getAttribute("href");
//         }, profile_options[i]);
//         app_urls.push(url);
//     }
//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 2000);
//     });
//     tab.goto("https://internshala.com" + app_urls[1]);

//     await tab.waitForSelector("#graduation-tab .ic-16-plus", { visible: true });
//     await tab.click("#graduation-tab .ic-16-plus");
//     await graduation(dataFile[0]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });

//     await tab.waitForSelector(".next-button", { visible: true });
//     await tab.click(".next-button");

//     await training(dataFile[0]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });

//     await tab.waitForSelector(".next-button", { visible: true });
//     await tab.click(".next-button");

//     await tab.waitForSelector(".btn.btn-secondary.skip.skip-button", { visible: true });
//     await tab.click(".btn.btn-secondary.skip.skip-button");

//     await workSample(dataFile[0]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });

//     await tab.waitForSelector("#save_work_samples", { visible: true });
//     await tab.click("#save_work_samples");

//     // await tab.waitForSelector(".resume_download_mobile", {visible : true});
//     // await tab.click(".resume_download_mobile");                                // if you want to download resume.

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });
//     await application(dataFile[0]);
// }

// async function graduation(data) {
//     await tab.waitForSelector("#degree_completion_status_pursuing", { visible: true });
//     await tab.click("#degree_completion_status_pursuing");

//     await tab.waitForSelector("#college", { visible: true });
//     await tab.type("#college", data["College"]);

//     await tab.waitForSelector("#start_year_chosen", { visible: true });
//     await tab.click("#start_year_chosen");
//     await tab.waitForSelector(".active-result[data-option-array-index='5']", { visible: true });
//     await tab.click(".active-result[data-option-array-index='5']");

//     await tab.waitForSelector("#end_year_chosen", { visible: true });
//     await tab.click('#end_year_chosen');
//     await tab.waitForSelector("#end_year_chosen .active-result[data-option-array-index = '6']", { visible: true });
//     await tab.click("#end_year_chosen .active-result[data-option-array-index = '6']");

//     await tab.waitForSelector("#degree", { visible: true });
//     await tab.type("#degree", data["Degree"]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });
//     await tab.waitForSelector("#stream", { visible: true });
//     await tab.type("#stream", data["Stream"]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });
//     await tab.waitForSelector("#performance-college", { visible: true });
//     await tab.type("#performance-college", data["Percentage"]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });

//     await tab.click("#college-submit");

// }

// async function training(data) {
//     await tab.waitForSelector(".experiences-tabs[data-target='#training-modal'] .ic-16-plus", { visible: true });
//     await tab.click(".experiences-tabs[data-target='#training-modal'] .ic-16-plus");

//     await tab.waitForSelector("#other_experiences_course", { visible: true });
//     await tab.type("#other_experiences_course", data["Training"]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });

//     await tab.waitForSelector("#other_experiences_organization", { visible: true });
//     await tab.type("#other_experiences_organization", data["Organization"]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });

//     await tab.click("#other_experiences_location_type_label");

//     await tab.click("#other_experiences_start_date");

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 1000);
//     });

//     await tab.waitForSelector(".ui-state-default[href='#']", { visible: true });
//     let date = await tab.$$(".ui-state-default[href='#']");
//     await date[0].click();
//     await tab.click("#other_experiences_is_on_going");

//     await tab.waitForSelector("#other_experiences_training_description", { visible: true });
//     await tab.type("#other_experiences_training_description", data["description"]);

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 2000);
//     });

//     await tab.click("#training-submit");

// }

// async function workSample(data) {
//     await tab.waitForSelector("#other_portfolio_link", { visible: true });
//     await tab.type("#other_portfolio_link", data["link"]);
// }

// async function application(data) {

//     await tab.goto("https://internshala.com/the-grand-summer-internship-fair");

//     await tab.waitForSelector(".btn.btn-primary.campaign-btn.view_internship", { visible: true });
//     await tab.click(".btn.btn-primary.campaign-btn.view_internship")

//     await new Promise(function (resolve, reject) {
//         return setTimeout(resolve, 2000);
//     });
//     await tab.waitForSelector(".view_detail_button", { visible: true });
//     let details = await tab.$$(".view_detail_button");
//     let detailUrl = [];
//     for (let i = 0; i < 3; i++) {
//         let url = await tab.evaluate(function (ele) {
//             return ele.getAttribute("href");
//         }, details[i]);
//         detailUrl.push(url);
//     }

//     for (let i of detailUrl) {
//         await apply(i, data);
//         await new Promise(function (resolve, reject) {
//             return setTimeout(resolve, 1000);
//         });
//     }

// }

// async function apply(url, data) {
//     await tab.goto("https://internshala.com" + url);

//     await tab.waitForSelector(".btn.btn-large", { visible: true });
//     await tab.click(".btn.btn-large");

//     await tab.waitForSelector("#application_button", { visible: true });
//     await tab.click("#application_button");

//     await tab.waitForSelector(".textarea.form-control", { visible: true });
//     let ans = await tab.$$(".textarea.form-control");

//     for (let i = 0; i < ans.length; i++) {
//         if (i == 0) {
//             await ans[i].type(data["hiringReason"]);
//             await new Promise(function (resolve, reject) {
//                 return setTimeout(resolve, 1000);
//             });
//         }
//         else if (i == 1) {
//             await ans[i].type(data["availability"]);
//             await new Promise(function (resolve, reject) {
//                 return setTimeout(resolve, 1000);
//             });
//         }
//         else {
//             await ans[i].type(data["rating"]);
//             await new Promise(function (resolve, reject) {
//                 return setTimeout(resolve, 1000);
//             });
//         }
//     }

//     await tab.click(".submit_button_container");

// }

// main();






const puppeteer = require("puppeteer");
let { id, pass } = require("./secret");
let tab;
let dataFile = require("./data");

async function main() {
    let browser = await puppeteer.launch({
        headless: false, // You can set this to true if you want to run it in headless mode after testing
        defaultViewport: null,
        args: [
            '--incognito',
            "--start-maximized",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled"
        ]
    });

    let pages = await browser.pages();
    tab = pages[0];

    // Clear cookies and local storage
    const client = await tab.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    
    // Set a random user agent to avoid detection
    await setRandomUserAgent(tab);

    await tab.goto("https://internshala.com/");
    
    await randomMouseMove(tab);
    await tab.click("button.login-cta");

    // Type email and password slowly with delay between key presses
    await slowType(tab, "#modal_email", id);
    await slowType(tab, "#modal_password", pass);
    
    await randomMouseMove(tab);
    
    // Random delay before clicking login button
    await randomDelay();
    await tab.click("#modal_login_submit");

    // Wait for the navigation to complete after login attempt
    await tab.waitForNavigation({ waitUntil: "networkidle2" });

    // Checking if the login was successful (and no CAPTCHA error)
    const profileButton = await tab.$(".nav-link.dropdown-toggle.profile_container .is_icon_header.ic-24-filled-down-arrow");
    if (!profileButton) {
        console.log("Failed to log in, CAPTCHA might have been triggered.");
        return;
    }

    await tab.click(".nav-link.dropdown-toggle.profile_container .is_icon_header.ic-24-filled-down-arrow");

    // let profile_options = await tab.$$(".profile_options a");
    // let app_urls = [];
    // for (let i = 0; i < 11; i++) {
    //     let url = await tab.evaluate(function (ele) {
    //         return ele.getAttribute("href");
    //     }, profile_options[i]);
    //     app_urls.push(url);
    // }

    // await randomDelay();
    // await tab.goto("https://internshala.com" + app_urls[1]);
    
    // Continue the rest of the application process
    await applyToInternships(dataFile);
}

// Apply random user agent for each session
async function setRandomUserAgent(tab) {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0',
    ];

    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await tab.setUserAgent(randomUserAgent);
}

// Simulate human-like typing with delay between key presses
async function slowType(tab, selector, text) {
    for (let i = 0; i < text.length; i++) {
        await tab.type(selector, text[i], { delay: getRandomInt(100, 200) }); // Random delay between 100ms and 200ms
    }
}

// Simulate human-like mouse movements
async function randomMouseMove(tab) {
    const randomX = getRandomInt(100, 500);
    const randomY = getRandomInt(100, 500);
    await tab.mouse.move(randomX, randomY, { steps: 10 });
    await new Promise(resolve => setTimeout(resolve, getRandomInt(500, 1500))); // Random pause between 0.5 and 1.5 sec
}

// Add random delays between actions to simulate human-like behavior
async function randomDelay() {
    const delay = getRandomInt(1000, 3000); // Random delay between 1 and 3 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
}

// Generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Rest of the functions such as graduation(), training(), workSample(), application() can remain unchanged

// Continue with the logic for applying to internships
async function applyToInternships(data) {
    // await tab.goto("https://internshala.com/the-grand-summer-internship-fair");
    await tab.goto("https://internshala.com/internships/matching-preferences/");
    

    await randomDelay();
    // let details = await tab.$$("div#internship_list_container_1");
    let details = await tab.$$("a.job-title-href");
    let detailUrl = [];
    for (let i = 0; i < 2; i++) {
        let url = await tab.evaluate(function (ele) {
            return ele.getAttribute("href");
        }, details[i]);
        detailUrl.push(url);
    }

    for (let i of detailUrl) {
        await apply(i, data);
        await randomDelay();
    }
}

async function apply(url, data) {
    await tab.goto("https://internshala.com" + url);
    await randomDelay();
    await tab.click(".btn.btn-large");
    await randomDelay();
    // await tab.click("#application_button");
    await tab.click(".btn.btn-large");
    await randomDelay();

    
    let ans = await tab.$$("textarea.textarea.form-control");
    for (let i = 0; i < ans.length; i++) {
        if (i == 0) {
            await ans[i].type(data["hiringReason"]);
        } else if (i == 1) {
            await ans[i].type(data["availability"]);
        } else {
            await ans[i].type(data["rating"]);
        }
        await randomDelay();
    }

    await randomDelay();
    await tab.click(".submit_button_container");
}

main();
