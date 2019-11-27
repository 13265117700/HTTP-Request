const PAGE = {
  data: {
    TOKEN_API:'https://www.jevescript.com/api/qiniu-uploadtoken',
    QINIU_API: 'http://upload-z2.qiniup.com',
  },
  init: function() {
    this.bind();
  },
  bind: function() {
    $('#submit').on('click',this.XHRuploadImage);
  },

  XHRuploadImage: function(){
    let files = $('#upload').get(0).files;
    let file = files[0];
    if(!file){
      console.log('缺少文件');
      return
    }

    $.ajax({
      type: 'GET',
      url: PAGE.data.TOKEN_API,
      success: (res) => {
        console.log(res)
        let token = res.token;
        let domain = res.domain;
        let key = Date.now() + '_' + file.name;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('key', key);
        // formData.append('fname', file.name);
        formData.append('token', token);
        // formData.append('x.name', file.name);
        $.ajax({
          type:'POST',
          url: PAGE.data.QINIU_API,
          processData:false,//防止转换字符串
          contentType:false,//停止解码
          data: formData,//获取表单

          success:(res)=>{
            alert('提交成功')
            let image_url = domain + '/' + key;
            console.log(image_url)
            let previewImg = $('#preview-img').get(0);
            previewImg.setAttribute('src',image_url);
          },
          error: (err) => {
            alert('提交失败!')
          }
        })
      }
    })
  }
}

PAGE.init();