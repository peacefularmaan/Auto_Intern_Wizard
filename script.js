const puppeteer = require("puppeteer");
// import {setTimeout} from "node:timers/promises";
let {id,pass} = require("./secret");
let tab;
let dataFile = require("./data");

async function main(){

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
    const client = await tab.createCDPSession();
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
 
     {
        //  await tab.click(".nav-link.dropdown-toggle.profile_container .is_icon_header.ic-24-filled-down-arrow");
        //  let profile_options = await tab.$$(".profile_options a");
        //  let app_urls = [];
        //  for(let i=0; i<11; i++){
        //     let url = await tab.evaluate(function(ele){
        //             return ele.getAttribute("href");                                 
        //     }, profile_options[i]); 
        //     app_urls.push(url);    
        // }                                              
        // await new Promise(function(resolve,reject){                             
        //     return setTimeout(resolve, 2000);
        // });
        // tab.goto("https://internshala.com"+app_urls[1]);

        // await tab.waitForSelector("#graduation-tab .ic-16-plus", {visible : true});
        // await tab.click("#graduation-tab .ic-16-plus");
        // await graduation(dataFile[0]);

        // await new Promise(function(resolve,reject){                              
        //     return setTimeout(resolve, 1000);
        // });

        // await tab.waitForSelector(".next-button", {visible : true});
        // await tab.click(".next-button");

        // await training(dataFile[0]);

        // await new Promise(function(resolve,reject){                              
        //     return setTimeout(resolve, 1000);
        // });

        // await tab.waitForSelector(".next-button", {visible : true});
        // await tab.click(".next-button");

        // await tab.waitForSelector(".btn.btn-secondary.skip.skip-button", {visible : true});
        // await tab.click(".btn.btn-secondary.skip.skip-button");

        // await workSample(dataFile[0]);

        // await new Promise(function(resolve,reject){                              
        //     return setTimeout(resolve, 1000);
        // });

        // await tab.waitForSelector("#save_work_samples", {visible : true});
        // await tab.click("#save_work_samples");
       
        // // await tab.waitForSelector(".resume_download_mobile", {visible : true});
        // // await tab.click(".resume_download_mobile");                                // if you want to download resume.
        
        // await new Promise(function(resolve,reject){                              
        //     return setTimeout(resolve, 1000);
        // });
     }

        await buildResume(tab)

        // await application(dataFile[0]);
}

// async function selectYearByText(tab, dropdownSelector, yearText) {
//     // Step 1: Click to open the dropdown
//     await tab.click(dropdownSelector);
    
//     // Step 2: Wait for the dropdown options to be visible
//     await tab.waitForSelector(".active-result", { visible: true });
    
//     // Step 3: Get all the options in the dropdown
//     const options = await tab.$$('.active-result');
    
//     let yearIndex = null;
    
//     // Step 4: Loop through the options to find the one matching the desired year
//     for (const option of options) {
//         const optionText = await tab.evaluate(el => el.textContent, option);
        
//         // If the option's text matches the desired year, extract its index
//         if (optionText.trim() === yearText) {
//             yearIndex = await tab.evaluate(el => el.getAttribute('data-option-array-index'), option);
//             break; // Exit the loop once the correct year is found
//         }
//     }
    
//     // Step 5: If yearIndex is found, use it to select the year
//     if (yearIndex !== null) {
//         await tab.waitForSelector(`.active-result[data-option-array-index='${yearIndex}']`, { visible: true });
//         await tab.click(`.active-result[data-option-array-index='${yearIndex}']`);
//     } else {
//         console.log(`Year ${yearText} not found`);
//     }
// }

async function fillTrainingSection(tab, trainingData) {

    // Delay helper function
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    await tab.waitForSelector('a.other_experiences_edit.icon', { visible: true });
    await tab.click('a.other_experiences_edit.icon');

    // 1. Fill the Training Program field
    if (trainingData.program) {
        // await tab.waitForSelector('#other_experiences_course', { visible: true });
        // await tab.evaluate(() => document.querySelector('#other_experiences_course').value = ""); // Clear the field
        // await tab.type('#other_experiences_course', trainingData.program, { delay: 100 });
        // await delay(3000);
        await tab.evaluate(() => document.querySelector('#other_experiences_course').value = ""); // Clear the field
        await delay(500);
        await slowType(tab, '#other_experiences_course', trainingData.program);
    }


    // 2. Fill the Organization field
    if (trainingData.organization) {
        // await tab.waitForSelector('#other_experiences_organization', { visible: true });
        // await tab.evaluate(() => document.querySelector('#other_experiences_organization').value = ""); // Clear the field
        // await tab.type('#other_experiences_organization', trainingData.organization, { delay: 100 });
        // await delay(3000);
        await tab.evaluate(() => document.querySelector('#other_experiences_organization').value = ""); // Clear the field
        await delay(500);
        await slowType(tab, '#other_experiences_organization', trainingData.organization);
    }

    // 3. Check the Online Course checkbox, if applicable
    if (trainingData.isOnline) {
        let onlineCheckbox = await tab.$("input[type='checkbox'][id='other_experiences_location_type']");
        const isChecked = await tab.evaluate(el => el.checked, onlineCheckbox);
        if (!isChecked) {
            await onlineCheckbox.click();
        }
    }

    // 4. Fill the Location field
    // if (trainingData.location) {
        //     await tab.waitForSelector('#location', { visible: true });
        //     await tab.type('#location', trainingData.location);
        // }
        
    await tab.$eval('#other_experiences_start_date', el => el.value = '2023-04-02');
        
    await tab.$eval('#other_experiences_end_date', el => el.value = '2023-04-08');    
        
    await randomDelay();

    await tab.click('button#training-submit');
}

// Function to introduce a random delay
async function randomDelay() {
    let delay = Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function editEducationSection(tab, educationData) {
    try {
        // Wait for the 'Edit' button to be available and click it
        await tab.waitForSelector("#edit-education", { visible: true });
        await tab.click("#edit-education");

        // Wait for the modal/form to appear
        await tab.waitForSelector("#college", { visible: true });

        // Clear the previous values and fill in the new ones for College
        await tab.evaluate(() => {
            const collegeInput = document.querySelector("#college");
            if (collegeInput) {
                collegeInput.value = ""; // Clear the existing value
            } else {
                throw new Error("College input field not found.");
            }
        });
        await tab.type("#college", educationData["College"]);

        // await selectYearByText(tab, "#start_year_chosen", "2020", {delay:100});
        // await selectYearByText(tab, "#end_year_chosen", "2025", {delay:100}); 

        await tab.waitForSelector("#start_year_chosen", {visible : true});
        await tab.click("#start_year_chosen");
        await tab.waitForSelector(".active-result[data-option-array-index='4']", {visible : true});
        await tab.click(".active-result[data-option-array-index='4']", {delay:100});

        await tab.waitForSelector("#end_year_chosen", {visible : true});
        await tab.click('#end_year_chosen');
        await tab.waitForSelector("#end_year_chosen .active-result[data-option-array-index = '5']", {visible : true});
        await tab.click("#end_year_chosen .active-result[data-option-array-index = '5']",{delay:100});
    
        // Clear and fill the Degree
        await tab.evaluate(() => {
            const degreeInput = document.querySelector("#degree");
            if (degreeInput) {
                degreeInput.value = ""; // Clear the existing value
            } else {
                throw new Error("Degree input field not found.");
            }
        });
        await tab.type("#degree", educationData["Degree"], {delay:100});

        // Clear and fill the Stream
        await tab.evaluate(() => {
            const streamInput = document.querySelector("#stream");
            if (streamInput) {
                streamInput.value = ""; // Clear the existing value
            } else {
                throw new Error("Stream input field not found.");
            }
        });
        await tab.type("#stream", educationData["Stream"], {delay:100});

        // Clear and fill the Percentage/CGPA
        await tab.evaluate(() => {
            const percentageInput = document.querySelector("#performance-college");
            if (percentageInput) {
                percentageInput.value = ""; // Clear the existing value
            } else {
                throw new Error("Percentage/CGPA input field not found.");
            }
        });
        await tab.type("#performance-college", educationData["Percentage"], {delay:100});

        // Submit the form after all fields are filled
        await tab.click("#college-submit");

        console.log("Education details updated successfully!");
    } catch (error) {
        console.error("Error editing the education section: ", error.message);
    }
}


//Function to build resume

async function buildResume(tab) {
    await tab.goto("https://internshala.com/student/resume");

    const trainingData = {
        program: 'Front-End Development Bootcamp',
        organization: 'XYZ Training Institute',
        isOnline: true, // If it’s an online course, otherwise false
        location: 'Remote',
        startDate: '2022-01-15', // In 'YYYY-MM-DD' format
        endDate: '2022-03-15' // In 'YYYY-MM-DD' format
    };
    

    await fillTrainingSection(tab, trainingData)

    // await editEducationSection(tab, dataFile[0]);
}

    async function application(data) {
        // await tab.goto("https://internshala.com/the-grand-summer-internship-fair");
        // await tab.goto("https://internshala.com/internships/matching-preferences/");

        // Navigate to the internship page
        await tab.goto('https://internshala.com/internships', { waitUntil: 'networkidle2' });

        // Wait for the input field to be visible
        await tab.waitForSelector('#select_category_chosen'); // Replace with your actual input selector
        await tab.click('#select_category_chosen'); // Replace with your actual input selector

        // Type "Front End Development"
        await tab.waitForSelector('ul.chosen-choices');
        await tab.type('ul.chosen-choices', 'Front End Development', {delay:100});

        // Press Enter to select the typed option
        await tab.keyboard.press('Enter');

        await randomDelay();
    
        await tab.waitForSelector("a.job-title-href", { visible: true });
    
        // Collect URLs instead of clicking links (which can open a new tab)
        let details = await tab.$$("a.job-title-href");
        let detailUrl = [];
        for (let i = 0; i < 3; i++) {
            let url = await tab.evaluate(function (ele) {
                return ele.getAttribute("href");
            }, details[i]);
            detailUrl.push(url);
        }
    
        for (let i of detailUrl) {
            // Navigate directly to the URL in the current tab
            await apply(i, data);
            await new Promise(resolve => setTimeout(resolve, getRandomInt(1000, 1200)));
            // await new Promise(function (resolve, reject) {return setTimeout(resolve, 1000)});
        }
    }


    async function apply(url, data) {
        await tab.goto("https://internshala.com" + url);
        await randomDelay();
    
        // Click on the "Apply Now" button
        const applyButton = await tab.$(".btn.btn-large");
        if (applyButton) {
            await applyButton.click();
            await randomDelay();
        }

        // Handle cover letter (common across all applications)
        const coverLetterField = await tab.$("div.ql-editor.ql-blank"); // Assuming the cover letter field has this `name` attribute
        if (coverLetterField) {
            await coverLetterField.type(data["hiringReason"], {delay:10});
            await randomDelay();
        }

        // Handle checkboxes
        let checkboxes = await tab.$$("input[type='checkbox']");
        if (checkboxes.length > 0) {
            for (let checkbox of checkboxes) {
                const isChecked = await tab.evaluate(el => el.checked, checkbox);
                if (!isChecked) {
                    await checkbox.click();
                    await randomDelay();
                }
            }
        }

        // Handle textareas with a specific placeholder (assignment questions)
        let textareasWithPlaceholder = await tab.$$(`textarea[placeholder='Enter text ...']`);
        if (textareasWithPlaceholder.length > 0) {
            for (let i = 0; i < textareasWithPlaceholder.length; i++) {
                if (i == 0 && data["availability"]) {
                   await textareasWithPlaceholder[i].type(data["availability"]);
                } else if (i == 1) {
                   await textareasWithPlaceholder[i].type(data["availability"]);
                } else if (i >= 2) {
                  await textareasWithPlaceholder[i].type(data["availability"]);
                }
                await randomDelay();
            }
        }
    
        // Final submit button
        // const submitButton = await tab.$(".submit_button_container");
        // if (submitButton) {
        //     await submitButton.click();
        //     await randomDelay();
        // }
    }

    //............................................................................................................

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
    

main();

