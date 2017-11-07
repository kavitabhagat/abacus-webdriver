module.exports = function (locator) {
    const myElement = {};
    myElement.locator = locator;

    myElement.click = function () {
        return driver.wait(until.elementLocated(myElement.locator), 5000, "Element not in DOM")
          .then(function () {
              const elementToClick = driver.findElement(myElement.locator);
              driver.executeScript("arguments[0].scrollIntoView({block: 'center'})", elementToClick);
              return elementToClick.click();
          })
          .catch(function (err) {
              return err;
          });
    };

    myElement.sendKeys = function (keys) {
        return driver.wait(until.elementLocated(myElement.locator), 5000, "Element not in DOM")
          .then(function () {
              const elementToClick = driver.findElement(myElement.locator);
              driver.executeScript("arguments[0].scrollIntoView({block: 'center'})", elementToClick);
              return elementToClick.sendKeys(keys);
          })
          .catch(function (err) {
              return err;
          });
    };

    myElement.clear = function () {
        return driver.wait(until.elementLocated(myElement.locator), 5000, "Element not in DOM")
          .then(function () {
              const elementToClick = driver.findElement(myElement.locator);
              driver.executeScript("arguments[0].scrollIntoView({block: 'center'})", elementToClick);
              return elementToClick.clear();
          })
          .catch(function (err) {
              return err;
          });
    };

    // // // // // These functions expose the user to raw webdriver, which can lead to complete execution failure
    myElement.findElements = function (byLocator) {
        return driver.wait(until.elementLocated(myElement.locator), 5000, "Element not in DOM")
          .then(function () {
              const parentElement = driver.findElement(myElement.locator);
              return parentElement.findElements(byLocator);
          })
          .catch(function (err) {
              return err;
          });
    };

    myElement.findElement = function (byLocator) {
        driver.wait(until.elementLocated(myElement.locator), 5000, "Element not in DOM")
          .catch(function (err) {
              return err;
          });
        const parentElement = driver.findElement(myElement.locator);
        return parentElement.findElement(byLocator);
    };
    // // // // //

    myElement.getText = function () {
        return driver.wait(until.elementLocated(myElement.locator), 5000, "Element not in DOM").then(function () {
            const elementToRead = driver.findElement(myElement.locator);
            return driver.wait(until.elementIsVisible(elementToRead)).then(function () {
                return elementToRead.getText();
            });
        });
    };

    // waits for info extracted from an element to satisfy the inputted matching text
    // params:
    // extractInfo = function that takes in an element, and returns a promise to the necessary information
    // matchFunc = function that takes two text elements and returns true or false based on the comparison
    // expectedText = the text that the extracted info is compared to
    const waitFor = function (extractInfo, matchFunc, expectedText) {
        return new Promise((resolve,reject) => {
            const waitPromise = new Promise((resolve, reject) => {
                var start = new Date();
                let endCheck = false;
                const checkTextFunction = function(toPrint) {
                    var end = new Date() - start;
                    if (end/1000 > 3) endCheck = true;
                    if (endCheck) return;

                    const testElement = driver.findElement(myElement.locator);
                    testElement.catch(checkTextFunction);

                    extractInfo(testElement)
                      .then((text) => {
                          if (matchFunc(text, expectedText)) {
                              endCheck = true;
                              resolve(true);
                          }
                          else checkTextFunction("Text was"+text);
                      })
                      .catch(checkTextFunction);

                }

                checkTextFunction("START");
            });

            driver.wait(waitPromise, 5000, `Text never matched "${expectedText}"`)
              .catch((err) => {
                  return err;
              })
              .then((result) => {
                  if(result === true) resolve();
                  else resolve(result);
              });
        });

    }

    myElement.waitUntil =
      {
          text: {
              is: (text) => {
                  return waitFor((testElement) => {
                      return testElement.getText();
                  },(actual, expected) => {
                      return actual === expected;
                  }, text);
              },
              matches: (text) => {
                  return waitFor((testElement) => {
                      return testElement.getText();
                  },(actual, expected) => {
                      return expected.test(actual);
                  }, text);
              },
              contains: (text) => {
                  return waitFor((testElement) => {
                      return testElement.getText();
                  },(actual, expected) => {
                      return actual.indexOf(expected) > -1;
                  }, text);
              }
          },
          value: {
              is: (text) => {
                  return waitFor((testElement) => {
                      return testElement.getAttribute('value');
                  },(actual, expected) => {
                      return actual === expected;
                  }, text);
              },
              matches: (text) => {
                  return waitFor((testElement) => {
                      return testElement.getAttribute('value');
                  },(actual, expected) => {
                      return expected.test(actual);
                  }, text);
              },
              contains: (text) => {
                  return waitFor((testElement) => {
                      return testElement.getAttribute('value');
                  },(actual, expected) => {
                      return actual.indexOf(expected) > -1;
                  }, text);
              }
          }
      }


    return myElement;
};
