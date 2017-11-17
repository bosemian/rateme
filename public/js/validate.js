$(document).ready(function () {
  $('#register').click(function (e) {
    e.preventDefault()
    var img = $.trim($('#upload-input').val())
    var dataArray = []
    var keyData = ['name', 'address', 'city', 'country', 'sector', 'website']

    var isValid = true
    keyData.map((item) => {
      var el = $.trim($(`#${item}`).val())
      var obj = {
        name: item,
        el: el
      }
      dataArray.push(obj)
    })
    dataArray.filter((item, i) => {
      let index = i + 1
      if (item.el === '') {
        isValid = false
        $(`#errorMsg${index}`).html(`<div class="alert alert-danger">${item.name.toUpperCase()} Field is empty</div>`)
      } else {
        $(`#errorMsg${index}`).html('')
      }
    })

    var companyData = dataArray.reduce((p, v) => {
      p[v.name] = v.el
      return p
    }, {})
    companyData.img = img
    if (isValid === true) {
      $.ajax({
        url: '/company/create',
        type: 'POST',
        data: companyData,
        success: function () {
          dataArray.forEach((item) => {
            item.el = ''
          })
        }
      })
    } else {
      return false
    }
  })
})
