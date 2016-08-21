var PageObj = {
    ajaxSendFlag: true,
    userNamePattern: /^[a-zA-Z]+$/,
    cleanErrorBlock: function () {
        $('#error-reg-block').html('');
        $('#reg-username').css('border-color', '');
        $('#reg-email').css('border-color', '');
        $('#reg-password').css('border-color', '');
        $('#reg-confirm-password').css('border-color', '');
    },
    addErrorMessage: function (message, param) {
        param = (param) ? param : '';
        $('#error-reg-block').append('<div class="row">' + param + message + '</div>');
    },
    validateRegistration: function (email, name, password, password2) {
        PageObj.cleanErrorBlock();
        var errors = 0;
        if (name.length < 4) {
            $('#reg-username').css('border-color', 'red'); 
            PageObj.addErrorMessage('Имя меньше 4 символов.');
            errors++;
        }
        if (!PageObj.userNamePattern.test(name)) {
            $('#reg-username').css('border-color', 'red'); 
            PageObj.addErrorMessage('Имя должно содержать только латинские буквы(a-z).');
            errors++;
        }
        if (!email) {
            $('#reg-email').css('border-color', 'red'); 
            PageObj.addErrorMessage('Укажите email.');
            errors++;
        }
        if (password != password2) {
            $('#reg-password').css('border-color', 'red'); 
            $('#reg-confirm-password').css('border-color', 'red'); 
            PageObj.addErrorMessage('Пароли не совпадают.');
            errors++;
        }
        if (!password) {
            $('#reg-password').css('border-color', 'red');
            PageObj.addErrorMessage('Укажите пароль.');
            errors++;
        }
        if (!password2) {
            $('#reg-confirm-password').css('border-color', 'red'); 
            PageObj.addErrorMessage('Укажите пароль.');
            errors++;
        }
        
        return errors;
    }
};

$(document).ready(function() {
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
                    PageObj.cleanErrorBlock();
                    if (result.data) {
                        for (var key in result.data) {
                            if (key === 'email') {
                                $('#reg-email').css('border-color', 'red'); 
                                PageObj.addErrorMessage(result.data[key]);
                            } else {
                                PageObj.addErrorMessage(result.data[key]);
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
   
});