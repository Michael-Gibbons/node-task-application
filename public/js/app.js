function objectifyForm(formArray) {//serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}

$("#ajaxForm").submit(function(e){
  e.preventDefault();
  var method = $(this).attr("method")
  var action = $(this).attr("action");
  var formData = objectifyForm($(this).serializeArray());
  console.log(formData)
  $.ajax({
    type: method,
    url: action,
    data: JSON.stringify(formData),
    contentType: "application/json; charset=utf-8", 
    error: function (error) {
        console.log(error);
    },
    success: function (json) {
        console.log(json);
    },
    complete: function (jqXHR, textStatus) {
        console.log(`AJAX thinks login request was a ${textStatus}`);
    }
  });
});