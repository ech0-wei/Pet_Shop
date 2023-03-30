# Pet Shop Truffle Box

This box has all you need to get started with our [Pet Shop tutorial](http://truffleframework.com/tutorials/pet-shop).

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Download the box. This also takes care of installing the necessary dependencies.
    ```javascript
    truffle unbox pet-shop
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the `liteserver` development server (outside the development console) for front-end hot reloading. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run dev
    ```

**NOTE**: This box is not a complete dapp, but the starting point for the [Pet Shop tutorial](http://truffleframework.com/tutorials/pet-shop). You'll need to complete that for this to function.

## FAQ

* __How do I use this with the EthereumJS TestRPC?__

    It's as easy as modifying the config file! [Check out our documentation on adding network configurations](http://truffleframework.com/docs/advanced/configuration#networks). Depending on the port you're using, you'll also need to update line 16 of `src/js/app.js`.

## Project requirements
1. a way of adding/registering pets (and their photos*) transferred from Marketplace or somewhere else     Lan js+sol
2. a way of voting for the best pets (or liking a pet) in the Petshop DApp transferred from Elections. wei js+sol
3. a way of donating ether to the petshop transferred from Web3Basics SendMeEther, where only the petshop owner can withd raw ether wei js+sol
5. a way of filtering for a list of pets (available pets not adopted already) of a specific breed, age and location etc. [Shirley]
7. a way of keeping track of and publishing the most adopted (or most purchased) breed [Emma]
10. a way of keeping track of how many custumers have been served and how many pets adopted [Emma]

8. a way of keeping track user account info and user account transaction history
9. a way of keeping track of a pet registry that keeps track of the owner of the pet as well as other details of the pet 

4. a way of buying a pet (can be an auction) transferred from Marketplace or Web3Basics 
6. a way of filtering for a list of pets (already adopted pets) of a specific breed, age and location etc.

