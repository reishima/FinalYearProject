// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract LibraryBook {
    struct Book {
        string title;
        string description;
        uint256 submission;
        string image;
        address[] borrowers;
    }

    mapping(uint256 => Book) public availableBooks;
    mapping(uint256 => Book) public unavailableBooks;

    uint256 public numberofAvailable = 0;
    uint256 public numberofUnavailable = 0;

    function createBook(string memory _title, string memory _description, string memory _image) public returns (uint256) {
        Book storage book = availableBooks[numberofAvailable];

        book.submission = block.timestamp + 7 days;
        
        book.title = _title;
        book.description = _description;
        book.image = _image;

        numberofAvailable++;

        return numberofAvailable - 1; 
    }

    function borrow(uint256 _id) public payable {

        Book storage book = availableBooks[_id];

        book.borrowers.push(msg.sender);

        unavailableBooks[numberofUnavailable] = book;
        delete availableBooks[_id];
        numberofAvailable--;
        numberofUnavailable++;
    }

    function bookReturned(uint256 _id) public {
        Book storage book = unavailableBooks[_id];

        availableBooks[numberofAvailable] = book;
        delete unavailableBooks[_id];
        numberofUnavailable--;
        numberofAvailable++;

    }

    function getBorrowers(uint256 _id) view public returns (address[] memory) {
        return (availableBooks[_id].borrowers);
    }

    function getBorrowersForUnavailable(uint256 _id) view public returns (address[] memory) {
        return (unavailableBooks[_id].borrowers);
    }

    function getBooks() public view returns (Book[] memory) {
        Book[] memory availableBooksArr = new Book[](numberofAvailable);

        for(uint i = 0; i < numberofAvailable; i++){
            Book storage item = availableBooks[i];

            availableBooksArr[i] = item;
        }

        return availableBooksArr;
    }

    function getUnavailable() public view returns (Book[] memory){
        Book[] memory unavailableBooksArr = new Book[](numberofUnavailable);

        for(uint i = 0; i< numberofUnavailable; i++){
            Book storage item = unavailableBooks[i];
            unavailableBooksArr[i] = item;
        }
        return unavailableBooksArr;
    }
}