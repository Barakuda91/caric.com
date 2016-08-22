var PageObj = {
    ajaxSendFlag: true,
    userNamePattern: /^[a-zA-Z]+$/,
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
    addErrorRegMessage: function (message, param) {
        param = (param) ? param : '';
        $('#error-reg-block').append('<div class="row">' + param + message + '</div>');
    },
    addErrorLogMessage: function (message, param) {
        param = (param) ? param : '';
        $('#error-log-block').append('<div class="row">' + param + message + '</div>');
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
    }
};

$(document).ready(function() {
    PageObj.initListeners();
    
    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
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
                        $('#loginModal').modal('hide');
                        $('#reg-username').val('');
                        $('#reg-email').val('');
                        $('#reg-password').val('');
                        $('#reg-confirm-password').val('');
                        alert('Go to personal cab');
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
                    window.location.reload(true);
                },
                complete : function () {
                    PageObj.ajaxSendFlag = true;
                }
            });
        }
    });
    
    $('#logout-user').click(function (e) {
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
   
});