// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract ReportContract {
    struct Report {
        uint id;
        string description;
        string location;
        string imageHash;
        address reporter;
        bool isResolved;
    }

    uint public reportCount = 0;
    mapping(uint => Report) public reports;
    address public admin;

    event ReportSubmitted(uint id, string description, string location, string imageHash, address reporter);
    event ReportResolved(uint id);

    constructor() {
        admin = msg.sender;
    }

    function submitReport(string memory _description, string memory _location, string memory _imageHash) public {
        reportCount++;
        reports[reportCount] = Report(reportCount, _description, _location, _imageHash, msg.sender, false);
        emit ReportSubmitted(reportCount, _description, _location, _imageHash, msg.sender);
    }

    function resolveReport(uint _id) public {
        require(msg.sender == admin, "Only admin can resolve reports");
        require(_id > 0 && _id <= reportCount, "Invalid report ID.");
        
        Report storage report = reports[_id];
        report.isResolved = true;
        emit ReportResolved(_id);
    }

    function getReport(uint _id) public view returns (uint, string memory, string memory, string memory, address, bool) {
        Report memory report = reports[_id];
        return (report.id, report.description, report.location, report.imageHash, report.reporter, report.isResolved);
    }

    function getReportCount() public view returns (uint) {
        return reportCount;
    }
}