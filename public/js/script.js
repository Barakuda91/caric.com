/**
 * Create class for bsDialog function that open bootstrap modal dialog
 *
 * @param Object | null templates - template that used for creating modal4
 * @param function | null beforeRemove - function that call before remove of modal
 * * @param Object params - {
 *   title: 'Some dialog title',
 *   content: 'Question? Here can be HTML.',
 *   buttons: {
 *     Ok: function($modal) {}, // - callback function
 *     Cancel: '' // - standard close button
 *   },
 *   closeButton: true, // close dialog button in the top right corner,
 *   size: 'md',
 *   container: 'body', // container for modal window markup
 *   backdrop: true, // true or 'static'
 *   onCloseCallback: function() {}, // will be called after closing dialog
 *   onShown: function() {}, // will be called after modal will be opened
 *   manualClosing: false // if true - modal will not be closed automatically after click on some button from 'buttons' param
 *                        // in this case you should close it manually by calling $modal.modal('hide') from your callback function
 *   checkBackgroundModal: false // boolean if true then use checkBackgroundProcess
 * }
 */
function bsDialogClass() {
    this.templates = null;
    this.beforeRemove = null;
    this.params = {};
}
bsDialogClass.prototype = {
    /* Set template for modal */
    initTemplate: function (template) {
        this.templates = template;
    },
    /* set all params that need to process modal */
    initParams: function (params) {
        var self = this;
        var params = $.extend({}, {
            title: '',
            content: '',
            buttons: {
                Ok: function ($modal) {
                },
                Cancel: ''
            },
            closeButton: true,
            size: 'md',
            container: 'body',
            backdrop: true,
            onCloseCallback: false,
            modalId: '',
            modalClass: '',
            onShown: function () {
            },
            manualClosing: false
        }, params);

        if (-1 === ['lg', 'md', 'sm'].indexOf(params.size)) {
            params.size = 'md';
        }

        self.modal = $(self.templates.base);

        // set modal id
        if (params.modalId) {
            self.modal.attr('id', params.modalId);
        }

        // set modal class
        if (params.modalClass) {
            self.modal.addClass(params.modalClass);
        }

        self.modal.find('.modal-dialog').addClass('modal-' + params.size);

        if (!params.title) {
            self.modal.find('.modal-header').remove();
        } else {
            self.modal.find('.modal-title').html(params.title);

            if (params.closeButton) {
                self.modal.find('.modal-title').before(templates.closeButton);
            }
        }

        self.modal.find('.modal-body .content').html(params.content);

        if ('function' === typeof(params.onShown)) {
            self.modal.one('shown.bs.modal', function () {
                params.onShown(self.modal);
            });
        }

        /* save whole params to object */
        self.params = params;
    },
    /* show modal */
    process: function () {
        var self = this;
        var params = self.params;
        var $modal = self.modal;
        //$backgroundModal = $backgroundModal || false;

        var buttons = [];
        $.each(params.buttons, function (title, callback) {
            var $button = $(self.templates.button).text(title);

            /* on click */
            $button.click(function () {
                /* hide modal */
                if (!params.manualClosing) {
                    $modal.modal('hide');
                }

                if ('function' === typeof(callback)) {
                    callback($modal);
                }
            });

            buttons.push($button);
        });

        $modal.find('.modal-footer').html(buttons);

        /* remove modal markup from the page after it was closed */
        $modal.one('hidden.bs.modal', function () {
            /* Before remove dialog run function beforeRemove if it is isset */
            if ('function' === typeof(self.beforeRemove)) {
                self.beforeRemove();
            }

            $modal.remove();
        });

        $(params.container).append($modal);
        $modal.modal('show');
    },
    /* show modal with check of background */
    checkBackgroundProcess: function () {
        var self = this;
        var $modal = self.modal;
        var params = self.params;
        var $backgroundModal = $('.modal:visible');
        if ($backgroundModal.length) {
            $backgroundModal.modal('hide').one('hidden.bs.modal', function () {
                self.beforeRemove = function () {
                    if ($backgroundModal) {
                        $backgroundModal.modal('show');
                    }

                    if ('function' === typeof(params.onCloseCallback)) {
                        params.onCloseCallback($modal);
                    }
                };
                self.process();
            });
        }
    }
}
/**
 * Simple alert dialog based on bsDialog function
 * Callback will be called after closing dialog
 *
 * @param data - string or object with bsDialog params
 * @param callback
 */
function bsAlert(data, callback) {
    var params = {
        content: data,
        buttons: {
            OK: callback
        },
        size: 'sm',
        closeButton: false,
        onCloseCallback: callback
    };

    if ('object' === typeof(data)) {
        delete(params.content);
        $.extend(params, data);
    }

    bsDialog(params);
}


/**
 * Simple confirm dialog with buttons "Yes" and "No"
 * If pressed "Yes" - callback will be called
 * Based on bsDialog function
 *
 * text.alternativeButtons - true can be passed to change Yes/No buttons to OK/CANCEL
 *
 * @param text - text or object with bsDialog params
 * @param yesCallback
 * @param noCallback
 */
function bsConfirm(text, yesCallback, noCallback) {
    noCallback = noCallback || false;

    var params = {
        content: text,
        buttons: {
            Да: yesCallback,
            Нет: ('function' === typeof(noCallback)) ? noCallback : 'close'
        },
        size: 'sm',
        closeButton: false
    };

    if ('object' === typeof(text)) {
        delete(params.content);

        if (text.alternativeButtons) {
            params.buttons = {
                OK: yesCallback,
                CANCEL: ('function' === typeof(noCallback)) ? noCallback : 'close'
            };
        }

        $.extend(params, text);
    }

    bsDialog(params);
}

/**
 * Create and open bootstrap modal dialog
 *
 * @param params - {
     *   title: 'Some dialog title',
     *   content: 'Question? Here can be HTML.',
     *   buttons: {
     *     Ok: function($modal) {}, // - callback function
     *     Cancel: '' // - standard close button
     *   },
     *   closeButton: true, // close dialog button in the top right corner,
     *   size: 'md',
     *   container: 'body', // container for modal window markup
     *   backdrop: true, // true or 'static'
     *   onCloseCallback: function() {}, // will be called after closing dialog
     *   onShown: function() {}, // will be called after modal will be opened
     *   manualClosing: false // if true - modal will not be closed automatically after click on some button from 'buttons' param
     *                        // in this case you should close it manually by calling $modal.modal('hide') from your callback function
     *   checkBackgroundModal: false // boolean if true then use checkBackgroundProcess
     * }
 */
function bsDialog(params) {
    var bsDialogObj = new bsDialogClass();
    bsDialogObj.initTemplate({
        base: [
            '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">',
            '<div class="modal-dialog">',
            '<div class="modal-content">',
            '<div class="modal-header">',
            '<h4 class="modal-title"></h4>',
            '</div>',
            '<div class="modal-body">',
            '<div class="content"></div>',
            '</div>',
            '<div class="modal-footer"></div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('\n'),
        closeButton: '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
        button: '<button type="button" class="btn btn-default"></button>'
    });
    bsDialogObj.initParams(params);
    /* Base process strategy */
    var processStrategy = function () {
        return bsDialogObj.process();
    };

    // there may be opened another bs modal
    // in this case we should hide it and show again after currently builded modal will be closed
    // only if we need to show it again
    if (true == params.checkBackgroundModal) {
        processStrategy = function () {
            return bsDialogObj.checkBackgroundProcess();
        }
    }

    return processStrategy();
}

var P = {
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
        P.borderCleaners();
        /* Search events */
        $(document).on('keyup', '.main_search_input', function () {
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
                P.sendSearchRequest(value);
            }
        });
        $('.subbmit-search-request').on('click',function () {
            var value = $(this).closest('div').find('input').val();
            if (value.length) {
                P.sendSearchRequest(value);
            }
        });
        /* Adverts section */
        $(document).ready(function () {
            $('select[name="type"]').change(function () {
                var value = $(this).val();
                switch (value) {
                    case '1':
                        $('div.advert-type-2').hide();
                        $('div.advert-type-1').show();
                        break;

                    case '2':
                        $('div.advert-type-1').hide();
                        $('div.advert-type-2').show();
                        break;

                    default:
                        $('div.advert-type-1').hide();
                        $('div.advert-type-2').hide();

                        break;
                }
            });
            /* подать/сохранить обьяву */
            $('button#save-advert').click(function () {
                if (P.ajaxSendFlag) {
                    P.ajaxSendFlag = false;
                    $('#form_add_advert input:visible').each(function () {
                        $(this).removeClass('errorAdvert');
                    });
                    var data = '';
                    var dataAdvertId = $('form input#advertId').val();
                    var dataSelect = $('form#form_add_advert select:visible').serialize();
                    var dataInput = $('form#form_add_advert input:visible').serialize();
                    var dataTextarea = $('form#form_add_advert textarea:visible').serialize();
                    data = 'advertId=' + dataAdvertId + '&' + dataSelect + '&' + dataInput + '&' + dataTextarea;

                    var fileList = [];
                    $('li.li-image').each(function () {
                        fileList.push($(this).attr('data-filename'));
                    })
                    data += '&uploadFiles=' + fileList.join(';');
                    $.ajax({
                        url: '/ajax',
                        data: {
                            case: 'setAdvert',
                            data: data
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (result) {
                            if (
                                'undefined' != typeof(result.status)
                                && result.status
                            ) {
                                bsAlert('Обявление успешно сохранено', function () {
                                    location.reload();
                                });
                            } else if (
                                'undefined' != typeof(result.response)
                            ) {
                                for (var key in result.response) {
                                    $('#form_add_advert input:visible').each(function () {
                                        if ($(this).attr('name') == key) {
                                            $(this).addClass('errorAdvert');
                                        }
                                    });
                                }
                            }
                        },
                        complete: function () {
                            P.ajaxSendFlag = true;
                        }
                    });
                }
            });
            /* удалить обьявление юзера */
            $('.delete-advert').click(function () {
                var advertId = $(this).data('id');
                bsConfirm(
                    'Вы точно хотите удалить обьявление?',
                    function () {
                        if (P.ajaxSendFlag) {
                            P.ajaxSendFlag = false;
                            data = 'advertId=' + advertId;
                            $.ajax({
                                url: '/ajax',
                                data: {
                                    case: 'deleteAdvert',
                                    data: data
                                },
                                type: 'post',
                                dataType: 'json',
                                success: function (result) {
                                    if (
                                        'undefined' != typeof(result.status)
                                        && result.status
                                    ) {
                                        bsAlert('Обявление успешно удалено', function () {
                                            location.reload();
                                        });
                                    }
                                },
                                complete: function () {
                                    P.ajaxSendFlag = true;
                                }
                            });
                        }
                    }
                );
            });

            /* file image upload */
            $('li.li-image').click(function (event) {
                if ($(event.target).hasClass('delete-photo')) {
                    P.deletePhoto($(event.target));
                } else {
                    if ($(this).hasClass('empty')) {
                        $('input[type="file"]').trigger('click');
                    } else {
                        P.hoverUploadImage($(this));
                    }
                }
            });


            $('input[type="file"]').change(function () {
                var selfObj = $(this);
                var editFlag = $('li.li-image.edit');
                if (editFlag.length) {
                    var editLi = {};
                    $('li.li-image').each(function () {
                        if ($(this).hasClass('edit')) {
                            editLi = $(this);
                            $('li.li-image.edit').removeClass('edit');
                        }
                    });
                    if (selfObj[0].files.length == 1) {
                        var obj = editLi.closest('li');
                        P.previewPhoto(obj, selfObj, 0);
                        P.addDeletePhotobutton(obj);
                        P.uploadFiles('input[type="file"]');
                    } else {
                        bsAlert('Пожалуйста выбереите 1 фото');
                    }
                } else {
                    if (selfObj[0].files.length <= 10) {
                        var fileCount = selfObj[0].files.length;
                        var freeLi = $('li.li-image.empty').length;
                        if (fileCount <= freeLi && fileCount <= 10) {
                            var key = 0;
                            $('li.li-image').each(function () {
                                if ($(this).hasClass('empty')) {
                                    if ('undefined' != typeof(selfObj[0].files[key])) {
                                        P.previewPhoto($(this), selfObj, key);
                                        P.addDeletePhotobutton(this);
                                        key++;
                                    }
                                }
                            });
                            P.uploadFiles('input[type="file"]');
                        } else {
                            bsAlert('Пожалуйста выберите не больше ' + freeLi + ' фото.', function () {
                            });
                        }
                    } else {
                        bsAlert('Не больше 10 фотографий', function () {
                        });
                    }
                }
            });
        });
    },
    previewPhoto: function (obj, fileObj, key) {
        var fileUrl = window.URL.createObjectURL(fileObj[0].files[key]);
        var fileName = fileObj[0].files[key].name;
        obj.removeClass('empty');
        obj.attr('data-filename', fileName);
        obj.html('<img src="" />');
        obj.find('img').attr('src', fileUrl);
        obj.addClass('added');
    },
    deletePhoto: function (obj) {
        obj.closest('li.li-image').removeClass('added');
        obj.closest('li.li-image').addClass('empty');
        obj.closest('li.li-image').attr('data-filename', '');
        obj.closest('li.li-image').html('<div><i class="fa fa-3x fa-plus"></i></div>');
    },
    addDeletePhotobutton: function (selector) {
        var hasImg = $(selector).find('img');
        if (hasImg.length) {
            $('<i class="delete-photo fa fa-2x fa-times-circle-o"></i>').insertAfter($(selector).find('img'));
        }
    },
    hoverUploadImage: function (obj) {
        obj.addClass('edit');
        $('input[type="file"]').trigger('click');
    },
    uploadFiles: function (select) {
        $(select).simpleUpload("/ajax", {
            data: {
                case: 'advertImageUpload'
            },
            start: function (file) {
                //upload started
            },
            progress: function (progress) {
                //received progress
            },
            success: function (data) {
                //upload successful
            },
            error: function (error) {
                //upload failed
                bsAlert('Произошла ошибка, файл не загружен, попробуйте еще раз.')
            }
        });
    },
    borderCleaners: function () {
        /* registration */
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
        /* Advert */
        $('#form_add_advert input').click(function () {
            $(this).removeClass('errorAdvert');
        });
    },
    sendSearchRequest: function (value) {
        if (P.ajaxSendFlag) {
            P.ajaxSendFlag = false;
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
                        var newUrl = '/search?q=' + result.searchUrl;
                        window.history.pushState({}, '', newUrl);
                        P.generateHtmlFromSearchResults(result.adverts);
                    } else {
                        console.log('NO DATA');
                    }
                },
                complete : function () {
                    P.ajaxSendFlag = true;
                }
            });
        }
    },
    generateHtmlFromSearchResults: function (adverts) {
        var templateResults = '';
        for (var key in adverts) {
            templateResults += '<div class="row">'
                + '<div class="search-results">'
                + '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 col-xxs-12" style="height: 200px;">'
                + '<img style="" class="advert-img" src="../../public/images/2.jpg" title="" alt="">'
                + '</div>'
                + '<div class="col-lg-9 col-md-8 col-sm-6 col-xs-12 col-xxs-12 search-result-h1" style="height:30px;">'
                + adverts[key].description
                + '</div>'
                + '<div class="col-lg-9 col-md-8 col-sm-6 col-xs-12 col-xxs-12 search-result-body" style="height:140px;">'
                + 'BODY ADVERT'
                + '</div>'
                + '<div class="col-lg-9 col-md-8 col-sm-6 col-xs-12 search-result-cost" style="height:30px;">'
                + 'PRICE'
                + '</div>'
                + '</div>'
                + '</div>'
            ;
        }

        $('#main_page_logos_div').hide();
        $('#search-results').html(templateResults);
        $('div.search-main-ajax-results').show();
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
        P.cleanErrorRegBlock();
        var errors = 0;
        if (name.length < 4) {
            $('#reg-username').css('border-color', 'red');
            P.addErrorRegMessage('Имя меньше 4 символов.');
            errors++;
        }
        if (!P.userNamePattern.test(name)) {
            $('#reg-username').css('border-color', 'red');
            P.addErrorRegMessage('Имя должно содержать только латинские буквы(a-z).');
            errors++;
        }
        if (!email) {
            $('#reg-email').css('border-color', 'red');
            P.addErrorRegMessage('Укажите email.');
            errors++;
        }
        if (password != password2) {
            $('#reg-password').css('border-color', 'red'); 
            $('#reg-confirm-password').css('border-color', 'red');
            P.addErrorRegMessage('Пароли не совпадают.');
            errors++;
        }
        if (!password) {
            $('#reg-password').css('border-color', 'red');
            P.addErrorRegMessage('Укажите пароль.');
            errors++;
        }
        if (!password2) {
            $('#reg-confirm-password').css('border-color', 'red');
            P.addErrorRegMessage('Укажите пароль.');
            errors++;
        }
        
        return errors;
    },
    validateAutorization: function (email, password) {
        P.cleanErrorLogBlock();
        var errors = 0;
        if (email.length < 4) {
            $('#log-email').css('border-color', 'red');
            P.addErrorLogMessage('Email меньше 4 символов.');
            errors++;
        }
        if (!password) {
            $('#log-password').css('border-color', 'red');
            P.addErrorLogMessage('Введите пароль');
            errors++;
        }
        return errors;
    },
    validateForgotPassword: function (email) {
        var errors = 0;
        if (!email) {
            $('#fog-email').css('border-color', 'red');
            P.addErrorForgetMessage('Введите email.');
            errors++;
        }
        if (email.length < 4) {
            $('#fog-email').css('border-color', 'red');
            P.addErrorForgetMessage('Email меньше 4 символов.');
            errors++;
        }
        
        return errors;
    },
    validatePersonalData: function (phone, linkVK, linkDrive) {
        var errors = 0;
        if (phone != '' && !P.userPhonePattern.test(phone)) {
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
        if (!P.userPasswordPattern.test(pass)) {
            $('#input-pass').css('border-color', 'red');
            $('#input-pass2').css('border-color', 'red');
            errors++;
        }

        return errors;
    },
    forgotPassword: function () {
        P.cleanErrorForgetBlock();
        var email = $('#fog-email').val();
        var errors = P.validateForgotPassword(email);

        if (P.ajaxSendFlag && errors == 0) {
            P.ajaxSendFlag = false;
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
                        P.cleanErrorLogBlock();
                        P.addErrorLogMessage('На указанный Вами емайл был выслан временный пароль.');

                        $('#log-email').val(email);
                        $('#log-password').val('');
                        $('#log-password').css('border-color', 'red');
                        $('#log-password').attr('placeholder', 'Введите пароль из email');
                        $('#login-form-link').trigger('click');
                        
                    } else {
                        P.addErrorForgetMessage('Введите верный email адрес.');
                    }
                },
                complete : function () {
                    P.ajaxSendFlag = true;
                }
            });
        }
    }
    
};

$(document).ready(function() {
    P.initListeners();

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
        P.forgotPassword();
    });
   
   
    $('#register-submit').click(function (e) {
        e.preventDefault();
        
        var email = $('#reg-email').val();
        var name = $('#reg-username').val();
        var password = $('#reg-password').val();
        var password2 = $('#reg-confirm-password').val();
        var errorsCount = P.validateRegistration(email, name, password, password2);

        if (P.ajaxSendFlag && errorsCount == 0) {
            P.ajaxSendFlag = false;
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
                    P.cleanErrorRegBlock();
                    if (result.data) {
                        for (var key in result.data) {
                            if (key === 'email') {
                                $('#reg-email').css('border-color', 'red');
                                P.addErrorRegMessage(result.data[key]);
                            } else {
                                P.addErrorRegMessage(result.data[key]);
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
                    P.ajaxSendFlag = true;
                }
            });
        }
    });
    
    $('#login-submit').click(function (e) {
        e.preventDefault();
        
        var email = $('#log-email').val();
        var password = $('#log-password').val();
        var errorsCount = P.validateAutorization(email, password);

        if (P.ajaxSendFlag && errorsCount == 0) {
            P.ajaxSendFlag = false;
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
                    P.cleanErrorLogBlock();
                    if (result) {
                        window.location.reload(true);
                    } else {
                        $('#log-email').css('border-color', 'red'); 
                        $('#log-password').css('border-color', 'red');
                        P.addErrorLogMessage('Неверный Логин или Пароль');
                    }
                },
                complete : function () {
                    P.ajaxSendFlag = true;
                }
            });
        }
    });
    
    $('.logout-user').click(function (e) {
        e.preventDefault();

        if (P.ajaxSendFlag) {
            P.ajaxSendFlag = false;
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
                    P.ajaxSendFlag = true;
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
       var errors = P.validatePersonalData(phone, linkVK, linkDrive);

       if (P.ajaxSendFlag && errors == 0) {
           P.ajaxSendFlag = false;
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
                   P.ajaxSendFlag = true;
               }
           });
       }
   });

   $('#save-settings-data').click(function (e) {
       e.preventDefault();
       var pass = $('#input-pass').val();
       var pass2 = $('#input-pass2').val();
       var errors = P.validateSettingData(pass, pass2);

       if (P.ajaxSendFlag && errors == 0) {
           P.ajaxSendFlag = false;
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
                   P.ajaxSendFlag = true;
               }
           });
       }
   });



});