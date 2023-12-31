// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract LibraryBook { //this will be used for student aide but for now i will just copy the crowdfunding campaign solidity
    struct Book {
        string title;
        string description;
        uint256 submission;
        string image;
        address[] borrowers;
    }

    mapping(uint256 => Book) public books;

    uint256 public numberofBooks = 0;

    function createBook(string memory _title, string memory _description, string memory _image) public returns (uint256) {
        Book storage book = books[numberofBooks];

        book.submission = block.timestamp + 7 days;
        
        book.title = _title;
        book.description = _description;
        book.image = _image;

        numberofBooks++;

        return numberofBooks - 1; //index of newest aide
    }

    function borrow(uint256 _id) public payable {

        Book storage book = books[_id];

        book.borrowers.push(msg.sender);
    }

    function getBorrowers(uint256 _id) view public returns (address[] memory) {
        return (books[_id].borrowers);
    }

    function getBooks() public view returns (Book[] memory) {
        Book[] memory allBooks = new Book[](numberofBooks);

        for(uint i = 0; i < numberofBooks; i++){
            Book storage item = books[i];

            allBooks[i] = item;
        }

        return allBooks;
    }
}