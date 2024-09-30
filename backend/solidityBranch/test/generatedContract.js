const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("SoccerGame", function () {
  let SoccerGame;
  let soccerGame;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    SoccerGame = await ethers.getContractFactory("SoccerGame");
    soccerGame = await SoccerGame.deploy();
    await soccerGame.waitForDeployment();
  });

  describe("Team Registration", function () {
    it("Should register a new team", async function () {
      await soccerGame.registerTeam("TeamA", 11);
      const team = await soccerGame.teams("TeamA");
      
      expect(team.name).to.equal("TeamA");
      expect(team.owner).to.equal(owner.address);
      expect(team.playerCount).to.equal(11);
    });
    
    it("Should emit TeamRegistered event", async function () {
      await expect(soccerGame.registerTeam("TeamA", 11))
        .to.emit(soccerGame, "TeamRegistered")
        .withArgs("TeamA", owner.address);
    });

    it("Should revert if team is already registered", async function () {
      await soccerGame.registerTeam("TeamA", 11);
      await expect(soccerGame.registerTeam("TeamA", 11)).to.be.revertedWith("Team already registered");
    });
  });

  describe("Start Game", function () {
    beforeEach(async function () {
      await soccerGame.registerTeam("TeamA", 11);
      await soccerGame.registerTeam("TeamB", 11);
    });

    it("Should start a game and emit GameStarted event", async function () {
      await expect(soccerGame.startGame("TeamA", "TeamB"))
        .to.emit(soccerGame, "GameStarted")
        .withArgs(1, "TeamA", "TeamB");
        
      const game = await soccerGame.games(1);
      expect(game.teamA).to.equal("TeamA");
      expect(game.teamB).to.equal("TeamB");
    });

    it("Should revert if non-team owner tries to start a game", async function () {
      await expect(soccerGame.connect(addr1).startGame("TeamA", "TeamB")).to.be.revertedWith("Only team owner can perform this action");
    });
  });

  describe("Game Results", function () {
    beforeEach(async function () {
      await soccerGame.registerTeam("TeamA", 11);
      await soccerGame.registerTeam("TeamB", 11);
      await soccerGame.startGame("TeamA", "TeamB");
    });

    it("Should correctly generate and display game result", async function () {
      const game = await soccerGame.games(1);
      const result = await soccerGame.viewGameResult(1);
      
      expect(result.teamA).to.equal(game.teamA);
      expect(result.teamB).to.equal(game.teamB);
      expect(result.scoreA).to.equal(game.scoreA);
      expect(result.scoreB).to.equal(game.scoreB);
      expect(result.winner).to.equal(game.winner);
    });

    it("Should emit ScoreUpdated and GameResult events", async function () {
      const result = await soccerGame.games(1);
      await expect(soccerGame.startGame("TeamA", "TeamB"))
        .to.emit(soccerGame, "ScoreUpdated")
        .withArgs(1, result.scoreA, result.scoreB, result.winner)
        .to.emit(soccerGame, "GameResult")
        .withArgs(1, result.winner);
    });
  });
});