// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract StudentAide { 
    struct Aide {
        address owner;
        string title;
        string description;
        uint256 maxRequesters;
        uint256 deadline;
        //uint256 amountCollected;
        string image;
        address[] requesters;
        //uint256[] donations;
    }

    mapping(uint256 => Aide) public aides;
    mapping(uint256 => Aide) public fullAides;

    uint256 public numberofAides = 0;
    uint256 public numberoffullAides = 0;

    function createAide(string memory _title, string memory _description, uint256 _maxRequesters, uint256 _deadline, string memory _image) public returns (uint256) {
        Aide storage aide = aides[numberofAides];

        aide.title = _title;
        aide.description = _description;
        aide.maxRequesters = _maxRequesters;
        aide.deadline = _deadline;
        aide.image = _image;

        numberofAides++;

        return numberofAides - 1; //index of newest aide
    }

    function requestAide(uint256 _id) public payable {
    Aide storage aide = aides[_id];

    aide.requesters.push(msg.sender);

    require(aide.requesters.length <= aide.maxRequesters, "Aide has reached the maximum number of requesters.");

    if (aide.requesters.length == aide.maxRequesters) {
        // Swap with the last element in the aides array
        uint256 lastIndex = numberofAides - 1;
        aides[_id] = aides[lastIndex];

        // Move the Aide to the fullAides array
        fullAides[numberoffullAides] = aide;
        numberoffullAides++;

        // Remove the Aide from the aides array
        delete aides[lastIndex];
        numberofAides--;
    }
}


    function getRequesters(uint256 _id) view public returns (address[] memory) {
        return (aides[_id].requesters);
    }

    function getRequestersforFull(uint256 _id) view public returns (address[] memory) {
        return (fullAides[_id].requesters);
    }

    function getAides() public view returns (Aide[] memory) {
        Aide[] memory availableAides = new Aide[](numberofAides);

        for(uint i = 0; i < numberofAides; i++){
            Aide storage item = aides[i];

            availableAides[i] = item;
        }

        return availableAides;
    }

    function getFullAides() public view returns (Aide[] memory) {
        Aide[] memory fullAidesArr = new Aide[](numberoffullAides);

        for(uint i = 0; i < numberoffullAides; i++){
            Aide storage item = fullAides[i];

            fullAidesArr[i] = item;
        }

        return fullAidesArr;
    }

    /*
    function getNumberOfRequesters(uint256 _id) public view returns (uint256) {
        return aides[_id].requesters.length;
    }

    function getNumberOfRequestersforFull(uint256 _id) public view returns (uint256) {
        return fullAides[_id].requesters.length;
    }
    */

}