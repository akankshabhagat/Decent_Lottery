// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    address payable winner;
    bool public isComplete;
    bool public claimed;

    constructor() {
        manager = msg.sender; // to identify caller
        isComplete = false;
        claimed = false;
    }

modifier restricted(){
     require(msg.sender == manager);
        _;
}
    /*
    modifier is code that can be reused to add or change behavior of smart contracts
    can validate inputs,checks before execution of function
    
     only manager can be used
    */
    modifier onlyManager() {
        require(msg.sender == manager);
        _; //placeholder for func body
    }

    // returns manager address
    function getManager() public view returns (address) {
        return manager;
    }
function status() public  view returns (bool){
    return isComplete;
}
    // returns the winner
    function getwinner() public view returns (address) {
        return winner;
    }

    // click of button gonna get msg.value and add to contract balance
    function enter() public payable {
        require(msg.value >= 0.001 ether); // not run for val less than 0.01
        require(!isComplete);
        players.push(payable(msg.sender));
    }

    // function picks a winner
    function pickwinner() public onlyManager {
        require(players.length > 0);
        require(isComplete);
        winner = players[randomNumber() % players.length]; // generate randome number withing limit of array eg 10 players
        isComplete = true;
    }

    function randomNumber() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.prevrandao,
                        block.timestamp,
                        players.length
                    )
                )
            );
    }

    function claimPrize() public {
        require(msg.sender == winner);
        require(isComplete);
        winner.transfer(address(this).balance);
        claimed = true;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}
