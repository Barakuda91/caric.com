var PageObj = {
    // Networck: {
    //    send: function (objeck)
    //    {
    //        type: 'ajsx|socket',
    //        action: 'ajax',
    //        data: {},
    //        dataType:{},
    //        preSend: : function () { },
    //        postSend : function () { },
    //        success : function () { },
    //        error : function () { },
    //    }
    // },
    ajaxSendFlag: true,
    userNamePattern: /^[a-zA-Z]+$/,
    userPhonePattern: /^[+]{0,1}[0-9]+$/,
    userPasswordPattern: /^[a-zA-Z0-9]+$/,
    initListeners: function () {
        $('#reg-email').focus(function () {
            $(this).css('border-color', '');
        });
        $('#reg-username').focus(function () {
            $(this).css('border-color', '');
        });
        $('#reg-password').focus(function () {
            $(this).css('border-color', '');
        });
        $('#reg-confirm-password').focus(function () {
            $(this).css('border-color', '');
        });
        $('#log-email').click(function () {
            $(this).css('border-color', '');
        });
        $('#log-password').click(function () {
            $(this).css('border-color', '');
        });
        $('#fog-email').click(function () {
            $(this).css('border-color', '');
        });

        /* Search events */
        $('.main_search_input').on('keyup', function () {
            var value = $(this).val();
            if (value.length) {
                $('.main_slider_wrap').addClass('hidden-search');
                $('.main_search_block').addClass('show-search')
                $('#main_search_input').focus();
                $('#main_search_input').val(value);
            }
        });
        $('#main_search_input').on('keyup',function (event) {
            var value = $(this).val();
            if (event.keyCode == 13) {
                PageObj.sendSearchRequest(value);
            }
        });
        $('.subbmit-search-request').on('click',function () {
            var value = $(this).closest('div').find('input').val();
            if (value.length) {
                PageObj.sendSearchRequest(value);
            }
        });
    },
    sendSearchRequest: function (value) {
        if (PageObj.ajaxSendFlag) {
            PageObj.ajaxSendFlag = false;
            $.ajax({
                url: '/ajax',
                data:{
                    case: 'search',
                    val: value
                },
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    if (result.status && Object.keys(result.adverts).length) {
                        $('.main-search-tips').hide();
                        PageObj.generateHtmlFromSearchResults(result.adverts);
                    } else {
                        console.log('NO DATA');
                    }
                },
                complete : function () {
                    PageObj.ajaxSendFlag = true;
                }
            });
        }
    },
    generateHtmlFromSearchResults: function (adverts) {
        var templateResults = '';
        
        $('#main_page_logos_div').hide();

    },
    cleanErrorRegBlock: function () {
        $('#error-reg-block').html('');
        $('#reg-username').css('border-color', '');
        $('#reg-email').css('border-color', '');
        $('#reg-password').css('border-color', '');
        $('#reg-confirm-password').css('border-color', '');
    },
    cleanErrorLogBlock: function () {
        $('#error-log-block').html('');
        $('#log-email').css('border-color', '');
        $('#log-password').css('border-color', '');
    },
    cleanErrorForgetBlock: function () {
        $('#error-forget-block').html('');
        $('#fog-email').css('border-color', '');
        $('#fog-password').css('border-color', '');
    },
    addErrorRegMessage: function (message, param) {
        param = (param) ? param : '';
        $('#error-reg-block').append('<div class="row">' + param + message + '</div>');
    },
    addErrorLogMessage: function (message, param) {
        param = (param) ? param : '';
        $('#error-log-block').append('<div class="row">' + param + message + '</div>');
    },
    addErrorForgetMessage: function (message, param) {
        param = (param) ? param : '';
        $('#error-forget-block').append('<div class="row">' + param + message + '</div>');
    },
    validateRegistration: function (email, name, password, password2) {
        PageObj.cleanErrorRegBlock();
        var errors = 0;
        if (name.length < 4) {
            $('#reg-username').css('border-color', 'red'); 
            PageObj.addErrorRegMessage('Имя меньше 4 символов.');
            errors++;
        }
        if (!PageObj.userNamePattern.test(name)) {
            $('#reg-username').css('border-color', 'red'); 
            PageObj.addErrorRegMessage('Имя должно содержать только латинские буквы(a-z).');
            errors++;
        }
        if (!email) {
            $('#reg-email').css('border-color', 'red'); 
            PageObj.addErrorRegMessage('Укажите email.');
            errors++;
        }
        if (password != password2) {
            $('#reg-password').css('border-color', 'red'); 
            $('#reg-confirm-password').css('border-color', 'red'); 
            PageObj.addErrorRegMessage('Пароли не совпадают.');
            errors++;
        }
        if (!password) {
            $('#reg-password').css('border-color', 'red');
            PageObj.addErrorRegMessage('Укажите пароль.');
            errors++;
        }
        if (!password2) {
            $('#reg-confirm-password').css('border-color', 'red'); 
            PageObj.addErrorRegMessage('Укажите пароль.');
            errors++;
        }
        
        return errors;
    },
    validateAutorization: function (email, password) {
        PageObj.cleanErrorLogBlock();
        var errors = 0;
        if (email.length < 4) {
            $('#log-email').css('border-color', 'red'); 
            PageObj.addErrorLogMessage('Email меньше 4 символов.');
            errors++;
        }
        if (!password) {
            $('#log-password').css('border-color', 'red'); 
            PageObj.addErrorLogMessage('Введите пароль');
            errors++;
        }
        return errors;
    },
    validateForgotPassword: function (email) {
        var errors = 0;
        if (!email) {
            $('#fog-email').css('border-color', 'red');
            PageObj.addErrorForgetMessage('Введите email.');
            errors++;
        }
        if (email.length < 4) {
            $('#fog-email').css('border-color', 'red'); 
            PageObj.addErrorForgetMessage('Email меньше 4 символов.');
            errors++;
        }
        
        return errors;
    },
    validatePersonalData: function (phone, linkVK, linkDrive) {
        var errors = 0;
        if (phone != '' && !PageObj.userPhonePattern.test(phone)) {
            $('#input-phone').css('border-color', 'red');
            errors++;
        }

        if (linkVK != '' && linkVK.indexOf('vk.com') == -1) {
            $('#input-link-vk').css('border-color', 'red');
            errors++;
        }

        if (linkDrive != '' && linkDrive.indexOf('drive2.ru') == -1) {
            $('#input-link-dr').css('border-color', 'red');
            errors++;
        }

        return errors;
    },
    validateSettingData: function (pass, pass2) {
        var errors = 0;
        if (pass == '') {
            $('#input-pass').css('border-color', 'red');
            errors++;
        }
        if (pass2 == '') {
            $('#input-pass2').css('border-color', 'red');
            errors++;
        }
        if (pass != pass2) {
            $('#input-pass').css('border-color', 'red');
            $('#input-pass2').css('border-color', 'red');
            errors++;
        }
        if (!PageObj.userPasswordPattern.test(pass)) {
            $('#input-pass').css('border-color', 'red');
            $('#input-pass2').css('border-color', 'red');
            errors++;
        }

        return errors;
    },
    forgotPassword: function () {
        PageObj.cleanErrorForgetBlock();
        var email = $('#fog-email').val();
        var errors = PageObj.validateForgotPassword(email);
        
        if (PageObj.ajaxSendFlag && errors == 0) {
            PageObj.ajaxSendFlag = false;
            $.ajax({
                url: '/ajax',
                data:{
                    case: 'forgotPassword',
                    email: email
                },
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    if (result.status) {
                        PageObj.cleanErrorLogBlock();
                        PageObj.addErrorLogMessage('На указанный Вами емайл был выслан временный пароль.');

                        $('#log-email').val(email);
                        $('#log-password').val('');
                        $('#log-password').css('border-color', 'red');
                        $('#log-password').attr('placeholder', 'Введите пароль из email');
                        $('#login-form-link').trigger('click');
                        
                    } else {
                        PageObj.addErrorForgetMessage('Введите верный email адрес.');
                    }
                },
                complete : function () {
                    PageObj.ajaxSendFlag = true;
                }
            });
        }
    }
    
};

$(document).ready(function() {
    PageObj.initListeners();

    $('#add-advert').click(function () {
        window.location.href = '/add';
    });

    $('#forgot-password-link').click(function (e) {
        e.preventDefault();
        $('#login-form').hide();
        $('#forgot-form').show();
        $('#fog-email').val('');
    });
   
    $('#login-form-link').click(function (e) {
        e.preventDefault();
        $('#forgot-form').hide();
        $("#login-form").show();
        $("#register-form").hide();
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        
    });
    $('#register-form-link').click(function (e) {
        e.preventDefault();
        $('#forgot-form').hide();
        $("#register-form").show();
        $("#login-form").hide();
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        
    });
    
    $('#forgot-submit').click(function (e) {
        e.preventDefault();
        PageObj.forgotPassword();
    });
   
   
    $('#register-submit').click(function (e) {
        e.preventDefault();
        
        var email = $('#reg-email').val();
        var name = $('#reg-username').val();
        var password = $('#reg-password').val();
        var password2 = $('#reg-confirm-password').val();
        var errorsCount = PageObj.validateRegistration(email, name, password, password2);
        
        if (PageObj.ajaxSendFlag && errorsCount == 0) {
            PageObj.ajaxSendFlag = false;
            $.ajax({
                url: '/ajax',
                data:{
                    case: 'registerUser',
                    email: email,
                    name: name,
                    password: password,
                    password2: password2,
                },
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    PageObj.cleanErrorRegBlock();
                    if (result.data) {
                        for (var key in result.data) {
                            if (key === 'email') {
                                $('#reg-email').css('border-color', 'red'); 
                                PageObj.addErrorRegMessage(result.data[key]);
                            } else {
                                PageObj.addErrorRegMessage(result.data[key]);
                            }
                        } 
                    } else {
                        $('#reg-username').val('');
                        $('#reg-email').val('');
                        $('#reg-password').val('');
                        $('#reg-confirm-password').val('');
                        /* go to login page */
                        $('#log-email').val(email);
                        $('#login-form-link').trigger('click');
                    }
                },
                complete : function () {
                    PageObj.ajaxSendFlag = true;
                }
            });
        }
    });
    
    $('#login-submit').click(function (e) {
        e.preventDefault();
        
        var email = $('#log-email').val();
        var password = $('#log-password').val();
        var errorsCount = PageObj.validateAutorization(email, password);
     
        if (PageObj.ajaxSendFlag && errorsCount == 0) {
            PageObj.ajaxSendFlag = false;
            $.ajax({
                url: '/ajax',
                data:{
                    case: 'loginUser',
                    email: email,
                    password: password
                },
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    PageObj.cleanErrorLogBlock();
                    if (result) {
                        window.location.reload(true);
                    } else {
                        $('#log-email').css('border-color', 'red'); 
                        $('#log-password').css('border-color', 'red'); 
                        PageObj.addErrorLogMessage('Неверный Логин или Пароль');
                    }
                },
                complete : function () {
                    PageObj.ajaxSendFlag = true;
                }
            });
        }
    });
    
    $('.logout-user').click(function (e) {
        e.preventDefault();
        
        if (PageObj.ajaxSendFlag) {
            PageObj.ajaxSendFlag = false;
            $.ajax({
                url: '/ajax',
                data:{
                    case: 'logoutUser',
                },
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    window.location.reload(true);
                },
                complete : function () {
                    PageObj.ajaxSendFlag = true;
                }
            });
        }
    });
    
   $('#save-personal-data').click(function (e) {
       e.preventDefault();
       var phone = $('#input-phone').val();
       var email = $('#input-email').val();
       var linkVK = $('#input-link-vk').val();
       var linkDrive = $('#input-link-dr').val();
       var errors = PageObj.validatePersonalData(phone, linkVK, linkDrive);

       if (PageObj.ajaxSendFlag && errors == 0) {
           PageObj.ajaxSendFlag = false;
           $.ajax({
               url: '/ajax',
               data:{
                   case: 'savePersonalData',
                   contactPhone: phone,
                   contactEmail: email,
                   linkVK: linkVK,
                   linkDrive: linkDrive
               },
               type: 'post',
               dataType: 'json',
               success: function (result) {
                   window.location.reload(true);
               },
               complete : function () {
                   PageObj.ajaxSendFlag = true;
               }
           });
       }
   });

   $('#save-settings-data').click(function (e) {
       e.preventDefault();
       var pass = $('#input-pass').val();
       var pass2 = $('#input-pass2').val();
       var errors = PageObj.validateSettingData(pass, pass2);

       if (PageObj.ajaxSendFlag && errors == 0) {
           PageObj.ajaxSendFlag = false;
           $.ajax({
               url: '/ajax',
               data:{
                   case: 'saveSettingsData',
                   pass: pass,
                   pass2: pass2
               },
               type: 'post',
               dataType: 'json',
               success: function (result) {
                   window.location.reload(true);
               },
               complete : function () {
                   PageObj.ajaxSendFlag = true;
               }
           });
       }
   })

});