/// <reference types="cypress" />
beforeEach(() => {
    // Preserving local storage
    cy.restoreLocalStorage();
    cy.viewport(1440, 900);
    cy.fixture('config').then((config) => { 
        var url = config.url  
        cy.visit(url) 
    })
});

describe('Homepage', () => {
    it('Verify that the page has a logo', () => {
        cy.get("#logo").should('contain', 'Hobsons');
    })

    it('Verify that homepage contains See resources button', () =>{
        cy.xpath("//a[contains(text(),'SEE RESOURCES')]").should('contain', 'SEE RESOURCES')
    })

 });

describe('Events', () => {

    it('Verify the alignement of the text', () => {
        cy.get('.home-more').click();
        cy.scrollTo('top');
        cy.get('#section-learn-more > h2').should('contain', 'How can we help your students?');
    })

    it('Verify that the “Resources” menus contain a list of child links including “Events"', () => {
        cy.get('.menu').click();
        cy.xpath("//a[@class='toggle'][contains(text(),'Resources')]").click();
        cy.xpath("//ul[@class='expand']//li[1]").should('contain','All')
          .xpath("//ul[@class='expand']//li[2]").should('contain', 'Webinars')
          .xpath("//ul[@class='expand']//li[3]").should('contain', 'Events')
          .xpath("//ul[@class='expand']//li[4]").should('contain', 'Case Studies')
          .xpath("//ul[@class='expand']//li[5]").should('contain', 'White Papers')
          .xpath("//ul[@class='expand']//li[6]").should('contain', 'Blog')
          .xpath("//ul[@class='expand']//li[7]").should('contain', 'Media')
          .xpath("//ul[@class='expand']//li[8]").should('contain', 'Podcast')
    })

    it("Verify all of the future events which have specified a day, month and year", () => {
        let futureEventCount = 0;
        cy.get(".menu").click();
        cy.xpath("//a[@class='toggle'][contains(text(),'Resources')]").click();
        cy.wait(500);
        cy.xpath("//ul[@class='expand']//li[3]").click();
        const todayDay = Cypress.moment().format("DD");
        const todayMonthShort = Cypress.moment().format("MMM");
        const todayYear = Cypress.moment().format("YYYY");
        var mL = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        ];
        var mS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
        ];
        cy.get(".txt").find("small").each($small => {
        let text = $small.text();
        let dateGreaterCount = 0;
        let dateStr, dateSplit;
        if (text.includes("|")) {
        dateStr = text.substr(0, text.indexOf("|"));
        } 
        else if (text.includes("in ")) {
        dateStr = text.substr(0, text.indexOf("in"));
        } 
        else {
        dateStr = text;
        }
        if (dateStr != undefined) {
        dateSplit = dateStr.split(" ");
        for (let j = 0; j < dateSplit.length; j++) {
        if (dateSplit[j].includes("-")) {
        dateSplit.concat(dateSplit[j].split("-"));
        }
        }
        for (let j = 0; j < dateSplit.length; j++) {
        dateSplit[j] = dateSplit[j].trim();
        dateSplit[j] = dateSplit[j].replace(".", " ");
        dateSplit[j] = dateSplit[j].replace(",", " ");
        dateSplit[j] = dateSplit[j].replace("-", " ");
        dateSplit[j] = dateSplit[j].trim();
        }
        let tempArr = [];
        for (let l = 0; l < dateSplit.length; l++) {
        if (dateSplit[l] !== "" && !dateSplit[l].includes(" ")) {
        tempArr.push(dateSplit[l]);
        }
        }
        cy.log(tempArr.toString());
        
        if (tempArr.length === 4) {
        if (tempArr[3] >= todayYear) {
        dateGreaterCount++;
        }
        if (tempArr[2] > todayDay || tempArr[1] > todayDay) {
        dateGreaterCount++;
        }
        } else if (tempArr.length == 2) {
        if (tempArr[1] >= todayYear) {
        dateGreaterCount++;
        }
        } else {
        }
        
        let shortIndex = mS.indexOf(tempArr[0]);
        let longIndex = mL.indexOf(tempArr[0]);
        let todayMonthIndex = mS.indexOf(todayMonthShort);
        if (todayMonthIndex < longIndex || todayMonthIndex < shortIndex) {
        dateGreaterCount++;
        }
        if (
        dateGreaterCount === 3 ||
        (dateGreaterCount === 2 && tempArr.length === 2)
        ) {
        futureEventCount++;
        }
        }
        })
        .then(() => {
        expect(futureEventCount).to.be.greaterThan(0);
        });
        });
});




