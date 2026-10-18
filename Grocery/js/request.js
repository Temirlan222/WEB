'use strict';

function setupRequestForm() {
    const form = document.getElementById('product-request-form');
    if (!form || !window.Lido) {
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
    const summary = document.getElementById('request-summary');
    const confirmation = document.getElementById('request-confirmation');
    const errorSummary = document.getElementById('request-error');
    const comment = document.getElementById('request-comment');
    let counter = document.getElementById('comment-counter');
    let hasValidated = false;

    form.noValidate = true;
    document.getElementById('request-date').min = Lido.today();
    document.getElementById('request-status').textContent =
        'JavaScript checks your entries on this page. Nothing is sent to a server, saved, or placed in the page URL. No order is created.';

    if (!counter) {
        counter = Lido.makeElement('small', '', 'small d-block');
        counter.id = 'comment-counter';
        comment.insertAdjacentElement('afterend', counter);
    }
    addDescription(comment, counter.id);
    fields.forEach(prepareFeedback);
    showInstructions();
    hideMessage(confirmation);
    hideMessage(errorSummary);
    updateCounter();

    form.addEventListener('submit', submitRequest);
    form.addEventListener('input', editRequest);
    form.addEventListener('change', editRequest);
    form.addEventListener('reset', resetRequest);

    function addDescription(control, id) {
        const descriptions = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (!descriptions.includes(id)) {
            descriptions.push(id);
        }
        control.setAttribute('aria-describedby', descriptions.join(' '));
    }

    function prepareFeedback(field) {
        const feedback = document.getElementById(field.errorId) ||
            Lido.makeElement('small', '', 'small d-block text-break');
        if (!feedback.parentElement) {
            feedback.id = field.errorId;
            document.getElementById(field.ids[0]).parentElement.appendChild(feedback);
        }
        feedback.hidden = true;
        field.ids.forEach(function describeField(id) {
            addDescription(document.getElementById(id), field.errorId);
        });
    }

    function collectValues() {
        const contact = form.querySelector('input[name="contact-method"]:checked');
        return {
            name: document.getElementById('customer-name').value.trim(),
            email: document.getElementById('customer-email').value.trim(),
            phone: document.getElementById('customer-phone').value.trim(),
            product: document.getElementById('product-name').value.trim(),
            quantity: document.getElementById('quantity').value,
            date: document.getElementById('request-date').value,
            category: document.getElementById('category').value,
            method: contact ? contact.value : '',
            permission: document.getElementById('contact-permission').checked,
            comment: comment.value.trim()
        };
    }

    function updateCounter() {
        counter.textContent = comment.value.length + ' / 1000 characters';
    }

    function hideMessage(element) {
        element.textContent = '';
        element.hidden = true;
        element.classList.add('hidden');
    }

    function addSummaryRow(label, value) {
        summary.appendChild(Lido.makeElement('dt', label, 'col-12 col-md-4'));
        summary.appendChild(Lido.makeElement('dd', value, 'col-12 col-md-8 text-break'));
    }

    function showInstructions() {
        summary.replaceChildren();
        addSummaryRow('Prepare a request', 'Enter your name, email, product and quantity, then choose a contact method and acknowledge the demo notice.');
        addSummaryRow('Check your details', 'Choose Check request to validate the fields and review a local summary. Nothing is sent to the shop.');
    }

    function showFeedback(errors) {
        fields.forEach(function updateField(field) {
            const feedback = document.getElementById(field.errorId);
            const invalid = Boolean(errors[field.key]);
            feedback.textContent = invalid ? 'Error: ' + errors[field.key] : 'Valid.';
            feedback.hidden = false;
            feedback.classList.toggle('error', invalid);
            feedback.classList.toggle('success', !invalid);
            field.ids.forEach(function updateControl(id) {
                const control = document.getElementById(id);
                control.setAttribute('aria-invalid', String(invalid));
                control.classList.toggle('is-invalid', invalid);
                control.classList.toggle('is-valid', !invalid);
            });
        });
        const messages = Object.values(errors);
        if (messages.length) {
            errorSummary.textContent = 'Please correct ' + messages.length + ' field(s): ' + messages.join(' ');
            errorSummary.classList.remove('hidden');
            errorSummary.hidden = false;
        } else {
            hideMessage(errorSummary);
        }
    }

    function submitRequest(event) {
        event.preventDefault();
        hasValidated = true;
        const values = collectValues();
        const errors = Lido.validateRequest(values, Lido.today());
        showFeedback(errors);
        hideMessage(confirmation);

        const firstInvalid = fields.find(function findInvalid(field) {
            return Boolean(errors[field.key]);
        });
        if (firstInvalid) {
            showInstructions();
            document.getElementById(firstInvalid.ids[0]).focus();
            return;
        }

        summary.replaceChildren();
        addSummaryRow('Name', values.name);
        addSummaryRow('Product', values.product);
        addSummaryRow('Quantity', values.quantity);
        const category = document.getElementById('category');
        addSummaryRow('Category', category.options[category.selectedIndex].textContent);
        addSummaryRow('Preferred date', values.date || 'Not specified');
        addSummaryRow('Email', values.email);
        if (values.phone) {
            addSummaryRow('Phone', values.phone);
        }
        addSummaryRow('Preferred contact', values.method === 'phone' ? 'Phone' : 'Email');
        addSummaryRow('Additional information', values.comment || 'None');
        confirmation.textContent = 'Demo: your details passed the checks on this page. No data was sent to a server or the shop, and no order was created.';
        confirmation.classList.remove('hidden');
        confirmation.hidden = false;
    }

    function editRequest(event) {
        if (!event.target.matches('input, select, textarea')) {
            return;
        }
        updateCounter();
        hideMessage(confirmation);
        showInstructions();
        if (hasValidated) {
            showFeedback(Lido.validateRequest(collectValues(), Lido.today()));
        }
    }

    function resetRequest() {
        hasValidated = false;
        fields.forEach(function clearField(field) {
            const feedback = document.getElementById(field.errorId);
            feedback.textContent = '';
            feedback.hidden = true;
            feedback.classList.remove('error', 'success');
            field.ids.forEach(function clearControl(id) {
                const control = document.getElementById(id);
                control.removeAttribute('aria-invalid');
                control.classList.remove('is-invalid', 'is-valid');
            });
        });
        hideMessage(errorSummary);
        hideMessage(confirmation);
        showInstructions();
        counter.textContent = '0 / 1000 characters';
    }
}

setupRequestForm();
