function loadPet(id, petName, picture, age, breedName, location) {
  var petsRow = $('#petsRow');
  var petTemplate = $('#petTemplate');
  console.log('load pet');
  petTemplate.find('.panel-title').text(petName);
  petTemplate.find('img').attr('src', picture);
  petTemplate.find('.pet-breed').text(breedName);
  petTemplate.find('.pet-age').text(age);
  petTemplate.find('.pet-location').text(location);
  petTemplate.find('.btn-adopt').attr('data-id', id);
  petTemplate.find('.btn-vote').attr('data-id', id);
  petsRow.append(petTemplate.html());
}

function toggleForm() {
  var selector = $("#addPetsForm");
  selector[0].reset();
  selector.toggle();
}

function parseAndLoadPet(pet) {
  var [id, adopted, petName, picture, age, breedName, location] = pet;
  loadPet(id, petName, picture, age, breedName, location);
  return {
    "id": id,
    "adopted": adopted,
    "name": "petName",
    "picture": picture,
    "age": age,
    "breed": breedName,
    "location": location
  }
}

App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    await App.initWeb3();
    return
  },
  initPets: function() {
    var adoptionInstance;
    var data = [];
    console.log('get pet array');
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.getPetCount.call();
      }).then(async function(cnt) {
        for(i = 0; i<cnt; i++) {
          var result = await adoptionInstance.getPetById(i, {from: account})
          data.push(parseAndLoadPet(result));
          console.log(result);
        }
      }).then(function(){
        App.initPageHtml(data);
      }).then(function(){
        App.markAdopted();
      });
    });
    
  },

  loadPets: function(pets) {
    var [ids, adopteds, petNames, pictures, ages, breedNames, locations] = pets;
    console.log('load pets');
    for (i = 0; i < ids.length; i ++) {
      if ( i > 0 && ids[i] == 0) {
        break;
      } 
      console.log(ids[i], petNames[i], pictures[i], ages[i], breedNames[i], location[i]);
      loadPet(ids[i], petNames[i], pictures[i], ages[i], breedNames[i], location[i]);
    }
  },

  addPet: function() {
    console.log("upload pet");
    var adoptionInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        var petName = $("#name").val()
        var picture = $("#photo").val()
        var age = $("#age").val();
        var breedName = $("#breed").val()
        var location = $("#location").val()
        console.log(petName, picture, age, breedName, location);
        return adoptionInstance.addPet(petName, picture, age, breedName, location, {from: account});
      }).then(function(result) {
        console.log(result);
        return adoptionInstance.getLatestPet.call();
      }).then(function (result) {
        console.log(result);
        var [id, adopted, petName, picture, age, breedName, location] = result;
        console.log(id, adopted, petName, picture, age, breedName, location);
        loadPet(id, petName, picture, age, breedName, location);
        toggleForm();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    
  },

  initPageHtml: function (data) {
    console.log('initPageHtml', data);
    //----------------------------Initialize stats counter------------------------------------------------------
    App.contracts.Adoption.deployed().then(function (instance) {

      adoptionInstance = instance;
      return adoptionInstance.petAdotptionCount.call();
    }).then(function (result) {
      $('#total_pets_adpoted').text(result)
    }).catch(function (err) {
      console.log(err.message);
    });

    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;
      return adoptionInstance.mostAdoptedBreedId.call();
    }).then(function (result) {
      $('#most_adopted').text(result)

    }).catch(function (err) {
      console.log(err.message);
    });

    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;
      return adoptionInstance.getVote.call();
    }).then(function (result) {
      $('#most_popular').text(result)

    }).catch(function (err) {
      console.log(err.message);
    });

    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;
      return adoptionInstance.adopterCount.call();
    }).then(function (result) {
      $('#total_customer_served').text(result)

    }).catch(function (err) {
      console.log(err.message);
    });

    // $.getJSON('../pets.json', function (data) {
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;
      return adoptionInstance.adopterCount.call();
    }).then(function (result) {
      $('#total_customer_served').text(result)

    }).catch(function (err) {
      console.log(err.message);
    });
      //----------------------------Setting up filter------------------------------------------------------

      //        const [allData, setData] = useState(data);
      var breed_dropdown = $('#select-breed');
      var age_dropdown = $('#select-age');
      //     var sex-dropdown = $('#select-gender');
      var location_dropdown = $('#select-location');
      let breeds = [];
      let ages = [];
      let locations = [];
      console.log('filter',data);
      $.each(data, function (index, value) {
        console.log(index, value);
        breeds.push(value.breed);
        ages.push(value.age);
        locations.push(value.location);
      });
      breeds = Array.from(new Set(breeds));
      ages = Array.from(new Set(ages));
      locations = Array.from(new Set(locations));
      for (i = 0; i < ages.length; i++) {
        age_dropdown.append($('<option></option>').attr('value', ages[i]).text(ages[i]));
        //        console.log(age_dropdown);
      }
      for (i = 0; i < locations.length; i++) {
        location_dropdown.append($('<option></option>').attr('value', locations[i]).text(locations[i]));
        //        console.log(location_dropdown);
      }
      for (i = 0; i < breeds.length; i++) {
        breed_dropdown.append($('<option></option>').attr('value', breeds[i]).text(breeds[i]));
        //        console.log(breed_dropdown);
      }

      //     const handleFilterBreed = (breed) => {
      //        const filteredData = data.filter((item) => {
      //        if (item.breed == breed) {
      //            return item；
      //        }
      //        });
      //        setData(filteredData);
      //     }
      //      const BreedDropdown = () => {
      //        return [...new Set(data.map((item) => item.breed))];
      //      };
      //      const AgeDropdown = () => {
      //        return [...new Set(data.map((item) => item.age))];
      //      };
      //      const GenderDropdown = () => {
      //        return [...new Set(data.map((item) => item.gender))];
      //      };
      //      const LocationDropdown = () => {
      //        return [...new Set(data.map((item) => item.location))];
      //      };
      //      const handleFilterBreed = (breed) => {
      //        const filteredData = data.filter((item) => {
      //        if (item.breed === breed) {
      //        return item;
      //            }
      //        });
      //
      ////        setData(filteredData);
      //    data = filteredData;
      //    };
      //
      //      const handleFilterAge = (age) => {
      //        const filteredData = data.filter((item) => {
      //        if (item.age === age) {
      //        return item;
      //            }
      //        });
      //
      ////        setData(filteredData);
      //        data = filteredData;
      //    };
      //
      //      const handleFilterGender = (gender) => {
      //        const filteredData = data.filter((item) => {
      //        if (item.gender === gender) {
      //        return item;
      //            }
      //        });
      //
      ////        setData(filteredData);
      //      data = filteredData;
      //    };

      // //----------------------------Initialize pets------------------------------------------------------
      // var petsRow = $('#petsRow');
      // var petTemplate = $('#petTemplate');

      // //      var newArray= data.filter(function(ele){
      // //        return ele.breed == 'Scottish Terrier' && ele.age == 3 && ele.location == "Tooleville, West Virginia";
      // //      });
      // //      console.log(newArray);
      // for (i = 0; i < data.length; i++) {
      //   petTemplate.find('.panel-title').text(data[i].name);
      //   petTemplate.find('img').attr('src', data[i].picture);
      //   petTemplate.find('.pet-breed').text(data[i].breed);
      //   petTemplate.find('.pet-age').text(data[i].age);
      //   petTemplate.find('.pet-location').text(data[i].location);
      //   petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
      //   petTemplate.find('.btn-vote').attr('data-id', data[i].id);
      //   petsRow.append(petTemplate.html());
      // }
    // });

  },


  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.ajaxSetup({
      async: false
    });
    $.getJSON('Adoption.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets

    });
    App.initPets();
    return App.bindEvents();

  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '#apply-filter', App.handleFilter);
    $(document).on('click', '.btn-vote', App.handleVote);
    $(document).on('click', '#donate', App.handleDonate);
    $(document).on('click', '.btn-upload', App.addPet);
    $(document).on('click','#withdraw',App.handleWithdraw)
  },
  handleWithdraw: function(event){
    event.preventDefault();
     
      
    var adoptionInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        adoptionInstance.withdrawDonation({
           from:  account,
           
           gas:41000

       })
      
      }).then(function(error , result){
        if(!error)
            console.log(result);
        else
            console.log(error.code)
   });
    });
  },
  handleDonate: function(event){
      event.preventDefault();
     
      
      var adoptionInstance;
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
      
        var account = accounts[0];
      
        App.contracts.Adoption.deployed().then(function(instance) {
          var amount = parseInt($('#amount').val());
          adoptionInstance = instance;
          amount=web3.toWei(amount, "ether");
         
          adoptionInstance.sendTransaction({
             from:  account,
             value: amount,
             gas:41000
  
         },function(error , result){
             if(!error)
                 console.log(result);
             else
                 console.log(error.code)
        })
        
        });
      });
  
    },
    handleVote: function(event){
      event.preventDefault();
  
      var petId = parseInt($(event.target).data('id'));
  
      var adoptionInstance;
  
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
      
        var account = accounts[0];
        
        App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;
      
          // Execute adopt as a transaction by sending account
          adoptionInstance.votePet(petId, {from: account});
        })
      });
    },
  markAdopted: function (adopters, account) {
    console.log('markAdopted');
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdoptStatus.call();
    }).then(function (status) {
      for (i = 0; i < status.length; i++) {
        if (status[i]) {
          console.log('status:', status[i]);
          $('.panel-pet').eq(i).find('.btn-adopt').text('Success').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

    // var petId = parseInt($(event.target).data('id'));

    // var adoptionInstance;

    // web3.eth.getAccounts(function (error, accounts) {
    //   if (error) {
    //     console.log(error);
    //   }

    //   var account = accounts[0];

    //   App.contracts.Adoption.deployed().then(function (instance) {
    //     adoptionInstance = instance;

    //     // Execute adopt as a transaction by sending account
    //     return adoptionInstance.adoptPet(petId, { from: account });
    //   }).then(function (result) {
    //     return App.markAdopted();
    //   }).catch(function (err) {
    //     console.log(err.message);
    //   });
    // });

  handleAdopt: function (event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adoptPet(petId, { from: account });
      }).then(function (result) {
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handleFilter: function (event) {
    event.preventDefault();
    var breed = $('#select-breed').val();
    var age = $('#select-age').val();
    var sex = $('#select-gender').val();
    var location = $('#select-location').val();

    var breeds = $('.pet-breed');
    var ages = $('.pet-age');
    var sexes = $('.pet-gender');
    var locations = $('.pet-location');

    var adoptionInstance;
    var index = [];
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function (adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          index.push(i);
          console.log("Added new adopted index:", i)
        }
      }
      for (i = 0; i < breeds.length; i++) {
        console.log("current adopter", adopters[i])
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          console.log("Added new adopted index:", i)
          index.push(i);
        }
        if (breed.toLowerCase() != 'any' && breeds[i].innerHTML != breed) {
          //            console.log(i, breeds[i].innerHTML, breed)
          index.push(i);
          //            console.log('breed', index);
        }

        if (age.toLowerCase() != "any" && ages[i].innerHTML != age) {
          //            console.log(i, ages[i].innerHTML, age)
          index.push(i);
          //            console.log('Age', index);
        }

        if (location.toLowerCase() != "any" && locations[i].innerHTML != location) {
          console.log(i, locations[i].innerHTML, location);
          index.push(i);
          //            console.log(index);
        }
      }
      for (i = 0; i < index.length; i++) {
        $('div[class="col-sm-6 col-md-4 col-lg-3"]').eq(index[i]).hide();
        //           $('.panel-pet').eq(index[i]).css({display: 'none'});
      }

    });

    //    for (i = 0; i < breeds.length; i++) {
    //        console.log("current adopter", adopters[i])
    //        if (adopters[i] !== '0x0000000000000000000000000000000000000000'){
    //          console.log("Added new adopted index:", i)
    //          index.push(i);
    //        }
    //        if (breed.toLowerCase() != 'any' && breeds[i].innerHTML != breed){
    ////            console.log(i, breeds[i].innerHTML, breed)
    //            index.push(i);
    ////            console.log('breed', index);
    //        }
    //
    //        if (age.toLowerCase() != "any" && ages[i].innerHTML != age){
    ////            console.log(i, ages[i].innerHTML, age)
    //            index.push(i);
    ////            console.log('Age', index);
    //        }
    //
    //
    //        if (location.toLowerCase() != "any" && locations[i].innerHTML != location){
    //            index.push(i);
    ////            console.log(index);
    //        }
    //    }
    //    for (i = 0; i < index.length; i++){
    //         $('.panel-pet').eq(index[i]).hide();
    //    }
  },
};
$(function () {
  $(window).load(function () {
    App.init();
  });
});