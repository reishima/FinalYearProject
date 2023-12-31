// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract StudentAide { //this will be used for student aide but for now i will just copy the crowdfunding campaign solidity
    struct Aide {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Aide) public aides;

    uint256 public numberofAides = 0;

    function createAide(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Aide storage aide = aides[numberofAides];

        require(aide.deadline < block.timestamp, "The deadline should be a date in the future.");

        aide.owner = _owner;
        aide.title = _title;
        aide.description = _description;
        aide.target = _target;
        aide.deadline = _deadline;
        aide.amountCollected = 0;
        aide.image = _image;

        numberofAides++;

        return numberofAides - 1; //index of newest aide
    }

    function sendAide(uint256 _id) public payable {
        uint256 amount = msg.value;

        Aide storage aide = aides[_id];

        aide.donators.push(msg.sender);
        aide.donations.push(amount);

        (bool sent,) =  payable(aide.owner).call{value: amount}("");

        if(sent){
            aide.amountCollected = aide.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (aides[_id].donators, aides[_id].donations);
    }

    function getAides() public view returns (Aide[] memory) {
        Aide[] memory allAides = new Aide[](numberofAides);

        for(uint i = 0; i < numberofAides; i++){
            Aide storage item = aides[i];

            allAides[i] = item;
        }

        return allAides;
    }
}