const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const hello = await ethers.deployContract("Hello", ["AKSHANSH"]);

    const sayHello= await hello.sayHello();
    expect(await hello.justSayHello()).to.equal("Hello");
    expect(await hello.printHello()).to.equal("H");
  });
});