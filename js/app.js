$(function () {


    (function () {
        var app = {
            cookie: {
                set: function (name, value, days) {
                    var expires = "";
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                        expires = "; expires=" + date.toUTCString();
                    }
                    document.cookie = name + "=" + (value || "") + expires + "; path=/";
                },
                get: function (name) {
                    var nameEQ = name + "=";
                    var ca = document.cookie.split(';');
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                    }
                    return null;
                },
                remove: function (name) {
                    document.cookie = name + '=; Max-Age=-99999999;';
                }
            },
            url: {
                getParams: function (u) {
                    var url = u || window.location.search,
                        queryString = url.split('?')[1],
                        urlParams = {};
                    url = url.split('#')[0];
                    if (!queryString) {
                        if (url.search('=') !== false) {
                            queryString = url;
                        }
                    }
                    if (queryString) {
                        var keyValuePairs = queryString.split('&')
                        for (var i = 0; i < keyValuePairs.length; i++) {
                            var keyValuePair = keyValuePairs[i].split('=')
                            var paramName = keyValuePair[0]
                            var paramValue = keyValuePair[1] || ''
                            urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '));
                        }
                    }
                    return urlParams;
                }
            },
            int: function () {


                if (window.location.search == '?personal_data=2') {
                    window.location.href = "/personal-data-2/";
                }
                if (window.location.search == '?personal_data=1') {
                    window.location.href = "/personal-data-1/";
                }
                if (window.location.search == '?cookie-policy=1') {
                    window.location.href = "/cookie-policy/";
                }
                //                                var get = $.extend({}, JSON.parse(app.cookie.get('tobiz_get_params')), app.url.getParams());
                //                                app.cookie.set('tobiz_get_params', JSON.stringify(get));


                if (app.cookie.get('tobiz_enter_point') === null) {
                    app.cookie.set('tobiz_enter_point', window.location.href);
                }


            }
        };

        app.int();
        window.app = app;

    })();


    $('body').on('submit', 'form[action="handler.php"]', function (event) {
        event.preventDefault();


        var send = 1;
        if (!event.target.checkValidity()) {
            $('form input:visible[required="required"]').each(function () {
                if (!send) return false;
                if (!this.validity.valid) {
                    $(this).focus();
                    send = 0;
                }
            });
            if (!send) return;
        }


        var this_form = $(this);
        if (!$(this).children("input[name=project_id]").length)
            $(this).prepend('<input type="hidden" name="project_id" value="' + window.tobiz.project_id + '">');
        if (!$(this).children("input[name=page_id]").length)
            $(this).prepend('<input type="hidden" name="page_id" value="' + window.tobiz.rep_id + '">');
        if (!$(this).children("input[name=referrer]").length)
            $(this).prepend('<input type="hidden" name="referrer" value="' + document.referrer + '">');
        if (!$(this).children("input[name=user_id]").length)
            $(this).prepend('<input type="hidden" name="user_id" value="' + window.tobiz.user_id + '">');

        if ($(this).find("[data-action]").size()) {
            $(this).prepend('<input type="hidden" name="product_name" value="' + $(this).find("[data-product_name]").data('product_name') + '">');
            $(this).prepend('<input type="hidden" name="action" value="' + $(this).find("[data-action]").data('action') + '">');
            $(this).prepend('<input type="hidden" name="amount" value="' + $(this).find("[data-action]").data('amount') + '">');
            $(this).prepend('<input type="hidden" name="url" value="' + $(this).find("[data-action]").data('url') + '">');
        } else {
            console.log('not found');
        }

        if (typeof (VK) != 'undefined' && $(this).find("[data-vk_pixel]").size() && $(this).find("[data-vk_pixel]").data('vk_pixel') != 'undefined' && $(this).find("[data-vk_pixel]").data('vk_pixel') != '') {
            console.log('vk_pixel_event: ' + $(this).find("[data-vk_pixel]").data('vk_pixel'));
            VK.Retargeting.Event($(this).find("[data-vk_pixel]").data('vk_pixel'));
        } else {
            console.log('vk_pixel not found');
        }


        if (typeof (gtag) != 'undefined' && $(this).find("[data-gtag_event]").size() && $(this).find("[data-gtag_event]").data('gtag_event') != 'undefined' && $(this).find("[data-gtag_event]").data('gtag_event') != '') {
            console.log('gtag_event: ' + $(this).find("[data-gtag_event]").data('gtag_event'));
            gtag('event', $(this).find("[data-gtag_event]").data('gtag_event') + '');
        } else {
            console.log('gtag_event not found');
        }


        if (typeof (fbq) != 'undefined' && $(this).find("[data-fb_pixel]").size() && $(this).find("[data-fb_pixel]").data('fb_pixel') != 'undefined' && $(this).find("[data-fb_pixel]").data('fb_pixel') != '') {
            console.log('fb_pixel_event: ' + $(this).find("[data-fb_pixel]").data('fb_pixel'));
            fbq('trackCustom', $(this).find("[data-fb_pixel]").data('fb_pixel'));
        } else {
            console.log('fb_pixel not found');
        }


        var formData = new FormData($(this)[0]);
        var this_block = $(this).closest('.section');
        $.ajax({
            dataType: "json",
            type: "POST",
            url: "/handler.php",
            data: formData,
            //                            async: false,
            cache: false,
            contentType: false,
            processData: false
        }).done(function (data) {
            if (data.status == 'OK') {
                window.modal.getModal('Успех', data.msg);
                //alert(data.msg);
                this_form.each(function () {
                    $(this)[0].reset();
                })
                window.basket.clean();
                window.basket.hideForm();

                $('.popup_form').hide();
            }
            if (data.status == 'ERROR') {
                window.modal.getModal('Ошибка', data.msg);
                //alert(data.msg);
            }
            if (data.status == 'JC') {

                $('body').append(data.form);
                $('#jc_form').submit();
                this_form.each(function () {
                    $(this)[0].reset();
                })
            }

            if (data.status == 'PAYEER') {
                $('body').append(data.form);
                $('#payeer_form').submit();
                this_form.each(function () {
                    $(this)[0].reset();
                })
            }


            if (data.status == 'SR') {
                $('body').append(data.form);
                $('#sr_form').submit();
                this_form.each(function () {
                    $(this)[0].reset();
                })
            }
            if (data.status == 'GR') {
                $('body').append(data.form);
                $('#gr_form').submit();
                this_form.each(function () {
                    $(this)[0].reset();
                })
            }
            if (data.status == 'RK') {
                this_form.each(function () {
                    $(this)[0].reset();
                })
                window.location.href = data.url;
            }
            if (data.status == 'SB' || data.status == 'YooKassa') {
                this_form.each(function () {
                    $(this)[0].reset();
                })

                window.basket.clean();
                window.basket.hideForm();

                window.location.href = data.link;
            }
            if (data.status == 'INTERKASSA') {
                this_form.each(function () {
                    $(this)[0].reset();
                })
                window.location.href = data.url;
            }
            if (data.status == 'INTERKASSA') {
                this_form.each(function () {
                    $(this)[0].reset();
                })
                window.location.href = data.url;
            }

            if (data.status == 'tinkoff') {


                window.location.href = data.link;
            }


            if (data.status == 'redirect') {
                this_form.each(function () {
                    $(this)[0].reset();
                })


                window.basket.clean();
                window.basket.hideForm();
                //                                window.basket.renderForm();
                //                                window.basket.renderBtn();
                //                                window.basket.hideBtn();
                $('.popup_form').hide();

                window.location.href = data.url;
            }
            if (data.status == 'thanks') {
                this_block.find('.popup_thanks').show();
                this_form.each(function () {
                    $(this)[0].reset();
                })
                $('.popup_form').hide();
                this_block.find('.extra_info_block_wrapper').hide();
            }

            if (data.status == 'preorder_thanks') {


                $('.popup_thanks').show();
                $('.popup_form').hide();
            }

            if (data.status == 'flexThanks') {

                let thanksTitle = $('body').find('input[data-action="flexThanks"]').data('thanks_title');
                let thanksText = $('body').find('input[data-action="flexThanks"]').data('thanks_text');

                if (!thanksTitle || typeof (thanksTitle) == 'undefined') {
                    thanksTitle = 'Спасибо!';
                }
                if (!thanksText || typeof (thanksText) == 'undefined') {
                    thanksTitle = 'Сообщение успешно отправлено';
                }

                $('body').find('.modal_close').click();

                window.modal.getModal('Спасибо', 'Сообщение успешно отправлено.');
            }
            if (data.status == 'thanks_order_complete') {
                this_block.find('.popup_thanks').show();
                this_form.each(function () {
                    $(this)[0].reset();
                })
                window.basket.clean();
                window.basket.hideForm();
                window.basket.renderForm();
                window.basket.renderBtn();
                window.basket.hideBtn();
                //alert('Спасибо ваш заказ успешно оформлен!');
                $('.popup_form').hide();
                window.basket.renderThanks();
            }
            if (data.status == 'already_sent') {
                this_form.each(function () {
                    $(this)[0].reset();
                })
                $('.popup_form').hide();
                window.modal.getModal('Ошибка', data.msg);
                //alert(data.msg);
            }
        }).error(function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError)
        });
        console.log('wrf');
        return false;
    })
    $('body').on('submit', 'form.add_comment', function (event) {
        event.preventDefault();
        var this_form = $(this);
        var formData = new FormData($(this)[0]);
        var this_block = $(this).closest('.section');
        $.ajax({
            dataType: "json",
            type: "POST",
            url: "/add_comment.php",
            data: formData,
            //                            async: false,
            cache: false,
            contentType: false,
            processData: false
        }).done(function (data) {
            if (data.status == 'OK') {
                this_form.each(function () {
                    $(this)[0].reset();
                })
                window.modal.getModal('Успех', data.msg);
                //alert(data.msg);
                window.location.href = "#comments";
                window.location.reload();


            }
            if (data.status == 'ERROR') {
                window.modal.getModal('Ошибка', data.msg);
            }

        }).error(function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError)
        });
        return false;
    })


})