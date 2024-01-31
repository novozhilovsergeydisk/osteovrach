$(function () {
    window.modal = {
        getModal: function (title = 'Заголовок', descr = 'Описание', modal_class = '') {
            var modal_template = `
							<div class="modal_bg">
								<div class="modal_body ${modal_class}">
									<div class="modal_close"><i class="fa fa-times"></i></div>
									<div class="modal_inner">
										<div class="modal_title">${title}</div>
										<div class="modal_descr">${descr}</div>
									</div>
								</div>
							</div>`;
            $('body').append(modal_template);
            $('body').addClass('modal2');
        },
        init: function () {
            $('body').on('click', '.modal_close', function () {
                $(this).parent().parent().remove();
                $('body').removeClass('modal2');
            });
            $('body').on('click', '.modal_body', function (e) {
                e.stopPropagation();
            });
            $('body').on('click', '.modal_bg', function (e) {
                $(this).find('.modal_close').click();
            });
        }
    };
    window.modal.init();
});