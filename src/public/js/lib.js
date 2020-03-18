function logoutUser() {
  const accessToken = Cookies.get('accessToken');
  apiLogout(accessToken)
    .done(() => {
      Cookies.remove('accessToken');
      $(location).attr('href','index.html');
    })
    .fail(err => {
      console.log(err);
      $(location).attr('href','index.html');
    });
}

function appendError(message) {
  $('#main-errors').append(`<div class="alert alert-danger"><p>${ message }</p></div>`);
}
