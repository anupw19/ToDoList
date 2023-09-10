//jshint esversion:6

module.exports.getDate = getDate;

function getDate() {

 let today = new Date();

let options = {
    weekday:"long",
    day:"numeric",
    month:"long"
};

let date = today.toLocaleDateString("en-US",options);

return date;

}

module.exports.getDay = getDay;

function getDay() {

    let today = new Date();
   
   let options = {
       weekday:"long"
   };
   
   let day = today.toLocaleDateString("en-US",options);
   
   return day;
   
   }

//    console.log(module.exports)