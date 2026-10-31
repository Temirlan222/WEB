// jQuery 3.7.1 full is loaded first; ready waits until the form's HTML exists.
$(function () {
    'use strict';

    // .find(), .val(), .text() and .on() replace native lookups, values, textContent and listeners.
    // The field rules are unchanged; jQuery makes the DOM updates shorter and clearer.
    const $form = $('#product-request-form');
    if (!$form.length || !window.Lido) {
        return;
    }

    const fields = [
        { key: 'name', ids: ['customer-name'], errorId: 'customer-name-error' },
        { key: 'email', ids: ['customer-email'], errorId: 'customer-email-error' },
        { key: 'phone', ids: ['customer-phone'], errorId: 'customer-phone-error' },
        { key: 'product', ids: ['product-name'], errorId: 'product-name-error' },
        { key: 'quantity', ids: ['quantity'], errorId: 'quantity-error' },
        { key: 'date', ids: ['request-date'], errorId: 'request-date-error' },
        { key: 'category', ids: ['category'], errorId: 'category-error' },
        { key: 'method', ids: ['contact-email', 'contact-phone'], errorId: 'contact-method-error' },
        { key: 'permission', ids: ['contact-permission'], errorId: 'contact-permission-error' },
        { key: 'comment', ids: ['request-comment'], errorId: 'request-comment-error' }
    ];
    const $summary = $('#request-summary');
    const $confirmation = $('#request-confirmation').prop('tabIndex', -1);
    const $errorSummary = $('#request-error');
    const $comment = $('#request-comment');
    let $counter = $('#comment-counter');
    let hasValidated = false;

    // Keep required/min/maxlength in HTML for the browser fallback when scripts are disabled.
    $form.prop('noValidate', true);
    $('#request-date').attr('min', Lido.today());
    // .html() is only for this trusted constant markup; visitor input always uses .text().
    $('#request-status').html('<strong>Demo only.</strong> JavaScript checks your entries on this page. Nothing is sent to a server, saved, or placed in the page URL. No order is created.');

    if (!$counter.length) {
        $counter = $('<small>').attr('id', 'comment-counter').addClass('small d-block');
        $comment.after($counter);
    }
    addDescription($comment, 'comment-counter');
    fields.forEach(prepareFeedback);
    showInstructions();
    hideMessage($confirmation);
    hideMessage($errorSummary);
    updateCounter();

    $form.on('submit', submitRequest);
    $form.on('input change', 'input, select, textarea', editRequest);
    $form.on('reset', resetRequest);

    function addDescription($control, id) {
        const descriptions = ($control.attr('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (!descriptions.includes(id)) {
            descriptions.push(id);
        }
        $control.attr('aria-describedby', descriptions.join(' '));
    }

    function prepareFeedback(field) {
        const $control = $('#' + field.ids[0]);
        let $feedback = $control.siblings('#' + field.errorId);
        if (!$feedback.length) {
            $feedback = $('<small>').attr('id', field.errorId).addClass('small d-block text-break');
            $control.parent().append($feedback);
        }
        $feedback.addClass('hidden').removeClass('d-block');
        field.ids.forEach(function describeField(id) {
            addDescription($('#' + id), field.errorId);
        });
    }

    function readValue(selector) {
        return String($form.find(selector).val() || '').trim();
    }

    function collectValues() {
        return {
            name: readValue('#customer-name'),
            email: readValue('#customer-email'),
            phone: readValue('#customer-phone'),
            product: readValue('#product-name'),
            quantity: readValue('#quantity'),
            date: readValue('#request-date'),
            category: readValue('#category'),
            method: readValue('input[name="contact-method"]:checked'),
            // .prop('checked') reads the live choice; .attr('checked') describes the initial markup.
            permission: $('#contact-permission').prop('checked'),
            comment: readValue('#request-comment')
        };
    }

    function updateCounter() {
        $counter.text(String($comment.val() || '').length + ' / 1000 characters');
    }

    function hideMessage($message) {
        // Cancel an obsolete effect before clearing it; no stale completion callback can reveal it.
        $message.stop(true, false).addClass('hidden').removeAttr('style').empty();
    }

    function addSummaryRow(label, value) {
        // .text() sets literal content, .addClass() applies existing classes, .appendTo() adds the row.
        $('<dt>').text(label).addClass('col-12 col-md-4').appendTo($summary);
        $('<dd>').text(value).addClass('col-12 col-md-8 text-break').appendTo($summary);
    }

    function showInstructions() {
        $summary.empty();
        addSummaryRow('Prepare a request', 'Enter your name, email, product and quantity, then choose a contact method and acknowledge the demo notice.');
        addSummaryRow('Check your details', 'Choose Check request to validate the fields and review a local summary. Nothing is sent to the shop.');
    }

    function showFeedback(errors) {
        fields.forEach(function updateField(field) {
            const $control = $('#' + field.ids[0]);
            const invalid = Boolean(errors[field.key]);
            $control.siblings('#' + field.errorId)
                .text(invalid ? 'Error: ' + errors[field.key] : 'Valid.')
                .removeClass('hidden').addClass('d-block')
                .toggleClass('error', invalid)
                .toggleClass('success', !invalid);
            field.ids.forEach(function updateControl(id) {
                $('#' + id).attr('aria-invalid', String(invalid))
                    .toggleClass('is-invalid', invalid)
                    .toggleClass('is-valid', !invalid);
            });
        });
        const messages = Object.values(errors);
        if (messages.length) {
            $errorSummary.text('Please correct ' + messages.length + ' field(s): ' + messages.join(' '))
                .removeClass('hidden');
        } else {
            hideMessage($errorSummary);
        }
    }

    function submitRequest(event) {
        // Without this, the HTML GET would reload the page and put these entries in its URL.
        event.preventDefault();
        hasValidated = true;
        const values = collectValues();
        // Browser checks never replace server validation; this demo has no server submission.
        const errors = Lido.validateRequest(values, Lido.today());
        showFeedback(errors);
        hideMessage($confirmation);

        const firstInvalid = fields.find(function findInvalid(field) {
            return Boolean(errors[field.key]);
        });
        if (firstInvalid) {
            showInstructions();
            $('#' + firstInvalid.ids[0]).trigger('focus');
            return;
        }

        const categoryLabel = $form.find('#category option:selected').text();
        // Reset only after all checks pass; captured values still build the summary afterwards.
        $(this).trigger('reset');
        $summary.empty();
        addSummaryRow('Name', values.name);
        addSummaryRow('Product', values.product);
        addSummaryRow('Quantity', values.quantity);
        addSummaryRow('Category', categoryLabel);
        addSummaryRow('Preferred date', values.date || 'Not specified');
        addSummaryRow('Email', values.email);
        if (values.phone) {
            addSummaryRow('Phone', values.phone);
        }
        addSummaryRow('Preferred contact', values.method === 'phone' ? 'Phone' : 'Email');
        addSummaryRow('Additional information', values.comment || 'None');
        $confirmation.text('Demo: your details passed the checks on this page. No data was sent to a server or the shop, and no order was created.')
            .slideDown(160, function confirmationShown() {
                $(this).removeClass('hidden').removeAttr('style').trigger('focus');
            });
    }

    function editRequest() {
        if ($(this).is('#request-comment')) {
            updateCounter();
        }
        hideMessage($confirmation);
        showInstructions();
        if (hasValidated) {
            showFeedback(Lido.validateRequest(collectValues(), Lido.today()));
        }
    }

    function resetRequest() {
        hasValidated = false;
        fields.forEach(function clearField(field) {
            $('#' + field.ids[0]).siblings('#' + field.errorId)
                .empty().addClass('hidden').removeClass('d-block error success');
            field.ids.forEach(function clearControl(id) {
                $('#' + id).removeAttr('aria-invalid').removeClass('is-invalid is-valid');
            });
        });
        hideMessage($errorSummary);
        hideMessage($confirmation);
        showInstructions();
        $counter.text('0 / 1000 characters');
    }
});
