/**
 * Created by melanj.ks.ua@gmail.com on 31.08.17.
 */
var MyForm = function (fio, email, phone) {
    this.fio = fio;
    this.email = email;
    this.phone = phone;
};

MyForm.prototype.validate = function () {

    let validation = [];


    /* List of allow Domains */
    const listDomain = [
        'ya.ru',
        'yandex.ru',
        'yandex.ua',
        'yandex.by',
        'yandex.kz',
        'yandex.com'
    ];

    let fio = this.fio[0].value;
    let email = this.email[0].value;
    let phone = this.phone[0].value;

    let domain = email.replace(/.*@/, "");

    let isEmailInDomain = (listDomain.indexOf(domain) !== -1);

    let regEmail = /^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/;

    let regFio = /^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/;
    // for english FIO
    // var regFio = /^([a-zA-Z]+\s+[a-zA-Z]+\s+[a-zA-Z]+)$/;

    let regPhone = /^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/;
    let maxSumPhoneNumber = 30;


    /* erase phone from + () - */
    let phoneOnlyNumber = phone.replace(/[^0-9]/gim, '');
    let sumPhoneNumber = eval(phoneOnlyNumber.toString().replace(/\d/g, '+$&'));

    if (regFio.exec(fio)) {
        validation.push({isValid: true, errorFields: 'fio'});
    } else {
        validation.push({isValid: false, errorFields: 'fio'});
    }


    if (regEmail.exec(email) && isEmailInDomain) {
        validation.push({isValid: true, errorFields: 'email'});
    } else {
        validation.push({isValid: false, errorFields: 'email'});
    }


    if (regPhone.exec(phone) && maxSumPhoneNumber >= sumPhoneNumber) {
        validation.push({isValid: true, errorFields: 'phone'});
    } else {
        validation.push({isValid: false, errorFields: 'phone'});
    }

    return validation;
};

MyForm.prototype.getData = function () {

    return {
        fio: this.fio[0].value,
        email: this.email[0].value,
        phone: this.phone[0].value
    };

};

MyForm.prototype.setData = function (Object) {

    let status = false;

    if (Object.fio) {
        this.fio = Object.fio;
    }
    if (Object.email) {
        this.email = Object.email;
    }
    if (Object.phone) {
        this.phone = Object.phone;
    }
    return status;
};

MyForm.prototype.submit = function () {

    let statusValidate = true;

    $.each(this.validate(), function (index, value) {

        if (!value.isValid) {
            statusValidate = false;
            $("input[name='" + value.errorFields + "']").addClass('error');
        } else {
            $("input[name='" + value.errorFields + "']").removeClass('error');
        }
        console.log('v:' + value.errorFields + ' Status: ' + value.isValid);
    });

    const resultContainer = $('#resultContainer');

    if (statusValidate) {
        $('#submitButton').prop('disabled', true);

        const url = $('#myForm').prop('action');


        // send Ajax



        const xhr = new XMLHttpRequest();

        xhr.overrideMimeType("application/json");
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == "200") {

                let notProgress = true;
                let statusData = JSON.parse(xhr.responseText);


                let resultClass = '';
                let message = '';
                resultClass = statusData.status;

                if (statusData.status === 'error') {

                    message = 'Reason: ' + statusData.reason;
                }

                if (statusData.status === 'progress') {

                    let timeout = setTimeout(function () {
                        xhr.abort();
                        alert("Time over");
                    }, statusData.timeout);

                }

                resultContainer.addClass(resultClass);
                resultContainer.html(resultClass + '<br>' + message);
            }
        }

        xhr.send(null);


    } else {
        $('#submitButton').prop('disabled', false);
        resultContainer.removeClass();
        console.log(this.validate());
    }

};
