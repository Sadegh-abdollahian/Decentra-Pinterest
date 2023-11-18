require("@nomicfoundation/hardhat-chai-matchers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("DecentraPinterest", async () => {
  let decentraPinterest, deployer, sendValue;
  beforeEach("Deploy the smart contracts", async () => {
    deployer = await ethers.getSigners();
    decentraPinterest = await ethers.deployContract("DecentraPinterest", {
      from: deployer.address,
    });
    sendValue = ethers.parseEther("1");
  });
  describe("deployments", async () => {
    it("Deploys successfully", async () => {
      const decentraPinterestAddress = await decentraPinterest.target;
      assert.notEqual(decentraPinterestAddress, 0x0);
      assert.notEqual(decentraPinterestAddress, "");
      assert.notEqual(decentraPinterestAddress, null);
      assert.notEqual(decentraPinterestAddress, undefined);
    }),
      it("Has a name", async () => {
        const name = await decentraPinterest.name();
        assert.equal(name, "Decentra-Pinterest");
      });
  });

  describe("uploadImage", async () => {
    const hash = "QmRRuisDkXkPEZcUdBiSYkirHzcrBQQdazr4GV6nJqPGeQ";
    const description = "First video";

    // can't write test for zero address

    it("Fails if description is empty", async () => {
      await expect(decentraPinterest.uploadImage(hash, "")).revertedWith(
        "incorrect description"
      );
    });

    it("Fails if hash is empty", async () => {
      await expect(decentraPinterest.uploadImage("", description)).revertedWith(
        "incorrect hash"
      );
    });

    it("should increase the imageCount number", async () => {
      await decentraPinterest.uploadImage(hash, description);
      assert.equal(await decentraPinterest.getImageCount(), 1);
    });

    it("Should set the image hash correctly", async () => {
      await decentraPinterest.uploadImage(hash, description);
      const response = await decentraPinterest.getImageFromId(1);
      assert.equal(response[3].toString().includes(hash), true);
    });

    it("Should emit ImageUploaded", async () => {
      await expect(
        await decentraPinterest.uploadImage(hash, description, {
          from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        })
      )
        .to.emit(decentraPinterest, "ImageUploaded")
        .withArgs(
          1,
          0,
          "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          hash,
          description
        );
    });
  });

  describe("donateImageOwner", async () => {
    it("Fails if id is invalid", async () => {
      await expect(decentraPinterest.donateImageOwner(5)).revertedWith("Invalid id");
    });

    it("Should increase the donate amount", async () => {
      await decentraPinterest.uploadImage("hash", "desctiption");
      await decentraPinterest.donateImageOwner(1, { value: sendValue });
      const response = await decentraPinterest.getImageFromId(1);
      assert.notEqual(response, 0);
    });

    it("should emit ImageDonated", async () => {
      await decentraPinterest.uploadImage("hash", "desctiption");
      await expect(decentraPinterest.donateImageOwner(1, { value: sendValue }))
        .to.emit(decentraPinterest, "ImageDonated")
        .withArgs(1, sendValue, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    });
  });

  describe("getImageFromId", async () => {
    it("Fails if image id is invalid", async () => {
      await expect(decentraPinterest.getImageFromId(5)).revertedWith("Invalid id");
    });

    it("should return the image correctly", async () => {
      const hash = "QmRRuisDkXkPEZcUdBiSYkirHzcrBQQdazr4GV6nJqPGeQ";
      await decentraPinterest.uploadImage(hash, "Hello world");
      const response = await decentraPinterest.getImageFromId(1);
      assert.equal(response[3], hash);
      assert.equal(response[4], "Hello world");
      assert.equal(response[0], 1n);
    });
  });
});
