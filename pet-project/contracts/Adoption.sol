// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


contract Adoption{
    address public owner;

    struct Pet {
        uint id;
        uint voteCount;
        Breed breed;
        bool adopted;
        string petName; 
        string picture; 
        uint age; 
        string location;
        address adopter;
    }
    struct Breed {
        uint id;
        string breedName;
        uint adotpionCount;
    }

    uint public petCount;
    uint public breedCount;
    uint public petAdotptionCount;
    uint public mostAdoptedBreedId;
    uint public adopterCount;

    mapping(uint=>Pet) public pets;
    mapping(uint=>Breed) public breeds;
    mapping(address=>bool) public votedAddresses;
    mapping(address=>bool) public isAdopter;

    event DonationWithdrawn(uint amount);
    event PetAdopted(uint petId);
    event PetAdded(uint petId);

    constructor() {
        owner = msg.sender;
        petCount = 0;
        breedCount = 0;
        petAdotptionCount = 0;
        mostAdoptedBreedId = 0;
        adopterCount = 0;
        // init default pet
        addPet("Scrappy", "https://animalso.com/wp-content/uploads/2017/01/Golden-Retriever_6.jpg", 
            3, "Golden Retriever", "Warren, MI");
    }
    
    // // Add breed
    // function addBreed() external {
    //     require(msg.sender == owner, "Only owner allowed.");
    //     breedCount += 1;
    //     breeds[breedCount] = Breed(breedCount, 0);
    // }   

    // // Add/register pet
    // function addPet(uint _breedId) external {
    //     require(_breedId <= breedCount, "Breed does not exist.");
    //     petCount += 1;
    //     pets[petCount] = Pet(petCount, 0, breeds[_breedId], false);
    //     emit PetAdded(petCount);
    // }

    // Adopt a pet
    function adoptPet(uint _petId) external {
        require(!pets[_petId].adopted, "Pet already adopted");
        pets[_petId].adopted = true;
        breeds[pets[_petId].breed.id].adotpionCount += 1;
        petAdotptionCount += 1;
        if (breeds[pets[_petId].breed.id].adotpionCount > breeds[mostAdoptedBreedId].adotpionCount) {
            mostAdoptedBreedId = pets[_petId].breed.id;
        }
        if (!isAdopter[msg.sender]) {
            isAdopter[msg.sender] = true;
            adopterCount += 1;
        }
        emit PetAdopted(_petId);
    }

    // Vote
    function votePet(uint _petId) external {
        require(!votedAddresses[msg.sender], "Already voted.");
        require(_petId <= petCount, "Pet does not exist.");
        pets[_petId].voteCount += 1;
        votedAddresses[msg.sender] = true;
    }
    // GetVote
    function getVote() external view returns (uint) {
        uint mostPopular=0;
        for(uint p = 0; p <petCount; p++){
            if (pets[p].voteCount>pets[mostPopular].voteCount){
                mostPopular=p;
            }
        }
        return mostPopular+1;
    }
    // Withdraw donation from contract
    function withdrawDonation() external returns (bool) {
        require(msg.sender == owner, "Only owner allowed.");
        uint amount=address(this).balance;
        if (!payable(msg.sender).send(amount)) {
            return false;
        }
        emit DonationWithdrawn(amount);
        return true;
    }

    // Donate ether to petshop
    fallback() external payable{}
   
// Adopting a pet
function adopt(uint _petId) public returns (uint) {
//   require(petId >= 0 && petId <= 31);
  require(msg.sender != address(0));
  pets[_petId].adopted = true;
  pets[_petId].adopter = msg.sender;
  return _petId;
}

// Retrieving the adopters
function getAdopters() public view returns (address[] memory) {
  address[] memory adopters = new address[](petCount);
  for( uint i = 0; i < petCount; i++) {
      adopters[i] = pets[i].adopter;
  }
  return adopters;
}

function getAdoptStatus() public view returns (bool[] memory) {
  bool[] memory status = new bool[](petCount);
  for( uint i = 0; i < petCount; i++) {
      status[i] = pets[i].adopted;
  }
  return status;
}

// Add/register pet
// function addPet(bytes32 name, string memory picture, uint age, bytes32 breedName, bytes32 location) public returns (uint){
//     petCount += 1;
//     pets[petCount] = Pet(petCount, false, name, picture, age, breedName, location);
//     return petCount;
// }
function addBreedIfNeeded(string memory breedName) public returns (uint){
  // check existanse
  for (uint i = 0; i < breedCount; i++) {
      // string compare
      if (keccak256(abi.encodePacked(breeds[i].breedName)) == keccak256(abi.encodePacked(breedName))) {
          return i;
      }
  }
  // add new breed
  breeds[breedCount] = Breed(breedCount, breedName, 0);
  breedCount += 1;
  return breedCount - 1;
}


function addPet(string memory petName, string memory picture, 
        uint age, string memory breedName, string memory location) 
        public returns (uint) {
    // require(petCount >= 0 && petCount <= 31);
    uint breedId = addBreedIfNeeded(breedName);
    pets[petCount] = Pet(petCount, 0, breeds[breedId], false, petName, picture, age, location, address(0));
    petCount += 1;
    return petCount;
}

// function getPet(uint petId) public view returns (string memory){
//     return pets[petId].info;
// }

function getLatestPet() public view returns (uint, bool, string memory, 
        string memory, uint, string memory, string memory){
    if(petCount == 0){
        return (0, false, '', '', 0, '', '');
    }
    return (pets[petCount-1].id, 
            pets[petCount-1].adopted, 
            pets[petCount-1].petName, 
            pets[petCount-1].picture, 
            pets[petCount-1].age, 
            pets[petCount-1].breed.breedName, 
            pets[petCount-1].location);
}

function getPetById(uint id) public view returns (uint, bool, string memory, 
        string memory, uint, string memory, string memory){
    require(id < petCount);
    return (pets[id].id, 
            pets[id].adopted, 
            pets[id].petName, 
            pets[id].picture, 
            pets[id].age, 
            pets[id].breed.breedName, 
            pets[id].location);
}

function getPetCount() public view returns (uint) {
    return petCount;
}

function getAllPets() public view returns (uint[] memory ids, bool[] memory adopteds, string[] memory petNames, 
        string[] memory pictures, uint[] memory ages, string[] memory breedNames, string[] memory locations){
// function getAllPets() public view returns (string[32] memory){
    ids = new uint[](petCount);
    adopteds = new bool[](petCount);
    petNames = new string[](petCount);
    pictures = new string[](petCount);
    ages = new uint[](petCount);
    breedNames = new string[](petCount);
    locations = new string[](petCount);
    for(uint i = 0; i < petCount; i++) {
        string memory petName = pets[i].petName;
        string memory picture = pets[i].picture;
        string memory breedName = pets[i].breed.breedName;
        string memory location = pets[i].location;
        ids[i] = pets[i].id;
        adopteds[i] = pets[i].adopted;
        petNames[i] = petName;
        pictures[i] = picture;
        ages[i] = pets[i].age;
        breedNames[i] = breedName;
        locations[i] = location;
    }
    return (ids, adopteds, petNames, pictures, ages, breedNames, locations);
}



}