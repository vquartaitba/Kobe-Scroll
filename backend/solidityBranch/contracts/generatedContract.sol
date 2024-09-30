// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SoccerGame {
    struct Team {
        string name;
        address owner;
        uint8 playerCount;
    }

    struct Game {
        uint256 id;
        uint256 time;
        string teamA;
        string teamB;
        uint8 scoreA;
        uint8 scoreB;
        string winner;
    }

    uint256 public gameCounter;
    mapping(string => Team) public teams;
    mapping(uint256 => Game) public games;
    mapping(string => bool) teamRegistered;

    event TeamRegistered(string name, address owner);
    event GameStarted(uint256 gameId, string teamA, string teamB);
    event ScoreUpdated(uint256 gameId, uint8 scoreA, uint8 scoreB, string winner);
    event GameResult(uint256 gameId, string winner);

    modifier onlyTeamsOwner(string memory _teamA, string memory _teamB) {
        require(teams[_teamA].owner == msg.sender || teams[_teamB].owner == msg.sender, "Only team owner can perform this action");
        _;
    }

    function registerTeam(string memory _name, uint8 _playerCount) public {
        require(bytes(_name).length > 0, "Invalid team name");
        require(!teamRegistered[_name], "Team already registered");
        teams[_name] = Team(_name, msg.sender, _playerCount);
        teamRegistered[_name] = true;
        emit TeamRegistered(_name, msg.sender);
    }

    function startGame(string memory _teamA, string memory _teamB) public onlyTeamsOwner(_teamA, _teamB) {
        require(teamRegistered[_teamA], "Team A is not registered");
        require(teamRegistered[_teamB], "Team B is not registered");
        require(bytes(_teamA).length > 0, "Invalid team A name");
        require(bytes(_teamB).length > 0, "Invalid team B name");

        gameCounter++;
        uint256 newGameId = gameCounter;
        Game memory newGame = Game(
            newGameId,
            block.timestamp,
            _teamA,
            _teamB,
            0,
            0,
            ""
        );

        games[newGameId] = newGame;
        emit GameStarted(newGameId, _teamA, _teamB);
        _generateScore(newGameId);
    }

    function _generateScore(uint256 _gameId) private {
        require(games[_gameId].id == _gameId, "Game does not exist");
        uint8 scoreA = uint8(block.timestamp % 5);
        uint8 scoreB = uint8((block.timestamp * block.number) % 5);
        games[_gameId].scoreA = scoreA;
        games[_gameId].scoreB = scoreB;
        string memory winner;

        if (scoreA > scoreB) {
            winner = games[_gameId].teamA;
        } else if (scoreB > scoreA) {
            winner = games[_gameId].teamB;
        } else {
            winner = "Draw";
        }

        games[_gameId].winner = winner;
        emit ScoreUpdated(_gameId, scoreA, scoreB, winner);
        emit GameResult(_gameId, winner);
    }

    function viewGameResult(uint256 _gameId) public view returns (string memory teamA, string memory teamB, uint8 scoreA, uint8 scoreB, string memory winner) {
        Game memory game = games[_gameId];
        return (game.teamA, game.teamB, game.scoreA, game.scoreB, game.winner);
    }
}