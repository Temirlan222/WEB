// ===== Shalkar Contacts jQuery contribution =====
// jQuery 3.7.1 loads before this file; ready waits until Contacts HTML exists.
$(function () {
    'use strict';

    if (!$('body').hasClass('page-contacts')) return;
    const $review = $('.customer-review > .surface-panel');
    const $tools = $('.payment-information > .surface-panel');
    const $actions = $('#contact-actions');

    function safeStorageGet(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeStorageSet(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            // the feature still works when private browsing blocks storage.
        }
    }

    // rewritten feature 1: .on(), .text(), .attr() and fadeToggle replace
    // addEventListener, textContent, setAttribute and classList. It is shorter.
    const $translation = $('<p>', {
        id: 'review-translation',
        class: 'alert alert-light border mt-3',
        lang: 'en',
        text: 'Good shop with reasonable prices and kind owners.'
    }).hide();
    const $translationButton = $('<button>', {
        id: 'toggle-review',
        class: 'btn btn-outline-success btn-sm',
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': 'review-translation',
        text: 'Show English translation'
    });

    $review.find('blockquote').after($translation);
    $translationButton.insertAfter($translation);

    $translationButton.on('click', function () {
        const $button = $(this);
        const willShow = !$button.hasClass('active');

        $button
            .toggleClass('active', willShow)
            .attr('aria-expanded', String(willShow))
            .text(willShow ? 'Hide English translation' : 'Show English translation');

        $translation.stop(true, true).fadeToggle(200);
    });

    // rewritten feature 2: toggleClass, attr and text replace the old
    // classList, getAttribute/setAttribute and textContent calls.
    const $helpfulButton = $('<button>', {
        id: 'helpful-review',
        class: 'btn btn-outline-success btn-sm ms-2',
        type: 'button',
        'aria-pressed': 'false',
        text: 'Helpful 0'
    }).insertAfter($translationButton);

    function setHelpfulState(isHelpful) {
        $helpfulButton
            .toggleClass('active', isHelpful)
            .attr('aria-pressed', String(isHelpful))
            .text(isHelpful ? 'Helpful 1' : 'Helpful 0');
    }

    setHelpfulState(safeStorageGet('lido-contact-review-helpful') === 'true');

    $helpfulButton.on('click', function () {
        const isHelpful = $(this).attr('aria-pressed') !== 'true';
        setHelpfulState(isHelpful);
        safeStorageSet('lido-contact-review-helpful', String(isHelpful));
    });

    // rewritten feature 3: the button, temporary field and feedback are built
    // with jQuery instead of createElement/appendChild and a click listener.
    const $copyButton = $('<button>', {
        class: 'btn btn-outline-success btn-sm',
        type: 'button',
        'data-phone': '+77479052505',
        text: 'Copy phone number'
    }).appendTo($actions);
    const $copyStatus = $('<span>', {
        class: 'small text-success',
        role: 'status',
        'aria-live': 'polite'
    }).appendTo($actions);

    $actions.on('click', '[data-phone]', async function () {
        const $button = $(this);
        const phone = $button.attr('data-phone');
        let copied = false;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(phone);
                copied = true;
            } else {
                copied = false;
            }
        } catch (error) {
            copied = false;
        }

        $copyStatus.stop(true, true).text(copied ? 'Phone copied.' : `Copy unavailable. Call or copy this number manually: ${phone}.`).fadeIn(150);
        $button.text(copied ? 'Copied ✓' : 'Copy unavailable');
        window.setTimeout(function () {
            $button.text('Copy phone number');
        }, 1800);
    });

    let confirmedText = '';
    const topics = [
        { label: 'Product availability', subject: 'Product availability' },
        { label: 'Opening hours', subject: 'Opening hours' },
        { label: 'Payment options', subject: 'Payment options' }
    ];

    const $toolsHeading = $('<h3>', { class: 'h5 fw-bold mt-4', text: 'Ask about your visit' });
    const $toolsIntro = $('<p>', { text: 'Prepare your question for a call or visit. Validation and download stay on this device; nothing is sent to Lido.' });
    const $topicList = $('<div>', {
        id: 'contact-topic-list',
        role: 'group',
        class: 'list-group mb-3',
        'aria-label': 'Contact topics'
    });
    const $topicStatus = $('<p>', {
        id: 'topic-status',
        class: 'small text-body-secondary',
        role: 'status',
        text: 'No topic selected.'
    });
    const $formToggle = $('<button>', {
        id: 'contact-form-toggle',
        class: 'btn btn-outline-success btn-sm mb-3',
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': 'contact-form',
        text: 'Show contact form'
    });

    // the array is turned into list items with each() and appendTo(); none are in HTML.
    $(topics).each(function (index, topic) {
        $('<button>', {
            class: 'contact-topic list-group-item list-group-item-action',
            type: 'button',
            'data-subject': topic.subject,
            text: `${index + 1}. ${topic.label}`
        }).appendTo($topicList);
    });

    const $form = $(
        `<form id="contact-form" class="mt-2" novalidate>
            <div class="mb-3">
                <label class="form-label" for="contact-name">Name</label>
                <input id="contact-name" class="form-control" name="name" type="text" autocomplete="name" required>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <label class="form-label" for="contact-email">E-mail</label>
                <input id="contact-email" class="form-control" name="email" type="email" autocomplete="email" required>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <label class="form-label" for="contact-phone">Phone</label>
                <input id="contact-phone" class="form-control" name="phone" type="tel" autocomplete="tel" required>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <label class="form-label" for="contact-subject">Topic</label>
                <input id="contact-subject" class="form-control" name="subject" type="text" required>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <label class="form-label" for="contact-message">Question</label>
                <textarea id="contact-message" class="form-control" name="message" rows="3" required></textarea>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input id="contact-terms" class="form-check-input" name="terms" type="checkbox" required>
                    <label class="form-check-label" for="contact-terms">I checked that the details are correct.</label>
                </div>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <button class="btn btn-success" type="submit">Check request</button>
            <p id="contact-success" class="alert alert-success mt-3 mb-0" role="status"></p>
        </form>`
    ).hide();

    const $summary = $('<dl>').addClass('mt-3 text-break').attr('id', 'contact-summary');
    const $download = $('<button>').addClass('btn btn-outline-success mt-2').attr({id: 'contact-download', type: 'button'}).text('Download my question').prop('disabled', true);
    const $reset = $('<button>').addClass('btn btn-outline-success ms-2').attr({id: 'contact-reset', type: 'reset'}).text('Reset');
    $form.find('[type="submit"]').after($reset);
    $form.append($summary, $download);
    // error text is next to its control and also associated for assistive technology.
    $form.find('[required]').each(function () {
        const $field = $(this);
        const errorId = $field.attr('id') + '-error';
        $field.attr('aria-describedby', errorId);
        $field.closest('.mb-3').find('.invalid-feedback').attr('id', errorId);
    });
    const limits = {name: 100, email: 254, phone: 32, subject: 120, message: 1000};
    $form.find('[name]:not([type="checkbox"])').each(function () { $(this).attr('maxlength', limits[$(this).attr('name')]); });
    $form.find('#contact-success').hide();
    $tools.append($toolsHeading, $toolsIntro, $topicList, $topicStatus, $formToggle, $form);

    // this delegated handler is attached to an existing parent. Direct binding
    // to .contact-topic before the array was built would miss the new buttons.
    $tools.on('click', '.contact-topic', function () {
        const subject = $(this).attr('data-subject');

        // this chain selects the clicked topic and clears the other siblings.
        $(this)
            .addClass('active')
            .attr('aria-current', 'true')
            .siblings('.contact-topic')
            .removeClass('active')
            .removeAttr('aria-current');

        $(this).parent().siblings('#topic-status').text(`Selected topic: ${subject}.`);
        $(this).closest('.content-section').find('#contact-subject').val(subject).trigger('input');
        $form.stop(true, true).slideDown(250);
        $formToggle.addClass('active').attr('aria-expanded', 'true').text('Hide contact form');
    });

    $formToggle.on('click', function () {
        const $button = $(this);
        const willShow = !$button.hasClass('active');

        $button
            .toggleClass('active', willShow)
            .attr('aria-expanded', String(willShow))
            .text(willShow ? 'Hide contact form' : 'Show contact form');

        $form.stop(true, true).slideToggle(250);
    });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9()\s-]{10,20}$/;

    function showError($field, message) {
        $field.addClass('is-invalid').removeClass('is-valid').attr('aria-invalid', 'true');
        $field.closest('.mb-3').find('.invalid-feedback').text(message).addClass('d-block');
    }

    function clearError($field) {
        $field.removeClass('is-invalid').addClass('is-valid').removeAttr('aria-invalid');
        $field.closest('.mb-3').find('.invalid-feedback').text('').removeClass('d-block');
    }

    function validateField($field) {
        if ($field.is("[type='checkbox']")) {
            // attr('checked') is initial markup; prop('checked') is the live state.
            const checked = $field.prop('checked') && $form.find('input:checked').length > 0;
            if (!checked) {
                showError($field, 'Please confirm the details.');
                return false;
            }
            clearError($field);
            return true;
        }

        const value = $.trim($field.val());
        const name = $field.attr('name');

        if (value.length > limits[name] || (name === 'name' && value.length < 2)) {
            showError($field, name === 'name' ? 'Enter a name with 2 to 100 characters.' : 'Keep this field within ' + limits[name] + ' characters.');
            return false;
        }
        if (!value) {
            showError($field, 'This field is required.');
            return false;
        }
        if (name === 'email' && !emailPattern.test(value)) {
            showError($field, 'Enter an e-mail such as name@example.com.');
            return false;
        }

        const digitCount = value.replace(/\D/g, '').length;
        if (name === 'phone' && (!phonePattern.test(value) || digitCount < 10 || digitCount > 15)) {
            showError($field, 'Enter 10–15 digits; spaces, brackets, + and - are allowed.');
            return false;
        }

        clearError($field);
        return true;
    }

    $form.on('input change', '[required]', function () {
        confirmedText = '';
        $download.prop('disabled', true);
        $summary.empty();
        validateField($(this));
        $form.find('#contact-success').stop(true, true).fadeOut(100);
    });

    $form.on('submit', function (event) {
        // without preventDefault the browser would reload and remove our messages.
        event.preventDefault();
        let valid = true;

        $form.find('[required]:not(:disabled)').each(function () {
            if (!$(this).is('[type=checkbox]')) $(this).val(String($(this).val()).trim());
            if (!validateField($(this))) {
                valid = false;
            }
        });

        if (!valid) {
            $form.find('.is-invalid:first').trigger('focus');
            return;
        }

        const values = {};
        $form.find('[name]:not([type="checkbox"])').each(function () { values[$(this).attr('name')] = $(this).val(); });
        $form.trigger('reset');
        const rows = [['Name', values.name], ['Email', values.email], ['Phone', values.phone], ['Topic', values.subject], ['Question', values.message]];
        confirmedText = 'Question for Lido (prepared locally, not sent)\n';
        for (const row of rows) {
            $('<dt>').text(row[0]).appendTo($summary);
            $('<dd>').text(row[1]).appendTo($summary);
            confirmedText += row[0] + ': ' + row[1] + '\n';
        }
        $download.prop('disabled', false);
        $form.find('[required]').each(function () {
            $(this).removeClass('is-invalid is-valid').removeAttr('aria-invalid');
        });

        // html() is safe for this fixed developer message; visitor values always use text().
        $form.find('#contact-success')
            .stop(true, true)
            .hide()
            .html('<strong>Your question is ready.</strong> Review or download it below, then call Lido. No message was sent.')
            .fadeIn(300, function () {
                $(this).attr('tabindex', '-1').trigger('focus');
            });

        // browser validation helps visitors, but the server must repeat every check.
    });


    $form.on('reset', function () {
        confirmedText = '';
        $download.prop('disabled', true);
        $summary.empty();
        $form.find('[required]').removeClass('is-invalid is-valid').removeAttr('aria-invalid');
        $form.find('.invalid-feedback').empty().removeClass('d-block');
        $form.find('#contact-success').stop(true, true).hide().empty();
        $topicList.find('.contact-topic').removeClass('active').removeAttr('aria-current');
        $topicStatus.text('No topic selected.');
    });
    $download.on('click', function () {
        if (!confirmedText) return;
        const url = URL.createObjectURL(new Blob([confirmedText], {type: 'text/plain;charset=utf-8'}));
        const $link = $('<a>').attr({href: url, download: 'Lido-question.txt'}).appendTo($form);
        $link[0].click();
        $link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
    // the unavailable email must not lead to a draft without a recipient.
    $('#email-unavailable a').attr('href', '#contact-form').text('prepare a question below').on('click', function (event) {
        event.preventDefault();
        $form.stop(true, true).slideDown(180, function () { $('#contact-name').trigger('focus'); });
        $formToggle.addClass('active').attr('aria-expanded', 'true').text('Hide contact form');
    });


    // element selector and :first filter add a useful relationship to the schedule.
    $('table:first').attr('aria-describedby', 'hours-source');
});
