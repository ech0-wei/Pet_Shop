pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
// The address of the adoption contract to be tested
 Adoption adoption = Adoption(DeployedAddresses.Adoption());

// The id of the pet that will be used for testing
 uint expectedPetId = 0;

//The expected owner of adopted pet is this contract
 address expectedAdopter = address(this);

// Testing the adopt() function
function testUserCanAdoptPet() public {
  uint returnedId = adoption.adopt(expectedPetId);

  Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
}

function testGetPetCount() public {
  uint petCnt = adoption.getPetCount();
  Assert.isAbove(petCnt, 0, "There should be more than 1 pet;");

}
}
