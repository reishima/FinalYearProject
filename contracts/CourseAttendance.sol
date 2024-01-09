// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract CourseAttendance { 
    struct Course {
        string lecturer;
        string courseName;
        string description;
        string department;
        string image;
        uint256 startTime;
        uint256 endTime;
        address[] attendees;
    }

    mapping(uint256 => Course) public courses;
    mapping(uint256 => Course) public closedCourses;

    uint256 public numberofCourses = 0;
    uint256 public numberofclosedCourses = 0;

    Course[] public tempCourses;

    function createCourse(string memory _lecturer, string memory _courseName, string memory _description, string memory _department, string memory _image, uint256 _startTime, uint256 _endTime) public returns (uint256) {
        Course storage course = courses[numberofCourses];

        course.lecturer = _lecturer;
        course.courseName = _courseName;
        course.description = _description;
        course.department = _department;
        course.image = _image;
        course.startTime = _startTime;
        course.endTime = _endTime;

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

    function attendCourse(uint256 _id) public payable {
        Course storage course = courses[_id];

        require(!isAttendeeAlreadyInList(_id, msg.sender), "You have already attended this class.");

        course.attendees.push(msg.sender);

        if (!isClassTime(_id)) {
            tempCourses.push(course);

            removeCourseAtIndex(_id);

            closedCourses[numberofclosedCourses] = tempCourses[0];
            numberofclosedCourses++;

            delete tempCourses;
        }
    }

    function isAttendeeAlreadyInList(uint256 _id, address _attendee) internal view returns (bool) {
        Course storage course = courses[_id];
        for (uint256 i = 0; i < course.attendees.length; i++) {
            if (course.attendees[i] == _attendee) {
                return true; 
            }
        }
        return false; 
    }

    function removeCourseAtIndex(uint256 index) internal {
        require(index < numberofCourses, "Invalid index");

        courses[index] = courses[numberofCourses - 1];

        delete courses[numberofCourses - 1];

        numberofCourses--;
    }

    function isClassTime(uint256 _id) internal view returns (bool){
        if(block.timestamp >= courses[_id].startTime && block.timestamp <= courses[_id].endTime){
            return true;
        }
        return false;
    }

    function getClassTime(uint256 _id) view public returns (bool){
        if(block.timestamp >= courses[_id].startTime && block.timestamp <= courses[_id].endTime){
            return true;
        }
        return false;
    }

    function getBlockTime() view public returns(uint256){
        return block.timestamp;
    }
/*
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
