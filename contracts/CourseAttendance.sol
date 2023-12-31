// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract CourseAttendance { //this will be used for student aide but for now i will just copy the crowdfunding campaign solidity
    struct Course {
        address owner; //lecturer?
        string courseName;
        string description;
        uint256 deadline; //last time to take attendance
        string image;
        address[] attendees;
        //we need a lecturer, owner is not enough
    }

    mapping(uint256 => Course) public courses;

    uint256 public numberofCourses = 0;

    function createCourse(address _owner, string memory _courseName, string memory _description, uint256 _deadline, string memory _image) public returns (uint256) {
        Course storage course = courses[numberofCourses];

        require(course.deadline < block.timestamp, "The deadline should be a date in the future.");

        course.owner = _owner;
        course.courseName = _courseName;
        course.description = _description;
        course.deadline = _deadline;
        course.image = _image;

        numberofCourses++;

        return numberofCourses - 1; //index of newest aide
    }

    function attendCourse(uint256 _id) public {
        Course storage course = courses[_id];

        require(block.timestamp <= course.deadline, "Attendance period has ended.");

        // Check if the attendee hasn't attended already
        for (uint i = 0; i < course.attendees.length; i++) {
            require(course.attendees[i] != msg.sender, "You have already attended this course.");
        }

        course.attendees.push(msg.sender);
    }

    function getAttendees(uint256 _id) view public returns (address[] memory) {
        return (courses[_id].attendees);
    }

    function getCourses() public view returns (Course[] memory) {
        Course[] memory allCourses = new Course[](numberofCourses);

        for(uint i = 0; i < numberofCourses; i++){
            Course storage item = courses[i];

            allCourses[i] = item;
        }

        return allCourses;
    }
}