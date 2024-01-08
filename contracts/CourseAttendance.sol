// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract CourseAttendance { 
    struct Course {
        string lecturer;
        string courseName;
        string description;
        string department;
        uint256 startTime;
        uint256 endTime;
        uint256 date;
        string image;
        address[] attendees;
    }

    mapping(uint256 => Course) public courses;
    mapping(uint256 => Course) public fullCourses;

    uint256 public numberofCourses = 0;
    uint256 public numberoffullCourses = 0;

    Course[] public tempCourses;

    function createCourse(string memory _lecturer, string memory _courseName, string memory _description, string memory _department, uint256 _startTime, uint256 _endTime, uint256 _date, string memory _image) public returns (uint256) {
        Course storage course = courses[numberofCourses];

        course.lecturer = _lecturer;
        course.courseName = _courseName;
        course.description = _description;
        course.department = _department;
        course.startTime = _startTime;
        course.endTime = _endTime;
        course.date = _date;
        course.image = _image;

        numberofCourses++;

        return numberofCourses - 1; 
    }

    function getCourses(string memory _department) public view returns (Course[] memory) {
        Course[] memory matchingCourses = new Course[](numberofCourses);
        uint256 matchingCount = 0;

        for (uint256 i = 0; i < numberofCourses; i++) {
            if (keccak256(abi.encodePacked(courses[i].department)) == keccak256(abi.encodePacked(_department))) {
                matchingCourses[matchingCount] = courses[i];
                matchingCount++;
            }
        }
        assembly {
            mstore(matchingCourses, matchingCount)
        }

        return matchingCourses;
    }
/*
    function requestCourse(uint256 _id) public payable {
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
    }*/
}
