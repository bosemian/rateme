$(document).ready(function () {
  var id = $('#receiverId').val()
  $('#message').click(function () {
    var message = $.trim($('#msg').val())
    if (message !== '') {
      $.post(`/message/${id}`, {
        message,
        id
      }, function (data) {
        $('#msg').val('')
      })
    }
  })

//   setInterval(function () {
//     $('.msg').load(location.href + '.msg')
//   }, 1000)
})
