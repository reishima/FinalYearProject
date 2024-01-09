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
        //uint256 startTime;
        //uint256 endTime;
        address[] attendees;
    }

    mapping(uint256 => Course) public courses;
    mapping(uint256 => Course) public closedCourses;

    uint256 public numberofCourses = 0;
    uint256 public numberofclosedCourses = 0;

    Course[] public tempCourses;

    function createCourse(string memory _lecturer, string memory _courseName, string memory _description, string memory _department, string memory _image) public returns (uint256) {
        Course storage course = courses[numberofCourses];

        course.lecturer = _lecturer;
        course.courseName = _courseName;
        course.description = _description;
        course.department = _department;
        course.image = _image;
        //course.startTime = _startTime;
        //course.endTime = _endTime;

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

    function getClosedCourses(string memory _department) public view returns (Course[] memory) {
        Course[] memory matchingCourses = new Course[](numberofclosedCourses);
        uint256 matchingCount = 0;

        for (uint256 i = 0; i < numberofclosedCourses; i++) {
            if (keccak256(abi.encodePacked(closedCourses[i].department)) == keccak256(abi.encodePacked(_department))) {
                matchingCourses[matchingCount] = closedCourses[i];
                matchingCount++;
            }
        }
        assembly {
            mstore(matchingCourses, matchingCount)
        }

        return matchingCourses;
    }

    function getLecturer(uint256 _id) public view returns(string memory){
        return (courses[_id].lecturer);
    }

    function attendCourse(uint256 _id) public payable {
        Course storage course = courses[_id];

        require(!isAttendeeAlreadyInList(_id, msg.sender), "You have already attended this class.");
        /*
        if(block.timestamp > courses[_id].endTime){
            tempCourses.push(course);
            removeCourseAtIndex(_id);
            closedCourses[numberofclosedCourses] = tempCourses[0];
            numberofclosedCourses++;
            delete tempCourses;
        }*/

        course.attendees.push(msg.sender);
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
/*
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
    */
    function getAttendees(uint256 _id) view public returns (address[] memory) {
        return (courses[_id].attendees);
    }

    function getAttendeesForClosed(uint256 _id) view public returns (address[] memory) {
        return (closedCourses[_id].attendees);
    }

    function getNumberOfAttendees(uint256 _id) public view returns (uint256) {
        return courses[_id].attendees.length;
    }

    function getNumberOfAttendeesforClosed(uint256 _id) public view returns (uint256) {
        return closedCourses[_id].attendees.length;
    }

    function closeAttendance(uint256 _id) public {
        Course storage course = courses[_id];

        tempCourses.push(course);

        removeCourseAtIndex(_id);

        closedCourses[numberofclosedCourses] = tempCourses[0];
        numberofclosedCourses++;

        delete tempCourses;
    }
}
