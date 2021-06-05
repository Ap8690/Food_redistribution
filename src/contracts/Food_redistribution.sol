pragma solidity ^0.5.0;

contract Food_redistribution{
    string public name;
    uint public donorCount = 0;
    uint public userCount = 0;
    Admin superAdmin; 
    mapping(uint => Donate_post) public donorPosts;
    mapping(uint => User) public users;

    struct User{
        uint userId;
        string userName;
        string Address;
        uint256[10] Phone_no;
        address user;
    }

    struct Admin{
        address payable admin;
        uint donate_tip;
    }

    struct Donate_post {
       uint id;
       string food_type;
       string food_name;
       string image;
       int latitude;
       int longitude;
       string pick_up_time_from;
       string pick_up_time_to;
       address donor;
    }

    event UserCreated(
        uint userId,
        string userName,
        string Address,
        uint256[10] phone_no,
        address user
    );

    event AdminCreated(
        address payable admin,
        uint donate_tip
    );
    
    event Tipped(
        address payable admin,
        uint donate_tip
    );

    event PostCreated(
        uint id,
        string food_type,
        string food_name,
        string image,
        int latitude,
        int longitude,
        string pick_up_time_from,
        string pick_up_time_to,
        address donor
    );

    constructor() public {
        name = "Food waste Redistribution";
    }

    function createUser(string memory _userName, string memory _Address, uint256[10] memory _phone_no) public {
        userCount++;
        users[userCount] = User(userCount, _userName, _Address, _phone_no, msg.sender);
        emit UserCreated(userCount, _userName, _Address, _phone_no, msg.sender);
    }

    function createAdmin() public {
        superAdmin =Admin(msg.sender, 0);
        emit AdminCreated(msg.sender, 0);
    }

    function tip_us() public payable{

        Admin memory _superAdmin = superAdmin;
        address payable _admin = _superAdmin.admin;
        address(_admin).transfer(msg.value);
        _superAdmin.donate_tip = _superAdmin.donate_tip+msg.value;

        superAdmin = _superAdmin;

        emit Tipped(_admin, _superAdmin.donate_tip);
    }

    function createDonorPost(string memory _food_type,string memory _food_name,string memory _image, int _latitude, int _longitude, string memory _from, string memory _to) public {
        require(bytes(_food_type).length >0);
        donorCount++;
        donorPosts[donorCount] = Donate_post(donorCount, _food_type, _food_name,_image, _latitude, _longitude, _from, _to, msg.sender);
        emit PostCreated(donorCount, _food_type, _food_name,_image, _latitude, _longitude, _from, _to, msg.sender);
    }

    function deleteDonorPost(uint _id) public{
        delete donorPosts[_id];
    }
}