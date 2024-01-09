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
        string image;
        address[] requesters;
    }

    mapping(uint256 => Aide) public aides;
    mapping(uint256 => Aide) public fullAides;

    uint256 public numberofAides = 0;
    uint256 public numberoffullAides = 0;

    Aide[] public tempAides;

    function createAide(string memory _title, string memory _description, uint256 _maxRequesters, uint256 _deadline, string memory _image) public returns (uint256) {
        Aide storage aide = aides[numberofAides];

        aide.title = _title;
        aide.description = _description;
        aide.maxRequesters = _maxRequesters;
        aide.deadline = _deadline;
        aide.image = _image;
    
        numberofAides++;

        return numberofAides - 1; 
    }

    function requestAide(uint256 _id) public payable {
        Aide storage aide = aides[_id];

        require(!isRequesterAlreadyInList(_id, msg.sender), "You have already requested for this Aide.");
        require(aide.requesters.length < aide.maxRequesters, "Aide has reached the maximum number of requesters.");

        aide.requesters.push(msg.sender);

        if (aide.requesters.length == aide.maxRequesters) {
            tempAides.push(aide);

            removeAideAtIndex(_id);

            fullAides[numberoffullAides] = tempAides[0];
            numberoffullAides++;

            delete tempAides;
        }
    }

    function isRequesterAlreadyInList(uint256 _id, address _requester) internal view returns (bool) {
        Aide storage aide = aides[_id];
        for (uint256 i = 0; i < aide.requesters.length; i++) {
            if (aide.requesters[i] == _requester) {
                return true; 
            }
        }
        return false; 
    }

    function removeAideAtIndex(uint256 index) internal {
        require(index < numberofAides, "Invalid index");

        aides[index] = aides[numberofAides - 1];

        delete aides[numberofAides - 1];

        numberofAides--;
    }

    function getRequesters(uint256 _id) view public returns (address[] memory) {
        return (aides[_id].requesters);
    }

    function getRequestersforFull(uint256 _id) view public returns (address[] memory) {
        return (fullAides[_id].requesters);
    }

    function getAides() public view returns (Aide[] memory) {
        Aide[] memory availableAides = new Aide[](numberofAides);

        for (uint i = 0; i < numberofAides; i++) {
            Aide storage item = aides[i];
            availableAides[i] = item;
        }

        return availableAides;
    }

    function getFullAides() public view returns (Aide[] memory) {
        Aide[] memory fullAidesArr = new Aide[](numberoffullAides);

        for (uint i = 0; i < numberoffullAides; i++) {
            Aide storage item = fullAides[i];
            fullAidesArr[i] = item;
        }

        return fullAidesArr;
    }

    function getNumberOfRequesters(uint256 _id) public view returns (uint256) {
        return aides[_id].requesters.length;
    }

    function getNumberOfRequestersforFull(uint256 _id) public view returns (uint256) {
        return fullAides[_id].requesters.length;
    }

   function closeAide(uint256 _id) public {
        Aide storage aide = aides[_id];

        tempAides.push(aide);

        removeAideAtIndex(_id);

        fullAides[numberoffullAides] = tempAides[0];
        numberoffullAides++;

        delete tempAides;
    }
}
