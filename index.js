const PAGE = {
  data: {
    TOKEN_API:'https://www.jevescript.com/api/qiniu-uploadtoken',
    QINIU_API: 'https://upload-z2.qiniup.com',
    UPLOAD_API :'https://www.jevescript.com/api/image-upload'
  },
  init: function() {
    this.bind();
  },
  bind: function() {
    // 2. 绑定点击按钮事件
    let button = document.getElementById('submit');
    button.addEventListener('click',this.XHRuploadImage);
  },
  XHRuploadImage: function() {
    // 3. 点击按钮判断是否有选择图片
    let files = document.getElementById('upload').files;
    let file = files[0];
    if(!file){
      console.log('缺少文件');
      return
    }

    // 4. 获取 token
    let domain;
    PAGE._XHR('GET', PAGE.data.TOKEN_API ,{},(res)=>{
      console.log(res)
      let token = res.token;
      domain = res.domain;
      let key = Date.now() + '_' + file.name;
      let formData = {};
      formData['file'] = file;
      formData['key'] = key;
      formData['fname'] = file.name;
      formData['token'] = token;
      formData['x.name'] = file.name;
      formData['form-data'] = true;

      // 5. 上传图片
      PAGE._XHR('POST',  PAGE.data.QINIU_API, formData, (res) => {
        let image_url = domain +'/' + key;
        console.log(image_url)
        // 6. 上传图片地址
        PAGE._XHR('POST',  PAGE.data.UPLOAD_API, { image_url }, (res) => {
          console.log(res)
          if(res.code === 200 ){
            console.log(image_url);
            alert('提交成功！')
          }else{
            alert('提交失败！')
          }
        })
      })
    })
  },


  _XHR:function(method, url, datas,success) {
    //服务器的网址
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
  
    let formData = new FormData();
    if(datas['form-data']){
      formData = new FormData();
      for(let key in datas){
        formData.append(key, datas[key]);
      }
      datas = formData;
    }else{
      formData = JSON.stringify(datas);
      xhr.setRequestHeader('content-type', 'application/json')
    }

    xhr.onerror = function(xhr, status, text) {
      console.log(xhr, status, text);
    };
  
    xhr.onreadystatechange = function(response) {
      if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
        typeof success === 'function' && success(JSON.parse(xhr.response))
      } else if (xhr.status != 200 && xhr.responseText) {
        console.log(xhr, xhr.status, xhr.responseText);
      }
    };
  
    xhr.send(formData);
  }
  
  //1. 封装 PAGE.\_XHR 公共请求方法
//   _XHR: function(method,url,datas,success,progress,error,csrf) {
//     let xhr = new XMLHttpRequest();
//     xhr.open(method, url, true);
//     if(csrf){
//       xhr.withCredentials = true;
//       xhr.setRequestHeader('X-CSRF-TOKEN',csrf);
//     }

//     let formData;
//     if(datas['form-data']){
//       formData = new FormData();
//       for(let key in datas){
//         formData.append(key, datas[key]);
//       }
//       datas = formData;
//     }else{
//       formData = JSON.stringify(datas);
//       xhr.setRequestHeader('content-type', 'application/json')
//     }

//     xhr.upload.onprogress = function (event) {
//       typeof progress === 'function' && progress(event);
//     };

//     xhr.onerror = function(xhr, status, text) {
//       typeof error === 'function' && error(xhr, status, text);
//     };

//     xhr.onreadystatechange = function(response) {
//       if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
//         typeof success === 'function' && success(JSON.parse(xhr.response))
//       } else if (xhr.status != 200 && xhr.responseText) {
//         typeof error === 'function' && error(xhr, xhr.status, xhr.responseText);
//       }
//     };

//     xhr.send(formData);
//   }
}

PAGE.init();